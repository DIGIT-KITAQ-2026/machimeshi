import Select from './Select'
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
  if (groups.length === 0) {
    return <p className="empty-message">現在入店中のグループはいません。</p>
  }

  return (
    <Select
      value={selectedId ?? ''}
      options={groups.map((g) => ({ value: g.id, label: formatGroupLabel(g) }))}
      onChange={onSelect}
      placeholder="グループIDを選択してください"
      ariaLabel="退店するグループを選択"
    />
  )
}
