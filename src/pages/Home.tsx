import gsap from 'gsap'
import type { FormEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
// import { HeroVideo } from '../components/HeroVideo'
import { AiCoreSection } from '../components/AiCoreSection'
import { AiIndustriesSection } from '../components/AiIndustriesSection'
import { HowItWorksPanel } from '../components/HowItWorksPanel'
import { Seo } from '../components/Seo'
import { BLOG_POSTS } from '../data/blogPosts'
import { HomepageServicesGrid } from '../components/HomepageServicesGrid'
import { ROUTES, blogPath, servicePath } from '../utils/routes'
import { HOMEPAGE_SERVICE_CARDS } from '../data/homepageServiceCards'
import { PAGE_SEO } from '../data/pageSeo'
import { JsonLd } from '../components/JsonLd'
import { buildHomePageSchemaGraph } from '../data/schemaMarkup'
import { SITE_TESTIMONIALS } from '../data/testimonials'
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

const TRUST_CARDS = [
  { icon: '🛠️', bg: 'rgba(99,102,241,0.08)', title: 'Custom & Post-Launch', text: 'Tailor-made solutions built for your specific needs — aur website live hone ke baad bhi hum hamesha available hain maintenance ke liye.' },
  { icon: '🎨', bg: 'rgba(245,158,11,0.08)', title: 'UI/UX Focused', text: 'Design sirf dikhne mein accha nahi — user-friendly bhi hona chahiye. Hum user experience ko har cheez se pehle rakhte hain.' },
  { icon: '⚡', bg: 'rgba(16,185,129,0.08)', title: 'Fast Delivery', text: 'On-time across every project — no delays, no excuses, ever. Aapka time hamare liye bhi precious hai.' },
  { icon: '🔒', bg: 'rgba(79,70,229,0.08)', title: 'NDA-Ready', text: 'Your project details and code stay private — NDAs signed on request. Aapki privacy hamari zimmedari hai.' },
  { icon: '💬', bg: 'rgba(37,211,102,0.08)', title: '24hr Response', text: 'Always reachable via WhatsApp, email, or your preferred channel. Hum kabhi bhi door nahi hote.' },
  { icon: '🌍', bg: 'rgba(244,63,94,0.08)', title: 'Global Clients', text: 'Clients across Pakistan, UK, UAE, and beyond — all served remotely with zero friction, zero delay.' },
] as const

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

  return (
    <main className="app-main">
      <Seo
        title={PAGE_SEO.home.title}
        description={PAGE_SEO.home.description}
        keywords={PAGE_SEO.home.keywords}
      />
      <JsonLd data={buildHomePageSchemaGraph()} />
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
            src="/images/Side.webp"
            alt="Custom web app development Lahore Pakistan — RathiSoft hero brand visual"
            title="RathiSoft — software agency in Lahore, Pakistan"
            width={480}
            height={720}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="hero-side"
            onError={(e) => {
              const img = e.currentTarget
              if (!img.src.includes('Side.png')) img.src = '/images/Side.png'
            }}
          />
          <div className="hero-l">
            <div className="hero-pill">
              <span className="pill-pulse"  />
              Scale Your Brand · High-Performance Web · Global Reach
            </div>
            <h1 id="hero-heading" className="hero-h">
             Software Services  <br />
              <span className="hero-h-accent"> Built to Perform</span>
            </h1>
            <p className="hero-p">
              RathiSoft is a <strong>Pakistan software house</strong> and{' '}
              <strong>IT company in Lahore</strong> for founders who want to{' '}
              <em>hire a web developer in Pakistan</em> without agency runaround. We ship{' '}
              <strong>affordable web development</strong>,{' '}
              <Link to={servicePath('wordpress-shopify')}>WordPress and Shopify stores</Link>, and mobile
              apps that load fast—plus digital marketing tied to leads and sales, not vanity
              metrics. One team, clear milestones, and a direct line to the engineers doing the
              work.
            </p>
            <div className="hero-btns">
              <a href="#contact" className="btn-primary">
                Get a free project quote →
              </a>
              <Link to={ROUTES.services} className="btn-ghost">
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
                    alt={`Trusted business client portrait ${i + 1} — RathiSoft web development Lahore`}
                    title="Clients who trust RathiSoft for web and Shopify projects"
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
            [`${HOMEPAGE_SERVICE_CARDS.length}`, '+', 'Services offered'],
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

        <AiCoreSection />

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
                        rel="noopener noreferrer nofollow"
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
                    <Link to={servicePath('wordpress-shopify')}>WordPress or Shopify</Link> stack so
                    you can focus on customers. Need proof first? Browse our{' '}
                    <Link to={ROUTES.portfolio}>portfolio of shipped projects</Link>.
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
              <h2 id="home-services-heading">Web &amp; Mobile Builds That Ship on Time</h2>
              <p className="home-lead">
                From marketing sites to{' '}
                <Link to={servicePath('web-development')}>custom web development</Link> and{' '}
                <Link to={servicePath('app-development')}>mobile apps</Link>, our Lahore team delivers
                responsive layouts, solid integrations, and code your in-house squad can maintain.
              </p>
              <h3 className="home-h3-follow">Digital Marketing Built for Revenue</h3>
              <p className="home-lead">
                <Link to={servicePath('seo-services')}>SEO</Link>, paid ads, social, and content
                aimed at leads and sales—scoped to your budget and reported in plain language.
              </p>
            </div>
            <HomepageServicesGrid collapsible interactive ctaToContact />
          </div>
        </section>

        <AiIndustriesSection />

        <section className="alt">
          <div className="home-wrap">
            <div className="home-section-head">
              <div className="home-label">Why Trust Us</div>
              <h2>Why Do Teams Stick With RathiSoft?</h2>
              <p className="home-lead">
                Real launches, clean handoffs, and support after go-live—see the{' '}
                <Link to={ROUTES.about}>story behind our studio</Link>, our{' '}
                <Link to={ROUTES.blog}>software insights blog</Link>
                {BLOG_POSTS[0] ? (
                  <>
                    , and the guide{' '}
                    <Link to={blogPath(BLOG_POSTS[0].slug)}>{BLOG_POSTS[0].h1}</Link>
                  </>
                ) : null}
                .
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

        <div className="fcta" id="contact">
          <h2>Ready to Fix Your Site or Store?</h2>
          <p className="fcta-sub">
            Tell us what you&apos;re selling and what&apos;s broken—we&apos;ll reply with next
            steps, not a generic pitch deck.
          </p>

          <div className="fcta-row">
            <HowItWorksPanel headingId="home-how-it-works-heading" />
            <div className="fcta-form-col">
              <h2 className="fcta-form-heading">Request a free project quote</h2>
              <ContactLeadForm
                idPrefix="home-d"
                formClassName="fcta-form-card fcta-form-compact"
                onSubmit={onContactLeadSubmit}
              />
            </div>
          </div>

          <div className="fcta-mobile-contact">
            <HowItWorksPanel headingId="how-it-works-heading-mobile" />
            <h2 className="fcta-form-heading">Request a free project quote</h2>
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
