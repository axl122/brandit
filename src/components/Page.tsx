import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import SiteHeader from './SiteHeader'
import Footer from './Footer'
import BackButton from './BackButton'

type PageProps = PropsWithChildren<{
  title: string
  lead?: string
}>

export default function Page({ title, lead, children }: PageProps) {
  return (
    <>
      <SiteHeader />
      <motion.main
        className="page"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <section className="pageHero">
          <div className="pageHero__particles" aria-hidden="true">
            <span className="pageHero__particle p1" />
            <span className="pageHero__particle p2" />
            <span className="pageHero__particle p3" />
            <span className="pageHero__particle p4" />
            <span className="pageHero__particle p5" />
            <span className="pageHero__particle p6" />
            <span className="pageHero__particle p7" />
            <span className="pageHero__particle p8" />
            <span className="pageHero__particle p9" />
            <span className="pageHero__particle p10" />
            <span className="pageHero__particle p11" />
            <span className="pageHero__particle p12" />
          </div>
          <div className="container">
            <h1 className="pageHero__title">{title}</h1>
            {lead ? <p className="pageHero__lead">{lead}</p> : null}
          </div>
          <div className="pageHero__curve" aria-hidden="true">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" role="presentation">
              <path d="M0,36 C240,72 520,86 720,72 C960,56 1160,36 1440,44 L1440,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        <div className="page__container">
          <div className="pageBackRow">
            <BackButton />
          </div>
          {children}
        </div>
        <Footer />
      </motion.main>
    </>
  )
}
