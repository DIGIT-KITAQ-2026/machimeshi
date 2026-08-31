import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // ブラウザからClaudeを呼び出すためのローカル専用APIサーバーへのプロキシ。
      // `npm run claude-server` を別途起動しておく必要がある（scripts/claudeServer.ts参照）。
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
