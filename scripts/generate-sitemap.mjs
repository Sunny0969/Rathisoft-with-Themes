/**
 * Crawlable routes → https://www.rathisoft.com/sitemap.xml
 * Image extensions → https://www.rathisoft.com/sitemap-images.xml
 * Keep in sync with src/utils/routes.ts (canonical paths + trailing slashes).
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const publicDir = join(root, 'public')
const srcDir = join(root, 'src')

const SITE = 'https://www.rathisoft.com'

function todayYyyyMmDd() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function escapeXml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function absoluteLoc(path) {
  if (path === '/') return `${SITE}/`
  return `${SITE}${path}`
}

function normalizeAssetPath(path) {
  if (!path) return path
  try {
    return decodeURI(path)
  } catch {
    return path
  }
}

function absoluteAsset(path) {
  if (!path || /^https?:\/\//i.test(path)) return path
  const normalized = normalizeAssetPath(path.startsWith('/') ? path : `/${path}`)
  return `${SITE}${encodeURI(normalized)}`
}

/** @type {{ id: string; title: string; thumbnail?: string }[]} */
const courses = JSON.parse(
  readFileSync(join(srcDir, 'data', 'courses.json'), 'utf8'),
)

/** Slugs from src/data/blogPosts.ts — not listed in sitemap manually */
function readBlogSlugs() {
  const src = readFileSync(join(srcDir, 'data', 'blogPosts.ts'), 'utf8')
  return [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
}

const BLOG_SLUGS = readBlogSlugs()

/** @type {{ path: string; changefreq: string; priority: string }[]} */
/** /services/* pages are intentionally omitted — not submitted to Google. */
const pages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/portfolio/', changefreq: 'monthly', priority: '0.8' },
  { path: '/packages/', changefreq: 'monthly', priority: '0.8' },
  { path: '/themes-store/', changefreq: 'monthly', priority: '0.8' },
  { path: '/e-learning-courses/', changefreq: 'monthly', priority: '0.7' },
  ...courses.map((c) => ({
    path: `/e-learning-courses/${c.id}/`,
    changefreq: 'monthly',
    priority: '0.7',
  })),
  { path: '/about-us/', changefreq: 'monthly', priority: '0.5' },
  { path: '/contact-us/', changefreq: 'monthly', priority: '0.5' },
  { path: '/terms-of-service/', changefreq: 'yearly', priority: '0.3' },
  { path: '/our-team/', changefreq: 'monthly', priority: '0.6' },
  { path: '/blog/', changefreq: 'weekly', priority: '0.8' },
  ...BLOG_SLUGS.map((slug) => ({
    path: `/blog/${slug}/`,
    changefreq: 'weekly',
    priority: '0.8',
  })),
]

const lastmod = todayYyyyMmDd()

const urlEntries = pages
  .map(
    (p) =>
      `  <url><loc>${escapeXml(absoluteLoc(p.path))}</loc><lastmod>${lastmod}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`,
  )
  .join('\n')

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`

writeFileSync(join(publicDir, 'sitemap.xml'), sitemapXml, { encoding: 'utf8' })

/** @type {Map<string, Map<string, string>>} page path → (image path → title) */
const imagesByPage = new Map()

function addImage(pagePath, imagePath, title) {
  if (!imagePath || /^https?:\/\//i.test(imagePath)) return
  const page = pagePath.startsWith('/') ? pagePath : `/${pagePath}`
  const img = normalizeAssetPath(
    imagePath.startsWith('/') ? imagePath : `/${imagePath}`,
  )
  if (!imagesByPage.has(page)) imagesByPage.set(page, new Map())
  const bucket = imagesByPage.get(page)
  if (!bucket.has(img)) bucket.set(img, title)
}

function parsePortfolioCardsFromWork() {
  const workPath = join(srcDir, 'pages', 'Work.tsx')
  if (!existsSync(workPath)) return
  const source = readFileSync(workPath, 'utf8')
  const cardRe =
    /img:\s*'(\/images\/[^']+)'[\s\S]*?title:\s*'([^']+)'/g
  for (const match of source.matchAll(cardRe)) {
    addImage(
      '/portfolio/',
      match[1],
      `${match[2]} — RathiSoft portfolio project screenshot`,
    )
  }
}

function parseCaseStudies() {
  const dataPath = join(srcDir, 'data', 'caseStudiesData.ts')
  if (!existsSync(dataPath)) return
  const source = readFileSync(dataPath, 'utf8')
  const blockRe =
    /title:\s*'([^']+)'[\s\S]*?image:\s*'(\/images\/[^']+)'/g
  for (const match of source.matchAll(blockRe)) {
    addImage(
      '/portfolio/',
      match[2],
      `${match[1]} — web development case study | RathiSoft`,
    )
  }
}

function parseTeamMembers() {
  const dataPath = join(srcDir, 'data', 'teamMembers.ts')
  if (!existsSync(dataPath)) return
  const source = readFileSync(dataPath, 'utf8')
  const blockRe =
    /name:\s*'([^']+)'[\s\S]*?role:\s*'([^']+)'[\s\S]*?image:\s*'(\/images\/[^']+)'/g
  for (const match of source.matchAll(blockRe)) {
    addImage(
      '/our-team/',
      match[3],
      `${match[1]}, ${match[2]} — RathiSoft team`,
    )
  }
}

function addCoreBrandImages() {
  addImage('/', '/og-image.webp', 'RathiSoft — IT & web development company Lahore Pakistan')
  addImage('/', '/assets/hero-image.webp', 'RathiSoft hero — custom web development Lahore')
  addImage('/', '/images/Side.webp', 'RathiSoft services overview illustration')
  addImage('/', '/logo/RathiSoft.webp', 'RathiSoft logo — web development agency Lahore Pakistan')
  addImage('/about-us/', '/logo/simpleR.webp', 'RathiSoft brand mark')
  addImage('/about-us/', '/assets/logo.png', 'RathiSoft organization logo')
}

for (const course of courses) {
  if (course.thumbnail) {
    addImage(
      `/e-learning-courses/${course.id}/`,
      course.thumbnail,
      `${course.title} — RathiSoft e-learning course`,
    )
  }
}

parsePortfolioCardsFromWork()
parseCaseStudies()
parseTeamMembers()
addCoreBrandImages()

const imageUrlBlocks = []
for (const [pagePath, images] of imagesByPage) {
  const imageTags = [...images.entries()]
    .map(
      ([img, title]) =>
        `    <image:image><image:loc>${escapeXml(absoluteAsset(img))}</image:loc><image:title>${escapeXml(title)}</image:title></image:image>`,
    )
    .join('\n')
  imageUrlBlocks.push(
    `  <url>\n    <loc>${escapeXml(absoluteLoc(pagePath))}</loc>\n    <lastmod>${lastmod}</lastmod>\n${imageTags}\n  </url>`,
  )
}

const imageSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageUrlBlocks.join('\n')}
</urlset>
`

writeFileSync(join(publicDir, 'sitemap-images.xml'), imageSitemapXml, {
  encoding: 'utf8',
})

const robotsPath = join(publicDir, 'robots.txt')
const robotsBase = `User-agent: *
Allow: /
Disallow: /services/

User-agent: GPTBot
Disallow: /

`
const robotsSitemaps = `Sitemap: ${SITE}/sitemap.xml
Sitemap: ${SITE}/sitemap-images.xml
`
writeFileSync(robotsPath, robotsBase + robotsSitemaps, { encoding: 'utf8' })

const imageCount = [...imagesByPage.values()].reduce((n, m) => n + m.size, 0)
console.log(
  'Wrote public/sitemap.xml (%s URLs, lastmod %s)',
  pages.length,
  lastmod,
)
console.log(
  'Wrote public/sitemap-images.xml (%s images across %s pages)',
  imageCount,
  imagesByPage.size,
)
console.log('Updated public/robots.txt with sitemap references')
