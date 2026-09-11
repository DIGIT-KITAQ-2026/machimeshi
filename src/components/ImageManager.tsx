import { useEffect, useMemo } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import type { Dictionary } from '../i18n'

const MAX_IMAGES = 6

interface ImageManagerProps {
  existingUrls: string[]
  onRemoveExisting: (url: string) => void
  pendingFiles: File[]
  onAddFiles: (files: File[]) => void
  onRemovePending: (index: number) => void
}

/** 店舗設定画面（画面5）用の複数画像マネージャー。既存画像のプレビュー・削除と新規ファイルの追加を扱う。 */
export default function ImageManager({
  existingUrls,
  onRemoveExisting,
  pendingFiles,
  onAddFiles,
  onRemovePending,
}: ImageManagerProps) {
  const t = useTranslation()
  const total = existingUrls.length + pendingFiles.length
  const canAddMore = total < MAX_IMAGES

  return (
    <div className="image-manager">
      <div className="image-manager__grid">
        {existingUrls.map((url) => (
          <div key={url} className="image-manager__item">
            <img src={url} alt="" />
            <button
              type="button"
              className="image-manager__remove"
              onClick={() => onRemoveExisting(url)}
              aria-label={t.common.removeImage}
            >
              ×
            </button>
          </div>
        ))}

        {pendingFiles.map((file, index) => (
          <PendingImagePreview
            key={`${file.name}-${index}`}
            file={file}
            onRemove={() => onRemovePending(index)}
            t={t}
          />
        ))}

        {canAddMore && (
          <label className="image-manager__add">
            {t.imageManager.addButton}
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                const files = Array.from(e.target.files ?? [])
                if (files.length > 0) onAddFiles(files)
                e.target.value = ''
              }}
            />
          </label>
        )}
      </div>
      <p className="image-manager__hint">{t.imageManager.hint(total, MAX_IMAGES)}</p>
    </div>
  )
}

function PendingImagePreview({
  file,
  onRemove,
  t,
}: {
  file: File
  onRemove: () => void
  t: Dictionary
}) {
  // createObjectURLはfileが同じ限り決定的なので、レンダー中に計算しstateには持たない。
  // 後始末（revoke）だけをeffectで行う（react-hooks/set-state-in-effect対策）。
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file])

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  return (
    <div className="image-manager__item image-manager__item--pending">
      <img src={previewUrl} alt="" />
      <button
        type="button"
        className="image-manager__remove"
        onClick={onRemove}
        aria-label={t.common.removeImage}
      >
        ×
      </button>
    </div>
  )
}
