/**
 * Resolve demo URLs for in-page iframe preview (RathiSoft modal) with fallbacks.
 * tabUrl = user-facing link; embedCandidates = try in order until one loads.
 */

/** Marketplaces and docs sites that almost never allow cross-origin iframes. */
const IFRAME_UNLIKELY_HOSTS = [
  'themeforest.net',
  'dribbble.com',
  'creativemarket.com',
  'elements.envato.com',
  'videohive.net',
  'wordpress.org',
  'nicepage.com',
  'example.com',
  'themes.shopify.com',
] as const

function isUnlikelyIframeHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^www\./, '')
  return IFRAME_UNLIKELY_HOSTS.some(
    (d) => h === d || h.endsWith(`.${d}`),
  )
}

/** Shopify vendor *-demo stores block cross-site iframes (“refused to connect”). */
export function isShopifyDemoSubdomain(hostname: string): boolean {
  return hostname.toLowerCase().endsWith('-demo.myshopify.com')
}

export function isEmbeddableIframeUrl(url: string): boolean {
  try {
    const h = new URL(url.trim()).hostname.toLowerCase()
    if (isShopifyDemoSubdomain(h)) return false
    if (isUnlikelyIframeHost(h)) return false
    return true
  } catch {
    return false
  }
}

export type DemoEmbedPlan = {
  /** Original URL from catalog — used for “open in new tab”. */
  tabUrl: string
  /** Iframe src candidates (Shopify theme store, *-theme.myshopify.com, YouTube embed, then raw). */
  embedCandidates: string[]
}

function pushUnique(list: string[], url: string): void {
  const normalized = url.trim()
  if (!normalized || list.includes(normalized)) return
  list.push(normalized)
}

/** `themes.shopify.com/themes/{handle}/…` → `https://{handle}-theme.myshopify.com/` */
export function shopifyThemeStoreToMyshopify(raw: string): string | null {
  try {
    const u = new URL(raw.trim())
    if (u.hostname.toLowerCase() !== 'themes.shopify.com') return null
    const m = u.pathname.match(/^\/themes\/([^/]+)/i)
    if (!m?.[1]) return null
    return `https://${m[1].toLowerCase()}-theme.myshopify.com/`
  } catch {
    return null
  }
}

/** `*-demo.myshopify.com` → `*-theme.myshopify.com` (often embed-friendly). */
export function shopifyDemoSubdomainToTheme(raw: string): string | null {
  try {
    const u = new URL(raw.trim())
    const h = u.hostname.toLowerCase()
    const m = h.match(/^(.+)-demo\.myshopify\.com$/)
    if (!m?.[1]) return null
    return `https://${m[1]}-theme.myshopify.com${u.pathname || '/'}${u.search}`
  } catch {
    return null
  }
}

function youtubeEmbedUrl(raw: string): string | null {
  try {
    const u = new URL(raw.trim())
    const host = u.hostname.toLowerCase().replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`
      const shorts = u.pathname.match(/^\/shorts\/([^/]+)/)
      if (shorts?.[1]) return `https://www.youtube-nocookie.com/embed/${shorts[1]}`
    }
    return null
  } catch {
    return null
  }
}

/** Build ordered iframe candidates; always ends with the raw HTTPS URL when valid. */
export function resolveDemoEmbedPlan(raw: string | undefined): DemoEmbedPlan | null {
  const tabUrl = raw?.trim() ?? ''
  if (!tabUrl) return null

  const embedCandidates: string[] = []

  const fromStore = shopifyThemeStoreToMyshopify(tabUrl)
  if (fromStore) pushUnique(embedCandidates, fromStore)

  const fromDemo = shopifyDemoSubdomainToTheme(tabUrl)
  if (fromDemo) pushUnique(embedCandidates, fromDemo)

  const yt = youtubeEmbedUrl(tabUrl)
  if (yt) pushUnique(embedCandidates, yt)

  try {
    const u = new URL(tabUrl)
    if (
      (u.protocol === 'http:' || u.protocol === 'https:') &&
      isEmbeddableIframeUrl(u.toString())
    ) {
      pushUnique(embedCandidates, u.toString())
    }
  } catch {
    if (isEmbeddableIframeUrl(tabUrl)) pushUnique(embedCandidates, tabUrl)
  }

  const filtered = embedCandidates.filter(isEmbeddableIframeUrl)

  return { tabUrl, embedCandidates: filtered }
}
