/**
 * Per-route SEO — titles ≤60 chars, descriptions ≤155 chars with CTA.
 * Page H1 copy is aligned in each route file (see Home, About, Services, Work, etc.).
 * Open Graph + Twitter Card tags are applied automatically via <Seo />
 * (og:title, og:description, og:image 1200×630, og:url, og:type, og:site_name,
 * og:locale, twitter:card, twitter:site @rathisoft, twitter:title/description/image).
 */

export type PageSeoEntry = {
  path: string
  title: string
  description: string
  keywords: string
}

export const PAGE_SEO = {
  home: {
    path: '/',
    title: 'Web & App Development Agency Lahore | RathiSoft',
    description:
      'Custom web apps, Shopify & WordPress stores, and marketing that grows revenue. Lahore-based team—get a free project quote today.',
    keywords:
      'software agency Lahore, web development Pakistan, Shopify developer Lahore, WordPress agency, digital marketing Lahore, app development, IT company Johar Town, RathiSoft',
  },
  about: {
    path: '/about-us/',
    title: 'About RathiSoft | Lahore Software Agency Team',
    description:
      'Meet the RathiSoft team behind web, Shopify, apps, and marketing for Pakistan and global clients. See how we deliver—contact us today.',
    keywords:
      'about RathiSoft, software company Lahore, web agency Pakistan, development team, Johar Town IT, digital studio, client delivery, RathiSoft about',
  },
  services: {
    path: '/services/',
    title: 'Web, Shopify & SEO Services | RathiSoft Lahore',
    description:
      'Web development, Shopify, WordPress, SEO, PPC, and apps from one Lahore team with clear scopes. Browse services—request your free quote now.',
    keywords:
      'web development services, Shopify development Lahore, WordPress services, SEO agency Pakistan, PPC advertising, app development, UI UX design, RathiSoft services',
  },
  work: {
    path: '/portfolio/',
    title: 'Portfolio | Web & Shopify Case Studies | RathiSoft',
    description:
      'Explore WordPress, Shopify, and custom web launches by RathiSoft—live sites and case studies you can verify. Message us to scope your build.',
    keywords:
      'web development portfolio, Shopify case studies, WordPress projects Pakistan, RathiSoft work, client projects, ecommerce launches, custom web apps, portfolio Lahore',
  },
  packages: {
    path: '/packages/',
    title: 'Web & Shopify Packages & Pricing | RathiSoft',
    description:
      'Compare WordPress, Shopify, SEO, and marketing packages with clear deliverables and support. Pick a tier or go custom—get a free quote today.',
    keywords:
      'web development packages, Shopify pricing Pakistan, WordPress packages, SEO retainer, marketing bundles, website pricing Lahore, RathiSoft packages, project tiers',
  },
  themes: {
    path: '/themes-store/',
    title: 'WordPress Themes & Shopify Templates | RathiSoft',
    description:
      'Browse free and premium WordPress themes, Shopify templates, and plugins with live demos. Find your stack—contact RathiSoft for setup help today.',
    keywords:
      'WordPress themes download, Shopify templates, WooCommerce themes, Elementor kits, premium themes Pakistan, theme store, plugin library, RathiSoft themes',
  },
  courses: {
    path: '/e-learning-courses/',
    title: 'Free Online Courses | Web & SEO | RathiSoft',
    description:
      'Free courses in web development, SEO, and digital skills from RathiSoft Lahore. Learn at your pace with certificates—start learning free today.',
    keywords:
      'free online courses, web development course, SEO training Pakistan, e-learning RathiSoft, digital marketing course, certificates, Lahore courses, skill building',
  },
  contact: {
    path: '/contact-us/',
    title: 'Contact RathiSoft | Free Web & Shopify Quote',
    description:
      'Contact RathiSoft for web, Shopify, SEO, or app projects in Lahore. Send your brief or book a call—most replies within one business day.',
    keywords:
      'contact RathiSoft, web development quote Lahore, Shopify consultation, free project quote, WhatsApp agency Pakistan, Johar Town office, hire developers, get in touch',
  },
  blog: {
    path: '/blog/',
    title: 'Blog | Software Development Guides | RathiSoft',
    description:
      'Software development company guides, custom web and mobile insights, and vendor checklists from RathiSoft Lahore—read free, then request a quote.',
    keywords:
      'software development blog, custom web development guide, mobile app vendor selection, IT staff augmentation, RathiSoft insights, software services',
  },
  termsOfService: {
    path: '/terms-of-service/',
    title: 'Terms of Service | RathiSoft',
    description:
      'Terms of Service for www.rathisoft.com and RathiSoft web, Shopify, app, and marketing projects. Read our policies before you engage our team.',
    keywords:
      'RathiSoft terms of service, web development agreement, software agency terms Pakistan, Lahore IT company legal',
  },
} as const satisfies Record<string, PageSeoEntry>
