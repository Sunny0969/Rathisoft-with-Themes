/**
 * Single source for crawlable routes → https://rathisoft.com/sitemap.xml
 * Keep in sync with src/App.tsx <Routes>.
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const SITE = 'https://rathisoft.com'

function todayYyyyMmDd() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const SERVICE_PATHS = [
  '/services/web-development',
  '/services/seo-optimization',
  '/services/app-development',
  '/services/wordpress-shopify',
  '/services/video-editing',
  '/services/social-media-marketing',
  '/services/content-marketing',
  '/services/ppc-advertising',
  '/services/email-marketing',
  '/services/branding-design',
]

/** @type {{ path: string; changefreq: string; priority: string }[]} */
const pages = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/services', changefreq: 'weekly', priority: '0.9' },
  ...SERVICE_PATHS.map((path) => ({
    path,
    changefreq: 'weekly',
    priority: '0.75',
  })),
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/packages', changefreq: 'monthly', priority: '0.6' },
  { path: '/work', changefreq: 'monthly', priority: '0.6' },
  { path: '/themes', changefreq: 'monthly', priority: '0.6' },
  { path: '/team', changefreq: 'monthly', priority: '0.6' },
]

function absoluteLoc(path) {
  if (path === '/') return `${SITE}/`
  return `${SITE}${path}`
}

function escapeXml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

const lastmod = todayYyyyMmDd()

const urlEntries = pages
  .map(
    (p) =>
      `  <url>
    <loc>${escapeXml(absoluteLoc(p.path))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`

writeFileSync(join(publicDir, 'sitemap.xml'), xml, 'utf8')
console.log('Wrote public/sitemap.xml (%s URLs, lastmod %s)', pages.length, lastmod)
