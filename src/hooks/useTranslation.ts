import { useUserSettings } from './useUserSettings'
import { DICTIONARIES } from '../i18n'
import type { Dictionary } from '../i18n'

/** 現在のユーザー設定（言語）に対応する翻訳辞書を返す */
export function useTranslation(): Dictionary {
  const { settings } = useUserSettings()
  return DICTIONARIES[settings.language]
}
