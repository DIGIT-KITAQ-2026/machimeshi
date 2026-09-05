import { useUserSettings } from '../hooks/useUserSettings'
import type { UserSettings } from '../types'

interface UserSettingsDrawerProps {
  open: boolean
  onClose: () => void
}

const APP_VERSION = '0.1.0'

const LANGUAGES: Array<UserSettings['language']> = ['日本語', 'English', '한국어']

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

        <div className="drawer__item drawer__item--stack">
          <span>言語</span>
          <div className="segmented">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`segmented__item ${settings.language === lang ? 'segmented__item--active' : ''}`}
                onClick={() => updateSettings({ language: lang })}
              >
                {lang}
              </button>
            ))}
          </div>
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
