import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useStoreAuth } from '../hooks/useStoreAuth'

/** 店舗管理画面・店舗設定画面は未ログイン時に店舗ログイン画面へリダイレクトする */
export default function RequireStoreAuth({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useStoreAuth()
  if (!isLoggedIn) return <Navigate to="/store/auth" replace />
  return <>{children}</>
}
