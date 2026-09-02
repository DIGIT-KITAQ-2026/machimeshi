import type { ReactNode } from 'react'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'
import './PageShell.css'

interface PageShellProps {
  children: ReactNode
  searchPlaceholder?: string
  searchHref?: string
  searchDefaultValue?: string
}

function PageShell({ children, searchPlaceholder, searchHref, searchDefaultValue }: PageShellProps) {
  return (
    <div className="page-shell">
      <AppHeader placeholder={searchPlaceholder} searchHref={searchHref} searchDefaultValue={searchDefaultValue} />
      <div className="page-content">{children}</div>
      <AppFooter />
    </div>
  )
}

export default PageShell
