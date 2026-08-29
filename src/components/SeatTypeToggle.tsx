import type { SeatType } from '../types'

interface SeatTypeToggleProps {
  value: SeatType
  onChange: (value: SeatType) => void
}

/** 席種類（テーブル/カウンター）の選択（機能要件9・画面6） */
export default function SeatTypeToggle({ value, onChange }: SeatTypeToggleProps) {
  return (
    <div className="segmented">
      <button
        type="button"
        className={`segmented__item ${value === 'table' ? 'segmented__item--active' : ''}`}
        onClick={() => onChange('table')}
      >
        テーブル
      </button>
      <button
        type="button"
        className={`segmented__item ${value === 'counter' ? 'segmented__item--active' : ''}`}
        onClick={() => onChange('counter')}
      >
        カウンター
      </button>
    </div>
  )
}
