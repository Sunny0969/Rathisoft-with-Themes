import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_ORIGIN } from '../constants/site'
import { getHreflangAlternates } from '../data/hreflang'
import { normalizePathname } from '../utils/routes'

export { SITE_ORIGIN }

/** Canonical URLs use lowercase paths with a trailing slash on every route. */

/** Default Open Graph / Twitter preview (1200×630). Generated as `/public/og-image.webp` at build. */
export const OG_IMAGE_URL = `${SITE_ORIGIN}/og-image.webp`
export const OG_IMAGE_WIDTH = '1200'
export const OG_IMAGE_HEIGHT = '630'
export const OG_IMAGE_ALT =
  'RathiSoft — web, Shopify, WordPress, and app development agency in Lahore, Pakistan'
export const OG_LOCALE = 'en_US'
export const OG_TYPE_WEBSITE = 'website'
export const TWITTER_SITE = '@rathisoft'
export const TWITTER_CARD = 'summary_large_image'

export type SeoProps = {
  title: string
  description: string
  /** Comma-separated; omitted/cleared on other routes when not passed */
  keywords?: string | undefined
  /** Absolute URL; defaults to OG_IMAGE_URL (1200×630) */
  image?: string
  ogType?: typeof OG_TYPE_WEBSITE | 'article'
  locale?: string
  imageAlt?: string
  /** When set, overrides path-based hreflang from src/data/hreflang.ts */
  alternates?: import('../data/hreflang').HreflangAlternate[]
}

export type SocialMetaInput = {
  title: string
  description: string
  pageUrl: string
  image?: string
  ogType?: string
  locale?: string
  imageAlt?: string
}

export function canonicalUrl(pathname: string): string {
  const path = normalizePathname(pathname)
  return `${SITE_ORIGIN}${path === '/' ? '/' : path}`
}

export function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  const selector = attr === 'name' ? `meta[name="${key}"]` : `meta[property="${key}"]`
  let el = document.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Injects full Open Graph + Twitter Card tags (per-page title, description, URL).
 * Called from <Seo /> on every route and from 404 for consistent social previews.
 */
export function applySocialMeta(input: SocialMetaInput): void {
  const {
    title,
    description,
    pageUrl,
    image = OG_IMAGE_URL,
    ogType = OG_TYPE_WEBSITE,
    locale = OG_LOCALE,
    imageAlt = OG_IMAGE_ALT,
  } = input

  upsertMeta('property', 'og:type', ogType)
  upsertMeta('property', 'og:site_name', 'RathiSoft')
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', pageUrl)
  upsertMeta('property', 'og:locale', locale)
  upsertMeta('property', 'og:image', image)
  upsertMeta('property', 'og:image:secure_url', image)
  upsertMeta('property', 'og:image:width', OG_IMAGE_WIDTH)
  upsertMeta('property', 'og:image:height', OG_IMAGE_HEIGHT)
  upsertMeta('property', 'og:image:alt', imageAlt)
  upsertMeta('property', 'og:image:type', 'image/jpeg')

  upsertMeta('name', 'twitter:card', TWITTER_CARD)
  upsertMeta('name', 'twitter:site', TWITTER_SITE)
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', image)
  upsertMeta('name', 'twitter:image:alt', imageAlt)
}

/** Remove OG/Twitter meta (e.g. when tearing down a custom head state). */
export function removeSocialMeta(): void {
  const keys: { attr: 'name' | 'property'; key: string }[] = [
    { attr: 'property', key: 'og:type' },
    { attr: 'property', key: 'og:site_name' },
    { attr: 'property', key: 'og:title' },
    { attr: 'property', key: 'og:description' },
    { attr: 'property', key: 'og:url' },
    { attr: 'property', key: 'og:locale' },
    { attr: 'property', key: 'og:image' },
    { attr: 'property', key: 'og:image:secure_url' },
    { attr: 'property', key: 'og:image:width' },
    { attr: 'property', key: 'og:image:height' },
    { attr: 'property', key: 'og:image:alt' },
    { attr: 'property', key: 'og:image:type' },
    { attr: 'name', key: 'twitter:card' },
    { attr: 'name', key: 'twitter:site' },
    { attr: 'name', key: 'twitter:title' },
    { attr: 'name', key: 'twitter:description' },
    { attr: 'name', key: 'twitter:image' },
    { attr: 'name', key: 'twitter:image:alt' },
  ]
  keys.forEach(({ attr, key }) => {
    document.querySelector(`meta[${attr}="${key}"]`)?.remove()
  })
}

/** Remove canonical link (e.g. 404 pages should not send a misleading canonical). */
export function removeCanonicalLink(): void {
  document.querySelector('link[rel="canonical"]')?.remove()
}

export const SEO_AUTHOR = 'RathiSoft'
export const SEO_ROBOTS_INDEX = 'index, follow'
export const SEO_GEO_REGION = 'PK-PB'
export const SEO_GEO_PLACENAME = 'Lahore'
export const SEO_GEO_POSITION = '31.5497;74.3436'

/** Global meta applied on every indexable page via <Seo />. */
export function applyGlobalSeoMeta(): void {
  upsertMeta('name', 'robots', SEO_ROBOTS_INDEX)
  upsertMeta('name', 'author', SEO_AUTHOR)
  upsertMeta('name', 'geo.region', SEO_GEO_REGION)
  upsertMeta('name', 'geo.placename', SEO_GEO_PLACENAME)
  upsertMeta('name', 'geo.position', SEO_GEO_POSITION)
  upsertMeta('name', 'ICBM', SEO_GEO_POSITION)
}

/** Drops robots meta when leaving noindex routes (404 sets noindex separately). */
export function removeRobotsMeta(): void {
  document.querySelector('meta[name="robots"]')?.remove()
}

const HREFLANG_LINK_ID_PREFIX = 'rathisoft-hreflang-'

function removeHreflangLinks(): void {
  document
    .querySelectorAll(`link[id^="${HREFLANG_LINK_ID_PREFIX}"]`)
    .forEach((el) => el.remove())
}

function applyHreflangLinks(
  alternates: import('../data/hreflang').HreflangAlternate[],
): void {
  removeHreflangLinks()
  alternates.forEach((alt, index) => {
    const link = document.createElement('link')
    link.id = `${HREFLANG_LINK_ID_PREFIX}${index}`
    link.rel = 'alternate'
    link.hreflang = alt.hrefLang
    link.href = alt.href
    document.head.appendChild(link)
  })
}

export function Seo({
  title,
  description,
  keywords,
  image,
  ogType = OG_TYPE_WEBSITE,
  locale = OG_LOCALE,
  imageAlt = OG_IMAGE_ALT,
  alternates,
}: SeoProps): null {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = title

    upsertMeta('name', 'description', description)
    applyGlobalSeoMeta()

    const kwEl = document.querySelector('meta[name="keywords"]')
    if (keywords && keywords.trim()) {
      upsertMeta('name', 'keywords', keywords.trim())
    } else if (kwEl?.parentNode) {
      kwEl.parentNode.removeChild(kwEl)
    }

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    const url = canonicalUrl(pathname)
    link.setAttribute('href', url)

    applySocialMeta({
      title,
      description,
      pageUrl: url,
      image: image ?? OG_IMAGE_URL,
      ogType,
      locale,
      imageAlt,
    })

    const hreflangList = alternates ?? getHreflangAlternates(pathname)
    if (hreflangList.length > 0) {
      applyHreflangLinks(hreflangList)
    } else {
      removeHreflangLinks()
    }
  }, [
    title,
    description,
    keywords,
    pathname,
    image,
    ogType,
    locale,
    imageAlt,
    alternates,
  ])

  return null
}
