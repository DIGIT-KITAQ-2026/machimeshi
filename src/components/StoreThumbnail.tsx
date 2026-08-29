import GenreThumbnail from './GenreThumbnail'

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
  if (storeImages.length > 0) {
    return (
      <img
        src={storeImages[0]}
        alt={genres.join('・') || '店舗画像'}
        className={`store-thumbnail-img ${className ?? ''}`}
      />
    )
  }
  return <GenreThumbnail genres={genres} className={className} />
}
