// specifications/DBs.md のテーブル定義に対応する、手書きのSupabase Database型。
//
// Supabase CLIが使える環境であれば、下記コマンドで実際のスキーマから自動生成した型に
// 置き換えることもできる（<project-id>はプロジェクトのRef ID）。
//   npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
//
// 自動生成コマンドを使わない場合は、このファイルを`supabase/schema.sql`の内容と
// 手動で同期させておくこと。
//
// 型の形（Tables/Views/Functions/Relationships等）は @supabase/postgrest-js が要求する
// GenericSchema/GenericTable の形にあわせている（`supabase gen types`の出力と同じ形）。

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string | null
          phone: string | null
          website_url: string | null
          created_at: string
          updated_at: string
          open_time: string | null
          close_time: string | null
          star: number | null
          price_min: number | null
          price_max: number | null
          store_images: string[] | null
          genres: string[] | null
          table_amount: number | null
          counter_amount: number | null
          id_generating: 'increment' | 'manual'
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address?: string | null
          phone?: string | null
          website_url?: string | null
          created_at?: string
          updated_at?: string
          open_time?: string | null
          close_time?: string | null
          star?: number | null
          price_min?: number | null
          price_max?: number | null
          store_images?: string[] | null
          genres?: string[] | null
          table_amount?: number | null
          counter_amount?: number | null
          id_generating?: 'increment' | 'manual'
        }
        Update: Partial<Database['public']['Tables']['stores']['Insert']>
        Relationships: []
      }
      users: {
        Row: {
          id: string
          created_at: string
          store_id: string | null
        }
        Insert: {
          id: string
          created_at?: string
          store_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
        Relationships: []
      }
      visits: {
        Row: {
          id: string
          store_id: string
          group_id: number
          seat_type: 'table' | 'counter'
          people_count: number
          entered_at: string
          exited_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          group_id: number
          seat_type: 'table' | 'counter'
          people_count: number
          entered_at?: string
          exited_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['visits']['Insert']>
        Relationships: []
      }
      search_history: {
        Row: {
          id: string
          user_id: string
          query_text: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          query_text: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['search_history']['Insert']>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
