import { useEffect, useState } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import Page from '../components/Page'
import { blogPosts } from './blogData'
import type { BlogPost } from '../types/blog'

type RevealProps = PropsWithChildren<{ delay?: number }>

function Reveal({ children, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.6, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Reveal delay={index * 0.05}>
      <Link to={`/blog/${post.slug}`} className="blogCard">
        <div
          className="blogCard__gradient"
          style={{ background: post.gradient }}
        />
        <div className="blogCard__content">
          <div className="blogCard__meta">
            <span className="blogCard__category">{post.category}</span>
            <span className="blogCard__dot">•</span>
            <span className="blogCard__time">{post.readingTime} read</span>
          </div>
          <h3 className="blogCard__title">{post.title}</h3>
          <p className="blogCard__excerpt">{post.excerpt}</p>
          <div className="blogCard__footer">
            <span className="blogCard__date">
              {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
            <span className="blogCard__more">Read Article →</span>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

export default function Blog() {
  const [currentPage, setCurrentPage] = useState(1)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const postsPerPage = 5
  
  // Show 3 posts initially, then 5 per page
  const initialPostsToShow = 3
  const isFirstPage = currentPage === 1
  
  const indexOfLastPost = isFirstPage ? initialPostsToShow : (currentPage - 1) * postsPerPage + initialPostsToShow
  const currentPosts = blogPosts.slice(0, indexOfLastPost)
  const hasMore = indexOfLastPost < blogPosts.length

  const handleNext = () => {
    setCurrentPage(prev => prev + 1)
  }

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <Page title="BLOG" lead="Insights on clarity, consistency, and execution.">
      <section className="homeSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Latest Insights</h2>
          <p className="sectionSubtitle">Practical insights for building premium brands.</p>
        </div>

        <div className="blogGrid">
          <AnimatePresence mode="popLayout">
            {currentPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index % postsPerPage} />
            ))}
          </AnimatePresence>
        </div>

        {hasMore && (
          <div className="blogActions">
            <button 
              onClick={handleNext} 
              className="btn btn--primary"
              style={{ marginTop: '3rem' }}
            >
              Load more
            </button>
          </div>
        )}

        {showScrollTop && (
          <button className="scrollTopBtn" onClick={scrollToTop} aria-label="Scroll to top">
            ↑
          </button>
        )}
      </section>

      <section className="homeSection section--tint">
        <Reveal>
          <div className="ctaCard">
            <div>
              <h2 className="ctaTitle">Need help with your brand?</h2>
              <p className="ctaText">Book a consultation — let’s build it properly.</p>
            </div>
            <div className="ctaActions">
              <Link
                to="/contact"
                className="btn btn--primary"
                onClick={(e) => {
                  e.preventDefault()
                  window.dispatchEvent(new Event('consultation:open'))
                }}
              >
                Book a free consultation
              </Link>
              <Link to="/services" className="btn">Explore Services</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </Page>
  )
}

