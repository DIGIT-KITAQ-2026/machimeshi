import { useState } from 'react'
import type { FormEvent } from 'react'

interface SearchBarProps {
  defaultValue?: string
  placeholder?: string
  onSubmit: (queryText: string) => void
}

/** 検索窓（画面0・画面1で共通利用） */
export default function SearchBar({
  defaultValue = '',
  placeholder = '何か検索する',
  onSubmit,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit(value)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <svg className="search-bar__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
      </svg>
      <input
        type="search"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="店舗を検索"
      />
      <button type="submit" className="search-bar__button">
        検索
      </button>
    </form>
  )
}
