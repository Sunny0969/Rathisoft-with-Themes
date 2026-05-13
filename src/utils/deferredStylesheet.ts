/**
 * Loads a remote stylesheet without blocking first paint: starts as print-only,
 * then applies site-wide once loaded (same pattern as media="print" onload).
 */
export function injectDeferredStylesheet(href: string, id: string): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  link.id = id
  link.media = 'print'
  link.onload = () => {
    link.media = 'all'
    link.onload = null
  }
  document.head.appendChild(link)
}
