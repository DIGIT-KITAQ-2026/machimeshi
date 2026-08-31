import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import AiSearchBox from '../components/AiSearchBox'
import FilterPanel from '../components/FilterPanel'
import StoreCard from '../components/StoreCard'
import StoreDetailSheet from '../components/StoreDetailSheet'
import UserSettingsDrawer from '../components/UserSettingsDrawer'
import { useStoreAuth } from '../hooks/useStoreAuth'
import { getErrorMessage } from '../lib/errors'
import { applySearchFilters, addSearchHistory, runSearch } from '../services/searchService'
import { parseAiPrompt } from '../services/aiService'
import { emptyFilters } from '../types'
import type { SearchFilters, StoreSearchResult } from '../types'

interface NavState {
  q?: string
  filters?: Partial<SearchFilters>
}

/** 画面1: 検索画面（画面2 店舗詳細・画面3 ユーザ設定はこの画面内のオーバーレイとして実装） */
export default function SearchPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const navState = (location.state as NavState | null) ?? {}
  const { userId } = useStoreAuth()

  const [queryText, setQueryText] = useState(navState.q ?? '')
  const [results, setResults] = useState<StoreSearchResult[]>([])
  const [searching, setSearching] = useState(true)
  const [searchError, setSearchError] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({ ...emptyFilters, ...navState.filters })
  const [filterOpen, setFilterOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selected, setSelected] = useState<StoreSearchResult | null>(null)

  // 初回検索。App.tsxで/searchへの遷移ごとにkeyを変えて再マウントしているため、
  // このeffectはページが表示されるたび（新しい検索のたび）に一度だけ実行される。
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const r = await runSearch(navState.q ?? '')
        if (!cancelled) setResults(r)
      } catch (err) {
        if (!cancelled) setSearchError(getErrorMessage(err, '検索に失敗しました'))
      } finally {
        if (!cancelled) setSearching(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 検索文字列が変わったときだけ検索を実行する（フィルタ変更では再検索しない: 機能要件4）
  async function handleSearch(text: string) {
    setQueryText(text)
    setSearching(true)
    setSearchError('')
    if (userId) addSearchHistory(userId, text).catch(() => {})
    try {
      setResults(await runSearch(text))
    } catch (err) {
      setSearchError(getErrorMessage(err, '検索に失敗しました'))
    } finally {
      setSearching(false)
    }
  }

  async function handleAiSearch(prompt: string) {
    setSearching(true)
    setSearchError('')
    if (userId) addSearchHistory(userId, prompt).catch(() => {})
    try {
      const { queryText: aiQuery, filters: aiFilters } = await parseAiPrompt(prompt)
      setQueryText(aiQuery)
      setResults(await runSearch(aiQuery))
      setFilters({ ...emptyFilters, ...aiFilters })
    } catch (err) {
      setSearchError(getErrorMessage(err, 'AI検索に失敗しました'))
    } finally {
      setSearching(false)
    }
  }

  const filteredResults = useMemo(() => applySearchFilters(results, filters), [results, filters])

  return (
    <div className="page">
      <header className="page-header">
        <button type="button" className="icon-button" onClick={() => navigate('/')} aria-label="トップへ戻る">
          ←
        </button>
        <SearchBar defaultValue={queryText} onSubmit={handleSearch} />
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
        <AiSearchBox onSubmit={handleAiSearch} loading={searching} />
      </section>

      <div className="search-toolbar">
        <p className="search-toolbar__count">
          {searching ? '検索中...' : `検索結果（${filteredResults.length}件）`}
        </p>
        <button
          type="button"
          className="secondary-button"
          onClick={() => setFilterOpen((v) => !v)}
        >
          {filterOpen ? 'フィルタを閉じる' : 'フィルタ'}
        </button>
      </div>

      {filterOpen && <FilterPanel filters={filters} onChange={setFilters} />}

      {searchError && <p className="form-error">{searchError}</p>}

      <ul className="store-list">
        {filteredResults.map((result) => (
          <li key={result.store.id}>
            <StoreCard result={result} onClick={() => setSelected(result)} />
          </li>
        ))}
        {!searching && filteredResults.length === 0 && !searchError && (
          <p className="empty-message">条件に一致する店舗が見つかりませんでした。</p>
        )}
      </ul>

      <StoreDetailSheet result={selected} onClose={() => setSelected(null)} />
      <UserSettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
