import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Packages', href: '/packages' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Themes', href: '/themes' },
] as const

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), [])

  useEffect(() => {
    const onScroll = () => {
      const nav = navRef.current
      if (!nav) return
      nav.style.boxShadow =
        window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,0.3)' : 'none'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen, closeMobile])

  return (
    <header className="rs-header">
      <nav ref={navRef} id="mainNav">
        <div className="nav-in">
          <Link to="/" className="logo" title="Rathisoft Home">
            <div className="logo-box">R</div>
            <span className="logo-text">
              Rathi<span>soft</span>
            </span>
          </Link>
          <ul className="nav-links">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link to={href}>{label}</Link>
              </li>
            ))}
          </ul>
          <Link to="/contact" className="nav-btn">
            Get a free quote →
          </Link>
          <button
            type="button"
            className={`mob-btn${mobileOpen ? ' open' : ''}`}
            id="mobBtn"
            onClick={toggleMobile}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      <div
        className={`rs-mob-overlay${mobileOpen ? ' rs-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <Link to="/" onClick={closeMobile}>
          Home
        </Link>
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} to={href} onClick={closeMobile}>
            {label}
          </Link>
        ))}
      </div>
    </header>
  )
}
