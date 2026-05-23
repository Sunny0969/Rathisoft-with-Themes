import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const courses = JSON.parse(readFileSync('src/data/courses.json', 'utf8'))
const blogSrc = readFileSync('src/data/blogPosts.ts', 'utf8')
const BLOG_SLUGS = [...blogSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])

/** URLs in public/sitemap.xml — keep in sync with scripts/generate-sitemap.mjs */
const SITEMAP_PAGES = [
  '/',
  '/portfolio/',
  '/packages/',
  '/themes-store/',
  '/e-learning-courses/',
  ...courses.map((c) => `/e-learning-courses/${c.id}/`),
  '/about-us/',
  '/contact-us/',
  '/our-team/',
  '/blog/',
  ...BLOG_SLUGS.map((s) => `/blog/${s}/`),
]

function norm(p) {
  let x = p.toLowerCase().replace(/\/+$/, '') || '/'
  if (!x.startsWith('/')) x = `/${x}`
  return x === '/' ? '/' : `${x}/`
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      if (name === 'node_modules' || name === '.next') continue
      walk(p, files)
    } else if (/\.(tsx|ts|jsx|js|md|html)$/.test(name)) files.push(p)
  }
  return files
}

const srcFiles = walk('src')
srcFiles.push('index.html')
const inbounds = Object.fromEntries(SITEMAP_PAGES.map((p) => [p, new Set()]))

function addRef(target, from) {
  const n = norm(target)
  for (const p of SITEMAP_PAGES) {
    if (norm(p) === n) inbounds[p].add(from)
  }
}

const ROUTES_MAP = {
  home: '/',
  about: '/about-us/',
  portfolio: '/portfolio/',
  packages: '/packages/',
  themes: '/themes-store/',
  courses: '/e-learning-courses/',
  contact: '/contact-us/',
  team: '/our-team/',
  services: '/services/',
  blog: '/blog/',
}

for (const file of srcFiles) {
  const text = readFileSync(file, 'utf8')
  for (const m of text.matchAll(/to=["'](\/[^"'#?]+)/g)) addRef(m[1], file)
  for (const m of text.matchAll(/href=["'](\/[^"'#?]+)/g)) addRef(m[1], file)
  for (const m of text.matchAll(/path:\s*["'](\/[^"']+)["']/g)) addRef(m[1], file)
  for (const m of text.matchAll(/servicePath\(["']([a-z-]+)["']\)/g)) {
    /* services pages excluded from sitemap — skip */
  }
  for (const m of text.matchAll(/coursePath\(["']([a-z0-9-]+)["']/g))
    addRef(`/e-learning-courses/${m[1]}/`, file)
  for (const m of text.matchAll(/blogPath\(["']([a-z0-9-]+)["']\)/g))
    addRef(`/blog/${m[1]}/`, file)
  for (const m of text.matchAll(/ROUTES\.(home|about|portfolio|packages|themes|courses|contact|team|blog)/g)) {
    if (ROUTES_MAP[m[1]]) addRef(ROUTES_MAP[m[1]], file)
  }
  for (const m of text.matchAll(/`\/blog\/([a-z0-9-]+)\/`/g))
    addRef(`/blog/${m[1]}/`, file)
  if (text.includes('coursePath(course.id)') || text.includes('coursePath(courseId)')) {
    for (const c of courses) addRef(`/e-learning-courses/${c.id}/`, file)
  }
  if (text.includes('blogPath(post.slug)') || text.includes('BLOG_POSTS.map')) {
    for (const s of BLOG_SLUGS) addRef(`/blog/${s}/`, file)
  }
}

const low = []
const orphans = []
for (const p of SITEMAP_PAGES) {
  const count = inbounds[p].size
  if (count === 0) orphans.push(p)
  else if (count < 3) low.push({ path: p, count })
}

console.log('=== SITEMAP PAGES — ORPHANS (0 inbound <a> refs) ===')
orphans.forEach((p) => console.log(p))
console.log('\n=== LOW (<3 refs) ===')
low.sort((a, b) => a.count - b.count).forEach(({ path, count }) => console.log(`${count}\t${path}`))
console.log(`\nSitemap URLs: ${SITEMAP_PAGES.length}, orphans: ${orphans.length}, low: ${low.length}`)

const sitemapXml = readFileSync('public/sitemap.xml', 'utf8')
const serviceInSitemap = sitemapXml.includes('/services/')
console.log(
  serviceInSitemap
    ? '\nWARNING: /services/ still present in public/sitemap.xml — run npm run generate:sitemap'
    : '\nOK: no /services/ URLs in public/sitemap.xml',
)
