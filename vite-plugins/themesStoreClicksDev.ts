import type { Plugin } from 'vite'
import {
  getThemesStoreAnalyticsSnapshot,
  recordThemesStoreClick,
  validateClickPayload,
} from '../server/themesStoreClicksStore'

function readBody(req: import('node:http').IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(Buffer.from(c)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

export function themesStoreClicksDevPlugin(): Plugin {
  return {
    name: 'themes-store-clicks-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split('?')[0]
        if (path !== '/api/themes-store-clicks') {
          next()
          return
        }

        const sendJson = (data: unknown, status = 200) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.setHeader('Cache-Control', 'no-store')
          res.end(JSON.stringify(data))
        }

        try {
          if (req.method === 'GET') {
            const snapshot = await getThemesStoreAnalyticsSnapshot()
            sendJson({ ok: true, ...snapshot, storage: 'local-file' })
            return
          }

          if (req.method === 'POST') {
            const raw = await readBody(req)
            let body: unknown
            try {
              body = JSON.parse(raw)
            } catch {
              sendJson({ error: 'Invalid JSON' }, 400)
              return
            }

            const validated = validateClickPayload(body)
            if (!validated.ok) {
              sendJson({ error: validated.error }, 400)
              return
            }

            const snapshot = await recordThemesStoreClick(validated.payload)
            sendJson({ ok: true, ...snapshot, storage: 'local-file' })
            return
          }

          sendJson({ error: 'Method not allowed' }, 405)
        } catch (err) {
          console.error('[themes-store-clicks dev]', err)
          sendJson({ error: 'Server error' }, 500)
        }
      })
    },
  }
}
