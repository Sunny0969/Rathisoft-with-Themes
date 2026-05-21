/**
 * Hero background video — decorative only (all copy stays in `Home.tsx`).
 *
 * Compress source MP4 (~5MB → ~1–2MB) without obvious quality loss, e.g.:
 *   ffmpeg -i hero-section-video.mp4 -vcodec libx264 -crf 28 -preset slow -vf "scale=1280:-2" -an hero-section-video-sm.mp4
 * Optional smaller WebM for Chromium/Firefox (~30% savings): encode WebM then add a `<source type="video/webm" />` above the MP4.
 * Production: prefer CDN (Cloudflare R2, Bunny.net, etc.) instead of `/public` for bandwidth + caching.
 * LCP poster defaults to `/assets/hero-image.webp` — synced from `public/images/hero-poster.webp` in `scripts/prepare-public-assets.mjs`.
 */
import { useEffect, useRef, useState } from 'react'

/** Match desktop/tablet landscape — skip loading MP4 on narrow viewports to save cellular data */
const MOBILE_MQ = '(max-width: 767px)'
const REDUCED_MOTION_MQ = '(prefers-reduced-motion: reduce)'

function readMq(query) {
  if (typeof window === 'undefined') return false
  return window.matchMedia(query).matches
}

/**
 * Decorative full-bleed hero background: poster first (no CLS), optional MP4 after idle mount.
 * Text and CTAs stay in the page — never inside the video.
 */
export function HeroVideo({
  posterSrc = '/assets/hero-image.webp',
  mp4Src = '/images/hero-section-video.mp4',
  posterWidth = 1920,
  posterHeight = 1080,
}) {
  const videoRef = useRef(null)
  const [isMobile, setIsMobile] = useState(() => readMq(MOBILE_MQ))
  const [reducedMotion, setReducedMotion] = useState(() =>
    readMq(REDUCED_MOTION_MQ),
  )
  /** Lazy-mount MP4 only when allowed — after first paint via idle callback */
  const [mountVideo, setMountVideo] = useState(false)
  /** Defer decoding until hero enters viewport (saves bandwidth when landing below fold) */
  const [heroVisible, setHeroVisible] = useState(false)
  const containerRef = useRef(null)

  const allowVideo = !isMobile && !reducedMotion

  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setHeroVisible(true)
      return undefined
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHeroVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '140px', threshold: 0.02 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    const mqRm = window.matchMedia(REDUCED_MOTION_MQ)
    const onMobile = () => setIsMobile(mq.matches)
    const onRm = () => setReducedMotion(mqRm.matches)
    mq.addEventListener('change', onMobile)
    mqRm.addEventListener('change', onRm)
    return () => {
      mq.removeEventListener('change', onMobile)
      mqRm.removeEventListener('change', onRm)
    }
  }, [])

  /** Idle / deferred mount — avoids competing with first paint + main-thread work */
  useEffect(() => {
    if (!allowVideo || !heroVisible) {
      setMountVideo(false)
      return undefined
    }

    let cancelled = false
    const scheduleMount = () => {
      if (!cancelled) setMountVideo(true)
    }

    let idleId = 0
    let timeoutId = 0

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(scheduleMount, { timeout: 1200 })
    } else {
      timeoutId = window.setTimeout(scheduleMount, 180)
    }

    return () => {
      cancelled = true
      if (idleId && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [allowVideo, heroVisible])

  /** Pause when tab hidden — saves CPU / battery; resume when visible */
  useEffect(() => {
    const video = videoRef.current
    if (!video || !mountVideo || !allowVideo) return undefined

    const syncPlayback = () => {
      if (document.hidden) {
        video.pause()
      } else {
        void video.play().catch(() => {})
      }
    }

    document.addEventListener('visibilitychange', syncPlayback)
    syncPlayback()

    return () => document.removeEventListener('visibilitychange', syncPlayback)
  }, [mountVideo, allowVideo])

  /** Stop decoding when user switches to reduced motion mid-session */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!allowVideo || !mountVideo) {
      video.pause()
    }
  }, [allowVideo, mountVideo])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/*
        Poster loads immediately (same dimensions as exported frame) — stable backdrop before MP4.
        fetchPriority helps LCP on the hero region without blocking the whole document.
      */}
      <img
        src={posterSrc}
        alt="Custom web development Lahore Pakistan — RathiSoft hero background"
        title="RathiSoft — WordPress and Shopify agency Lahore"
        width={posterWidth}
        height={posterHeight}
        decoding="async"
        fetchPriority="high"
        loading="eager"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      {mountVideo && allowVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        >
          {/*
            Optional WebM (~30% smaller on Chromium/Firefox). Encode then uncomment:
            <source src="/images/hero-section-video.webm" type="video/webm" />
          */}
          <source src={mp4Src} type="video/mp4" />
          {/* Fallback when <video> is unsupported — keeps content discoverable */}
          <p className="text-[10px] text-white/80">
            Decorative background only. All Rathisoft hero copy is in the page.
          </p>
        </video>
      ) : null}

      {/*
        Blue / indigo tint + darken — matches brand purple-blue and keeps hero copy readable
        on bright video frames (aligned with --indigo ~ #6366f1).
      */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-indigo-950/90 via-blue-950/80 to-slate-950/50"
        aria-hidden="true"
      />
    </div>
  )
}
