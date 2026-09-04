// ==========================================================================
// AI関連機能。
//
// 「1.2 AIによる検索補正」「1.3 AI検索」「5. おすすめ検索機能（AI版）」は
// src/services/claudeService.ts（Claude Agent SDK経由）を使って実際にClaudeへ問い合わせる。
// 「3. 待ち時間予測機能」は、実際のLLM/予測APIを呼ばずに説明可能なヒューリスティックで実装している。
// 「5. おすすめ検索機能」のヒューリスティック版（getRecommendations）は、
// claude-serverが未起動の場合などにAI版（getAiRecommendations）からのフォールバック先として残している。
// ==========================================================================

import type { SearchFilters, SearchHistoryItem, Store, Visit } from '../types'
import { GENRE_LIST } from '../data/genres'
import { askClaude } from './claudeService'

function buildCorrectQueryPrompt(rawText: string): string {
  return [
    'あなたは飲食店検索アプリの検索キーワード補正アシスタントです。',
    'ユーザーが入力した検索文字列を、店舗の絞り込み検索に使える短いキーワードへ補正してください。',
    '',
    `候補となるジャンル: ${GENRE_LIST.join(', ')}`,
    '',
    '補正のルール:',
    '- 入力が上記ジャンルや料理名と意味的に同じ・近い場合は、完全一致でなくても',
    '  該当するジャンル名そのものに統一する（例:「めん類」「ラーメンとか」→「ラーメン」）',
    '- ひらがな/カタカナ・全角/半角・送り仮名の表記ゆれを吸収する',
    '- 店舗名らしき固有名詞や、ジャンルに当てはまらない語句はそのまま活かす',
    '- 意味を変えるような情報の追加・削除はしない',
    '',
    '出力は補正後のキーワードのみを1行で返してください。',
    '説明・引用符・句読点・Markdown記法は一切付けないこと。',
    '',
    `入力: "${rawText}"`,
  ].join('\n')
}

/**
 * 1.2 AIによる検索補正: 完全一致の文字列ではなく、意味が近い表現でも
 * 検索にヒットするよう、入力文字列をAI（Claude）で補正する。
 * 通常検索（services/searchService.ts の runSearch）・AI検索（parseAiPrompt経由の
 * 検索文字列）のどちらも最終的にrunSearchを通るため、この関数はその両方に効く。
 */
export async function correctQuery(rawText: string): Promise<string> {
  const trimmed = rawText.trim()
  if (!trimmed) return ''
  const response = await askClaude(buildCorrectQueryPrompt(trimmed))
  const corrected = response.trim()
  return corrected || trimmed
}

export interface AiPromptResult {
  queryText: string
  filters: Partial<SearchFilters>
}

function buildAiSearchPrompt(prompt: string): string {
  return [
    'あなたは飲食店検索アプリの検索アシスタントです。',
    'ユーザーの入力から、店舗検索に使う「検索文字列」と「フィルタ条件」をJSON形式で抽出してください。',
    '',
    `利用可能なジャンル: ${GENRE_LIST.join(', ')}`,
    '',
    '出力は必ず次の形式のJSONオブジェクトのみを返してください。',
    '説明文や前置き、Markdownのコードブロック記法（```）は一切付けないこと。',
    '{',
    '  "queryText": "検索に使う短い文字列（店名・料理名など）。無ければ空文字列",',
    '  "genres": ["該当するジャンルの配列。上記リストに含まれるものだけを使うこと。無ければ空配列"],',
    '  "priceMax": 予算の上限を表す数値（円）。指定が無ければnull,',
    '  "openNow": 「今すぐ入れる」「営業中」等、今すぐ入店したい意図があればtrue、無ければfalse',
    '}',
    '',
    `ユーザーの入力: "${prompt}"`,
  ].join('\n')
}

interface RawAiSearchResponse {
  queryText?: unknown
  genres?: unknown
  priceMax?: unknown
  openNow?: unknown
}

/** Claudeの応答テキストからJSON部分を取り出してパースする（```json ... ```で囲まれて返る場合に備える） */
function parseAiSearchResponse(text: string): AiPromptResult {
  const stripped = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  const raw = JSON.parse(stripped) as RawAiSearchResponse
  const knownGenres: readonly string[] = GENRE_LIST

  const genres = Array.isArray(raw.genres)
    ? raw.genres.filter((g): g is string => typeof g === 'string' && knownGenres.includes(g))
    : []
  const priceMax =
    typeof raw.priceMax === 'number' && Number.isFinite(raw.priceMax) ? raw.priceMax : null
  const openNow = raw.openNow === true
  const rawQueryText = typeof raw.queryText === 'string' ? raw.queryText.trim() : ''
  const queryText = rawQueryText || genres[0] || ''

  return {
    queryText,
    filters: {
      ...(genres.length > 0 ? { genres } : {}),
      ...(priceMax !== null ? { priceMax } : {}),
      ...(openNow ? { openNow: true } : {}),
    },
  }
}

/**
 * 1.3 AI検索: 自然言語プロンプトから検索文字列とフィルタ条件を生成する。
 * Claude Agent SDK（src/services/claudeService.ts、ローカルのclaude-server経由）に問い合わせる。
 * `npm run claude-server` が起動していない場合はエラーを投げるので、呼び出し元で表示すること。
 */
export async function parseAiPrompt(prompt: string): Promise<AiPromptResult> {
  const response = await askClaude(buildAiSearchPrompt(prompt))
  try {
    return parseAiSearchResponse(response)
  } catch {
    throw new Error('Claudeの応答を解析できませんでした')
  }
}

export interface WaitPrediction {
  waitMinutes: number
  occupancyRate: number
}

/**
 * 3. 待ち時間予測機能
 * 店舗の卓数/カウンター数（=同時に案内できる組数の目安）に対する在店中グループ数の割合と、
 * 直近に退店したグループの平均滞在時間から、現在の待ち時間を簡易推定する。
 */
export function predictWaitMinutes(store: Store, visits: Visit[], now: Date): WaitPrediction {
  const capacity = Math.max(1, store.tableAmount + store.counterAmount)
  const activeVisits = visits.filter((v) => v.storeId === store.id && v.exitedAt === null)
  const occupied = activeVisits.length
  const occupancyRate = Math.min(1, occupied / capacity)

  const recentExited = visits
    .filter((v) => v.storeId === store.id && v.exitedAt !== null)
    .sort((a, b) => new Date(b.exitedAt!).getTime() - new Date(a.exitedAt!).getTime())
    .slice(0, 5)

  const durationsMinutes = recentExited.map(
    (v) => (new Date(v.exitedAt!).getTime() - new Date(v.enteredAt).getTime()) / 60000,
  )
  const avgTurnoverMinutes =
    durationsMinutes.length > 0
      ? durationsMinutes.reduce((sum, m) => sum + m, 0) / durationsMinutes.length
      : 30

  let waitMinutes = 0
  if (occupancyRate >= 1) {
    const overflow = occupied - capacity + 1
    waitMinutes = Math.round(avgTurnoverMinutes * overflow * 0.5)
  } else if (occupancyRate >= 0.7) {
    waitMinutes = Math.round(avgTurnoverMinutes * (occupancyRate - 0.6))
  }

  void now // 将来、営業時間外や時間帯係数を加味する際に利用する想定のため引数として残す
  return { waitMinutes: Math.max(0, waitMinutes), occupancyRate }
}

const DEFAULT_RECOMMENDATIONS = ['今すぐ入れるラーメン店', 'コスパ重視の定食屋', '今日はご褒美に焼肉']

/** 5. おすすめ検索機能（ヒューリスティック版）: 検索履歴の頻出ジャンルから、おすすめの検索文字列を生成する */
export function getRecommendations(history: SearchHistoryItem[]): string[] {
  const genreCount = new Map<string, number>()
  for (const item of history) {
    for (const genre of GENRE_LIST) {
      if (item.queryText.includes(genre)) {
        genreCount.set(genre, (genreCount.get(genre) ?? 0) + 1)
      }
    }
  }

  const topGenres = [...genreCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([genre]) => genre)
    .slice(0, 2)

  if (topGenres.length === 0) return DEFAULT_RECOMMENDATIONS

  const suggestions = topGenres.flatMap((genre) => [
    `${genre}で今空いてるお店`,
    `安い${genre}`,
  ])
  return [...new Set(suggestions)].slice(0, 4)
}

function buildRecommendationPrompt(history: SearchHistoryItem[], now: Date): string {
  const recentQueries = history
    .slice(-10)
    .map((item) => item.queryText.trim())
    .filter(Boolean)
  const hour = now.getHours()
  const timeHint = hour < 11 ? '朝' : hour < 14 ? '昼' : hour < 17 ? '午後' : '夜'

  return [
    'あなたは飲食店検索アプリの「おすすめ」提案アシスタントです。',
    'ユーザーの検索履歴と現在の時間帯から、その人が今検索したくなりそうな',
    '検索キーワードを4つ提案してください。',
    '',
    `利用可能なジャンル: ${GENRE_LIST.join(', ')}`,
    `現在の時間帯: ${timeHint}`,
    recentQueries.length > 0
      ? `直近の検索履歴（入力順）: ${recentQueries.join(' / ')}`
      : '検索履歴はまだありません。時間帯に合わせた一般的な提案をしてください。',
    '',
    '提案のルール:',
    '- 各提案は「ラーメンで今空いてるお店」のように、そのまま検索欄に入力できる短い文にする',
    '- 検索履歴がある場合は、頻出するジャンルや傾向を踏まえた提案を優先する',
    '- 4件とも異なる提案にする',
    '',
    '出力は必ず次の形式のJSON配列のみを返してください。',
    '説明文や前置き、Markdownのコードブロック記法（```）は一切付けないこと。',
    '["提案1", "提案2", "提案3", "提案4"]',
  ].join('\n')
}

/** Claudeの応答テキストからJSON配列部分を取り出してパースする（```json ... ```で囲まれて返る場合に備える） */
function parseRecommendationResponse(text: string): string[] {
  const stripped = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  const raw = JSON.parse(stripped) as unknown
  if (!Array.isArray(raw)) throw new Error('おすすめ提案の形式が不正です')

  const suggestions = raw
    .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
    .map((s) => s.trim())
  if (suggestions.length === 0) throw new Error('おすすめ提案が空でした')

  return [...new Set(suggestions)].slice(0, 4)
}

/**
 * 5. おすすめ検索機能（AI版）: 検索履歴と現在時刻から、Claudeにおすすめの検索文字列を提案してもらう。
 * claude-serverが未起動、または応答の解析に失敗した場合は、ヒューリスティック版（getRecommendations）に
 * フォールバックする（おすすめは付加的な機能のため、エラーを投げて画面をブロックしない）。
 */
export async function getAiRecommendations(
  history: SearchHistoryItem[],
  now: Date = new Date(),
): Promise<string[]> {
  try {
    const response = await askClaude(buildRecommendationPrompt(history, now))
    return parseRecommendationResponse(response)
  } catch {
    return getRecommendations(history)
  }
}
