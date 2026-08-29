// 機能要件8: 店舗アカウント認証機能。
// Supabaseセッション（匿名 or 店舗アカウント）と、ログイン中の店舗情報をアプリ全体に提供する。
//
// マウント時に一度だけセッションを確定させ（無ければ匿名サインイン）、完了するまでは
// childrenの代わりにローディング/エラー画面を表示する。これにより配下の全ページは
// 「マウントされた時点でuserIdは必ず用意されている」という前提で書ける。

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as authService from '../services/authService'
import * as storeService from '../services/storeService'
import { supabase } from '../lib/supabaseClient'
import { getErrorMessage } from '../lib/errors'
import { StoreAuthContext } from './storeAuthContextValue'
import type { StoreAuthContextValue } from './storeAuthContextValue'
import type { Store } from '../types'

export function StoreAuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [bootError, setBootError] = useState<string | null>(null)

  // 現在のSupabaseセッションからuserId/storeを再計算する共通処理。
  // signIn/register/signOut/refreshはすべてこれを呼んで状態を同期する。
  const refreshFromSession = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const uid = session?.user.id ?? null
    setUserId(uid)
    if (!uid) {
      setStore(null)
      return
    }
    const storeId = await authService.getStoreIdForUser(uid)
    setStore(storeId ? ((await storeService.getStoreById(storeId)) ?? null) : null)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await authService.ensureAnonymousUser()
        if (cancelled) return
        await refreshFromSession()
      } catch (err) {
        if (!cancelled) {
          setBootError(
            getErrorMessage(err, 'Supabaseへの接続に失敗しました'),
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refreshFromSession])

  const refresh = useCallback(() => refreshFromSession(), [refreshFromSession])

  const signIn = useCallback(
    async (email: string, password: string) => {
      await authService.signInStore(email, password)
      await refreshFromSession()
    },
    [refreshFromSession],
  )

  const register = useCallback(
    async (storeName: string, email: string, password: string) => {
      await authService.registerStore(storeName, email, password)
      await refreshFromSession()
    },
    [refreshFromSession],
  )

  const signOut = useCallback(async () => {
    await authService.signOutStore()
    // 店舗ログアウト後も検索・おすすめ機能が使えるよう、匿名セッションを再確立する。
    await authService.ensureAnonymousUser()
    await refreshFromSession()
  }, [refreshFromSession])

  const value = useMemo<StoreAuthContextValue>(
    () => ({ userId, store, isLoggedIn: store !== null, signIn, register, signOut, refresh }),
    [userId, store, signIn, register, signOut, refresh],
  )

  if (loading) {
    return (
      <div className="page-status">
        <p>読み込み中...</p>
      </div>
    )
  }

  if (bootError) {
    return (
      <div className="page-status">
        <p className="form-error">Supabaseへの接続に失敗しました: {bootError}</p>
        <p className="form__hint">
          .env の VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY を確認してください
          （supabase/README.md参照）。
        </p>
      </div>
    )
  }

  return <StoreAuthContext.Provider value={value}>{children}</StoreAuthContext.Provider>
}
