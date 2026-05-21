import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import './AiCoreSection.css'

type AiLayer = {
  id: string
  num: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  accent: string
  navLabel: string
  orbitIcon: 'bot' | 'code' | 'chart' | 'eye' | 'brain' | 'doc'
}

const AI_LAYERS: AiLayer[] = [
  {
    id: 'ai',
    num: '01',
    title: 'AI Agents & Assistants',
    subtitle: 'Autonomous systems that execute, not just suggest.',
    description:
      'We build multi-step AI agents that autonomously handle complex workflows — from customer support triage to document processing pipelines — making decisions, calling APIs, and delivering outcomes without human bottlenecks.',
    tags: [
      'Multi-agent orchestration',
      'Tool-use & API chaining',
      'Human-in-the-loop controls',
    ],
    accent: 'purple',
    navLabel: 'AI',
    orbitIcon: 'bot',
  },
  {
    id: 'llm',
    num: '02',
    title: 'LLM Integration & Fine-Tuning',
    subtitle: 'GPT, Claude, Llama — wired into your stack.',
    description:
      'We integrate frontier and open-source LLMs into your products with production-grade prompt engineering, fine-tuning on your domain data, and evaluation pipelines that ensure accuracy, latency, and cost stay under control.',
    tags: [
      'Prompt engineering at scale',
      'Domain-specific fine-tuning',
      'Cost & latency optimization',
    ],
    accent: 'blue',
    navLabel: 'LLM',
    orbitIcon: 'code',
  },
  {
    id: 'predictive',
    num: '03',
    title: 'Predictive Analytics & ML',
    subtitle: 'See the future in your data.',
    description:
      'From demand forecasting and churn prediction to anomaly detection and recommendation engines — we train, validate, and deploy ML models that turn historical patterns into forward-looking intelligence.',
    tags: [
      'Forecasting & scoring',
      'Anomaly detection',
      'Recommendation systems',
    ],
    accent: 'green',
    navLabel: 'Predictive',
    orbitIcon: 'chart',
  },
  {
    id: 'vision',
    num: '04',
    title: 'Computer Vision',
    subtitle: 'Machines that see, understand, and act.',
    description:
      'Object detection, OCR, facial recognition, quality inspection, and visual search — we deploy vision models on edge and cloud with real-time inference pipelines tuned for your hardware and accuracy requirements.',
    tags: [
      'Real-time detection',
      'OCR & document vision',
      'Edge deployment',
    ],
    accent: 'yellow',
    navLabel: 'Computer',
    orbitIcon: 'eye',
  },
  {
    id: 'nlp',
    num: '05',
    title: 'Natural Language Processing',
    subtitle: 'Language intelligence at every layer.',
    description:
      'Sentiment analysis, entity extraction, multilingual support, and semantic search — we build NLP pipelines that understand context, handle ambiguity, and scale across languages and domains without sacrificing precision.',
    tags: [
      'Semantic search & embeddings',
      'Entity & intent extraction',
      'Multilingual pipelines',
    ],
    accent: 'pink',
    navLabel: 'Natural',
    orbitIcon: 'brain',
  },
  {
    id: 'rag',
    num: '06',
    title: 'RAG & Knowledge Systems',
    subtitle: 'Your data, instantly answerable.',
    description:
      'Retrieval-augmented generation over your documents, wikis, and databases — with vector search, chunking strategies, and citation-aware responses that keep AI grounded in facts, not hallucinations.',
    tags: [
      'Vector databases & search',
      'Citation-aware answers',
      'Private knowledge bases',
    ],
    accent: 'red',
    navLabel: 'RAG',
    orbitIcon: 'doc',
  },
]

const ORBIT_NODES: AiLayer['orbitIcon'][] = [
  'bot',
  'code',
  'chart',
  'eye',
  'brain',
  'doc',
]

function OrbitIcon({ type }: { type: AiLayer['orbitIcon'] }) {
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
    case 'bot':
      return (
        <svg {...common}>
          <rect x="5" y="8" width="14" height="11" rx="2" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          <circle cx="9.5" cy="13" r="1" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="13" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'code':
      return (
        <svg {...common}>
          <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...common}>
          <path d="M4 18V6M8 18v-6M12 18V9M16 18v-3M20 18V4" />
        </svg>
      )
    case 'eye':
      return (
        <svg {...common}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      )
    case 'brain':
      return (
        <svg {...common}>
          <path d="M8 8.5a2.5 2.5 0 0 1 4 0M12 8.5a2.5 2.5 0 0 1 4 0M8 15.5a2.5 2.5 0 0 0 4 0M12 15.5a2.5 2.5 0 0 0 4 0" />
          <path d="M12 6v12" />
        </svg>
      )
    case 'doc':
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
          <path d="M14 3v5h5" />
        </svg>
      )
  }
}

export function AiCoreSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])

  const scrollToCard = useCallback((index: number) => {
    setActiveIndex(index)
    const card = cardRefs.current[index]
    const track = trackRef.current
    if (!card || !track) return

    const offset =
      card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2
    track.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const onScroll = () => {
      const center = track.scrollLeft + track.clientWidth / 2
      let closest = 0
      let minDist = Infinity

      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const dist = Math.abs(center - cardCenter)
        if (dist < minDist) {
          minDist = dist
          closest = i
        }
      })

      setActiveIndex(closest)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="ai-core" id="ai-core" aria-labelledby="ai-core-heading">
      <div className="ai-core-wrap">
        <div className="ai-core-hero">
          <div className="ai-core-hero-text">
            <p className="ai-core-label">The AI Core</p>
            <h2 id="ai-core-heading" className="ai-core-title">
              AI Power Solutions
            </h2>
            <p className="ai-core-lead">
              Six core intelligence layers we engineer into every product — each
              battle-tested, production-grade, and built to compound value.
            </p>
          </div>

          <div className="ai-core-orbit" aria-hidden>
            <div className="ai-core-orbit-ring ai-core-orbit-ring--outer" />
            <div className="ai-core-orbit-ring ai-core-orbit-ring--inner" />
            <div className="ai-core-orbit-dots">
              <span className="ai-core-orbit-dot ai-core-orbit-dot--blue" />
              <span className="ai-core-orbit-dot ai-core-orbit-dot--green" />
              <span className="ai-core-orbit-dot ai-core-orbit-dot--purple" />
            </div>
            <div className="ai-core-orbit-center">
              <OrbitIcon type="brain" />
            </div>
            <div className="ai-core-orbit-spinner">
              {ORBIT_NODES.map((icon, i) => (
                <div
                  key={icon}
                  className="ai-core-orbit-node"
                  style={{ '--orbit-i': i } as CSSProperties}
                >
                  <span className={`ai-core-orbit-node-box ai-core-orbit-node-box--${AI_LAYERS[i]?.accent ?? 'purple'}`}>
                    <OrbitIcon type={icon} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={trackRef}
          className="ai-core-track"
          role="region"
          aria-label="AI capability cards"
        >
          {AI_LAYERS.map((layer, index) => (
            <article
              key={layer.id}
              ref={(el) => {
                cardRefs.current[index] = el
              }}
              className={`ai-core-card ai-core-card--${layer.accent}${activeIndex === index ? ' ai-core-card--active' : ''}`}
              onFocus={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className={`ai-core-card-icon ai-core-card-icon--${layer.accent}`}>
                <OrbitIcon type={layer.orbitIcon} />
              </div>
              <span className="ai-core-card-num">{layer.num}</span>
              <h3 className="ai-core-card-title">{layer.title}</h3>
              <p className={`ai-core-card-sub ai-core-card-sub--${layer.accent}`}>
                {layer.subtitle}
              </p>
              <p className="ai-core-card-desc">{layer.description}</p>
              <div className="ai-core-card-tags">
                {layer.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`ai-core-tag ai-core-tag--${layer.accent}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <nav className="ai-core-nav" aria-label="AI layers">
          {AI_LAYERS.map((layer, index) => (
            <button
              key={layer.id}
              type="button"
              className={`ai-core-nav-btn${activeIndex === index ? ' ai-core-nav-btn--active' : ''}`}
              onClick={() => scrollToCard(index)}
              aria-current={activeIndex === index ? 'true' : undefined}
            >
              <span
                className={`ai-core-nav-dot ai-core-nav-dot--${layer.accent}`}
                aria-hidden
              />
              {layer.navLabel}
            </button>
          ))}
        </nav>
      </div>
    </section>
  )
}
