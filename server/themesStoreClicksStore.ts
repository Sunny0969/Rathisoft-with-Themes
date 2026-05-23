import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { kv } from '@vercel/kv'

export const THEMES_STORE_KV_KEY = 'rathisoft-themes-store-clicks'

export type ThemesStoreClickEntry = {
  id: string
  name: string
  category: string
  demoClicks: number
  downloadClicks: number
  lastDemoAt?: string
  lastDownloadAt?: string
}

export type ThemesStoreClicksBlob = {
  v: 1
  items: Record<string, ThemesStoreClickEntry>
}

export type ThemesStoreAnalyticsSnapshot = {
  totals: {
    demoClicks: number
    downloadClicks: number
    itemsWithActivity: number
  }
  items: ThemesStoreClickEntry[]
}

const DEV_FILE = join(process.cwd(), '.data', 'themes-store-clicks.json')

const VALID_CATEGORIES = new Set([
  'shopify-theme',
  'wordpress-theme',
  'wordpress-plugin',
  'mobile-application',
])

function hasKv(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

function emptyBlob(): ThemesStoreClicksBlob {
  return { v: 1, items: {} }
}

function readDevFile(): ThemesStoreClicksBlob {
  if (!existsSync(DEV_FILE)) return emptyBlob()
  try {
    const parsed = JSON.parse(readFileSync(DEV_FILE, 'utf8')) as ThemesStoreClicksBlob
    if (!parsed?.items || typeof parsed.items !== 'object') return emptyBlob()
    return parsed
  } catch {
    return emptyBlob()
  }
}

function writeDevFile(blob: ThemesStoreClicksBlob): void {
  mkdirSync(join(process.cwd(), '.data'), { recursive: true })
  writeFileSync(DEV_FILE, JSON.stringify(blob, null, 2), 'utf8')
}

export async function loadThemesStoreClicksBlob(): Promise<ThemesStoreClicksBlob> {
  if (hasKv()) {
    const data = await kv.get<ThemesStoreClicksBlob>(THEMES_STORE_KV_KEY)
    if (!data?.items || typeof data.items !== 'object') return emptyBlob()
    return data
  }
  return readDevFile()
}

export async function saveThemesStoreClicksBlob(
  blob: ThemesStoreClicksBlob,
): Promise<void> {
  if (hasKv()) {
    await kv.set(THEMES_STORE_KV_KEY, blob)
    return
  }
  writeDevFile(blob)
}

export function isThemesStoreClicksStorageReady(): boolean {
  return hasKv() || process.env.NODE_ENV !== 'production'
}

export function validateClickPayload(body: unknown):
  | { ok: true; payload: Pick<ThemesStoreClickEntry, 'id' | 'name' | 'category'> & { event: 'demo' | 'download' } }
  | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid body' }
  }
  const { id, name, category, event } = body as Record<string, unknown>
  if (typeof id !== 'string' || !/^[a-z0-9-]{1,120}$/i.test(id)) {
    return { ok: false, error: 'Invalid id' }
  }
  if (typeof name !== 'string' || name.length < 1 || name.length > 200) {
    return { ok: false, error: 'Invalid name' }
  }
  if (typeof category !== 'string' || !VALID_CATEGORIES.has(category)) {
    return { ok: false, error: 'Invalid category' }
  }
  if (event !== 'demo' && event !== 'download') {
    return { ok: false, error: 'Invalid event' }
  }
  return {
    ok: true,
    payload: {
      id,
      name: name.trim(),
      category,
      event,
    },
  }
}

export function snapshotFromBlob(blob: ThemesStoreClicksBlob): ThemesStoreAnalyticsSnapshot {
  const items = Object.values(blob.items)
    .filter((e) => e.demoClicks > 0 || e.downloadClicks > 0)
    .sort((a, b) => {
      const totalA = a.demoClicks + a.downloadClicks
      const totalB = b.demoClicks + b.downloadClicks
      if (totalB !== totalA) return totalB - totalA
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    })

  let demoClicks = 0
  let downloadClicks = 0
  for (const e of items) {
    demoClicks += e.demoClicks
    downloadClicks += e.downloadClicks
  }

  return {
    totals: {
      demoClicks,
      downloadClicks,
      itemsWithActivity: items.length,
    },
    items,
  }
}

export async function recordThemesStoreClick(
  payload: Pick<ThemesStoreClickEntry, 'id' | 'name' | 'category'> & {
    event: 'demo' | 'download'
  },
): Promise<ThemesStoreAnalyticsSnapshot> {
  const blob = await loadThemesStoreClicksBlob()
  const now = new Date().toISOString()
  const prev = blob.items[payload.id]
  const next: ThemesStoreClickEntry = {
    id: payload.id,
    name: payload.name,
    category: payload.category,
    demoClicks: prev?.demoClicks ?? 0,
    downloadClicks: prev?.downloadClicks ?? 0,
    lastDemoAt: prev?.lastDemoAt,
    lastDownloadAt: prev?.lastDownloadAt,
  }

  if (payload.event === 'demo') {
    next.demoClicks += 1
    next.lastDemoAt = now
  } else {
    next.downloadClicks += 1
    next.lastDownloadAt = now
  }

  blob.items[payload.id] = next
  await saveThemesStoreClicksBlob(blob)
  return snapshotFromBlob(blob)
}

export async function getThemesStoreAnalyticsSnapshot(): Promise<ThemesStoreAnalyticsSnapshot> {
  const blob = await loadThemesStoreClicksBlob()
  return snapshotFromBlob(blob)
}
