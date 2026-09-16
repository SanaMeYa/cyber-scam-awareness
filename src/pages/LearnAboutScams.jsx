import { Link } from 'react-router-dom'
import './learn-about-scams.css'

const learningResources = [
  {
    tag: 'SCAMWATCH',
    title: 'Explore common types of scams',
    description: 'Learn how scams arrive through email, text, phone calls, social media and fraudulent websites.',
    href: 'https://www.scamwatch.gov.au/types-of-scams',
  },
  {
    tag: 'SCAMWATCH',
    title: 'Understand scammer methods',
    description: 'Recognise impersonation, manufactured urgency and emotional pressure across different scam types.',
    href: 'https://www.scamwatch.gov.au/stop-check-protect/help-to-spot-and-avoid-scams/methods-scammers-use',
  },
  {
    tag: 'AUSTRALIAN CYBER SECURITY CENTRE',
    title: 'Recognise and report scams',
    description: 'Review practical warning signs and learn why important requests should be checked through a trusted source.',
    href: 'https://www.cyber.gov.au/learn-basics/explore-basics/recognise-and-report-scams',
  },
  {
    tag: 'AUSTRALIAN CYBER SECURITY CENTRE',
    title: 'Learn about phishing',
    description: 'Understand fraudulent emails, text messages and targeted phishing attempts designed to steal information.',
    href: 'https://www.cyber.gov.au/threats/types-threats/phishing',
  },
  {
    tag: 'eSAFETY COMMISSIONER',
    title: 'Stay safer around online scams',
    description: 'Find accessible advice about suspicious messages, fake identities, account safety and what to do after a scam.',
    href: 'https://www.esafety.gov.au/key-topics/staying-safe/online-scams',
  },
  {
    tag: 'BE CONNECTED',
    title: 'Practise identifying scams',
    description: 'Use free activities covering phishing, SMS, investment, romance, remote-access and shopping scams.',
    href: 'https://beconnected.esafety.gov.au/topic-library/identifying-and-avoiding-scams',
  },
]

const reportingResources = [
  {
    title: 'Report suspicious activity to Scamwatch',
    description: 'Reports help the National Anti-Scam Centre identify scam trends and warn other Australians.',
    href: 'https://www.scamwatch.gov.au/report-a-scam',
  },
  {
    title: 'Report cybercrime through ReportCyber',
    description: 'Use the Australian Government reporting service when money, information or accounts have been stolen or compromised.',
    href: 'https://www.cyber.gov.au/report-and-recover/report?mode=consumerapp',
  },
  {
    title: 'Find recovery guidance',
    description: 'Get official steps for compromised accounts, identity theft, scams, malware and other cyber incidents.',
    href: 'https://www.cyber.gov.au/report-and-recover',
  },
]

function ExternalLink({ resource, report = false }) {
  return (
    <a className={report ? 'scam-report-card' : 'scam-resource-card'} href={resource.href} target="_blank" rel="noreferrer">
      {!report && <span>{resource.tag}</span>}
      <strong>{resource.title}</strong>
      <p>{resource.description}</p>
      <small>OPEN OFFICIAL RESOURCE <i aria-hidden="true">↗</i></small>
    </a>
  )
}

export default function LearnAboutScams() {
  return (
    <main className="learn-scams">
      <div className="learn-scams-grid" aria-hidden="true" />

      <header className="learn-scams-header">
        <Link className="learn-scams-brand" to="/" aria-label="Breach Point home">
          <strong>BREACH POINT</strong>
          <span>SOCIAL ENGINEERING AWARENESS SIMULATION</span>
        </Link>
        <Link className="learn-scams-home" to="/"><span aria-hidden="true">←</span> BACK TO HOME</Link>
      </header>

      <section className="learn-scams-hero">
        <span className="learn-scams-eyebrow">KNOWLEDGE // TRUSTED EXTERNAL RESOURCES</span>
        <h1>LEARN ABOUT SCAMS</h1>
        <p>Continue beyond the simulation with current guidance from official Australian organisations. Learn how to recognise suspicious contact, verify requests and report scams safely.</p>

        <div className="stop-check-protect" aria-label="Stop Check Protect">
          <article><span>01</span><div><strong>STOP</strong><p>Do not let urgency pressure you into acting immediately.</p></div></article>
          <article><span>02</span><div><strong>CHECK</strong><p>Verify the person or organisation using contact details you find independently.</p></div></article>
          <article><span>03</span><div><strong>PROTECT</strong><p>Block, report and act quickly if money or information may be at risk.</p></div></article>
        </div>
      </section>

      <section className="learn-scams-section" aria-labelledby="learning-resources-title">
        <header><span>01 // RECOGNISE AND PREVENT</span><h2 id="learning-resources-title">Official learning resources</h2><p>These links open official external websites in a new tab.</p></header>
        <div className="scam-resource-grid">
          {learningResources.map((resource) => <ExternalLink key={resource.href} resource={resource} />)}
        </div>
      </section>

      <section className="learn-scams-section" aria-labelledby="reporting-resources-title">
        <header><span>02 // REPORT AND RECOVER</span><h2 id="reporting-resources-title">If something has already happened</h2><p>Act quickly and use the reporting option that matches what occurred.</p></header>

        <div className="urgent-scam-advice">
          <span aria-hidden="true">!</span>
          <div><strong>MONEY OR ACCOUNT DETAILS AT RISK?</strong><p>Contact your bank using a trusted number immediately. If anyone is in immediate danger, call Triple Zero (000).</p></div>
        </div>

        <div className="scam-report-grid">
          {reportingResources.map((resource) => <ExternalLink key={resource.href} resource={resource} report />)}
        </div>
      </section>

      <footer className="learn-scams-footer">
        <p>Breach Point is an educational simulation and does not replace professional, financial, legal or emergency advice.</p>
        <div><Link to="/">BACK TO HOME</Link><Link to="/gameplay">START SIMULATION</Link></div>
      </footer>
    </main>
  )
}
