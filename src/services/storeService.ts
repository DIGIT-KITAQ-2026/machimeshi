// 店舗情報の取得・更新・作成（Supabaseの`stores`テーブル。specifications/DBs.md参照）。

import { supabase } from '../lib/supabaseClient'
import type { Database } from '../types/database'
import type { IdGenerating, Store } from '../types'

type StoreRow = Database['public']['Tables']['stores']['Row']

/** SupabaseのPostgres `time`型は"17:00:00"の形で返るため、表示・入力で使う"HH:MM"に揃える */
function toHm(time: string): string {
  return time.slice(0, 5)
}

function mapStoreRow(row: StoreRow): Store {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    address: row.address ?? '',
    phone: row.phone ?? '',
    websiteUrl: row.website_url ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    openTime: row.open_time ? toHm(row.open_time) : '00:00',
    closeTime: row.close_time ? toHm(row.close_time) : '00:00',
    star: row.star ?? 0,
    priceMin: row.price_min ?? 0,
    priceMax: row.price_max ?? 0,
    storeImages: row.store_images ?? [],
    genres: row.genres ?? [],
    tableAmount: row.table_amount ?? 0,
    counterAmount: row.counter_amount ?? 0,
    idGenerating: row.id_generating,
  }
}

export async function getStores(): Promise<Store[]> {
  const { data, error } = await supabase.from('stores').select('*')
  if (error) throw error
  return (data ?? []).map(mapStoreRow)
}

export async function getStoreById(id: string): Promise<Store | undefined> {
  const { data, error } = await supabase.from('stores').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? mapStoreRow(data) : undefined
}

/** 8.2 店舗登録: 新しい店舗を作成する（設定は後で画面5から入力する前提の最小値） */
export async function createStore(name: string): Promise<Store> {
  const { data, error } = await supabase.from('stores').insert({ name }).select().single()
  if (error) throw error
  return mapStoreRow(data)
}

export interface StoreSettingsInput {
  name: string
  description: string
  address: string
  phone: string
  websiteUrl: string
  priceMin: number
  priceMax: number
  openTime: string
  closeTime: string
  genres: string[]
  storeImages: string[]
  tableAmount: number
  counterAmount: number
  idGenerating: IdGenerating
}

/** 11. 店舗設定機能: 店舗設定を更新する */
export async function updateStoreSettings(id: string, input: StoreSettingsInput): Promise<Store> {
  const { data, error } = await supabase
    .from('stores')
    .update({
      name: input.name,
      description: input.description,
      address: input.address,
      phone: input.phone,
      website_url: input.websiteUrl,
      price_min: input.priceMin,
      price_max: input.priceMax,
      open_time: input.openTime,
      close_time: input.closeTime,
      genres: input.genres,
      store_images: input.storeImages,
      table_amount: input.tableAmount,
      counter_amount: input.counterAmount,
      id_generating: input.idGenerating,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return mapStoreRow(data)
}
