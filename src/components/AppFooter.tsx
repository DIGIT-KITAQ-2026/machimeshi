import { Link } from 'react-router-dom'
import { PersonIcon } from './icons'
import './AppFooter.css'

function AppFooter() {
  return (
    <footer className="app-footer">
      <Link className="ad-banner" to="/login">
        企業の方へ
      </Link>
      <div className="footer-actions">
        <button type="button" className="ask-button">
          聞いてください
        </button>
        <button type="button" className="icon-button profile-button" aria-label="プロフィール">
          <PersonIcon />
        </button>
      </div>
    </footer>
  )
}

export default AppFooter
