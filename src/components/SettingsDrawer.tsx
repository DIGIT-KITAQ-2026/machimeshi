import { useTheme } from '../context/useTheme'
import { ChevronRightIcon, CloseIcon } from './icons'
import ToggleSwitch from './ToggleSwitch'
import './SettingsDrawer.css'

interface SettingsDrawerProps {
  open: boolean
  onClose: () => void
}

const menuItems = ['言語', '連絡先', '利用規約', 'バージョン']

function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={`settings-drawer-overlay${open ? ' settings-drawer-overlay-open' : ''}`} onClick={onClose}>
      <aside
        className={`settings-drawer${open ? ' settings-drawer-open' : ''}`}
        onClick={(event) => event.stopPropagation()}
        aria-hidden={!open}
      >
        <div className="settings-drawer-header">
          <span>設定</span>
          <button type="button" className="icon-button" aria-label="閉じる" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <ul className="settings-drawer-list">
          {menuItems.map((item) => (
            <li key={item}>
              <button type="button" className="settings-drawer-item">
                <span>{item}</span>
                <ChevronRightIcon />
              </button>
            </li>
          ))}
          <li>
            <div className="settings-drawer-item">
              <span>ダークモード</span>
              <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} label="ダークモード" />
            </div>
          </li>
        </ul>
      </aside>
    </div>
  )
}

export default SettingsDrawer
