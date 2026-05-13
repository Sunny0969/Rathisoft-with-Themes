/** Client testimonials shown on Home and Services — kept in sync for visible content + Review schema. */

export type SiteTestimonial = {
  stars: string
  /** 1–5 for schema.org reviewRating */
  ratingValue: number
  quote: string
  initials: string
  name: string
  role: string
}

function ratingFromStarString(stars: string): number {
  const filled = (stars.match(/★/g) ?? []).length
  return filled >= 1 && filled <= 5 ? filled : 5
}

export const SITE_TESTIMONIALS: SiteTestimonial[] = [
  {
    stars: '★★★★★',
    ratingValue: ratingFromStarString('★★★★★'),
    quote:
      'Suneel did an excellent job delivering a responsive WordPress website with booking functionality. The project was completed successfully, and the quality of work met my expectations. Communication was clear throughout the project, and everything was delivered professionally.',
    initials: 'RW',
    name: 'Responsive WordPress Website Client',
    role: 'Australia · WordPress Development',
  },
  {
    stars: '★★★★★',
    ratingValue: ratingFromStarString('★★★★★'),
    quote:
      'Excellent experience working with Suneel! He is technically very sound and understood the requirements perfectly. He handled the Shopify and WordPress tasks efficiently. I will definitely hire him again for future projects.',
    initials: 'CW',
    name: 'Custom Website Development Client',
    role: 'International · WordPress & Shopify',
  },
  {
    stars: '★★★★★',
    ratingValue: ratingFromStarString('★★★★★'),
    quote:
      'Suneel delivered the project with great professionalism and technical expertise. He demonstrated strong skills in full-stack development, especially with React and API integrations. Communication was clear throughout the project and the work was completed successfully.',
    initials: 'FS',
    name: 'Full Stack Development Client',
    role: 'International · Full Stack Web Development',
  },
  {
    stars: '★★★★★',
    ratingValue: ratingFromStarString('★★★★★'),
    quote:
      'Suneel did his best to help and remained supportive throughout the project.',
    initials: 'WP',
    name: 'WordPress Plugin Development Client',
    role: 'International · WordPress Development',
  },
  {
    stars: '★★★★★',
    ratingValue: ratingFromStarString('★★★★★'),
    quote:
      'Best done! The issue was fixed quickly and all requirements were completed exactly as expected. Communication was smooth, and the work quality was excellent. Completely satisfied and highly recommended.',
    initials: 'AD',
    name: 'Android App Development Client',
    role: 'International · Mobile App Development',
  },
  {
    stars: '★★★★★',
    ratingValue: ratingFromStarString('★★★★★'),
    quote: 'Great work, highly recommend!',
    initials: 'JW',
    name: 'JavaScript & WordPress Client',
    role: 'International · Web Development',
  },
  {
    stars: '★★★★★',
    ratingValue: ratingFromStarString('★★★★★'),
    quote:
      'Suneel remained professional and offered excellent customer service. He provided a refund and offered support to resolve issues, showing commitment and professionalism.',
    initials: 'FD',
    name: 'Financial Documentation Client',
    role: 'International · Professional Services',
  },
  {
    stars: '★★★★☆',
    ratingValue: ratingFromStarString('★★★★☆'),
    quote:
      'Suneel contributed to the research project and delivered useful ideas for software-related work.',
    initials: 'RS',
    name: 'Research Study Client',
    role: 'International · Software Research',
  },
]

/** Fields to merge onto schema.org Organization / LocalBusiness nodes */
export function buildOrganizationReviewProperties(
  testimonials: readonly SiteTestimonial[],
): {
  aggregateRating: Record<string, unknown>
  review: Record<string, unknown>[]
} {
  const review = testimonials.map((t) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: t.name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: t.ratingValue,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: t.quote,
  }))

  const sum = testimonials.reduce((acc, t) => acc + t.ratingValue, 0)
  const avg = sum / testimonials.length

  return {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Number(avg.toFixed(2)),
      reviewCount: testimonials.length,
      bestRating: 5,
      worstRating: 1,
    },
    review,
  }
}
