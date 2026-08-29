// 入退店（入店管理機能9・退店管理機能10）。Supabaseの`visits`テーブル（specifications/DBs.md参照）。
// 「同一店舗内で未退店のgroup_idの重複を防止」制約はDB側のユニークインデックス
// （visits_active_group_id_unique。supabase/schema.sql参照）でも保証されている。

import { supabase } from '../lib/supabaseClient'
import type { Database } from '../types/database'
import type { SeatType, Visit } from '../types'

type VisitRow = Database['public']['Tables']['visits']['Row']

function mapVisitRow(row: VisitRow): Visit {
  return {
    id: row.id,
    storeId: row.store_id,
    groupId: row.group_id,
    seatType: row.seat_type,
    peopleCount: row.people_count,
    enteredAt: row.entered_at,
    exitedAt: row.exited_at,
    createdAt: row.created_at,
  }
}

const DUPLICATE_GROUP_ID_MESSAGE =
  'このグループIDは既に入店中です。別のグループIDを指定してください。'

/**
 * 全店舗の入退店データ。待ち時間予測（機能要件3）で店舗ごとの在店状況・回転率を
 * 計算するために使う。個人情報を含まないためRLSで誰でも閲覧可能にしている。
 */
export async function getAllVisits(): Promise<Visit[]> {
  const { data, error } = await supabase.from('visits').select('*')
  if (error) throw error
  return (data ?? []).map(mapVisitRow)
}

/** 10. 店舗退店管理機能: 現在入店中で退店処理が完了していないグループ */
export async function getActiveGroups(storeId: string): Promise<Visit[]> {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('store_id', storeId)
    .is('exited_at', null)
    .order('entered_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapVisitRow)
}

/** 店舗設定のグループID生成方式が「increment」の場合の次の番号を算出する */
export async function suggestNextGroupId(storeId: string): Promise<number> {
  const { data, error } = await supabase
    .from('visits')
    .select('group_id')
    .eq('store_id', storeId)
    .order('group_id', { ascending: false })
    .limit(1)
  if (error) throw error
  return data && data.length > 0 ? data[0].group_id + 1 : 1
}

/** 9. 店舗入店管理機能 */
export async function enterGuest(
  storeId: string,
  seatType: SeatType,
  peopleCount: number,
  groupId: number,
): Promise<Visit> {
  const { data: existing, error: checkError } = await supabase
    .from('visits')
    .select('id')
    .eq('store_id', storeId)
    .eq('group_id', groupId)
    .is('exited_at', null)
    .maybeSingle()
  if (checkError) throw checkError
  if (existing) throw new Error(DUPLICATE_GROUP_ID_MESSAGE)

  const { data, error } = await supabase
    .from('visits')
    .insert({ store_id: storeId, group_id: groupId, seat_type: seatType, people_count: peopleCount })
    .select()
    .single()
  if (error) {
    // 事前チェックとの競合（ほぼ同時に同じグループIDで入店した等）に備え、
    // DBのユニーク制約違反(23505)もフォールバックとして同じメッセージにする。
    if (error.code === '23505') throw new Error(DUPLICATE_GROUP_ID_MESSAGE)
    throw error
  }
  return mapVisitRow(data)
}

/** 10. 店舗退店管理機能 */
export async function exitGuest(visitId: string): Promise<Visit> {
  const { data, error } = await supabase
    .from('visits')
    .update({ exited_at: new Date().toISOString() })
    .eq('id', visitId)
    .select()
    .single()
  if (error) throw error
  return mapVisitRow(data)
}
