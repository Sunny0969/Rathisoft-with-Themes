import type { ReactNode } from 'react'
import './OnPageSeoSection.css'

type Props = {
  /** Stable id for `aria-labelledby` / fragment links */
  sectionId: string
  heading: string
  /** Opening block — include internal <Link>s in prose, not separate link lists */
  lead: ReactNode
  children?: ReactNode
  theme?: 'default' | 'boxed'
  eyebrow?: string
}

export function OnPageSeoSection({
  sectionId,
  heading,
  lead,
  children,
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
          <div className="on-page-seo__prose-card">
            <div className="on-page-seo__prose-inner">{proseBlock}</div>
          </div>
        ) : (
          proseBlock
        )}
        <p className="on-page-seo__authority">
          We align public guidance with{' '}
          <a
            href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Google&apos;s SEO Starter Guide
          </a>{' '}
          and ship fast UX benchmarked against{' '}
          <a href="https://web.dev/articles/vitals" target="_blank" rel="noopener noreferrer nofollow">
            Core Web Vitals guidance on web.dev
          </a>
          .
        </p>
      </div>
    </section>
  )
}
