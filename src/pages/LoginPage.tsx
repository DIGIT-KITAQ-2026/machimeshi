import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { CloseIcon, EyeIcon, EyeOffIcon } from '../components/icons'
import './LoginPage.css'

type Mode = 'login' | 'signup'

function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate('/store/register')
  }

  return (
    <div className="login-screen">
      <div className="login-topbar">
        <Logo />
        <button type="button" className="icon-button" aria-label="閉じる" onClick={() => navigate('/')}>
          <CloseIcon />
        </button>
      </div>

      <div className="login-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'login'}
          className={`login-tab${mode === 'login' ? ' login-tab-active' : ''}`}
          onClick={() => setMode('login')}
        >
          ログイン
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'signup'}
          className={`login-tab${mode === 'signup' ? ' login-tab-active' : ''}`}
          onClick={() => setMode('signup')}
        >
          新規登録
        </button>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-field">
          <span className="login-label">メールアドレス</span>
          <input type="email" name="email" autoComplete="email" required />
        </label>

        <label className="login-field">
          <span className="login-label">パスワード</span>
          <div className="login-password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
            <button
              type="button"
              className="login-password-toggle"
              aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </label>

        <div className="login-actions">
          <button type="button" className="login-cancel" onClick={() => navigate('/')}>
            キャンセル
          </button>
          <button type="submit" className="login-submit">
            {mode === 'login' ? 'ログイン' : '登録'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
