import Page from '../components/Page'

export default function Privacy() {
  return (
    <Page
      title="PRIVACY POLICY"
      lead="We respect your privacy. This page explains what we collect and how we use it."
    >
      <section className="homeSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Overview</h2>
          <p className="sectionSubtitle">
            BrandIt collects only the information needed to respond to enquiries, deliver services, and improve the website.
          </p>
        </div>

        <div className="grid grid--2">
          <div className="card">
            <h3 className="cardTitle">What we collect</h3>
            <ul className="list">
              <li>Contact details you submit (name, email, phone number)</li>
              <li>Service preferences and notes you provide</li>
              <li>Basic usage data (if analytics cookies are enabled)</li>
              <li>Payment confirmation status from our payment provider</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="cardTitle">How we use it</h3>
            <ul className="list">
              <li>To contact you about your request and next steps</li>
              <li>To deliver branding and management services</li>
              <li>To improve site experience and performance</li>
              <li>To prevent abuse and maintain security</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="homeSection section--tint">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Cookies</h2>
          <p className="sectionSubtitle">
            We use cookies for essential functionality and optionally for analytics (only if you consent).
          </p>
        </div>

        <div className="card">
          <p className="cardText">
            You can decline analytics cookies and still use the website. Essential cookies may be required for security and core
            functionality.
          </p>
        </div>
      </section>

      <section className="homeSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Contact</h2>
          <p className="sectionSubtitle">Questions about privacy? Reach out and we’ll respond within 24 hours.</p>
        </div>

        <div className="card">
          <div className="ctaActions">
            <a className="btn" href="mailto:branditfirm080@gmail.com">branditfirm080@gmail.com</a>
            <a className="btn btn--primary" href="https://wa.me/2348157884986" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Page>
  )
}
