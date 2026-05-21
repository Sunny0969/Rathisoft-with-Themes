import type { CSSProperties } from 'react'
import './AiIndustriesSection.css'

type IndustryAccent =
  | 'green'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'cyan'
  | 'blue'
  | 'purple'
  | 'pink'

type Industry = {
  num: string
  title: string
  tagline: string
  description: string
  tags: string[]
  accent: IndustryAccent
  icon: 'cart' | 'truck' | 'health' | 'building' | 'plane' | 'bank' | 'education' | 'play'
}

const INDUSTRIES: Industry[] = [
  {
    num: '01',
    title: 'Retail & E-Commerce',
    tagline: 'Personalized shopping. Dynamic pricing. Zero churn.',
    description:
      'AI recommendation engines, dynamic pricing models, and inventory prediction systems that turn browsers into buyers and buyers into loyal customers — at scale.',
    tags: ['AI Recommendations', 'Dynamic Pricing', 'Inventory AI', 'Personalization'],
    accent: 'green',
    icon: 'cart',
  },
  {
    num: '02',
    title: 'Logistics',
    tagline: 'Route optimization. Fleet intelligence. Live visibility.',
    description:
      'Real-time fleet management, warehouse automation, and supply chain AI that cuts delivery times, reduces costs, and gives you full visibility across every node.',
    tags: ['Route AI', 'Fleet Tracking', 'Warehouse Automation', 'Supply Chain'],
    accent: 'orange',
    icon: 'truck',
  },
  {
    num: '03',
    title: 'Health Tech / Wellness',
    tagline: 'AI diagnostics. HIPAA compliance. Better patient outcomes.',
    description:
      'Telemedicine platforms, AI-assisted diagnostics, and EHR integrations built with healthcare-grade security and compliance baked in from day one.',
    tags: ['AI Diagnostics', 'Telemedicine', 'EHR Integration', 'HIPAA Compliant'],
    accent: 'red',
    icon: 'health',
  },
  {
    num: '04',
    title: 'Real Estate / Prop Tech',
    tagline: 'AI valuations. Virtual tours. Faster closings.',
    description:
      'Property valuation models, virtual tour platforms, and lead scoring systems that help agents close faster and investors make data-backed decisions.',
    tags: ['AI Valuations', 'Virtual Tours', 'Lead Scoring', 'Market Analytics'],
    accent: 'yellow',
    icon: 'building',
  },
  {
    num: '05',
    title: 'Travel Tech',
    tagline: 'Smart booking. Dynamic fares. Delightful journeys.',
    description:
      'Flight and hotel booking engines, dynamic pricing for fares, and AI concierge features that personalize every trip from search to checkout.',
    tags: ['Flight Booking', 'Dynamic Pricing', 'AI Concierge', 'Loyalty Programs'],
    accent: 'cyan',
    icon: 'plane',
  },
  {
    num: '06',
    title: 'FinTech',
    tagline: 'Smarter fraud detection. Faster compliance. Scalable banking.',
    description:
      'Fraud detection pipelines, credit scoring models, and open banking integrations that keep transactions secure and regulators satisfied.',
    tags: ['Fraud Detection', 'Credit Scoring', 'Open Banking', 'RegTech'],
    accent: 'blue',
    icon: 'bank',
  },
  {
    num: '07',
    title: 'Education / Ed Tech',
    tagline: 'Adaptive learning. AI tutors. Millions of engaged students.',
    description:
      'LMS platforms with AI tutors, adaptive learning paths, and student analytics that personalize education and scale to millions of learners.',
    tags: ['AI Tutors', 'Adaptive Learning', 'LMS Platforms', 'Student Analytics'],
    accent: 'purple',
    icon: 'education',
  },
  {
    num: '08',
    title: 'Entertainment',
    tagline: 'Smart content discovery. Streaming at scale. Fan engagement.',
    description:
      'Content recommendation engines, OTT streaming infrastructure, and AR experiences that keep audiences hooked and creators in control.',
    tags: ['Content AI', 'OTT Streaming', 'AR Experiences', 'Fan Engagement'],
    accent: 'pink',
    icon: 'play',
  },
]

function IndustryIcon({ type }: { type: Industry['icon'] }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (type) {
    case 'cart':
      return (
        <svg {...common}>
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M2 2h2l2.5 12h11l2-9H6" />
        </svg>
      )
    case 'truck':
      return (
        <svg {...common}>
          <path d="M3 6h11v9H3zM14 9h4l2 3v3h-6V9z" />
          <circle cx="7" cy="18" r="1.5" />
          <circle cx="17" cy="18" r="1.5" />
        </svg>
      )
    case 'health':
      return (
        <svg {...common}>
          <path d="M11 2v5M13 2v5M6 7h12v4a6 6 0 0 1-12 0V7z" />
          <path d="M9 14v6M15 14v6" />
        </svg>
      )
    case 'building':
      return (
        <svg {...common}>
          <path d="M4 20V6l8-4 8 4v14" />
          <path d="M9 20v-6h6v6M9 10h.01M15 10h.01" />
        </svg>
      )
    case 'plane':
      return (
        <svg {...common}>
          <path d="M2 12h18l-3-7H9l-2 7zm0 0 5 7h2l3-7" />
        </svg>
      )
    case 'bank':
      return (
        <svg {...common}>
          <path d="M3 10h18L12 3 3 10z" />
          <path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 18h18" />
        </svg>
      )
    case 'education':
      return (
        <svg {...common}>
          <path d="M12 3 2 8l10 5 10-5-10-5z" />
          <path d="M6 10v5c0 2 2.5 4 6 4s6-2 6-4v-5" />
        </svg>
      )
    case 'play':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m10 8 7 4-7 4V8z" fill="currentColor" stroke="none" />
        </svg>
      )
  }
}

export function AiIndustriesSection() {
  return (
    <section
      className="ai-industries"
      id="ai-industries"
      aria-labelledby="ai-industries-heading"
    >
      <div className="ai-industries-wrap">
        <header className="ai-industries-head">
          <div className="ai-industries-head-main">
            <p className="ai-industries-label">AI-Powered Solutions</p>
            <h2 id="ai-industries-heading" className="ai-industries-title">
              Intelligence for every industry
            </h2>
          </div>
          <p className="ai-industries-intro">
            We don&apos;t just build software — we embed AI into the core of
            industries that are ready to transform.
          </p>
        </header>

        <div className="ai-industries-pin">
          <div className="ai-industries-stack">
          {INDUSTRIES.map((item, index) => (
            <article
              key={item.num}
              tabIndex={0}
              className={`ai-industry-card ai-industry-card--${item.accent}`}
              style={
                {
                  '--stack-i': index,
                  zIndex: index + 1,
                } as CSSProperties
              }
            >
              <div className="ai-industry-card-inner">
                <div className="ai-industry-card-id">
                  <div
                    className={`ai-industry-icon ai-industry-icon--${item.accent}`}
                  >
                    <IndustryIcon type={item.icon} />
                  </div>
                  <div>
                    <span className="ai-industry-num">{item.num}</span>
                    <h3 className="ai-industry-name">{item.title}</h3>
                  </div>
                </div>

                <div className="ai-industry-card-body">
                  <p
                    className={`ai-industry-tagline ai-industry-tagline--${item.accent}`}
                  >
                    {item.tagline}
                  </p>
                  <p className="ai-industry-desc">{item.description}</p>
                </div>

                <div className="ai-industry-tags">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`ai-industry-tag ai-industry-tag--${item.accent}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
