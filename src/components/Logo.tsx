import { Link } from 'react-router-dom'
import logoDark from '../assets/rogo_dark.svg'
import logoWhite from '../assets/rogo_white.svg'
import './Logo.css'

/** ヘッダー上部に表示するロゴ（アプリ名タイトル） */
export default function Logo() {
  return (
    <Link to="/" className="logo">
      <img src={logoDark} alt="マチめし" className="logo-img logo-img--light" />
      <img src={logoWhite} alt="マチめし" className="logo-img logo-img--dark" />
    </Link>
  )
}
