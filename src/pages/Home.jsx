import { Link } from 'react-router-dom'
import './home.css'

const missionCards = [
  {
    step: '01',
    title: 'Choose Your Target',
    description: 'Assess employees from entry level through to the CEO.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c1.4-3.6 4.1-5.4 8-5.4s6.6 1.8 8 5.4" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Select a Technique',
    description: 'Test phishing, fake social profiles, and deepfakes.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16v12H4z" />
        <path d="m5 7 7 6 7-6M8 21h8" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Learn the Defence',
    description: 'See how warning signs and safeguards reduce real-world risk.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 19 6v6c0 4.4-3 8.2-7 10-4-1.8-7-5.6-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    ),
  },
]

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 19 6v6c0 4.4-3 8.2-7 10-4-1.8-7-5.6-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  )
}

export default function Home() {
  return (
    <main className="home">
      <div className="home-ambient home-ambient-one" aria-hidden="true" />
      <div className="home-ambient home-ambient-two" aria-hidden="true" />
      <div className="home-grid-overlay" aria-hidden="true" />

      <header className="home-header">
        <Link to="/" className="home-brand" aria-label="Breach Point home">
          <span className="home-brand-mark" aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="home-brand-copy">
            <span className="home-brand-name">Breach Point</span>
            <span className="home-brand-tagline">
              Social Engineering Awareness Simulation
            </span>
          </span>
        </Link>

        <nav className="home-nav" aria-label="Primary navigation">
          <Link to="/how-to-play">How to play</Link>
          <Link to="/learn-about-scams">Scam awareness</Link>
        </nav>

        <div className="home-system-status" aria-label="Simulation system ready">
          <span className="home-system-pulse" aria-hidden="true" />
          <span>
            System status
            <strong>Ready</strong>
          </span>
        </div>
      </header>

      <section className="home-hero">
        <div className="home-hero-copy">
          <div className="home-eyebrow">
            <span aria-hidden="true">///</span>
            Interactive cyber awareness
          </div>

          <h1>
            Outsmart the threat.
            <span>Protect the company.</span>
          </h1>

          <p className="home-intro-copy">
            Step inside a fictional social engineering simulation. Choose your
            targets, test attack techniques, and discover the human decisions
            that can place an entire organisation at risk.
          </p>

          <div className="home-auth-badge">
            <span className="home-auth-icon">
              <ShieldIcon />
            </span>
            <span>
              Safe training environment
              <small>Fictional targets · No personal data collected</small>
            </span>
          </div>

          <div className="home-actions">
            <Link to="/gameplay" className="primary-button">
              <span className="home-play-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="m9 6 9 6-9 6V6Z" />
                </svg>
              </span>
              Start simulation
              <span className="button-arrow" aria-hidden="true">→</span>
            </Link>

            <Link to="/how-to-play" className="outline-button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.8 9a2.3 2.3 0 1 1 3.5 2c-.9.5-1.3 1.1-1.3 2M12 17h.01" />
              </svg>
              How to play
            </Link>
          </div>

          <Link to="/learn-about-scams" className="home-learn-link">
            Explore the awareness library
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="home-command-visual" aria-label="Simulation overview">
          <div className="command-corner command-corner-tl" aria-hidden="true" />
          <div className="command-corner command-corner-tr" aria-hidden="true" />
          <div className="command-corner command-corner-bl" aria-hidden="true" />
          <div className="command-corner command-corner-br" aria-hidden="true" />

          <div className="command-header">
            <span>Simulation overview</span>
            <span className="command-live">
              <i aria-hidden="true" /> Live environment
            </span>
          </div>

          <div className="command-radar" aria-hidden="true">
            <div className="radar-scan" />
            <div className="radar-orbit radar-orbit-one" />
            <div className="radar-orbit radar-orbit-two" />
            <div className="radar-crosshair radar-crosshair-x" />
            <div className="radar-crosshair radar-crosshair-y" />

            <div className="radar-node radar-node-one">
              <span /> Phishing
            </div>
            <div className="radar-node radar-node-two">
              <span /> Deepfake
            </div>
            <div className="radar-node radar-node-three">
              <span /> Fake profile
            </div>

            <div className="radar-shield">
              <span className="radar-shield-ring" />
              <ShieldIcon />
              <strong>Company</strong>
              <small>Defence active</small>
            </div>
          </div>

          <div className="home-stats">
            <article className="home-stat-card">
              <span className="home-stat-kicker">Starting balance</span>
              <strong className="home-stat-value">$5,000,000</strong>
              <span className="home-stat-label">
                <i className="stat-dot-blue" aria-hidden="true" /> Company funds
              </span>
            </article>

            <article className="home-stat-card">
              <span className="home-stat-kicker">Initial risk</span>
              <strong className="home-stat-value">0%</strong>
              <span className="home-stat-label">
                <i className="stat-dot-cyan" aria-hidden="true" /> Attacker exposure
              </span>
            </article>
          </div>
        </div>
      </section>

      <section className="home-flow-section" aria-labelledby="simulation-flow-title">
        <div className="home-flow-heading">
          <span>How the simulation works</span>
          <h2 id="simulation-flow-title">Three steps. Every choice matters.</h2>
        </div>

        <div className="home-flow">
          {missionCards.map((card, index) => (
            <article className="home-flow-card" key={card.title}>
              <span className="home-flow-step">{card.step}</span>
              <div className="home-flow-icon">{card.icon}</div>
              <div className="home-flow-copy">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
              {index < missionCards.length - 1 && (
                <span className="home-flow-connector" aria-hidden="true">→</span>
              )}
            </article>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <span>Authorised educational simulation</span>
        <span className="home-footer-line" aria-hidden="true" />
        <span>Breach Point · Awareness through experience</span>
      </footer>
    </main>
  )
}
