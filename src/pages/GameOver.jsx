import { Link, useLocation } from 'react-router-dom'
import './game-over.css'
import marcusPortrait from '../assets/targets/marcus-reyes.jpg'

const startingFunds = 5_000_000
const formatMoney = (value) => new Intl.NumberFormat('en-AU', {
  style: 'currency', currency: 'AUD', maximumFractionDigits: 0,
}).format(value)

const icons = {
  restart: <path d="M20 6v6h-6M19 13a7 7 0 1 1-2-5.1" />,
  home: <path d="m4 11 8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9Z" />,
  shield: <path d="M12 3 20 6v6c0 5-3.3 8.2-8 10-4.7-1.8-8-5-8-10V6l8-3Z" />,
  warning: <><path d="M12 3 20 6v6c0 5-3.3 8.2-8 10-4.7-1.8-8-5-8-10V6l8-3Z" /><path d="M12 8v6M12 17h.01" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.6-4 4.2-6 8-6s6.4 2 8 6" /></>,
  mask: <path d="M3 9c3.4-1.2 6.4-1.1 9 1 2.6-2.1 5.6-2.2 9-1v3.5c0 3.2-2.5 5.5-5.6 5.5-1.7 0-2.8-.6-3.4-1.7-.6 1.1-1.7 1.7-3.4 1.7C5.5 18 3 15.7 3 12.5V9Zm4 3.2h3.2M13.8 12.2H17" />,
  phone: <path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 13h4" />,
  hook: <path d="M15 4a3 3 0 1 1-6 0M12 7v8a5 5 0 1 1-5-5" />,
  profile: <><rect x="4" y="5" width="16" height="14" rx="2" /><circle cx="10" cy="11" r="2" /><path d="M7 16c.8-1.6 1.8-2.4 3-2.4s2.2.8 3 2.4M15 10h3M15 14h3" /></>,
  database: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></>,
}

const Icon = ({ type }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    {icons[type]}
  </svg>
)

const defaultSummary = {
  reason: 'detected',
  turnsPlayed: 6,
  startingFunds,
  fundsRemaining: 2_400_000,
  fundsRemoved: 2_600_000,
  exposure: 100,
  exposureGain: 22,
  finalTarget: 'Alex Morgan',
  technique: 'Deepfake',
  subtype: 'Voice call',
  techniqueCounts: { phishing: 3, social: 2, deepfake: 1 },
}

export default function GameOver() {
  const { state } = useLocation()
  const summary = { ...defaultSummary, ...(state ?? {}) }
  const isDetected = summary.reason === 'detected'
  const fundsPercent = Math.max(0, Math.min(100, (summary.fundsRemaining / summary.startingFunds) * 100))
  const exposurePercent = Math.max(0, Math.min(100, summary.exposure))

  return (
    <main className="game-over-page">
      <div className="game-over-backdrop" style={{ '--game-over-image': `url(${marcusPortrait})` }} aria-hidden="true" />

      <section className="game-over-shell" aria-labelledby="game-over-title">
        <header className="game-over-header">
          <div>
            <Link className="game-over-brand" to="/">BREACH POINT</Link>
            <p>SOCIAL ENGINEERING AWARENESS SIMULATION</p>
          </div>

          <Link className="game-over-utility" to="/gameplay">
            <Icon type="restart" />
            Restart
          </Link>
        </header>

        <section className="game-over-hero">
          <div className="game-over-alert" aria-hidden="true">
            <Icon type={isDetected ? 'warning' : 'shield'} />
          </div>
          <div>
            <h1 id="game-over-title">{isDetected ? 'Game Over' : 'Simulation Complete'}</h1>
            <p className="game-over-status">{isDetected ? 'Attacker Detected' : 'Company Bankrupted'}</p>
            <p className="game-over-reason">
              {isDetected
                ? 'Your attacker exposure reached 100% before the company was bankrupted.'
                : 'The company funds reached $0 before your attacker exposure hit 100%.'}
            </p>
          </div>
        </section>

        <section className="game-over-meter funds" aria-label="Company funds remaining">
          <span>Company funds remaining</span>
          <div><i style={{ width: `${fundsPercent}%` }} /></div>
          <strong>{formatMoney(summary.fundsRemaining)}</strong>
          <small>Starting funds: {formatMoney(summary.startingFunds)}</small>
        </section>

        <section className="game-over-meter exposure" aria-label="Attacker exposure">
          <Icon type="shield" />
          <span>Attacker exposure</span>
          <div><i style={{ width: `${exposurePercent}%` }} /></div>
          <strong>{summary.exposure}%</strong>
          <small>{isDetected ? 'Detected' : 'Undetected'}</small>
        </section>

        <section className="game-over-grid">
          <article className="game-over-panel why-panel">
            <div className="game-over-panel-title danger"><Icon type="warning" /> Why you were {isDetected ? 'detected' : 'successful'}</div>
            <p>
              {isDetected
                ? 'Several techniques and types were poorly matched to the selected targets. Those attempts increased your exposure and allowed the company defences to identify the pattern.'
                : 'Your selected techniques removed the remaining funds before the defensive exposure threshold was reached.'}
            </p>

            <div className="final-turn">
              <div><Icon type="user" /><span>Final target</span><strong>{summary.finalTarget}</strong></div>
              <div><Icon type="mask" /><span>Technique</span><strong>{summary.technique}</strong></div>
              <div><Icon type="phone" /><span>Type</span><strong>{summary.subtype}</strong></div>
            </div>

            <div className="final-exposure">
              <Icon type="warning" />
              <span>Final turn exposure</span>
              <strong>+{summary.exposureGain}% exposure</strong>
            </div>
          </article>

          <article className="game-over-panel summary-panel">
            <div className="game-over-panel-title">Playthrough summary</div>
            <dl>
              <div><dt>Turns played</dt><dd>{summary.turnsPlayed}</dd></div>
              <div><dt>Company funds removed</dt><dd>{formatMoney(summary.fundsRemoved)}</dd></div>
              <div><dt>Company funds remaining</dt><dd>{formatMoney(summary.fundsRemaining)}</dd></div>
              <div><dt>Final exposure</dt><dd className={isDetected ? 'danger-text' : ''}>{summary.exposure}%</dd></div>
            </dl>

            <div className="technique-summary">
              <div><Icon type="hook" /><span>Phishing</span><strong>{summary.techniqueCounts.phishing}</strong></div>
              <div><Icon type="profile" /><span>Fake social profile</span><strong>{summary.techniqueCounts.social}</strong></div>
              <div><Icon type="mask" /><span>Deepfake</span><strong>{summary.techniqueCounts.deepfake}</strong></div>
            </div>
          </article>
        </section>

        <section className="takeaway-panel">
          <Icon type="shield" />
          <div>
            <h2>Defensive takeaway</h2>
            <p>Verify unusual requests, question urgent messages and report suspicious contact before responding.</p>
            <ul>
              <li>Confirm identities through a trusted channel.</li>
              <li>Check messages for warning signs.</li>
              <li>Report suspicious activity early.</li>
            </ul>
            <p>Social engineering targets people as well as technology. Awareness and verification are essential defences.</p>
          </div>
        </section>

        <nav className="game-over-actions" aria-label="Game over actions">
          <Link className="primary-game-over-action" to="/gameplay"><Icon type="restart" /> Try again</Link>
          <Link to="/"><Icon type="home" /> Back to home</Link>
          <Link to="/how-to-play"><Icon type="shield" /> Learn about scams</Link>
        </nav>

        <footer className="game-over-footer">
          <span>Fictional targets</span><i />
          <span>No user data collected</span><i />
          <span>Educational use only</span>
        </footer>
      </section>
    </main>
  )
}