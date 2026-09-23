import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './game-over.css'

const startingFunds = 5_000_000

const formatMoney = (value = 0) => new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
}).format(value)

const icons = {
  restart: <path d="M20 6v6h-6M19 13a7 7 0 1 1-2-5.1" />,
  home: <path d="m4 11 8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9Z" />,
  shield: <path d="M12 3 20 6v6c0 5-3.3 8.2-8 10-4.7-1.8-8-5-8-10V6l8-3Z" />,
  warning: (
    <>
      <path d="M12 3 20 6v6c0 5-3.3 8.2-8 10-4.7-1.8-8-5-8-10V6l8-3Z" />
      <path d="M12 8v6M12 17h.01" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.6-4 4.2-6 8-6s6.4 2 8 6" />
    </>
  ),
  mask: <path d="M3 9c3.4-1.2 6.4-1.1 9 1 2.6-2.1 5.6-2.2 9-1v3.5c0 3.2-2.5 5.5-5.6 5.5-1.7 0-2.8-.6-3.4-1.7-.6 1.1-1.7 1.7-3.4 1.7C5.5 18 3 15.7 3 12.5V9Zm4 3.2h3.2M13.8 12.2H17" />,
  phone: <path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 13h4" />,
  hook: <path d="M15 4a3 3 0 1 1-6 0M12 7v8a5 5 0 1 1-5-5" />,
  profile: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="10" cy="11" r="2" />
      <path d="M7 16c.8-1.6 1.8-2.4 3-2.4s2.2.8 3 2.4M15 10h3M15 14h3" />
    </>
  ),
  graph: (
    <>
      <path d="M4 20V10M10 20V5M16 20v-8M22 20V3M2 20h22" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  book: (
    <>
      <path d="M3 5c3.5-1 6.5-.4 9 2v14c-2.5-2.4-5.5-3-9-2V5ZM21 5c-3.5-1-6.5-.4-9 2v14c2.5-2.4 5.5-3 9-2V5Z" />
      <path d="m8 10 2 2 3-4" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
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
  targetsCompleted: 3,
  totalTargets: 5,
  techniqueCounts: { phishing: 3, social: 2, deepfake: 1 },
}

const tabs = [
  { id: 'overview', label: 'Incident overview', icon: 'warning' },
  { id: 'final-turn', label: 'Final turn', icon: 'eye' },
  { id: 'pattern', label: 'Attack pattern', icon: 'graph' },
  { id: 'lessons', label: 'Defensive lessons', icon: 'book' },
]

const lessons = [
  {
    title: 'Verify through another channel',
    summary: 'Never trust an unexpected request based on one message or call alone.',
    detail: 'Contact the person or organisation using a known phone number, official website, or previously verified communication channel.',
  },
  {
    title: 'Slow down urgent requests',
    summary: 'Pressure and urgency are common social engineering techniques.',
    detail: 'Pause before acting, especially when a request involves money, credentials, confidential information, or bypassing normal procedures.',
  },
  {
    title: 'Report suspicious contact early',
    summary: 'Early reporting gives defenders time to protect other employees.',
    detail: 'Report suspicious emails, calls, profiles, and media to the security team—even if no information has been shared yet.',
  },
]

function OverviewPanel({ summary, isDetected, fundsPercent }) {
  return (
    <div className="go-panel-layout go-overview-layout">
      <div className="go-analysis-copy">
        <span className="go-section-kicker">Detection analysis</span>
        <h2>{isDetected ? 'Your attack pattern became visible.' : 'The simulation has ended.'}</h2>
        <p>
          {isDetected
            ? 'Repeated high-risk or poorly matched choices raised enough warning signals for the Company Defence System to identify the attacker.'
            : 'Your mission reached its final state before the exposure threshold was triggered.'}
        </p>

        <div className="go-cause-list">
          <div><span>01</span><p><strong>Target mismatch</strong>Some techniques did not align with the selected target’s role or behaviour.</p></div>
          <div><span>02</span><p><strong>Repeated signals</strong>Each suspicious attempt added evidence to the company’s detection pattern.</p></div>
          <div><span>03</span><p><strong>Defence response</strong>Built-in safeguards reduced impact and increased the chance of identification.</p></div>
        </div>
      </div>

      <div className="go-overview-stats">
        <div className="go-stat-block">
          <span>Targets completed</span>
          <strong>{summary.targetsCompleted}<small> / {summary.totalTargets}</small></strong>
          <i><b style={{ '--bar-width': `${Math.min(100, (summary.targetsCompleted / Math.max(1, summary.totalTargets)) * 100)}%` }} /></i>
        </div>
        <div className="go-stat-block">
          <span>Company funds remaining</span>
          <strong>{formatMoney(summary.fundsRemaining)}</strong>
          <i><b className="funds-bar" style={{ '--bar-width': `${fundsPercent}%` }} /></i>
        </div>
        <div className="go-stat-row">
          <div><span>Turns played</span><strong>{summary.turnsPlayed}</strong></div>
          <div><span>Funds removed</span><strong>{formatMoney(summary.fundsRemoved)}</strong></div>
        </div>
      </div>
    </div>
  )
}

function FinalTurnPanel({ summary }) {
  return (
    <div className="go-panel-layout go-final-layout">
      <div className="go-final-chain" aria-label="Final turn sequence">
        <div className="go-chain-card">
          <span><Icon type="user" /></span>
          <small>Final target</small>
          <strong>{summary.finalTarget}</strong>
        </div>
        <i className="go-chain-line" aria-hidden="true"><b /></i>
        <div className="go-chain-card">
          <span><Icon type="mask" /></span>
          <small>Technique</small>
          <strong>{summary.technique}</strong>
        </div>
        <i className="go-chain-line" aria-hidden="true"><b /></i>
        <div className="go-chain-card">
          <span><Icon type="phone" /></span>
          <small>Attack type</small>
          <strong>{summary.subtype}</strong>
        </div>
      </div>

      <div className="go-final-impact">
        <span className="go-section-kicker">Threshold event</span>
        <h2>The final turn added <em>+{summary.exposureGain}%</em> exposure.</h2>
        <p>
          That decision pushed the attacker to the detection threshold. The company
          connected the warning signs and stopped the remaining activity.
        </p>
        <div className="go-threshold-line">
          <span>Before final turn</span>
          <i><b style={{ '--bar-width': `${Math.max(0, summary.exposure - summary.exposureGain)}%` }} /></i>
          <strong>{Math.max(0, summary.exposure - summary.exposureGain)}%</strong>
        </div>
        <div className="go-threshold-line danger">
          <span>After final turn</span>
          <i><b style={{ '--bar-width': `${Math.min(100, summary.exposure)}%` }} /></i>
          <strong>{summary.exposure}%</strong>
        </div>
      </div>
    </div>
  )
}

function PatternPanel({ counts }) {
  const techniques = [
    { key: 'phishing', label: 'Phishing', icon: 'hook', colour: 'cyan' },
    { key: 'social', label: 'Fake social profile', icon: 'profile', colour: 'violet' },
    { key: 'deepfake', label: 'Deepfake', icon: 'mask', colour: 'amber' },
  ]
  const total = Math.max(1, techniques.reduce((sum, item) => sum + (counts[item.key] ?? 0), 0))

  return (
    <div className="go-pattern-layout">
      <div className="go-pattern-heading">
        <span className="go-section-kicker">Technique frequency</span>
        <h2>Your playthrough at a glance</h2>
        <p>Review how often each technique was used. Repeating one approach can make an attacker easier to recognise.</p>
      </div>

      <div className="go-technique-chart">
        {techniques.map((item) => {
          const value = counts[item.key] ?? 0
          const percentage = (value / total) * 100
          return (
            <div className={`go-technique-row ${item.colour}`} key={item.key}>
              <span className="go-technique-icon"><Icon type={item.icon} /></span>
              <div>
                <span>{item.label}</span>
                <i><b style={{ '--bar-width': `${percentage}%` }} /></i>
              </div>
              <strong>{value}<small> uses</small></strong>
            </div>
          )
        })}
      </div>

      <div className="go-pattern-note">
        <Icon type="eye" />
        <div><strong>Pattern awareness</strong><p>Attack variety alone does not guarantee success. Suitability, timing, and target context matter more.</p></div>
      </div>
    </div>
  )
}

function LessonsPanel({ activeLesson, setActiveLesson }) {
  const lesson = lessons[activeLesson]

  return (
    <div className="go-lessons-layout">
      <div className="go-lesson-list" role="tablist" aria-label="Defensive lessons">
        {lessons.map((item, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={index === activeLesson}
            className={index === activeLesson ? 'active' : ''}
            onClick={() => setActiveLesson(index)}
            key={item.title}
          >
            <span>0{index + 1}</span>
            <div><strong>{item.title}</strong><small>{item.summary}</small></div>
            <i aria-hidden="true">→</i>
          </button>
        ))}
      </div>

      <article className="go-lesson-detail" key={lesson.title}>
        <span className="go-lesson-shield"><Icon type="shield" /></span>
        <small>Defensive action 0{activeLesson + 1}</small>
        <h2>{lesson.title}</h2>
        <p>{lesson.detail}</p>
        <div><Icon type="check" /> Practical behaviour that reduces real-world social engineering risk</div>
      </article>
    </div>
  )
}

export default function GameOver() {
  const { state } = useLocation()
  const [activeTab, setActiveTab] = useState('overview')
  const [activeLesson, setActiveLesson] = useState(0)

  const summary = useMemo(() => ({
    ...defaultSummary,
    ...(state ?? {}),
    techniqueCounts: {
      ...defaultSummary.techniqueCounts,
      ...(state?.techniqueCounts ?? {}),
    },
  }), [state])

  const isDetected = summary.reason === 'detected'
  const exposurePercent = Math.max(0, Math.min(100, Number(summary.exposure) || 0))
  const fundsPercent = Math.max(0, Math.min(100, (summary.fundsRemaining / Math.max(1, summary.startingFunds)) * 100))

  return (
    <main className="game-over-page">
      <div className="go-grid" aria-hidden="true" />
      <div className="go-alert-glow" aria-hidden="true" />
      <div className="go-scanline" aria-hidden="true" />

      <header className="go-header">
        <Link className="go-brand" to="/" aria-label="Breach Point home">
          <span className="go-brand-mark" aria-hidden="true"><i /><i /></span>
          <span className="go-brand-copy">
            <span className="go-brand-name">Breach Point</span>
            <span className="go-brand-tagline">Social Engineering Awareness Simulation</span>
          </span>
        </Link>

        <div className="go-system-state" aria-label="Simulation ended">
          <span aria-hidden="true" />
          Simulation terminated
        </div>

        <Link className="go-header-restart" to="/gameplay">
          <Icon type="restart" /> Restart simulation
        </Link>
      </header>

      <section className="go-hero" aria-labelledby="game-over-title">
        <div className="go-hero-copy">
          <p className="go-eyebrow"><span aria-hidden="true">///</span> Incident report generated</p>
          <h1 id="game-over-title">{isDetected ? 'Attacker detected.' : 'Simulation complete.'}</h1>
          <p className="go-hero-summary">
            {isDetected
              ? 'Exposure reached the detection threshold before every target was completed.'
              : 'The simulation reached its final outcome. Review your decisions below.'}
          </p>
          <div className="go-hero-tags">
            <span><i /> Status: {isDetected ? 'Identified' : 'Complete'}</span>
            <span>Turn {summary.turnsPlayed}</span>
            <span>{summary.targetsCompleted} of {summary.totalTargets} targets complete</span>
          </div>
          <button type="button" className="go-review-button" onClick={() => setActiveTab('final-turn')}>
            Analyse the detection <Icon type="arrow" />
          </button>
        </div>

        <div className="go-exposure-visual" aria-label={`Attacker exposure ${exposurePercent}%`}>
          <div className="go-orbit go-orbit-one" aria-hidden="true" />
          <div className="go-orbit go-orbit-two" aria-hidden="true" />
          <div className="go-exposure-ring" style={{ '--exposure': `${exposurePercent * 3.6}deg` }}>
            <div>
              <Icon type="warning" />
              <strong>{exposurePercent}%</strong>
              <span>Exposure</span>
            </div>
          </div>
          <span className="go-detection-badge"><i /> Detection threshold reached</span>
          <span className="go-radar-label go-radar-label-one">Signal traced</span>
          <span className="go-radar-label go-radar-label-two">Identity exposed</span>
        </div>
      </section>

      <section className="go-debrief" aria-labelledby="debrief-title">
        <div className="go-debrief-header">
          <div>
            <span>Interactive report</span>
            <h2 id="debrief-title">Explore your incident debrief</h2>
          </div>
          <p>Select each section to understand what happened and how organisations defend against it.</p>
        </div>

        <div className="go-tab-list" role="tablist" aria-label="Incident debrief sections">
          {tabs.map((tab, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls="go-active-panel"
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
              key={tab.id}
            >
              <span>0{index + 1}</span>
              <Icon type={tab.icon} />
              <strong>{tab.label}</strong>
            </button>
          ))}
        </div>

        <div className="go-active-panel" id="go-active-panel" role="tabpanel" key={activeTab}>
          {activeTab === 'overview' && <OverviewPanel summary={summary} isDetected={isDetected} fundsPercent={fundsPercent} />}
          {activeTab === 'final-turn' && <FinalTurnPanel summary={summary} />}
          {activeTab === 'pattern' && <PatternPanel counts={summary.techniqueCounts} />}
          {activeTab === 'lessons' && <LessonsPanel activeLesson={activeLesson} setActiveLesson={setActiveLesson} />}
        </div>
      </section>

      <section className="go-next-step">
        <div>
          <span>What happens next?</span>
          <h2>Use the lesson. Change the outcome.</h2>
          <p>Your module progress remains available. Try a different target-and-technique match or revisit the awareness library before restarting.</p>
        </div>
        <nav className="go-actions" aria-label="Game over actions">
          <Link className="go-primary-action" to="/gameplay"><Icon type="restart" /> Try again <i>→</i></Link>
          <Link to="/learn-about-scams"><Icon type="book" /> Learning library</Link>
          <Link to="/"><Icon type="home" /> Home</Link>
        </nav>
      </section>

      <footer className="go-footer">
        <span>Authorised educational simulation</span><i aria-hidden="true" />
        <span>Fictional targets</span><i aria-hidden="true" />
        <span>No user data collected</span>
      </footer>
    </main>
  )
}
