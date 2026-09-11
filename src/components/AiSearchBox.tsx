import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from '../hooks/useTranslation'

interface AiSearchBoxProps {
  onSubmit: (prompt: string) => void
  loading?: boolean
}

/** AI検索窓（機能要件1.3）: 自然言語での検索プロンプトを入力する欄 */
export default function AiSearchBox({ onSubmit, loading = false }: AiSearchBoxProps) {
  const t = useTranslation()
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!value.trim() || loading) return
    onSubmit(value)
  }

  return (
    <form className="ai-search-box" onSubmit={handleSubmit}>
      <span className="ai-search-box__badge">{t.aiSearchBox.badge}</span>
      <input
        type="text"
        className="ai-search-box__input"
        placeholder={t.aiSearchBox.placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label={t.aiSearchBox.ariaLabel}
        disabled={loading}
      />
      <button type="submit" className="ai-search-box__button" disabled={loading}>
        {loading ? t.aiSearchBox.thinking : t.aiSearchBox.submit}
      </button>
    </form>
  )
}
