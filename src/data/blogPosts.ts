import type { BlogPost } from '../types/blog'
import bodyMd from './blog/software-development-company-guide.md?raw'

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'software-development-company-guide',
    seoTitle: 'Software Development Company Guide 2026 | RathiSoft',
    h1: 'Software development company guide for 2026 buyers',
    metaDescription:
      'Software development company guide: compare services, custom web apps, US mobile partners, and staff augmentation. Use our 10-point checklist—get a quote.',
    keywords:
      'software development company, software services, custom web application development, mobile app development company in usa, IT staff augmentation company, RathiSoft',
    excerpt:
      'How to evaluate software vendors, compare US vs offshore mobile partners, and choose between custom web builds, fixed bids, and staff augmentation—with a 10-point scorecard.',
    publishedAt: '2026-05-01',
    updatedAt: '2026-05-23',
    readMinutes: 12,
    author: 'RathiSoft Editorial',
    heroLabel: 'Insights',
    focusKeyphrase: 'software development company',
    coverImage:
      'https://images.unsplash.com/photo-1763568258844-b31a923568b8?w=600&auto=format&fit=crop&q=60',
    coverImageAlt:
      'Laptop on a wooden desk with code on the screen, glasses, and a notebook beside a potted plant in a bright software development workspace',
    bodyMd,
    faqs: [
      {
        question:
          'How much does a software development company charge per hour in 2026?',
        answer:
          'In 2026, US firms commonly bill $100–200 per hour for senior engineers, Eastern Europe $40–70, and South Asia $25–50. Blended squad rates depend on role mix, with architects and DevOps at the top of each band. Always ask for rate cards by seniority and what is included (PM, QA, DevOps).',
      },
      {
        question:
          "What's the difference between software services and custom software development?",
        answer:
          'Software services is the umbrella: consulting, design, build, integration, and support. Custom software development is the subset where code is written for your specific workflows rather than configured SaaS. Many engagements combine both—SaaS core plus custom APIs and portals.',
      },
      {
        question: 'How do I choose between mobile application development companies?',
        answer:
          'Shortlist vendors with live store apps in your category, verify stack expertise (Flutter, React Native, or native), and interview the lead engineer. Check backend ownership, security practices, observability, and post-launch SLAs. Score at least three firms on the same seven criteria before signing.',
      },
      {
        question:
          'Is IT staff augmentation cheaper than hiring full-time developers?',
        answer:
          'Augmentation avoids recruiting fees and long notice periods, but hourly rates can exceed salary on an annualized basis if engagements run multi-year. It is usually cheaper than a bad full-time hire made under pressure, and faster for 3–12 month surges. Compare fully loaded employee cost vs. vendor seat rate for your geography.',
      },
      {
        question:
          'What does a typical custom web application development project timeline look like?',
        answer:
          'Discovery and UX often take 2–4 weeks. MVPs with 4–6 engineers frequently ship in 12–24 weeks, while enterprise programs with compliance and migrations run two quarters or more. Timelines slip when integrations are underestimated—validate APIs early in sprint zero.',
      },
      {
        question:
          'Why do US companies outsource to offshore software development companies?',
        answer:
          'US teams outsource to access talent scale, lower blended rates, and round-the-clock progress when handoffs are disciplined. Success requires strong product ownership onshore, clear architecture, IP clauses, and overlapping hours for critical ceremonies. Hybrid US lead plus offshore delivery is the most common stable pattern.',
      },
    ],
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}
