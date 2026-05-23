import { Link } from 'react-router-dom'
import { WHAT_WE_DO_SERVICES } from '../data/whatWeDoServices'
import { ROUTES, servicePath } from '../utils/routes'
import '../pages/Home.css'
import './WhatWeDoSection.css'

export function WhatWeDoSection() {
  return (
    <div className="wwd-band rathisoft-landing" aria-labelledby="wwd-heading">
      <section className="alt wwd-section">
        <div className="home-wrap">
          <div className="home-section-head">
            <div className="home-label">What We Do</div>
            <h2 id="wwd-heading">Web &amp; mobile builds that ship on time</h2>
            <p className="home-lead">
              From marketing sites to{' '}
              <Link to={servicePath('web-development')}>custom web development</Link> and{' '}
              <Link to={servicePath('app-development')}>mobile apps</Link>, our Lahore team delivers
              responsive layouts, solid integrations, and code your in-house squad can maintain.
            </p>
            <h3 className="home-h3-follow">Digital marketing built for revenue</h3>
            <p className="home-lead">
              <Link to={servicePath('seo-services')}>SEO</Link>, paid ads, social, and content aimed
              at leads and sales—scoped to your budget and reported in plain language. Compare{' '}
              <Link to={ROUTES.packages}>web development packages</Link> or browse our{' '}
              <Link to={ROUTES.portfolio}>portfolio</Link> when you are ready to scope a build.
            </p>
          </div>

          <div className="svc-grid">
            {WHAT_WE_DO_SERVICES.map((s) => (
              <article
                key={s.title}
                className="svc"
                style={{ ['--svc-img' as never]: `url(${s.img})` }}
              >
                <div className="svc-media" aria-hidden>
                  <Link to={ROUTES.portfolio} className="svc-view">
                    View work ↗
                  </Link>
                </div>
                <div className="svc-body">
                  <h3>
                    <Link to={s.href}>{s.title}</Link>
                  </h3>
                  <p>{s.desc}</p>
                  <div className="svc-tags" aria-label="Service tags">
                    {s.tags.map((t) => (
                      <span key={t} className="svc-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link to={s.href} className="svc-btn">
                    Get a custom →
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
