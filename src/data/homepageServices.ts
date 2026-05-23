import { HOMEPAGE_SERVICE_CARDS } from './homepageServiceCards'

/** Footer links derived from homepage service cards. */
export const HOMEPAGE_SERVICE_LINKS = HOMEPAGE_SERVICE_CARDS.map((c) => ({
  label: c.title,
  href: c.href,
}))

const SERVICES_SPLIT = 9

export const FOOTER_SERVICES_PRIMARY = HOMEPAGE_SERVICE_LINKS.slice(0, SERVICES_SPLIT)
export const FOOTER_SERVICES_MORE = HOMEPAGE_SERVICE_LINKS.slice(SERVICES_SPLIT)
