// ==========================================================================
// AI関連機能のモック実装。
//
// 機能要件の「1.2 AIによる検索補正」「1.3 AI検索」「3. 待ち時間予測機能」
// 「5. おすすめ検索機能」に対応する関数を、実際のLLM/予測APIを呼ばずに
// 説明可能なヒューリスティックで実装している。
//
// 将来Supabase Edge Functions等から本物のAIモデルを呼び出す場合は、
// この関数のシグネチャ（引数・戻り値）を変えずに中身だけ差し替えれば、
// 呼び出し側（services/searchService.ts, pages/*）は変更不要になる想定。
// ==========================================================================

import type { SearchFilters, SearchHistoryItem, Store, Visit } from '../types'
import { GENRE_LIST } from '../data/genres'

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

const CHEAP_HINTS = ['安い', 'リーズナブル', '節約', 'プチプラ']
const OPEN_NOW_HINTS = ['今すぐ', '今開いてる', '営業中', 'いま']

export interface AiPromptResult {
  queryText: string
  filters: Partial<SearchFilters>
}

/** 1.3 AI検索: 自然言語プロンプトから検索文字列とフィルタ条件を生成する */
export function parseAiPrompt(prompt: string): AiPromptResult {
  const normalized = correctQuery(prompt)
  const matchedGenres = GENRE_LIST.filter((genre) => normalized.includes(genre))
  const priceMax = CHEAP_HINTS.some((hint) => normalized.includes(hint)) ? 1500 : null
  const openNow = OPEN_NOW_HINTS.some((hint) => normalized.includes(hint))

  // プロンプトから抽出済みのキーワードを取り除いた残りを検索文字列として扱う。
  // 何も残らない場合はジャンル名、それも無ければプロンプト全体を使う。
  let remainder = normalized
  for (const genre of matchedGenres) remainder = remainder.split(genre).join('')
  for (const hint of [...CHEAP_HINTS, ...OPEN_NOW_HINTS]) {
    remainder = remainder.split(hint).join('')
  }
  remainder = remainder.trim()

  const queryText = remainder || matchedGenres[0] || normalized

  return {
    queryText,
    filters: {
      ...(matchedGenres.length > 0 ? { genres: matchedGenres } : {}),
      ...(priceMax !== null ? { priceMax } : {}),
      ...(openNow ? { openNow: true } : {}),
    },
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
