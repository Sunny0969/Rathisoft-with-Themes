/**
 * JSON-LD structured data — single source for Organization, LocalBusiness, and page graphs.
 * Validate after deploy: https://search.google.com/test/rich-results
 */
import coursesJson from './courses.json'
import { CASE_STUDIES } from './caseStudiesData'
import {
  SITE_TESTIMONIALS,
  buildOrganizationReviewProperties,
} from './testimonials'
import type { Course } from '../types/lms'
import { SITE_ORIGIN } from '../components/Seo'
import { ROUTES, coursePath } from '../utils/routes'

export const SCHEMA_CONTEXT = 'https://schema.org' as const

export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`
export const LOCAL_BUSINESS_ID = `${SITE_ORIGIN}/#localbusiness`

/** Public social profiles (keep aligned with Footer / marketing). */
export const RATHISOFT_SAME_AS = [
  'https://www.linkedin.com/company/rathisoft-innovation/',
  'https://twitter.com/rathisoft',
  'https://www.facebook.com/rathisoft',
  'https://www.instagram.com/rathisoft/',
] as const

export const RATHISOFT_POSTAL_ADDRESS = {
  '@type': 'PostalAddress' as const,
  streetAddress: 'Johar Town',
  addressLocality: 'Lahore',
  addressRegion: 'Punjab',
  postalCode: '54000',
  addressCountry: 'PK',
}

export const RATHISOFT_GEO = {
  '@type': 'GeoCoordinates' as const,
  latitude: 31.5497,
  longitude: 74.3436,
}

export const RATHISOFT_OPENING_HOURS = [
  {
    '@type': 'OpeningHoursSpecification' as const,
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ] as const,
    opens: '09:00',
    closes: '18:00',
  },
]

type OrganizationOptions = {
  includeReviews?: boolean
}

export function buildOrganizationSchema(options: OrganizationOptions = {}) {
  const { includeReviews = false } = options
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'RathiSoft',
    url: SITE_ORIGIN,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_ORIGIN}/assets/logo.png`,
    },
    image: `${SITE_ORIGIN}/og-image.webp`,
    description:
      'Software agency in Lahore, Pakistan for custom web apps, Shopify and WordPress stores, mobile apps, and digital marketing.',
    foundingDate: '2020',
    email: 'info@rathisoft.com',
    address: RATHISOFT_POSTAL_ADDRESS,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+92-334-2651544',
        email: 'info@rathisoft.com',
        contactType: 'customer service',
        areaServed: ['PK', 'US', 'GB', 'AE', 'SA'],
        availableLanguage: ['English', 'Urdu'],
      },
    ],
    sameAs: [...RATHISOFT_SAME_AS],
    areaServed: ['PK', 'US', 'GB', 'AE', 'SA'],
    ...(includeReviews
      ? buildOrganizationReviewProperties(SITE_TESTIMONIALS)
      : {}),
  }
}

/** Local business / software agency listing for Lahore. */
export function buildLocalBusinessSchema() {
  return {
    '@type': 'LocalBusiness',
    '@id': LOCAL_BUSINESS_ID,
    name: 'RathiSoft',
    url: SITE_ORIGIN,
    image: `${SITE_ORIGIN}/og-image.webp`,
    telephone: '+92-334-2651544',
    email: 'info@rathisoft.com',
    priceRange: '$$',
    address: RATHISOFT_POSTAL_ADDRESS,
    geo: RATHISOFT_GEO,
    openingHoursSpecification: RATHISOFT_OPENING_HOURS,
    sameAs: [...RATHISOFT_SAME_AS],
    additionalProperty: {
      '@type': 'PropertyValue',
      name: 'businessType',
      value: 'SoftwareAgency',
    },
    parentOrganization: { '@id': ORGANIZATION_ID },
  }
}

/** Homepage sitelinks search box — themes catalog supports `?q=` filtering. */
export function buildWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    name: 'RathiSoft',
    url: SITE_ORIGIN,
    publisher: { '@id': ORGANIZATION_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_ORIGIN}${ROUTES.themes}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildHomePageSchemaGraph() {
  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': [
      buildOrganizationSchema({ includeReviews: true }),
      buildLocalBusinessSchema(),
      buildWebSiteSchema(),
    ],
  }
}

export function buildAboutPageSchemaGraph() {
  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${SITE_ORIGIN}${ROUTES.about}#webpage`,
        name: 'About RathiSoft',
        url: `${SITE_ORIGIN}${ROUTES.about}`,
        description:
          'Meet RathiSoft—building web, mobile, Shopify, and marketing for Pakistan and global clients.',
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': ORGANIZATION_ID },
        mainEntity: { '@id': ORGANIZATION_ID },
      },
      buildOrganizationSchema(),
      buildLocalBusinessSchema(),
    ],
  }
}

export type ServiceSchemaInput = {
  title: string
  description: string
  href: string
}

export function buildServiceSchema(svc: ServiceSchemaInput) {
  const url = svc.href.startsWith('http')
    ? svc.href
    : `${SITE_ORIGIN}${svc.href.startsWith('/') ? svc.href : `/${svc.href}`}`

  return {
    '@type': 'Service',
    name: svc.title,
    serviceType: svc.title,
    description: svc.description,
    url,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: {
      '@type': 'City',
      name: 'Lahore',
      containedInPlace: {
        '@type': 'Country',
        name: 'Pakistan',
      },
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'PKR',
      url,
    },
  }
}

export function buildServicesPageSchemaGraph(services: ServiceSchemaInput[]) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_ORIGIN}${ROUTES.services}#webpage`,
        name: 'Web & Digital Marketing Services | RathiSoft Lahore',
        url: `${SITE_ORIGIN}${ROUTES.services}`,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': ORGANIZATION_ID },
      },
      buildOrganizationSchema(),
      ...services.map((svc) => buildServiceSchema(svc)),
    ],
  }
}

export function buildServiceDetailSchemaGraph(
  svc: ServiceSchemaInput,
  allServices: ServiceSchemaInput[],
) {
  const primary = buildServiceSchema(svc)
  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_ORIGIN}${svc.href}#webpage`,
        name: `${svc.title} | RathiSoft Lahore`,
        url: `${SITE_ORIGIN}${svc.href}`,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': ORGANIZATION_ID },
        mainEntity: primary,
      },
      buildOrganizationSchema(),
      primary,
      ...allServices
        .filter((s) => s.href !== svc.href)
        .map((s) => buildServiceSchema(s)),
    ],
  }
}

function absoluteAssetUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildPortfolioItemListSchema() {
  const itemListElement = CASE_STUDIES.map((study, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'CreativeWork',
      name: study.title,
      url: study.href,
      description: study.challenge,
      image: absoluteAssetUrl(study.image),
      creator: { '@id': ORGANIZATION_ID },
    },
  }))

  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_ORIGIN}${ROUTES.portfolio}#webpage`,
        name: 'Portfolio | RathiSoft Lahore',
        url: `${SITE_ORIGIN}${ROUTES.portfolio}`,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': ORGANIZATION_ID },
        mainEntity: {
          '@type': 'ItemList',
          name: 'RathiSoft client projects and case studies',
          description:
            'Selected web development, Shopify, WordPress, and marketing launches delivered by RathiSoft in Lahore, Pakistan.',
          numberOfItems: itemListElement.length,
          itemListElement,
        },
      },
      buildOrganizationSchema(),
      {
        '@type': 'ItemList',
        '@id': `${SITE_ORIGIN}${ROUTES.portfolio}#itemlist`,
        name: 'RathiSoft portfolio projects',
        url: `${SITE_ORIGIN}${ROUTES.portfolio}`,
        numberOfItems: itemListElement.length,
        itemListElement,
      },
    ],
  }
}

function durationToIso(duration: string): string | undefined {
  const hours = duration.match(/(\d+)\s*hours?/i)
  if (hours) return `PT${hours[1]}H`
  return undefined
}

export function buildCourseSchema(course: Course) {
  const url = `${SITE_ORIGIN}${coursePath(course.id)}`
  const timeRequired = durationToIso(course.duration)

  return {
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url,
    courseCode: course.id,
    educationalLevel: course.level,
    inLanguage: 'en',
    isAccessibleForFree: true,
    provider: { '@id': ORGANIZATION_ID },
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
      url,
    },
    ...(course.thumbnail
      ? { image: absoluteAssetUrl(course.thumbnail) }
      : {}),
    ...(timeRequired ? { timeRequired } : {}),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: course.duration,
      instructor: {
        '@type': 'Organization',
        name: course.instructor,
      },
    },
  }
}

const courses = coursesJson as Course[]

export function buildCoursesPageSchemaGraph() {
  const courseEntities = courses.map((c) => buildCourseSchema(c))
  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_ORIGIN}${ROUTES.courses}#webpage`,
        name: 'Free Online Courses | RathiSoft',
        url: `${SITE_ORIGIN}${ROUTES.courses}`,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': ORGANIZATION_ID },
      },
      buildOrganizationSchema(),
      ...courseEntities,
    ],
  }
}

export function buildContactPageSchemaGraph() {
  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${SITE_ORIGIN}${ROUTES.contact}#webpage`,
        name: 'Contact RathiSoft',
        url: `${SITE_ORIGIN}${ROUTES.contact}`,
        description:
          'Contact RathiSoft for software development, web development, digital marketing, and SEO services in Lahore, Pakistan.',
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        mainEntity: { '@id': LOCAL_BUSINESS_ID },
      },
      buildOrganizationSchema(),
      buildLocalBusinessSchema(),
    ],
  }
}
