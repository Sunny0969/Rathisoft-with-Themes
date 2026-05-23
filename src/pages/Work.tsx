import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  isPortfolioFilterId,
  type PortfolioFilterId,
} from '../data/servicePortfolioLinks'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { CaseStudiesSection } from '../components/CaseStudiesSection'
import { Seo } from '../components/Seo'
import { REL_CLIENT_LIVE } from '../utils/externalLink'
import { PAGE_SEO } from '../data/pageSeo'
import { JsonLd } from '../components/JsonLd'
import { buildPortfolioItemListSchema } from '../data/schemaMarkup'
import { portfolioScreenshotAlt, toWebpSrc } from '../utils/imageAssets'
import { BLOG_POSTS } from '../data/blogPosts'
import { ROUTES, blogPath } from '../utils/routes'

const WA = 'https://wa.me/923342651544'

const PLACEHOLDER = (text: string) =>
  `https://via.placeholder.com/600x200/1e1e2d/6366f1?text=${encodeURIComponent(text)}`

function matchesFilter(cardCat: string, active: string): boolean {
  if (active === 'all') return true
  const parts = cardCat.trim().split(/\s+/).filter(Boolean)
  return parts.includes(active)
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

type TagDef = { cls: string; label: string }

type WorkCard = {
  cat: string
  href: string
  img: string
  imgFallback?: string
  alt: string
  tags: TagDef[]
  title: string
  recent?: boolean
  desc: string
  urlText: string
  emojiThumb?: boolean
}

type WorkSection = {
  id: string
  anchor: string
  label: string
  cards: WorkCard[]
}

const WORK_STYLES = `
.page-work {
  --bg: #13131a;
  --bg2: #1c1c27;
  --bg3: #22222f;
  --card: #1e1e2d;
  --indigo: #6366f1;
  --indigo2: #818cf8;
  --indigo3: #4f46e5;
  --iglow: rgba(99, 102, 241, 0.18);
  --isoft: rgba(99, 102, 241, 0.08);
  --border: rgba(255, 255, 255, 0.07);
  --border2: rgba(99, 102, 241, 0.3);
  --white: #fff;
  --gold: #f59e0b;
  --fh: 'Poppins', system-ui, sans-serif;
  --fb: 'Poppins', system-ui, sans-serif;
  --r2: 18px;
  --r3: 24px;
  --sh2: 0 8px 40px rgba(0, 0, 0, 0.35);
}
.page-work,
.page-work *,
.page-work *::before,
.page-work *::after {
  box-sizing: border-box;
}
.page-work h1 {
  font-family: var(--fh);
  font-size: clamp(44px, 5.5vw, 76px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -2px;
  color: var(--white);
  margin: 0;
}
.page-work h2 {
  font-family: var(--fh);
  font-size: clamp(26px, 3vw, 40px);
  font-weight: 600;
  color: var(--white);
  letter-spacing: -0.5px;
  margin: 0;
}
.page-work p {
  line-height: 1.8;
  font-weight: 300;
  color: #ffffff;
  margin: 0;
}
.page-work a {
  text-decoration: none;
}
.page-work .wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 52px;
}
.page-work .label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--indigo2);
  margin-bottom: 14px;
}
.page-work .label::before {
  content: '';
  width: 28px;
  height: 1px;
  background: linear-gradient(90deg, var(--indigo), transparent);
}
.page-work .hero {
  padding: 48px 0 60px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, var(--bg), var(--bg2));
  position: relative;
  overflow: hidden;
}
.page-work .hero::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -80px;
  width: 550px;
  height: 550px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, transparent 65%);
  pointer-events: none;
}
.page-work .hero .wrap {
  position: relative;
  z-index: 1;
}
.page-work .hero p {
  font-size: 16px;
  margin-top: 12px;
  max-width: 520px;
}
.page-work .stats-bar {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  margin-top: 40px;
  padding-top: 36px;
  border-top: 1px solid var(--border);
}
.page-work .stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.page-work .stat-num {
  font-family: var(--fh);
  font-size: 28px;
  font-weight: 700;
  color: var(--indigo2);
}
.page-work .stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
  text-transform: uppercase;
}
.page-work .filters-wrap {
  padding: 40px 0 0;
}
.page-work .filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 36px;
}
.page-work .fb-btn {
  font-size: 12px;
  font-weight: 500;
  padding: 8px 20px;
  border-radius: 100px;
  border: 1px solid var(--border);
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  font-family: var(--fb);
  transition: all 0.2s;
}
.page-work .fb-btn:hover,
.page-work .fb-btn.active {
  background: var(--isoft);
  border-color: var(--border2);
  color: var(--indigo2);
}
.page-work .section-label {
  font-family: var(--fh);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--indigo2);
  padding: 24px 0 16px;
  border-top: 1px solid var(--border);
  margin: 8px 0 0;
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.3;
}
.page-work .section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--border2), transparent);
}
.page-work .port-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-bottom: 24px;
}
.page-work .pc {
  border: 1px solid var(--border);
  border-radius: var(--r2);
  overflow: hidden;
  background: var(--card);
  transition: all 0.3s;
  position: relative;
}
.page-work .pc a.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}
.page-work .pc:hover {
  border-color: var(--border2);
  transform: translateY(-5px);
  box-shadow: var(--sh2);
}
.page-work .pc-thumb {
  height: 200px;
  position: relative;
  overflow: hidden;
  background: #181825;
}
.page-work .pc-thumb img.screenshot {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
  transition: transform 0.5s ease;
}
.page-work .pc:hover .pc-thumb img.screenshot {
  transform: scale(1.04);
}
.page-work .pc-thumb .overlay {
  position: absolute;
  inset: 0;
  background: rgba(99, 102, 241, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: #fff;
  gap: 6px;
}
.page-work .pc:hover .pc-thumb .overlay {
  opacity: 1;
}
.page-work .pc-thumb.emoji-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
}
.page-work .pc-thumb.emoji-thumb img.screenshot {
  object-fit: cover;
}
.page-work .pc-thumb.emoji-thumb::after {
  content: 'View Project ↗';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.9);
  color: #fff;
  font-family: var(--fb);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1.5px;
  opacity: 0;
  transition: opacity 0.3s;
}
.page-work .pc:hover .pc-thumb.emoji-thumb::after {
  opacity: 1;
}
.page-work .pc-info {
  padding: 16px 18px 18px;
  border-top: 1px solid var(--border);
}
.page-work .pc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.page-work .tag {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 100px;
  border: 1px solid;
}
.page-work .tag-wp {
  color: #4e9ef5;
  border-color: rgba(78, 158, 245, 0.3);
  background: rgba(78, 158, 245, 0.07);
}
.page-work .tag-shopify {
  color: #96bf48;
  border-color: rgba(150, 191, 72, 0.3);
  background: rgba(150, 191, 72, 0.07);
}
.page-work .tag-custom {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
  background: rgba(245, 158, 11, 0.07);
}
.page-work .tag-uiux {
  color: #e879f9;
  border-color: rgba(232, 121, 249, 0.3);
  background: rgba(232, 121, 249, 0.07);
}
.page-work .tag-ai {
  color: #34d399;
  border-color: rgba(52, 211, 153, 0.3);
  background: rgba(52, 211, 153, 0.07);
}
.page-work .tag-seo {
  color: #fb923c;
  border-color: rgba(251, 146, 60, 0.3);
  background: rgba(251, 146, 60, 0.07);
}
.page-work .tag-ecom {
  color: #f472b6;
  border-color: rgba(244, 114, 182, 0.3);
  background: rgba(244, 114, 182, 0.07);
}
.page-work .tag-video-editing {
  color: #f43f5e;
  border-color: rgba(244, 63, 94, 0.35);
  background: rgba(244, 63, 94, 0.08);
}
.page-work .pc-name {
  font-size: 15px;
  color: #ffffff;
  font-weight: 600;
  font-family: var(--fh);
  margin-bottom: 5px;
}
.page-work .pc-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}
.page-work .pc-url {
  font-size: 10px;
  color: var(--indigo2);
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  opacity: 0.7;
}
.page-work .pc-url svg {
  width: 9px;
  height: 9px;
}
.page-work .work-evidence {
  background: var(--bg2);
  border-top: 1px solid var(--border);
  padding: 72px 0 80px;
}
.page-work .work-evidence h2 {
  max-width: 920px;
  margin-bottom: 20px;
  line-height: 1.12;
}
.page-work .work-evidence-shell {
  background: linear-gradient(145deg, rgba(99, 102, 241, 0.06), rgba(30, 30, 45, 0.92));
  border: 1px solid rgba(99, 102, 241, 0.22);
  border-radius: var(--r3);
  padding: 28px 26px 30px;
  position: relative;
  overflow: hidden;
}
.page-work .work-evidence-shell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--indigo), var(--indigo3), transparent);
  opacity: 0.85;
  pointer-events: none;
}
.page-work .work-evidence-shell > * {
  position: relative;
  z-index: 1;
}
.page-work .work-evidence-lead {
  font-size: 14px;
  line-height: 1.85;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.88);
  margin: 0;
  max-width: 720px;
}
.page-work .work-evidence-lead strong {
  font-weight: 500;
  color: #fff;
}
.page-work .work-evidence-pillars {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 22px;
}
.page-work .work-evidence-pillar {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--r2);
  padding: 18px 16px 20px;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}
.page-work .work-evidence-pillar:hover {
  border-color: var(--border2);
  transform: translateY(-2px);
  box-shadow: var(--sh2);
}
.page-work .work-evidence-pillar-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--indigo2);
  margin-bottom: 10px;
}
.page-work .work-evidence-pillar h3 {
  font-family: var(--fh);
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 12px;
  line-height: 1.3;
  letter-spacing: -0.3px;
  color: var(--white);
}
.page-work .work-evidence-pillar ul {
  margin: 0;
  padding: 0 0 0 18px;
  font-size: 12px;
  line-height: 1.75;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.82);
}
.page-work .work-evidence-pillar li {
  margin-bottom: 8px;
}
.page-work .work-evidence-pillar li:last-child {
  margin-bottom: 0;
}
.page-work .work-evidence-nav {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 22px;
  max-width: 920px;
}
.page-work .work-evidence-nav a {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 18px 18px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--r2);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.45;
  transition:
    border-color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
}
.page-work .work-evidence-nav a::before {
  content: '→';
  flex-shrink: 0;
  margin-top: 2px;
  font-weight: 600;
  color: var(--indigo2);
}
.page-work .work-evidence-nav a:hover {
  border-color: var(--border2);
  transform: translateY(-3px);
  box-shadow: var(--sh2);
  color: #fff;
}
.page-work .work-evidence-nav a:focus-visible {
  outline: 2px solid var(--indigo2);
  outline-offset: 3px;
}
.page-work .work-evidence-foot {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 22px;
}
.page-work .work-evidence-ref {
  font-size: 11px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.6;
}
.page-work .work-evidence-ref a {
  color: var(--indigo2);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.page-work .work-evidence-ref a:hover {
  color: #c7d2fe;
}
.page-work a.work-evidence-ref-inline {
  color: var(--indigo2);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.page-work a.work-evidence-ref-inline:hover {
  color: #c7d2fe;
}
.page-work .work-evidence-about-link {
  font-size: 13px;
  font-weight: 500;
  color: var(--indigo2);
}
.page-work .work-evidence-about-link:hover {
  color: #c7d2fe;
}
.page-work .cta {
  background: var(--bg2);
  border-top: 1px solid var(--border);
  padding: 72px 52px;
  text-align: center;
}
.page-work .cta h2 {
  margin-bottom: 12px;
}
.page-work .cta p {
  color: #ffffff;
  font-size: 15px;
  margin-bottom: 32px;
}
.page-work .cta-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.page-work .btn-p {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--indigo);
  color: #fff;
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--fb);
  transition: all 0.25s;
  box-shadow: 0 4px 20px var(--iglow);
}
.page-work .btn-p:hover {
  background: var(--indigo3);
  transform: translateY(-2px);
}
.page-work .btn-g {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #25d366;
  color: #fff;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--fb);
  transition: all 0.25s;
}
.page-work .btn-g:hover {
  background: #20bf5d;
  transform: translateY(-2px);
}
@media (max-width: 960px) {
  .page-work .cta,
  .page-work .wrap {
    padding-left: 24px;
    padding-right: 24px;
  }
  .page-work .port-grid {
    grid-template-columns: 1fr 1fr;
  }
  .page-work .stats-bar {
    gap: 16px;
    flex-wrap: nowrap;
  }
  .page-work .stat {
    flex: 1;
    min-width: 0;
  }
  .page-work .stat-num {
    font-size: 22px;
  }
  .page-work .stat-label {
    font-size: 9px;
  }
  .page-work .work-evidence-pillars,
  .page-work .work-evidence-nav {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 600px) {
  .page-work .port-grid {
    grid-template-columns: 1fr;
  }
}
`

const FILTER_BTNS: { id: PortfolioFilterId; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'custom', label: 'Custom Web' },
  { id: 'wordpress', label: 'WordPress' },
  { id: 'shopify', label: 'Shopify' },
  { id: 'uiux', label: 'UI/UX' },
  { id: 'graphics', label: 'Graphics Designing' },
  { id: 'video-editing', label: 'Video Editing' },
  { id: 'seo', label: 'SEO' },
]

function ProjectCard({
  card,
  imgLoading = 'lazy',
}: {
  card: WorkCard
  /** First above-the-fold thumb: eager + high fetch priority for faster LCP */
  imgLoading?: 'lazy' | 'eager'
}) {
  const initialSrc = toWebpSrc(card.img)
  const [src, setSrc] = useState(initialSrc)
  const imageAlt = portfolioScreenshotAlt(card.title)

  useEffect(() => {
    setSrc(toWebpSrc(card.img))
  }, [card.img])

  const onImgErr = () => {
    if (card.imgFallback && src !== card.imgFallback) {
      setSrc(card.imgFallback)
      return
    }
    setSrc(PLACEHOLDER(card.title.slice(0, 24)))
  }

  const thumbCls = `pc-thumb${card.emojiThumb ? ' emoji-thumb' : ''}`

  return (
    <article className="pc">
      <a
        className="card-link"
        href={card.href}
        target="_blank"
        rel={REL_CLIENT_LIVE}
      >
        <div className={thumbCls}>
          <img
            className="screenshot"
            src={src}
            alt={imageAlt}
            title={`${card.title} — live project by RathiSoft`}
            width={800}
            height={500}
            loading={imgLoading}
            decoding="async"
            fetchPriority={imgLoading === 'eager' ? 'high' : undefined}
            onError={onImgErr}
          />
          {!card.emojiThumb && <div className="overlay">View Live Site ↗</div>}
        </div>
        <div className="pc-info">
          <div className="pc-tags">
            {card.tags.map((t) => (
              <span key={t.cls + t.label} className={`tag ${t.cls}`}>
                {t.label}
              </span>
            ))}
          </div>
          <div className="pc-name">
            {card.title}
            {card.recent ? (
              <span
                style={{
                  fontSize: 9,
                  color: 'var(--indigo2)',
                  fontWeight: 600,
                  marginLeft: 6,
                }}
              >
                ★ Recent
              </span>
            ) : null}
          </div>
          <div className="pc-desc">{card.desc}</div>
          <div className="pc-url">
            <ExternalIcon />
            {card.urlText}
          </div>
        </div>
      </a>
    </article>
  )
}

/** Portfolio sections — paths under `/public/images/` when you add assets */
const SECTIONS: WorkSection[] = [
  {
    id: 'custom',
    anchor: 'section-custom',
    label: 'Custom Web Deployments',
    cards: [
      {
        cat: 'custom',
        href: 'https://www.karvaantours.com/',
        img: '/images/karvaantours.webp',
        imgFallback: PLACEHOLDER('Karvaan Tours'),
        alt: 'Karvaan Tours',
        tags: [
          { cls: 'tag-custom', label: 'Custom Web' },
          { cls: 'tag-ecom', label: 'Tours' },
        ],
        title: 'Karvaan Tours',
        desc: 'Full travel & tours website with booking flows, destinations, and custom design.',
        urlText: 'karvaantours.com',
      },
      {
        cat: 'custom',
        href: 'https://ticket-barter.com/',
        img:
          'https://api.microlink.io/?url=https://ticket-barter.com/&screenshot=true&meta=false&embed=screenshot.url',
        imgFallback: PLACEHOLDER('Ticket Barter'),
        alt: 'Ticket Barter',
        tags: [
          { cls: 'tag-custom', label: 'Custom Web' },
          { cls: 'tag-ecom', label: 'Marketplace' },
        ],
        title: 'Ticket Barter',
        desc: 'Ticket trading & marketplace platform with custom frontend and transaction flows.',
        urlText: 'ticket-barter.com',
      },
      {
        cat: 'custom',
        href: 'https://www.medial.au',
        img:
          'https://api.microlink.io/?url=https://www.medial.au&screenshot=true&meta=false&embed=screenshot.url',
        imgFallback: PLACEHOLDER('Medial AI'),
        alt: 'Medial',
        tags: [
          { cls: 'tag-custom', label: 'Custom Web' },
          { cls: 'tag-ai', label: 'AI SaaS' },
        ],
        title: 'Medial.au',
        desc: 'AI-powered accounting SaaS platform. Analyze & manage accounting data with powerful AI.',
        urlText: 'medial.au',
      },
      {
        cat: 'custom ai',
        href: 'https://montek-creative.vercel.app/',
        img:
          'https://api.microlink.io/?url=https://montek-creative.vercel.app/&screenshot=true&meta=false&embed=screenshot.url',
        imgFallback: PLACEHOLDER('Montek Creative'),
        alt: 'Montek Creative',
        tags: [
          { cls: 'tag-custom', label: 'Custom Web' },
          { cls: 'tag-ai', label: 'Creative' },
        ],
        title: 'Montek Creative',
        desc: 'Creative agency portfolio with modern design and smooth interactions.',
        urlText: 'montek-creative.vercel.app',
      },
      {
        cat: 'custom',
        href: 'https://www.urbansplatter.com/',
        img:
          'https://api.microlink.io/?url=https://www.urbansplatter.com/&screenshot=true&meta=false&embed=screenshot.url',
        imgFallback: PLACEHOLDER('Urban Splatter'),
        alt: 'Urban Splatter',
        tags: [
          { cls: 'tag-custom', label: 'Custom Web' },
          { cls: 'tag-seo', label: 'Content' },
        ],
        title: 'Urban Splatter',
        desc: 'High-traffic content & lifestyle website with custom web deployment and SEO optimization.',
        urlText: 'urbansplatter.com',
      },
      {
        cat: 'custom',
        href: 'https://www.londondaily.news/',
        img: '/images/londonDaily.webp',
        imgFallback: PLACEHOLDER('London Daily News'),
        alt: 'London Daily News',
        tags: [
          { cls: 'tag-custom', label: 'Custom Web' },
          { cls: 'tag-seo', label: 'News' },
        ],
        title: 'London Daily News',
        desc: 'Digital news publication with custom deployment, editorial layout, and fast performance.',
        urlText: 'londondaily.news',
      },
      {
        cat: 'custom',
        href: 'https://pickpackpro.co.uk/',
        img:
          'https://api.microlink.io/?url=https://pickpackpro.co.uk/&screenshot=true&meta=false&embed=screenshot.url',
        imgFallback: PLACEHOLDER('PickPack Pro'),
        alt: 'PickPack Pro',
        tags: [
          { cls: 'tag-custom', label: 'Custom Web' },
          { cls: 'tag-ecom', label: 'Logistics' },
        ],
        title: 'PickPack Pro',
        recent: true,
        desc: 'UK-based logistics & fulfilment services website with custom design and functionality.',
        urlText: 'pickpackpro.co.uk',
      },
      {
        cat: 'custom',
        href: 'https://tripsadora.com/',
        img: '/images/TripsAdora.webp',
        imgFallback: PLACEHOLDER('Tripsadora'),
        alt: 'Tripsadora',
        tags: [
          { cls: 'tag-custom', label: 'Custom Web' },
          { cls: 'tag-ecom', label: 'Travel' },
        ],
        title: 'Tripsadora',
        desc: 'Travel discovery platform with custom web deployment and dynamic destination pages.',
        urlText: 'tripsadora.com',
      },
    ],
  },
  {
    id: 'wordpress',
    anchor: 'section-wordpress',
    label: 'WordPress Websites',
    cards: [
      {
        cat: 'wordpress',
        href: 'https://www.openpr.com/',
        img: '/images/OpenPR.webp',
        imgFallback: PLACEHOLDER('OpenPR'),
        alt: 'OpenPR',
        tags: [
          { cls: 'tag-wp', label: 'WordPress' },
          { cls: 'tag-seo', label: 'PR & News' },
        ],
        title: 'OpenPR',
        desc: 'Press release distribution platform built on WordPress with high-volume content management.',
        urlText: 'openpr.com',
      },
      {
        cat: 'wordpress',
        href: 'https://thedatascientist.com/',
        img:
          'https://api.microlink.io/?url=https://thedatascientist.com/&screenshot=true&meta=false&embed=screenshot.url',
        imgFallback: PLACEHOLDER('The Data Scientist'),
        alt: 'The Data Scientist',
        tags: [
          { cls: 'tag-wp', label: 'WordPress' },
          { cls: 'tag-ai', label: 'Tech' },
        ],
        title: 'The Data Scientist',
        desc: 'Tech & data science publication built on WordPress with editorial layout and SEO structure.',
        urlText: 'thedatascientist.com',
      },
      {
        cat: 'wordpress',
        href: 'https://souvenirhandicraft.online/',
        img:
          'https://api.microlink.io/?url=https://souvenirhandicraft.online/&screenshot=true&meta=false&embed=screenshot.url',
        imgFallback: PLACEHOLDER('Souvenir Handicraft'),
        alt: 'Souvenir Handicraft',
        tags: [
          { cls: 'tag-wp', label: 'WordPress' },
          { cls: 'tag-ecom', label: 'eCommerce' },
        ],
        title: 'Souvenir Handicraft',
        recent: true,
        desc: 'Handicraft & souvenir store on WordPress with WooCommerce, product pages, and custom design.',
        urlText: 'souvenirhandicraft.online',
      },
      {
        cat: 'wordpress',
        href: 'https://straightupinspections.com.au/',
        img:
          'https://api.microlink.io/?url=https://straightupinspections.com.au/&screenshot=true&meta=false&embed=screenshot.url',
        imgFallback: PLACEHOLDER('Straight Up Inspections'),
        alt: 'Straight Up Inspections',
        tags: [
          { cls: 'tag-wp', label: 'WordPress' },
          { cls: 'tag-custom', label: 'Services' },
        ],
        title: 'Straight Up Inspections',
        desc: 'Australian property inspection services website with booking forms and custom WordPress build.',
        urlText: 'straightupinspections.com.au',
      },
    ],
  },
  {
    id: 'shopify',
    anchor: 'section-shopify',
    label: 'Shopify Stores',
    cards: [
      {
        cat: 'shopify',
        href: 'https://smithhonig.com/',
        img:
          'https://api.microlink.io/?url=https://smithhonig.com/&screenshot=true&meta=false&embed=screenshot.url',
        imgFallback: PLACEHOLDER('Smith Honig'),
        alt: 'Smith Honig',
        tags: [
          { cls: 'tag-shopify', label: 'Shopify' },
          { cls: 'tag-ecom', label: 'Fashion' },
        ],
        title: 'Smith Honig',
        desc: 'Premium fashion Shopify store with custom theme, product pages, and payment integration.',
        urlText: 'smithhonig.com',
      },
      {
        cat: 'shopify',
        href: 'https://insta-mart.co.uk/',
        img:
          'https://api.microlink.io/?url=https://insta-mart.co.uk/&screenshot=true&meta=false&embed=screenshot.url',
        imgFallback: PLACEHOLDER('Insta Mart'),
        alt: 'Insta Mart',
        tags: [
          { cls: 'tag-shopify', label: 'Shopify' },
          { cls: 'tag-ecom', label: 'Grocery' },
        ],
        title: 'Insta-Mart UK',
        desc: 'UK grocery & convenience store on Shopify with fast checkout and inventory management.',
        urlText: 'insta-mart.co.uk',
      },
      {
        cat: 'shopify',
        href: 'https://deseomarketing.com/',
        img: '/images/deseomarketing.webp',
        imgFallback: PLACEHOLDER('Deseo Marketing'),
        alt: 'Deseo Marketing',
        tags: [
          { cls: 'tag-shopify', label: 'Shopify' },
          { cls: 'tag-ecom', label: 'Marketing' },
        ],
        title: 'Deseo Marketing',
        desc: 'Marketing agency Shopify site with clean design, service showcasing, and lead generation.',
        urlText: 'deseomarketing.com',
      },
      {
        cat: 'shopify',
        href: 'https://shopnudra.com/',
        img:
          'https://api.microlink.io/?url=https://shopnudra.com/&screenshot=true&meta=false&embed=screenshot.url',
        imgFallback: PLACEHOLDER('Shop Nudra'),
        alt: 'Shop Nudra',
        tags: [
          { cls: 'tag-shopify', label: 'Shopify' },
          { cls: 'tag-ecom', label: 'Lifestyle' },
        ],
        title: 'Shop Nudra',
        desc: 'Lifestyle & apparel Shopify store with custom theme, collections, and seamless checkout.',
        urlText: 'shopnudra.com',
      },
    ],
  },
  {
    id: 'graphics',
    anchor: 'section-graphics',
    label: 'Graphics Designing',
    cards: [
      {
        cat: 'graphics',
        href: 'https://www.instagram.com/darachaharbagh?igsh=MTE3c3Q4aTlzMWk2Ng==',
        img: '/images/deraDeveloper.webp',
        imgFallback: PLACEHOLDER('Urban Real Estate'),
        alt: 'Dara Chahar Bagh',
        tags: [
          { cls: 'tag-ai', label: 'Graphics' },
          { cls: 'tag-custom', label: 'Social' },
        ],
        title: 'Urban Real Estate Showcase',
        desc: 'A professional suite of social media assets featuring clean typography and high-end architectural renders for luxury urban living.',
        urlText: 'instagram.com',
        emojiThumb: true,
      },
      {
        cat: 'graphics',
        href: 'https://www.instagram.com/digiladderpk?igsh=MWJ1MHYwMjFnbGM4dw==',
        img: '/images/digiladder.webp',
        imgFallback: PLACEHOLDER('DigiLadder'),
        alt: 'DigiLadder Marketing Portfolio',
        tags: [
          { cls: 'tag-ai', label: 'Graphics' },
          { cls: 'tag-custom', label: 'Growth' },
        ],
        title: 'Modern Marketing Portfolio',
        desc: 'A bold, engaging collection of social media graphics focused on branding, digital growth, and creative strategy.',
        urlText: 'instagram.com',
        emojiThumb: true,
      },
      {
        cat: 'graphics',
        href: 'https://www.instagram.com/ikraharismalikoffical?igsh=MThpamJvc3IxNjEwNw==',
        img: '/images/ikraHaris.webp',
        imgFallback: PLACEHOLDER('Ikra Haris'),
        alt: 'Elegant Ethnic Fashion',
        tags: [
          { cls: 'tag-ai', label: 'Graphics' },
          { cls: 'tag-custom', label: 'Brand' },
        ],
        title: 'Elegant Ethnic Fashion',
        desc: 'A sophisticated showcase of traditional wear photography and social media design, blending luxury aesthetics with cultural elegance.',
        urlText: 'instagram.com',
        emojiThumb: true,
      },
      {
        cat: 'graphics',
        href: 'https://www.instagram.com/karvaantours/?hl=en',
        img: '/images/karvaantourssocialmedia.webp',
        imgFallback: PLACEHOLDER('Karvaan Social'),
        alt: 'Karvaan Tours Social Media',
        tags: [
          { cls: 'tag-ai', label: 'Graphics' },
          { cls: 'tag-custom', label: 'Brand' },
        ],
        title: 'Global Travel Guide Graphics',
        desc: 'A vibrant collection of social media assets featuring scenic photography and elegant typography tailored for international tourism and cultural exploration.',
        urlText: 'instagram.com',
        emojiThumb: true,
      },
    ],
  },
  {
    id: 'uiux',
    anchor: 'section-uiux',
    label: 'UI/UX Design',
    cards: [
      {
        cat: 'uiux',
        href: 'https://www.figma.com/design/7oHf4FtxzhakOx1sele4Gq/Tech-Online-Store-Design?node-id=0-1&p=f',
        img: '/images/techonlinestoredesign.webp',
        imgFallback: PLACEHOLDER('Tech Online Store UI'),
        alt: 'Tech Online Store Design',
        tags: [
          { cls: 'tag-uiux', label: 'UI/UX' },
          { cls: 'tag-custom', label: 'Figma' },
        ],
        title: 'Tech Online Store UI Kit',
        desc: 'A sleek, full-flow Figma design system for a modern tech e-commerce experience. Built in Figma.',
        urlText: 'figma.com — View Design',
        emojiThumb: true,
      },
      {
        cat: 'uiux',
        href: 'https://www.figma.com/design/q3QRXfWXfOXk9encNClTpH/Well-Nest-Diagnosis?node-id=1-2679',
        img: '/images/well%20nest.webp',
        imgFallback: PLACEHOLDER('Well Nest UI'),
        alt: 'Well Nest Diagnosis UI',
        tags: [
          { cls: 'tag-uiux', label: 'UI/UX' },
          { cls: 'tag-custom', label: 'Prototype' },
        ],
        title: 'Well Nest Diagnosis UI',
        desc: 'Interactive prototype with complete user flow, components, and polished visual design.',
        urlText: 'figma.com — View Design',
        emojiThumb: true,
      },
      {
        cat: 'uiux',
        href: 'https://www.figma.com/design/w7FpArCXnLbOtsDRko2aPw/Dalel-admin-panel?node-id=0-1&p=f',
        img: '/images/dalelkuwait.webp',
        imgFallback:
          'https://www.figma.com/design/w7FpArCXnLbOtsDRko2aPw/Dalel-admin-panel?node-id=0-1&p=f',
        alt: 'Dalel Admin Panel',
        tags: [
          { cls: 'tag-uiux', label: 'UI/UX' },
          { cls: 'tag-custom', label: 'Design' },
        ],
        title: 'Dalel Admin Panel',
        desc: 'A comprehensive dashboard ecosystem featuring user management, detailed analytics, and business configuration tools.',
        urlText: 'figma.com — View Design',
        emojiThumb: true,
      },
      {
        cat: 'uiux',
        href: 'https://www.figma.com/design/oRqAIzKRR9lVlAH0NBpFw8/Trips-Adora?node-id=4119-1781&p=f&t=Bcq4el3K5Jdsh88H-0',
        img: '/images/TripsAdora.webp',
        imgFallback:
          'https://www.figma.com/design/oRqAIzKRR9lVlAH0NBpFw8/Trips-Adora?node-id=4119-1781&p=f&t=Bcq4el3K5Jdsh88H-0',
        alt: 'Trips Adora UI',
        tags: [
          { cls: 'tag-uiux', label: 'UI/UX' },
          { cls: 'tag-custom', label: 'Design' },
        ],
        title: 'Trips Adora UI',
        desc: 'An extensive travel booking UI system featuring complex user flows for search, rewards, and multi-destination trip planning.',
        urlText: 'figma.com — View Design',
        emojiThumb: true,
      },
      {
        cat: 'uiux',
        href: 'https://www.figma.com/proto/oRqAIzKRR9lVlAH0NBpFw8/Trips-Adora?node-id=4119-2031&t=Bcq4el3K5Jdsh88H-0&scaling=min-zoom&content-scaling=fixed&page-id=4119%3A1781',
        img: '/images/motorcar.webp',
        imgFallback:
          'https://www.figma.com/proto/oRqAIzKRR9lVlAH0NBpFw8/Trips-Adora?node-id=4119-2031&t=Bcq4el3K5Jdsh88H-0&scaling=min-zoom&content-scaling=fixed&page-id=4119%3A1781',
        alt: 'Car Rental UI',
        tags: [
          { cls: 'tag-uiux', label: 'UI/UX' },
          { cls: 'tag-custom', label: 'Design' },
        ],
        title: 'Car Rental UI',
        desc: 'A comprehensive Figma workspace for an automotive marketplace, featuring high-fidelity rental listings and seamless booking flows.',
        urlText: 'figma.com — View Design',
        emojiThumb: true,
      },
    ],
  },
  {
    id: 'video-editing',
    anchor: 'section-video-editing',
    label: 'Video Editing',
    cards: [
      {
        cat: 'video-editing',
        href: 'https://www.youtube.com/watch?v=_CUuQvN3tl4',
        img: 'https://i.ytimg.com/vi_webp/_CUuQvN3tl4/maxresdefault.webp',
        imgFallback: 'https://i.ytimg.com/vi_webp/_CUuQvN3tl4/hqdefault.webp',
        alt: 'YouTube Thumbnail',
        tags: [
          { cls: 'tag-video-editing', label: 'Video Editing' },
          { cls: 'tag-custom', label: 'Social' },
        ],
        title: 'Colorful 3D Anime Girl Room Chaos',
        desc: 'A high-fidelity Figma showcase of dynamic data visualization and user-centric analytics design.',
        urlText: 'youtube.com',
        emojiThumb: true,
      },
      {
        cat: 'video-editing',
        href: 'https://www.youtube.com/shorts/wGtUwJcUODs',
        img: 'https://i.ytimg.com/vi_webp/wGtUwJcUODs/maxresdefault.webp',
        imgFallback: 'https://i.ytimg.com/vi_webp/wGtUwJcUODs/hqdefault.webp',
        alt: 'YouTube Thumbnail',
        tags: [
          { cls: 'tag-video-editing', label: 'Video Editing' },
          { cls: 'tag-custom', label: 'Growth' },
        ],
        title: '3D Animated Boy & Puppy',
        desc: 'A breathtaking 3D cinematic exploration of surreal, hyper-realistic structures blending nature with high-tech design.',
        urlText: 'youtube.com',
        emojiThumb: true,
      },
      {
        cat: 'video-editing',
        href: 'https://www.youtube.com/shorts/7W2sHCOSisA',
        img: 'https://i.ytimg.com/vi_webp/7W2sHCOSisA/maxresdefault.webp',
        imgFallback: 'https://i.ytimg.com/vi_webp/7W2sHCOSisA/hqdefault.webp',
        alt: 'YouTube Thumbnail',
        tags: [
          { cls: 'tag-video-editing', label: 'Video Editing' },
          { cls: 'tag-custom', label: 'Brand' },
        ],
        title: 'Scary Gorilla Attack Scene 3D Animation',
        desc: 'A gripping, high-intensity 3D sequence featuring a hyper-realistic gorilla encounter in a lush jungle setting.',
        urlText: 'youtube.com',
        emojiThumb: true,
      },
    ],
  },
  {
    id: 'seo',
    anchor: 'section-SEO',
    label: 'Search Engine Optimization',
    cards: [
      {
        cat: 'seo',
        href: 'https://powerhousepilates.com/',
        img: '/images/powerhouse.webp',
        imgFallback: PLACEHOLDER('Powerhouse Pilates'),
        alt: 'Strategic SEO Growth for Health & Fitness Brand',
        tags: [
          { cls: 'tag-ai', label: 'SEO' },
          { cls: 'tag-custom', label: 'Organic Growth' },
        ],
        title: 'Strategic SEO Growth for Health & Fitness Brand',
        desc: 'Boosted organic traffic to 1.7K monthly visitors through targeted keyword optimization and authority building.',
        urlText: 'powerhousepilates.com',
        emojiThumb: true,
      },
      {
        cat: 'seo',
        href: 'https://charfen.co.uk/',
        img: '/images/charfen.webp',
        imgFallback: PLACEHOLDER('Charfen UK'),
        alt: 'Scaling Organic Traffic for UK-Based E-Commerce',
        tags: [
          { cls: 'tag-ai', label: 'SEO' },
          { cls: 'tag-custom', label: 'Organic Growth' },
        ],
        title: 'Scaling Organic Traffic for UK-Based E-Commerce',
        desc: 'Achieved 11.5K monthly organic sessions and managed a backlink profile of 27.4K for a competitive retail domain.',
        urlText: 'charfen.co.uk',
        emojiThumb: true,
      },
      {
        cat: 'seo',
        href: 'https://www.the-qrcode-generator.com/',
        img: '/images/QR_Generator.webp',
        imgFallback: PLACEHOLDER('QR Generator'),
        alt: 'Global SEO Management for SaaS Productivity Tools.',
        tags: [
          { cls: 'tag-ai', label: 'SEO' },
          { cls: 'tag-custom', label: 'Organic Growth' },
        ],
        title: 'Global SEO Management for SaaS Productivity Tools.',
        desc: 'Managed a high-authority domain with 1.5M monthly organic traffic and a massive 37.7K backlink portfolio.',
        urlText: 'the-qrcode-generator.com',
        emojiThumb: true,
      },
      {
        cat: 'seo',
        href: 'https://calculatethevat.co.uk/',
        img: '/images/vatcalculator.webp',
        imgFallback: PLACEHOLDER('VAT Calculator'),
        alt: 'Off-Page SEO & Backlink Strategy for Financial Tools',
        tags: [
          { cls: 'tag-ai', label: 'SEO' },
          { cls: 'tag-custom', label: 'Organic Growth' },
        ],
        title: 'Off-Page SEO & Backlink Strategy for Financial Tools',
        desc: 'A vibrant collection of social media assets featuring scenic photography and elegant typography tailored for international tourism and cultural exploration.',
        urlText: 'calculatethevat.co.uk',
        emojiThumb: true,
      },
    ],
  },
]

export function Work() {
  const [searchParams] = useSearchParams()
  const filterFromUrl = searchParams.get('filter') ?? ''
  const [filter, setFilter] = useState<PortfolioFilterId>(() =>
    isPortfolioFilterId(filterFromUrl) ? filterFromUrl : 'all',
  )

  useEffect(() => {
    const q = searchParams.get('filter') ?? ''
    if (isPortfolioFilterId(q)) setFilter(q)
    else if (!q) setFilter('all')
  }, [searchParams])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash) return
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
    return () => window.clearTimeout(t)
  }, [filter])

  const sectionsVisible = useMemo(() => {
    return SECTIONS.map((sec) => ({
      ...sec,
      cards: sec.cards.filter((c) => matchesFilter(c.cat, filter)),
    })).filter((s) => s.cards.length > 0)
  }, [filter])

  return (
    <>
      <Seo
        title={PAGE_SEO.work.title}
        description={PAGE_SEO.work.description}
        keywords={PAGE_SEO.work.keywords}
      />
      <JsonLd data={buildPortfolioItemListSchema()} />
      <main className="page-work lms-page app-main">
        <Breadcrumbs
          items={[
            { name: 'Home', path: ROUTES.home },
            { name: 'Portfolio', path: ROUTES.portfolio },
          ]}
        />
        <style>{WORK_STYLES}</style>

        <div className="hero">
        <div className="wrap">
          <div className="label">Our Work</div>
          <h1 id="work-hero-heading">Prove Our Craft with <br></br>Case Studies | RathiSoft</h1>
          <p>
            This <strong>web development portfolio</strong> shows WordPress, Shopify, custom web,
            and marketing launches you can verify—work from a <em>Pakistan software house</em>{' '}
            serving clinics, agencies, and brands worldwide. Like what you see?{' '}
            <Link to={ROUTES.contact}>Tell us about your project</Link> or compare scopes on our{' '}
            <Link to={ROUTES.services}>services page</Link>.
          </p>
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-num">27+</span>
              <span className="stat-label">Projects Delivered</span>
            </div>
            <div className="stat">
              <span className="stat-num">9+</span>
              <span className="stat-label">Service Categories</span>
            </div>
            <div className="stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">Job Success Score</span>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap filters-wrap">
        <div className="filters">
          {FILTER_BTNS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`fb-btn${filter === b.id ? ' active' : ''}`}
              onClick={() => setFilter(b.id)}
            >
              {b.label}
            </button>
          ))}
        </div>

        {sectionsVisible.map((sec, secIdx) => (
          <Fragment key={sec.id}>
            <h2 className="section-label" id={sec.anchor}>
              {sec.label}
            </h2>
            <div className="port-grid">
              {sec.cards.map((card, idx) => (
                <ProjectCard
                  key={`${sec.id}-${card.href}-${idx}`}
                  card={card}
                  imgLoading={secIdx === 0 && idx === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          </Fragment>
        ))}
      </div>

      <CaseStudiesSection />

      <section className="work-evidence" aria-labelledby="work-evidence-heading">
        <div className="wrap">
          <div className="label">Portfolio proof</div>
          <h2 id="work-evidence-heading">
            What We Document Behind Each Launch
          </h2>
          <div className="work-evidence-shell">
            <p className="work-evidence-lead">
              These projects are selected for outcomes, not pretty thumbnails. Where NDAs allow, we
              note funnel changes, speed improvements, or hours saved—so you can judge how we
              measure success, not just screenshots.
            </p>
            <div className="work-evidence-pillars">
              <div className="work-evidence-pillar">
                <div className="work-evidence-pillar-tag">01 · Metrics</div>
                <h3>Measurable deltas</h3>
                <ul>
                  <li>UX adjustments tied to abandonment, conversion, or funnel steps—not vanity screenshots.</li>
                  <li>LCP, CLS, and related shifts after performance passes.</li>
                  <li>Operational impact where automation replaces manual workflows.</li>
                </ul>
              </div>
              <div className="work-evidence-pillar">
                <div className="work-evidence-pillar-tag">02 · Evidence pack</div>
                <h3>What backs each story</h3>
                <ul>
                  <li>Annotated architecture snapshots for Shopify, WooCommerce, WordPress, or headless stacks.</li>
                  <li>Anonymised analytics excerpts where NDAs allow.</li>
                  <li>Governance and experimentation notes as SEO foundations stabilise.</li>
                </ul>
              </div>
              <div className="work-evidence-pillar">
                <div className="work-evidence-pillar-tag">03 · Bar</div>
                <h3>Polish vs reproducibility</h3>
                <ul>
                  <li>
                    We contrast one-off polish with delivery you can repeat—systems that stay fast, secure,
                    and searchable after launch.
                  </li>
                  <li>
                    Benchmarks align with{' '}
                    <a
                      href="https://developers.google.com/search/docs/essentials"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="work-evidence-ref-inline"
                    >
                      Search Essentials
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://web.dev/articles/vitals"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="work-evidence-ref-inline"
                    >
                      Core Web Vitals
                    </a>{' '}
                    guidance—not screenshot theatre alone.
                  </li>
                </ul>
              </div>
            </div>
            <nav className="work-evidence-nav" aria-label="Related pages">
              <Link to={ROUTES.services}>
                Map portfolio lanes back to our service menu
              </Link>
              <Link to={ROUTES.about}>
                Read how we document transparency and delivery ethos
              </Link>
              <Link to={ROUTES.packages}>
                Turn admired work into scoped pilots via packaged engagements
              </Link>
              <Link to={ROUTES.contact}>
                Start discovery — reference case IDs from this portfolio
              </Link>
              <Link to={ROUTES.themes}>
                Download WordPress &amp; Shopify themes for your next build
              </Link>
            </nav>
            <div className="work-evidence-foot">
              <span className="work-evidence-ref">
                Public references we ship against:{' '}
                <a
                  href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  Google&apos;s SEO Starter Guide
                </a>
                {' · '}
                <a href="https://web.dev/articles/vitals" target="_blank" rel="noopener noreferrer nofollow">
                  Core Web Vitals on web.dev
                </a>
              </span>
              <Link to={ROUTES.about} className="work-evidence-about-link">
                Our documentation philosophy on About →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="cta">
        <h2>Want Results Like These?</h2>
        <p>
          Share your URL and goals—we will reply with a realistic plan and quote, usually within one
          business day. Compare our <Link to={ROUTES.packages}>web development packages</Link>, read
          {BLOG_POSTS[0] ? (
            <>
              {' '}
              <Link to={blogPath(BLOG_POSTS[0].slug)}>{BLOG_POSTS[0].h1}</Link>, or
            </>
          ) : null}{' '}
          <Link to={ROUTES.contact}>request a free project quote</Link>.
        </p>
        <div className="cta-btns">
          <Link to={ROUTES.contact} className="btn-p">
            Request a free project quote →
          </Link>
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-g"
          >
            💬 WhatsApp us
          </a>
        </div>
      </div>
      </main>
    </>
  )
}
