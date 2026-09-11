import { useUserSettings } from '../hooks/useUserSettings'
import { useTranslation } from '../hooks/useTranslation'
import type { UserSettings } from '../types'

interface UserSettingsDrawerProps {
  open: boolean
  onClose: () => void
}

const APP_VERSION = '0.1.0'

// 表示言語の選択肢そのものであり、UserSettings.languageの実値なので翻訳しない
// （辞書のキーではなく、そのまま保存・比較される文字列）。
const LANGUAGES: Array<UserSettings['language']> = ['日本語', 'English', '한국어']

/** ユーザ設定機能（機能要件7・画面3）: 右からスライドするドロワー */
export default function UserSettingsDrawer({ open, onClose }: UserSettingsDrawerProps) {
  const { settings, updateSettings } = useUserSettings()
  const t = useTranslation()

  return (
    <div className={`drawer-backdrop ${open ? 'drawer-backdrop--open' : ''}`} onClick={onClose}>
      <aside
        className={`drawer ${open ? 'drawer--open' : ''}`}
        onClick={(e) => e.stopPropagation()}
        aria-hidden={!open}
      >
        <div className="drawer__header">
          <h2>{t.common.settings}</h2>
          <button type="button" className="sheet__close" onClick={onClose} aria-label={t.common.close}>
            ×
          </button>
        </div>

        <div className="drawer__item drawer__item--stack">
          <span>{t.settingsDrawer.language}</span>
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
          <span>{t.settingsDrawer.contact}</span>
          <span className="drawer__value">support@machimeshi.example.com</span>
        </div>

        <div className="drawer__item">
          <span>{t.settingsDrawer.terms}</span>
          <span className="drawer__value">{t.settingsDrawer.preparing}</span>
        </div>

        <div className="drawer__item">
          <span>{t.settingsDrawer.version}</span>
          <span className="drawer__value">{APP_VERSION}</span>
        </div>

        <div className="drawer__item">
          <span>{t.settingsDrawer.darkMode}</span>
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
