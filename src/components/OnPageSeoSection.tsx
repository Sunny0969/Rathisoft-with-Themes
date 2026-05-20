import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './OnPageSeoSection.css'

export type OnPageSeoInternalLink = {
  to: string
  label: string
}

type Props = {
  /** Stable id for `aria-labelledby` / fragment links */
  sectionId: string
  heading: string
  /** Opening block — primary keyword should appear in the first ~100 words */
  lead: ReactNode
  children?: ReactNode
  /** Descriptive internal anchors (minimum three recommended) */
  links: OnPageSeoInternalLink[]
  /** Card grid, prose panel, and eyebrow — matches homepage / portfolio editorial blocks */
  theme?: 'default' | 'boxed'
  /** Uppercase label strip above the heading (boxed theme only) */
  eyebrow?: string
}

export function OnPageSeoSection({
  sectionId,
  heading,
  lead,
  children,
  links,
  theme = 'default',
  eyebrow,
}: Props) {
  const isBoxed = theme === 'boxed'
  const sectionClass = isBoxed ? 'on-page-seo on-page-seo--boxed' : 'on-page-seo'

  const proseBlock = (
    <>
      <div className="on-page-seo__lead">{lead}</div>
      {children ? <div className="on-page-seo__body">{children}</div> : null}
    </>
  )

  return (
    <section className={sectionClass} aria-labelledby={sectionId}>
      <div className="on-page-seo__inner">
        {isBoxed && eyebrow ? <div className="on-page-seo__eyebrow">{eyebrow}</div> : null}
        <h2 id={sectionId} className="on-page-seo__title">
          {heading}
        </h2>
        {isBoxed ? (
          <div className="on-page-seo__content-row">
            <div className="on-page-seo__prose-card">
              <div className="on-page-seo__prose-inner">{proseBlock}</div>
            </div>
            <nav className="on-page-seo__nav" aria-label="Explore more on this website">
              <ul>
                {links.map((l) => (
                  <li key={`${l.to}-${l.label}`}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        ) : (
          <>
            {proseBlock}
            <nav className="on-page-seo__nav" aria-label="Explore more on this website">
              <ul>
                {links.map((l) => (
                  <li key={`${l.to}-${l.label}`}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
        <p className="on-page-seo__authority">
          We align public guidance with{' '}
          <a
            href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&apos;s SEO Starter Guide
          </a>{' '}
          and ship fast UX benchmarked against{' '}
          <a href="https://web.dev/articles/vitals" target="_blank" rel="noopener noreferrer">
            Core Web Vitals guidance on web.dev
          </a>
          .
        </p>
      </div>
    </section>
  )
}
