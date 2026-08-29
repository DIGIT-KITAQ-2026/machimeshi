import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { UserSettingsProvider } from './context/UserSettingsContext'
import { StoreAuthProvider } from './context/StoreAuthContext'
import RequireStoreAuth from './components/RequireStoreAuth'
import TopPage from './pages/TopPage'
import SearchPage from './pages/SearchPage'
import StoreAuthPage from './pages/StoreAuthPage'
import StoreManagePage from './pages/StoreManagePage'
import StoreSettingsPage from './pages/StoreSettingsPage'

function App() {
  const location = useLocation()

  return (
    <UserSettingsProvider>
      <StoreAuthProvider>
        <Routes>
          <Route path="/" element={<TopPage />} />
          {/*
            /searchへ遷移するたび（トップ画面やAI検索からの新しい検索のたび）にkeyを変えて
            SearchPageを再マウントする。これにより「ナビゲーション時の検索条件をstateから
            読み込む」処理をuseEffect+setStateではなく、useStateの初期値だけで完結できる。
          */}
          <Route path="/search" element={<SearchPage key={location.key} />} />
          <Route path="/store/auth" element={<StoreAuthPage />} />
          <Route
            path="/store/manage"
            element={
              <RequireStoreAuth>
                <StoreManagePage />
              </RequireStoreAuth>
            }
          />
          <Route
            path="/store/settings"
            element={
              <RequireStoreAuth>
                <StoreSettingsPage />
              </RequireStoreAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </StoreAuthProvider>
    </UserSettingsProvider>
  )
}

export default App
