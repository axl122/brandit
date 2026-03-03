import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="siteFooter">
      <div className="container">
        <div className="siteFooter__grid">
          <div className="footerBrand">
            <NavLink to="/home" className="brandMark" aria-label="BrandIt">
              <span className="brandMark__dot" aria-hidden="true" />
              BrandIt
            </NavLink>
            <p className="footerText">
              The powerhouse of brand identity — built properly and managed consistently so you’re remembered, not just seen.
            </p>
          </div>

          <div className="footerCol">
            <h4 className="footerTitle">Explore</h4>
            <div className="footerLinks">
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/process">Process</NavLink>
              <NavLink to="/services">Services</NavLink>
              <NavLink to="/pricing">Pricing</NavLink>
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              <NavLink to="/privacy">Privacy</NavLink>
              <NavLink to="/terms">Terms</NavLink>
            </div>
          </div>

          <div className="footerCol">
            <h4 className="footerTitle">What we do</h4>
            <div className="footerLinks">
              <a href="/home#what">Brand Positioning & Branding</a>
              <a href="/home#what">Social Media Management</a>
              <a href="/home#who">Who we help</a>
              <a href="/home#why">Why BrandIt</a>
            </div>
          </div>

          <div className="footerCol">
            <h4 className="footerTitle">Start</h4>
            <div className="footerLinks footerLinks--cta">
              <NavLink
                to="/contact"
                className="btn btn--primary"
                onClick={(e) => {
                  e.preventDefault()
                  window.dispatchEvent(new Event('consultation:open'))
                }}
              >
                Book a free consultation
              </NavLink>
            </div>
            <div className="footerLinks footerLinks--meta">
              <a href="mailto:branditfirm080@gmail.com">branditfirm080@gmail.com</a>
              <a href="https://wa.me/2348157884986" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <span className="footerMeta">Typically within 24 hours.</span>
            </div>
          </div>
        </div>

        <div className="footerBottom">
          <small>© {new Date().getFullYear()} BrandIt. All rights reserved.</small>
        </div>
      </div>
    </footer>
  )
}
