// ジャンル関連の定数。フィルタ・タグ入力・おすすめ検索・サムネイル表示で共通利用する。
// （店舗のモックデータ・デモアカウントは、Supabase移行に伴い削除済み。
// 検索デモ用データが欲しい場合は supabase/seed.sql を参照）

export const GENRE_LIST = [
  'ラーメン',
  '定食',
  '居酒屋',
  'カフェ',
  '焼肉',
  '寿司',
  'イタリアン',
  'カレー',
  '中華',
  'パン・スイーツ',
] as const

// ジャンルごとのプレースホルダー配色・絵文字（外部画像を使わずCSSのみでサムネイルを表現する）
export const GENRE_THEME: Record<string, { emoji: string; from: string; to: string }> = {
  ラーメン: { emoji: '🍜', from: '#ff9a56', to: '#ff6f61' },
  定食: { emoji: '🍱', from: '#8bc34a', to: '#4caf50' },
  居酒屋: { emoji: '🏮', from: '#e5573f', to: '#b71c1c' },
  カフェ: { emoji: '☕', from: '#c9a27a', to: '#8d6e63' },
  焼肉: { emoji: '🥩', from: '#e57373', to: '#c62828' },
  寿司: { emoji: '🍣', from: '#4fc3f7', to: '#0288d1' },
  イタリアン: { emoji: '🍝', from: '#ffca28', to: '#f57f17' },
  カレー: { emoji: '🍛', from: '#ffa726', to: '#e65100' },
  中華: { emoji: '🥟', from: '#ef5350', to: '#c62828' },
  'パン・スイーツ': { emoji: '🥐', from: '#f8bbd0', to: '#ec407a' },
}

export function themeForGenres(genres: string[]) {
  const key = genres.find((g) => GENRE_THEME[g])
  return key ? GENRE_THEME[key] : { emoji: '🍽️', from: '#9e9e9e', to: '#616161' }
}
