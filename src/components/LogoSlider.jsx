// Images must live under src/assets/slider — Vite globs bundled files only (keep in sync with public/Slider).
const logoModules = import.meta.glob('../assets/slider/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

function altFromPath(importPath) {
  const file = importPath.split(/[/\\]/).pop() ?? ''
  const base = file.replace(/\.[^.]+$/, '')
  const words = base.split(/[-_\s]+/).filter(Boolean)
  if (words.length === 0) return 'Partner logo'
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

function buildLogoItems() {
  return Object.keys(logoModules)
    .sort((a, b) => a.localeCompare(b))
    .map((path) => ({
      src: logoModules[path],
      alt: altFromPath(path),
    }))
}

const LOGOS = buildLogoItems()

export function LogoSlider() {
  if (LOGOS.length === 0) return null

  return (
    <section
      className="group relative w-full bg-gray-50 py-8 md:py-12"
      aria-label="Brands we work with"
    >
      <style>{`
        @keyframes logo-marquee-rathisoft {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .logo-marquee-track {
          animation: logo-marquee-rathisoft 25s linear infinite;
          will-change: transform;
        }
        @media (min-width: 768px) {
          .logo-marquee-track {
            animation-duration: 35s;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-marquee-track {
            animation-play-state: paused !important;
          }
        }
      `}</style>

      <div
        className="relative mx-auto max-w-[100vw] overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
      >
        {/*
          Same logos are rendered twice in one flex row (total width = 2× one pass).
          Animate translateX to -50% of that row so when the first copy exits, the clone lines up — infinite loop with no jump.
        */}
        <div className="logo-marquee-track flex w-max gap-12 md:gap-16 select-none group-hover:[animation-play-state:paused]">
          {[...LOGOS, ...LOGOS].map((logo, i) => {
            const primarySet = i < LOGOS.length
            return (
              <div
                key={`${logo.src}-${i}`}
                className="group/logo flex h-[50px] w-[120px] shrink-0 items-center justify-center md:h-[60px] md:w-[160px]"
              >
                <img
                  src={logo.src}
                  alt={
                    primarySet
                      ? `${logo.alt} — technology partner of RathiSoft Lahore`
                      : ''
                  }
                  title={primarySet ? logo.alt : undefined}
                  aria-hidden={!primarySet || undefined}
                  width={160}
                  height={60}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="max-h-full max-w-full object-contain grayscale opacity-70 transition-[filter,opacity] duration-300 group-hover/logo:grayscale-0 group-hover/logo:opacity-100"
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
