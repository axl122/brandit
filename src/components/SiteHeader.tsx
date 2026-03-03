import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function SiteHeader() {
  return (
    <header className="siteHeader">
      <div className="container siteHeader__inner">
        <Link to="/home" className="brandMark" aria-label="BrandIt">
          <span className="brandMark__dot" aria-hidden="true" />
          BrandIt
        </Link>

        <div className="siteHeader__right">
          <button
            type="button"
            className="btn btn--primary siteHeader__cta"
            onClick={() => window.dispatchEvent(new Event('consultation:open'))}
          >
            <span className="desktop-only">Start a project</span>
            <Calendar className="mobile-only" size={20} />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
