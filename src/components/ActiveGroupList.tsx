import Select from './Select'
import { useTranslation } from '../hooks/useTranslation'
import type { Dictionary } from '../i18n'
import type { Visit } from '../types'

interface ActiveGroupListProps {
  groups: Visit[]
  selectedId: string | null
  onSelect: (id: string) => void
}

function formatGroupLabel(g: Visit, t: Dictionary) {
  const seat = g.seatType === 'table' ? t.common.seatType.table : t.common.seatType.counter
  return `#${g.groupId}（${seat}・${t.peopleCounter.unit(g.peopleCount)}）`
}

/** 在店中で退店処理が完了していないグループの一覧（機能要件10・画面6） */
export default function ActiveGroupList({ groups, selectedId, onSelect }: ActiveGroupListProps) {
  const t = useTranslation()

  if (groups.length === 0) {
    return <p className="empty-message">{t.activeGroupList.empty}</p>
  }

  return (
    <Select
      value={selectedId ?? ''}
      options={groups.map((g) => ({ value: g.id, label: formatGroupLabel(g, t) }))}
      onChange={onSelect}
      placeholder={t.activeGroupList.placeholder}
      ariaLabel={t.activeGroupList.selectAria}
    />
  )
}
