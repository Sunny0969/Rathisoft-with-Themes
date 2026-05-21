import { SITE_ORIGIN } from '../constants/site'
import { normalizePathname } from '../utils/routes'

export type HreflangAlternate = {
  hrefLang: string
  href: string
}

/**
 * Per-path hreflang alternates. Empty until localized routes exist.
 * When adding a locale, register every URL variant here and pass via <Seo alternates={...} />.
 *
 * Example (future):
 *   '/': [
 *     { hrefLang: 'en', href: 'https://www.rathisoft.com/' },
 *     { hrefLang: 'ur-PK', href: 'https://www.rathisoft.com/ur/' },
 *     { hrefLang: 'x-default', href: 'https://www.rathisoft.com/' },
 *   ],
 */
export const HREFLANG_BY_PATH: Record<string, HreflangAlternate[]> = {}

export function getHreflangAlternates(pathname: string): HreflangAlternate[] {
  const path = normalizePathname(pathname)
  return HREFLANG_BY_PATH[path] ?? []
}

export function absoluteHreflangUrl(path: string): string {
  const normalized = normalizePathname(path)
  return `${SITE_ORIGIN}${normalized === '/' ? '/' : normalized}`
}
