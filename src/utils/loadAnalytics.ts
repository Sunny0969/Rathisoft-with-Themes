/** Defer Google Analytics until after load — avoids blocking LCP / main thread. */
export function loadDeferredAnalytics(measurementId = 'G-JH9VS55MVY'): void {
  if (typeof window === 'undefined') return

  const run = () => {
    window.dataLayer = window.dataLayer ?? []
    if (!window.gtag) {
      window.gtag = (...args: unknown[]) => {
        window.dataLayer?.push(args)
      }
    }
    window.gtag('js', new Date())
    window.gtag('config', measurementId)

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)
  }

  if (document.readyState === 'complete') {
    run()
  } else {
    window.addEventListener('load', run, { once: true })
  }
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}
