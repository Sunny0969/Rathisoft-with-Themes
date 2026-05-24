import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Seo } from '../components/Seo'
import { PAGE_SEO } from '../data/pageSeo'
import { ROUTES } from '../utils/routes'
import '../styles/legal-pages.css'

const LAST_UPDATED = 'May 23, 2026'

export function TermsOfService() {
  return (
    <>
      <Seo
        title={PAGE_SEO.termsOfService.title}
        description={PAGE_SEO.termsOfService.description}
        keywords={PAGE_SEO.termsOfService.keywords}
      />
      <main className="page-legal lms-page app-main">
        <Breadcrumbs
          items={[
            { name: 'Home', path: ROUTES.home },
            { name: 'Terms of Service', path: ROUTES.termsOfService },
          ]}
        />

        <section className="hero" aria-labelledby="terms-hero-heading">
          <div className="wrap">
            <div className="label">Legal</div>
            <h1 id="terms-hero-heading">Terms of Service | RathiSoft</h1>
            <p>
              How we scope web and marketing work, handle payments and milestones, protect your IP,
              and limit liability when you use <strong>www.rathisoft.com</strong> or hire our Lahore
              team. Read the sections below or reach us on the{' '}
              <Link to={ROUTES.contact}>contact page</Link> if something is unclear.
            </p>
            <div className="hero-stats" role="region" aria-label="Terms overview">
              <div className="hero-stat">
                <div className="hero-stat-num">2026</div>
                <div className="hero-stat-label">Updated {LAST_UPDATED}</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">SOW</div>
                <div className="hero-stat-label">Written scopes</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">PK</div>
                <div className="hero-stat-label">Lahore · global clients</div>
              </div>
            </div>
          </div>
        </section>

        <article className="legal-prose wrap">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of the website{' '}
            <strong>www.rathisoft.com</strong> and related services offered by RathiSoft Innovation
            (&quot;RathiSoft,&quot; &quot;we,&quot; &quot;us&quot;). By accessing the site or engaging our team for a
            project, you agree to these Terms.
          </p>

          <h2>Services</h2>
          <p>
            RathiSoft provides web development, Shopify and WordPress builds, apps, SEO, paid media,
            content, and related digital services. Scopes, timelines, and fees are defined in a written
            proposal, statement of work, or package selection—not solely by marketing copy on this site.
          </p>

          <h2>Quotes and payments</h2>
          <p>
            Quotes are valid for the period stated in writing. Deposits and milestones are non-refundable
            once work has started, except where required by applicable law or explicitly agreed in writing.
            Late payments may pause delivery until the account is current.
          </p>

          <h2>Client responsibilities</h2>
          <p>
            You agree to provide timely feedback, content, credentials, and approvals. Delays on your side
            may shift delivery dates. You warrant that materials you supply do not infringe third-party
            rights and that you have authority to share them with our team.
          </p>

          <h2>Intellectual property</h2>
          <p>
            Upon full payment for a scoped deliverable, you receive the usage rights described in your
            contract (typically ownership of custom work product created for you). We retain rights to
            pre-existing tools, libraries, and general know-how. We may showcase completed work in our{' '}
            <Link to={ROUTES.portfolio}>portfolio</Link> unless a mutual NDA says otherwise.
          </p>

          <h2>Free resources</h2>
          <p>
            Themes, course materials, and downloads on this site are provided for education or evaluation
            unless you hold a valid license from the original rights holder. Support official developers
            when you use commercial products in production.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, RathiSoft is not liable for indirect, incidental, or
            consequential damages arising from use of the site or services. Our aggregate liability for a
            project is limited to the fees paid for that project in the twelve months before the claim.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these Terms by posting a new version on this page with an updated date.
            Continued use of the site after changes constitutes acceptance.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these Terms:{' '}
            <a href="mailto:info@rathisoft.com">info@rathisoft.com</a> or our{' '}
            <Link to={ROUTES.contact}>contact page</Link>. Office: Johar Town, Lahore, Pakistan.
          </p>
        </article>
      </main>
    </>
  )
}
