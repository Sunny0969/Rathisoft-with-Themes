import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { JsonLd } from '../components/JsonLd'
import { Seo } from '../components/Seo'
import { WhatWeDoSection } from '../components/WhatWeDoSection'
import { BLOG_POSTS } from '../data/blogPosts'
import { buildBlogIndexSchemaGraph } from '../data/schemaMarkup'
import { PAGE_SEO } from '../data/pageSeo'
import { blogPath, ROUTES } from '../utils/routes'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function BlogPage() {
  const latestUpdate = BLOG_POSTS.reduce((a, p) =>
    p.updatedAt > a ? p.updatedAt : a,
  BLOG_POSTS[0]?.updatedAt ?? '')

  return (
    <>
      <Seo
        title={PAGE_SEO.blog.title}
        description={PAGE_SEO.blog.description}
        keywords={PAGE_SEO.blog.keywords}
      />
      <JsonLd data={buildBlogIndexSchemaGraph()} />
      <main className="page-blog lms-page app-main">
        <Breadcrumbs
          items={[
            { name: 'Home', path: ROUTES.home },
            { name: 'Blog', path: ROUTES.blog },
          ]}
        />

        <section className="hero" aria-labelledby="blog-hero-heading">
          <div className="wrap">
            <div className="label">Insights</div>
            <h1 id="blog-hero-heading">Software &amp; digital insights | RathiSoft</h1>
            <p>
              Practical guides on choosing a <strong>software development company</strong>,
              scoping custom web and mobile builds, and running delivery with clear
              checklists—written for founders and engineering leaders. Start with our{' '}
              {BLOG_POSTS[0] ? (
                <Link to={blogPath(BLOG_POSTS[0].slug)}>{BLOG_POSTS[0].h1}</Link>
              ) : (
                'featured guide'
              )}
              .
            </p>
            <div className="hero-stats" role="region" aria-label="Blog highlights">
              <div className="hero-stat">
                <div className="hero-stat-num">{BLOG_POSTS.length}</div>
                <div className="hero-stat-label">Articles</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">2026</div>
                <div className="hero-stat-label">Updated guides</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">
                  {latestUpdate ? formatDate(latestUpdate).split(',')[0] : '—'}
                </div>
                <div className="hero-stat-label">Latest refresh</div>
              </div>
            </div>
          </div>
        </section>

        <div className="blog-catalog">
          <div className="blog-grid">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                to={blogPath(post.slug)}
                className="blog-card"
              >
                {post.coverImage ? (
                  <div className="blog-card-media">
                    <img
                      src={post.coverImage}
                      alt={post.coverImageAlt ?? post.h1}
                      width={600}
                      height={375}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                ) : null}
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    {formatDate(post.publishedAt)} · {post.readMinutes} min read
                  </div>
                  <h2>{post.h1}</h2>
                  <p>{post.excerpt}</p>
                  <span className="blog-card-cta">Read article →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <WhatWeDoSection />
      </main>
    </>
  )
}
