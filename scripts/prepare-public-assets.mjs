/**
 * Build-time public asset prep for Core Web Vitals:
 * - Inter Latin 400 → public/fonts/primary-font.woff2 (preload)
 * - Raster images under public/images, public/logo, public/assets (recursive) → .webp
 * - public/images/hero-poster.webp → public/assets/hero-image.webp
 * - public/og-image.* → public/og-image.webp
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'public')

const fontDestDir = join(pub, 'fonts')
const interFiles = [
  ['inter-latin-400-normal.woff2', 'inter-latin-400.woff2'],
  ['inter-latin-500-normal.woff2', 'inter-latin-500.woff2'],
  ['inter-latin-600-normal.woff2', 'inter-latin-600.woff2'],
]
mkdirSync(fontDestDir, { recursive: true })
for (const [srcName, destName] of interFiles) {
  const fontSrc = join(root, 'node_modules', '@fontsource', 'inter', 'files', srcName)
  if (existsSync(fontSrc)) {
    copyFileSync(fontSrc, join(fontDestDir, destName))
    console.log(`Copied Inter → public/fonts/${destName}`)
  } else {
    console.warn('Skipping font copy: missing', fontSrc, '(run npm install)')
  }
}

async function convertRasterFile(input) {
  const name = input.split(/[/\\]/).pop()
  if (!/\.(jpe?g|png)$/i.test(name)) return
  const base = name.replace(/\.(jpe?g|png)$/i, '')
  const dir = dirname(input)
  const output = join(dir, `${base}.webp`)
  if (existsSync(output)) {
    const inStat = statSync(input)
    const outStat = statSync(output)
    if (outStat.mtimeMs >= inStat.mtimeMs) return
  }
  await sharp(input).webp({ quality: 84 }).toFile(output)
  console.log(`WebP: ${output.replace(pub, 'public')}`)
}

async function walkRasterToWebp(dir) {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      await walkRasterToWebp(full)
      continue
    }
    await convertRasterFile(full)
  }
}

await walkRasterToWebp(join(pub, 'images'))
await walkRasterToWebp(join(pub, 'logo'))
await walkRasterToWebp(join(pub, 'assets'))

for (const name of readdirSync(pub)) {
  if (/^og-image\.(jpe?g|png)$/i.test(name)) {
    await convertRasterFile(join(pub, name))
  }
}

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

const ogWebp = join(pub, 'og-image.webp')
if (existsSync(ogWebp)) {
  console.log('Open Graph image ready at public/og-image.webp')
}
