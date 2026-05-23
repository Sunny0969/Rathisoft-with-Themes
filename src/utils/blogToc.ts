import { plainHeadingLabel, slugifyHeading } from './blogMarkdown'

export type BlogTocItem = {
  id: string
  title: string
  level: 2 | 3
}

export function extractTocFromMarkdown(md: string): BlogTocItem[] {
  const items: BlogTocItem[] = []
  for (const block of md.trim().split(/\n\n+/)) {
    const first = block.split('\n')[0]?.trim() ?? ''
    if (first.startsWith('## ')) {
      const raw = first.slice(3)
      items.push({ id: slugifyHeading(raw), title: plainHeadingLabel(raw), level: 2 })
    } else if (first.startsWith('### ')) {
      const raw = first.slice(4)
      items.push({ id: slugifyHeading(raw), title: plainHeadingLabel(raw), level: 3 })
    }
  }
  return items
}
