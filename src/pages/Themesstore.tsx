// ThemesStore.tsx
// ─────────────────────────────────────────────────────────────────
// FREE WordPress Themes & Plugins Download Page
// SEO Optimized | Google Drive Direct Download | React + TypeScript
// ─────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import './Themesstore.css';

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

// ── HELPER: Build Google Drive direct download URL ─────────────────
const buildDownloadUrl = (fileId: string): string =>
  `https://drive.google.com/uc?export=download&id=${fileId}`;

const buildDriveViewUrl = (fileId: string): string =>
  `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

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

// ── CARD COMPONENT ─────────────────────────────────────────────────
interface CardProps { item: StoreItem; delay: number; }

const ItemCard: React.FC<CardProps> = ({ item, delay }) => {
  const [downloading, setDownloading] = useState(false);
  const url = buildDownloadUrl(item.driveFileId);

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
            alt=""
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

        <button
          className={`download-btn${downloading ? ' downloading' : ''}`}
          onClick={handleDownload}
          disabled={downloading}
          aria-label={`Download ${item.name} for free`}
          title={`Free download: ${item.name}`}
        >
          <DownloadIcon />
          {downloading ? 'Starting Download…' : 'Free Download'}
        </button>
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
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StoreFilter>('all');
  const [toast, setToast] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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

  return (
    <>
      {/* ── SEO: JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Shopify & WordPress Themes and Plugins',
            description:
              'Shopify themes, WordPress themes, and WordPress plugins — curated library with instant download links.',
            url: typeof window !== 'undefined' ? window.location.origin : '',
            potentialAction: {
              '@type': 'SearchAction',
              target: `${typeof window !== 'undefined' ? window.location.origin : ''}?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      {/* ── BACKGROUND BLOBS ── */}
      <div className="bg-blob bg-blob-1" aria-hidden="true" />
      <div className="bg-blob bg-blob-2" aria-hidden="true" />
      <div className="bg-blob bg-blob-3" aria-hidden="true" />

      <main className="store-wrapper">
        {/* ── HEADER ── */}
        <header className="store-header">
          <div className="badge" role="note">
            <span>📦</span> Shopify themes · WP themes · WP plugins
          </div>

          <h1>
            <span className="highlight">Premium</span> Shopify &amp; WordPress<br />
            Themes &amp; Plugins
          </h1>

          <p className="subtitle">
            {STORE_ITEMS.length}+ items — Shopify paid themes, WordPress paid themes, and WordPress paid plugins.
            Connect your Google Drive file IDs in the catalog data file for downloads.
          </p>

          <div className="stats-row" role="region" aria-label="Library statistics">
            <div className="stat-item">
              <div className="stat-num">{STORE_ITEMS.length}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">{STORE_STATS.shopify}</div>
              <div className="stat-label">Shopify themes</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">{STORE_STATS.wpThemes}</div>
              <div className="stat-label">WP themes</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">{STORE_STATS.wpPlugins}</div>
              <div className="stat-label">WP plugins</div>
            </div>
          </div>
        </header>

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
              <h3>Nothing found</h3>
              <p>Try a different keyword or remove the filter.</p>
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div key={item.id} role="listitem">
                <ItemCard item={item} delay={idx} />
              </div>
            ))
          )}
        </section>

        {/* ── FOOTER ── */}
        <footer className="store-footer">
          <p>
            All files are shared for <strong>educational purposes</strong>. 
            Support developers by purchasing official licenses. &nbsp;|&nbsp;
            <a href="mailto:your@email.com">Contact Us</a>
          </p>
        </footer>
      </main>

      {/* ── TOAST ── */}
      {toast && <Toast message={toast} onHide={() => setToast(null)} />}
    </>
  );
};

export default ThemesStore;