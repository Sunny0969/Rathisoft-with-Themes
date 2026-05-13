import { Link } from 'react-router-dom'
import { canonicalUrl } from './Seo'
import './Breadcrumbs.css'

export type BreadcrumbTrailItem = {
  name: string
  /** Path from site root, e.g. `/about` */
  path: string
}

function breadcrumbListJsonLd(items: BreadcrumbTrailItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: canonicalUrl(it.path),
    })),
  }
}

type BreadcrumbsProps = {
  items: BreadcrumbTrailItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null

  const ld = breadcrumbListJsonLd(items)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="rs-breadcrumb-bar">
        <nav className="rs-breadcrumb-inner rs-breadcrumb-nav" aria-label="Breadcrumb">
          <ol>
            {items.map((it, i) => {
              const last = i === items.length - 1
              return (
                <li key={`${it.path}-${it.name}`}>
                  {last ? (
                    <span className="rs-breadcrumb-current" aria-current="page">
                      {it.name}
                    </span>
                  ) : (
                    <Link to={it.path}>{it.name}</Link>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    </>
  )
}
