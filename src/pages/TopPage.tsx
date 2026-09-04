import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import AiSearchBox from '../components/AiSearchBox'
import RecommendationList from '../components/RecommendationList'
import UserSettingsDrawer from '../components/UserSettingsDrawer'
import { useStoreAuth } from '../hooks/useStoreAuth'
import { getErrorMessage } from '../lib/errors'
import { addSearchHistory, getSearchHistory } from '../services/searchService'
import { getAiRecommendations, getRecommendations, parseAiPrompt } from '../services/aiService'
import type { SearchFilters } from '../types'

/** 画面0: トップ画面 */
export default function TopPage() {
  const navigate = useNavigate()
  const { userId } = useStoreAuth()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [aiSearching, setAiSearching] = useState(false)
  const [aiError, setAiError] = useState('')
  // 初期値はおすすめの生成ロジック側のデフォルト文言。検索履歴の取得が終わり次第差し替える。
  const [recommendations, setRecommendations] = useState<string[]>(() => getRecommendations([]))

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    ;(async () => {
      try {
        const history = await getSearchHistory(userId)
        if (cancelled) return
        // AI応答を待つ間は、即座に出せるヒューリスティック版をまず表示しておく
        setRecommendations(getRecommendations(history))
        const aiSuggestions = await getAiRecommendations(history)
        if (!cancelled) setRecommendations(aiSuggestions)
      } catch {
        // おすすめは付加的な機能のため、取得に失敗してもデフォルト文言のまま表示を継続する
      }
    })()
    return () => {
      cancelled = true
    }
  }, [userId])

  function goSearch(queryText: string, filters?: Partial<SearchFilters>) {
    if (userId) addSearchHistory(userId, queryText).catch(() => {})
    navigate('/search', { state: { q: queryText, filters } })
  }

  async function handleAiSearch(prompt: string) {
    setAiSearching(true)
    setAiError('')
    try {
      const { queryText, filters } = await parseAiPrompt(prompt)
      goSearch(queryText, filters)
    } catch (err) {
      setAiError(getErrorMessage(err, 'AI検索に失敗しました'))
      setAiSearching(false)
    }
    // 成功時はgoSearch()で画面遷移するため、setAiSearching(false)は呼ばない
    // （このページがアンマウントされる前提のため、失敗時のみ明示的に戻す）
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
        <AiSearchBox onSubmit={handleAiSearch} loading={aiSearching} />
        {aiError && <p className="form-error">{aiError}</p>}
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
