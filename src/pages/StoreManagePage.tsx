import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStoreAuth } from '../hooks/useStoreAuth'
import { getErrorMessage } from '../lib/errors'
import * as visitService from '../services/visitService'
import SeatTypeToggle from '../components/SeatTypeToggle'
import PeopleCounter from '../components/PeopleCounter'
import GroupIdField from '../components/GroupIdField'
import ActiveGroupList from '../components/ActiveGroupList'
import HamburgerMenu from '../components/HamburgerMenu'
import type { IdGenerating, SeatType, Visit } from '../types'

/**
 * 画面6: 店舗管理画面（入店・退店）。
 * RequireStoreAuthでラップされているため、この画面は必ずログイン済み（store非null）の
 * 状態で新規にマウントされる。グループIDの初期候補・在店中グループの初期一覧は
 * Supabaseへの問い合わせが必要なため、マウント時にuseEffectで非同期取得する。
 */
export default function StoreManagePage() {
  const navigate = useNavigate()
  const { store, signOut } = useStoreAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const [seatType, setSeatType] = useState<SeatType>('table')
  const [peopleCount, setPeopleCount] = useState(1)
  const [groupId, setGroupId] = useState('')
  const [enterError, setEnterError] = useState('')

  const [activeGroups, setActiveGroups] = useState<Visit[]>([])
  const [selectedExitId, setSelectedExitId] = useState<string | null>(null)
  const [exitError, setExitError] = useState('')
  const [loading, setLoading] = useState(true)

  const refreshGroupId = useCallback(async (storeId: string, idGenerating: IdGenerating) => {
    setGroupId(
      idGenerating === 'increment' ? String(await visitService.suggestNextGroupId(storeId)) : '',
    )
  }, [])

  const refreshActiveGroups = useCallback(async (storeId: string) => {
    setActiveGroups(await visitService.getActiveGroups(storeId))
  }, [])

  useEffect(() => {
    if (!store) return
    let cancelled = false
    // refreshGroupId/refreshActiveGroups（イベントハンドラ用のuseCallback）を経由せず、
    // ここで直接取得してawait後にsetStateする（react-hooks/set-state-in-effect対策）。
    ;(async () => {
      const [nextGroupId, groups] = await Promise.all([
        store.idGenerating === 'increment' ? visitService.suggestNextGroupId(store.id) : null,
        visitService.getActiveGroups(store.id),
      ])
      if (cancelled) return
      setGroupId(nextGroupId !== null ? String(nextGroupId) : '')
      setActiveGroups(groups)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store?.id])

  if (!store) return null

  async function handleEnter() {
    setEnterError('')
    const id = Number(groupId)
    if (!groupId || Number.isNaN(id)) {
      setEnterError('グループIDを入力してください')
      return
    }
    try {
      await visitService.enterGuest(store!.id, seatType, peopleCount, id)
      setPeopleCount(1)
      await refreshGroupId(store!.id, store!.idGenerating)
      await refreshActiveGroups(store!.id)
    } catch (err) {
      setEnterError(getErrorMessage(err, '入店処理に失敗しました'))
    }
  }

  async function handleExit() {
    setExitError('')
    if (!selectedExitId) {
      setExitError('退店するグループを選択してください')
      return
    }
    try {
      await visitService.exitGuest(selectedExitId)
      setSelectedExitId(null)
      await refreshActiveGroups(store!.id)
    } catch (err) {
      setExitError(getErrorMessage(err, '退店処理に失敗しました'))
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-header__title">{store.name}</h1>
        <button
          type="button"
          className="icon-button"
          onClick={() => setMenuOpen(true)}
          aria-label="メニュー"
        >
          ☰
        </button>
      </header>

      <section className="section card">
        <h2 className="section__title">入店</h2>

        <div className="form__field">
          席状況
          <SeatTypeToggle value={seatType} onChange={setSeatType} />
        </div>

        <div className="form__field">
          人数
          <PeopleCounter value={peopleCount} onChange={setPeopleCount} />
        </div>

        <div className="form__field">
          グループID
          <GroupIdField value={groupId} onChange={setGroupId} />
        </div>

        {enterError && <p className="form-error">{enterError}</p>}

        <button type="button" className="primary-button" onClick={handleEnter} disabled={loading}>
          入店
        </button>
      </section>

      <section className="section card">
        <h2 className="section__title">退店</h2>

        <div className="form__field">
          グループID
          {loading ? (
            <p className="empty-message">読み込み中...</p>
          ) : (
            <ActiveGroupList
              groups={activeGroups}
              selectedId={selectedExitId}
              onSelect={setSelectedExitId}
            />
          )}
        </div>

        {exitError && <p className="form-error">{exitError}</p>}

        <button type="button" className="primary-button" onClick={handleExit} disabled={loading}>
          退店
        </button>
      </section>

      <HamburgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        storeName={store.name}
        onNavigateSettings={() => {
          setMenuOpen(false)
          navigate('/store/settings')
        }}
        onLogout={() => {
          // 先に画面遷移してからサインアウトする。signOut完了を待ってからnavigateすると、
          // store状態がnullになったタイミングでRequireStoreAuthが先に/store/authへ
          // リダイレクトしてしまい、この後のnavigate('/')と競合してしまうため。
          setMenuOpen(false)
          navigate('/')
          signOut().catch(() => {})
        }}
      />
    </div>
  )
}
