import { Link } from 'react-router-dom'
import './home.css'

const missionCards = [
  {
    title: 'Choose Your Target',
    description: 'Employee, Senior Employee, Manager or CEO',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 19c1.5-3 4.2-4.5 8-4.5S18.5 16 20 19" />
      </svg>
    ),
  },
  {
    title: 'Select a Technique',
    description: 'Phishing, Fake Social Profile or Deepfake',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v18M3 12h18" />
        <circle cx="12" cy="12" r="7" />
      </svg>
    ),
  },
  {
    title: 'Learn the Defence',
    description: 'Every outcome explains how the company could respond',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l7 3v6c0 4.4-3 8.2-7 10-4-1.8-7-5.6-7-10V6l7-3Z" />
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <main className="home">
      <div className="home-grid-overlay" aria-hidden="true" />

      <header className="home-header">
        <div className="home-brand">
          <span className="home-brand-name">Breach Point</span>
          <span className="home-brand-tagline">
            Social Engineering Awareness Simulation
          </span>
        </div>

        <div className="home-radar" aria-label="Exposure radar">
          <div className="home-radar-circle">
            <span className="home-radar-blip" />
          </div>

          <div className="home-radar-legend">
            <div className="home-radar-title">
              Exposure
              <br />
              Radar
            </div>

            <div className="home-radar-item">
              <span className="home-dot low" />
              Low
            </div>

            <div className="home-radar-item">
              <span className="home-dot elevated" />
              Elevated
            </div>

            <div className="home-radar-item">
              <span className="home-dot high" />
              High
            </div>
          </div>
        </div>
      </header>

      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-eyebrow">Corporate breach simulation</p>

          <h1>
            Can you bankrupt the company before you&apos;re detected?
          </h1>

          <p className="home-intro-copy">
            Choose fictional targets, test social engineering techniques, and
            learn how organisations can defend themselves.
          </p>

          <div className="home-auth-badge">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            </svg>
            Authorised educational simulation
          </div>

          <div className="home-actions">
            <Link to="/gameplay" className="primary-button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7-11-7Z" />
              </svg>
              Start simulation
            </Link>

            <Link to="/how-to-play" className="outline-button">
              How to play
            </Link>
          </div>

          <Link to="/learn-about-scams" className="home-learn-link">
            Learn about scams <span aria-hidden="true">›</span>
          </Link>
        </div>

        <div className="home-stats">
          <div className="home-stat-card">
            <div className="home-stat-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>

            <div>
              <div className="home-stat-value">$5,000,000</div>
              <div className="home-stat-label">Company funds</div>
            </div>
          </div>

          <div className="home-stat-card">
            <div className="home-stat-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3l7 3v6c0 4.4-3 8.2-7 10-4-1.8-7-5.6-7-10V6l7-3Z" />
              </svg>
            </div>

            <div>
              <div className="home-stat-value">0%</div>
              <div className="home-stat-label">Exposure</div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-flow" aria-label="Simulation flow">
        {missionCards.map((card) => (
          <article className="home-flow-card" key={card.title}>
            <div className="home-flow-icon">{card.icon}</div>

            <div>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </div>

            <span className="home-flow-arrow" aria-hidden="true">
              ›
            </span>
          </article>
        ))}
      </section>

      <footer className="home-disclaimer">
        <span>Fictional targets</span>
        <i aria-hidden="true" />
        <span>No user data collected</span>
        <i aria-hidden="true" />
        <span>Educational use only</span>
      </footer>
    </main>
  )
}
