import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react'
import type { BlogTocItem } from '../utils/blogToc'
import './BlogTableOfContents.css'

const SCROLL_OFFSET = 92

type BlogTableOfContentsProps = {
  items: BlogTocItem[]
}

function TocList({
  items,
  activeId,
  onNavigate,
  linkRefs,
}: {
  items: BlogTocItem[]
  activeId: string
  onNavigate: (id: string) => void
  linkRefs: MutableRefObject<Map<string, HTMLAnchorElement>>
}) {
  return (
    <ol className="blog-toc-list">
      {items.map((item) => {
        const isActive = item.id === activeId
        return (
          <li
            key={item.id}
            className={`blog-toc-item blog-toc-item--l${item.level}${isActive ? ' is-active' : ''}`}
          >
            <a
              href={`#${item.id}`}
              ref={(el) => {
                if (el) linkRefs.current.set(item.id, el)
                else linkRefs.current.delete(item.id)
              }}
              className={isActive ? 'is-active' : undefined}
              aria-current={isActive ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault()
                onNavigate(item.id)
              }}
            >
              {item.title}
            </a>
          </li>
        )
      })}
    </ol>
  )
}

export function BlogTableOfContents({ items }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    setActiveId(id)
    history.replaceState(null, '', `#${id}`)
  }, [])

  useEffect(() => {
    if (!items.length) return

    const ids = items.map((i) => i.id)

    const syncActive = () => {
      let current = ids[0] ?? ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= SCROLL_OFFSET + 16) {
          current = id
        }
      }
      setActiveId(current)
    }

    syncActive()
    window.addEventListener('scroll', syncActive, { passive: true })
    window.addEventListener('resize', syncActive, { passive: true })

    return () => {
      window.removeEventListener('scroll', syncActive)
      window.removeEventListener('resize', syncActive)
    }
  }, [items])

  useEffect(() => {
    document
      .querySelectorAll('.blog-article .is-toc-active')
      .forEach((el) => el.classList.remove('is-toc-active'))
    document.getElementById(activeId)?.classList.add('is-toc-active')
  }, [activeId])

  useEffect(() => {
    const link = linkRefs.current.get(activeId)
    const nav = navRef.current
    if (!link || !nav) return
    const linkTop = link.offsetTop
    const linkBottom = linkTop + link.offsetHeight
    const viewTop = nav.scrollTop
    const viewBottom = viewTop + nav.clientHeight
    if (linkTop < viewTop + 12) {
      nav.scrollTop = Math.max(0, linkTop - 12)
    } else if (linkBottom > viewBottom - 12) {
      nav.scrollTop = linkBottom - nav.clientHeight + 12
    }
  }, [activeId])

  if (!items.length) return null

  const listProps = { items, activeId, onNavigate: scrollToId, linkRefs }

  return (
    <div className="blog-toc-root">
      <details className="blog-toc-mobile">
        <summary>On this page</summary>
        <nav aria-label="Table of contents">{TocList(listProps)}</nav>
      </details>

      <aside className="blog-toc-sidebar" aria-label="Table of contents">
        <nav ref={navRef} className="blog-toc-panel">
          <p className="blog-toc-heading">On this page</p>
          {TocList(listProps)}
        </nav>
      </aside>
    </div>
  )
}
