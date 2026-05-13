import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Production site URL — used for canonical and Open Graph. */
export const SITE_ORIGIN = 'https://rathisoft.com'

/**
 * Canonical URL policy (aligned with sitemap & redirects):
 * - Homepage: https://rathisoft.com/ (trailing slash)
 * - All other paths: https://rathisoft.com/path (no trailing slash)
 */

/** Default Open Graph / Twitter preview (1200×630). Served from `/public/og-image.jpg`. */
export const OG_IMAGE_URL = `${SITE_ORIGIN}/og-image.jpg`
export const OG_IMAGE_WIDTH = '1200'
export const OG_IMAGE_HEIGHT = '630'

export type SeoProps = {
  title: string
  description: string
  /** Comma-separated; omitted/cleared on other routes when not passed */
  keywords?: string | undefined
}

function normalizePath(pathname: string): string {
  const lower = pathname.toLowerCase()
  if (!lower || lower === '/') return '/'
  const trimmed = lower.startsWith('/') ? lower.replace(/\/+$/, '') || '/' : `/${lower.replace(/\/+$/, '')}`
  return trimmed
}

export function canonicalUrl(pathname: string): string {
  const path = normalizePath(pathname)
  if (path === '/') return `${SITE_ORIGIN}/`
  return `${SITE_ORIGIN}${path}`
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

export function applySocialMeta(title: string, description: string, pageUrl: string): void {
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:site_name', 'RathiSoft')
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', pageUrl)
  upsertMeta('property', 'og:image', OG_IMAGE_URL)
  upsertMeta('property', 'og:image:width', OG_IMAGE_WIDTH)
  upsertMeta('property', 'og:image:height', OG_IMAGE_HEIGHT)
  upsertMeta('property', 'og:locale', 'en_US')

  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:site', '@rathisoft')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', OG_IMAGE_URL)
}

/** Remove canonical link (e.g. 404 pages should not send a misleading canonical). */
export function removeCanonicalLink(): void {
  document.querySelector('link[rel="canonical"]')?.remove()
}

/** Drops robots meta when leaving noindex routes (default pages omit robots = indexable). */
export function removeRobotsMeta(): void {
  document.querySelector('meta[name="robots"]')?.remove()
}

export function Seo({ title, description, keywords }: SeoProps): null {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = title

    upsertMeta('name', 'description', description)

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

    applySocialMeta(title, description, url)
  }, [title, description, keywords, pathname])

  return null
}
