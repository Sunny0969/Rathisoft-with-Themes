import type { StoreCategory, StoreItem } from '../pages/themesStoreData'

export const THEMES_STORE_ANALYTICS_EVENT = 'themes-store-analytics'

const API_PATH = '/api/themes-store-clicks'

export type ThemesStoreClickEntry = {
  id: string
  name: string
  category: StoreCategory
  demoClicks: number
  downloadClicks: number
  lastDemoAt?: string
  lastDownloadAt?: string
}

export type ThemesStoreAnalyticsSnapshot = {
  totals: {
    demoClicks: number
    downloadClicks: number
    itemsWithActivity: number
  }
  items: ThemesStoreClickEntry[]
  storage?: string
}

let cachedSnapshot: ThemesStoreAnalyticsSnapshot | null = null
let inflightRefresh: Promise<ThemesStoreAnalyticsSnapshot> | null = null

function notifyAnalyticsUpdated(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(THEMES_STORE_ANALYTICS_EVENT))
}

function emptySnapshot(): ThemesStoreAnalyticsSnapshot {
  return {
    totals: { demoClicks: 0, downloadClicks: 0, itemsWithActivity: 0 },
    items: [],
  }
}

export function getCachedThemesStoreSnapshot(): ThemesStoreAnalyticsSnapshot {
  return cachedSnapshot ?? emptySnapshot()
}

export async function refreshThemesStoreAnalytics(): Promise<ThemesStoreAnalyticsSnapshot> {
  if (inflightRefresh) return inflightRefresh

  inflightRefresh = (async () => {
    try {
      const res = await fetch(API_PATH, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
      if (!res.ok) {
        return cachedSnapshot ?? emptySnapshot()
      }
      const data = (await res.json()) as ThemesStoreAnalyticsSnapshot & { ok?: boolean }
      cachedSnapshot = {
        totals: data.totals,
        items: data.items as ThemesStoreClickEntry[],
        storage: data.storage,
      }
      return cachedSnapshot
    } catch {
      return cachedSnapshot ?? emptySnapshot()
    } finally {
      inflightRefresh = null
    }
  })()

  return inflightRefresh
}

async function postClick(
  item: Pick<StoreItem, 'id' | 'name' | 'category'>,
  event: 'demo' | 'download',
): Promise<void> {
  try {
    const res = await fetch(API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        id: item.id,
        name: item.name,
        category: item.category,
        event,
      }),
    })
    if (!res.ok) return
    const data = (await res.json()) as ThemesStoreAnalyticsSnapshot & { ok?: boolean }
    cachedSnapshot = {
      totals: data.totals,
      items: data.items as ThemesStoreClickEntry[],
      storage: data.storage,
    }
  } catch {
    /* network error — dashboard will refresh on next poll */
  }
}

export function trackThemesStoreDemo(
  item: Pick<StoreItem, 'id' | 'name' | 'category'>,
): void {
  void postClick(item, 'demo').then(() => {
    notifyAnalyticsUpdated()
  })
}

export function trackThemesStoreDownload(
  item: Pick<StoreItem, 'id' | 'name' | 'category'>,
): void {
  void postClick(item, 'download').then(() => {
    notifyAnalyticsUpdated()
  })
}

export function getThemesStoreClickTotals(): ThemesStoreAnalyticsSnapshot['totals'] {
  return getCachedThemesStoreSnapshot().totals
}

export function getThemesStoreClickRows(): ThemesStoreClickEntry[] {
  return getCachedThemesStoreSnapshot().items
}

export const CATEGORY_ANALYTICS_LABEL: Record<StoreCategory, string> = {
  'shopify-theme': 'Shopify theme',
  'wordpress-theme': 'WP theme',
  'wordpress-plugin': 'WP plugin',
  'mobile-application': 'Mobile app',
}
