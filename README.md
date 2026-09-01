# まちめし（machimeshi）

飲食店の空き状況・待ち時間を検索できるWebアプリ。React + Vite（フロントエンド）+ Supabase（DB・認証・ストレージ）+ Claude Agent SDK（AI検索）で構成されています。

## 事前準備

- [Node.js](https://nodejs.org/) 22系以上（`node -v` で確認）
- npm（Node.jsに同梱）
- Supabaseアカウント（プロジェクトのオーナーからの招待、または新規作成）
- （AI検索機能を試す場合のみ）[Claude Code CLI](https://docs.claude.com/en/docs/claude-code) がインストール・ログイン済みであること（`claude --version` で確認、未ログインなら `claude login`）

## セットアップ手順

### 1. clone して依存関係をインストール

```bash
git clone git@github.com:DIGIT-KITAQ-2026/machimeshi.git
cd machimeshi
npm install
```

### 2. Supabaseに接続する

このプロジェクトは既存のSupabaseプロジェクトに接続して動作します。
**[supabase/README.md](supabase/README.md)** の「複数人で開発する場合」を参照し、

1. プロジェクトオーナーにSupabaseのチームへ招待してもらう
2. 招待先のプロジェクトの **Settings > API** から自分でURL・anon keyを取得する
3. `.env` を作成して値を設定する

```bash
cp .env.example .env
# .env を開いて VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY を設定
```

（新しくSupabaseプロジェクトを一から構築する場合の手順も同じREADMEに書いてあります）

### 3. 開発サーバーを起動する

```bash
npm run dev
```

表示されたURL（例: `http://localhost:5173`）をブラウザで開けば操作できます。

## 利用可能なnpmスクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 型チェック＋本番ビルド |
| `npm run lint` | ESLintを実行 |
| `npm run preview` | ビルド済みファイルをローカルでプレビュー |
| `npm run claude-server` | AI検索機能用のローカルAPIサーバーを起動（後述） |
| `npm run ask-claude -- "質問文"` | Claudeに1回だけ質問するCLIコマンド |
| `npm run typecheck:scripts` | `scripts/`配下（Node専用コード）の型チェック |

## AI検索機能について（Claude Agent SDK連携）

検索窓の「AI検索」（自然言語検索・検索補正）は、Claude Agent SDK経由でClaudeに問い合わせています。
Agent SDKはローカルの`claude`コマンドを起動する仕組みのため、ブラウザから直接は呼び出せず、
別途ローカルAPIサーバーを起動しておく必要があります。

```bash
# npm run dev とは別のターミナルで
npm run claude-server
```

- APIキーは不要です。未設定の場合、ローカルの`claude login`セッションを使うため、
  Claudeの従量課金APIは発生しません（`claude login`が未実行ならここで実行しておく）
- このサーバーを起動していない状態でAI検索を使うと、エラーメッセージが表示されます
  （通常検索や店舗管理画面など、他の機能には影響しません）
- 詳細は [scripts/claudeServer.ts](scripts/claudeServer.ts) / [src/services/claudeService.ts](src/services/claudeService.ts) を参照

## ディレクトリ構成（概要）

```
src/
  pages/        画面ごとのコンポーネント（画面0〜6に対応）
  components/   ページ間で共有するUI部品
  services/     Supabase・Claudeとの通信をまとめた関数群
  context/      ログイン状態・ユーザー設定などのReact Context
  data/         ジャンル一覧などの定数
  lib/          Supabaseクライアント初期化、共通ヘルパー
  types*        型定義（アプリ用 / Supabaseスキーマ用）
scripts/        Node.js専用スクリプト（Claude Agent SDK連携）。ブラウザからは実行されない
supabase/       DBスキーマ（SQL）・セットアップ手順
```

## 開発フロー（ブランチ運用）

- `main`が常に動く状態を保つ
- 新しい機能・修正ごとに`main`から`feature/xxx`ブランチを切って作業する
- 完了したら`main`にマージし、マージ後はブランチを削除する（GitHub上でもPull Requestを作ってレビューを挟む運用に変えても構いません）
