interface PeopleCounterProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

/** 入店人数の +/- 選択（機能要件9・画面6） */
export default function PeopleCounter({ value, onChange, min = 1, max = 20 }: PeopleCounterProps) {
  return (
    <div className="counter-field">
      <button
        type="button"
        className="counter-field__button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="人数を減らす"
      >
        −
      </button>
      <span className="counter-field__value">{value}人</span>
      <button
        type="button"
        className="counter-field__button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="人数を増やす"
      >
        +
      </button>
    </div>
  )
}
