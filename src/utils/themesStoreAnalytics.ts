import type { StoreCategory, StoreItem } from '../pages/themesStoreData'

export const THEMES_STORE_ANALYTICS_KEY = 'rathisoft-themes-store-clicks'
export const THEMES_STORE_ANALYTICS_EVENT = 'themes-store-analytics'

export type ThemesStoreClickEntry = {
  id: string
  name: string
  category: StoreCategory
  demoClicks: number
  downloadClicks: number
  lastDemoAt?: string
  lastDownloadAt?: string
}

type AnalyticsBlob = {
  v: 1
  items: Record<string, ThemesStoreClickEntry>
}

function readBlob(): AnalyticsBlob {
  if (typeof window === 'undefined') return { v: 1, items: {} }
  try {
    const raw = localStorage.getItem(THEMES_STORE_ANALYTICS_KEY)
    if (!raw) return { v: 1, items: {} }
    const parsed = JSON.parse(raw) as AnalyticsBlob
    if (!parsed?.items || typeof parsed.items !== 'object') return { v: 1, items: {} }
    return parsed
  } catch {
    return { v: 1, items: {} }
  }
}

function writeBlob(blob: AnalyticsBlob): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(THEMES_STORE_ANALYTICS_KEY, JSON.stringify(blob))
  window.dispatchEvent(new Event(THEMES_STORE_ANALYTICS_EVENT))
}

function upsertEntry(
  item: Pick<StoreItem, 'id' | 'name' | 'category'>,
  field: 'demoClicks' | 'downloadClicks',
  tsField: 'lastDemoAt' | 'lastDownloadAt',
): void {
  const blob = readBlob()
  const now = new Date().toISOString()
  const prev = blob.items[item.id]
  const next: ThemesStoreClickEntry = {
    id: item.id,
    name: item.name,
    category: item.category,
    demoClicks: prev?.demoClicks ?? 0,
    downloadClicks: prev?.downloadClicks ?? 0,
    lastDemoAt: prev?.lastDemoAt,
    lastDownloadAt: prev?.lastDownloadAt,
  }
  next[field] += 1
  next[tsField] = now
  blob.items[item.id] = next
  writeBlob(blob)
}

export function trackThemesStoreDemo(
  item: Pick<StoreItem, 'id' | 'name' | 'category'>,
): void {
  upsertEntry(item, 'demoClicks', 'lastDemoAt')
}

export function trackThemesStoreDownload(
  item: Pick<StoreItem, 'id' | 'name' | 'category'>,
): void {
  upsertEntry(item, 'downloadClicks', 'lastDownloadAt')
}

export function getThemesStoreClickTotals(): {
  demoClicks: number
  downloadClicks: number
  itemsWithActivity: number
} {
  const entries = Object.values(readBlob().items)
  let demoClicks = 0
  let downloadClicks = 0
  for (const e of entries) {
    demoClicks += e.demoClicks
    downloadClicks += e.downloadClicks
  }
  return {
    demoClicks,
    downloadClicks,
    itemsWithActivity: entries.filter(
      (e) => e.demoClicks > 0 || e.downloadClicks > 0,
    ).length,
  }
}

export function getThemesStoreClickRows(): ThemesStoreClickEntry[] {
  return Object.values(readBlob().items)
    .filter((e) => e.demoClicks > 0 || e.downloadClicks > 0)
    .sort((a, b) => {
      const totalA = a.demoClicks + a.downloadClicks
      const totalB = b.demoClicks + b.downloadClicks
      if (totalB !== totalA) return totalB - totalA
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    })
}

export function clearThemesStoreAnalytics(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(THEMES_STORE_ANALYTICS_KEY)
  window.dispatchEvent(new Event(THEMES_STORE_ANALYTICS_EVENT))
}

export function exportThemesStoreAnalyticsJson(): string {
  const blob = readBlob()
  const totals = getThemesStoreClickTotals()
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      totals,
      items: getThemesStoreClickRows(),
      raw: blob.items,
    },
    null,
    2,
  )
}

export const CATEGORY_ANALYTICS_LABEL: Record<StoreCategory, string> = {
  'shopify-theme': 'Shopify theme',
  'wordpress-theme': 'WP theme',
  'wordpress-plugin': 'WP plugin',
  'mobile-application': 'Mobile app',
}
