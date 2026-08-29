// Supabaseクライアントのシングルトン。
//
// 現時点ではservices/*（authService/storeService/visitService/searchService）は
// まだlocalStorageベースのモック実装のままで、このクライアントはどこからも
// 呼び出されていない。実際にSupabaseへ接続する準備（プロジェクト作成・スキーマ構築・
// 環境変数の用意）が整った段階で、services/*の中身をこのクライアント経由の
// 呼び出しに書き換える想定。手順は specifications/supabase_setup.md を参照。

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** .env に VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY が設定されているかどうか */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // 開発時のみ警告する。未設定でも他の画面（localStorageモック）は動作し続ける。
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY が未設定です。' +
      '.env.example を参考に .env を作成してください（specifications/supabase_setup.md 参照）。',
  )
}

// 未設定時にcreateClientが例外を投げないよう、ダミー値でフォールバックする。
// isSupabaseConfigured が false の間は実際にSupabaseへ接続する処理を呼び出さないこと。
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
)
