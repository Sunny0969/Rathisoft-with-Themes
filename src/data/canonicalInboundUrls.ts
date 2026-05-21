/**
 * Canonical URLs that return HTTP 200 (no redirect chain) when hosted on www + trailingSlash.
 * Share these with partners, directories, and press — not legacy paths that 301.
 */
import { SITE_ORIGIN } from '../constants/site'
import { ROUTES, SERVICE_SLUGS } from '../utils/routes'

export type CanonicalInboundEntry = {
  label: string
  path: string
}

export const CANONICAL_INBOUND_PAGES: CanonicalInboundEntry[] = [
  { label: 'Home', path: ROUTES.home },
  { label: 'About', path: ROUTES.about },
  { label: 'Portfolio', path: ROUTES.portfolio },
  { label: 'Packages', path: ROUTES.packages },
  { label: 'Themes store', path: ROUTES.themes },
  { label: 'E-learning courses', path: ROUTES.courses },
  { label: 'Contact', path: ROUTES.contact },
  { label: 'Team', path: ROUTES.team },
  { label: 'Services hub', path: ROUTES.services },
  ...SERVICE_SLUGS.map((slug) => ({
    label: `Service — ${slug.replace(/-/g, ' ')}`,
    path: `/services/${slug}/`,
  })),
]

export function canonicalInboundUrl(path: string): string {
  if (path === '/') return `${SITE_ORIGIN}/`
  const p = path.startsWith('/') ? path : `/${path}`
  return `${SITE_ORIGIN}${p}`
}

/** Paths that 301 to canonical — do not use for new directory listings */
export const LEGACY_REDIRECT_EXAMPLES = [
  '/about → /about-us/',
  '/work → /portfolio/',
  '/contact → /contact-us/',
  '/courses/* → /e-learning-courses/*',
  'non-www rathisoft.com → https://www.rathisoft.com/',
]
