// ブラウザからClaudeに質問するための関数。
//
// Claude Agent SDK自体はブラウザ内では実行できない（ローカルプロセス起動・
// CLIバイナリへのアクセスが必要なため）。そのため実際の呼び出しは
// scripts/claudeServer.ts（ローカル開発専用のNode.jsサーバー）が行い、
// ここではそのAPIをfetchで叩くだけの薄いラッパーになっている。
// Viteのdevサーバー起動時は vite.config.ts の server.proxy 設定により、
// /api/ask-claude へのリクエストが自動的にそのサーバーへ転送される。
//
// 事前に別ターミナルで `npm run claude-server` を起動しておくこと。

import { getDictionary } from '../i18n'

/**
 * Claudeにプロンプト文字列を渡し、最終的な返答テキストを返す（ブラウザから呼び出し可能）。
 *
 * @param prompt - Claudeへの入力プロンプト
 * @returns Claudeの最終的な返答テキスト
 */
export async function askClaude(prompt: string): Promise<string> {
  const res = await fetch('/api/ask-claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data && typeof data.error === 'string' ? data.error : `HTTP ${res.status}`
    throw new Error(getDictionary().errors.claudeRequestFailed(message))
  }

  if (!data || typeof data.answer !== 'string') {
    throw new Error(getDictionary().errors.claudeResponseInvalid)
  }
  return data.answer
}
