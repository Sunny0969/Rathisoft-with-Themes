import { ROUTES } from '../utils/routes'

/** Matches main header nav — used in footer Company column only. */
export const FOOTER_COMPANY_LINKS = [
  { label: 'Services', href: ROUTES.services },
  { label: 'Portfolio', href: ROUTES.portfolio },
  { label: 'Packages', href: ROUTES.packages },
  { label: 'Blog', href: ROUTES.blog },
  { label: 'About Us', href: ROUTES.about },
  { label: 'Themes', href: ROUTES.themes },
  { label: 'Terms of Service', href: ROUTES.termsOfService },
] as const
