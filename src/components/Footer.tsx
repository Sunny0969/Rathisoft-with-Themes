import { Link } from 'react-router-dom'
import './Footer.css'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <div className="rs-footer-block">
      <footer className="rs-footer">
        <div className="ft-top">
          <div>
            <div className="ft-brand">
              Rathi<span>soft</span>
            </div>
            <p className="ft-desc">
              Expert WordPress & Shopify development, digital marketing, and
              branding. Based in Lahore — serving clients worldwide.
            </p>
            <div className="ft-contacts">
              <a href="mailto:info@rathisoft.com" className="ft-clink">
                <div className="ft-clink-icon">📧</div>
                info@rathisoft.com
              </a>
              <a
                href="https://wa.me/923342651544"
                target="_blank"
                rel="noopener noreferrer"
                className="ft-clink"
              >
                <div className="ft-clink-icon">📱</div>
                +92 334 2651544
              </a>
              <span className="ft-clink">
                <div className="ft-clink-icon">📍</div>
                Johar Town, Lahore, Pakistan
              </span>
            </div>
          </div>

          <div className="ft-col">
            <h5>Services</h5>
            <Link to="/web-development">Web Development</Link>
            <Link to="/seo-optimization">SEO Optimization</Link>
            <Link to="/app-development">App Development</Link>
            <Link to="/wordpress-shopify">WordPress & Shopify</Link>
            <Link to="/video-editing">Video Editing</Link>
          </div>

          <div className="ft-col">
            <h5>More Services</h5>
            <Link to="/social-media-marketing">Social Media</Link>
            <Link to="/content-marketing">Content Marketing</Link>
            <Link to="/ppc-advertising">PPC Advertising</Link>
            <Link to="/email-marketing">Email Marketing</Link>
            <Link to="/branding-design">Branding & Design</Link>
          </div>

          <div className="ft-col">
            <h5>Company</h5>
            <Link to="/about">About Us</Link>
            <Link to="/work">Portfolio</Link>
            <Link to="/packages">Packages</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="ft-bot">
          <div className="ft-copy">
            © {YEAR} Rathisoft Innovation | Suneel Pirkash | All rights
            reserved.
          </div>
          <div className="ft-soc">
            <a
              href="mailto:info@rathisoft.com"
              className="ft-soc-link"
              title="Email"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
            <a
              href="https://wa.me/923342651544"
              target="_blank"
              rel="noopener noreferrer"
              className="ft-soc-link"
              title="WhatsApp"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#ffffff"
                aria-hidden
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.844L.058 23.486a.5.5 0 0 0 .609.61l5.701-1.493A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.67-.523-5.188-1.434l-.372-.223-3.853 1.009 1.028-3.758-.243-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/rathisoft/"
              target="_blank"
              rel="noopener noreferrer"
              className="ft-soc-link ft-mob-hide"
              title="Instagram"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#ffffff"
                aria-hidden
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/rathisoft-innovation/"
              target="_blank"
              rel="noopener noreferrer"
              className="ft-soc-link ft-mob-hide"
              title="LinkedIn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#ffffff"
                aria-hidden
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/923342651544"
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="28"
          height="28"
          fill="white"
          aria-hidden
        >
          <path d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 10L4 44l10.3-2.7C17.1 43 20.5 44 24 44c11 0 20-9 20-20S35 4 24 4zm0 36c-3.1 0-6.1-.8-8.7-2.4l-.6-.4-6.1 1.6 1.6-5.9-.4-.6C8.8 30.1 8 27.1 8 24 8 15.2 15.2 8 24 8s16 7.2 16 16-7.2 16-16 16zm8.8-11.8c-.5-.2-2.8-1.4-3.2-1.5-.4-.2-.7-.2-1 .2-.3.5-1.2 1.5-1.5 1.9-.3.3-.5.4-1 .1-.5-.2-2-.7-3.8-2.3-1.4-1.2-2.3-2.8-2.6-3.2-.3-.5 0-.7.2-1 .2-.2.5-.5.7-.8.2-.3.3-.5.4-.8.2-.3 0-.6-.1-.8-.1-.2-1-2.5-1.4-3.4-.4-.9-.7-.8-1-.8h-.9c-.3 0-.8.1-1.2.6-.4.5-1.6 1.6-1.6 3.8s1.7 4.4 1.9 4.7c.2.3 3.3 5.1 8 7.1 1.1.5 2 .8 2.7 1 1.1.3 2.2.3 3 .2.9-.1 2.8-1.1 3.2-2.2.4-1.1.4-2 .3-2.2-.2-.3-.5-.4-1-.6z" />
        </svg>
      </a>
    </div>
  )
}
