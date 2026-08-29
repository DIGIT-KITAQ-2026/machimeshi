import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import AiSearchBox from '../components/AiSearchBox'
import RecommendationList from '../components/RecommendationList'
import UserSettingsDrawer from '../components/UserSettingsDrawer'
import { useStoreAuth } from '../hooks/useStoreAuth'
import { addSearchHistory, getSearchHistory } from '../services/searchService'
import { getRecommendations, parseAiPrompt } from '../services/aiService'
import type { SearchFilters } from '../types'

/** 画面0: トップ画面 */
export default function TopPage() {
  const navigate = useNavigate()
  const { userId } = useStoreAuth()
  const [settingsOpen, setSettingsOpen] = useState(false)
  // 初期値はおすすめの生成ロジック側のデフォルト文言。検索履歴の取得が終わり次第差し替える。
  const [recommendations, setRecommendations] = useState<string[]>(() => getRecommendations([]))

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    getSearchHistory(userId)
      .then((history) => {
        if (!cancelled) setRecommendations(getRecommendations(history))
      })
      .catch(() => {
        // おすすめは付加的な機能のため、取得に失敗してもデフォルト文言のまま表示を継続する
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  function goSearch(queryText: string, filters?: Partial<SearchFilters>) {
    if (userId) addSearchHistory(userId, queryText).catch(() => {})
    navigate('/search', { state: { q: queryText, filters } })
  }

  function handleAiSearch(prompt: string) {
    const { queryText, filters } = parseAiPrompt(prompt)
    goSearch(queryText, filters)
  }

  return (
    <div className="page">
      <header className="page-header">
        <SearchBar onSubmit={(text) => goSearch(text)} />
        <button
          type="button"
          className="icon-button"
          onClick={() => setSettingsOpen(true)}
          aria-label="設定"
        >
          ☰
        </button>
      </header>

      <section className="section">
        <AiSearchBox onSubmit={handleAiSearch} />
      </section>

      <section className="section">
        <h2 className="section__title">あなたへのおすすめ</h2>
        <RecommendationList suggestions={recommendations} onSelect={(text) => goSearch(text)} />
      </section>

      <div className="page__spacer" />

      <footer className="top-footer">
        <button type="button" className="store-link-button" onClick={() => navigate('/store/auth')}>
          <span className="store-link-button__icon">🧑‍🍳</span>
          店舗の方はこちら（開いてください）
        </button>
      </footer>

      <UserSettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
