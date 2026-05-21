import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { HOME_INTERNAL_LINKS } from '../data/internalLinks'
import { ROUTES } from '../utils/routes'
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
    applySocialMeta({
      title: 'Page Not Found | RathiSoft',
      description: NOT_FOUND_DESCRIPTION,
      pageUrl,
    })

    return () => {
      removeRobotsMeta()
    }
  }, [pathname])

  return (
    <main className="page-not-found app-main">
      <Breadcrumbs
        items={[
          { name: 'Home', path: ROUTES.home },
          { name: 'Page not found', path: pathname },
        ]}
      />
      <div className="nf-wrap">
        <p className="nf-code" aria-hidden>
          404
        </p>
        <h1 className="nf-title">Page not found</h1>
        <p className="nf-lead">
          That URL doesn&apos;t exist or may have moved. Head back to a main section below—no broken ends.
        </p>

        <nav className="nf-nav" aria-label="Helpful pages on RathiSoft">
          <Link className="nf-btn nf-btn-primary" to={ROUTES.home}>
            Return to the RathiSoft Homepage
          </Link>
          {HOME_INTERNAL_LINKS.map((l) => (
            <Link key={l.to} className="nf-btn" to={l.to}>
              {l.label}
            </Link>
          ))}
          <Link className="nf-btn" to={ROUTES.themes}>
            Browse WordPress &amp; Shopify Theme Downloads
          </Link>
          <Link className="nf-btn" to={ROUTES.team}>
            Meet Our Lahore Software Team
          </Link>
        </nav>
      </div>
    </main>
  )
}
