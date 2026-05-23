import { ROUTES } from '../utils/routes'

/** Portfolio filter button ids — keep in sync with Work.tsx FILTER_BTNS */
export const PORTFOLIO_FILTER_IDS = [
  'all',
  'custom',
  'wordpress',
  'shopify',
  'uiux',
  'graphics',
  'video-editing',
  'seo',
] as const

export type PortfolioFilterId = (typeof PORTFOLIO_FILTER_IDS)[number]

export type ServicePortfolioTarget = {
  filter: PortfolioFilterId
  /** Section heading id on the portfolio page (hash target) */
  sectionId: string
}

const BY_SLUG: Record<string, ServicePortfolioTarget> = {
  'web-development': { filter: 'custom', sectionId: 'section-custom' },
  'seo-services': { filter: 'seo', sectionId: 'section-SEO' },
  'app-development': { filter: 'custom', sectionId: 'section-custom' },
  'wordpress-shopify': { filter: 'wordpress', sectionId: 'section-wordpress' },
  'video-editing': { filter: 'video-editing', sectionId: 'section-video-editing' },
  'social-media-marketing': { filter: 'graphics', sectionId: 'section-graphics' },
  'content-marketing': { filter: 'seo', sectionId: 'section-SEO' },
  'ppc-advertising': { filter: 'seo', sectionId: 'section-SEO' },
  'email-marketing': { filter: 'seo', sectionId: 'section-SEO' },
  'branding-design': { filter: 'uiux', sectionId: 'section-uiux' },
}

const BY_TITLE: Record<string, ServicePortfolioTarget> = {
  'Generative AI': { filter: 'custom', sectionId: 'section-custom' },
  'Dynamics 365 ERP': { filter: 'custom', sectionId: 'section-custom' },
  Cybersecurity: { filter: 'custom', sectionId: 'section-custom' },
  'Game Development': { filter: 'custom', sectionId: 'section-custom' },
  'SaaS Products': { filter: 'custom', sectionId: 'section-custom' },
  'Maintenance & Support': { filter: 'wordpress', sectionId: 'section-wordpress' },
  'Automation & Apps': { filter: 'custom', sectionId: 'section-custom' },
}

/** Stable “random” targets for services without a direct portfolio lane */
const FALLBACK_TARGETS: ServicePortfolioTarget[] = [
  { filter: 'custom', sectionId: 'section-custom' },
  { filter: 'wordpress', sectionId: 'section-wordpress' },
  { filter: 'shopify', sectionId: 'section-shopify' },
  { filter: 'uiux', sectionId: 'section-uiux' },
  { filter: 'graphics', sectionId: 'section-graphics' },
  { filter: 'video-editing', sectionId: 'section-video-editing' },
  { filter: 'seo', sectionId: 'section-SEO' },
]

function stableIndex(key: string, mod: number): number {
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0
  return Math.abs(h) % mod
}

export function resolveServicePortfolioTarget(service: {
  slug?: string
  title: string
}): ServicePortfolioTarget {
  if (service.slug && BY_SLUG[service.slug]) return BY_SLUG[service.slug]
  if (BY_TITLE[service.title]) return BY_TITLE[service.title]
  const key = service.slug ?? service.title
  return FALLBACK_TARGETS[stableIndex(key, FALLBACK_TARGETS.length)]
}

export function portfolioPathForService(service: {
  slug?: string
  title: string
}): string {
  const { filter, sectionId } = resolveServicePortfolioTarget(service)
  const base = ROUTES.portfolio.replace(/\/$/, '')
  if (filter === 'all') return `${base}/#${sectionId}`
  return `${base}/?filter=${encodeURIComponent(filter)}#${sectionId}`
}

export function isPortfolioFilterId(value: string): value is PortfolioFilterId {
  return (PORTFOLIO_FILTER_IDS as readonly string[]).includes(value)
}
