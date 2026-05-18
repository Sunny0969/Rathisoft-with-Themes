export const config = {
  runtime: 'edge',
};

const RESOLVER = 'https://tera-core.vercel.app/api2';

const ALLOWED_MEDIA_HOSTS = ['terabox.app', '4funbox.com'] as const;

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

function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Range, Content-Type',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
    'Access-Control-Max-Age': '86400',
  };
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405 });
  }

  const share = new URL(req.url).searchParams.get('share');
  if (!share) {
    return new Response('Missing share parameter', { status: 400 });
  }

  let meta: {
    files?: Array<{ direct_link?: string; download_link?: string }>;
  };

  try {
    const metaRes = await fetch(
      `${RESOLVER}?url=${encodeURIComponent(share)}`,
      { headers: { Accept: 'application/json' } },
    );
    if (!metaRes.ok) {
      return new Response('Could not resolve TeraBox link', { status: 502 });
    }
    meta = (await metaRes.json()) as typeof meta;
  } catch {
    return new Response('Resolver unavailable', { status: 502 });
  }

  const file = meta.files?.[0];
  const mediaUrl = file?.direct_link || file?.download_link;

  if (!mediaUrl || !isAllowedMediaUrl(mediaUrl)) {
    return new Response('No playable file found', { status: 404 });
  }

  const upstreamHeaders = new Headers();
  upstreamHeaders.set('Referer', 'https://www.terabox.app/');
  upstreamHeaders.set(
    'User-Agent',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  );
  upstreamHeaders.set('Origin', 'https://www.terabox.app');

  const ndus = process.env.TERABOX_NDUS?.trim();
  if (ndus) {
    upstreamHeaders.set('Cookie', `ndus=${ndus}`);
  }

  const range = req.headers.get('range');
  if (range) upstreamHeaders.set('Range', range);

  let upstream: Response;
  try {
    upstream = await fetch(mediaUrl, {
      method: req.method,
      headers: upstreamHeaders,
    });
  } catch {
    return new Response('Upstream fetch failed', { status: 502 });
  }

  if (upstream.status === 403 && !ndus) {
    return new Response(
      'TeraBox requires authentication. Set TERABOX_NDUS on the server or use Google Drive for this lecture.',
      { status: 403 },
    );
  }

  const responseHeaders = new Headers(corsHeaders());
  const pass = [
    'content-type',
    'content-length',
    'content-range',
    'accept-ranges',
    'etag',
    'last-modified',
  ] as const;

  for (const name of pass) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  responseHeaders.set('Cache-Control', 'no-store');

  if (req.method === 'HEAD') {
    return new Response(null, {
      status: upstream.status,
      headers: responseHeaders,
    });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
