import { useMemo, useState } from 'react'
import { TECH_CATEGORIES, TECH_STACK_TOTAL } from '../data/techStackData'
import './TechStackSection.css'

function TechLogo({ name, slug }: { name: string; slug: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span className="tech-stack-logo-fallback" aria-hidden>
        {name.slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    <img
      className="tech-stack-logo-img"
      src={`https://cdn.simpleicons.org/${slug}`}
      alt={`${name} logo — technology in RathiSoft web stack`}
      title={name}
      width={40}
      height={40}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

export function TechStackSection() {
  const [activeId, setActiveId] = useState(TECH_CATEGORIES[4]?.id ?? TECH_CATEGORIES[0].id)

  const activeCategory = useMemo(
    () => TECH_CATEGORIES.find((c) => c.id === activeId) ?? TECH_CATEGORIES[0],
    [activeId],
  )

  return (
    <section className="tech-stack" aria-labelledby="tech-stack-heading">
      <div className="tech-stack-wrap">
        <header className="tech-stack-header">
          <div className="tech-stack-header-left">
            <p className="tech-stack-label">Tech Stack</p>
            <h2 id="tech-stack-heading" className="tech-stack-title">
              Technologies we engage
            </h2>
          </div>
          <p className="tech-stack-lead">
            We stay ahead of the curve with a modern, battle-tested toolkit spanning every layer
            of the stack.
          </p>
        </header>

        <div className="tech-stack-tabs" role="tablist" aria-label="Technology categories">
          {TECH_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeId === cat.id}
              aria-controls={`tech-panel-${cat.id}`}
              id={`tech-tab-${cat.id}`}
              className={
                activeId === cat.id ? 'tech-stack-tab tech-stack-tab--active' : 'tech-stack-tab'
              }
              onClick={() => setActiveId(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div
          id={`tech-panel-${activeCategory.id}`}
          role="tabpanel"
          aria-labelledby={`tech-tab-${activeCategory.id}`}
          className="tech-stack-grid"
        >
          {activeCategory.items.map((item) => (
            <article key={`${activeCategory.id}-${item.slug}-${item.name}`} className="tech-stack-card">
              <div className="tech-stack-card-logo">
                <TechLogo name={item.name} slug={item.slug} />
              </div>
              <p className="tech-stack-card-name">{item.name}</p>
            </article>
          ))}
        </div>

        <footer className="tech-stack-stats">
          <div className="tech-stack-stat">
            <span className="tech-stack-stat-n">{TECH_CATEGORIES.length}</span>
            <span className="tech-stack-stat-l">Categories</span>
          </div>
          <div className="tech-stack-stat">
            <span className="tech-stack-stat-n">{TECH_STACK_TOTAL}+</span>
            <span className="tech-stack-stat-l">Technologies</span>
          </div>
          <div className="tech-stack-stat">
            <span className="tech-stack-stat-n">100%</span>
            <span className="tech-stack-stat-l">Modern stack</span>
          </div>
        </footer>
      </div>
    </section>
  )
}
