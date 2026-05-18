import type { Plugin } from 'vite';

const RESOLVER = 'https://tera-core.vercel.app/api2';
const ALLOWED_MEDIA_HOSTS = ['terabox.app', '4funbox.com'];

function isAllowedMediaUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return ALLOWED_MEDIA_HOSTS.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`),
    );
  } catch {
    return false;
  }
}

export function teraboxMediaDevPlugin(): Plugin {
  return {
    name: 'terabox-media-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split('?')[0];
        if (path !== '/api/terabox-media') {
          next();
          return;
        }

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
          res.end();
          return;
        }

        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }

        const share = new URL(req.url!, 'http://localhost').searchParams.get(
          'share',
        );
        if (!share) {
          res.statusCode = 400;
          res.end('Missing share parameter');
          return;
        }

        try {
          const metaRes = await fetch(
            `${RESOLVER}?url=${encodeURIComponent(share)}`,
          );
          if (!metaRes.ok) {
            res.statusCode = 502;
            res.end('Could not resolve TeraBox link');
            return;
          }

          const meta = (await metaRes.json()) as {
            files?: Array<{ direct_link?: string; download_link?: string }>;
          };
          const file = meta.files?.[0];
          const mediaUrl = file?.direct_link || file?.download_link;

          if (!mediaUrl || !isAllowedMediaUrl(mediaUrl)) {
            res.statusCode = 404;
            res.end('No playable file found');
            return;
          }

          const upstreamHeaders: Record<string, string> = {
            Referer: 'https://www.terabox.app/',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            Origin: 'https://www.terabox.app',
          };

          const ndus = process.env.TERABOX_NDUS?.trim();
          if (ndus) upstreamHeaders.Cookie = `ndus=${ndus}`;

          if (req.headers.range) {
            upstreamHeaders.Range = String(req.headers.range);
          }

          const upstream = await fetch(mediaUrl, {
            method: req.method,
            headers: upstreamHeaders,
          });

          res.statusCode = upstream.status;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader(
            'Access-Control-Expose-Headers',
            'Content-Length, Content-Range, Accept-Ranges',
          );

          const pass = [
            'content-type',
            'content-length',
            'content-range',
            'accept-ranges',
          ] as const;
          for (const name of pass) {
            const value = upstream.headers.get(name);
            if (value) res.setHeader(name, value);
          }

          if (req.method === 'HEAD') {
            res.end();
            return;
          }

          if (!upstream.body) {
            res.end();
            return;
          }

          const reader = upstream.body.getReader();
          const pump = async (): Promise<void> => {
            const { done, value } = await reader.read();
            if (done) {
              res.end();
              return;
            }
            res.write(Buffer.from(value));
            await pump();
          };
          await pump();
        } catch {
          res.statusCode = 502;
          res.end('Proxy error');
        }
      });
    },
  };
}
