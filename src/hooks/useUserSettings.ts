import { useContext } from 'react'
import { UserSettingsContext } from '../context/userSettingsContextValue'
import type { UserSettingsContextValue } from '../context/userSettingsContextValue'

export function useUserSettings(): UserSettingsContextValue {
  const ctx = useContext(UserSettingsContext)
  if (!ctx) throw new Error('useUserSettings must be used within UserSettingsProvider')
  return ctx
}
