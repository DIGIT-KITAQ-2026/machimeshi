// ==========================================================================
// AI関連機能。
//
// 「1.3 AI検索」は src/services/claudeService.ts（Claude Agent SDK経由）を使って
// 実際にClaudeへ問い合わせる。それ以外（「1.2 AIによる検索補正」「3. 待ち時間予測機能」
// 「5. おすすめ検索機能」）は、実際のLLM/予測APIを呼ばずに説明可能なヒューリスティックで
// 実装している（将来置き換える場合も、関数のシグネチャを変えずに中身だけ差し替えれば、
// 呼び出し側は変更不要になる想定）。
// ==========================================================================

import type { SearchFilters, SearchHistoryItem, Store, Visit } from '../types'
import { GENRE_LIST } from '../data/genres'
import { askClaude } from './claudeService'

/** 表記ゆれ辞書。ひらがな/カタカナ・送り仮名の揺れを簡易的に吸収する。 */
const SYNONYMS: Array<[RegExp, string]> = [
  [/らーめん|らあめん/g, 'ラーメン'],
  [/かふぇ/g, 'カフェ'],
  [/やきにく/g, '焼肉'],
  [/すし|おすし/g, '寿司'],
  [/かれー/g, 'カレー'],
  [/ちゅうか/g, '中華'],
  [/いざかや/g, '居酒屋'],
  [/ていしょく/g, '定食'],
  [/ぱん屋|パン屋/g, 'パン・スイーツ'],
]

function toHalfWidth(text: string): string {
  return text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
  )
}

/** 1.2 AIによる検索補正: 表記ゆれ・余分な空白を補正して検索精度を上げる */
export function correctQuery(rawText: string): string {
  let text = toHalfWidth(rawText.trim()).replace(/\s+/g, ' ')
  for (const [pattern, replacement] of SYNONYMS) {
    text = text.replace(pattern, replacement)
  }
  return text
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

/** 5. おすすめ検索機能: 検索履歴の頻出ジャンルから、おすすめの検索文字列を生成する */
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
