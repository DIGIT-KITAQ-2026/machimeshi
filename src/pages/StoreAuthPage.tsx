import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStoreAuth } from '../hooks/useStoreAuth'
import { getErrorMessage } from '../lib/errors'

type Tab = 'login' | 'register'

/** 画面4: 店舗ログイン・登録画面 */
export default function StoreAuthPage() {
  const navigate = useNavigate()
  const { signIn, register } = useStoreAuth()
  const [tab, setTab] = useState<Tab>('login')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(loginEmail, loginPassword)
      navigate('/store/manage')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(registerName, registerEmail, registerPassword)
      navigate('/store/settings')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <button type="button" className="icon-button" onClick={() => navigate('/')} aria-label="トップへ戻る">
          ←
        </button>
        <h1 className="page-header__title">店舗の方へ</h1>
      </header>

      <div className="tab-row">
        <button
          type="button"
          className={`tab-row__item ${tab === 'login' ? 'tab-row__item--active' : ''}`}
          onClick={() => setTab('login')}
        >
          ログイン
        </button>
        <button
          type="button"
          className={`tab-row__item ${tab === 'register' ? 'tab-row__item--active' : ''}`}
          onClick={() => setTab('register')}
        >
          新規登録
        </button>
        <span
          className={`tab-row__indicator ${tab === 'register' ? 'tab-row__indicator--register' : ''}`}
          aria-hidden="true"
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      {tab === 'login' ? (
        <form className="form" onSubmit={handleLogin}>
          <label className="form__field">
            メールアドレス
            <input
              type="email"
              className="text-field"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </label>
          <label className="form__field">
            パスワード
            <input
              type="password"
              className="text-field"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </label>
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      ) : (
        <form className="form" onSubmit={handleRegister}>
          <label className="form__field">
            店名
            <input
              type="text"
              className="text-field"
              required
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />
          </label>
          <label className="form__field">
            メールアドレス
            <input
              type="email"
              className="text-field"
              required
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
          </label>
          <label className="form__field">
            パスワード
            <input
              type="password"
              className="text-field"
              required
              minLength={6}
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </label>
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? '登録中...' : '新規登録'}
          </button>
        </form>
      )}
    </div>
  )
}
