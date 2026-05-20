import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const HERO_SELECTOR =
  '#hero, main .hero, .page-about .hero, .page-packages .hero, .page-work .hero, .page-team .hero, .page-themes .hero, .page-courses .hero'

function findPageHero(): HTMLElement | null {
  return document.querySelector<HTMLElement>(HERO_SELECTOR)
}

const NAV_LINKS = [
  // { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/work' },
  { label: 'Packages', href: '/packages' },
  { label: 'About Us', href: '/about' },
  // { label: 'Contact', href: '/contact' },
  { label: 'Themes', href: '/themes' },
  // { label: 'E-Learning', href: '/courses' },
] as const

export function Header() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  /** Solid nav background (false = transparent blur over hero). */
  const [solid, setSolid] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), [])

  const updateHeaderMode = useCallback(() => {
    const hero = findPageHero()
    if (!hero) {
      setSolid(true)
      return
    }
    if (window.scrollY < 8) {
      setSolid(false)
      return
    }
    const height = hero.offsetHeight
    if (height < 80) {
      setSolid(false)
      return
    }
    const top = hero.getBoundingClientRect().top + window.scrollY
    const halfHero = top + height / 2
    setSolid(window.scrollY >= halfHero)
  }, [])

  useLayoutEffect(() => {
    updateHeaderMode()
  }, [pathname, updateHeaderMode])

  useEffect(() => {
    let raf = 0
    const onScrollOrResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateHeaderMode)
    }

    onScrollOrResize()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })

    const hero = findPageHero()
    const ro = hero ? new ResizeObserver(onScrollOrResize) : null
    if (hero && ro) ro.observe(hero)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      ro?.disconnect()
    }
  }, [pathname, updateHeaderMode])

  const headerMode = solid || mobileOpen ? 'rs-header--solid' : 'rs-header--overlay'

  /** Warm full wordmark in memory so first hover/focus doesn’t wait on decode. */
  useEffect(() => {
    const img = new Image()
    img.src = '/logo/RathiSoft.webp'
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
    <header className={`rs-header ${headerMode}`}>
      <nav ref={navRef} id="mainNav">
        <div className="nav-in">
          {/*
            Link stays w-9 so nav links don’t shift; wordmark is clipped in a strip at left-9 with overflow-hidden.
            Hover/focus-within runs translateX(-100%→0) on the img only (will-change + ease-in-out ~450ms) — no width animation.
          */}
          <Link
            to="/"
            title="Rathisoft Home"
            className="group relative inline-flex h-9 w-9 shrink-0 items-center justify-center outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(19,19,26,0.92)]"
          >
            <img
              src="/logo/simpleR.webp"
              alt="RathiSoft logo — Lahore web development agency"
              width={36}
              height={36}
              decoding="async"
              className="relative z-10 h-9 w-9 object-contain"
              draggable={false}
            />
            <div
              className="pointer-events-none absolute left-9 top-0 z-[1] h-9 w-[min(260px,calc(100vw-8rem))] overflow-hidden sm:w-60"
              aria-hidden="true"
            >
              <img
                src="/logo/athiSoft.webp"
                alt="RathiSoft wordmark"
                aria-hidden
                width={260}
                height={36}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-9 w-auto max-w-[260px] origin-left object-contain object-left will-change-transform transition-transform duration-[450ms] ease-in-out -translate-x-full group-hover:translate-x-0 group-focus-within:translate-x-0"
              />
            </div>
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
