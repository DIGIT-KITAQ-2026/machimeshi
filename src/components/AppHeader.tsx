import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { MenuIcon, SearchIcon } from './icons'
import Logo from './Logo'
import SettingsDrawer from './SettingsDrawer'
import './AppHeader.css'

interface AppHeaderProps {
  placeholder?: string
  searchHref?: string
  searchDefaultValue?: string
}

function AppHeader({ placeholder = 'お店を検索', searchHref, searchDefaultValue = '' }: AppHeaderProps) {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!searchHref) return
    const query = new FormData(event.currentTarget).get('q')?.toString().trim() ?? ''
    navigate(query ? `${searchHref}?q=${encodeURIComponent(query)}` : searchHref)
  }

  return (
    <header className="app-header">
      <div className="app-header-top">
        <Logo />
        <button type="button" className="icon-button menu-button" aria-label="設定" onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
        </button>
      </div>
      <form className="search-bar" role="search" onSubmit={handleSubmit}>
        <SearchIcon />
        <input
          type="text"
          name="q"
          placeholder={placeholder}
          aria-label={placeholder}
          defaultValue={searchDefaultValue}
          key={searchDefaultValue}
        />
      </form>
      <SettingsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  )
}

export default AppHeader
