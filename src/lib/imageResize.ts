// アップロード画像をブラウザ側でリサイズ・再圧縮するユーティリティ。
// スマートフォンで撮影した写真はそのままだと数MB〜十数MBになりがちで、
// 一覧のサムネイル（数十px四方）を表示するためだけに毎回その全解像度を
// ダウンロード・デコードすることになり、画像表示が非常に重くなる原因になる。
// アップロード前に長辺の上限を決めて縮小し、JPEGとして再エンコードすることで
// ファイルサイズを大幅に削減する。

const MAX_DIMENSION = 1600
const JPEG_QUALITY = 0.8

/** 画像ファイルを長辺MAX_DIMENSION px以下にリサイズし、JPEGとして再圧縮する */
export async function resizeImageFile(file: File): Promise<File> {
  // アニメーションGIF・SVGなどはリサイズすると壊れる/意味が無いためそのまま返す
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    // デコードできない形式などの場合は元のファイルをそのまま使う
    return file
  }

  try {
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
    )
    if (!blob || blob.size >= file.size) return file // 再圧縮しても縮まらないなら元のまま

    const newName = file.name.replace(/\.[^./\\]+$/, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg' })
  } finally {
    bitmap.close()
  }
}
