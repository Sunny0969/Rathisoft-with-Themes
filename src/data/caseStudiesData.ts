export type CaseStudy = {
  id: string
  category: string
  categoryTone: 'purple' | 'teal' | 'orange' | 'rose' | 'sage'
  title: string
  client: string
  duration: string
  href: string
  image: string
  imageFallback?: string
  cardBg: string
  cardLabel: string
  challenge: string
  deliverables: string[]
  tech: string[]
  imageFirst: boolean
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'karvaan',
    category: 'Travel & Tours',
    categoryTone: 'teal',
    title: 'Karvaan Tours',
    client: 'Karvaan Tours',
    duration: '4 months',
    href: 'https://www.karvaantours.com/',
    image: '/images/karvaantours.webp',
    imageFallback:
      'https://api.microlink.io/?url=https://www.karvaantours.com/&screenshot=true&meta=false&embed=screenshot.url',
    cardBg: 'linear-gradient(145deg, #0f4c5c 0%, #1a6b7a 55%, #2d8f9e 100%)',
    cardLabel: 'Karvaan Tours',
    challenge:
      'Planning a trip to Japan should feel exciting—not overwhelming. Karvaan needed a site that could showcase custom itineraries, build trust with international travelers, and turn curiosity into real enquiries without burying people in dense copy.',
    deliverables: [
      'Tour and itinerary pages structured so seasons, routes, and inclusions are easy to compare',
      'Mobile-first layouts for travelers researching on the go before they message sales',
      'Clear contact and policy paths so compliance and booking questions feel straightforward',
      'SEO-friendly architecture for destination content and long-tail travel searches',
    ],
    tech: ['Custom Web', 'WordPress', 'SEO', 'Mobile UX'],
    imageFirst: true,
  },
  {
    id: 'tripsadora',
    category: 'Travel Platform',
    categoryTone: 'purple',
    title: 'TripsAdora',
    client: 'TripsAdora',
    duration: '5 months',
    href: 'https://tripsadora.com/',
    image: '/images/TripsAdora.webp',
    imageFallback:
      'https://api.microlink.io/?url=https://tripsadora.com/&screenshot=true&meta=false&embed=screenshot.url',
    cardBg: 'linear-gradient(145deg, #312e81 0%, #4f46e5 50%, #6366f1 100%)',
    cardLabel: 'TripsAdora',
    challenge:
      'TripsAdora set out to bring travel discovery and booking-style flows into one unified experience. The product had to feel polished on first load, guide users through layered trip choices, and stay responsive as listings and partner content grew.',
    deliverables: [
      'Unified platform experience with consistent navigation across travel modules',
      'Performance-minded front end so first paint stays quick on everyday mobile networks',
      'Scalable page structure for destinations, offers, and partner-led content',
      'Reusable UI patterns the team can extend without breaking layout or brand tone',
    ],
    tech: ['React', 'Node.js', 'Figma', 'API Integration'],
    imageFirst: false,
  },
  {
    id: 'pickpackpro',
    category: 'Logistics & eCommerce',
    categoryTone: 'orange',
    title: 'Pick Pack Pro',
    client: 'Pick Pack Pro',
    duration: '6 months',
    href: 'https://www.pickpackpro.co.uk/',
    image:
      'https://api.microlink.io/?url=https://www.pickpackpro.co.uk/&screenshot=true&meta=false&embed=screenshot.url',
    imageFallback: '/images/karvaantours.webp',
    cardBg: 'linear-gradient(145deg, #9a3412 0%, #ea580c 45%, #fb923c 100%)',
    cardLabel: 'Pick Pack Pro',
    challenge:
      'Pick Pack Pro helps Amazon, Shopify, and TikTok sellers scale with UK fulfilment—but the old site made a complex service sound harder than it is. Sellers needed to see integrations, accuracy, and onboarding steps before they would request a quote.',
    deliverables: [
      'Service pages that explain FBA prep, multi-channel fulfilment, and Milton Keynes warehousing in plain English',
      'Trust metrics surfaced up front—picking accuracy, integrations, and same-day dispatch claims',
      'Quote and contact flows tuned for high-intent seller leads, not generic form spam',
      'Crawlable structure supporting UK fulfilment and marketplace-integration search terms',
    ],
    tech: ['WordPress', 'Custom Web', 'SEO', 'Lead Forms'],
    imageFirst: true,
  },
  {
    id: 'smithhonig',
    category: 'Luxury eCommerce',
    categoryTone: 'rose',
    title: 'SmithHönig',
    client: 'SmithHönig',
    duration: '3 months',
    href: 'https://smithhonig.com/',
    image:
      'https://api.microlink.io/?url=https://smithhonig.com/&screenshot=true&meta=false&embed=screenshot.url',
    cardBg: 'linear-gradient(145deg, #831843 0%, #be185d 50%, #f472b6 100%)',
    cardLabel: 'SmithHönig',
    challenge:
      'SmithHönig sells original interiors—peel-and-stick wallpaper, designer pillows, rugs—not mass-market décor. The Shopify experience had to feel editorial and bold, handle made-to-order variants cleanly, and keep checkout from killing the inspiration.',
    deliverables: [
      'Shopify storefront aligned with seasonal campaigns and signature pattern collections',
      'Product templates that support size variants, cover-only options, and sample ordering without confusion',
      'Trusted checkout stack (Shop Pay, PayPal, cards) with merchandising that nudges discovery',
      'Content blocks for reviews, new arrivals, and wallpaper-plus-paint pairing stories',
    ],
    tech: ['Shopify', 'Liquid', 'UI/UX', 'CRO'],
    imageFirst: false,
  },
  {
    id: 'shopnudra',
    category: 'Organic Lifestyle',
    categoryTone: 'sage',
    title: 'Shop Nudra',
    client: 'Nudra',
    duration: '3 months',
    href: 'https://shopnudra.com/',
    image:
      'https://api.microlink.io/?url=https://shopnudra.com/&screenshot=true&meta=false&embed=screenshot.url',
    cardBg: 'linear-gradient(145deg, #14532d 0%, #15803d 50%, #4ade80 100%)',
    cardLabel: 'Nudra',
    challenge:
      "Nudra brings organic luxury home textiles—towels, kids' robes, silk sleep masks—to buyers who care about comfort and skin-safe materials. The store had to feel premium on mobile, show promos honestly, and make Lahore-based support easy to find.",
    deliverables: [
      'Shopify experience highlighting weave collections, Eid specials, and new arrivals with clear variant pickers',
      'Sale pricing and compare-at labels that stay readable without cheapening the brand',
      'Testimonials and “Nudra standard” trust copy placed where shoppers hesitate',
      'Local contact, delivery, and payment cues Pakistani customers expect at checkout',
    ],
    tech: ['Shopify', 'Liquid', 'Mobile Commerce', 'Brand UX'],
    imageFirst: true,
  },
]
