import { normalizePathname } from './routes'

/** True when `pathname` is the nav target or a child route (e.g. /blog/post/). */
export function isNavLinkActive(pathname: string, href: string): boolean {
  const current = normalizePathname(pathname)
  const target = normalizePathname(href)
  if (target === '/') return current === '/'
  return current === target || current.startsWith(target)
}
