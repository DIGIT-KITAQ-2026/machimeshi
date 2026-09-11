import { useTranslation } from '../hooks/useTranslation'

interface PriceRangeFieldProps {
  priceMin: number
  priceMax: number
  onChange: (priceMin: number, priceMax: number) => void
}

const MAX_PRICE = 10000

/** 価格帯（下限・上限）の設定（機能要件11・画面5） */
export default function PriceRangeField({ priceMin, priceMax, onChange }: PriceRangeFieldProps) {
  const t = useTranslation()
  return (
    <div className="price-range">
      <div className="price-range__bar">
        <div
          className="price-range__fill"
          style={{
            left: `${(priceMin / MAX_PRICE) * 100}%`,
            right: `${100 - (priceMax / MAX_PRICE) * 100}%`,
          }}
        />
      </div>
      <div className="price-range__inputs">
        <label>
          {t.priceRangeField.min}
          <input
            type="number"
            className="text-field"
            min={0}
            max={priceMax}
            step={100}
            value={priceMin}
            onChange={(e) => onChange(Number(e.target.value), priceMax)}
          />
        </label>
        <span>〜</span>
        <label>
          {t.priceRangeField.max}
          <input
            type="number"
            className="text-field"
            min={priceMin}
            max={MAX_PRICE}
            step={100}
            value={priceMax}
            onChange={(e) => onChange(priceMin, Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  )
}
