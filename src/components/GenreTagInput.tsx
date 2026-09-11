import { GENRE_LIST } from '../data/genres'
import { useUserSettings } from '../hooks/useUserSettings'
import { translateGenre } from '../i18n'

interface GenreTagInputProps {
  value: string[]
  onChange: (value: string[]) => void
}

/** 店舗のジャンル（タグ）を選択する（機能要件11・画面5） */
export default function GenreTagInput({ value, onChange }: GenreTagInputProps) {
  const { settings } = useUserSettings()

  function toggle(genre: string) {
    onChange(value.includes(genre) ? value.filter((g) => g !== genre) : [...value, genre])
  }

  return (
    <div className="chip-row">
      {GENRE_LIST.map((genre) => (
        <button
          key={genre}
          type="button"
          className={`chip ${value.includes(genre) ? 'chip--active' : ''}`}
          onClick={() => toggle(genre)}
        >
          {translateGenre(genre, settings.language)}
        </button>
      ))}
    </div>
  )
}
