import { useState } from 'react'
import type { FormEvent } from 'react'

interface AiSearchBoxProps {
  onSubmit: (prompt: string) => void
  loading?: boolean
}

/** AI検索窓（機能要件1.3）: 自然言語での検索プロンプトを入力する欄 */
export default function AiSearchBox({ onSubmit, loading = false }: AiSearchBoxProps) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!value.trim() || loading) return
    onSubmit(value)
  }

  return (
    <form className="ai-search-box" onSubmit={handleSubmit}>
      <span className="ai-search-box__badge">AI</span>
      <input
        type="text"
        className="ai-search-box__input"
        placeholder="例：今すぐ入れる安いラーメン屋"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="AIに検索条件を伝える"
        disabled={loading}
      />
      <button type="submit" className="ai-search-box__button" disabled={loading}>
        {loading ? '考え中...' : 'AIで検索'}
      </button>
    </form>
  )
}
