import { Link } from 'react-router-dom'
import './Logo.css'

function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="19" height="19">
          <path
            d="M9 3.5c-.9.8-.9 1.7 0 2.6M12 2.7c-.9.8-.9 1.7 0 2.6M15 3.5c-.9.8-.9 1.7 0 2.6"
            fill="none"
            stroke="#fff"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path d="M3.5 11h17a8.5 7 0 0 1-17 0z" fill="#fff" />
          <path d="M3 11h18" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </span>
      <span className="logo-text">
        <span className="logo-text-primary">まち</span>
        <span className="logo-text-accent">めし</span>
      </span>
    </Link>
  )
}

export default Logo
