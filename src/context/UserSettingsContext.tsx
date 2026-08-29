// 機能要件7: ユーザ設定機能。
// ユーザが変更した設定を保持し、ダークモードなどはアプリ全体（<html>のdata-theme属性）に反映する。

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { readJson, writeJson } from '../lib/storage'
import { UserSettingsContext } from './userSettingsContextValue'
import type { UserSettingsContextValue } from './userSettingsContextValue'
import type { UserSettings } from '../types'

const KEY = 'userSettings'

const DEFAULT_SETTINGS: UserSettings = {
  language: '日本語',
  darkMode: false,
}

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() =>
    readJson<UserSettings>(KEY, DEFAULT_SETTINGS),
  )

  useEffect(() => {
    writeJson(KEY, settings)
    document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light')
  }, [settings])

  const value = useMemo<UserSettingsContextValue>(
    () => ({
      settings,
      updateSettings: (partial) => setSettings((prev) => ({ ...prev, ...partial })),
    }),
    [settings],
  )

  return <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>
}
