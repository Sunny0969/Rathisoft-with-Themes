export type BlogFaq = {
  question: string
  answer: string
}

export type BlogPost = {
  slug: string
  /** ≤60 chars — document title / OG */
  seoTitle: string
  /** Page H1 (may match seoTitle closely) */
  h1: string
  metaDescription: string
  keywords: string
  excerpt: string
  publishedAt: string
  updatedAt: string
  readMinutes: number
  author: string
  heroLabel: string
  focusKeyphrase: string
  bodyMd: string
  faqs: BlogFaq[]
  /** Card / article cover (HTTPS URL) */
  coverImage?: string
  /** Descriptive alt for cover — written for humans and search */
  coverImageAlt?: string
}
