import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStoreAuth } from '../hooks/useStoreAuth'
import { getErrorMessage } from '../lib/errors'
import { updateStoreSettings } from '../services/storeService'
import { deleteStoreImage, uploadStoreImages } from '../services/storageService'
import GenreTagInput from '../components/GenreTagInput'
import PriceRangeField from '../components/PriceRangeField'
import ImageManager from '../components/ImageManager'
import type { IdGenerating } from '../types'

/** 画面5: 店舗設定画面 */
export default function StoreSettingsPage() {
  const navigate = useNavigate()
  const { store, refresh } = useStoreAuth()

  const [name, setName] = useState(store?.name ?? '')
  const [description, setDescription] = useState(store?.description ?? '')
  const [address, setAddress] = useState(store?.address ?? '')
  const [phone, setPhone] = useState(store?.phone ?? '')
  const [websiteUrl, setWebsiteUrl] = useState(store?.websiteUrl ?? '')
  const [priceMin, setPriceMin] = useState(store?.priceMin ?? 0)
  const [priceMax, setPriceMax] = useState(store?.priceMax ?? 1000)
  const [openTime, setOpenTime] = useState(store?.openTime ?? '11:00')
  const [closeTime, setCloseTime] = useState(store?.closeTime ?? '21:00')
  const [genres, setGenres] = useState<string[]>(store?.genres ?? [])
  const [tableAmount, setTableAmount] = useState(store?.tableAmount ?? 4)
  const [counterAmount, setCounterAmount] = useState(store?.counterAmount ?? 4)
  const [idGenerating, setIdGenerating] = useState<IdGenerating>(store?.idGenerating ?? 'increment')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // 画像（Supabase Storage）。existingImagesは既に保存済みのURL、pendingFilesは
  // これから追加するファイル（保存時にまとめてアップロードする）、removedImagesは
  // 削除対象として外されたURL（保存成功後にストレージからも削除する）。
  const [existingImages, setExistingImages] = useState<string[]>(store?.storeImages ?? [])
  const [removedImages, setRemovedImages] = useState<string[]>([])
  const [pendingFiles, setPendingFiles] = useState<File[]>([])

  if (!store) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    try {
      const uploadedUrls =
        pendingFiles.length > 0 ? await uploadStoreImages(store!.id, pendingFiles) : []
      const storeImages = [...existingImages, ...uploadedUrls]

      await updateStoreSettings(store!.id, {
        name,
        description,
        address,
        phone,
        websiteUrl,
        priceMin,
        priceMax,
        openTime,
        closeTime,
        genres,
        storeImages,
        tableAmount,
        counterAmount,
        idGenerating,
      })

      // 削除された画像をストレージからも削除する（失敗しても保存自体は成功済みなので握りつぶす）
      await Promise.all(removedImages.map((url) => deleteStoreImage(url).catch(() => {})))

      await refresh()
      navigate('/store/manage')
    } catch (err) {
      setSaveError(getErrorMessage(err, '保存に失敗しました'))
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <button
          type="button"
          className="icon-button"
          onClick={() => navigate('/store/manage')}
          aria-label="戻る"
        >
          ← 戻る
        </button>
        <h1 className="page-header__title">店舗設定</h1>
      </header>

      <form className="form" onSubmit={handleSubmit}>
        <label className="form__field">
          店名
          <input
            type="text"
            className="text-field"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="form__field">
          概要
          <textarea
            className="text-field"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label className="form__field">
          住所
          <input
            type="text"
            className="text-field"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>

        <label className="form__field">
          電話番号
          <input
            type="tel"
            className="text-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label className="form__field">
          ウェブサイトURL
          <input
            type="text"
            className="text-field"
            placeholder="https://..."
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </label>

        <div className="form__field">
          金額
          <PriceRangeField
            priceMin={priceMin}
            priceMax={priceMax}
            onChange={(min, max) => {
              setPriceMin(min)
              setPriceMax(max)
            }}
          />
        </div>

        <div className="form__field">
          営業時間
          <div className="time-range">
            <input
              type="time"
              className="text-field"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
            />
            <span>〜</span>
            <input
              type="time"
              className="text-field"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form__field">
          ジャンル（タグ）
          <GenreTagInput value={genres} onChange={setGenres} />
        </div>

        <div className="form__field">
          写真
          <ImageManager
            existingUrls={existingImages}
            onRemoveExisting={(url) => {
              setExistingImages((prev) => prev.filter((u) => u !== url))
              setRemovedImages((prev) => [...prev, url])
            }}
            pendingFiles={pendingFiles}
            onAddFiles={(files) => setPendingFiles((prev) => [...prev, ...files])}
            onRemovePending={(index) =>
              setPendingFiles((prev) => prev.filter((_, i) => i !== index))
            }
          />
        </div>

        <div className="form__row">
          <label className="form__field">
            卓の数
            <input
              type="number"
              className="text-field"
              min={0}
              value={tableAmount}
              onChange={(e) => setTableAmount(Number(e.target.value))}
            />
          </label>
          <label className="form__field">
            カウンターの数
            <input
              type="number"
              className="text-field"
              min={0}
              value={counterAmount}
              onChange={(e) => setCounterAmount(Number(e.target.value))}
            />
          </label>
        </div>

        <label className="form__field">
          IDの生成方法
          <select
            className="text-field"
            value={idGenerating}
            onChange={(e) => setIdGenerating(e.target.value as IdGenerating)}
          >
            <option value="increment">自動採番（インクリメント）</option>
            <option value="manual">手動入力</option>
          </select>
        </label>

        {saveError && <p className="form-error">{saveError}</p>}

        <button type="submit" className="primary-button" disabled={saving}>
          {saving ? '保存中...' : '決定'}
        </button>
      </form>
    </div>
  )
}
