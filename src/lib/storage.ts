// localStorageの読み書きをまとめた薄いヘルパー。
// services/*はSupabase移行済みのため、現在は src/context/UserSettingsContext.tsx
// （DBs.mdにテーブルが無いユーザー設定）専用。

const PREFIX = 'machimeshi:'

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // 保存に失敗しても致命的ではないため握りつぶす（プライベートモード等を想定）
  }
}

export function removeItem(key: string): void {
  window.localStorage.removeItem(PREFIX + key)
}
