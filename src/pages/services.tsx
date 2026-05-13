"use client";

import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Breadcrumbs, type BreadcrumbTrailItem } from "../components/Breadcrumbs";
import { OnPageSeoSection } from "../components/OnPageSeoSection";
import { Seo, SITE_ORIGIN } from "../components/Seo";
import {
  SITE_TESTIMONIALS,
  buildOrganizationReviewProperties,
} from "../data/testimonials";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Service {
  num: string;
  icon: string;
  title: string;
  desc: string;
  tags: string[];
  href: string;
}

interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

interface WhyCard {
  icon: string;
  bg: string;
  title: string;
  desc: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SERVICES: Service[] = [
  {
    num: "01", icon: "💻", title: "Web Development",
    desc: "Fast, responsive, conversion-optimized websites built with clean code. Custom themes, landing pages, and full multi-page sites tailored to your brand.",
    tags: ["UI/UX", "HTML/CSS", "JavaScript"],
    href: "/services/web-development",
  },
  {
    num: "02", icon: "🔍", title: "SEO Optimization",
    desc: "Rank higher on Google with proven on-page and technical SEO strategies. Keyword research, speed optimization, and structured data — all included.",
    tags: ["On-Page", "Technical", "Local SEO"],
    href: "/services/seo-optimization",
  },
  {
    num: "03", icon: "📲", title: "App Development",
    desc: "Custom mobile apps for iOS and Android. From simple tools to fully featured platforms — built with performance and user experience at the core.",
    tags: ["iOS", "Android", "React Native"],
    href: "/services/app-development",
  },
  {
    num: "04", icon: "🛒", title: "WordPress & Shopify",
    desc: "Stores that look great and convert visitors into buyers. Full setup — theme, plugins, payment gateways, product pages, and ongoing support included.",
    tags: ["WordPress", "Shopify", "WooCommerce"],
    href: "/services/wordpress-shopify",
  },
  {
    num: "05", icon: "🎬", title: "Video Editing",
    desc: "Reels, ads, YouTube videos, and short-form clips that stop the scroll. Professional cuts, captions, transitions, and brand-consistent visuals.",
    tags: ["Reels", "Ads", "YouTube"],
    href: "/services/video-editing",
  },
  {
    num: "06", icon: "📱", title: "Social Media Marketing",
    desc: "Done-for-you monthly content strategy and posting across all platforms. Graphics, captions, scheduling, and analytics — we handle it all.",
    tags: ["Instagram", "Facebook", "LinkedIn"],
    href: "/services/social-media-marketing",
  },
  {
    num: "07", icon: "✍️", title: "Content Marketing",
    desc: "Strategic blogs, web copy, and long-form content that attracts traffic and converts readers into leads. SEO-optimized writing for every industry.",
    tags: ["Blogs", "Copywriting", "Web Copy"],
    href: "/services/content-marketing",
  },
  {
    num: "08", icon: "🎯", title: "PPC Advertising",
    desc: "High-converting paid campaigns on Google and Meta. Precise targeting, compelling ad copy, and constant A/B testing to maximise your ROI.",
    tags: ["Google Ads", "Meta Ads", "Retargeting"],
    href: "/services/ppc-advertising",
  },
  {
    num: "09", icon: "📧", title: "Email Marketing",
    desc: "Automated email sequences that nurture leads and drive repeat sales. Welcome flows, drip campaigns, newsletters, and list management all handled.",
    tags: ["Automation", "Campaigns", "Klaviyo"],
    href: "/services/email-marketing",
  },
  {
    num: "10", icon: "🎨", title: "Branding & Design",
    desc: "Logos, brand kits, colour palettes, and complete visual identity systems that leave a lasting impression and build brand trust from first glance.",
    tags: ["Logo", "Brand Kit", "UI Design"],
    href: "/services/branding-design",
  },
];

/** Slug segments for `/services/{slug}` routes and legacy redirects */
export const SERVICE_SLUGS: string[] = SERVICES.map((s) =>
  s.href.replace(/^\/services\//, ""),
);

const SERVICE_SLUG_SET = new Set(SERVICE_SLUGS);

function absoluteUrl(pathFromRoot: string): string {
  return `${SITE_ORIGIN}${pathFromRoot}`;
}

const SERVICES_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": SERVICES.map((svc) => ({
    "@type": "Service",
    serviceType: svc.title,
    provider: {
      "@type": "Organization",
      name: "RathiSoft",
      url: SITE_ORIGIN,
    },
    areaServed: {
      "@type": "Country",
      name: "Pakistan",
    },
    description: svc.desc,
    url: absoluteUrl(svc.href),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
    },
  })),
};

const PROCESS: ProcessStep[] = [
  { step: "Step 01", title: "Discovery Call", desc: "We start with a free consultation to understand your goals, business, target audience, and timeline. No commitment required — just a conversation." },
  { step: "Step 02", title: "Proposal & Plan", desc: "You receive a clear, itemised proposal with timeline, deliverables, and fixed pricing — no hidden fees, no vague estimates. NDA signed on request." },
  { step: "Step 03", title: "Design & Build", desc: "Work begins immediately. You get regular updates, preview links, and direct WhatsApp access throughout the entire build process." },
  { step: "Step 04", title: "Review & Revise", desc: "You review the work and share feedback. We refine until you're fully satisfied — revisions are included, no nickel-and-diming for small changes." },
  { step: "Step 05", title: "Launch", desc: "Final delivery, domain setup, hosting configuration, and go-live. Your site is tested across devices and browsers before anything goes public." },
  { step: "Step 06", title: "Post-Launch Support", desc: "Every project includes free post-launch support. We don't disappear after delivery — we're available for fixes, updates, and questions." },
];

const WHY_CARDS: WhyCard[] = [
  { icon: "🛠️", bg: "rgba(99,102,241,0.08)",  title: "Custom-Built, Every Time", desc: "No templates forced on your project. Every solution is built from scratch around your specific needs, brand, and audience." },
  { icon: "⚡", bg: "rgba(245,158,11,0.08)",   title: "Fast Delivery",            desc: "On-time across every project — no delays, no excuses. Your deadline is our deadline, and we take that seriously every time." },
  { icon: "🌍", bg: "rgba(16,185,129,0.08)",   title: "Global Clients",           desc: "Clients across UK, US, Australia, Europe, and UAE — all served remotely with zero friction and zero time-zone issues." },
  { icon: "🔒", bg: "rgba(79,70,229,0.08)",    title: "NDA-Ready",                desc: "Your project, ideas, and code stay completely private. NDAs signed on request before any work begins — no questions asked." },
  { icon: "💬", bg: "rgba(37,211,102,0.08)",   title: "24hr Response",            desc: "Always reachable via WhatsApp or email. You'll never be left waiting days for a reply — we respond fast and communicate clearly." },
  { icon: "📊", bg: "rgba(244,63,94,0.08)",    title: "Results-Focused",          desc: "We don't just build pretty websites — we build things that bring in business. Every decision is made with your ROI in mind." },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  :root {
    --bg:     #13131a;
    --bg2:    #1c1c27;
    --bg3:    #22222f;
    --card:   #1e1e2d;
    --indigo: #6366f1;
    --indigo2:#818cf8;
    --indigo3:#4f46e5;
    --iglow:  rgba(99,102,241,0.18);
    --isoft:  rgba(99,102,241,0.08);
    --border: rgba(255,255,255,0.07);
    --border2:rgba(99,102,241,0.3);
    --gold:   #f59e0b;
    --fh: 'Bricolage Grotesque', sans-serif;
    --fb: 'Inter', sans-serif;
    --r2: 18px;
    --r3: 24px;
    --sh2: 0 8px 40px rgba(0,0,0,0.35);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--fb); background: var(--bg); color: #fff; -webkit-font-smoothing: antialiased; }
  a { text-decoration: none; }

  .rs-wrap { max-width: 1180px; margin: 0 auto; padding: 0 52px; }

  .rs-label {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 10px; font-weight: 600; letter-spacing: 3px;
    text-transform: uppercase; color: var(--indigo2); margin-bottom: 14px;
  }
  .rs-label::before {
    content: ''; width: 28px; height: 1px;
    background: linear-gradient(90deg, var(--indigo), transparent);
  }

  /* HERO */
  .rs-hero {
    padding: 80px 0 64px; border-bottom: 1px solid var(--border);
    background: linear-gradient(135deg, var(--bg), var(--bg2));
    position: relative; overflow: hidden;
  }
  .rs-hero::before {
    content: ''; position: absolute; top: -120px; right: -80px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%);
    pointer-events: none;
  }
  .rs-hero::after {
    content: ''; position: absolute; bottom: -80px; left: 10%;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%);
    pointer-events: none;
  }
  .rs-hero .rs-wrap { position: relative; z-index: 1; }
  .rs-hero h1 {
    font-family: var(--fh); font-size: clamp(44px, 5.5vw, 76px);
    font-weight: 700; line-height: 1.05; letter-spacing: -2px; color: #fff;
  }
  .rs-hero h1 span { color: var(--indigo2); }
  .rs-hero > .rs-wrap > p {
    font-size: 16px; margin-top: 14px; max-width: 540px;
    color: rgba(255,255,255,0.8); font-weight: 300; line-height: 1.85;
  }

  .hero-stats {
    display: flex; gap: 40px; flex-wrap: wrap;
    margin-top: 40px; padding-top: 36px;
    border-top: 1px solid var(--border);
  }
  .hs { display: flex; flex-direction: column; gap: 4px; }
  .hs-num { font-family: var(--fh); font-size: 28px; font-weight: 700; color: var(--indigo2); }
  .hs-label { font-size: 11px; color: rgba(255,255,255,0.5); letter-spacing: 1px; text-transform: uppercase; }

  /* SERVICES SECTION */
  .svc-section { padding: 72px 0; }
  .svc-intro { margin-bottom: 52px; }
  .svc-intro h2 {
    font-family: var(--fh); font-size: clamp(26px, 3vw, 40px);
    font-weight: 600; color: #fff; letter-spacing: -0.5px;
  }
  .svc-intro p { margin-top: 14px; max-width: 500px; color: rgba(255,255,255,0.7); font-weight: 300; line-height: 1.85; }

  .svc-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .svc-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r3); padding: 32px 28px;
    transition: all 0.3s; position: relative; overflow: hidden;
    cursor: pointer; display: block; color: inherit; text-decoration: none;
    scroll-margin-top: 96px;
  }
  .svc-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(99,102,241,0.04), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .svc-card:hover { border-color: var(--border2); transform: translateY(-6px); box-shadow: var(--sh2); }
  .svc-card:hover::before { opacity: 1; }

  .svc-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
  .svc-icon-wrap {
    width: 54px; height: 54px; border-radius: 14px;
    background: var(--isoft); border: 1px solid rgba(99,102,241,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; transition: all 0.3s;
  }
  .svc-card:hover .svc-icon-wrap { background: rgba(99,102,241,0.14); border-color: var(--border2); transform: scale(1.05); }
  .svc-num { font-family: var(--fh); font-size: 13px; font-weight: 700; color: rgba(99,102,241,0.35); letter-spacing: 1px; }
  .svc-card h3 { font-family: var(--fh); font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 10px; line-height: 1.3; }
  .svc-card p { font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.75; margin-bottom: 18px; font-weight: 300; }

  .svc-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
  .svc-tag {
    font-size: 10px; font-weight: 600; letter-spacing: 1px;
    text-transform: uppercase; padding: 4px 10px; border-radius: 100px;
    border: 1px solid rgba(99,102,241,0.2); background: var(--isoft); color: var(--indigo2);
  }
  .svc-link { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: var(--indigo2); transition: gap 0.2s; }
  .svc-card:hover .svc-link { gap: 10px; }

  /* PROCESS SECTION */
  .process-section {
    padding: 72px 0;
    background: var(--bg2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .process-section h2 { font-family: var(--fh); font-size: clamp(26px, 3vw, 40px); font-weight: 600; color: #fff; letter-spacing: -0.5px; }
  .process-section > .rs-wrap > p { margin-top: 14px; max-width: 480px; color: rgba(255,255,255,0.7); font-weight: 300; line-height: 1.85; }
  .process-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; }
  .proc-card {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--r2); padding: 28px 24px; transition: border-color 0.25s;
  }
  .proc-card:hover { border-color: var(--border2); }
  .proc-step { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--indigo2); margin-bottom: 12px; }
  .proc-card h3 { font-family: var(--fh); font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 8px; }
  .proc-card p { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.7; font-weight: 300; }

  /* WHY SECTION */
  .why-section { padding: 72px 0; }
  .why-section h2 { font-family: var(--fh); font-size: clamp(26px, 3vw, 40px); font-weight: 600; color: #fff; letter-spacing: -0.5px; }
  .why-section > .rs-wrap > p { margin-top: 14px; max-width: 480px; color: rgba(255,255,255,0.7); font-weight: 300; line-height: 1.85; }
  .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 48px; }
  .why-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r2); padding: 26px 22px; transition: all 0.25s;
  }
  .why-card:hover { border-color: var(--border2); transform: translateY(-3px); box-shadow: var(--sh2); }
  .why-icon {
    width: 44px; height: 44px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 14px;
  }
  .why-card h3 { font-family: var(--fh); font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 8px; }
  .why-card p { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.7; font-weight: 300; }

  /* TESTIMONIALS */
  .svc-testimonials { padding: 72px 0; border-top: 1px solid var(--border); background: linear-gradient(180deg, var(--bg), var(--bg2)); }
  .svc-testimonials #svc-testimonials-heading {
    font-family: var(--fh); font-size: clamp(26px, 3vw, 40px); font-weight: 600; color: #fff;
    letter-spacing: -0.5px; margin-top: 14px;
  }
  .svc-testimonials-lead { margin-top: 14px; max-width: 520px; color: rgba(255,255,255,0.7); font-weight: 300; line-height: 1.85; font-size: 15px; }
  .svc-testimonials-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 40px;
  }
  .svc-testimonial-card {
    margin: 0; padding: 22px 20px; background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r2); display: flex; flex-direction: column; gap: 12px;
  }
  .svc-t-stars { font-size: 13px; letter-spacing: 2px; color: var(--gold); }
  .svc-t-quote { font-size: 13px; color: rgba(255,255,255,0.72); line-height: 1.75; font-weight: 300; flex: 1; margin: 0; }
  .svc-testimonial-card footer {
    display: flex; align-items: center; gap: 12px; padding-top: 8px;
    border-top: 1px solid var(--border); margin-top: auto;
  }
  .svc-t-av {
    width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
    background: var(--isoft); border: 1px solid rgba(99,102,241,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: var(--indigo2);
  }
  .svc-t-name { font-style: normal; font-family: var(--fh); font-size: 13px; font-weight: 600; color: #fff; display: block; }
  .svc-t-role { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 2px; }

  /* CTA SECTION */
  .cta-section {
    padding: 80px 52px; background: var(--bg2);
    border-top: 1px solid var(--border); text-align: center;
  }
  .cta-section h2 { font-family: var(--fh); font-size: clamp(26px, 3vw, 40px); font-weight: 600; color: #fff; letter-spacing: -0.5px; margin-bottom: 14px; }
  .cta-section p { color: rgba(255,255,255,0.65); font-size: 15px; max-width: 480px; margin: 0 auto 36px; line-height: 1.85; font-weight: 300; }
  .cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .btn-p {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--indigo); color: #fff; padding: 14px 28px;
    border-radius: 10px; font-size: 13px; font-weight: 500;
    transition: all 0.25s; box-shadow: 0 4px 20px var(--iglow); text-decoration: none;
  }
  .btn-p:hover { background: var(--indigo3); transform: translateY(-2px); }
  .btn-g {
    display: inline-flex; align-items: center; gap: 8px;
    background: #25d366; color: #fff; padding: 14px 24px;
    border-radius: 10px; font-size: 13px; font-weight: 500;
    transition: all 0.25s; text-decoration: none;
  }
  .btn-g:hover { background: #20bf5d; transform: translateY(-2px); }

  /* WHATSAPP FLOAT */
  .wa-float {
    position: fixed; bottom: 28px; right: 28px; z-index: 9999;
    width: 58px; height: 58px; border-radius: 50%;
    background: #25d366; display: flex; align-items: center; justify-content: center;
    text-decoration: none; box-shadow: 0 4px 20px rgba(37,211,102,0.4);
    transition: all 0.25s;
    animation: wafloatPopIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) 1.5s both;
  }
  .wa-float:hover { transform: scale(1.1) translateY(-2px); box-shadow: 0 8px 32px rgba(37,211,102,0.5); }
  .wa-float::before {
    content: ''; position: absolute; inset: 0; border-radius: 50%;
    background: #25d366; z-index: -1;
    animation: waRingAnim 2.5s ease-out 3s infinite;
  }
  @keyframes waRingAnim { 0% { transform: scale(1); opacity: .5; } 100% { transform: scale(1.8); opacity: 0; } }
  @keyframes wafloatPopIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }

  /* RESPONSIVE */
  @media (max-width: 960px) {
    .rs-wrap { padding: 0 20px; }
    .rs-hero { padding: 60px 0 48px; }
    .svc-section { padding: 48px 0; }
    .svc-grid { grid-template-columns: 1fr 1fr; }
    .process-section { padding: 48px 0; }
    .process-grid { grid-template-columns: 1fr; }
    .why-section { padding: 48px 0; }
    .why-grid { grid-template-columns: 1fr 1fr; }
    .svc-testimonials { padding: 48px 0; }
    .svc-testimonials-grid { grid-template-columns: 1fr; }
    .cta-section { padding: 52px 20px; }
    .hero-stats { gap: 24px; flex-wrap: nowrap; }
    .hs { flex: 1; min-width: 0; }
    .hs-num { font-size: 20px; }
    .hs-label { font-size: 9px; }
  }
  @media (max-width: 600px) {
    .svc-grid { grid-template-columns: 1fr; }
    .why-grid { grid-template-columns: 1fr; }
    .svc-card { padding: 24px 20px; }
    .process-grid { grid-template-columns: 1fr; }
  }
`;

// ─── WhatsApp SVG icon ────────────────────────────────────────────────────────
function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="28" height="28" fill="white">
      <path d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 10L4 44l10.3-2.7C17.1 43 20.5 44 24 44c11 0 20-9 20-20S35 4 24 4zm0 36c-3.1 0-6.1-.8-8.7-2.4l-.6-.4-6.1 1.6 1.6-5.9-.4-.6C8.8 30.1 8 27.1 8 24 8 15.2 15.2 8 24 8s16 7.2 16 16-7.2 16-16 16zm8.8-11.8c-.5-.2-2.8-1.4-3.2-1.5-.4-.2-.7-.2-1 .2-.3.5-1.2 1.5-1.5 1.9-.3.3-.5.4-1 .1-.5-.2-2-.7-3.8-2.3-1.4-1.2-2.3-2.8-2.6-3.2-.3-.5 0-.7.2-1 .2-.2.5-.5.7-.8.2-.3.3-.5.4-.8.2-.3 0-.6-.1-.8-.1-.2-1-2.5-1.4-3.4-.4-.9-.7-.8-1-.8h-.9c-.3 0-.8.1-1.2.6-.4.5-1.6 1.6-1.6 3.8s1.7 4.4 1.9 4.7c.2.3 3.3 5.1 8 7.1 1.1.5 2 .8 2.7 1 1.1.3 2.2.3 3 .2.9-.1 2.8-1.1 3.2-2.2.4-1.1.4-2 .3-2.2-.2-.3-.5-.4-1-.6z" />
    </svg>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function ServicesPage() {
  const { slug } = useParams<{ slug?: string }>();
  const slugNorm = slug?.toLowerCase();

  useEffect(() => {
    if (!slugNorm || !SERVICE_SLUG_SET.has(slugNorm)) return;
    const id = `service-${slugNorm}`;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => window.clearTimeout(t);
  }, [slugNorm]);

  if (slugNorm && !SERVICE_SLUG_SET.has(slugNorm)) {
    return <Navigate to="/services" replace />;
  }

  const breadcrumbItems: BreadcrumbTrailItem[] =
    slugNorm && SERVICE_SLUG_SET.has(slugNorm)
      ? (() => {
          const svc = SERVICES.find((s) => s.href === `/services/${slugNorm}`);
          return [
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            {
              name: svc?.title ?? "Service",
              path: `/services/${slugNorm}`,
            },
          ];
        })()
      : [
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ];

  const reviewsLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RathiSoft",
    url: SITE_ORIGIN,
    ...buildOrganizationReviewProperties(SITE_TESTIMONIALS),
  };

  return (
    <>
      <Seo
        title="Web Development & Digital Marketing Services in Lahore | RathiSoft"
        description="Explore RathiSoft's full range of services: WordPress development, Shopify development, SEO, web design, and digital marketing. Based in Lahore, serving clients globally."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsLd) }}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <style>{styles}</style>

      {/* ── HERO ── */}
      <div className="rs-hero">
        <div className="rs-wrap">
          <div className="rs-label">What We Do</div>
          <h1>
            10 services.<br />
            <span>One team.</span>
          </h1>
          <p>
            RathiSoft is a software agency in Lahore that bundles discovery, UX design, full-stack
            engineering, analytics instrumentation, and always-on optimisation for founders who want one
            accountable partner—from polished WordPress and Shopify storefronts to multilingual SaaS and AI-assisted workflows trusted worldwide.
          </p>
          <div className="hero-stats">
            <div className="hs"><span className="hs-num">10+</span><span className="hs-label">Services Offered</span></div>
            <div className="hs"><span className="hs-num">59+</span><span className="hs-label">Projects Delivered</span></div>
            <div className="hs"><span className="hs-num">5+</span><span className="hs-label">Years Experience</span></div>
            <div className="hs"><span className="hs-num">4.8★</span><span className="hs-label">Client Rating</span></div>
          </div>
        </div>
      </div>

      {/* ── ALL SERVICES ── */}
      <section className="svc-section">
        <div className="rs-wrap">
          <div className="svc-intro">
            <div className="rs-label">Our Services</div>
            <h2 className="svc-intro">
              Everything your<br />business needs online.
            </h2>
            <p>Click any service to see detailed information, process, and past work — all under one roof.</p>
          </div>

          <div className="svc-grid">
            {SERVICES.map((svc) => {
              const cardSlug = svc.href.replace(/^\/services\//, "");
              return (
                <Link
                  key={svc.num}
                  id={`service-${cardSlug}`}
                  className="svc-card"
                  to={svc.href}
                >
                  <div className="svc-card-top">
                    <div className="svc-icon-wrap">{svc.icon}</div>
                    <span className="svc-num">{svc.num}</span>
                  </div>
                  <h3>{svc.title}</h3>
                  <p>{svc.desc}</p>
                  <div className="svc-tags">
                    {svc.tags.map((t) => (
                      <span key={t} className="svc-tag">{t}</span>
                    ))}
                  </div>
                  <span className="svc-link">View service details →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── OUR PROCESS ── */}
      <section className="process-section">
        <div className="rs-wrap">
          <div className="rs-label">How We Work</div>
          <h2>Simple process.<br />Consistent results.</h2>
          <p>Every project follows a clear, proven workflow — so you always know what's happening next.</p>

          <div className="process-grid">
            {PROCESS.map((p) => (
              <div key={p.step} className="proc-card">
                <div className="proc-step">{p.step}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY RATHISOFT ── */}
      <section className="why-section">
        <div className="rs-wrap">
          <div className="rs-label">Why Choose Us</div>
          <h2>Built on proof,<br />not promises.</h2>
          <p>Every claim is backed by real client work, clean code, and 5+ years of consistent delivery.</p>

          <div className="why-grid">
            {WHY_CARDS.map((w) => (
              <div key={w.title} className="why-card">
                <div className="why-icon" style={{ background: w.bg }}>{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-testimonials" aria-labelledby="svc-testimonials-heading">
        <div className="rs-wrap">
          <div className="rs-label">Reviews</div>
          <h2 id="svc-testimonials-heading">What clients say</h2>
          <p className="svc-testimonials-lead">
            Verified feedback from engagements worldwide — aligned with the testimonials on our homepage.
          </p>
          <div className="svc-testimonials-grid">
            {SITE_TESTIMONIALS.map((t) => (
              <blockquote key={`${t.initials}-${t.name}`} className="svc-testimonial-card">
                <div className="svc-t-stars" aria-hidden>
                  {t.stars}
                </div>
                <p className="svc-t-quote">{t.quote}</p>
                <footer>
                  <span className="svc-t-av" aria-hidden>
                    {t.initials}
                  </span>
                  <div>
                    <cite className="svc-t-name">{t.name}</cite>
                    <div className="svc-t-role">{t.role}</div>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <OnPageSeoSection
        sectionId="services-on-page-seo"
        heading={`How RathiSoft's Lahore software teams scope engagements end-to-end`}
        lead={
          <>
            <p>
              Choosing a software agency in Lahore is rarely about hourly spreadsheets—it is about
              assembling architects who translate fuzzy objectives into measurable KPIs. RathiSoft&apos;s pods combine technical SEO engineers,
              paid-media analysts, motion editors, and product-minded developers who rehearse risks early instead of discovering blockers after invoices pile up.
            </p>
            <p>
              Our Lahore delivery hub stays timezone-friendly for Pakistan and Gulf brands while matching UK and North American cadences through overlap windows,
              shared Notion roadmaps, and recorded walkthroughs. Every statement of work enumerates environments, QA cycles, regression expectations, and what &quot;done&quot;
              means for marketing automation, ERP touches, or custom storefront logic—eliminating surprise phases that derail boutique engagements.
            </p>
          </>
        }
        links={[
          { to: "/about", label: "Understand our mission-led Lahore software culture" },
          { to: "/work", label: "Inspect verified Lahore-led deliveries across industries" },
          { to: "/packages", label: "Compare sprint-ready pricing bundles before contracting" },
          { to: "/contact", label: "Schedule a roadmap workshop with senior practitioners" },
        ]}
      >
        <p>
          Keyword stuffing fails audiences faster than outdated frameworks, so we weave latent semantic themes—progressive enhancement,
          structured snippets for FAQs and articles, accessibility conformance (WCAG-minded QA), fraud-conscious Shopify integrations,
          consent-aware tagging stacks—directly into build specifications. That discipline keeps editorial, engineering, and media teams aligned when leadership asks for attribution clarity.
        </p>
        <p>
          Retainers inherit versioned dependency policies, uptime expectations for commerce workloads, and change-management etiquette every stakeholder signs during onboarding.
          That mirrors recommendations surfaced publicly inside authoritative guides such as Google’s Starter Guide and web.dev’s performance canon cited below—proof points stakeholders recognise instantly during procurement reviews.
        </p>
        <p>
          Whether you need Laravel tooling beside Shopify Hydrogen experiments or multilingual brochure sites synced with CRM schemas,
          ask how prospective vendors differentiate experimentation lanes from production governance—the gap reveals mature Lahore software agencies from staffing brokers peddling resumes alone.
        </p>
      </OnPageSeoSection>

      {/* ── CTA ── */}
      <div className="cta-section">
        <h2>Ready to start<br />your project?</h2>
        <p>Get a free consultation — no commitment. We'll discuss your goals and recommend the right services for your business.</p>
        <div className="cta-btns">
          <Link to="/contact" className="btn-p">Get a free quote →</Link>
          <a href="https://wa.me/923342651544" target="_blank" rel="noopener noreferrer" className="btn-g">
            💬 WhatsApp us now
          </a>
        </div>
      </div>

      {/* ── WHATSAPP FLOAT ── */}
      <a
        href="https://wa.me/923342651544"
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </>
  );
}