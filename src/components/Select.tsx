import { useEffect, useRef, useState } from 'react'

export interface SelectOption<T extends string> {
  value: T
  label: string
}

interface SelectProps<T extends string> {
  value: T | ''
  options: SelectOption<T>[]
  onChange: (value: T) => void
  placeholder?: string
  ariaLabel?: string
}

/**
 * ネイティブ<select>の代替。ブラウザはポップアップの表示位置を自前で決めてしまい
 * CSSから制御できないため、トリガーボタン+絶対配置リストで自前実装し、
 * 候補リストが常にトリガーの真下(top:100%)に開くようにしている。
 */
export default function Select<T extends string>({
  value,
  options,
  onChange,
  placeholder = '選択してください',
  ariaLabel,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  const selected = options.find((o) => o.value === value) ?? null

  return (
    <div className="select" ref={rootRef}>
      <button
        type="button"
        className="select__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className={selected ? '' : 'select__placeholder'}>
          {selected ? selected.label : placeholder}
        </span>
        <span className={`select__arrow ${open ? 'select__arrow--open' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <ul className="select__list" role="listbox">
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={o.value === value}>
              <button
                type="button"
                className={`select__option ${o.value === value ? 'select__option--active' : ''}`}
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
