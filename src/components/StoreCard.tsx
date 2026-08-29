import StoreThumbnail from './StoreThumbnail'
import type { StoreSearchResult } from '../types'

interface StoreCardProps {
  result: StoreSearchResult
  onClick: () => void
}

/** 検索結果リストの1行分（画面1）。タップで店舗詳細（画面2）を開く。 */
export default function StoreCard({ result, onClick }: StoreCardProps) {
  const { store, waitMinutes } = result

  return (
    <button type="button" className="store-card" onClick={onClick}>
      <div className="store-card__body">
        <p className="store-card__name">{store.name}</p>
        <p className="store-card__meta">
          <span>★ {store.star.toFixed(1)}</span>
          <span>
            ￥{store.priceMin.toLocaleString()}〜￥{store.priceMax.toLocaleString()}
          </span>
        </p>
        <p className="store-card__hours">
          {store.openTime}〜{store.closeTime}
        </p>
        <p className="store-card__genres">{store.genres.join(' / ')}</p>
      </div>
      <StoreThumbnail
        storeImages={store.storeImages}
        genres={store.genres}
        className="store-card__thumb"
      />
      <div className="store-card__wait">
        <span className="store-card__wait-number">{waitMinutes}</span>
        <span className="store-card__wait-unit">分待ち</span>
      </div>
    </button>
  )
}
