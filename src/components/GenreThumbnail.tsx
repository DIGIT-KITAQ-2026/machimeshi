import { themeForGenres } from '../data/genres'

/** 外部画像を使わず、ジャンルに応じた配色+絵文字でサムネイルを表現するプレースホルダー */
export default function GenreThumbnail({
  genres,
  className,
}: {
  genres: string[]
  className?: string
}) {
  const theme = themeForGenres(genres)
  return (
    <div
      className={`genre-thumbnail ${className ?? ''}`}
      style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
      role="img"
      aria-label={genres.join('・') || '店舗画像'}
    >
      <span>{theme.emoji}</span>
    </div>
  )
}
