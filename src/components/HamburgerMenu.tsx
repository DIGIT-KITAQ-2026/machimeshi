interface HamburgerMenuProps {
  open: boolean
  onClose: () => void
  storeName: string
  onNavigateSettings: () => void
  onLogout: () => void
}

/** 画面6のハンバーガーメニュー: 右から表示され、設定画面へのリンクを含む */
export default function HamburgerMenu({
  open,
  onClose,
  storeName,
  onNavigateSettings,
  onLogout,
}: HamburgerMenuProps) {
  return (
    <div className={`drawer-backdrop ${open ? 'drawer-backdrop--open' : ''}`} onClick={onClose}>
      <aside
        className={`drawer ${open ? 'drawer--open' : ''}`}
        onClick={(e) => e.stopPropagation()}
        aria-hidden={!open}
      >
        <div className="drawer__header">
          <h2>{storeName}</h2>
          <button type="button" className="sheet__close" onClick={onClose} aria-label="閉じる">
            ×
          </button>
        </div>
        <nav className="drawer__nav">
          <button type="button" className="drawer__nav-item" onClick={onNavigateSettings}>
            ⚙️ 設定
          </button>
          <button type="button" className="drawer__nav-item" onClick={onLogout}>
            🚪 ログアウト
          </button>
        </nav>
      </aside>
    </div>
  )
}
