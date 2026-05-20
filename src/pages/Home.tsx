import gsap from 'gsap'
import type { FormEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
// import { HeroVideo } from '../components/HeroVideo'
import { OnPageSeoSection } from '../components/OnPageSeoSection'
import { Seo, SITE_ORIGIN } from '../components/Seo'
import {
  SITE_TESTIMONIALS,
  buildOrganizationReviewProperties,
} from '../data/testimonials'
// import { PackagesSection } from '../components/PackagesSection'
import './Home.css'

const MARQUEE_ITEMS = [
  'WordPress Development',
  'Shopify Expert',
  'WooCommerce',
  'Web Design',
  'SEO Optimization',
  'PPC Advertising',
  'Social Media Marketing',
  'App Development',
  'Branding & UI/UX',
  'Video Editing',
] as const

const TRUST_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&fm=webp&q=75',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face&fm=webp&q=75',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face&fm=webp&q=75',
] as const

/** Unsplash sources: https://unsplash.com/photos/{id} — optimized for card headers */
const SERVICE_IMAGES = {
  web: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&h=500&fit=crop&fm=webp&q=75',
  seo: 'https://images.unsplash.com/photo-1686061594225-3e92c0cd51b0?w=800&h=500&fit=crop&fm=webp&q=75',
  app: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&h=500&fit=crop&fm=webp&q=75',
  wpShopify: 'https://images.unsplash.com/photo-1560472354-0088b5dc9d8d?w=800&h=500&fit=crop&fm=webp&q=75',
  video: 'https://images.unsplash.com/photo-1605826832916-d0ea9d6fe71e?w=800&h=500&fit=crop&fm=webp&q=75',
  social: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=500&fit=crop&fm=webp&q=75',
  content: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=800&h=500&fit=crop&fm=webp&q=75',
  ppc: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=500&fit=crop&fm=webp&q=75',
  branding: 'https://images.unsplash.com/photo-1770010735791-f7c377534c1c?w=800&h=500&fit=crop&fm=webp&q=75',
  genAi: 'https://images.unsplash.com/photo-1677691824304-279660ceece3?w=800&h=500&fit=crop&fm=webp&q=75',
  dynamicsErp: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&h=500&fit=crop&fm=webp&q=75',
  cyber: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&h=500&fit=crop&fm=webp&q=75',
  gameDev: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&h=500&fit=crop&fm=webp&q=75',
  saas: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop&fm=webp&q=75',
  support: 'https://images.unsplash.com/photo-1758780691544-d11ce61aae47?w=800&h=500&fit=crop&fm=webp&q=75',
  automation: 'https://images.unsplash.com/photo-1607292803026-3b9d9b3d0fe7?w=800&h=500&fit=crop&fm=webp&q=75',
} as const

const SERVICES = [
  { icon: '💻', title: 'Web Development', desc: 'Fast, responsive sites built to turn visitors into leads.', tags: ['UI/UX', 'React'], img: SERVICE_IMAGES.web, href: '/services/web-development' },
  { icon: '🔍', title: 'SEO Optimization', desc: 'Technical and on-page SEO so the right customers find you on Google.', tags: ['On-Page', 'Technical'], img: SERVICE_IMAGES.seo, href: '/services/seo-optimization' },
  { icon: '📲', title: 'App Development', desc: 'Custom mobile apps for iOS and Android that feel fast and reliable.', tags: ['iOS', 'Android'], img: SERVICE_IMAGES.app, href: '/services/app-development' },
  { icon: '🛒', title: 'WordPress & Shopify', desc: 'Commerce stores that look sharp and guide buyers to checkout.', tags: ['WordPress', 'Shopify'], img: SERVICE_IMAGES.wpShopify, href: '/services/wordpress-shopify' },
  { icon: '🎬', title: 'Video Editing', desc: 'Reels, ads, and short clips edited for attention and clarity.', tags: ['Reels', 'Ads'], img: SERVICE_IMAGES.video, href: '/services/video-editing' },
  { icon: '📱', title: 'Social Media Marketing', desc: 'Monthly content and posting so your brand stays visible.', tags: ['Instagram', 'Facebook'], img: SERVICE_IMAGES.social, href: '/services/social-media-marketing' },
  { icon: '✍️', title: 'Content Marketing', desc: 'Blogs and copy that bring traffic and support sales.', tags: ['Blogs', 'Copywriting'], img: SERVICE_IMAGES.content, href: '/services/content-marketing' },
  { icon: '🎯', title: 'PPC Advertising', desc: 'Paid search and social campaigns tuned for measurable ROI.', tags: ['Google Ads', 'Meta Ads'], img: SERVICE_IMAGES.ppc, href: '/services/ppc-advertising' },
  { icon: '🎨', title: 'Branding and UI/UX Design', desc: 'Logos, layouts, and brand systems that look credible on every screen.', tags: ['UI/UX', 'Brand Kit'], img: SERVICE_IMAGES.branding, href: '/services/branding-design' },

  // New technologies / services
  { icon: '🤖', title: 'Generative AI', desc: 'Practical AI features that save time on support, content, and ops.', tags: ['LLMs', 'Automation'], img: SERVICE_IMAGES.genAi, href: '/services' },
  { icon: '🏢', title: 'Dynamics 365 ERP', desc: 'ERP setup and tweaks so finance and ops teams work from one source of truth.', tags: ['ERP', 'Microsoft'], img: SERVICE_IMAGES.dynamicsErp, href: '/services' },
  { icon: '🛡️', title: 'Cybersecurity', desc: 'Hardening, reviews, and secure-by-default builds for live products.', tags: ['Security', 'Compliance'], img: SERVICE_IMAGES.cyber, href: '/services' },
  { icon: '🎮', title: 'Game Development', desc: 'Game builds with stable performance and polished player flows.', tags: ['Unity', '2D/3D'], img: SERVICE_IMAGES.gameDev, href: '/services' },
  { icon: '📦', title: 'SaaS Products', desc: 'SaaS products with clear UX and architecture you can extend later.', tags: ['SaaS', 'Scalable'], img: SERVICE_IMAGES.saas, href: '/services' },
  { icon: '🧰', title: 'Maintenance & Support', desc: 'Updates, fixes, and monitoring after go-live so nothing drifts.', tags: ['Support', 'Updates'], img: SERVICE_IMAGES.support, href: '/contact' },
  { icon: '⚙️', title: 'Automation & Apps', desc: 'Internal tools and automations that cut manual work across teams.', tags: ['Automation', 'Integrations'], img: SERVICE_IMAGES.automation, href: '/services' },
] as const

const TRUST_CARDS = [
  { icon: '🛠️', bg: 'rgba(99,102,241,0.08)', title: 'Custom & Post-Launch', text: 'Tailor-made solutions built for your specific needs — aur website live hone ke baad bhi hum hamesha available hain maintenance ke liye.' },
  { icon: '🎨', bg: 'rgba(245,158,11,0.08)', title: 'UI/UX Focused', text: 'Design sirf dikhne mein accha nahi — user-friendly bhi hona chahiye. Hum user experience ko har cheez se pehle rakhte hain.' },
  { icon: '⚡', bg: 'rgba(16,185,129,0.08)', title: 'Fast Delivery', text: 'On-time across every project — no delays, no excuses, ever. Aapka time hamare liye bhi precious hai.' },
  { icon: '🔒', bg: 'rgba(79,70,229,0.08)', title: 'NDA-Ready', text: 'Your project details and code stay private — NDAs signed on request. Aapki privacy hamari zimmedari hai.' },
  { icon: '💬', bg: 'rgba(37,211,102,0.08)', title: '24hr Response', text: 'Always reachable via WhatsApp, email, or your preferred channel. Hum kabhi bhi door nahi hote.' },
  { icon: '🌍', bg: 'rgba(244,63,94,0.08)', title: 'Global Clients', text: 'Clients across Pakistan, UK, UAE, and beyond — all served remotely with zero friction, zero delay.' },
] as const

const WA = 'https://wa.me/923342651544'

const HOME_META_TITLE = 'Software Agency | Web, Apps & Growth | RathiSoft'
const HOME_META_DESCRIPTION =
  'Custom web apps, Shopify & WordPress stores, and digital marketing that grows revenue. Free project quote from RathiSoft—most replies within one business day.'
const HOME_KEYWORDS =
  'software agency Lahore, software development company Pakistan, web development Lahore, digital marketing agency Pakistan, IT company Lahore'

const HOME_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'RathiSoft',
      url: SITE_ORIGIN,
      logo: `${SITE_ORIGIN}/assets/logo.png`,
      description:
        'Software agency for web apps, Shopify and WordPress stores, and digital marketing that grows revenue—serving clients in Pakistan and worldwide.',
      foundingDate: '2020',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Johar Town',
        addressLocality: 'Lahore',
        addressRegion: 'Punjab',
        postalCode: '54000',
        addressCountry: 'PK',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+923342651544',
        contactType: 'customer service',
        availableLanguage: ['English', 'Urdu'],
      },
      sameAs: [
        'https://www.linkedin.com/company/rathisoft',
        'https://www.facebook.com/rathisoft',
        'https://twitter.com/rathisoft',
        'https://www.instagram.com/rathisoft',
      ],
      areaServed: ['PK', 'US', 'GB', 'AE', 'SA'],
      serviceType: [
        'Software Development',
        'Web Development',
        'Mobile App Development',
        'Digital Marketing',
        'SEO',
        'WordPress Development',
        'Shopify Development',
      ],
      ...buildOrganizationReviewProperties(SITE_TESTIMONIALS),
    },
    {
      '@type': 'WebSite',
      name: 'RathiSoft',
      url: SITE_ORIGIN,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_ORIGIN}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

const CONTACT_REGION_OPTIONS = [
  'Pakistan',
  'Middle East',
  'UK & Europe',
  'North America',
  'Asia Pacific',
  'Africa',
  'Australia / New Zealand',
  'Latin America',
  'Other / Remote',
] as const

const CONTACT_SERVICE_MULTI_OPTIONS = [
  'Remote IT Resources',
  'Custom Software Development',
  'Web Development',
  'Mobile App Development',
  'AR/VR',
  'Gaming',
  'Cyber Security',
  'Other IT Services',
] as const

function ContactLeadForm({
  idPrefix,
  formClassName,
  onSubmit,
}: {
  idPrefix: 'home-d' | 'home-m'
  formClassName: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}) {
  const fieldId = (suffix: string) => `${idPrefix}-${suffix}`

  return (
    <form className={formClassName} onSubmit={onSubmit} noValidate>
      <div className="fcta-field-row">
        <div className="fg">
          <label className="flbl" htmlFor={fieldId('fullname')}>
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId('fullname')}
            name="fullName"
            className="finput"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </div>
        <div className="fg">
          <label className="flbl" htmlFor={fieldId('email')}>
            Email
          </label>
          <input
            id={fieldId('email')}
            name="email"
            className="finput"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
          />
        </div>
      </div>
      <div className="fcta-field-row">
        <div className="fg">
          <label className="flbl" htmlFor={fieldId('phone')}>
            Phone
          </label>
          <input
            id={fieldId('phone')}
            name="phone"
            className="finput"
            type="tel"
            autoComplete="tel"
            placeholder="+92 300 0000000"
          />
        </div>
        <div className="fg">
          <label className="flbl" htmlFor={fieldId('region')}>
            Region
          </label>
          <select
            id={fieldId('region')}
            name="region"
            className="finput finput-select"
            defaultValue=""
          >
            <option value="">Select…</option>
            {CONTACT_REGION_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="fcta-field-row">
        <div className="fg">
          <label className="flbl" htmlFor={fieldId('company')}>
            Company <span className="fcta-opt">optional</span>
          </label>
          <input
            id={fieldId('company')}
            name="companyName"
            className="finput"
            type="text"
            autoComplete="organization"
            placeholder="Company name"
          />
        </div>
        <div className="fg">
          <label className="flbl" htmlFor={fieldId('url')}>
            Website <span className="fcta-opt">optional</span>
          </label>
          <input
            id={fieldId('url')}
            name="companyUrl"
            className="finput"
            type="url"
            autoComplete="url"
            placeholder="https://…"
          />
        </div>
      </div>
      <fieldset className="fg fcta-services-fieldset">
        <legend className="flbl">Services</legend>
        <div className="fcta-service-checks" role="group" aria-label="Services you need">
          {CONTACT_SERVICE_MULTI_OPTIONS.map((s) => (
            <label key={s} className="fcta-check">
              <input type="checkbox" name="services" value={s} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="fg">
        <label className="flbl" htmlFor={fieldId('details')}>
          Project details <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={fieldId('details')}
          name="projectDetails"
          className="finput finput-textarea-sm"
          rows={3}
          placeholder="Brief scope, timeline, or budget…"
          required
        />
      </div>
      <button type="submit" className="fsubmit">
        Submit
      </button>
    </form>
  )
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export function Home() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const mx = useRef(0)
  const my = useRef(0)
  const rx = useRef(0)
  const ry = useRef(0)
  const [showPreloader, setShowPreloader] = useState(true)
  const [showAllServices, setShowAllServices] = useState(false)

  const onContactLeadSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }, [])

  const heroEntrance = useCallback(() => {
    gsap.set(['.hero-pill', '.hero-p', '.hero-btns', '.hero-trust'], { y: 20 })
    gsap.set('.hero-p', { y: 20 })
    gsap.to('.hero-pill', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.05 })
    gsap.fromTo('.hero-h', { y: 50, opacity: 0 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out', delay: 0.2 })
    gsap.to('.hero-p', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.4 })
    gsap.to('.hero-btns', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.55 })
    gsap.to('.hero-trust', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.65 })
  }, [])

  useEffect(() => {
    if (!showPreloader) return
    const bar = document.getElementById('preBar')
    const pct = document.getElementById('prePct')
    const pre = document.getElementById('preloader')
    if (!bar || !pct || !pre) return

    let p = 0
    let cancelled = false
    const iv = window.setInterval(() => {
      if (cancelled) return
      p += Math.random() * 14
      if (p >= 100) {
        p = 100
        window.clearInterval(iv)
      }
      bar.style.width = `${p}%`
      pct.textContent = `${Math.floor(p)}%`
      if (p === 100) {
        window.setTimeout(() => {
          if (cancelled) return
          gsap.to(pre, {
            yPercent: -100,
            duration: 0.85,
            ease: 'power3.inOut',
            onComplete: () => {
              setShowPreloader(false)
              heroEntrance()
            },
          })
        }, 250)
      }
    }, 55)

    return () => {
      cancelled = true
      window.clearInterval(iv)
    }
  }, [showPreloader, heroEntrance])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 960px)')
    if (mq.matches) return

    const cur = cursorRef.current
    const ring = ringRef.current
    if (!cur || !ring) return

    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX
      my.current = e.clientY
      cur.style.left = `${e.clientX}px`
      cur.style.top = `${e.clientY}px`
    }

    const loop = () => {
      rx.current += (mx.current - rx.current) * 0.13
      ry.current += (my.current - ry.current) * 0.13
      ring.style.left = `${rx.current}px`
      ring.style.top = `${ry.current}px`
      rafRef.current = requestAnimationFrame(loop)
    }

    document.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(loop)

    const hoverables = 'a,button,.pkg,.tc,.rv,.svc'
    const onEnter = () => document.body.classList.add('cur-hover')
    const onLeave = () => document.body.classList.remove('cur-hover')
    const nodes = rootRef.current?.querySelectorAll(hoverables) ?? []
    nodes.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      document.body.classList.remove('cur-hover')
      nodes.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [showPreloader])

  useEffect(() => {
    return () => {
      gsap.killTweensOf(
        '.hero-pill,.hero-h,.hero-p,.hero-btns,.hero-trust,.blob,.tc,.rv,.svc,.btn-primary,.btn-ghost,.pkg-btn',
      )
    }
  }, [])

  useEffect(() => {
    if (showPreloader) return
    const root = rootRef.current
    if (!root) return

    const tiltSel = '.tc,.rv,.svc'
    const cards = root.querySelectorAll<HTMLElement>(tiltSel)
    const onMove = (e: MouseEvent, card: HTMLElement) => {
      const r = card.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width - 0.5) * 12
      const y = ((e.clientY - r.top) / r.height - 0.5) * -12
      gsap.to(card, {
        rotateX: y,
        rotateY: x,
        duration: 0.35,
        ease: 'power2.out',
        transformPerspective: 900,
      })
    }
    const onLeave = (card: HTMLElement) => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' })
    }

    const magSel = '.btn-primary,.btn-ghost,.pkg-btn'
    const btns = root.querySelectorAll<HTMLElement>(magSel)
    const onBtnMove = (e: MouseEvent, btn: HTMLElement) => {
      const r = btn.getBoundingClientRect()
      const x = (e.clientX - r.left - r.width / 2) * 0.28
      const y = (e.clientY - r.top - r.height / 2) * 0.28
      gsap.to(btn, { x, y, duration: 0.35, ease: 'power2.out' })
    }
    const onBtnLeave = (btn: HTMLElement) => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' })
    }

    const cardHandlers: { el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }[] = []
    cards.forEach((card) => {
      const move = (e: MouseEvent) => onMove(e, card)
      const leave = () => onLeave(card)
      card.addEventListener('mousemove', move)
      card.addEventListener('mouseleave', leave)
      cardHandlers.push({ el: card, move, leave })
    })

    const btnHandlers: { el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }[] = []
    btns.forEach((btn) => {
      const move = (e: MouseEvent) => onBtnMove(e, btn)
      const leave = () => onBtnLeave(btn)
      btn.addEventListener('mousemove', move)
      btn.addEventListener('mouseleave', leave)
      btnHandlers.push({ el: btn, move, leave })
    })

    const blobs = root.querySelectorAll<HTMLElement>('.blob')
    const blobTweens = Array.from(blobs).map((b, i) =>
      gsap.to(b, {
        x: i % 2 === 0 ? 40 : -40,
        y: i === 1 ? -30 : 30,
        duration: 8 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }),
    )

    return () => {
      cardHandlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move)
        el.removeEventListener('mouseleave', leave)
      })
      btnHandlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move)
        el.removeEventListener('mouseleave', leave)
      })
      blobTweens.forEach((t) => t.kill())
    }
  }, [showPreloader])

  const visibleServices = showAllServices ? SERVICES : SERVICES.slice(0, 4)

  return (
    <main className="app-main">
      <Seo title={HOME_META_TITLE} description={HOME_META_DESCRIPTION} keywords={HOME_KEYWORDS} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_STRUCTURED_DATA) }}
      />
      {showPreloader ? (
        <div id="preloader">
          <div className="pre-logo">
            Rathi<span>soft</span>
          </div>
          <div className="pre-bar-wrap">
            <div className="pre-bar" id="preBar" />
          </div>
          <div className="pre-pct" id="prePct">
            0%
          </div>
        </div>
      ) : null}

      <div ref={cursorRef} id="cursor" aria-hidden />
      <div ref={ringRef} id="cursor-ring" aria-hidden />

      <div className="blob blob-1" aria-hidden />
      <div className="blob blob-2" aria-hidden />
      <div className="blob blob-3" aria-hidden />

      <div ref={rootRef} className="rathisoft-landing">
        <section
          id="hero"
          className="relative min-h-[66svh] overflow-hidden border-b border-solid [border-color:var(--border)]"
          aria-labelledby="hero-heading"
        >
          {/* <HeroVideo /> */}
          <img
            src="/images/Side.png"
            alt=""
            aria-hidden="true"
            className="hero-side"
          />
          <div className="hero-l">
            <div className="hero-pill">
              <span className="pill-pulse"  />
              Scale Your Brand · High-Performance Web · Global Reach
            </div>
            <h1 id="hero-heading" className="hero-h">
              Web, Apps &amp; Growth <br></br>Built to Perform
            </h1>
            <p className="hero-p">
              RathiSoft helps business owners ship custom web apps, mobile
              builds, and{' '}
              <Link to="/services/wordpress-shopify">WordPress and Shopify stores</Link> that
              load fast—plus digital marketing tied to leads and sales, not vanity metrics. One
              team, clear milestones, and a direct line to the people doing the work.
            </p>
            <div className="hero-btns">
              <a href="#contact" className="btn-primary">
                Get a free project quote →
              </a>
              <Link to="/services" className="btn-ghost">
                Explore our services
              </Link>
            </div>
            <div className="hero-trust">
              <div className="avs">
                {TRUST_AVATARS.map((src, i) => (
                  <img
                    key={src}
                    className="av-img"
                    src={src}
                    alt={`Representative client portrait ${i + 1} for trusted-by businesses row`}
                    width={32}
                    height={32}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
                <div className="av-more">+</div>
              </div>
              <div className="trust-t">
                <strong>Trusted by 100+ businesses</strong>
                <br />
                eCommerce · Agencies · Clinics · Startups
              </div>
            </div>
          </div>
        </section>

        {/* <LogoSlider /> */}

        <div className="mq">
          <div className="mq-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((label, i) => (
              <span key={`${label}-${i}`}>
                <span className="mi">{label}</span>
                <span className="ms">◆</span>
              </span>
            ))}
          </div>
        </div>

        <div className="nums">
          {[
            ['59', '+', 'Projects completed'],
            ['5', '+', 'Years experience'],
            [`${SERVICES.length}`, '+', 'Services offered'],
            ['4.8', '★', 'Average client rating'],
          ].map(([n, em, l]) => (
            <div key={l} className="nb">
              <div className="nb-n">
                {n}
                <em>{em}</em>
              </div>
              <div className="nb-l">{l}</div>
            </div>
          ))}
          <div className="nb">
            <div className="nb-n home-nb-global">
              UK<em>+US</em>
              <br />
              <span className="home-nb-sub">AUS+EUR</span>
            </div>
            <div className="nb-l">Global reach</div>
          </div>
        </div>

        <section>
          <div className="home-wrap">
            <div className="prob-layout">
              <div className="prob-left">
                <div className="home-label">The Problem</div>
                <h2>When Does Your Website Cost You Sales?</h2>
                <p className="home-lead prob-lead">
                  Your business deserves more than a slow site and a checkout that breaks.
                </p>
              </div>
              <div className="prob-right">
                <div className="prob-box">
                  <p>
                    Most businesses — clinics, agencies, eCommerce stores,
                    startups —{' '}
                    <strong>know they need a professional website.</strong> But
                    getting it built right, fast, and within budget is harder
                    than it looks.
                  </p>
                  <p>
                    <span className="prob-hl">
                      Slow sites. Broken checkouts. Generic templates. Poor visibility in{' '}
                      <a
                        href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="home-inline-link"
                      >
                        Google search
                      </a>
                      . Lost sales.
                    </span>
                  </p>
                  <p>
                    RathiSoft fixes that. We act as your{' '}
                    <strong>dedicated development partner</strong>—building, tuning, and
                    maintaining your{' '}
                    <Link to="/services/wordpress-shopify">WordPress or Shopify</Link> stack so
                    you can focus on customers. Need proof first? Browse our{' '}
                    <Link to="/work">portfolio of shipped projects</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="alt">
          <div className="home-wrap">
            <div className="home-section-head">
              <div className="home-label">What We Do</div>
              <h2>Web &amp; Mobile Builds That Ship on Time</h2>
              <p className="home-lead">
                From marketing sites to{' '}
                <Link to="/services/web-development">custom web development</Link> and{' '}
                <Link to="/services/app-development">mobile apps</Link>, we deliver responsive
                layouts, solid integrations, and code your team can maintain.
              </p>
              <h2 className="home-h2-follow">Digital Marketing Built for Revenue</h2>
              <p className="home-lead">
                <Link to="/services/seo-optimization">SEO</Link>, paid ads, social, and content
                aimed at leads and sales—scoped to your budget and reported in plain language.
              </p>
            </div>
            <div className="svc-grid">
              {visibleServices.map((s) => (
                <article key={s.title} className="svc" style={{ ['--svc-img' as never]: `url(${s.img})` }}>
                  <div className="svc-media" aria-hidden>
                    <Link to="/work" className="svc-view">
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
                    <a href="#contact" className="svc-btn">
                      Get a custom →
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {SERVICES.length > 4 ? (
              <div className="svc-more">
                <button className="svc-more-btn" type="button" onClick={() => setShowAllServices((v) => !v)}>
                  {showAllServices ? 'Show fewer services' : 'See more services'}
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="alt">
          <div className="home-wrap">
            <div className="home-section-head">
              <div className="home-label">Why Trust Us</div>
              <h2>Why Do Teams Stick With RathiSoft?</h2>
              <p className="home-lead">
                Real launches, clean handoffs, and support after go-live—see the{' '}
                <Link to="/about">story behind our studio</Link> and how we work.
              </p>
            </div>
            <div className="tc-grid">
              {TRUST_CARDS.map((c) => (
                <div key={c.title} className="tc">
                  <div className="tc-icon" style={{ background: c.bg }}>
                    {c.icon}
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* <section id="packages">
          <div className="home-wrap">
            <div className="home-section-head">
              <div className="home-label">Pricing</div>
              <h2>
                Simple packages.
                <br />
                No surprises.
              </h2>
              <p className="home-lead">
                Pick the plan that fits your business. Everything included —
                design, development, strategy.
              </p>
            </div>
            <PackagesSection waLink={WA} />
          </div>
        </section> */}

        <section>
          <div className="home-wrap">
            <div className="home-section-head">
              <div className="home-label">Reviews</div>
              <h2>What Clients Say After Launch</h2>
              <p className="home-lead">
                Honest feedback from teams we&apos;ve helped on WordPress, Shopify, apps, and
                marketing—names and roles included where clients allowed.
              </p>
            </div>
            <div
              className={
                prefersReducedMotion
                  ? 'rev-slider-outer rev-slider-outer-scroll'
                  : 'rev-slider-outer'
              }
              aria-label="Client reviews carousel"
            >
              <div
                className={
                  prefersReducedMotion ? 'rev-slider-track rev-slider-track-static' : 'rev-slider-track'
                }
              >
                {(prefersReducedMotion
                  ? [...SITE_TESTIMONIALS]
                  : [...SITE_TESTIMONIALS, ...SITE_TESTIMONIALS]
                ).map((r, i) => (
                  <div key={`${r.name}-${i}`} className="rv rv-slide">
                    <div className="rv-stars">{r.stars}</div>
                    <p className="rv-q">{r.quote}</p>
                    <div className="rv-author">
                      <div className="rv-av">{r.initials}</div>
                      <div>
                        <div className="rv-name">{r.name}</div>
                        <div className="rv-role">{r.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <OnPageSeoSection
          theme="boxed"
          eyebrow="About how we work"
          sectionId="home-on-page-seo"
          heading="What Web, Shopify &amp; WordPress Builds Do You Get?"
          lead={
            <>
              <p>
                <strong>RathiSoft</strong> works from <strong>Johar Town, Lahore</strong>, shipping
                responsive sites, commerce stores, and marketing that ties to revenue. You get
                staging before launch, written scopes, and WhatsApp access to the builders—not a
                faceless ticket queue.
              </p>
              <p>
                Typical work covers landing pages, WooCommerce or Shopify checkout fixes, speed
                passes aligned with{' '}
                <a href="https://web.dev/articles/vitals" target="_blank" rel="noopener noreferrer">
                  Core Web Vitals
                </a>
                , and hooks into analytics and CRMs you already use. New launch or rescue project—we
                quote timelines upfront.
              </p>
            </>
          }
          links={[
            {
              to: '/services',
              label: 'See services — web, apps, SEO & digital marketing',
            },
            {
              to: '/work',
              label: 'View portfolio — WordPress, Shopify & real launches',
            },
            {
              to: '/about',
              label: 'About RathiSoft — team, values & how we operate',
            },
            {
              to: '/packages',
              label: 'Packages & pricing — retainers and project bundles',
            },
          ]}
        >
          <p>
            We care about semantic HTML, responsive layouts, and assets that stay light on mobile.
            When it fits, we wire APIs,{' '}
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
              React
            </a>{' '}
            front-ends, WooCommerce automation, and email flows—always tied to leads, sales, or
            sign-ups you can track.
          </p>
          <p>
            Before you hire anyone, ask how they handle hosting, backups, updates after launch, and
            what happens if something breaks. We spell that out for{' '}
            <Link to="/packages">packages</Link> and custom work alike, and we stay reachable after
            delivery — many clients come back for iterations and new phases.
          </p>
          <p>
            Next step: scroll to the <a href="#contact">contact section</a> on this page, or{' '}
            <Link to="/contact">open the contact page</Link> for booking and detailed enquiries —
            we aim to respond within one business day.
          </p>
        </OnPageSeoSection>

        <div className="fcta" id="contact">
          <h2>Ready to Fix Your Site or Store?</h2>
          <p className="fcta-sub">
            Tell us what you&apos;re selling and what&apos;s broken—we&apos;ll reply with next
            steps, not a generic pitch deck.
          </p>

          <div className="fcta-row">
            <div className="ct-card">
              <h3 className="ct-card-title">Talk to us today</h3>
              <p className="ct-card-lead">
                WhatsApp, email, or the form—share your scope and we&apos;ll respond within one
                business day.
              </p>
              <div className="ct-item">
                <div className="ct-icon">📧</div>
                <a href="mailto:info@rathisoft.com" rel="noopener noreferrer">
                  info@rathisoft.com
                </a>
              </div>
              <div className="ct-item">
                <div className="ct-icon">📱</div>
                <a href={WA} target="_blank" rel="noopener noreferrer">
                  +92 334 2651544
                </a>
              </div>
              <div className="ct-item ct-item-last">
                <div className="ct-icon">📍</div>
                <span>Johar Town, Lahore, Pakistan</span>
              </div>
              <a className="wa-contact-btn" href={WA} target="_blank" rel="noopener noreferrer">
                💬 WhatsApp us
              </a>
            </div>
            <ContactLeadForm
              idPrefix="home-d"
              formClassName="fcta-form-card fcta-form-compact"
              onSubmit={onContactLeadSubmit}
            />
          </div>

          <div className="fcta-mobile-contact">
            <ContactLeadForm
              idPrefix="home-m"
              formClassName="fcta-mobile-inner fcta-form-compact"
              onSubmit={onContactLeadSubmit}
            />
          </div>
        </div>
      </div>

    </main>
  )
}
