import { useUserSettings } from '../hooks/useUserSettings'

interface UserSettingsDrawerProps {
  open: boolean
  onClose: () => void
}

const APP_VERSION = '0.1.0'

/** ユーザ設定機能（機能要件7・画面3）: 右からスライドするドロワー */
export default function UserSettingsDrawer({ open, onClose }: UserSettingsDrawerProps) {
  const { settings, updateSettings } = useUserSettings()

  return (
    <div className={`drawer-backdrop ${open ? 'drawer-backdrop--open' : ''}`} onClick={onClose}>
      <aside
        className={`drawer ${open ? 'drawer--open' : ''}`}
        onClick={(e) => e.stopPropagation()}
        aria-hidden={!open}
      >
        <div className="drawer__header">
          <h2>設定</h2>
          <button type="button" className="sheet__close" onClick={onClose} aria-label="閉じる">
            ×
          </button>
        </div>

        <div className="drawer__item">
          <span>言語</span>
          <select
            value={settings.language}
            onChange={(e) =>
              updateSettings({ language: e.target.value as typeof settings.language })
            }
          >
            <option value="日本語">日本語</option>
            <option value="English">English</option>
          </select>
        </div>

        <div className="drawer__item">
          <span>連絡先</span>
          <span className="drawer__value">support@machimeshi.example.com</span>
        </div>

        <div className="drawer__item">
          <span>利用規約</span>
          <span className="drawer__value">準備中</span>
        </div>

        <div className="drawer__item">
          <span>バージョン</span>
          <span className="drawer__value">{APP_VERSION}</span>
        </div>

        <div className="drawer__item">
          <span>ダークモード</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => updateSettings({ darkMode: e.target.checked })}
            />
            <span className="toggle-switch__slider" />
          </label>
        </div>
      </aside>
    </div>
  )
}
