// i18nのエントリポイント。Reactコンポーネントからは src/hooks/useTranslation.ts の
// useTranslation()フックを使う。Reactツリーの外（src/services/*.tsのようなプレーンな
// 関数）からは getDictionary() を直接呼び、現在の言語設定をlocalStorageから読む。

import { readJson } from '../lib/storage'
import type { UserSettings } from '../types'
import { ja } from './ja'
import { en } from './en'
import { ko } from './ko'
import type { Dictionary, Lang } from './types'

export type { Dictionary, Lang }
export { translateGenre } from './genres'

export const DICTIONARIES: Record<Lang, Dictionary> = {
  '日本語': ja,
  'English': en,
  '한국어': ko,
}

/** <html lang="...">に設定するBCP47言語コード */
export const LANG_CODE: Record<Lang, string> = {
  '日本語': 'ja',
  'English': 'en',
  '한국어': 'ko',
}

const SETTINGS_KEY = 'userSettings'
const DEFAULT_LANG: Lang = '日本語'

/**
 * 現在の言語設定をlocalStorageから直接読む（Reactコンテキストに依存しない）。
 * src/context/UserSettingsContext.tsx のDEFAULT_SETTINGSと同じキー・デフォルト値を使う。
 */
export function getCurrentLanguage(): Lang {
  return readJson<Pick<UserSettings, 'language'>>(SETTINGS_KEY, { language: DEFAULT_LANG }).language
}

export function getDictionary(lang: Lang = getCurrentLanguage()): Dictionary {
  return DICTIONARIES[lang]
}
