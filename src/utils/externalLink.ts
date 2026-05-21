/**
 * rel values for outbound links (referring-domain / link-profile hygiene).
 *
 * - CLIENT_LIVE: portfolio & case-study citations (credit clients; no nofollow)
 * - BRAND: RathiSoft-owned WhatsApp, email, social profiles
 * - EXTERNAL_REF: third-party docs, demos, marketplaces, Drive/TeraBox (nofollow)
 */

export const REL_CLIENT_LIVE = 'noopener noreferrer'

export const REL_BRAND_OUTBOUND = 'noopener noreferrer'

export const REL_EXTERNAL_REF = 'noopener noreferrer nofollow'

/** @deprecated Use REL_EXTERNAL_REF — kept for gradual migration */
export const REL_NOOPENER = REL_EXTERNAL_REF

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}
