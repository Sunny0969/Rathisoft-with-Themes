import { Link } from 'react-router-dom'

const DEFAULT_WA = 'https://wa.me/923342651544'

const STYLES = `
.rs-packages {
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
  --r2: 18px;
  --r3: 24px;
  --sh2: 0 8px 40px rgba(0, 0, 0, 0.35);
  --fb: 'Poppins', system-ui, sans-serif;
  --fh: 'Poppins', system-ui, sans-serif;
}
.rs-packages .pkg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.rs-packages .pkg {
  border: 1px solid var(--border);
  border-radius: var(--r3);
  padding: 40px 30px;
  background: var(--card);
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  cursor: default;
}
.rs-packages .pkg:hover {
  border-color: var(--border2);
  transform: translateY(-4px);
  box-shadow: var(--sh2);
}
.rs-packages .pkg.featured {
  background: linear-gradient(145deg, #1a1a2e, var(--indigo3));
  border-color: var(--indigo);
  box-shadow:
    0 0 0 1px rgba(99, 102, 241, 0.3),
    0 20px 60px rgba(99, 102, 241, 0.2);
}
.rs-packages .pkg.featured:hover {
  transform: translateY(-6px);
  box-shadow:
    0 0 0 1px rgba(99, 102, 241, 0.4),
    0 28px 72px rgba(99, 102, 241, 0.3);
}
.rs-packages .pkg-pop {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--gold);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
}
.rs-packages .pkg-pop::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--gold);
}
.rs-packages .pkg-tier {
  font-size: 11px;
  color: #ffffff;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.rs-packages .pkg-price {
  font-family: var(--fh);
  font-size: 52px;
  font-weight: 700;
  letter-spacing: -2px;
  line-height: 1;
  color: var(--white);
  margin-bottom: 4px;
}
.rs-packages .pkg-price sub {
  font-size: 15px;
  font-weight: 300;
  color: #ffffff;
  letter-spacing: 0;
}
.rs-packages .pkg-cd {
  font-size: 12px;
  color: #ffffff;
  margin-bottom: 28px;
}
.rs-packages .pkg-div {
  border: none;
  border-top: 1px solid var(--border);
  margin-bottom: 22px;
}
.rs-packages .pkg.featured .pkg-div {
  border-color: #ffffff;
}
.rs-packages .pkg-feat {
  display: flex;
  gap: 11px;
  align-items: flex-start;
  font-size: 13px;
  color: #ffffff;
  padding: 6px 0;
  font-weight: 300;
}
.rs-packages .pkg-ck {
  color: var(--indigo2);
  flex-shrink: 0;
  font-size: 12px;
  line-height: 1.6;
}
.rs-packages .pkg.featured .pkg-ck {
  color: var(--gold);
}
.rs-packages .pkg-sp { flex: 1; }
.rs-packages .pkg-btn {
  width: 100%;
  margin-top: 28px;
  padding: 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--fb);
  cursor: pointer;
  transition: all 0.25s;
  text-align: center;
  display: inline-block;
}
.rs-packages .pkg-btn-ind {
  background: var(--indigo);
  color: #fff;
  border: none;
  box-shadow: 0 4px 20px var(--iglow);
}
.rs-packages .pkg-btn-ind:hover { background: var(--indigo3); transform: translateY(-1px); }
.rs-packages .pkg-btn-ghost {
  background: transparent;
  color: #ffffff;
  border: 1px solid var(--border);
}
.rs-packages .pkg-btn-ghost:hover { border-color: var(--border2); color: var(--white); }
.rs-packages .pkg-btn-white {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.rs-packages .pkg-btn-white:hover { background: rgba(255, 255, 255, 0.2); transform: translateY(-1px); }
.rs-packages .pkg-note {
  text-align: center;
  font-size: 13px;
  color: #ffffff;
  margin-top: 20px;
}
.rs-packages .wa-highlight {
  color: #25d366;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 600;
}
.rs-packages .wa-highlight:hover { color: #20bf5d; }
.rs-packages .wa-highlight:focus-visible {
  outline: 2px solid rgba(37, 211, 102, 0.6);
  outline-offset: 4px;
  border-radius: 6px;
}
.rs-packages .urgency {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--isoft);
  border: 1px solid var(--border2);
  border-radius: 12px;
  padding: 14px;
  margin-top: 16px;
  font-size: 12px;
  color: var(--indigo2);
}
.rs-packages .udot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--indigo2);
  animation: rs-pkg-blink 2s infinite;
}
@keyframes rs-pkg-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Wide custom card */
.rs-packages .pkg.wide {
  grid-column: 1 / -1;
  padding: 34px 34px;
  background:
    radial-gradient(circle at 20% 40%, rgba(99, 102, 241, 0.22) 0%, transparent 55%),
    linear-gradient(145deg, rgba(26, 26, 46, 0.95), rgba(79, 70, 229, 0.28));
  border-color: rgba(99, 102, 241, 0.35);
  box-shadow:
    0 0 0 1px rgba(99, 102, 241, 0.12),
    0 18px 55px rgba(0, 0, 0, 0.35);
}
.rs-packages .pkg.wide:hover { transform: translateY(-5px); }
.rs-packages .pkg-wide-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}
.rs-packages .pkg-wide-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.rs-packages .pkg-wide-pill::before { content: '✦'; color: var(--indigo2); font-size: 11px; }
.rs-packages .pkg-wide-tier {
  font-size: 11px;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}
.rs-packages .pkg-wide-body {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 26px;
  align-items: end;
}
.rs-packages .pkg-wide-title {
  font-family: var(--fh);
  font-size: clamp(34px, 4vw, 56px);
  font-weight: 700;
  letter-spacing: -1.6px;
  line-height: 1.02;
  color: #fff;
  margin: 0 0 10px;
}
.rs-packages .pkg-wide-sub {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  line-height: 1.85;
  margin-bottom: 16px;
  max-width: 560px;
}
.rs-packages .pkg-wide-sub.right {
  max-width: none;
  margin-bottom: 14px;
  text-align: left;
}
.rs-packages .pkg-wide-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 18px;
  margin-top: 10px;
}
.rs-packages .pkg-wide-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 300;
  line-height: 1.6;
}
.rs-packages .pkg-wide-item .pkg-ck { color: var(--indigo2); }
.rs-packages .pkg-wide-cta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
}
.rs-packages .pkg-wide-cta .pkg-btn { margin-top: 0; }
.rs-packages .pkg-wide-note {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.7;
  text-align: center;
}
@media (max-width: 960px) {
  .rs-packages .pkg-grid { grid-template-columns: 1fr; }
  .rs-packages .pkg-wide-body { grid-template-columns: 1fr; align-items: start; }
  .rs-packages .pkg-wide-list { grid-template-columns: 1fr; }
}
`

export function PackagesSection({ waLink = DEFAULT_WA }: { waLink?: string }) {
  return (
    <div className="rs-packages">
      <style>{STYLES}</style>

      <div className="pkg-grid">
        <div className="pkg">
          <div className="pkg-tier">Basic Presence</div>
          <div className="pkg-price">
            $99<sub>–$198</sub>
          </div>
          <div className="pkg-cd">⏱ 3–5 Days &nbsp;·&nbsp; Best for startups &amp; portfolios</div>
          <hr className="pkg-div" />
          {[
            'Professional One-Page Landing Design',
            'Fully Responsive (Mobile, Tablet, Desktop)',
            'Contact Form Integration',
            'Social Media Linking',
            'Speed Optimization (Basic)',
            '1 Month Free Post-Launch Support',
          ].map((t) => (
            <div key={t} className="pkg-feat">
              <span className="pkg-ck">✦</span>
              <span className="pkg-sp">{t}</span>
            </div>
          ))}
          <div className="pkg-sp" />
          <a className="pkg-btn pkg-btn-ghost" href={waLink} target="_blank" rel="noopener noreferrer">
            Get started
          </a>
        </div>

        <div className="pkg featured">
          <div className="pkg-pop">Most popular</div>
          <div className="pkg-tier">Business Growth</div>
          <div className="pkg-price">
            $199<sub>–$298</sub>
          </div>
          <div className="pkg-cd">⏱ 7–12 Days &nbsp;·&nbsp; Best for established businesses</div>
          <hr className="pkg-div" />
          {[
            'Up to 5–7 Custom Pages (Home, About, Services…)',
            'Modern UI/UX with Custom Graphics',
            'SEO Friendly Structure',
            'WhatsApp Chat Integration',
            'CMS Access (Manage your own content)',
            '1 Month Priority Support + Basic Security Setup',
          ].map((t) => (
            <div key={t} className="pkg-feat">
              <span className="pkg-ck">✦</span>
              <span className="pkg-sp">{t}</span>
            </div>
          ))}
          <div className="pkg-sp" />
          <a className="pkg-btn pkg-btn-white" href={waLink} target="_blank" rel="noopener noreferrer">
            Get started →
          </a>
        </div>

        <div className="pkg">
          <div className="pkg-tier">Enterprise Elite</div>
          <div className="pkg-price">
            $299<sub>–$399</sub>
          </div>
          <div className="pkg-cd">⏱ 15–25 Days &nbsp;·&nbsp; Best for E-commerce &amp; complex apps</div>
          <hr className="pkg-div" />
          {[
            'Unlimited Pages / Full E-commerce Setup',
            'Payment Gateway (Stripe, PayPal, etc.)',
            'Custom Functionalities (Dashboards, Booking…)',
            'Premium Speed & Performance Optimization',
            'NDA Protection for Code & Data',
            '1 Month Full Technical Support + Daily Backups',
          ].map((t) => (
            <div key={t} className="pkg-feat">
              <span className="pkg-ck">✦</span>
              <span className="pkg-sp">{t}</span>
            </div>
          ))}
          <div className="pkg-sp" />
          <a className="pkg-btn pkg-btn-ind" href={waLink} target="_blank" rel="noopener noreferrer">
            Get started
          </a>
        </div>

        <div className="pkg wide">
          <div className="pkg-wide-top">
            <div className="pkg-wide-pill">Let&apos;s talk</div>
            <div className="pkg-wide-tier">Custom Project</div>
          </div>

          <div className="pkg-wide-body">
            <div>
              <h3 className="pkg-wide-title">
                Let&apos;s
                <br />
                Build It
              </h3>

              <div className="pkg-wide-list">
                {[
                  '100% tailor-made for you',
                  'Any industry, any complexity',
                  'Custom timeline & budget',
                  'Dedicated 1‑on‑1 consultation',
                  'NDA signed before we start',
                  'Free project estimate',
                ].map((t) => (
                  <div key={t} className="pkg-wide-item">
                    <span className="pkg-ck">✦</span>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="pkg-wide-cta">
              <p className="pkg-wide-sub right">
                Your idea, your rules. If you need something unique (custom dashboard, booking, marketplace,
                automation, integrations), I&apos;ll plan the right scope and give you a clear quote.
              </p>
              <Link to="/contact" className="pkg-btn pkg-btn-ind" style={{ textAlign: 'center' }}>
                Tell us your idea →
              </Link>
              <a className="pkg-btn pkg-btn-ghost" href={waLink} target="_blank" rel="noopener noreferrer">
                WhatsApp for a quick quote
              </a>
              <div className="pkg-wide-note">Reply within 24 hours. No pressure — just clarity.</div>
            </div>
          </div>
        </div>
      </div>

      <p className="pkg-note">
        Not sure which plan fits?{' '}
        <a className="wa-highlight" href={waLink} target="_blank" rel="noopener noreferrer">
          Message on WhatsApp
        </a>{' '}
        — I&apos;ll recommend the right one for you.
      </p>
      <div className="urgency">
        <span className="udot" />
        Currently accepting 3 new monthly clients — spots filling fast
      </div>
    </div>
  )
}

