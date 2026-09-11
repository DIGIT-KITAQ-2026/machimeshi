// ジャンル名の表示ラベルだけを言語ごとに切り替えるための対応表。
//
// GENRE_LIST（src/data/genres.ts）の値そのもの（日本語）は、Supabaseの`stores.genres`に
// 保存される値・検索/フィルタでのマッチングキー・Claudeへの語彙提示にそのまま使われているため
// 変更しない。ここで変換するのはUIに表示する見た目のラベルだけで、保存値・比較には一切影響しない。

import type { Lang } from './types'

const GENRE_LABELS_JA: Record<string, string> = {
  'ラーメン': 'ラーメン',
  '定食': '定食',
  '居酒屋': '居酒屋',
  'カフェ': 'カフェ',
  '焼肉': '焼肉',
  '寿司': '寿司',
  'イタリアン': 'イタリアン',
  'カレー': 'カレー',
  '中華': '中華',
  'パン・スイーツ': 'パン・スイーツ',
}

const GENRE_LABELS_EN: Record<string, string> = {
  'ラーメン': 'Ramen',
  '定食': 'Set Meal',
  '居酒屋': 'Izakaya',
  'カフェ': 'Cafe',
  '焼肉': 'Yakiniku',
  '寿司': 'Sushi',
  'イタリアン': 'Italian',
  'カレー': 'Curry',
  '中華': 'Chinese',
  'パン・スイーツ': 'Bakery & Sweets',
}

const GENRE_LABELS_KO: Record<string, string> = {
  'ラーメン': '라멘',
  '定食': '정식',
  '居酒屋': '이자카야',
  'カフェ': '카페',
  '焼肉': '야키니쿠',
  '寿司': '스시',
  'イタリアン': '이탈리안',
  'カレー': '카레',
  '中華': '중식',
  'パン・スイーツ': '빵・디저트',
}

const GENRE_LABELS: Record<Lang, Record<string, string>> = {
  '日本語': GENRE_LABELS_JA,
  'English': GENRE_LABELS_EN,
  '한국어': GENRE_LABELS_KO,
}

/** ジャンルの表示ラベルを言語に応じて返す。未知の値はそのまま表示する（フォールバック）。 */
export function translateGenre(genre: string, lang: Lang): string {
  return GENRE_LABELS[lang][genre] ?? genre
}
