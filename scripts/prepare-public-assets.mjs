/**
 * Build-time public asset prep for Core Web Vitals:
 * - Inter Latin 400 → public/fonts/primary-font.woff2 (preload)
 * - Raster images under public/images + public/logo (.jpg/.jpeg/.png) → sibling .webp
 * - public/images/hero-poster.webp → public/assets/hero-image.webp (matches preload + HeroVideo)
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'public')

const fontSrc = join(root, 'node_modules', '@fontsource', 'inter', 'files', 'inter-latin-400-normal.woff2')
const fontDestDir = join(pub, 'fonts')
if (existsSync(fontSrc)) {
  mkdirSync(fontDestDir, { recursive: true })
  copyFileSync(fontSrc, join(fontDestDir, 'primary-font.woff2'))
  console.log('Copied Inter latin-400 → public/fonts/primary-font.woff2')
} else {
  console.warn(
    'Skipping font copy: missing',
    fontSrc,
    '(run npm install in my-react-app)',
  )
}

async function rasterToWebpUnder(subdir) {
  const dir = join(pub, subdir)
  if (!existsSync(dir)) return
  for (const name of readdirSync(dir)) {
    if (!/\.(jpe?g|png)$/i.test(name)) continue
    const input = join(dir, name)
    const base = name.replace(/\.(jpe?g|png)$/i, '')
    const output = join(dir, `${base}.webp`)
    await sharp(input).webp({ quality: 86 }).toFile(output)
    console.log(`WebP: ${subdir}/${base}.webp`)
  }
}

await rasterToWebpUnder('images')
await rasterToWebpUnder('logo')

const assetsDir = join(pub, 'assets')
const heroSrc = join(pub, 'images', 'hero-poster.webp')
if (existsSync(heroSrc)) {
  mkdirSync(assetsDir, { recursive: true })
  copyFileSync(heroSrc, join(assetsDir, 'hero-image.webp'))
  console.log('Synced hero poster → public/assets/hero-image.webp')
}

const logoPngSrc = join(pub, 'logo', 'RathiSoft.png')
const logoWebpSrc = join(pub, 'logo', 'RathiSoft.webp')
const schemaLogoOut = join(assetsDir, 'logo.png')
if (existsSync(logoPngSrc)) {
  mkdirSync(assetsDir, { recursive: true })
  copyFileSync(logoPngSrc, schemaLogoOut)
  console.log('Copied logo → public/assets/logo.png (Organization schema)')
} else if (existsSync(logoWebpSrc)) {
  mkdirSync(assetsDir, { recursive: true })
  await sharp(logoWebpSrc).png().toFile(schemaLogoOut)
  console.log('Exported logo WebP → public/assets/logo.png (Organization schema)')
}
