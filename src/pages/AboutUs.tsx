import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { InternalLinksNav } from '../components/InternalLinksNav'
import { ABOUT_INTERNAL_LINKS } from '../data/internalLinks'
import { JsonLd } from '../components/JsonLd'
import { Seo } from '../components/Seo'
import { buildAboutPageSchemaGraph } from '../data/schemaMarkup'
import { PAGE_SEO } from '../data/pageSeo'
import { ROUTES } from '../utils/routes'
import { logoAlt, teamMemberAlt } from '../utils/imageAssets'
import { TEAM_MEMBERS } from '../data/teamMembers'

/** All About page styles live in this file (no separate CSS module). Scoped under `.page-about`. */
const ABOUT_STYLES = `
.page-about {
  --bg: #13131a;
  --bg2: #1c1c27;
  --bg3: #22222f;
  --card: #1e1e2d;
  --indigo: #6366f1;
  --indigo2: #818cf8;
  --indigo3: #4f46e5;
  --iglow: rgba(99, 102, 241, 0.18);
  --isoft: rgba(99, 102, 241, 0.08);
  --border: rgba(255, 255, 255, 0.07);
  --border2: rgba(99, 102, 241, 0.3);
  --white: #fff;
  --gold: #f59e0b;
  --fh: 'Poppins', system-ui, sans-serif;
  --fb: 'Poppins', system-ui, sans-serif;
  --r2: 18px;
  --r3: 24px;
  --sh2: 0 8px 40px rgba(0, 0, 0, 0.35);
}
.page-about,
.page-about *,
.page-about *::before,
.page-about *::after {
  box-sizing: border-box;
}
.page-about h1 {
  font-family: var(--fh);
  font-size: clamp(44px, 5.5vw, 76px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -2px;
  color: var(--white);
  margin: 0;
}
.page-about h2 {
  font-family: var(--fh);
  font-size: clamp(26px, 3vw, 40px);
  font-weight: 600;
  color: var(--white);
  letter-spacing: -0.5px;
  margin: 0;
}
.page-about h3 {
  font-family: var(--fh);
  font-size: 18px;
  font-weight: 600;
  color: var(--white);
  margin: 0 0 14px;
}
.page-about p {
  line-height: 1.85;
  font-weight: 300;
  color: #ffffff;
  margin: 0;
}
.page-about a {
  text-decoration: none;
}
.page-about .wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 52px;
}
.page-about .label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--indigo2);
  margin-bottom: 14px;
}
.page-about .label::before {
  content: '';
  width: 28px;
  height: 1px;
  background: linear-gradient(90deg, var(--indigo), transparent);
}
.page-about .hero {
  padding: 80px 0 60px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, var(--bg), var(--bg2));
  position: relative;
  overflow: hidden;
}
.page-about .hero::before {
  content: '';
  position: absolute;
  top: -120px;
  left: -80px;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, transparent 65%);
  pointer-events: none;
}
.page-about .hero .wrap {
  position: relative;
  z-index: 1;
}
.page-about .hero p {
  font-size: 16px;
  margin-top: 12px;
  max-width: 520px;
}
.page-about .stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 52px 0 0;
}
.page-about .sc {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--r2);
  padding: 24px 18px;
  text-align: center;
  transition: all 0.25s;
  cursor: default;
}
.page-about .sc:hover {
  border-color: var(--border2);
  transform: translateY(-3px);
  box-shadow: var(--sh2);
}
.page-about .sc-n {
  font-family: var(--fh);
  font-size: 36px;
  font-weight: 700;
  color: var(--white);
  letter-spacing: -1.5px;
  line-height: 1;
}
.page-about .sc-n em {
  font-style: normal;
  color: var(--indigo2);
}
.page-about .sc-l {
  font-size: 11px;
  color: #ffffff;
  margin-top: 5px;
}
.page-about .about-layout {
  display: grid;
  grid-template-columns: 290px 1fr;
  gap: 60px;
  align-items: start;
  padding: 60px 0 80px;
}
.page-about .body-text > h2:first-of-type {
  margin-bottom: 14px;
}
.page-about .section-block > h2 {
  margin-bottom: 12px;
}
.page-about .body-text .section-block a:not(.about-mini-card) {
  color: var(--indigo2);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.page-about .about-team-mini-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}
.page-about a.about-mini-card {
  display: block;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--r2);
  padding: 14px 12px;
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.page-about a.about-mini-card:hover {
  border-color: var(--border2);
  transform: translateY(-2px);
  box-shadow: var(--sh2);
}
.page-about a.about-mini-card:focus-visible {
  outline: 2px solid var(--indigo2);
  outline-offset: 2px;
}
.page-about .about-mini-top {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.page-about .about-mini-av {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid var(--border2);
}
.page-about .about-mini-meta {
  min-width: 0;
  flex: 1;
}
.page-about .about-mini-name {
  font-family: var(--fh);
  font-size: 13px;
  font-weight: 600;
  color: var(--white);
  margin: 0 0 5px;
  line-height: 1.25;
  letter-spacing: -0.2px;
}
.page-about .about-mini-role {
  font-size: 10px;
  font-weight: 500;
  color: var(--indigo2);
  margin: 0;
  line-height: 1.35;
}
.page-about .about-mini-bio {
  margin: 10px 0 0;
  font-size: 11px;
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}
.page-about .about-mini-skills {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
}
.page-about .about-mini-tag {
  font-size: 9px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 100px;
  background: var(--isoft);
  border: 1px solid rgba(99, 102, 241, 0.15);
  color: var(--indigo2);
  align-self: flex-start;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.page-about .about-mini-foot {
  margin-top: 10px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.65);
}
.page-about .about-card {
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: var(--r3);
  padding: 36px 26px;
  text-align: center;
  position: sticky;
  top: 80px;
}
.page-about .about-rs-logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: contain;
  object-position: center;
  background: var(--bg);
  padding: 6px;
  display: block;
  margin: 0 auto 18px;
  border: 1px solid var(--border2);
  box-shadow: 0 8px 32px var(--iglow);
}
.page-about .av-name {
  font-family: var(--fh);
  font-size: 19px;
  font-weight: 600;
  margin-bottom: 4px;
}
.page-about .av-role {
  font-size: 11px;
  color: #ffffff;
  margin-bottom: 22px;
}
.page-about .badges {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.page-about .badge {
  font-size: 11px;
  color: #ffffff;
  background: var(--bg3);
  border: 1px solid var(--border);
  padding: 9px 12px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: border-color 0.2s;
}
.page-about .badge:hover {
  border-color: var(--border2);
}
.page-about .badge::before {
  content: '◆';
  font-size: 6px;
  color: var(--indigo2);
}
.page-about .body-text p {
  font-size: 15px;
  line-height: 2;
  margin-bottom: 18px;
}
.page-about .body-text strong {
  color: #ffffff;
  font-weight: 500;
}
.page-about .skills-block {
  margin-top: 36px;
}
.page-about .skill-row {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.page-about .skill {
  font-size: 11px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 100px;
  background: var(--isoft);
  border: 1px solid rgba(99, 102, 241, 0.15);
  color: var(--indigo2);
  transition: all 0.2s;
  cursor: default;
}
.page-about .skill:hover {
  background: rgba(99, 102, 241, 0.15);
  border-color: var(--border2);
}
.page-about .timeline {
  margin-top: 40px;
  border-top: 1px solid var(--border);
  padding-top: 32px;
}
.page-about .section-block {
  margin-top: 40px;
  border-top: 1px solid var(--border);
  padding-top: 32px;
}
.page-about .section-subtitle {
  font-size: 13px;
  color: #ffffff;
  margin-top: 10px;
  line-height: 1.8;
}
.page-about .feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}
.page-about .fcard {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(30, 30, 45, 1));
  border: 1px solid rgba(99, 102, 241, 0.18);
  border-radius: var(--r2);
  padding: 18px 16px;
  transition: all 0.25s;
}
.page-about .fcard:hover {
  transform: translateY(-2px);
  border-color: var(--border2);
  box-shadow: var(--sh2);
}
.page-about .f-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--white);
  margin-bottom: 8px;
  letter-spacing: -0.2px;
}
.page-about .f-desc {
  font-size: 12px;
  color: #ffffff;
  line-height: 1.8;
}
.page-about .mv-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}
.page-about .mv-card {
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: var(--r2);
  padding: 18px 16px;
  position: relative;
  overflow: hidden;
}
.page-about .mv-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: radial-gradient(circle at 20% 15%, rgba(99, 102, 241, 0.16), transparent 55%);
  pointer-events: none;
}
.page-about .mv-card > * {
  position: relative;
  z-index: 1;
}
.page-about .mv-k {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--indigo2);
  margin-bottom: 8px;
}
.page-about .mv-v {
  font-size: 13px;
  color: #ffffff;
  line-height: 1.9;
}
.page-about .tl {
  display: flex;
  gap: 18px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}
.page-about .tl:last-child {
  border-bottom: none;
}
.page-about .tl-year {
  font-size: 10px;
  color: var(--indigo2);
  font-weight: 600;
  letter-spacing: 1px;
  min-width: 68px;
  padding-top: 2px;
}
.page-about .tl-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--indigo);
  box-shadow: 0 0 8px var(--iglow);
  margin-top: 5px;
  flex-shrink: 0;
}
.page-about .tl-title {
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 4px;
}
.page-about .tl-desc {
  font-size: 12px;
  color: #ffffff;
  line-height: 1.65;
}
.page-about .btn-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 32px;
}
.page-about .btn-p {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--indigo);
  color: #fff;
  padding: 13px 26px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--fb);
  transition: all 0.25s;
  box-shadow: 0 4px 20px var(--iglow);
}
.page-about .btn-p:hover {
  background: var(--indigo3);
  transform: translateY(-2px);
}
.page-about .btn-g {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #25d366;
  color: #fff;
  padding: 13px 24px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--fb);
  transition: all 0.25s;
}
.page-about .btn-g:hover {
  background: #20bf5d;
  transform: translateY(-2px);
}
.page-about .about-doc-block {
  margin-top: 40px;
  border-top: 1px solid var(--border);
  padding-top: 36px;
}
.page-about .about-doc-shell {
  background: linear-gradient(145deg, rgba(99, 102, 241, 0.06), rgba(30, 30, 45, 0.92));
  border: 1px solid rgba(99, 102, 241, 0.22);
  border-radius: var(--r3);
  padding: 28px 26px 30px;
  position: relative;
  overflow: hidden;
}
.page-about .about-doc-shell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--indigo), var(--indigo3), transparent);
  opacity: 0.85;
  pointer-events: none;
}
.page-about .about-doc-shell > * {
  position: relative;
  z-index: 1;
}
.page-about .about-doc-lead {
  font-size: 14px;
  line-height: 1.85;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.88);
  margin: 12px 0 0;
  max-width: 720px;
}
.page-about .about-doc-pillars {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 22px;
}
.page-about .about-doc-pillar {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--r2);
  padding: 18px 16px 20px;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}
.page-about .about-doc-pillar:hover {
  border-color: var(--border2);
  transform: translateY(-2px);
  box-shadow: var(--sh2);
}
.page-about .about-doc-pillar-num {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--indigo2);
  margin-bottom: 10px;
}
.page-about .about-doc-pillar h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 12px;
  line-height: 1.3;
  letter-spacing: -0.3px;
}
.page-about .about-doc-pillar ul {
  margin: 0;
  padding: 0 0 0 18px;
  font-size: 12px;
  line-height: 1.75;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.82);
}
.page-about .about-doc-pillar li {
  margin-bottom: 8px;
}
.page-about .about-doc-pillar li:last-child {
  margin-bottom: 0;
}
.page-about .about-doc-foot {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 22px;
}
.page-about .about-doc-ref {
  font-size: 11px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.6;
}
.page-about .about-doc-ref a {
  color: var(--indigo2);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.page-about .about-doc-ref a:hover {
  color: #c7d2fe;
}
.page-about .about-doc-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--indigo2);
  font-family: var(--fb);
}
.page-about .about-doc-cta:hover {
  color: #c7d2fe;
}
@media (max-width: 960px) {
  .page-about .wrap {
    padding-left: 24px;
    padding-right: 24px;
  }
  .page-about .about-layout {
    grid-template-columns: 1fr;
  }
  .page-about .about-card {
    position: static;
  }
  .page-about .stats {
    display: none;
  }
  .page-about .skills-block {
    display: none;
  }
  .page-about .timeline {
    display: none;
  }
  .page-about .feature-grid {
    grid-template-columns: 1fr;
  }
  .page-about .mv-grid {
    grid-template-columns: 1fr;
  }
  .page-about .about-team-mini-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .page-about .about-doc-pillars {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 520px) {
  .page-about .about-team-mini-grid {
    grid-template-columns: 1fr;
  }
}
`

function teamBioPreview(bio: string): string {
  const firstLine = bio.split(/\n/).find((l) => l.trim()) ?? bio
  return firstLine.trim()
}

export function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="page-about app-main">
      <Breadcrumbs
        items={[
          { name: 'Home', path: ROUTES.home },
          { name: 'About', path: ROUTES.about },
        ]}
      />
      <Seo
        title={PAGE_SEO.about.title}
        description={PAGE_SEO.about.description}
        keywords={PAGE_SEO.about.keywords}
      />
      <JsonLd data={buildAboutPageSchemaGraph()} />
      <style>{ABOUT_STYLES}</style>

      <div className="hero">
        <div className="wrap">
          <div className="label">About Rathisoft</div>
          <h1>About RathiSoft — Software Agency in Lahore, Pakistan</h1>
          <p>
            RathiSoft is a <strong>software agency in Lahore, Pakistan</strong> helping founders
            ship web, mobile, and growth work with clear scopes—an <em>IT company</em> teams in
            Pakistan, the UK, UAE, and beyond trust because engineers stay reachable after launch.
          </p>
        </div>
      </div>

      <div className="wrap">
        {/* <div className="stats">
          <div className="sc">
            <div className="sc-n">
              59<em>+</em>
            </div>
            <div className="sc-l">Projects completed</div>
          </div>
          <div className="sc">
            <div className="sc-n">
              5<em>+</em>
            </div>
            <div className="sc-l">Years experience</div>
          </div>
          <div className="sc">
            <div className="sc-n">
              4.8<em>★</em>
            </div>
            <div className="sc-l">Client rating</div>
          </div>
          <div className="sc">
            <div className="sc-n" style={{ fontSize: 22 }}>
              UK<em>+US</em>
            </div>
            <div className="sc-l">AUS · EUR · UAE</div>
          </div>
        </div> */}

        <div className="about-layout">
          <div className="about-card">
            <img
              src="/logo/simpleR.webp"
              alt={logoAlt('about')}
              title="RathiSoft — custom web development Lahore Pakistan"
              className="about-rs-logo"
              width={100}
              height={100}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const img = e.currentTarget
                if (img.src.endsWith('/logo-rs-simple.svg')) return
                img.onerror = null
                img.src = '/logo-rs-simple.svg'
              }}
            />
            <div className="av-name">Rathisoft</div>
            <div className="av-role">Technology Partner</div>
            <div className="badges">
              <div className="badge">Client-first mindset</div>
              <div className="badge">Agile & transparent process</div>
              <div className="badge">Scalable & high-performance</div>
              <div className="badge">User-centric product design</div>
              <div className="badge">Innovation & excellence</div>
              <div className="badge">Long-term partnerships</div>
            </div>
          </div>

          <div className="body-text">
            <h2>Who We Are</h2>
            <p>
              <strong>RathiSoft</strong> is a software agency—not a ticket farm. We translate
              your goals into shipped releases: fast storefronts, maintainable web apps, and growth
              campaigns you can measure.
            </p>
            <p>
              We build <strong>scalable</strong>, <strong>high-performance</strong>, and{' '}
              <strong>user-centric</strong> products for founders who want a partner that answers
              on WhatsApp and stays after launch. Explore our{' '}
              <Link to={ROUTES.services}>service list</Link> or recent{' '}
              <Link to={ROUTES.portfolio}>portfolio work</Link>.
            </p>
            <p>
              Our approach combines <strong>modern technologies</strong>,{' '}
              <strong>agile methodologies</strong>, and deep business
              understanding to create solutions that are not just functional—but
              transformative.
            </p>
            <h3>What We Do</h3>
            <p>We design, develop, and deliver cutting-edge solutions across:</p>

            <div className="skills-block">
              <div className="skill-row">
                <span className="skill">Custom Software Development</span>
                <span className="skill">Web & Mobile Applications</span>
                <span className="skill">Cloud & DevOps Solutions</span>
                <span className="skill">AI & Data-Driven Systems</span>
                <span className="skill">UI/UX Design</span>
                <span className="skill">Product Engineering</span>
              </div>
            </div>

            <div className="timeline">
              <h3>Who We Work With</h3>
              <div className="tl">
                <div className="tl-year">Partners</div>
                <div className="tl-dot" />
                <div className="tl-info">
                  <div className="tl-title">Startups, SMEs, and Enterprises</div>
                  <div className="tl-desc">
                    We collaborate with startups turning ideas into products,
                    SMEs scaling operations, and enterprises optimizing digital
                    ecosystems.
                  </div>
                </div>
              </div>
              <div className="tl">
                <div className="tl-year">Industries</div>
                <div className="tl-dot" />
                <div className="tl-info">
                  <div className="tl-title">Cross-industry delivery</div>
                  <div className="tl-desc">
                    Fintech, healthcare, e-commerce, education, and more—always
                    aligned with user needs and business goals.
                  </div>
                </div>
              </div>
              <div className="tl">
                <div className="tl-year">Approach</div>
                <div className="tl-dot" />
                <div className="tl-info">
                  <div className="tl-title">Collaboration, innovation, precision</div>
                  <div className="tl-desc">
                    We partner, not just deliver—focusing on business impact,
                    quality, scalability, and performance at every stage.
                  </div>
                </div>
              </div>
            </div>

            <div className="section-block">
              <h2>Vision &amp; Mission</h2>
              <div className="mv-grid">
                <div className="mv-card">
                  <div className="mv-k">Mission</div>
                  <div className="mv-v">
                    To empower eCommerce brands and startups with high-performance digital tools
                    that bridge the gap between “having a website” and “dominating a market.”
                  </div>
                </div>
                <div className="mv-card">
                  <div className="mv-k">Vision</div>
                  <div className="mv-v">
                    To become the world’s most trusted boutique agency for digital transformation,
                    where every line of code serves a measurable business goal.
                  </div>
                </div>
              </div>
            </div>

            <div className="section-block">
              <h2>The Team Behind RathiSoft</h2>
              <p className="section-subtitle">
                Led by experienced builders and strategists — tap a card for full bios on our{' '}
                <Link to={ROUTES.team}>team page</Link>.
              </p>
              <div className="about-team-mini-grid">
                {TEAM_MEMBERS.map((member) => (
                  <Link key={member.id} to={ROUTES.team} className="about-mini-card">
                    <div className="about-mini-top">
                      <img
                        src={member.image}
                        alt={teamMemberAlt(member.name, member.role)}
                        title={`${member.name} — ${member.role} at RathiSoft`}
                        className="about-mini-av"
                        width={52}
                        height={52}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="about-mini-meta">
                        <h3 className="about-mini-name">{member.name}</h3>
                        <p className="about-mini-role">{member.role}</p>
                      </div>
                    </div>
                    <p className="about-mini-bio">{teamBioPreview(member.bio)}</p>
                    <div className="about-mini-skills">
                      {member.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="about-mini-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="about-mini-foot">📍 {member.location}</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="section-block about-doc-block">
              <div className="label">Documentation</div>
              <h2>Beyond the interface — engineering evidence</h2>
              <div className="about-doc-shell">
                <p className="about-doc-lead">
                  In Lahore&apos;s tech market, procurement increasingly asks for{' '}
                  <strong>receipts</strong>—not only polished screens. We document releases around{' '}
                  <strong>measurable outcomes</strong> and artefacts your finance or engineering leads can
                  revisit quarter to quarter, alongside elite delivery norms you&apos;d expect from
                  top-tier firms.
                </p>
                <div className="about-doc-pillars">
                  <div className="about-doc-pillar">
                    <div className="about-doc-pillar-num">01 · Metrics</div>
                    <h3>Measurable deltas</h3>
                    <ul>
                      <li>Funnel impact — e.g. cart abandonment after Shopify UX fixes.</li>
                      <li>
                        Core Web Vitals — where LCP and CLS moved from poor toward good after
                        optimisation.
                      </li>
                      <li>
                        Operational wins — hours reclaimed when spreadsheets become workflows or ERP
                        touches.
                      </li>
                    </ul>
                  </div>
                  <div className="about-doc-pillar">
                    <div className="about-doc-pillar-num">02 · Architecture</div>
                    <h3>What we put on paper</h3>
                    <ul>
                      <li>Stack and data-flow snapshots for headless, WordPress, or hybrid setups.</li>
                      <li>Anonymised analytics excerpts where NDAs allow.</li>
                      <li>Governance notes for multilingual content and stable SEO.</li>
                    </ul>
                  </div>
                  <div className="about-doc-pillar">
                    <div className="about-doc-pillar-num">03 · Systems</div>
                    <h3>Repeatable delivery</h3>
                    <ul>
                      <li>
                        We prioritise reproducibility over one-off polish—so launches stay fast,
                        secure, and searchable.
                      </li>
                      <li>
                        Delivery aligns with public benchmarks your stakeholders already trust (see
                        links below).
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="about-doc-foot">
                  <span className="about-doc-ref">
                    References:{' '}
                    <a
                      href="https://developers.google.com/search/docs/essentials"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      Google Search Essentials
                    </a>
                    {' · '}
                    <a href="https://web.dev/articles/vitals" target="_blank" rel="noopener noreferrer nofollow">
                      Core Web Vitals (web.dev)
                    </a>
                  </span>
                  <Link to={ROUTES.portfolio} className="about-doc-cta">
                    View portfolio &amp; case context →
                  </Link>
                </div>
              </div>
            </div>

            <div className="section-block">
              <h2>Our Values</h2>
              <p className="section-subtitle">
                Inspired by the agility of modern tech leaders, Rathisoft operates on a simple
                principle: <strong>Clarity over Complexity</strong>. We believe that a digital
                presence should be seamless, fast, and, above all, profitable. Whether it’s a
                high-scale Shopify store or a custom React application, our work is defined by clean
                code and a <strong>Human-First</strong> design approach.
              </p>
            </div>

            <div className="section-block">
              <h2>Why Partner With RathiSoft</h2>
              <div className="feature-grid">
                <div className="fcard">
                  <div className="f-title">Performance-Obsessed</div>
                  <div className="f-desc">
                    We prioritize speed and SEO. If a site doesn&apos;t load in under 3 seconds,
                    it’s not a Rathisoft site.
                  </div>
                </div>
                <div className="fcard">
                  <div className="f-title">A “Partner” Mindset</div>
                  <div className="f-desc">
                    We act as your internal tech wing with 24-hour responsiveness and post-launch
                    maintenance—because long-term success beats one-time delivery.
                  </div>
                </div>
                <div className="fcard">
                  <div className="f-title">Global Standard, Local Care</div>
                  <div className="f-desc">
                    We bring the engineering rigor of Pakistan&apos;s top tech talent to businesses
                    across the UK, UAE, and beyond—with zero friction and maximum transparency.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingBottom: 48 }}>
        <InternalLinksNav links={ABOUT_INTERNAL_LINKS} heading="Continue exploring RathiSoft" />
      </div>
    </main>
  )
}
