/**
 * Canonical public URL paths (lowercase, hyphenated, trailing slash).
 * No city names in URLs — brand/keyword slugs only.
 * Keep generate-sitemap.mjs and vercel.json legacy redirects in sync.
 */

export const ROUTES = {
  home: '/',
  about: '/about-us/',
  portfolio: '/portfolio/',
  packages: '/packages/',
  themes: '/themes-store/',
  courses: '/e-learning-courses/',
  contact: '/contact-us/',
  team: '/our-team/',
  services: '/services/',
  blog: '/blog/',
  termsOfService: '/terms-of-service/',
} as const

export function blogPath(slug: string): string {
  const clean = slug.replace(/^\/+|\/+$/g, '').toLowerCase()
  return `/blog/${clean}/`
}

/** Keyword-rich service slugs under /services/{slug}/ */
export const SERVICE_SLUGS = [
  'web-development',
  'seo-services',
  'app-development',
  'wordpress-shopify',
  'video-editing',
  'social-media-marketing',
  'content-marketing',
  'ppc-advertising',
  'email-marketing',
  'branding-design',
] as const

export type ServiceSlug = (typeof SERVICE_SLUGS)[number]

export const SERVICE_SLUG_SET = new Set<string>(SERVICE_SLUGS)

/** Old service slug → canonical slug (301 targets). */
export const LEGACY_SERVICE_SLUGS: Record<string, ServiceSlug> = {
  'web-development-lahore': 'web-development',
  'seo-services-lahore': 'seo-services',
  'seo-optimization-lahore': 'seo-services',
  'app-development-lahore': 'app-development',
  'wordpress-shopify-lahore': 'wordpress-shopify',
  'video-editing-lahore': 'video-editing',
  'social-media-marketing-lahore': 'social-media-marketing',
  'content-marketing-lahore': 'content-marketing',
  'ppc-advertising-lahore': 'ppc-advertising',
  'email-marketing-lahore': 'email-marketing',
  'branding-design-lahore': 'branding-design',
  'web-development': 'web-development',
  'seo-optimization': 'seo-services',
  'app-development': 'app-development',
  'wordpress-shopify': 'wordpress-shopify',
  'video-editing': 'video-editing',
  'social-media-marketing': 'social-media-marketing',
  'content-marketing': 'content-marketing',
  'ppc-advertising': 'ppc-advertising',
  'email-marketing': 'email-marketing',
  'branding-design': 'branding-design',
}

/** Old top-level path (no trailing slash) → canonical path. */
export const LEGACY_TOP_LEVEL: Record<string, string> = {
  '/about': ROUTES.about,
  '/work': ROUTES.portfolio,
  '/portfolio-lahore': ROUTES.portfolio,
  '/packages': ROUTES.packages,
  '/packages-lahore': ROUTES.packages,
  '/themes': ROUTES.themes,
  '/themes-store-lahore': ROUTES.themes,
  '/courses': ROUTES.courses,
  '/contact': ROUTES.contact,
  '/contact-us-lahore': ROUTES.contact,
  '/team': ROUTES.team,
  '/our-team-lahore': ROUTES.team,
  '/services': ROUTES.services,
  '/blog': ROUTES.blog,
}

const TRACKING_PARAM_PREFIXES = [
  'utm_',
  'fbclid',
  'gclid',
  'gbraid',
  'wbraid',
  'msclkid',
  'mc_cid',
  'mc_eid',
  '_ga',
  'ref',
]

const STRIP_EXACT_PARAMS = new Set([
  'sessionid',
  'session_id',
  'sid',
  'phpsessid',
  'jsessionid',
])

export function servicePath(slug: string): string {
  const clean = slug.replace(/^\/+|\/+$/g, '').toLowerCase()
  const mapped = LEGACY_SERVICE_SLUGS[clean] ?? clean
  const canonical = SERVICE_SLUG_SET.has(mapped) ? mapped : clean
  return `/services/${canonical}/`
}

export function coursePath(courseId: string, suffix = ''): string {
  const base = `/e-learning-courses/${courseId.replace(/^\/+|\/+$/g, '')}`
  if (!suffix) return `${base}/`
  const seg = suffix.replace(/^\/+/, '')
  return `${base}/${seg}/`
}

/** Lowercase path with trailing slash (home stays `/`). */
export function normalizePathname(pathname: string): string {
  const lower = pathname.toLowerCase()
  if (!lower || lower === '/') return '/'
  const trimmed = lower.replace(/\/+$/, '')
  return `${trimmed}/`
}

export function stripTrackingSearch(search: string): string {
  if (!search || search === '?') return ''
  const params = new URLSearchParams(search)
  for (const key of [...params.keys()]) {
    const lower = key.toLowerCase()
    if (
      STRIP_EXACT_PARAMS.has(lower) ||
      TRACKING_PARAM_PREFIXES.some((p) => lower.startsWith(p))
    ) {
      params.delete(key)
    }
  }
  const q = params.toString()
  return q ? `?${q}` : ''
}

/**
 * Returns canonical pathname + search when the current URL should redirect.
 */
export function legacyRedirectTarget(
  pathname: string,
  search: string,
): { pathname: string; search: string } | null {
  const cleanSearch = stripTrackingSearch(search)
  const norm = pathname.toLowerCase().replace(/\/+$/, '') || '/'

  let nextPath: string | null = null

  if (LEGACY_TOP_LEVEL[norm]) {
    nextPath = LEGACY_TOP_LEVEL[norm]
  } else if (norm === '/courses' || norm.startsWith('/courses/')) {
    const rest = norm === '/courses' ? '' : norm.slice('/courses/'.length)
    nextPath = rest ? `/e-learning-courses/${rest}/` : ROUTES.courses
  } else {
    const svcMatch = norm.match(/^\/services\/([^/]+)$/)
    if (svcMatch) {
      const mapped = LEGACY_SERVICE_SLUGS[svcMatch[1]] ?? svcMatch[1]
      if (SERVICE_SLUG_SET.has(mapped)) nextPath = servicePath(mapped)
    } else {
      const rootSlug = norm.replace(/^\//, '')
      const mapped = LEGACY_SERVICE_SLUGS[rootSlug]
      if (mapped && SERVICE_SLUG_SET.has(mapped)) {
        nextPath = servicePath(mapped)
      } else if (SERVICE_SLUG_SET.has(rootSlug)) {
        nextPath = servicePath(rootSlug)
      }
    }
  }

  const canonical = nextPath ?? normalizePathname(pathname)
  if (canonical !== pathname || cleanSearch !== search) {
    return { pathname: canonical, search: cleanSearch }
  }
  return null
}
