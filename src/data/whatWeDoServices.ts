import { BLOG_POSTS } from './blogPosts'
import { ROUTES, blogPath, servicePath } from '../utils/routes'

export type WhatWeDoService = {
  title: string
  desc: string
  tags: readonly string[]
  img: string
  href: string
}

/** Core services shown in the “What We Do” band (aligned with homepage). */
export const WHAT_WE_DO_SERVICES: WhatWeDoService[] = [
  {
    title: 'Web Development',
    desc: 'Fast, responsive sites built to turn visitors into leads.',
    tags: ['UI/UX', 'React'],
    img: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&h=500&fit=crop&fm=webp&q=75',
    href: servicePath('web-development'),
  },
  {
    title: 'SEO Optimization',
    desc: 'Technical and on-page SEO so the right customers find you on Google.',
    tags: ['On-Page', 'Technical'],
    img: 'https://images.unsplash.com/photo-1686061594225-3e92c0cd51b0?w=800&h=500&fit=crop&fm=webp&q=75',
    href: servicePath('seo-services'),
  },
  {
    title: 'App Development',
    desc: 'Custom mobile apps for iOS and Android that feel fast and reliable.',
    tags: ['iOS', 'Android'],
    img: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&h=500&fit=crop&fm=webp&q=75',
    href: servicePath('app-development'),
  },
  {
    title: 'Video Editing',
    desc: 'Reels, ads, and short clips edited for attention and clarity.',
    tags: ['Reels', 'Ads'],
    img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=500&fit=crop&fm=webp&q=75',
    href: servicePath('video-editing'),
  },
  {
    title: 'WordPress & Shopify',
    desc: 'Commerce stores that look sharp and guide buyers to checkout.',
    tags: ['WordPress', 'Shopify'],
    img: 'https://images.unsplash.com/photo-1560472354-0088b5dc9d8d?w=800&h=500&fit=crop&fm=webp&q=75',
    href: servicePath('wordpress-shopify'),
  },
  {
    title: 'Social Media Marketing',
    desc: 'Monthly content and posting so your brand stays visible.',
    tags: ['Instagram', 'Facebook'],
    img: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=500&fit=crop&fm=webp&q=75',
    href: servicePath('social-media-marketing'),
  },
  {
    title: 'Content Marketing',
    desc: 'Blogs and copy that bring traffic and support sales.',
    tags: ['Blogs', 'Copywriting'],
    img: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=800&h=500&fit=crop&fm=webp&q=75',
    href: servicePath('content-marketing'),
  },
  {
    title: 'Email Marketing',
    desc: 'Automations and newsletters that nurture leads into repeat buyers.',
    tags: ['Automation', 'Newsletters'],
    img: 'https://images.unsplash.com/photo-1557201102-c2f870e84e2e?w=800&h=500&fit=crop&fm=webp&q=75',
    href: servicePath('email-marketing'),
  },
  {
    title: 'PPC Advertising',
    desc: 'Paid search and social campaigns tuned for measurable ROI.',
    tags: ['Google Ads', 'Meta Ads'],
    img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=500&fit=crop&fm=webp&q=75',
    href: servicePath('ppc-advertising'),
  },
  {
    title: 'Branding and UI/UX Design',
    desc: 'Logos, layouts, and brand systems that look credible on every screen.',
    tags: ['UI/UX', 'Brand Kit'],
    img: 'https://images.unsplash.com/photo-1770010735791-f7c377534c1c?w=800&h=500&fit=crop&fm=webp&q=75',
    href: servicePath('branding-design'),
  },
]

export const WHAT_WE_DO_ALL_SERVICES_HREF = ROUTES.services

export const WHAT_WE_DO_FEATURED_BLOG =
  BLOG_POSTS[0] != null
    ? { href: blogPath(BLOG_POSTS[0].slug), label: BLOG_POSTS[0].h1 }
    : null
