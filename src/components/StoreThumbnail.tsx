import GenreThumbnail from './GenreThumbnail'
import { useTranslation } from '../hooks/useTranslation'
import { useUserSettings } from '../hooks/useUserSettings'
import { translateGenre } from '../i18n'

interface StoreThumbnailProps {
  storeImages: string[]
  genres: string[]
  className?: string
}

/**
 * 店舗のサムネイル表示。アップロード済みの画像（Supabase Storage）があればそれを、
 * 無ければジャンルに応じたプレースホルダー（GenreThumbnail）を表示する。
 */
export default function StoreThumbnail({ storeImages, genres, className }: StoreThumbnailProps) {
  const t = useTranslation()
  const { settings } = useUserSettings()

  if (storeImages.length > 0) {
    return (
      <img
        src={storeImages[0]}
        alt={genres.map((g) => translateGenre(g, settings.language)).join('・') || t.common.storeImageFallbackAlt}
        className={`store-thumbnail-img ${className ?? ''}`}
        loading="lazy"
        decoding="async"
      />
    )
  }
  return <GenreThumbnail genres={genres} className={className} />
}
