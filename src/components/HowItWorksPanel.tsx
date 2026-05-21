import './HowItWorksPanel.css'

const STEPS = [
  {
    num: '01',
    title: 'Share your vision',
    text: 'Tell us about your product, challenges, and where AI can make the biggest impact. We listen first.',
    accent: 'purple' as const,
  },
  {
    num: '02',
    title: 'Get a tailored blueprint',
    text: 'We map out the architecture, AI integrations, team composition, and a transparent cost breakdown.',
    accent: 'blue' as const,
  },
  {
    num: '03',
    title: 'Launch in days, not months',
    text: 'First sprint kicks off within days of your sign-off. Agile delivery, zero red tape.',
    accent: 'green' as const,
  },
] as const

const STATS = [
  {
    value: '48 h',
    label: 'Avg. response',
    icon: 'bolt' as const,
    accent: 'purple' as const,
  },
  {
    value: '120+',
    label: 'Products shipped',
    icon: 'team' as const,
    accent: 'blue' as const,
  },
  {
    value: '4.9',
    label: 'Client rating',
    icon: 'star' as const,
    accent: 'gold' as const,
  },
] as const

function StatIcon({ type }: { type: (typeof STATS)[number]['icon'] }) {
  if (type === 'bolt') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (type === 'team') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6M16 11c1.7 0 3 1.3 3 3M19 19c0-2.2-1.3-4-3-4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l2.4 5.8 6.2.5-4.7 4.1 1.4 6.1L12 16.9 6.7 19.5l1.4-6.1-4.7-4.1 6.2-.5L12 3z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type HowItWorksPanelProps = {
  headingId?: string
  className?: string
}

export function HowItWorksPanel({ headingId = 'how-it-works-heading', className }: HowItWorksPanelProps) {
  const rootClass = className ? `hiw-panel ${className}` : 'hiw-panel'

  return (
    <div className={rootClass} aria-labelledby={headingId}>
      <h2 id={headingId} className="hiw-heading">
        <span className="hiw-label">How It Works</span>
      </h2>

      <ol className="hiw-steps">
        {STEPS.map((step, i) => (
          <li key={step.num} className="hiw-step">
            <div className="hiw-step-rail" aria-hidden>
              <span className={`hiw-step-badge hiw-step-badge--${step.accent}`}>{step.num}</span>
              {i < STEPS.length - 1 ? <span className="hiw-step-line" /> : null}
            </div>
            <div className="hiw-step-body">
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="hiw-stats">
        {STATS.map((s) => (
          <div key={s.label} className={`hiw-stat hiw-stat--${s.accent}`}>
            <span className="hiw-stat-icon">
              <StatIcon type={s.icon} />
            </span>
            <div>
              <div className="hiw-stat-value">{s.value}</div>
              <div className="hiw-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="hiw-advisor">
        <img
          className="hiw-advisor-av"
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=96&h=96&fit=crop&crop=face&fm=webp&q=80"
          alt="Suneel Pirkash — Innovation Advisor at RathiSoft Lahore"
          title="Suneel Pirkash — replies within 48 hours"
          width={48}
          height={48}
          loading="lazy"
          decoding="async"
        />
        <div className="hiw-advisor-meta">
          <div className="hiw-advisor-name">Suneel Pirkash</div>
          <div className="hiw-advisor-role">CTO and Manager</div>
          <div className="hiw-advisor-status">
            <span className="hiw-advisor-dot" aria-hidden />
            Replies within 48 h
          </div>
        </div>
      </div>
    </div>
  )
}
