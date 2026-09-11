import { themeForGenres } from '../data/genres'
import { useTranslation } from '../hooks/useTranslation'
import { useUserSettings } from '../hooks/useUserSettings'
import { translateGenre } from '../i18n'

/** 外部画像を使わず、ジャンルに応じた配色+絵文字でサムネイルを表現するプレースホルダー */
export default function GenreThumbnail({
  genres,
  className,
}: {
  genres: string[]
  className?: string
}) {
  const t = useTranslation()
  const { settings } = useUserSettings()
  const theme = themeForGenres(genres)
  return (
    <div
      className={`genre-thumbnail ${className ?? ''}`}
      style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
      role="img"
      aria-label={genres.map((g) => translateGenre(g, settings.language)).join('・') || t.common.storeImageFallbackAlt}
    >
      <span>{theme.emoji}</span>
    </div>
  )
}
