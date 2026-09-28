import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

function BrandMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      aria-hidden="true"
      className="brand-mark"
    >
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <line x1="9" y1="2" x2="9" y2="22" />
      <line x1="2" y1="8" x2="22" y2="8" />
      <line x1="2" y1="14" x2="22" y2="14" />
    </svg>
  )
}

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // A route change should land on a scrolled-up page. Closing the mobile
  // menu is handled directly by each nav link's onClick below, since that
  // covers every real navigation path without setting state from inside
  // this effect.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    function handleKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="site-header__bar">
          <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}>
            <BrandMark />
            <span>Ledger</span>
          </NavLink>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          <nav
            id="primary-nav"
            className={`primary-nav ${menuOpen ? 'primary-nav--open' : ''}`}
            aria-label="Primary"
          >
            <NavLink
              to="/"
              end
              className="primary-nav__link"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/transactions"
              className="primary-nav__link"
              onClick={() => setMenuOpen(false)}
            >
              Transactions
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main-content" className="site-main">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
