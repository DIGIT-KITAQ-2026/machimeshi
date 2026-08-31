// Claudeにプロンプトを投げて、最終的な返答テキストだけを受け取るための関数。
//
// Claude API（@anthropic-ai/sdkのMessages API）を直接叩くのではなく、
// Claude Agent SDK（内部でclaude CLIを起動する方式）を使って実現している。
// このファイル自体はNode.js専用（ブラウザからは実行できない）で、
// ブラウザから使う場合はscripts/claudeServer.tsを介する（README/チャット参照）。
//
// 認証について: ANTHROPIC_API_KEYは設定しない運用を想定している。未設定の場合、
// Claude Agent SDKはこのマシンで`claude login`済みのセッションを自動的に使うため、
// 従量課金のAPI利用にはならない（claudeコマンドが未ログインならば、
// 事前にターミナルで`claude login`を実行しておくこと）。
// APIキー課金にしたい場合のみ、.envにANTHROPIC_API_KEYを設定すればそちらが優先される。

import { query } from '@anthropic-ai/claude-agent-sdk'
import { pathToFileURL } from 'node:url'

/**
 * Claudeにプロンプト文字列を渡し、最終的な返答テキストを返す。
 *
 * @param prompt - Claudeへの入力プロンプト
 * @returns Claudeの最終的な返答テキスト
 */
export async function askClaude(prompt: string): Promise<string> {
  const stream = query({
    prompt,
    options: {
      // ツール（ファイル操作・コマンド実行など）を一切使わせない、
      // 単発のテキスト質問応答専用にするための設定。
      tools: [],
      permissionMode: 'bypassPermissions',
    },
  })

  for await (const message of stream) {
    if (message.type !== 'result') continue

    if (message.subtype === 'success') {
      // is_errorがtrueの場合、resultにはAPIエラー時のエラーテキストが入る
      if (message.is_error) {
        throw new Error(`Claudeからの応答がエラーでした: ${message.result}`)
      }
      return message.result
    }

    // 'error_during_execution' | 'error_max_turns' | 'error_max_budget_usd' | 'error_max_structured_output_retries'
    throw new Error(`Claude Agent SDKの呼び出しに失敗しました（${message.subtype}）`)
  }

  throw new Error('Claudeから応答を受け取れませんでした')
}

// ------------------------------------------------------------
// CLIから直接実行された場合の処理
// 実行方法: npm run ask-claude -- "プロンプト文"
// ------------------------------------------------------------
const isMainModule =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href

if (isMainModule) {
  // .envにANTHROPIC_API_KEYを書いていれば読み込む（無ければ何もしない）
  try {
    process.loadEnvFile('.env')
  } catch {
    // .envが無い場合は、シェルの環境変数（export ANTHROPIC_API_KEY=...）を使う想定
  }

  const prompt = process.argv.slice(2).join(' ')
  if (!prompt) {
    console.error('使い方: npm run ask-claude -- "プロンプト文"')
    process.exit(1)
  }

  try {
    const answer = await askClaude(prompt)
    console.log(answer)
  } catch (err) {
    console.error(err instanceof Error ? err.message : err)
    process.exit(1)
  }
}
