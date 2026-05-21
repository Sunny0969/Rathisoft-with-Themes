import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CATEGORY_ANALYTICS_LABEL,
  clearThemesStoreAnalytics,
  exportThemesStoreAnalyticsJson,
  getThemesStoreClickRows,
  getThemesStoreClickTotals,
  THEMES_STORE_ANALYTICS_EVENT,
  type ThemesStoreClickEntry,
} from '../utils/themesStoreAnalytics'
import type { StoreCategory } from '../pages/themesStoreData'
import './ThemesStoreAnalytics.css'

type StatsSort = 'total' | 'demo' | 'download' | 'name'

function formatWhen(iso?: string): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export function ThemesStoreAnalytics() {
  const [open, setOpen] = useState(false)
  const [tick, setTick] = useState(0)
  const [statsSort, setStatsSort] = useState<StatsSort>('total')
  const [statsCategory, setStatsCategory] = useState<StoreCategory | 'all'>('all')

  useEffect(() => {
    const refresh = () => setTick((n) => n + 1)
    window.addEventListener(THEMES_STORE_ANALYTICS_EVENT, refresh)
    return () => window.removeEventListener(THEMES_STORE_ANALYTICS_EVENT, refresh)
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps -- tick forces re-read from localStorage
  const totals = useMemo(() => getThemesStoreClickTotals(), [tick])
  const rows = useMemo(() => getThemesStoreClickRows(), [tick])

  const filteredRows = useMemo(() => {
    let list =
      statsCategory === 'all'
        ? [...rows]
        : rows.filter((r) => r.category === statsCategory)
    list.sort((a, b) => {
      if (statsSort === 'name') {
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      }
      if (statsSort === 'demo') return b.demoClicks - a.demoClicks
      if (statsSort === 'download') return b.downloadClicks - a.downloadClicks
      const ta = a.demoClicks + a.downloadClicks
      const tb = b.demoClicks + b.downloadClicks
      return tb - ta
    })
    return list
  }, [rows, statsSort, statsCategory])

  const handleExport = useCallback(() => {
    const json = exportThemesStoreAnalyticsJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rathisoft-themes-clicks-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const handleClear = useCallback(() => {
    if (
      !window.confirm(
        'Clear all Live Demo / View Details and Download click counts for this browser?',
      )
    ) {
      return
    }
    clearThemesStoreAnalytics()
  }, [])

  return (
    <section className="store-analytics" aria-labelledby="store-analytics-heading">
      <button
        type="button"
        className="store-analytics-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? 'Hide' : 'Show'} click statistics
        <span className="store-analytics-toggle-meta">
          Demo {totals.demoClicks} · Download {totals.downloadClicks}
        </span>
      </button>

      {open ? (
        <div className="store-analytics-panel">
          <div className="store-analytics-head">
            <div>
              <h2 id="store-analytics-heading">Themes store clicks</h2>
              <p className="store-analytics-note">
                Counts are saved in this browser only (localStorage). Use the same device/browser
                you use to manage the store. Live Demo, View Details, and Free Download are tracked
                per theme, plugin, or app.
              </p>
            </div>
            <div className="store-analytics-actions">
              <button type="button" className="store-analytics-btn" onClick={handleExport}>
                Export JSON
              </button>
              <button
                type="button"
                className="store-analytics-btn store-analytics-btn--danger"
                onClick={handleClear}
              >
                Reset counts
              </button>
            </div>
          </div>

          <div className="store-analytics-summary">
            <div className="store-analytics-stat">
              <span className="store-analytics-stat-num">{totals.demoClicks}</span>
              <span className="store-analytics-stat-label">Live demo / View details</span>
            </div>
            <div className="store-analytics-stat">
              <span className="store-analytics-stat-num">{totals.downloadClicks}</span>
              <span className="store-analytics-stat-label">Free download</span>
            </div>
            <div className="store-analytics-stat">
              <span className="store-analytics-stat-num">{totals.itemsWithActivity}</span>
              <span className="store-analytics-stat-label">Items with clicks</span>
            </div>
          </div>

          <div className="store-analytics-filters">
            <label className="store-analytics-filter-label">
              Category
              <select
                value={statsCategory}
                onChange={(e) =>
                  setStatsCategory(e.target.value as StoreCategory | 'all')
                }
              >
                <option value="all">All</option>
                {(Object.keys(CATEGORY_ANALYTICS_LABEL) as StoreCategory[]).map(
                  (cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_ANALYTICS_LABEL[cat]}
                    </option>
                  ),
                )}
              </select>
            </label>
            <label className="store-analytics-filter-label">
              Sort by
              <select
                value={statsSort}
                onChange={(e) => setStatsSort(e.target.value as StatsSort)}
              >
                <option value="total">Most clicks (total)</option>
                <option value="download">Most downloads</option>
                <option value="demo">Most demos</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>

          {filteredRows.length === 0 ? (
            <p className="store-analytics-empty" role="status">
              No clicks recorded yet. Open Live Demo or Free Download on any card to start
              counting.
            </p>
          ) : (
            <div className="store-analytics-table-wrap">
              <table className="store-analytics-table">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Type</th>
                    <th scope="col">Demo</th>
                    <th scope="col">Download</th>
                    <th scope="col">Last demo</th>
                    <th scope="col">Last download</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row: ThemesStoreClickEntry) => (
                    <tr key={row.id}>
                      <td className="store-analytics-name">{row.name}</td>
                      <td>{CATEGORY_ANALYTICS_LABEL[row.category]}</td>
                      <td className="store-analytics-num">{row.demoClicks}</td>
                      <td className="store-analytics-num">{row.downloadClicks}</td>
                      <td className="store-analytics-when">{formatWhen(row.lastDemoAt)}</td>
                      <td className="store-analytics-when">
                        {formatWhen(row.lastDownloadAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </section>
  )
}
