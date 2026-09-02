import { Route, Routes } from 'react-router-dom'
import CheckInPage from './pages/CheckInPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SearchResultsPage from './pages/SearchResultsPage'
import StoreDetailPage from './pages/StoreDetailPage'
import StoreRegisterPage from './pages/StoreRegisterPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/store/register" element={<StoreRegisterPage />} />
      <Route path="/store/:id" element={<StoreDetailPage />} />
      <Route path="/store/:id/checkin" element={<CheckInPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
