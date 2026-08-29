// Context本体だけを切り出したファイル。
// react-refresh/only-export-components対策として、コンポーネント（Provider）を
// 定義するファイルとContext本体/hookを定義するファイルを分けている。

import { createContext } from 'react'
import type { UserSettings } from '../types'

export interface UserSettingsContextValue {
  settings: UserSettings
  updateSettings: (partial: Partial<UserSettings>) => void
}

export const UserSettingsContext = createContext<UserSettingsContextValue | null>(null)
