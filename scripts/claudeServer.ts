// ブラウザからClaudeに質問できるようにするための、ローカル開発専用のAPIサーバー。
//
// Claude Agent SDK（内部でclaude CLIを起動する方式）はNode.jsのプロセス起動・
// ファイルシステムアクセスに依存しているため、ブラウザのJavaScriptから直接
// 実行することはできない。そのためこの小さなサーバーをNode.js側で立て、
// ブラウザ（Viteのdevサーバー）からはHTTP経由でこれを呼び出す
// （vite.config.tsのserver.proxyで /api への通信をこのサーバーに転送している）。
//
// 起動方法: npm run claude-server
// （npm run dev と別のターミナルで、両方起動しておくこと）
//
// 認証について: ANTHROPIC_API_KEYはあえて設定しない。未設定の場合、
// Claude Agent SDKはこのマシンで`claude login`済みのローカルセッションを
// 自動的に使うため、従量課金のAPI利用にはならない
// （`claude`コマンドが未ログインの場合は、事前にターミナルで`claude login`を実行しておくこと）。

import express from 'express'
import { askClaude } from './askClaude.ts'

const PORT = Number(process.env.CLAUDE_SERVER_PORT) || 8787

const app = express()
app.use(express.json())

app.post('/api/ask-claude', async (req, res) => {
  const prompt = req.body?.prompt
  if (typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'prompt（文字列）を指定してください' })
    return
  }

  try {
    const answer = await askClaude(prompt)
    res.json({ answer })
  } catch (err) {
    console.error('[claude-server]', err)
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) })
  }
})

app.listen(PORT, () => {
  console.log(`[claude-server] http://localhost:${PORT} で待機中（POST /api/ask-claude）`)
})
