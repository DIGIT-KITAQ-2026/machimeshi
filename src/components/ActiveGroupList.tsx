import type { Visit } from '../types'

interface ActiveGroupListProps {
  groups: Visit[]
  selectedId: string | null
  onSelect: (id: string) => void
}

/** 在店中で退店処理が完了していないグループの一覧（機能要件10・画面6） */
export default function ActiveGroupList({ groups, selectedId, onSelect }: ActiveGroupListProps) {
  if (groups.length === 0) {
    return <p className="empty-message">現在入店中のグループはいません。</p>
  }

  return (
    <select
      className="text-field"
      value={selectedId ?? ''}
      onChange={(e) => onSelect(e.target.value)}
      aria-label="退店するグループを選択"
    >
      <option value="" disabled>
        グループIDを選択してください
      </option>
      {groups.map((g) => (
        <option key={g.id} value={g.id}>
          #{g.groupId}（{g.seatType === 'table' ? 'テーブル' : 'カウンター'}・{g.peopleCount}人）
        </option>
      ))}
    </select>
  )
}
