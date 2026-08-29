// Context本体だけを切り出したファイル（理由はuserSettingsContextValue.ts参照）

import { createContext } from 'react'
import type { Store } from '../types'

export interface StoreAuthContextValue {
  /** 匿名 or 実アカウントを問わず、Supabaseセッションのauth.uid。検索履歴の紐付けに使う。 */
  userId: string | null
  store: Store | null
  isLoggedIn: boolean
  signIn: (email: string, password: string) => Promise<void>
  register: (storeName: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

export const StoreAuthContext = createContext<StoreAuthContextValue | null>(null)
