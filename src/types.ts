// アプリ全体で使う型定義。
// DB仕様書（specifications/DBs.md）のテーブル定義に対応させている。
// 将来Supabaseに接続する際も、この型はほぼそのまま使える想定。

export type SeatType = 'table' | 'counter'
export type IdGenerating = 'increment' | 'manual'

export interface Store {
  id: string
  name: string
  description: string
  address: string
  phone: string
  websiteUrl: string
  createdAt: string
  updatedAt: string
  openTime: string // "HH:MM"
  closeTime: string // "HH:MM"
  star: number
  priceMin: number
  priceMax: number
  storeImages: string[]
  genres: string[]
  tableAmount: number
  counterAmount: number
  idGenerating: IdGenerating
}

export interface Visit {
  id: string
  storeId: string
  groupId: number
  seatType: SeatType
  peopleCount: number
  enteredAt: string
  exitedAt: string | null
  createdAt: string
}

export interface SearchHistoryItem {
  id: string
  userId: string
  queryText: string
  createdAt: string
}

export interface UserSettings {
  language: '日本語' | 'English'
  darkMode: boolean
}

export interface SearchFilters {
  genres: string[]
  priceMax: number | null
  openNow: boolean
}

export const emptyFilters: SearchFilters = {
  genres: [],
  priceMax: null,
  openNow: false,
}

export interface StoreSearchResult {
  store: Store
  waitMinutes: number
  occupancyRate: number
}
