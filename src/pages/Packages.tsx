import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PackagesSection } from '../components/PackagesSection'

const PACKAGES_STYLES = `
.page-packages {
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
.page-packages,
.page-packages *,
.page-packages *::before,
.page-packages *::after {
  box-sizing: border-box;
}
.page-packages h1 {
  font-family: var(--fh);
  font-size: clamp(44px, 5.5vw, 76px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -2px;
  color: var(--white);
  margin: 0;
}
.page-packages h2 {
  font-family: var(--fh);
  font-size: clamp(26px, 3vw, 42px);
  font-weight: 600;
  color: var(--white);
  letter-spacing: -0.5px;
  margin: 0;
}
.page-packages h3 {
  font-family: var(--fh);
  font-size: 19px;
  font-weight: 600;
  color: var(--white);
  margin: 0;
}
.page-packages p {
  line-height: 1.8;
  font-weight: 300;
  color: #ffffff;
  margin: 0;
}
.page-packages a {
  text-decoration: none;
}
.page-packages .wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 52px;
}
.page-packages .label {
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
.page-packages .label::before {
  content: '';
  width: 28px;
  height: 1px;
  background: linear-gradient(90deg, var(--indigo), transparent);
}
.page-packages .hero {
  padding: 80px 0 60px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, var(--bg), var(--bg2));
  position: relative;
  overflow: hidden;
}
.page-packages .hero::before {
  content: '';
  position: absolute;
  top: -100px;
  left: -80px;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, transparent 65%);
  pointer-events: none;
}
.page-packages .hero .wrap {
  position: relative;
  z-index: 1;
}
.page-packages .hero p {
  font-size: 16px;
  margin-top: 12px;
  max-width: 520px;
}
.page-packages .pkg-section {
  padding: 64px 0 80px;
}
.page-packages .pkg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.page-packages .pkg.wide {
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
.page-packages .pkg.wide:hover {
  transform: translateY(-5px);
}
.page-packages .pkg-wide-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}
.page-packages .pkg-wide-pill {
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
.page-packages .pkg-wide-pill::before {
  content: '✦';
  color: var(--indigo2);
  font-size: 11px;
}
.page-packages .pkg-wide-tier {
  font-size: 11px;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}
.page-packages .pkg-wide-body {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 26px;
  align-items: end;
}
.page-packages .pkg-wide-title {
  font-family: var(--fh);
  font-size: clamp(34px, 4vw, 56px);
  font-weight: 700;
  letter-spacing: -1.6px;
  line-height: 1.02;
  color: #fff;
  margin: 0 0 10px;
}
.page-packages .pkg-wide-sub {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  line-height: 1.85;
  margin-bottom: 16px;
  max-width: 560px;
}
.page-packages .pkg-wide-sub.right {
  max-width: none;
  margin-bottom: 14px;
  text-align: left;
}
.page-packages .pkg-wide-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 18px;
  margin-top: 10px;
}
.page-packages .pkg-wide-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 300;
  line-height: 1.6;
}
.page-packages .pkg-wide-item .pkg-ck {
  color: var(--indigo2);
}
.page-packages .pkg-wide-cta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
}
.page-packages .pkg-wide-cta .pkg-btn {
  margin-top: 0;
}
.page-packages .pkg-wide-note {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.7;
  text-align: center;
}
@media (max-width: 960px) {
  .page-packages .pkg-wide-body {
    grid-template-columns: 1fr;
    align-items: start;
  }
  .page-packages .pkg-wide-list {
    grid-template-columns: 1fr;
  }
}
.page-packages .pkg {
  border: 1px solid var(--border);
  border-radius: var(--r3);
  padding: 40px 30px;
  background: var(--card);
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  cursor: default;
}
.page-packages .pkg:hover {
  border-color: var(--border2);
  transform: translateY(-4px);
  box-shadow: var(--sh2);
}
.page-packages .pkg.featured {
  background: linear-gradient(145deg, #1a1a2e, var(--indigo3));
  border-color: var(--indigo);
  box-shadow:
    0 0 0 1px rgba(99, 102, 241, 0.3),
    0 20px 60px rgba(99, 102, 241, 0.2);
}
.page-packages .pkg.featured:hover {
  transform: translateY(-6px);
  box-shadow:
    0 0 0 1px rgba(99, 102, 241, 0.4),
    0 28px 72px rgba(99, 102, 241, 0.3);
}
.page-packages .pkg-pop {
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
.page-packages .pkg-pop::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--gold);
}
.page-packages .pkg-tier {
  font-size: 11px;
  color: #ffffff;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.page-packages .pkg-price {
  font-family: var(--fh);
  font-size: 52px;
  font-weight: 700;
  letter-spacing: -2px;
  line-height: 1;
  color: var(--white);
  margin-bottom: 4px;
}
.page-packages .pkg-price sub {
  font-size: 15px;
  font-weight: 300;
  color: #ffffff;
  letter-spacing: 0;
}
.page-packages .pkg-cd {
  font-size: 12px;
  color: #ffffff;
  margin-bottom: 28px;
}
.page-packages .pkg-div {
  border: none;
  border-top: 1px solid var(--border);
  margin-bottom: 22px;
}
.page-packages .pkg.featured .pkg-div {
  border-color: #ffffff;
}
.page-packages .pkg-feat {
  display: flex;
  gap: 11px;
  align-items: flex-start;
  font-size: 13px;
  color: #ffffff;
  padding: 6px 0;
  font-weight: 300;
}
.page-packages .pkg.featured .pkg-feat {
  color: #ffffff;
}
.page-packages .pkg-ck {
  color: var(--indigo2);
  flex-shrink: 0;
  font-size: 12px;
  line-height: 1.6;
}
.page-packages .pkg.featured .pkg-ck {
  color: var(--gold);
}
.page-packages .pkg-sp {
  flex: 1;
}
.page-packages .pkg-btn {
  width: 100%;
  margin-top: 28px;
  padding: 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--fb);
  cursor: pointer;
  transition: all 0.25s;
}
.page-packages .pkg-btn-ind {
  background: var(--indigo);
  color: #fff;
  border: none;
  box-shadow: 0 4px 20px var(--iglow);
}
.page-packages .pkg-btn-ind:hover {
  background: var(--indigo3);
  transform: translateY(-1px);
}
.page-packages .pkg-btn-ghost {
  background: transparent;
  color: #ffffff;
  border: 1px solid var(--border);
}
.page-packages .pkg-btn-ghost:hover {
  border-color: var(--border2);
  color: var(--white);
}
.page-packages .pkg-btn-white {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.page-packages .pkg-btn-white:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}
.page-packages .pkg-note {
  text-align: center;
  font-size: 13px;
  color: #ffffff;
  margin-top: 20px;
}
.page-packages .wa-highlight {
  color: #25d366;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 600;
}
.page-packages .wa-highlight:hover {
  color: #20bf5d;
}
.page-packages .wa-highlight:focus-visible {
  outline: 2px solid rgba(37, 211, 102, 0.6);
  outline-offset: 4px;
  border-radius: 6px;
}
.page-packages .urgency {
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
.page-packages .udot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--indigo2);
  animation: rs-pkg-blink 2s infinite;
}
@keyframes rs-pkg-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
.page-packages .faq {
  padding: 0 0 80px;
  margin-top: 72px;
}
.page-packages .faq h2 {
  margin-bottom: 36px;
}
.page-packages .faq-item {
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 10px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.page-packages .faq-item:hover {
  border-color: var(--border2);
}
.page-packages .faq-q {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 18px 22px;
  cursor: pointer;
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
  font-family: inherit;
  background: none;
  border: none;
  text-align: left;
}
.page-packages .faq-q::after {
  content: '↓';
  color: var(--indigo2);
  font-size: 16px;
  transition: transform 0.2s;
}
.page-packages .faq-item.open .faq-q::after {
  transform: rotate(180deg);
}
.page-packages .faq-a {
  display: none;
  padding: 0 22px 18px;
  font-size: 13px;
  color: #ffffff;
  line-height: 1.75;
}
.page-packages .faq-item.open .faq-a {
  display: block;
}
.page-packages .cta-wrap {
  background: var(--bg2);
  border-top: 1px solid var(--border);
  padding: 72px 52px;
  text-align: center;
}
.page-packages .cta-wrap h2 {
  margin-bottom: 12px;
}
.page-packages .cta-wrap p {
  color: #ffffff;
  font-size: 15px;
  margin-bottom: 32px;
}
.page-packages .cta-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.page-packages .btn-p {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--indigo);
  color: #fff;
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--fb);
  transition: all 0.25s;
  box-shadow: 0 4px 20px var(--iglow);
}
.page-packages .btn-p:hover {
  background: var(--indigo3);
  transform: translateY(-2px);
}
.page-packages .btn-g {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #25d366;
  color: #fff;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--fb);
  transition: all 0.25s;
}
.page-packages .btn-g:hover {
  background: #20bf5d;
  transform: translateY(-2px);
}
@media (max-width: 960px) {
  .page-packages .wrap,
  .page-packages .cta-wrap {
    padding-left: 24px;
    padding-right: 24px;
  }
  .page-packages .pkg-grid {
    grid-template-columns: 1fr;
  }
}
`

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "What's included in the price?",
    a: 'Everything listed in the package — design, development, testing, and post-launch support. No hidden charges.',
  },
  {
    q: 'How do I get started?',
    a: "Simply WhatsApp me or fill the contact form. We'll discuss your requirements and I'll recommend the best package for you.",
  },
  {
    q: 'Do you offer custom quotes?',
    a: 'Yes! If your project falls outside these packages, I can provide a custom quote based on your specific needs.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'PayPal, bank transfer, and other methods can be arranged. 50% upfront, 50% on delivery.',
  },
  {
    q: 'Do you provide ongoing support after launch?',
    a: 'Yes — every package includes 1 month of post-launch support. Extended support plans are also available.',
  },
]

const WA = 'https://wa.me/923342651544'

export function Packages() {
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const prev = document.title
    document.title = 'Packages & Pricing — Rathisoft'
    window.scrollTo(0, 0)
    return () => {
      document.title = prev
    }
  }, [])

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <main className="page-packages app-main">
      <style>{PACKAGES_STYLES}</style>

      <div className="hero">
        <div className="wrap">
          <div className="label">Pricing</div>
          <h1>
            Simple packages.
            <br />
            No surprises.
          </h1>
          <p>
            Pick the plan that fits your business. Everything included — design,
            development, and strategy. No hidden fees, ever.
          </p>
        </div>
      </div>

      <div className="wrap pkg-section">
        <PackagesSection waLink={WA} />

        <div className="faq">
          <h2>Frequently asked questions.</h2>
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={item.q}
              className={`faq-item${faqOpen[i] ? ' open' : ''}`}
            >
              <button
                type="button"
                className="faq-q"
                onClick={() => toggleFaq(i)}
              >
                {item.q}
              </button>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-wrap">
        <h2>Still have questions?</h2>
        <p>
          Just message me on WhatsApp — I&apos;ll get back to you within 24
          hours.
        </p>
        <div className="cta-btns">
          <Link to="/contact" className="btn-p">
            Send a message →
          </Link>
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-g"
          >
            💬 WhatsApp now
          </a>
        </div>
      </div>
    </main>
  )
}
