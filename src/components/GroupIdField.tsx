interface GroupIdFieldProps {
  value: string
  onChange: (value: string) => void
}

/** グループIDの表示・編集（機能要件9・画面6） */
export default function GroupIdField({ value, onChange }: GroupIdFieldProps) {
  return (
    <input
      type="number"
      className="text-field"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="グループID"
      aria-label="グループID"
    />
  )
}
