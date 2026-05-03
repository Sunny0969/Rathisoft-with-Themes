import { useEffect } from 'react'
import { Link } from 'react-router-dom'

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
.page-about .about-card {
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: var(--r3);
  padding: 36px 26px;
  text-align: center;
  position: sticky;
  top: 80px;
}
.page-about .av {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--indigo), var(--indigo3));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--fh);
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  margin: 0 auto 18px;
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
}
`

export function AboutUs() {
  useEffect(() => {
    const prev = document.title
    document.title = 'About Us — Rathisoft'
    window.scrollTo(0, 0)
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <main className="page-about app-main">
      <style>{ABOUT_STYLES}</style>

      <div className="hero">
        <div className="wrap">
          <div className="label">About Us</div>
          <h1>Suneel Pirkash.</h1>
          <p>
            WordPress Developer · Shopify Expert · Founder of Rathisoft · Based
            in Lahore, Pakistan
          </p>
        </div>
      </div>

      <div className="wrap">
        <div className="stats">
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
        </div>

        <div className="about-layout">
          <div className="about-card">
            <div className="av">SP</div>
            <div className="av-name">Suneel Pirkash</div>
            <div className="av-role">
              WordPress & Shopify Developer · Lahore
            </div>
            <div className="badges">
              <div className="badge">WordPress Expert</div>
              <div className="badge">Shopify Developer</div>
              <div className="badge">5+ Years Experience</div>
              <div className="badge">UK · US · AUS · EUR</div>
              <div className="badge">NDA-Ready</div>
              <div className="badge">24hr Response</div>
            </div>
          </div>

          <div className="body-text">
            <p>
              I&apos;m <strong>Suneel Pirkash</strong> — a WordPress developer
              and Shopify expert with 5+ years of experience building fast,
              beautiful, and conversion-ready websites for businesses around the
              world.
            </p>
            <p>
              From custom WordPress themes to fully configured Shopify stores, I
              handle everything —{' '}
              <strong>
                design, development, plugins, payment gateways, SEO setup, and
                ongoing support.
              </strong>{' '}
              My clients get a partner, not just a developer.
            </p>
            <p>
              At Rathisoft, I combine web development with{' '}
              <strong>digital marketing, branding, and content strategy</strong>{' '}
              — so your website doesn&apos;t just look great, it actually brings
              in business.
            </p>
            <p>
              I&apos;ve worked with clients across{' '}
              <strong>UK, US, Australia, Europe, and UAE</strong> — healthcare
              clinics, real estate agencies, eCommerce brands, and startups.
              Every project gets my full attention, on time, every time.
            </p>

            <div className="skills-block">
              <h3>Technical Skills</h3>
              <div className="skill-row">
                <span className="skill">WordPress</span>
                <span className="skill">Shopify</span>
                <span className="skill">WooCommerce</span>
                <span className="skill">PHP / MySQL</span>
                <span className="skill">Elementor Pro</span>
                <span className="skill">Liquid (Shopify)</span>
                <span className="skill">HTML / CSS</span>
                <span className="skill">JavaScript</span>
              </div>
              <h3>Marketing & Growth</h3>
              <div className="skill-row">
                <span className="skill">SEO Optimization</span>
                <span className="skill">Speed Optimization</span>
                <span className="skill">Social Media</span>
                <span className="skill">PPC / Google Ads</span>
                <span className="skill">Email Marketing</span>
                <span className="skill">Branding & Design</span>
              </div>
            </div>

            <div className="timeline">
              <h3>Experience</h3>
              <div className="tl">
                <div className="tl-year">2024 – Now</div>
                <div className="tl-dot" />
                <div className="tl-info">
                  <div className="tl-title">Founder — Rathisoft</div>
                  <div className="tl-desc">
                    Building a full-service digital agency offering WordPress,
                    Shopify, SEO, and marketing to clients worldwide.
                  </div>
                </div>
              </div>
              <div className="tl">
                <div className="tl-year">2021 – 2024</div>
                <div className="tl-dot" />
                <div className="tl-info">
                  <div className="tl-title">
                    Freelance WordPress & Shopify Developer
                  </div>
                  <div className="tl-desc">
                    50+ projects delivered across UK, US, UAE — custom themes,
                    eCommerce stores, and digital marketing campaigns.
                  </div>
                </div>
              </div>
              <div className="tl">
                <div className="tl-year">2019 – 2021</div>
                <div className="tl-dot" />
                <div className="tl-info">
                  <div className="tl-title">Junior Web Developer</div>
                  <div className="tl-desc">
                    Started career building WordPress websites and learning
                    digital marketing fundamentals.
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              <Link to="/contact" className="btn-p">
                Work with me →
              </Link>
              <a
                href="https://wa.me/923342651544"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-g"
              >
                💬 WhatsApp me
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
