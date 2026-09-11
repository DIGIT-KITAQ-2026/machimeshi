// 機能要件8「店舗アカウント認証機能」。Supabase Authを使用する。
//
// 一般ユーザー（ログイン画面を使わない検索利用者）はSupabaseの匿名認証(anonymous sign-in)で
// auth.usersに行を持ち、そのidをpublic.users.idに紐付ける（specifications/DBs.md参照）。
// 店舗管理者はメール・パスワードでの本登録により、同じusersテーブルにstore_id付きで登録される。
//
// public.usersの行そのものは、Supabase側のトリガー(handle_new_auth_user。supabase/schema.sql参照)が
// 新規auth.usersの作成時に自動生成するため、ここではstore_idの読み取り・更新のみ扱う。

import { supabase } from '../lib/supabaseClient'
import { getDictionary } from '../i18n'
import { createStore } from './storeService'

/** 一般ユーザー用の匿名セッションを取得（無ければ発行）する。既存セッションがあればそれを使う。 */
export async function ensureAnonymousUser(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) return session.user.id

  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  if (!data.user) throw new Error(getDictionary().errors.anonymousSignInFailed)
  return data.user.id
}

/** public.users.store_id を取得する（本人の行のみRLSで閲覧可） */
export async function getStoreIdForUser(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('store_id')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data?.store_id ?? null
}

/** 8.1 ログイン */
export async function signInStore(email: string, password: string): Promise<string> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) {
    throw new Error(getDictionary().errors.invalidCredentials)
  }

  const storeId = await getStoreIdForUser(data.user.id)
  if (!storeId) {
    // 店舗に紐付いていないアカウント（店舗登録者ではない）。ログイン状態を残さない。
    await supabase.auth.signOut()
    throw new Error(getDictionary().errors.storeAccountOnly)
  }
  return storeId
}

/** 8.2 店舗登録 */
export async function registerStore(
  storeName: string,
  email: string,
  password: string,
): Promise<string> {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      throw new Error(getDictionary().errors.emailAlreadyRegistered)
    }
    throw new Error(error.message)
  }
  if (!data.user) throw new Error(getDictionary().errors.registrationFailed)

  if (!data.session) {
    // メール確認が有効なプロジェクト設定の場合、ここではまだ認証済みセッションが無い。
    throw new Error(getDictionary().errors.confirmEmailSent)
  }

  const store = await createStore(storeName)
  const { error: linkError } = await supabase
    .from('users')
    .update({ store_id: store.id })
    .eq('id', data.user.id)
  if (linkError) throw linkError

  return store.id
}

export async function signOutStore(): Promise<void> {
  await supabase.auth.signOut()
}
