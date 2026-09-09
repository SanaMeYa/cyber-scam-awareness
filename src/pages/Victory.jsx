import { Link, useLocation } from 'react-router-dom'
import './victory.css'

const startingFunds = 5_000_000
const formatMoney = (value) => new Intl.NumberFormat('en-AU', {
  style: 'currency', currency: 'AUD', maximumFractionDigits: 0,
}).format(value)

const icons = {
  restart: <path d="M20 6v6h-6M19 13a7 7 0 1 1-2-5.1" />,
  home: <path d="m4 11 8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9Z" />,
  shieldCheck: <><path d="M12 3 20 6v6c0 5-3.3 8.2-8 10-4.7-1.8-8-5-8-10V6l8-3Z" /><path d="m8.5 12 2.4 2.4L16 9" /></>,
  trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 5H5a2 2 0 0 0 0 4h1M16 5h3a2 2 0 0 1 0 4h-1M10 15v3h-2v2h8v-2h-2v-3" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.6-4 4.2-6 8-6s6.4 2 8 6" /></>,
  mask: <path d="M3 9c3.4-1.2 6.4-1.1 9 1 2.6-2.1 5.6-2.2 9-1v3.5c0 3.2-2.5 5.5-5.6 5.5-1.7 0-2.8-.6-3.4-1.7-.6 1.1-1.7 1.7-3.4 1.7C5.5 18 3 15.7 3 12.5V9Zm4 3.2h3.2M13.8 12.2H17" />,
  phone: <path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 13h4" />,
  hook: <path d="M15 4a3 3 0 1 1-6 0M12 7v8a5 5 0 1 1-5-5" />,
  profile: <><rect x="4" y="5" width="16" height="14" rx="2" /><circle cx="10" cy="11" r="2" /><path d="M7 16c.8-1.6 1.8-2.4 3-2.4s2.2.8 3 2.4M15 10h3M15 14h3" /></>,
  coins: <path d="M12 3 20 6v6c0 5-3.3 8.2-8 10-4.7-1.8-8-5-8-10V6l8-3Z" />,
}

const Icon = ({ type }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    {icons[type]}
  </svg>
)

const defaultSummary = {
  reason: 'bankrupt',
  turnsPlayed: 9,
  startingFunds,
  fundsRemaining: 0,
  fundsRemoved: startingFunds,
  exposure: 64,
  exposureGain: 12,
  finalTarget: 'Sarah Lindqvist',
  technique: 'Phishing',
  subtype: 'Email',
  techniqueCounts: { phishing: 4, social: 3, deepfake: 2 },
}

const winCopy = {
  bankrupt: {
    status: 'Company Bankrupted',
    reason: 'Company funds reached $0 before your attacker exposure hit 100%.',
    panelTitle: 'How you succeeded',
    panelText: 'Your selected techniques were well matched to each target, removing company funds faster than the defences could build a case against you. Exposure stayed below the detection threshold for the whole simulation.',
    drainLabel: 'Final turn funds removed',
  },
  ceo: {
    status: 'CEO Compromised',
    reason: 'You successfully compromised the CEO before your attacker exposure hit 100%.',
    panelTitle: 'How you succeeded',
    panelText: 'Your final attempt got past the CEO\u2019s defences: a high-value, high-difficulty target compromised while remaining undetected. That level of access exposes the company to further, more serious attacks.',
    drainLabel: 'Final turn CEO exposure',
  },
}

export default function Victory() {
  const { state } = useLocation()
  const summary = { ...defaultSummary, ...(state ?? {}) }
  const copy = winCopy[summary.reason] ?? winCopy.bankrupt
  const fundsPercent = Math.max(0, Math.min(100, (summary.fundsRemaining / summary.startingFunds) * 100))
  const exposurePercent = Math.max(0, Math.min(100, summary.exposure))

  return (
    <main className="victory-page">
      <div className="victory-backdrop" aria-hidden="true">
        <svg viewBox="0 0 400 220" preserveAspectRatio="none">
          <path d="M0 40 L60 55 L110 48 L150 90 L190 78 L230 140 L270 122 L310 175 L350 160 L400 210" />
          <path d="M0 40 L60 55 L110 48 L150 90 L190 78 L230 140 L270 122 L310 175 L350 160 L400 210 L400 220 L0 220 Z" fill="rgba(53,230,164,.08)" stroke="none" />
        </svg>
      </div>

      <section className="victory-shell" aria-labelledby="victory-title">
        <header className="victory-header">
          <div>
            <Link className="victory-brand" to="/">BREACH POINT</Link>
            <p>SOCIAL ENGINEERING AWARENESS SIMULATION</p>
          </div>

          <Link className="victory-utility" to="/gameplay">
            <Icon type="restart" />
            Restart
          </Link>
        </header>

        <section className="victory-hero">
          <div className="victory-badge" aria-hidden="true">
            <Icon type="trophy" />
          </div>
          <div>
            <h1 id="victory-title">Simulation Complete</h1>
            <p className="victory-status">{copy.status}</p>
            <p className="victory-reason">{copy.reason}</p>
          </div>
        </section>

        <section className="victory-meter funds" aria-label="Company funds remaining">
          <span>Company funds remaining</span>
          <div><i style={{ width: `${fundsPercent}%` }} /></div>
          <strong>{formatMoney(summary.fundsRemaining)}</strong>
          <small>Starting funds: {formatMoney(summary.startingFunds)}</small>
        </section>

        <section className="victory-meter exposure" aria-label="Attacker exposure">
          <Icon type="shieldCheck" />
          <span>Attacker exposure</span>
          <div><i style={{ width: `${exposurePercent}%` }} /></div>
          <strong>{summary.exposure}%</strong>
          <small>Undetected</small>
        </section>

        <section className="victory-grid">
          <article className="victory-panel victory-why">
            <div className="victory-panel-title win"><Icon type="trophy" /> {copy.panelTitle}</div>
            <p>{copy.panelText}</p>

            <div className="final-turn">
              <div><Icon type="user" /><span>Final target</span><strong>{summary.finalTarget}</strong></div>
              <div><Icon type="mask" /><span>Technique</span><strong>{summary.technique}</strong></div>
              <div><Icon type="phone" /><span>Type</span><strong>{summary.subtype}</strong></div>
            </div>

            <div className="final-drain">
              <Icon type={summary.reason === 'ceo' ? 'user' : 'coins'} />
              <span>{copy.drainLabel}</span>
              <strong>+{summary.exposureGain}% exposure</strong>
            </div>
          </article>

          <article className="victory-panel victory-summary">
            <div className="victory-panel-title">Playthrough summary</div>
            <dl>
              <div><dt>Turns played</dt><dd>{summary.turnsPlayed}</dd></div>
              <div><dt>Company funds removed</dt><dd className="win-text">{formatMoney(summary.fundsRemoved)}</dd></div>
              <div><dt>Company funds remaining</dt><dd>{formatMoney(summary.fundsRemaining)}</dd></div>
              <div><dt>Final exposure</dt><dd>{summary.exposure}%</dd></div>
            </dl>

            <div className="technique-summary">
              <div><Icon type="hook" /><span>Phishing</span><strong>{summary.techniqueCounts.phishing}</strong></div>
              <div><Icon type="profile" /><span>Fake social profile</span><strong>{summary.techniqueCounts.social}</strong></div>
              <div><Icon type="mask" /><span>Deepfake</span><strong>{summary.techniqueCounts.deepfake}</strong></div>
            </div>
          </article>
        </section>

        <section className="victory-takeaway">
          <Icon type="shieldCheck" />
          <div>
            <h2>Defensive takeaway</h2>
            <p>Every technique that worked here exploited a real gap. The same verification habits close it.</p>
            <ul>
              <li>Confirm identities through a trusted channel.</li>
              <li>Check messages for warning signs.</li>
              <li>Report suspicious activity early.</li>
            </ul>
            <p>Social engineering targets people as well as technology. Awareness and verification are essential defences.</p>
          </div>
        </section>

        <nav className="victory-actions" aria-label="Victory actions">
          <Link className="primary-victory-action" to="/gameplay"><Icon type="restart" /> Play again</Link>
          <Link to="/"><Icon type="home" /> Back to home</Link>
          <Link to="/how-to-play"><Icon type="shieldCheck" /> Learn about scams</Link>
        </nav>

        <footer className="victory-footer">
          <span>Fictional targets</span><i />
          <span>No user data collected</span><i />
          <span>Educational use only</span>
        </footer>
      </section>
    </main>
  )
}
