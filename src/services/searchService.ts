// 店舗検索（機能要件1・2）、フィルタ（機能要件4）、検索履歴（機能要件5で使用）。
// 検索履歴はSupabaseの`search_history`テーブル（specifications/DBs.md参照）。

import { supabase } from '../lib/supabaseClient'
import { correctQuery, predictWaitMinutes } from './aiService'
import { getAllVisits } from './visitService'
import { getStores } from './storeService'
import type { Database } from '../types/database'
import type { SearchFilters, SearchHistoryItem, StoreSearchResult } from '../types'

type SearchHistoryRow = Database['public']['Tables']['search_history']['Row']

function mapSearchHistoryRow(row: SearchHistoryRow): SearchHistoryItem {
  return {
    id: row.id,
    userId: row.user_id,
    queryText: row.query_text,
    createdAt: row.created_at,
  }
}

/**
 * 1.1 通常検索 / 1.2 AIによる検索補正 / 2. 店舗情報取得機能 / 3. 待ち時間予測機能
 *
 * 検索文字列をAIで補正した上で店舗名・ジャンル・説明文に対して部分一致検索し、
 * 該当した店舗の待ち時間を予測して待ち時間の短い順に並べ替える。
 * フィルタは含めず、フィルタ適用は applySearchFilters() で別途行う（機能要件4）。
 */
export async function runSearch(queryText: string): Promise<StoreSearchResult[]> {
  const [corrected, stores, visits] = await Promise.all([
    correctQuery(queryText),
    getStores(),
    getAllVisits(),
  ])
  const now = new Date()

  const matched = corrected
    ? stores.filter(
        (store) =>
          store.name.includes(corrected) ||
          store.description.includes(corrected) ||
          store.genres.some((g) => g.includes(corrected) || corrected.includes(g)),
      )
    : stores

  const results: StoreSearchResult[] = matched.map((store) => {
    const { waitMinutes, occupancyRate } = predictWaitMinutes(store, visits, now)
    return { store, waitMinutes, occupancyRate }
  })

  return results.sort((a, b) => a.waitMinutes - b.waitMinutes)
}

function isOpenNow(openTime: string, closeTime: string, now: Date): boolean {
  const [oh, om] = openTime.split(':').map(Number)
  const [ch, cm] = closeTime.split(':').map(Number)
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  const openMinutes = oh * 60 + om
  let closeMinutes = ch * 60 + cm
  if (closeMinutes <= openMinutes) closeMinutes += 24 * 60 // 深夜営業（日付をまたぐ）対応
  return minutesNow >= openMinutes && minutesNow <= closeMinutes
}

/** 4. フィルタ機能: 検索を再実行せず、既存の検索結果に対してのみフィルタリングする */
export function applySearchFilters(
  results: StoreSearchResult[],
  filters: SearchFilters,
): StoreSearchResult[] {
  const now = new Date()
  return results.filter(({ store }) => {
    if (filters.genres.length > 0 && !filters.genres.some((g) => store.genres.includes(g))) {
      return false
    }
    if (filters.priceMax !== null && store.priceMin > filters.priceMax) {
      return false
    }
    if (filters.openNow && !isOpenNow(store.openTime, store.closeTime, now)) {
      return false
    }
    return true
  })
}

export async function getSearchHistory(userId: string): Promise<SearchHistoryItem[]> {
  const { data, error } = await supabase
    .from('search_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapSearchHistoryRow)
}

export async function addSearchHistory(userId: string, queryText: string): Promise<void> {
  if (!queryText.trim()) return
  const { error } = await supabase
    .from('search_history')
    .insert({ user_id: userId, query_text: queryText })
  if (error) throw error
}
