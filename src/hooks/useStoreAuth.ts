import { useContext } from 'react'
import { StoreAuthContext } from '../context/storeAuthContextValue'
import type { StoreAuthContextValue } from '../context/storeAuthContextValue'

export function useStoreAuth(): StoreAuthContextValue {
  const ctx = useContext(StoreAuthContext)
  if (!ctx) throw new Error('useStoreAuth must be used within StoreAuthProvider')
  return ctx
}
