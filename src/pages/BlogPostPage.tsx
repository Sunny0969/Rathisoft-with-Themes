import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { BlogTableOfContents } from '../components/BlogTableOfContents'
import { JsonLd } from '../components/JsonLd'
import { Seo } from '../components/Seo'
import { WhatWeDoSection } from '../components/WhatWeDoSection'
import { getBlogPost } from '../data/blogPosts'
import { buildBlogArticleSchemaGraph } from '../data/schemaMarkup'
import { ROUTES } from '../utils/routes'
import { renderBlogMarkdown } from '../utils/blogMarkdown'
import { extractTocFromMarkdown } from '../utils/blogToc'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function BlogPostPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const post = getBlogPost(slug)

  if (!post) {
    return <Navigate to={ROUTES.blog} replace />
  }

  const articleUrl = `${ROUTES.blog}${post.slug}/`

  const tocItems = useMemo(
    () => [
      ...extractTocFromMarkdown(post.bodyMd),
      { id: 'blog-faq-heading', title: 'Frequently asked questions', level: 2 as const },
    ],
    [post.bodyMd],
  )

  return (
    <>
      <Seo
        title={post.seoTitle}
        description={post.metaDescription}
        keywords={post.keywords}
        ogType="article"
        image={
          post.coverImage
            ? post.coverImage.replace('w=600', 'w=1200').replace('q=60', 'q=80')
            : undefined
        }
        imageAlt={post.coverImageAlt}
      />
      <JsonLd data={buildBlogArticleSchemaGraph(post)} />
      <main className="page-blog-post lms-page app-main">
        <Breadcrumbs
          items={[
            { name: 'Home', path: ROUTES.home },
            { name: 'Blog', path: ROUTES.blog },
            { name: post.h1, path: articleUrl },
          ]}
        />

        <header className="post-hero" aria-labelledby="post-hero-heading">
          <div className="wrap">
            <div className="label">{post.heroLabel}</div>
            <h1 id="post-hero-heading">{post.h1}</h1>
            <p className="post-hero-excerpt">{post.excerpt}</p>
            <div className="post-meta-row">
              <span>{post.author}</span>
              <span>Published {formatDate(post.publishedAt)}</span>
              <span>Updated {formatDate(post.updatedAt)}</span>
              <span>{post.readMinutes} min read</span>
            </div>
          </div>
        </header>

        <div className="blog-article-layout">
          <div className="blog-article-content">
            <article className="blog-article">
              {renderBlogMarkdown(post.bodyMd)}

              <section className="blog-faq" aria-labelledby="blog-faq-heading">
                <h2 id="blog-faq-heading">Frequently asked questions</h2>
                {post.faqs.map((faq) => (
                  <div key={faq.question} className="blog-faq-item">
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </section>

              <p className="blog-updated">
                Last updated: {formatDate(post.updatedAt)} · Focus: {post.focusKeyphrase}
              </p>
              <p>
                Ready to compare vendors on your roadmap?{' '}
                <Link to={ROUTES.contact}>Request a scoped quote from RathiSoft</Link> or
                browse our <Link to={ROUTES.portfolio}>portfolio</Link> and{' '}
                <Link to={ROUTES.services}>services</Link>.
              </p>
            </article>
          </div>

          <BlogTableOfContents items={tocItems} />
        </div>

        <div className="blog-catalog" style={{ paddingTop: 0 }}>
          <Link to={ROUTES.blog} className="blog-card-cta">
            ← All articles
          </Link>
        </div>

        <WhatWeDoSection />
      </main>
    </>
  )
}
