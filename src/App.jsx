import { useState } from 'react'
import './App.css'
import Gameplay from './Gameplay.jsx'

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

function App() {
  const [currentScreen, setCurrentScreen] = useState(() =>
    window.location.hash === '#gameplay' ? 'gameplay' : 'home',
  )

  if (currentScreen === 'gameplay') {
    return <Gameplay />
  }

  return (
    <div className="breach-page">
      <div className="page-shell">
        <header className="topbar">
          <div className="brand-block">
            <div className="brand-logo">BREACH POINT</div>
            <div className="brand-subtitle">SOCIAL ENGINEERING AWARENESS SIMULATION</div>
          </div>

          <div className="exposure-radar" aria-label="Exposure radar">
            <div className="radar-circle">
              <span className="radar-blip" />
            </div>
            <div className="radar-legend">
              <div className="radar-title">EXPOSURE<br />RADAR</div>
              <div className="legend-item">
                <span className="dot low" />
                LOW
              </div>
              <div className="legend-item">
                <span className="dot elevated" />
                ELEVATED
              </div>
              <div className="legend-item">
                <span className="dot high" />
                HIGH
              </div>
            </div>
          </div>
        </header>

        <main className="hero-layout">
          <section className="hero-copy">
            <h1>CAN YOU BANKRUPT THE COMPANY BEFORE YOU&apos;RE DETECTED?</h1>

            <p className="hero-description">
              Choose fictional targets, test social engineering techniques, and learn how
              organisations can defend themselves.
            </p>

            <div className="auth-badge">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              </svg>
              AUTHORISED EDUCATIONAL SIMULATION
            </div>

            <div className="cta-row">
              <a
                href="#gameplay"
                className="btn-primary"
                onClick={() => setCurrentScreen('gameplay')}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7-11-7Z" />
                </svg>
                START SIMULATION
              </a>
              <a href="/how-to-play.html" className="btn-secondary">
                HOW TO PLAY
              </a>
            </div>

            <a href="#" className="learn-link">
              LEARN ABOUT SCAMS <span aria-hidden="true">›</span>
            </a>
          </section>

          <div className="hero-scene" aria-hidden="true">
            <div className="scene-glow" />
            <div className="stat-stack">
              <div className="info-panel">
                <div className="panel-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </div>
                <div className="panel-copy">
                  <div className="panel-value">$5,000,000</div>
                  <div className="panel-label">COMPANY FUNDS</div>
                </div>
              </div>

              <div className="info-panel">
                <div className="panel-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3l7 3v6c0 4.4-3 8.2-7 10-4-1.8-7-5.6-7-10V6l7-3Z" />
                  </svg>
                </div>
                <div className="panel-copy">
                  <div className="panel-value">0%</div>
                  <div className="panel-label">EXPOSURE</div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <section className="flow-cards" aria-label="Simulation flow">
          {missionCards.map((card) => (
            <article className="feature-card" key={card.title}>
              <div className="card-icon">{card.icon}</div>
              <div className="card-copy">
                <h2>{card.title}</h2>
                <p>{card.description}</p>
              </div>
              <span className="card-arrow" aria-hidden="true">
                ›
              </span>
            </article>
          ))}
        </section>

        <footer className="footer-note">
          FICTIONAL TARGETS • NO USER DATA COLLECTED • EDUCATIONAL USE ONLY
        </footer>
      </div>
    </div>
  )
}

export default App
