import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  SITE_ORIGIN,
  applySocialMeta,
  removeCanonicalLink,
  removeRobotsMeta,
  upsertMeta,
} from '../components/Seo'
import './NotFound.css'

const NOT_FOUND_DESCRIPTION =
  'The page you requested could not be found. Explore RathiSoft services, portfolio, or get in touch from Lahore.'

export function NotFound() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = 'Page Not Found | RathiSoft'

    upsertMeta('name', 'robots', 'noindex, follow')
    upsertMeta('name', 'description', NOT_FOUND_DESCRIPTION)

    removeCanonicalLink()

    const pageUrl = `${SITE_ORIGIN}${pathname}`
    applySocialMeta('Page Not Found | RathiSoft', NOT_FOUND_DESCRIPTION, pageUrl)

    return () => {
      removeRobotsMeta()
    }
  }, [pathname])

  return (
    <main className="page-not-found app-main">
      <div className="nf-wrap">
        <p className="nf-code" aria-hidden>
          404
        </p>
        <h1 className="nf-title">Page not found</h1>
        <p className="nf-lead">
          That URL doesn&apos;t exist or may have moved. Head back to a main section below—no broken ends.
        </p>

        <nav className="nf-nav" aria-label="Main sections">
          <Link className="nf-btn nf-btn-primary" to="/">
            Home
          </Link>
          <Link className="nf-btn" to="/services">
            Services
          </Link>
          <Link className="nf-btn" to="/work">
            Portfolio
          </Link>
          <Link className="nf-btn" to="/packages">
            Packages
          </Link>
          <Link className="nf-btn" to="/about">
            About
          </Link>
          <Link className="nf-btn" to="/contact">
            Contact
          </Link>
          <Link className="nf-btn" to="/themes">
            Themes store
          </Link>
          <Link className="nf-btn" to="/team">
            Team
          </Link>
        </nav>
      </div>
    </main>
  )
}
