// ThemesStore.tsx
// ─────────────────────────────────────────────────────────────────
// FREE WordPress Themes & Plugins Download Page
// SEO Optimized | Google Drive Direct Download | React + TypeScript
// ─────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import './Themesstore.css';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Seo, SITE_ORIGIN } from '../components/Seo';
import { THEMES_STORE_FONT_STYLESHEET } from '../constants/deferredFontUrls';
import { injectDeferredStylesheet } from '../utils/deferredStylesheet';

import {
  STORE_ITEMS,
  countByCategory,
  isIconImageUrl,
  type StoreItem,
  type StoreCategory,
  type StoreFilter,
} from './themesStoreData';

const STORE_STATS = countByCategory(STORE_ITEMS);

const CATEGORY_LABEL: Record<StoreCategory, string> = {
  'shopify-theme': 'Shopify Theme',
  'wordpress-theme': 'WP Theme',
  'wordpress-plugin': 'WP Plugin',
};

const FILTER_ORDER: StoreFilter[] = [
  'all',
  'shopify-theme',
  'wordpress-theme',
  'wordpress-plugin',
];

type StoreFaqItem = {
  q: string;
  lines: readonly [string, string];
  /** Optional outbound citations under the two-line answer */
  authorityLinks?: boolean;
};

/** Theme-store FAQs — two short lines each, scoped to Shopify/WP catalogue use */
const STORE_FAQ_ITEMS: StoreFaqItem[] = [
  {
    q: 'Why test themes and plugins on staging before sending paid traffic?',
    lines: [
      'Liquid sections, block themes, and plugins can change checkout, schema, and accessibility in ways screenshots do not reveal.',
      'Mirror production on staging, run smoke tests on payments and forms, then promote only when rollback steps are documented.',
    ],
  },
  {
    q: 'How do we handle breaking updates from Shopify or WordPress vendors?',
    lines: [
      'Upstream releases land often—pin compatible versions in your notes and keep a known-good branch or backup ZIP.',
      'If a promotion is live, pause theme updates until QA finishes; rollback paths protect revenue when vendors ship regressions.',
    ],
  },
  {
    q: 'Can I use every download here on a production store without buying licences?',
    lines: [
      'Files here support learning and evaluation; production storefronts normally require licences from the original authors.',
      'Buy official licences before you scale revenue—use downloads here to shortlist stacks before budget approvals.',
    ],
  },
  {
    q: 'What keeps theme experiments from hurting SEO or Core Web Vitals?',
    lines: [
      'Ship meaningful titles, excerpts, and FAQ markup; avoid duplicate templates that bloat HTML and drag LCP or CLS.',
      'Pair content hygiene with third-party references your procurement team already trusts—we link the trio we cite in workshops below.',
    ],
    authorityLinks: true,
  },
  {
    q: 'Should WordPress plugins and Shopify themes share one update policy?',
    lines: [
      'Treat PHP Composer or WP CLI workflows separately from Shopify CLI or Theme Kit—each stack ships on its own cadence.',
      'Log which extensions touch checkout or cart scripts so two “minor” bumps cannot collide without a documented owner.',
    ],
  },
  {
    q: 'Who helps when pilots need custom engineering beyond these downloads?',
    lines: [
      'Our Lahore squad scopes migrations, integrations, and retained QA once catalogue assets stop covering edge cases.',
      'Review Services for capability maps, Portfolio for proof, then Contact with staging URLs and compliance notes for faster quoting.',
    ],
  },
];

// ── HELPER: Build Google Drive direct download URL ─────────────────
const buildDownloadUrl = (fileId: string): string =>
  `https://drive.google.com/uc?export=download&id=${fileId}`;

const buildDriveViewUrl = (fileId: string): string =>
  `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

const demoWarmOrigins = new Set<string>();

/** DNS + TCP warm-up before click — call on hover/focus and when modal opens. */
function warmDemoUrlConnection(rawUrl: string): void {
  if (typeof document === 'undefined') return;
  try {
    const url = new URL(rawUrl.trim(), window.location.href);
    if (!url.protocol.startsWith('http')) return;
    const origin = url.origin;
    if (demoWarmOrigins.has(origin)) return;
    demoWarmOrigins.add(origin);

    const dns = document.createElement('link');
    dns.rel = 'dns-prefetch';
    dns.href = origin;

    const pre = document.createElement('link');
    pre.rel = 'preconnect';
    pre.href = origin;

    document.head.appendChild(dns);
    document.head.appendChild(pre);

    if (/\.youtube\.com$|youtube-nocookie\.com$/i.test(url.hostname)) {
      const yt = [
        'https://www.youtube.com',
        'https://www.youtube-nocookie.com',
        'https://i.ytimg.com',
      ];
      for (const y of yt) {
        if (demoWarmOrigins.has(y)) continue;
        demoWarmOrigins.add(y);
        const l = document.createElement('link');
        l.rel = 'preconnect';
        l.href = y;
        document.head.appendChild(l);
      }
    }
  } catch {
    /* invalid demo URL */
  }
}

/**
 * Theme Store preview pages don't embed reliably on external sites.
 * Official listing demos usually live on `{handle}-theme.myshopify.com` (embed-friendly like Turbo).
 */
function normalizeShopifyDemoIframeUrl(raw: string): string {
  const trimmed = raw.trim();
  try {
    const u = new URL(trimmed);
    if (u.hostname.toLowerCase() !== 'themes.shopify.com') return trimmed;
    const m = u.pathname.match(/^\/themes\/([^/]+)/i);
    if (!m?.[1]) return trimmed;
    return `https://${m[1].toLowerCase()}-theme.myshopify.com/`;
  } catch {
    return trimmed;
  }
}

/** Many third-party demos use *-demo.myshopify.com — Shopify blocks those in cross-site iframes. */
function shopifyVendorDemoBlocksIframe(url: string): boolean {
  try {
    const h = new URL(url).hostname.toLowerCase();
    return h.endsWith('-demo.myshopify.com');
  } catch {
    return false;
  }
}

// ── ICONS ──────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={11} cy={11} r={8}/><line x1={21} y1={21} x2={16.65} y2={16.65}/>
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1={12} y1={15} x2={12} y2={3}/>
  </svg>
);

const FileSizeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const VersionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

// ── TOAST COMPONENT ────────────────────────────────────────────────
interface ToastProps { message: string; onHide: () => void; }

const Toast: React.FC<ToastProps> = ({ message, onHide }) => {
  const [hiding, setHiding] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => { setHiding(true); setTimeout(onHide, 300); }, 3000);
    return () => clearTimeout(t);
  }, [onHide]);
  return (
    <div className={`toast${hiding ? ' hide' : ''}`} role="status" aria-live="polite">
      <span className="toast-icon">✅</span>
      {message}
    </div>
  );
};

type LiveDemoPayload = { title: string; url: string | undefined };

// ── LIVE DEMO MODAL (shared, one iframe instance) ─────────────────
interface LiveDemoModalProps {
  open: boolean;
  title: string;
  embedUrl: string | undefined;
  onClose: () => void;
}

const LiveDemoModal: React.FC<LiveDemoModalProps> = ({
  open,
  title,
  embedUrl,
  onClose,
}) => {
  const [frameReady, setFrameReady] = useState(false);

  const tabUrl = embedUrl?.trim() ?? '';
  const iframeSrc = tabUrl ? normalizeShopifyDemoIframeUrl(tabUrl) : '';
  const iframeBlocked =
    Boolean(tabUrl) &&
    shopifyVendorDemoBlocksIframe(iframeSrc);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setFrameReady(false);
      return;
    }
    if (!tabUrl) return;

    warmDemoUrlConnection(tabUrl);
    if (iframeSrc !== tabUrl) {
      warmDemoUrlConnection(iframeSrc);
    }

    if (iframeBlocked) {
      setFrameReady(true);
      return;
    }

    setFrameReady(false);
    const safety = window.setTimeout(() => setFrameReady(true), 18_000);
    return () => clearTimeout(safety);
  }, [open, tabUrl, iframeSrc, iframeBlocked]);

  const handleIframeLoad = useCallback(() => {
    setFrameReady(true);
  }, []);

  if (!open) return null;

  const hasSrc = Boolean(tabUrl);

  return (
    <div className="live-demo-modal-root" role="presentation">
      <button
        type="button"
        className="live-demo-modal-scrim"
        aria-label="Close preview"
        onClick={onClose}
      />
      <div
        className="live-demo-modal-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby="live-demo-modal-title"
      >
        <div className="live-demo-modal-panel">
          <header className="live-demo-modal-head">
            <div className="live-demo-modal-head-main">
              <h2 id="live-demo-modal-title" className="live-demo-modal-title">
                Live demo · {title}
              </h2>
              {tabUrl ? (
                <a
                  href={tabUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="live-demo-open-tab"
                >
                  Open full demo in new tab ↗
                </a>
              ) : null}
            </div>
            <button
              type="button"
              className="live-demo-modal-close"
              onClick={onClose}
              aria-label="Close preview"
            >
              ×
            </button>
          </header>
          <div className="live-demo-modal-body">
            {hasSrc ? (
              iframeBlocked ? (
                <div className="live-demo-iframe-fallback">
                  <p className="live-demo-fallback-lead">
                    This vendor demo can’t load inside our site
                  </p>
                  <p className="live-demo-fallback-text">
                    Stores like{' '}
                    <code className="live-demo-fallback-code">*-demo.myshopify.com</code>{' '}
                    block embedding on other domains (Shopify security — you’d see “refused to
                    connect” in an iframe). Theme Store-style URLs work best when they resolve to{' '}
                    <code className="live-demo-fallback-code">*-theme.myshopify.com</code>{' '}
                    — e.g. Turbo — which usually embeds here.
                  </p>
                  <a
                    href={tabUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="live-demo-fallback-cta"
                  >
                    Open demo store ↗
                  </a>
                </div>
              ) : (
                <>
                  {!frameReady ? (
                    <div
                      className="live-demo-iframe-loading"
                      aria-busy="true"
                      aria-live="polite"
                    >
                      <span className="live-demo-spinner" aria-hidden />
                      <span className="live-demo-loading-text">
                        Loading preview…
                      </span>
                    </div>
                  ) : null}
                  <iframe
                    key={iframeSrc}
                    className={
                      frameReady
                        ? 'live-demo-modal-iframe live-demo-modal-iframe--ready'
                        : 'live-demo-modal-iframe live-demo-modal-iframe--warming'
                    }
                    src={iframeSrc}
                    title={title}
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    onLoad={handleIframeLoad}
                  />
                </>
              )
            ) : (
              <p className="live-demo-modal-empty">
                No live preview URL is set for this item yet. Add a{' '}
                <code>demoUrl</code> field in <code>themesStoreData.ts</code> to
                load a demo or video embed in this window.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── CARD COMPONENT ─────────────────────────────────────────────────
interface CardProps {
  item: StoreItem;
  delay: number;
  onOpenLiveDemo: (payload: LiveDemoPayload) => void;
}

const ItemCard: React.FC<CardProps> = ({ item, delay, onOpenLiveDemo }) => {
  const [downloading, setDownloading] = useState(false);
  const url = buildDownloadUrl(item.driveFileId);
  const demoUrl = item.demoUrl?.trim();

  const handleDownload = useCallback(() => {
    setDownloading(true);
    // Trigger download via hidden anchor
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `${item.slug}.zip`);
    a.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 2500);
  }, [url, item.slug]);

  return (
    <article
      className="item-card"
      style={{ animationDelay: `${delay * 0.05}s` }}
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      {/* Hidden SEO metadata */}
      <meta itemProp="name" content={item.name} />
      <meta
        itemProp="applicationCategory"
        content={item.category === 'wordpress-plugin' ? 'SoftwareApplication' : 'WebApplication'}
      />
      <meta
        itemProp="operatingSystem"
        content={item.category === 'shopify-theme' ? 'Shopify' : 'WordPress'}
      />
      <meta itemProp="softwareVersion" content={item.version} />
      <meta itemProp="description" content={item.description} />
      <meta itemProp="offers" content="Free" />

      <div className="card-thumb" aria-hidden="true">
        <div className="card-thumb-pattern" />
        {isIconImageUrl(item.icon) ? (
          <img
            className="card-thumb-icon-img"
            src={item.icon}
            alt={`${item.name} — WordPress or Shopify product thumbnail`}
            width={72}
            height={72}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="card-thumb-icon" role="img" aria-label={item.name}>
            {item.icon}
          </span>
        )}
      </div>

      <div className="card-body">
        <div className="card-top">
          <h2 className="card-title" itemProp="name">{item.name}</h2>
          <span className={`card-tag ${item.category}`} aria-label={CATEGORY_LABEL[item.category]}>
            {CATEGORY_LABEL[item.category]}
          </span>
        </div>

        <p className="card-desc" itemProp="description">{item.description}</p>

        {item.tags.length > 0 && (
          <div className="card-tags" aria-label="Tags">
            {item.tags.map((tag) => (
              <span key={tag} className="card-tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="card-meta" aria-label="File details">
          <span className="card-meta-item" title="Version">
            <VersionIcon /> v{item.version}
          </span>
          <span className="card-meta-item" title={item.fileSize.trim() ? 'File size' : 'Open Google Drive for file size'}>
            <FileSizeIcon />
            {item.fileSize.trim() ? (
              item.fileSize
            ) : (
              <a
                className="card-meta-drive-link"
                href={buildDriveViewUrl(item.driveFileId)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Size on Drive
              </a>
            )}
          </span>
        </div>

        <div className="card-actions" role="group" aria-label="Preview and download">
          <button
            type="button"
            className="btn-live-demo"
            {...(demoUrl ? { 'data-demo-url': demoUrl } : {})}
            onMouseEnter={() => {
              if (!demoUrl) return;
              warmDemoUrlConnection(demoUrl);
              const iframeCandidate = normalizeShopifyDemoIframeUrl(demoUrl);
              if (iframeCandidate !== demoUrl) {
                warmDemoUrlConnection(iframeCandidate);
              }
            }}
            onFocus={() => {
              if (!demoUrl) return;
              warmDemoUrlConnection(demoUrl);
              const iframeCandidate = normalizeShopifyDemoIframeUrl(demoUrl);
              if (iframeCandidate !== demoUrl) {
                warmDemoUrlConnection(iframeCandidate);
              }
            }}
            onClick={() =>
              onOpenLiveDemo({ title: item.name, url: demoUrl || undefined })
            }
            aria-label={`Live demo: ${item.name}`}
          >
            Live Demo
          </button>
          <a
            href={url}
            className={`btn-download${downloading ? ' downloading' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              if (downloading) return;
              handleDownload();
            }}
            rel="noopener noreferrer"
            download={`${item.slug}.zip`}
            aria-label={`Download ${item.name} for free`}
            title={`Free download: ${item.name}`}
          >
            <DownloadIcon />
            {downloading ? 'Starting Download…' : 'Free Download'}
          </a>
        </div>
      </div>
    </article>
  );
};

// ── MAIN COMPONENT ─────────────────────────────────────────────────
function filterTabLabel(f: StoreFilter): string {
  if (f === 'all') return `🗂 All (${STORE_ITEMS.length})`;
  if (f === 'shopify-theme') return `🛍️ Shopify (${STORE_STATS.shopify})`;
  if (f === 'wordpress-theme') return `🎨 WP themes (${STORE_STATS.wpThemes})`;
  return `🔌 WP plugins (${STORE_STATS.wpPlugins})`;
}

const ThemesStore: React.FC = () => {
  const [liveDemo, setLiveDemo] = useState<LiveDemoPayload | null>(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StoreFilter>('all');
  const [toast, setToast] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});
  const searchRef = useRef<HTMLInputElement>(null);

  const toggleFaq = useCallback((index: number) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  // Filter + Search logic
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return STORE_ITEMS.filter((item) => {
      const matchFilter = filter === 'all' || item.category === filter;
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.includes(q));
      return matchFilter && matchSearch;
    });
  }, [search, filter]);

  // Keyboard shortcut: Ctrl+K or / to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement?.tagName !== 'INPUT')) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    injectDeferredStylesheet(THEMES_STORE_FONT_STYLESHEET, 'rathisoft-deferred-fonts-themes');
  }, []);

  const themesStoreUrl = `${SITE_ORIGIN}/themes`;

  return (
    <>
      <Seo
        title="WordPress Themes & Plugins Store | RathiSoft"
        description="Browse premium WordPress themes, Shopify themes, and WordPress plugins from RathiSoft — curated marketplace with downloads for your next project."
      />
      {/* ── SEO: JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'RathiSoft — Shopify & WordPress Themes and Plugins',
            description:
              'Shopify themes, WordPress themes, and WordPress plugins — curated library with instant download links.',
            url: themesStoreUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${themesStoreUrl}?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      {/* ── BACKGROUND BLOBS ── */}
      <div className="bg-blob bg-blob-1" aria-hidden="true" />
      <div className="bg-blob bg-blob-2" aria-hidden="true" />
      <div className="bg-blob bg-blob-3" aria-hidden="true" />

      <main className="page-themes app-main">
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Themes store', path: '/themes' },
          ]}
        />
        <section className="hero" aria-labelledby="themes-hero-heading">
          <div className="wrap">
            <div className="label">Themes store</div>

            <h1 id="themes-hero-heading">
              Premium Shopify &amp; WordPress
              <br />
              Themes &amp; Plugins
            </h1>

            <p>
              RathiSoft curates {STORE_ITEMS.length}+ Shopify themes, WordPress themes, and plugins—download-ready
              assets plus guardrails so your team can evaluate stacks before production licences.
            </p>

          <div className="hero-stats" role="region" aria-label="Library statistics">
            <div className="hero-stat">
              <div className="hero-stat-num">{STORE_ITEMS.length}</div>
              <div className="hero-stat-label">Total</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{STORE_STATS.shopify}</div>
              <div className="hero-stat-label">Shopify themes</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{STORE_STATS.wpThemes}</div>
              <div className="hero-stat-label">WP themes</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{STORE_STATS.wpPlugins}</div>
              <div className="hero-stat-label">WP plugins</div>
            </div>
          </div>
          </div>
        </section>

        <div className="store-wrapper">
        {/* ── CONTROLS ── */}
        <section aria-label="Search and filter">
          <div className="control-bar">
            <div className="search-wrap">
              <SearchIcon />
              <input
                ref={searchRef}
                type="search"
                className="search-input"
                placeholder="Search Shopify / WP themes, plugins… (Press / to focus)"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search Shopify themes, WordPress themes, and plugins"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <div className="filter-tabs" role="group" aria-label="Filter by category">
              {FILTER_ORDER.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`filter-tab${filter === f ? ' active' : ''}`}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                >
                  {filterTabLabel(f)}
                </button>
              ))}
            </div>
          </div>

          <div className="results-meta" aria-live="polite" aria-atomic="true">
            <span>
              Showing <strong>{filtered.length}</strong> of {STORE_ITEMS.length} items
              {search && <> for "<strong>{search}</strong>"</>}
            </span>
          </div>
        </section>

        {/* ── GRID ── */}
        <section
          className="items-grid"
          aria-label="Themes and plugins catalog"
          role="list"
        >
          {filtered.length === 0 ? (
            <div className="empty-state" role="status">
              <div className="empty-icon">🔍</div>
              <h2>Nothing found</h2>
              <p>Try a different keyword or remove the filter.</p>
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div key={item.id} role="listitem">
                <ItemCard
                  item={item}
                  delay={idx}
                  onOpenLiveDemo={(payload) => setLiveDemo(payload)}
                />
              </div>
            ))
          )}
        </section>

        <section className="store-faq" aria-labelledby="store-faq-heading">
          <h2 id="store-faq-heading">Theme &amp; plugin FAQs</h2>
          <p className="store-faq-intro">
            Quick answers for teams using this Shopify and WordPress library—staging, licensing, updates, and SEO hygiene.
          </p>
          <div className="store-faq-list">
            {STORE_FAQ_ITEMS.map((item, i) => (
              <div
                key={item.q}
                className={`store-faq-item${faqOpen[i] ? ' open' : ''}`}
              >
                <button
                  type="button"
                  className="store-faq-q"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={!!faqOpen[i]}
                >
                  {item.q}
                </button>
                <div className="store-faq-a" role="region">
                  <p className="store-faq-a-line">{item.lines[0]}</p>
                  <p className="store-faq-a-line">{item.lines[1]}</p>
                  {item.authorityLinks ? (
                    <p className="store-faq-a-links">
                      <a
                        href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        SEO Starter Guide
                      </a>
                      <span aria-hidden> · </span>
                      <a
                        href="https://developers.google.com/search/docs/essentials"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Search Essentials
                      </a>
                      <span aria-hidden> · </span>
                      <a href="https://web.dev/articles/vitals" target="_blank" rel="noopener noreferrer">
                        Core Web Vitals (web.dev)
                      </a>
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="store-footer">
          <p>
            All files are shared for <strong>educational purposes</strong>. 
            Support developers by purchasing official licenses. &nbsp;|&nbsp;
            <a href="mailto:your@email.com" rel="noopener noreferrer">
              Contact Us
            </a>
          </p>
        </footer>
        </div>
      </main>

      {/* ── TOAST ── */}
      {toast && <Toast message={toast} onHide={() => setToast(null)} />}

      <LiveDemoModal
        open={liveDemo !== null}
        title={liveDemo?.title ?? ''}
        embedUrl={liveDemo?.url}
        onClose={() => setLiveDemo(null)}
      />
    </>
  );
};

export default ThemesStore;