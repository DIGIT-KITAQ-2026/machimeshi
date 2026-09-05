import { useEffect, useRef, useState } from 'react'
import type { Visit } from '../types'

interface ActiveGroupListProps {
  groups: Visit[]
  selectedId: string | null
  onSelect: (id: string) => void
}

function formatGroupLabel(g: Visit) {
  return `#${g.groupId}（${g.seatType === 'table' ? 'テーブル' : 'カウンター'}・${g.peopleCount}人）`
}

/** 在店中で退店処理が完了していないグループの一覧（機能要件10・画面6） */
export default function ActiveGroupList({ groups, selectedId, onSelect }: ActiveGroupListProps) {
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

  if (groups.length === 0) {
    return <p className="empty-message">現在入店中のグループはいません。</p>
  }

  const selected = groups.find((g) => g.id === selectedId) ?? null

  return (
    <div className="group-select" ref={rootRef}>
      <button
        type="button"
        className="group-select__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="退店するグループを選択"
      >
        <span className={selected ? '' : 'group-select__placeholder'}>
          {selected ? formatGroupLabel(selected) : 'グループIDを選択してください'}
        </span>
        <span className={`group-select__arrow ${open ? 'group-select__arrow--open' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <ul className="group-select__list" role="listbox">
          {groups.map((g) => (
            <li key={g.id} role="option" aria-selected={g.id === selectedId}>
              <button
                type="button"
                className={`group-select__option ${g.id === selectedId ? 'group-select__option--active' : ''}`}
                onClick={() => {
                  onSelect(g.id)
                  setOpen(false)
                }}
              >
                {formatGroupLabel(g)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
