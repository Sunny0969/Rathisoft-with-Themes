import { useEffect } from 'react'

/** Client-side fallback: apex → www (server 301 in .htaccess / _redirects is primary for bots). */
export function useWwwRedirect(): void {
  useEffect(() => {
    if (window.location.hostname === 'rathisoft.com') {
      window.location.replace(
        'https://www.rathisoft.com' +
          window.location.pathname +
          window.location.search +
          window.location.hash,
      )
    }
  }, [])
}
