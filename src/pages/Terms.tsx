import Page from '../components/Page'

export default function Terms() {
  return (
    <Page
      title="TERMS"
      lead="These terms outline how BrandIt works and what you can expect when using the website or our services."
    >
      <section className="homeSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Using this website</h2>
          <p className="sectionSubtitle">By using this site, you agree to behave responsibly and not misuse the platform.</p>
        </div>

        <div className="grid grid--2">
          <div className="card">
            <h3 className="cardTitle">Acceptable use</h3>
            <ul className="list">
              <li>Do not attempt to hack, scrape, or disrupt the site</li>
              <li>Do not submit false payment confirmations or fake enquiries</li>
              <li>Use contact forms and messaging in good faith</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="cardTitle">Content & intellectual property</h3>
            <ul className="list">
              <li>BrandIt name, visuals, and website design are protected</li>
              <li>You may not copy or reuse our content without permission</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="homeSection section--tint">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Payments</h2>
          <p className="sectionSubtitle">Payments are processed by third-party providers (e.g., Paystack).</p>
        </div>

        <div className="card">
          <p className="cardText">
            Once payment is confirmed, BrandIt will contact you using the details you provided. Refunds, timelines, and delivery
            depend on the selected service and will be clarified during onboarding.
          </p>
        </div>
      </section>

      <section className="homeSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Project delivery</h2>
          <p className="sectionSubtitle">Timelines and deliverables depend on scope and your responsiveness.</p>
        </div>

        <div className="card">
          <ul className="list">
            <li>Delays can occur if required information/assets are not provided on time</li>
            <li>Revisions are handled according to the agreed package scope</li>
            <li>BrandIt may decline projects that do not align with our services or values</li>
          </ul>
        </div>
      </section>

      <section className="homeSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Contact</h2>
          <p className="sectionSubtitle">Questions about these terms? Reach out.</p>
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
