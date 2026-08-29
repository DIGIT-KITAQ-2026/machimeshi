import { GENRE_LIST } from '../data/genres'

interface GenreTagInputProps {
  value: string[]
  onChange: (value: string[]) => void
}

/** 店舗のジャンル（タグ）を選択する（機能要件11・画面5） */
export default function GenreTagInput({ value, onChange }: GenreTagInputProps) {
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
          {genre}
        </button>
      ))}
    </div>
  )
}
