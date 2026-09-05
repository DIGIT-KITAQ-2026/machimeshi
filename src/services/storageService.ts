// 店舗画像のアップロード・削除（Supabase Storage）。
// 保存先は公開バケット`store-images`（supabase/schema.sql参照）。
// ファイルパスは `<store_id>/<uuid>.<拡張子>` とし、RLSで当該店舗の管理者のみ
// 追加・削除できるようにしている（閲覧は誰でも可）。

import { supabase } from '../lib/supabaseClient'
import { resizeImageFile } from '../lib/imageResize'

const BUCKET = 'store-images'
const PUBLIC_URL_MARKER = `/object/public/${BUCKET}/`

function buildObjectPath(storeId: string, file: File): string {
  const rawExt = file.name.includes('.') ? file.name.split('.').pop() : undefined
  const ext = rawExt ? `.${rawExt.toLowerCase().replace(/[^a-z0-9]/g, '')}` : ''
  return `${storeId}/${crypto.randomUUID()}${ext}`
}

/** 店舗設定画面（画面5）で選択された画像ファイルをアップロードし、公開URLを返す */
export async function uploadStoreImages(storeId: string, files: File[]): Promise<string[]> {
  const urls: string[] = []
  for (const file of files) {
    // 表示が重くならないよう、アップロード前にブラウザ側でリサイズ・再圧縮する
    const resized = await resizeImageFile(file)
    const path = buildObjectPath(storeId, resized)
    const { error } = await supabase.storage.from(BUCKET).upload(path, resized, { upsert: false })
    if (error) throw new Error(`画像のアップロードに失敗しました（${file.name}）: ${error.message}`)
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    urls.push(data.publicUrl)
  }
  return urls
}

/** 店舗設定画面で削除された画像をストレージからも削除する */
export async function deleteStoreImage(url: string): Promise<void> {
  const markerIndex = url.indexOf(PUBLIC_URL_MARKER)
  if (markerIndex === -1) return // このバケット由来のURLでなければ何もしない
  const path = url.slice(markerIndex + PUBLIC_URL_MARKER.length)
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}
