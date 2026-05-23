import { ROUTES, servicePath } from '../utils/routes'

export type HomepageServiceCategory = 'core' | 'technology'

export type HomepageServiceCard = {
  slug?: string
  icon: string
  title: string
  desc: string
  tags: readonly string[]
  img: string
  href: string
  category: HomepageServiceCategory
}

const IMG = {
  web: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&h=500&fit=crop&fm=webp&q=75',
  seo: 'https://images.unsplash.com/photo-1686061594225-3e92c0cd51b0?w=800&h=500&fit=crop&fm=webp&q=75',
  app: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&h=500&fit=crop&fm=webp&q=75',
  wpShopify: 'https://images.unsplash.com/photo-1560472354-0088b5dc9d8d?w=800&h=500&fit=crop&fm=webp&q=75',
  video: 'https://images.unsplash.com/photo-1605826832916-d0ea9d6fe71e?w=800&h=500&fit=crop&fm=webp&q=75',
  social: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=500&fit=crop&fm=webp&q=75',
  content: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=800&h=500&fit=crop&fm=webp&q=75',
  ppc: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=500&fit=crop&fm=webp&q=75',
  email: 'https://images.unsplash.com/photo-1557201102-c2f870e84e2e?w=800&h=500&fit=crop&fm=webp&q=75',
  branding: 'https://images.unsplash.com/photo-1770010735791-f7c377534c1c?w=800&h=500&fit=crop&fm=webp&q=75',
  genAi: 'https://images.unsplash.com/photo-1677691824304-279660ceece3?w=800&h=500&fit=crop&fm=webp&q=75',
  dynamicsErp: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&h=500&fit=crop&fm=webp&q=75',
  cyber: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&h=500&fit=crop&fm=webp&q=75',
  gameDev: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&h=500&fit=crop&fm=webp&q=75',
  saas: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop&fm=webp&q=75',
  support: 'https://images.unsplash.com/photo-1758780691544-d11ce61aae47?w=800&h=500&fit=crop&fm=webp&q=75',
  automation: 'https://images.unsplash.com/photo-1607292803026-3b9d9b3d0fe7?w=800&h=500&fit=crop&fm=webp&q=75',
} as const

/** Same cards as the homepage “What We Do” grid — single source for Home, Services, footer. */
export const HOMEPAGE_SERVICE_CARDS: HomepageServiceCard[] = [
  {
    slug: 'web-development',
    icon: '💻',
    title: 'Web Development',
    desc: 'Fast, responsive sites built to turn visitors into leads.',
    tags: ['UI/UX', 'React'],
    img: IMG.web,
    href: servicePath('web-development'),
    category: 'core',
  },
  {
    slug: 'seo-services',
    icon: '🔍',
    title: 'SEO Optimization',
    desc: 'Technical and on-page SEO so the right customers find you on Google.',
    tags: ['On-Page', 'Technical'],
    img: IMG.seo,
    href: servicePath('seo-services'),
    category: 'core',
  },
  {
    slug: 'app-development',
    icon: '📲',
    title: 'App Development',
    desc: 'Custom mobile apps for iOS and Android that feel fast and reliable.',
    tags: ['iOS', 'Android'],
    img: IMG.app,
    href: servicePath('app-development'),
    category: 'core',
  },
  {
    slug: 'wordpress-shopify',
    icon: '🛒',
    title: 'WordPress & Shopify',
    desc: 'Commerce stores that look sharp and guide buyers to checkout.',
    tags: ['WordPress', 'Shopify'],
    img: IMG.wpShopify,
    href: servicePath('wordpress-shopify'),
    category: 'core',
  },
  {
    slug: 'video-editing',
    icon: '🎬',
    title: 'Video Editing',
    desc: 'Reels, ads, and short clips edited for attention and clarity.',
    tags: ['Reels', 'Ads'],
    img: IMG.video,
    href: servicePath('video-editing'),
    category: 'core',
  },
  {
    slug: 'social-media-marketing',
    icon: '📱',
    title: 'Social Media Marketing',
    desc: 'Monthly content and posting so your brand stays visible.',
    tags: ['Instagram', 'Facebook'],
    img: IMG.social,
    href: servicePath('social-media-marketing'),
    category: 'core',
  },
  {
    slug: 'content-marketing',
    icon: '✍️',
    title: 'Content Marketing',
    desc: 'Blogs and copy that bring traffic and support sales.',
    tags: ['Blogs', 'Copywriting'],
    img: IMG.content,
    href: servicePath('content-marketing'),
    category: 'core',
  },
  {
    slug: 'ppc-advertising',
    icon: '🎯',
    title: 'PPC Advertising',
    desc: 'Paid search and social campaigns tuned for measurable ROI.',
    tags: ['Google Ads', 'Meta Ads'],
    img: IMG.ppc,
    href: servicePath('ppc-advertising'),
    category: 'core',
  },
  {
    slug: 'email-marketing',
    icon: '📧',
    title: 'Email Marketing',
    desc: 'Automations and newsletters that nurture leads into repeat buyers.',
    tags: ['Automation', 'Newsletters'],
    img: IMG.email,
    href: servicePath('email-marketing'),
    category: 'core',
  },
  {
    slug: 'branding-design',
    icon: '🎨',
    title: 'Branding and UI/UX Design',
    desc: 'Logos, layouts, and brand systems that look credible on every screen.',
    tags: ['UI/UX', 'Brand Kit'],
    img: IMG.branding,
    href: servicePath('branding-design'),
    category: 'core',
  },
  {
    icon: '🤖',
    title: 'Generative AI',
    desc: 'Practical AI features that save time on support, content, and ops.',
    tags: ['LLMs', 'Automation'],
    img: IMG.genAi,
    href: ROUTES.services,
    category: 'technology',
  },
  {
    icon: '🏢',
    title: 'Dynamics 365 ERP',
    desc: 'ERP setup and tweaks so finance and ops teams work from one source of truth.',
    tags: ['ERP', 'Microsoft'],
    img: IMG.dynamicsErp,
    href: ROUTES.services,
    category: 'technology',
  },
  {
    icon: '🛡️',
    title: 'Cybersecurity',
    desc: 'Hardening, reviews, and secure-by-default builds for live products.',
    tags: ['Security', 'Compliance'],
    img: IMG.cyber,
    href: ROUTES.services,
    category: 'technology',
  },
  {
    icon: '🎮',
    title: 'Game Development',
    desc: 'Game builds with stable performance and polished player flows.',
    tags: ['Unity', '2D/3D'],
    img: IMG.gameDev,
    href: ROUTES.services,
    category: 'technology',
  },
  {
    icon: '📦',
    title: 'SaaS Products',
    desc: 'SaaS products with clear UX and architecture you can extend later.',
    tags: ['SaaS', 'Scalable'],
    img: IMG.saas,
    href: ROUTES.services,
    category: 'technology',
  },
  {
    icon: '🧰',
    title: 'Maintenance & Support',
    desc: 'Updates, fixes, and monitoring after go-live so nothing drifts.',
    tags: ['Support', 'Updates'],
    img: IMG.support,
    href: ROUTES.contact,
    category: 'technology',
  },
  {
    icon: '⚙️',
    title: 'Automation & Apps',
    desc: 'Internal tools and automations that cut manual work across teams.',
    tags: ['Automation', 'Integrations'],
    img: IMG.automation,
    href: ROUTES.services,
    category: 'technology',
  },
]

export const HOMEPAGE_CORE_SERVICES = HOMEPAGE_SERVICE_CARDS.filter(
  (c) => c.category === 'core',
)
export const HOMEPAGE_TECHNOLOGY_SERVICES = HOMEPAGE_SERVICE_CARDS.filter(
  (c) => c.category === 'technology',
)
