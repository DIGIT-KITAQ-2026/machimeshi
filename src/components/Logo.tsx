import { Link } from 'react-router-dom'
import './Logo.css'

/** ヘッダー上部に表示するロゴ（アプリ名タイトル） */
export default function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="30" height="30">
          <defs>
            <radialGradient id="logo-shine" cx="30%" cy="20%" r="80%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="32" height="32" rx="9" fill="url(#logo-shine)" />
          <path
            d="M11 6.2c-1.1 1-1.1 2 0 3M16 5c-1.1 1-1.1 2 0 3M21 6.2c-1.1 1-1.1 2 0 3"
            fill="none"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M6 15.5h20a1 1 0 0 1 1 1 9 8 0 0 1-9 8h-4a9 8 0 0 1-9-8 1 1 0 0 1 1-1z"
            fill="#fff"
          />
          <path
            d="M6 15.5h20"
            stroke="var(--accent-dark)"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.55"
          />
          <ellipse cx="16" cy="24.3" rx="7.4" ry="1.3" fill="var(--accent-dark)" opacity="0.18" />
        </svg>
      </span>
      <span className="logo-text">
        <span className="logo-text-primary">マチ</span>
        <span className="logo-text-accent">めし</span>
      </span>
    </Link>
  )
}
