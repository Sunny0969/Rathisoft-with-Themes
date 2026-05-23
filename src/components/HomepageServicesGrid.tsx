import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HOMEPAGE_SERVICE_CARDS,
  type HomepageServiceCard,
} from '../data/homepageServiceCards'
import { portfolioPathForService } from '../data/servicePortfolioLinks'
import { ROUTES } from '../utils/routes'
import '../pages/Home.css'
import '../styles/services-catalog-grid.css'

type HomepageServicesGridProps = {
  /** Home: links + CTA; Services page: display-only with hover animation */
  interactive?: boolean
  /** Which cards to show (default: all) */
  items?: HomepageServiceCard[]
  /** Home: start with 4 cards + expand */
  collapsible?: boolean
  /** 4 columns like home, or 3 on services page */
  columns?: 3 | 4
  /** Homepage CTA scrolls to contact form */
  ctaToContact?: boolean
  /** Services page: whole card links to matching portfolio filter + section */
  linkToPortfolio?: boolean
  className?: string
}

export function HomepageServicesGrid({
  interactive = true,
  items = HOMEPAGE_SERVICE_CARDS,
  collapsible = false,
  columns = 4,
  ctaToContact = false,
  linkToPortfolio = false,
  className = '',
}: HomepageServicesGridProps) {
  const [showAll, setShowAll] = useState(!collapsible)
  const visible = useMemo(
    () => (collapsible && !showAll ? items.slice(0, 4) : items),
    [collapsible, showAll, items],
  )

  const gridClass =
    columns === 3
      ? 'svc-grid svc-grid--cols-3'
      : 'svc-grid'

  return (
    <div
      className={`rathisoft-landing services-catalog-grid${
        linkToPortfolio
          ? ' services-catalog-grid--portfolio'
          : interactive
            ? ''
            : ' services-catalog-grid--display'
      } ${className}`.trim()}
    >
      <div className={gridClass}>
        {visible.map((s) => (
          <ServiceCard
            key={s.title}
            service={s}
            interactive={interactive}
            ctaToContact={ctaToContact}
            linkToPortfolio={linkToPortfolio}
          />
        ))}
      </div>
      {collapsible && items.length > 4 ? (
        <div className="svc-more">
          <button
            type="button"
            className="svc-more-btn"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? 'Show fewer services' : 'See more services'}
          </button>
        </div>
      ) : null}
    </div>
  )
}

function ServiceCard({
  service,
  interactive,
  ctaToContact,
  linkToPortfolio,
}: {
  service: HomepageServiceCard
  interactive: boolean
  ctaToContact: boolean
  linkToPortfolio: boolean
}) {
  const cardId = service.slug ? `service-${service.slug}` : undefined
  const style = { ['--svc-img' as never]: `url(${service.img})` }
  const portfolioTo = linkToPortfolio ? portfolioPathForService(service) : null

  const body = (
    <>
      <div className="svc-media" aria-hidden>
        {interactive ? (
          <Link to={ROUTES.portfolio} className="svc-view">
            View work ↗
          </Link>
        ) : linkToPortfolio ? (
          <span className="svc-chip" aria-hidden>
            View portfolio ↗
          </span>
        ) : (
          <span className="svc-chip" aria-hidden>
            {service.category === 'core' ? 'Core service' : 'Technology'}
          </span>
        )}
      </div>
      <div className="svc-body">
        <h3>
          {interactive ? <Link to={service.href}>{service.title}</Link> : service.title}
        </h3>
        <p>{service.desc}</p>
        <div className="svc-tags" aria-label="Service tags">
          {service.tags.map((t) => (
            <span key={t} className="svc-tag">
              {t}
            </span>
          ))}
        </div>
        {interactive ? (
          ctaToContact ? (
            <a href="#contact" className="svc-btn">
              Get a custom →
            </a>
          ) : (
            <Link to={service.href} className="svc-btn">
              Get a custom →
            </Link>
          )
        ) : linkToPortfolio ? (
          <span className="svc-footnote">See related case studies →</span>
        ) : (
          <span className="svc-footnote">Included in our delivery stack</span>
        )}
      </div>
    </>
  )

  if (portfolioTo) {
    return (
      <Link
        id={cardId}
        to={portfolioTo}
        className="svc svc--portfolio-link"
        style={style}
        aria-label={`${service.title} — view portfolio work`}
      >
        {body}
      </Link>
    )
  }

  return (
    <article
      id={cardId}
      className="svc"
      style={style}
      data-service-href={service.href}
    >
      {body}
    </article>
  )
}
