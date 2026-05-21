import { Link } from 'react-router-dom'
import type { InternalLinkItem } from '../data/internalLinks'
import './InternalLinksNav.css'

type InternalLinksNavProps = {
  links: InternalLinkItem[]
  /** Accessible name for the nav landmark */
  ariaLabel?: string
  heading?: string
  className?: string
}

export function InternalLinksNav({
  links,
  ariaLabel = 'Related pages on this website',
  heading = 'Explore related pages',
  className = '',
}: InternalLinksNavProps) {
  if (links.length === 0) return null

  return (
    <aside
      className={`internal-links${className ? ` ${className}` : ''}`}
      aria-labelledby={heading ? 'internal-links-heading' : undefined}
    >
      {heading ? (
        <h2 id="internal-links-heading" className="internal-links__title">
          {heading}
        </h2>
      ) : null}
      <nav className="internal-links__nav" aria-label={ariaLabel}>
        <ul>
          {links.map((l) => (
            <li key={`${l.to}-${l.label}`}>
              <Link to={l.to}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
