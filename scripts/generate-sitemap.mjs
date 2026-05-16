/**
 * Single source for crawlable routes → https://www.rathisoft.com/sitemap.xml
 * Keep in sync with public marketing routes in src/App.tsx (main nav + contact).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const publicDir = join(root, 'public')

const SITE = 'https://www.rathisoft.com'

function todayYyyyMmDd() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** @type {{ id: string }[]} */
const courses = JSON.parse(
  readFileSync(join(root, 'src', 'data', 'courses.json'), 'utf8'),
)

/** @type {{ path: string; changefreq: string; priority: string }[]} */
const pages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/work', changefreq: 'monthly', priority: '0.8' },
  { path: '/packages', changefreq: 'monthly', priority: '0.8' },
  { path: '/themes', changefreq: 'weekly', priority: '0.8' },
  { path: '/courses', changefreq: 'weekly', priority: '0.8' },
  ...courses.map((c) => ({
    path: `/courses/${c.id}`,
    changefreq: 'monthly',
    priority: '0.7',
  })),
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
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
      `  <url><loc>${escapeXml(absoluteLoc(p.path))}</loc><lastmod>${lastmod}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`

writeFileSync(join(publicDir, 'sitemap.xml'), xml, { encoding: 'utf8' })
console.log('Wrote public/sitemap.xml (%s URLs, lastmod %s)', pages.length, lastmod)
