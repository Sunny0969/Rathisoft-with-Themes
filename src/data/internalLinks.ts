import { ROUTES, servicePath, type ServiceSlug } from '../utils/routes'

export type InternalLinkItem = {
  to: string
  label: string
}

export const HOME_INTERNAL_LINKS: InternalLinkItem[] = [
  { to: ROUTES.packages, label: 'View Our Web Development Packages' },
  { to: ROUTES.portfolio, label: 'Browse the RathiSoft Web Development Portfolio' },
  { to: ROUTES.services, label: 'Explore Digital Marketing & Web Services' },
  { to: ROUTES.about, label: 'Meet the RathiSoft Team' },
  { to: ROUTES.contact, label: 'Request a Free Web Development Quote' },
]

export const ABOUT_INTERNAL_LINKS: InternalLinkItem[] = [
  { to: ROUTES.services, label: 'See Web, Shopify & SEO Services from RathiSoft' },
  { to: ROUTES.portfolio, label: 'Review Our Client Portfolio & Case Studies' },
  { to: ROUTES.packages, label: 'Compare WordPress & Shopify Package Pricing' },
  { to: ROUTES.team, label: 'Meet Specialists on Our Team Page' },
  { to: ROUTES.contact, label: 'Book a Strategy Call with RathiSoft' },
]

export const PORTFOLIO_INTERNAL_LINKS: InternalLinkItem[] = [
  { to: ROUTES.services, label: 'Map Projects to Our Service Offerings' },
  { to: ROUTES.packages, label: 'Start a Scoped Build with Package Pricing' },
  { to: servicePath('web-development'), label: 'Plan a Custom Web Development Project' },
  { to: ROUTES.about, label: 'Learn How We Document Delivery & Transparency' },
  { to: ROUTES.contact, label: 'Reference a Portfolio Case in Your Brief' },
]

export const PACKAGES_INTERNAL_LINKS: InternalLinkItem[] = [
  { to: ROUTES.services, label: 'Explore All Web & Marketing Services' },
  { to: ROUTES.portfolio, label: 'Browse Client Portfolio & Case Studies' },
  { to: servicePath('wordpress-shopify'), label: 'See WordPress & Shopify Development Services' },
  { to: ROUTES.themes, label: 'Download WordPress & Shopify Theme Resources' },
  { to: ROUTES.contact, label: 'Ask for a Custom Package Quote' },
]

export const THEMES_INTERNAL_LINKS: InternalLinkItem[] = [
  { to: servicePath('wordpress-shopify'), label: 'Hire RathiSoft for WordPress & Shopify Setup' },
  { to: ROUTES.packages, label: 'Bundle Themes with Our Store Packages' },
  { to: ROUTES.portfolio, label: 'See Live Stores from Our Portfolio' },
  { to: ROUTES.services, label: 'View Full Digital Services Menu' },
  { to: ROUTES.contact, label: 'Get Help Installing a Theme on Your Site' },
]

export const COURSES_INTERNAL_LINKS: InternalLinkItem[] = [
  { to: servicePath('web-development'), label: 'Upgrade to Professional Web Development' },
  { to: servicePath('seo-services'), label: 'Pair Learning with RathiSoft SEO Services' },
  { to: ROUTES.about, label: 'Learn About the RathiSoft Training Team' },
  { to: ROUTES.portfolio, label: 'See Projects Built by Our Graduates' },
  { to: ROUTES.contact, label: 'Ask About Corporate Training Workshops' },
]

export const CONTACT_INTERNAL_LINKS: InternalLinkItem[] = [
  { to: ROUTES.packages, label: 'Review Web Development Packages Before You Write' },
  { to: ROUTES.portfolio, label: 'Share Portfolio Examples Relevant to Your Brief' },
  { to: ROUTES.services, label: 'Pick a Service Lane for Your Project' },
  { to: ROUTES.about, label: 'Understand Our Delivery Culture First' },
  { to: ROUTES.courses, label: 'Browse Free E-Learning Courses While You Wait' },
]

export const TEAM_INTERNAL_LINKS: InternalLinkItem[] = [
  { to: ROUTES.about, label: 'Read Leadership & Company Story' },
  { to: ROUTES.services, label: 'See Service Lanes Each Specialist Supports' },
  { to: ROUTES.portfolio, label: 'Study Cross-Functional Portfolio Outcomes' },
  { to: ROUTES.packages, label: 'Align Team Capacity with Package Tiers' },
  { to: ROUTES.contact, label: 'Request a Pod Matched to Your Procurement Rules' },
]

export const SERVICES_HUB_INTERNAL_LINKS: InternalLinkItem[] = [
  { to: ROUTES.packages, label: 'Compare Fixed-Price Web Development Packages' },
  { to: ROUTES.portfolio, label: 'Verify Outcomes in the RathiSoft Portfolio' },
  { to: ROUTES.about, label: 'Understand How We Hire and Mentor Engineers' },
  { to: ROUTES.themes, label: 'Browse WordPress & Shopify Theme Downloads' },
  { to: ROUTES.contact, label: 'Schedule a Roadmap Workshop' },
]

/** Complementary service pages — shown when viewing `/services/{slug}/`. */
export const RELATED_SERVICES: Record<ServiceSlug, InternalLinkItem[]> = {
  'web-development': [
    { to: servicePath('seo-services'), label: 'Add SEO Services to Your New Website' },
    { to: servicePath('wordpress-shopify'), label: 'Launch a WordPress or Shopify Store Next' },
    { to: servicePath('branding-design'), label: 'Refresh Branding Before the Site Goes Live' },
    { to: ROUTES.packages, label: 'View Web Development Package Pricing' },
  ],
  'seo-services': [
    { to: servicePath('web-development'), label: 'Fix Technical SEO with Web Development' },
    { to: servicePath('content-marketing'), label: 'Support Rankings with Content Marketing' },
    { to: servicePath('ppc-advertising'), label: 'Combine SEO with PPC Advertising' },
    { to: ROUTES.portfolio, label: 'See SEO Results in Our Portfolio' },
  ],
  'app-development': [
    { to: servicePath('web-development'), label: 'Pair Your App with a Marketing Website' },
    { to: servicePath('branding-design'), label: 'Align UI/UX With Brand Design' },
    { to: servicePath('seo-services'), label: 'Improve App Store & Web Discoverability' },
    { to: ROUTES.contact, label: 'Scope a Mobile App Discovery Call' },
  ],
  'wordpress-shopify': [
    { to: servicePath('seo-services'), label: 'Grow Store Traffic with SEO Services' },
    { to: servicePath('ppc-advertising'), label: 'Scale Sales with PPC for Shopify' },
    { to: ROUTES.themes, label: 'Browse WordPress & Shopify Themes' },
    { to: ROUTES.packages, label: 'Compare Ecommerce Package Pricing' },
  ],
  'video-editing': [
    { to: servicePath('social-media-marketing'), label: 'Distribute Clips via Social Media Marketing' },
    { to: servicePath('content-marketing'), label: 'Embed Videos in Content Marketing' },
    { to: servicePath('ppc-advertising'), label: 'Use Video in Paid Ad Campaigns' },
    { to: ROUTES.portfolio, label: 'See Video Work in Our Portfolio' },
  ],
  'social-media-marketing': [
    { to: servicePath('content-marketing'), label: 'Fuel Feeds with Content Marketing' },
    { to: servicePath('video-editing'), label: 'Order Short-Form Video Editing' },
    { to: servicePath('ppc-advertising'), label: 'Amplify Posts with PPC Advertising' },
    { to: servicePath('branding-design'), label: 'Keep Creative On-Brand' },
  ],
  'content-marketing': [
    { to: servicePath('seo-services'), label: 'Optimize Blogs with SEO Services' },
    { to: servicePath('social-media-marketing'), label: 'Repurpose Copy for Social Media' },
    { to: servicePath('web-development'), label: 'Publish on a Fast Custom Website' },
    { to: ROUTES.portfolio, label: 'Read Content-Led Case Studies' },
  ],
  'ppc-advertising': [
    { to: servicePath('seo-services'), label: 'Balance Paid Ads with Organic SEO' },
    { to: servicePath('wordpress-shopify'), label: 'Send Traffic to a High-Converting Store' },
    { to: servicePath('content-marketing'), label: 'Improve Landing Pages with Better Copy' },
    { to: ROUTES.packages, label: 'Bundle Ads with Marketing Packages' },
  ],
  'email-marketing': [
    { to: servicePath('content-marketing'), label: 'Write Sequences with Content Marketing' },
    { to: servicePath('wordpress-shopify'), label: 'Connect Automations to Your Store' },
    { to: servicePath('seo-services'), label: 'Grow Lists with SEO Lead Magnets' },
    { to: ROUTES.contact, label: 'Plan an Email Automation Workshop' },
  ],
  'branding-design': [
    { to: servicePath('web-development'), label: 'Apply Your Brand to Web Development' },
    { to: servicePath('social-media-marketing'), label: 'Launch Social Templates After Rebrand' },
    { to: servicePath('video-editing'), label: 'Produce On-Brand Video Assets' },
    { to: ROUTES.portfolio, label: 'See Brand Systems in Our Portfolio' },
  ],
}

export function getRelatedServiceLinks(slug: string): InternalLinkItem[] {
  const mapped = slug.replace(/-lahore$/, '')
  if (mapped in RELATED_SERVICES) {
    return RELATED_SERVICES[mapped as ServiceSlug]
  }
  return SERVICES_HUB_INTERNAL_LINKS.slice(0, 4)
}

export function courseDetailInternalLinks(courseTitle: string): InternalLinkItem[] {
  return [
    { to: ROUTES.courses, label: 'Return to the Free E-Learning Course Library' },
    { to: servicePath('web-development'), label: 'Hire RathiSoft for Professional Web Development' },
    { to: servicePath('seo-services'), label: 'Grow Traffic with RathiSoft SEO Services' },
    { to: ROUTES.packages, label: 'View Web Development Packages & Pricing' },
    { to: ROUTES.contact, label: `Ask About Training Beyond ${courseTitle}` },
  ]
}
