import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const token = m[0]
    if (token.startsWith('**')) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>)
    } else {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)
      if (linkMatch) {
        const [, label, href] = linkMatch
        if (href.startsWith('/')) {
          nodes.push(
            <Link key={key++} to={href}>
              {label}
            </Link>,
          )
        } else {
          nodes.push(
            <a key={key++} href={href} rel="noopener noreferrer" target="_blank">
              {label}
            </a>,
          )
        }
      }
    }
    last = m.index + token.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes.length ? nodes : [text]
}

function isTableRow(line: string): boolean {
  return line.trim().startsWith('|')
}

function isUnorderedListLine(line: string): boolean {
  return line.trim().startsWith('- ')
}

function isOrderedListLine(line: string): boolean {
  return /^\d+\.\s/.test(line.trim())
}

function stripOrderedListMarker(line: string): string {
  return line.trim().replace(/^\d+\.\s+/, '')
}

function parseTable(lines: string[]): ReactNode {
  const rows = lines
    .map((l) =>
      l
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((c) => c.trim()),
    )
    .filter((r) => r.some((c) => c.length > 0))
  const isSep = (r: string[]) => r.every((c) => /^:?-+:?$/.test(c))
  const header = rows[0] ?? []
  const bodyRows = rows.slice(1).filter((r) => !isSep(r))
  return (
    <div className="blog-table-wrap" key={Math.random()}>
      <table className="blog-table">
        <thead>
          <tr>
            {header.map((h) => (
              <th key={h}>{parseInline(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{parseInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function renderBlogMarkdown(md: string): ReactNode[] {
  const blocks = md.trim().split(/\n\n+/)
  const out: ReactNode[] = []
  let key = 0

  for (const block of blocks) {
    const lines = block.split('\n')
    const first = lines[0]?.trim() ?? ''

    if (first.startsWith('## ')) {
      out.push(
        <h2 key={key++} id={slugifyHeading(first.slice(3))}>
          {parseInline(first.slice(3))}
        </h2>,
      )
      const rest = lines.slice(1).join('\n').trim()
      if (rest) out.push(...renderBlogMarkdown(rest))
      continue
    }
    if (first.startsWith('### ')) {
      out.push(
        <h3 key={key++} id={slugifyHeading(first.slice(4))}>
          {parseInline(first.slice(4))}
        </h3>,
      )
      const rest = lines.slice(1).join('\n').trim()
      if (rest) out.push(...renderBlogMarkdown(rest))
      continue
    }
    if (lines.every((l) => isUnorderedListLine(l))) {
      out.push(
        <ul key={key++} className="blog-ul">
          {lines.map((l) => (
            <li key={l}>{parseInline(l.trim().replace(/^- /, ''))}</li>
          ))}
        </ul>,
      )
      continue
    }
    if (lines.every((l) => isOrderedListLine(l))) {
      out.push(
        <ol key={key++} className="blog-ol">
          {lines.map((l) => (
            <li key={l}>{parseInline(stripOrderedListMarker(l))}</li>
          ))}
        </ol>,
      )
      continue
    }
    if (lines.every(isTableRow)) {
      out.push(<div key={key++}>{parseTable(lines)}</div>)
      continue
    }
  if (first.startsWith('> ')) {
      out.push(
        <blockquote key={key++} className="blog-snippet-def">
          {parseInline(lines.map((l) => l.replace(/^>\s?/, '')).join(' '))}
        </blockquote>,
      )
      continue
    }

    out.push(
      <p key={key++}>{parseInline(block.replace(/\n/g, ' '))}</p>,
    )
  }
  return out
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function plainHeadingLabel(raw: string): string {
  return raw
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
}
