import { useState } from 'react'
import GenreThumbnail from './GenreThumbnail'
import type { StoreSearchResult } from '../types'

interface StoreDetailSheetProps {
  result: StoreSearchResult | null
  onClose: () => void
}

/**
 * 店舗詳細機能（機能要件6・画面2）。
 * 下部からのシートで店舗詳細を表示する。共有・保存ボタンはUIのみ用意し、
 * 「共有・保存処理については現時点では実装しない」という仕様のため実処理は行わない。
 */
export default function StoreDetailSheet({ result, onClose }: StoreDetailSheetProps) {
  const [notice, setNotice] = useState(false)

  if (!result) return null
  const { store, waitMinutes } = result

  function showNotice() {
    setNotice(true)
    window.setTimeout(() => setNotice(false), 2000)
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="sheet__close" onClick={onClose} aria-label="閉じる">
          ×
        </button>

        <h2 className="sheet__name">{store.name}</h2>
        <p className="store-card__meta">
          <span>★ {store.star.toFixed(1)}</span>
          <span>
            ￥{store.priceMin.toLocaleString()}〜￥{store.priceMax.toLocaleString()}
          </span>
        </p>
        <p className="store-card__hours">
          {store.openTime}〜{store.closeTime}
        </p>
        <p className="sheet__wait">現在の待ち時間の目安: 約{waitMinutes}分</p>

        {store.address && <p className="sheet__row">📍 {store.address}</p>}
        {store.phone && <p className="sheet__row">📞 {store.phone}</p>}
        {store.websiteUrl && (
          <p className="sheet__row">
            🔗{' '}
            <a href={store.websiteUrl} target="_blank" rel="noreferrer">
              {store.websiteUrl}
            </a>
          </p>
        )}

        <div className="sheet__images">
          {store.storeImages.length > 0 ? (
            store.storeImages.map((url) => (
              <img key={url} src={url} alt={store.name} className="sheet__image-photo" />
            ))
          ) : (
            <GenreThumbnail genres={store.genres} className="sheet__image" />
          )}
        </div>

        <div>
          <p className="filter-panel__label">概要</p>
          <p className="sheet__description">{store.description || '店舗情報は準備中です。'}</p>
        </div>

        <div className="sheet__actions">
          <button type="button" className="secondary-button" onClick={showNotice}>
            共有
          </button>
          <button type="button" className="secondary-button" onClick={showNotice}>
            保存
          </button>
        </div>
        {notice && <p className="sheet__notice">この機能は準備中です</p>}
      </div>
    </div>
  )
}
