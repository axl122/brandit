import { useParams, Link, useNavigate } from 'react-router-dom'
import Page from '../components/Page'
import { blogPosts } from './blogData'
import { useEffect } from 'react'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const post = blogPosts.find((p) => p.slug === slug)

  useEffect(() => {
    if (!post) {
      navigate('/blog')
    }
  }, [post, navigate])

  if (!post) return null

  return (
    <Page title={post.category.toUpperCase()} lead={post.title}>
      <article className="blogPost">
        <header className="blogPost__header">
          <Link to="/blog" className="blogPost__back">
            ← Back to Blog
          </Link>
          <div className="blogPost__meta">
            <div className="blogPost__author">
              <span className="blogPost__authorName">{post.author.name}</span>
              <span className="blogPost__authorRole">{post.author.role}</span>
            </div>
            <div className="blogPost__date">
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
              <span className="blogPost__dot">•</span>
              {post.readingTime} read
            </div>
          </div>
        </header>

        <div 
          className="blogPost__content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.reference && (
          <footer className="blogPost__footer">
            <div className="blogPost__sources">
              <span className="blogPost__sourcesLabel">Sources</span>
              {post.reference.url ? (
                <a 
                  href={post.reference.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="blogPost__sourcesLink"
                >
                  {post.reference.name} ↗
                </a>
              ) : (
                <span className="blogPost__sourcesName">{post.reference.name}</span>
              )}
            </div>
          </footer>
        )}

        <section className="blogPost__cta">
          <div className="ctaCard">
            <div>
              <h2 className="ctaTitle">Ready to elevate your brand?</h2>
              <p className="ctaText">Let's apply these insights to your specific business goals.</p>
            </div>
            <div className="ctaActions">
              <button
                className="btn btn--primary"
                onClick={() => window.dispatchEvent(new Event('consultation:open'))}
              >
                Book a free consultation
              </button>
            </div>
          </div>
        </section>
      </article>
    </Page>
  )
}
