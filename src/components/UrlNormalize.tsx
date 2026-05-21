import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { legacyRedirectTarget, normalizePathname } from '../utils/routes'

/** Enforces lowercase, trailing slashes, legacy path redirects, and strips tracking query params. */
export function UrlNormalize() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const { pathname, search, hash } = location
    const target = legacyRedirectTarget(pathname, search)
    const nextPath = target?.pathname ?? normalizePathname(pathname)
    const nextSearch = target?.search ?? search

    if (nextPath !== pathname || nextSearch !== search) {
      navigate(`${nextPath}${nextSearch}${hash}`, { replace: true })
    }
  }, [location, navigate])

  return null
}
