import { useTranslation } from '../hooks/useTranslation'

interface GroupIdFieldProps {
  value: string
  onChange: (value: string) => void
}

/** グループIDの表示・編集（機能要件9・画面6） */
export default function GroupIdField({ value, onChange }: GroupIdFieldProps) {
  const t = useTranslation()
  return (
    <input
      type="number"
      className="text-field"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t.groupIdField.placeholder}
      aria-label={t.groupIdField.ariaLabel}
    />
  )
}
