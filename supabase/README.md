# Supabase セットアップ手順

`specifications/DBs.md` の設計をもとに、Supabase上にDBと認証を構築するための手順です。
**この手順を実行するのはあなた自身**です（Supabaseアカウント作成やプロジェクト作成はエージェントの代理操作ができないため）。

> 現時点では `src/services/*` はまだ `localStorage` を使ったモック実装のままです。
> ここではSupabase側の準備と、アプリからAPIキーで接続するための土台（`src/lib/supabaseClient.ts` /
> `.env`）だけを用意しています。実際に画面の動きをSupabase接続に切り替えるサービス層の移行は、
> 別途この後の作業として依頼してください。

## 1. Supabaseプロジェクトを作成する

1. https://supabase.com にアクセスしてログイン（未登録なら新規登録）
2. 「New project」から新規プロジェクトを作成
   - Project name: 任意（例: `machimeshi`）
   - Database Password: 任意の強いパスワードを設定して控えておく
   - Region: 近いリージョンを選択（例: Northeast Asia (Tokyo)）
3. プロジェクトの作成が完了するまで数分待つ

## 2. スキーマを構築する（SQLの実行）

1. 左メニューの **SQL Editor** を開く
2. **New query** を押し、このリポジトリの [`supabase/schema.sql`](./schema.sql) の中身を
   すべて貼り付けて **Run** を押す
   - `stores` / `users` / `visits` / `search_history` の4テーブルを作成
   - 各テーブルにRLS（Row Level Security）ポリシーを設定
   - 新規ユーザー登録（匿名・メールどちらも）時に `public.users` 行を自動作成するトリガーを設定
3. （任意）検索デモ用のサンプル店舗データを入れたい場合は、
   [`supabase/seed.sql`](./seed.sql) の中身も同様にSQL Editorで実行する
   - 9店舗分のサンプルデータが `stores` テーブルに投入される
   - 自分の店舗（店舗管理画面から操作する店舗）は、後述の「新規登録」で作成すること
     （`auth.users` と連携させる必要があるため、SQLでの直接投入は避ける）
4. 左メニューの **Table Editor** で `stores` などのテーブルが作成されていることを確認する

## 3. 認証（Auth）を設定する

1. 左メニューの **Authentication > Sign In / Providers** を開く
2. **Anonymous Sign-Ins** を有効化する
   - 一般の検索利用者（ログイン画面を使わないユーザー）を匿名認証で扱うため
     （`specifications/DBs.md` の設計どおり）
3. **Email** プロバイダは初期状態で有効になっている想定（店舗アカウントのログイン・登録用）
   - 開発中に確認メールの受信が面倒な場合は、
     **Authentication > Sign In / Providers > Email** の
     **Confirm email** をオフにしておくと、登録直後からすぐログインできて動作確認がしやすい
     （本番運用時は再度オンにすることを推奨）

## 4. APIキーを取得する

1. 左メニューの **Settings > API** を開く
2. 以下の2つの値をコピーする
   - **Project URL**（例: `https://xxxxxxxx.supabase.co`）
   - **anon public** キー（`service_role` キーはフロントエンドでは絶対に使わないこと）

## 5. `.env` を作成する

リポジトリのルートに `.env.example` を用意してあるので、これをコピーして値を埋める。

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

`.env` は `.gitignore` 済みなので、誤ってコミットされることはありません。

## 6. 接続確認

1. `npm run dev` で開発サーバーを起動する
2. ブラウザのコンソールに
   `[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY が未設定です...`
   という警告が **出ていなければ**、`.env` の値が正しく読み込まれている
3. （現時点では）画面の見た目や動作はまだ変わらない。これは`src/services/*`が
   まだSupabaseを呼び出していないため。実際にSupabaseのデータで動かすには、
   `src/services/authService.ts` / `storeService.ts` / `visitService.ts` / `searchService.ts` を
   `src/lib/supabaseClient.ts` 経由の呼び出しに書き換える移行作業が必要（別依頼として対応）

## 補足: RLSポリシーの方針

`supabase/schema.sql` で設定しているポリシーの考え方は以下のとおりです。

| テーブル / バケット | SELECT | INSERT / UPDATE / DELETE |
|---|---|---|
| `stores` | 誰でも可（検索機能のため） | 匿名でない認証済みユーザーのみ作成可。更新は`users.store_id`で紐付いた本人のみ |
| `users` | 本人の行のみ | 本人の行のみ更新可（`store_id`の紐付けなど） |
| `visits` | 誰でも可（個人情報を含まず、待ち時間予測に必要なため） | 当該店舗の管理者のみ |
| `search_history` | 本人の行のみ | 本人の行のみ追加可 |
| `storage.objects`（`store-images`バケット） | 誰でも可 | 追加・削除は、ファイルパスの先頭フォルダ（store_id）に紐付く店舗の管理者のみ |

より厳格にしたい場合（例: `stores`の閲覧も認証済みユーザーのみにする等）は、
`supabase/schema.sql` のポリシーを適宜調整してください。

## 補足: 店舗画像（複数枚・Supabase Storage）を追加した場合

`supabase/schema.sql` は何度再実行しても安全（冪等）です。店舗画像の複数枚対応
（`store_img` → `store_images`への置き換え、`store-images`バケットの作成、そのRLS）を
反映するには、SQL Editorで**ファイル全体をもう一度実行**してください。個別に一部だけ
実行する必要はありません。
