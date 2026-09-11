import { GENRE_LIST } from '../data/genres'
import { useTranslation } from '../hooks/useTranslation'
import { useUserSettings } from '../hooks/useUserSettings'
import { translateGenre } from '../i18n'
import type { SearchFilters } from '../types'

interface FilterPanelProps {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
}

const PRICE_OPTIONS = [1000, 2000, 3000, 5000]

/** フィルタ機能（機能要件4）: 検索は再実行せず、既存結果への絞り込みのみ行う */
export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const t = useTranslation()
  const { settings } = useUserSettings()

  function toggleGenre(genre: string) {
    const genres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre]
    onChange({ ...filters, genres })
  }

  return (
    <div className="filter-panel">
      <div className="filter-panel__group">
        <p className="filter-panel__label">{t.filterPanel.genresLabel}</p>
        <div className="chip-row">
          {GENRE_LIST.map((genre) => (
            <button
              key={genre}
              type="button"
              className={`chip ${filters.genres.includes(genre) ? 'chip--active' : ''}`}
              onClick={() => toggleGenre(genre)}
            >
              {translateGenre(genre, settings.language)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-panel__group">
        <p className="filter-panel__label">{t.filterPanel.priceRangeLabel}</p>
        <div className="chip-row">
          <button
            type="button"
            className={`chip ${filters.priceMax === null ? 'chip--active' : ''}`}
            onClick={() => onChange({ ...filters, priceMax: null })}
          >
            {t.filterPanel.noPreference}
          </button>
          {PRICE_OPTIONS.map((price) => (
            <button
              key={price}
              type="button"
              className={`chip ${filters.priceMax === price ? 'chip--active' : ''}`}
              onClick={() => onChange({ ...filters, priceMax: price })}
            >
              {t.filterPanel.priceUpTo(price)}
            </button>
          ))}
        </div>
      </div>

      <label className="filter-panel__checkbox">
        <input
          type="checkbox"
          checked={filters.openNow}
          onChange={(e) => onChange({ ...filters, openNow: e.target.checked })}
        />
        {t.filterPanel.openNowLabel}
      </label>
    </div>
  )
}
