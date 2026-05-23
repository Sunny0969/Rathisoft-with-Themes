import {
  getThemesStoreAnalyticsSnapshot,
  isThemesStoreClicksStorageReady,
  recordThemesStoreClick,
  validateClickPayload,
} from '../server/themesStoreClicksStore'

export const config = {
  runtime: 'nodejs',
}

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS })
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (!isThemesStoreClicksStorageReady()) {
    return json(
      {
        error:
          'Themes store analytics storage is not configured. Add Vercel KV (KV_REST_API_URL / KV_REST_API_TOKEN) in production.',
      },
      503,
    )
  }

  try {
    if (req.method === 'GET') {
      const snapshot = await getThemesStoreAnalyticsSnapshot()
      return json({ ok: true, ...snapshot, storage: 'live' })
    }

    if (req.method === 'POST') {
      let body: unknown
      try {
        body = await req.json()
      } catch {
        return json({ error: 'Invalid JSON' }, 400)
      }

      const validated = validateClickPayload(body)
      if (!validated.ok) {
        return json({ error: validated.error }, 400)
      }

      const snapshot = await recordThemesStoreClick(validated.payload)
      return json({ ok: true, ...snapshot, storage: 'live' })
    }

    return json({ error: 'Method not allowed' }, 405)
  } catch (err) {
    console.error('[themes-store-clicks]', err)
    return json({ error: 'Server error' }, 500)
  }
}
