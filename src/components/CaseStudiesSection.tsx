import { useState } from 'react'
import { CASE_STUDIES, type CaseStudy } from '../data/caseStudiesData'
import { caseStudyPreviewAlt } from '../utils/imageAssets'
import { REL_CLIENT_LIVE } from '../utils/externalLink'
import './CaseStudiesSection.css'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
      <path
        d="M8 12.5l2.5 2.5L16 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CaseVisual({ study }: { study: CaseStudy }) {
  const [src, setSrc] = useState(study.image)

  return (
    <a
      className="case-visual"
      href={study.href}
      target="_blank"
      rel={REL_CLIENT_LIVE}
      style={{ background: study.cardBg }}
      aria-label={`View live site — ${study.title}`}
    >
      <span className="case-visual-brand">{study.cardLabel}</span>
      <div className="case-visual-shot">
        <img
          src={src}
          alt={caseStudyPreviewAlt(study.title)}
          title={`${study.title} — case study by RathiSoft`}
          width={640}
          height={400}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (study.imageFallback && src !== study.imageFallback) {
              setSrc(study.imageFallback)
            }
          }}
        />
      </div>
      <span className="case-visual-link">View live site ↗</span>
    </a>
  )
}

function CaseStudyBlock({ study }: { study: CaseStudy }) {
  const visual = <CaseVisual study={study} />
  const copy = (
    <div className="case-copy">
      <span className={`case-cat case-cat--${study.categoryTone}`}>{study.category}</span>
      <h3 className="case-title">
        <a href={study.href} target="_blank" rel={REL_CLIENT_LIVE}>
          {study.title}
        </a>
      </h3>
      <p className="case-meta">
        Client: {study.client} · {study.duration}
      </p>

      <div className="case-block">
        <h4 className="case-kicker">Challenge</h4>
        <p className="case-text">{study.challenge}</p>
      </div>

      <div className="case-block">
        <h4 className="case-kicker">What we delivered</h4>
        <ul className="case-list">
          {study.deliverables.map((item) => (
            <li key={item}>
              <span className="case-check">
                <CheckIcon />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="case-tech">
        {study.tech.map((t) => (
          <span key={t} className="case-tech-pill">
            {t}
          </span>
        ))}
      </div>
    </div>
  )

  return (
    <article
      className={`case-study${study.imageFirst ? '' : ' case-study--reverse'}`}
      id={`case-${study.id}`}
    >
      {study.imageFirst ? (
        <>
          {visual}
          {copy}
        </>
      ) : (
        <>
          {copy}
          {visual}
        </>
      )}
    </article>
  )
}

export function CaseStudiesSection() {
  return (
    <section className="case-studies" aria-labelledby="case-studies-heading">
      <div className="case-studies-wrap">
        <header className="case-studies-head">
          <p className="case-studies-eyebrow">
            <span className="case-studies-eyebrow-icon" aria-hidden>
              ⚡
            </span>
            Case Studies
          </p>
          <h2 id="case-studies-heading">Deep dives into our impact</h2>
          <p className="case-studies-lead">
            Real challenges, real solutions — see how we helped our clients achieve their goals.
          </p>
        </header>

        <div className="case-studies-list">
          {CASE_STUDIES.map((study) => (
            <CaseStudyBlock key={study.id} study={study} />
          ))}
        </div>
      </div>
    </section>
  )
}
