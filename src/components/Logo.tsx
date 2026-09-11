import { Link } from 'react-router-dom'
import './Logo.css'

/**
 * ヘッダー上部に表示するロゴ（アプリ名タイトル）。
 *
 * 以前は「マチ」「めし」の文字を`HGPSoeiKakugothicUB`というフォントで焼き込んだ
 * SVG画像（rogo_dark.svg / rogo_white.svg）を<img>で表示していた。このフォントは
 * 開発機（Windows）にはインストールされていたが、スマホなど他の端末には無いため、
 * <img>で読み込むSVG内のテキストがその端末の代替フォントで描画され、見た目が変わって
 * しまっていた。ここではアイコン部分のみSVGで描き、文字部分はGoogle Fonts経由で
 * 読み込んでいる「M PLUS Rounded 1c」（index.htmlでロード済み）を使った実テキストに
 * 置き換えることで、どの端末でも同じフォントで表示されるようにしている。
 */
export default function Logo() {
  return (
    <Link to="/" className="logo">
      <svg className="logo-icon" viewBox="200 100 100 100" aria-hidden="true">
        <rect x="200" y="100" width="100" height="100" rx="10" ry="10" fill="#ff8566" />
        <rect x="205" y="105" width="90" height="90" rx="10" ry="10" fill="#ff8566" stroke="#ff8566" />
        <rect x="205" y="105" width="90" height="90" rx="10" ry="10" fill="#ffab96" stroke="#ff8566" />
        <path fill="#fff" stroke="#fff" d="M 210.123 155.795 L 290 155 C 289.78 200 210.078 200 210.123 155.795 Z" />
        <rect x="235" y="184.634" width="30" height="6" fill="#fff" stroke="#fff" />
        <ellipse cx="250" cy="135" rx="15" ry="15" fill="none" stroke="#fff" strokeWidth="2" />
        <polygon
          fill="#fff"
          stroke="#fff"
          points="248.967 124.675 250.993 124.711 250.993 135.754 256.286 138.766 255.257 140.494 248.971 136.711"
        />
      </svg>
      <span className="logo-wordmark">
        <span className="logo-wordmark__primary">マチ</span>
        <span className="logo-wordmark__accent">めし</span>
      </span>
    </Link>
  )
}
