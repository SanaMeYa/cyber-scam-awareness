import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './victory.css'

const startingFunds = 5_000_000

const formatMoney = (value = 0) => new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
}).format(value)

const icons = {
  restart: <path d="M20 6v6h-6M19 13a7 7 0 1 1-2-5.1" />,
  home: <path d="m4 11 8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9Z" />,
  shieldCheck: (
    <>
      <path d="M12 3 20 6v6c0 5-3.3 8.2-8 10-4.7-1.8-8-5-8-10V6l8-3Z" />
      <path d="m8.5 12 2.4 2.4L16 9" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5a2 2 0 0 0 0 4h1M16 5h3a2 2 0 0 1 0 4h-1M10 15v3H8v2h8v-2h-2v-3" />
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
  graph: <path d="M4 20V10M10 20V5M16 20v-8M22 20V3M2 20h22" />,
  book: (
    <>
      <path d="M3 5c3.5-1 6.5-.4 9 2v14c-2.5-2.4-5.5-3-9-2V5ZM21 5c-3.5-1-6.5-.4-9 2v14c2.5-2.4 5.5-3 9-2V5Z" />
      <path d="m8 10 2 2 3-4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v5c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 11v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  spark: <path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" />,
}

const Icon = ({ type }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    {icons[type]}
  </svg>
)

const defaultSummary = {
  reason: 'completed',
  turnsPlayed: 9,
  startingFunds,
  fundsRemaining: 1_350_000,
  fundsRemoved: 3_650_000,
  exposure: 64,
  exposureGain: 12,
  finalTarget: 'Sarah Lindqvist',
  technique: 'Phishing',
  subtype: 'Email',
  targetsCompleted: 5,
  totalTargets: 5,
  techniqueCounts: { phishing: 4, social: 3, deepfake: 2 },
}

const winCopy = {
  completed: {
    status: 'All Targets Completed',
    reason: 'You found an effective attack match for every target before exposure reached 100%.',
    panelTitle: 'Mission completed',
    panelText: 'Your target analysis and technique choices completed the target list while keeping attacker exposure below the company’s detection threshold.',
  },
  bankrupt: {
    status: 'Company Bankrupted',
    reason: 'Company funds reached $0 before attacker exposure reached 100%.',
    panelTitle: 'Financial objective completed',
    panelText: 'Your selected techniques created enough simulated financial damage to exhaust the company funds before the attacker was detected.',
  },
  ceo: {
    status: 'CEO Compromised',
    reason: 'You compromised the highest-value target before attacker exposure reached 100%.',
    panelTitle: 'High-value target completed',
    panelText: 'Your final attempt overcame the CEO scenario while remaining below the detection threshold, demonstrating the potential impact of executive compromise.',
  },
}

const tabs = [
  { id: 'overview', label: 'Mission overview', icon: 'trophy' },
  { id: 'final-move', label: 'Final move', icon: 'target' },
  { id: 'performance', label: 'Performance', icon: 'graph' },
  { id: 'lessons', label: 'Defender lessons', icon: 'book' },
]

const defenderLessons = [
  {
    title: 'Verify identities independently',
    summary: 'Trusted channels interrupt convincing impersonation attempts.',
    detail: 'Employees should verify unusual requests using a known phone number, internal directory, or face-to-face confirmation—not the contact details supplied by the requester.',
  },
  {
    title: 'Protect high-value processes',
    summary: 'Sensitive actions should never rely on one person or one message.',
    detail: 'Payment changes, credential resets, and confidential data requests should require approval steps, separation of duties, and clear escalation procedures.',
  },
  {
    title: 'Turn awareness into reporting',
    summary: 'Fast reporting gives the whole organisation time to respond.',
    detail: 'Staff should know exactly where to report suspicious emails, calls, accounts, and media so defenders can block related activity before it reaches others.',
  },
]

function OverviewPanel({ summary, copy, fundsPercent, safetyMargin }) {
  return (
    <div className="vc-panel-layout vc-overview-layout">
      <div className="vc-overview-copy">
        <span className="vc-section-kicker">Achievement analysis</span>
        <h2>{copy.panelTitle}</h2>
        <p>{copy.panelText}</p>

        <div className="vc-achievement-list">
          <div><span><Icon type="target" /></span><p><strong>Target completion</strong>{summary.targetsCompleted} of {summary.totalTargets} targets successfully completed.</p></div>
          <div><span><Icon type="shieldCheck" /></span><p><strong>Detection avoided</strong>You finished with a {safetyMargin}% margin below the detection threshold.</p></div>
          <div><span><Icon type="coins" /></span><p><strong>Business impact</strong>{formatMoney(summary.fundsRemoved)} in simulated financial damage was demonstrated.</p></div>
        </div>
      </div>

      <div className="vc-overview-stats">
        <div className="vc-stat-block vc-stat-success">
          <span>Targets completed</span>
          <strong>{summary.targetsCompleted}<small> / {summary.totalTargets}</small></strong>
          <i><b style={{ '--bar-width': `${Math.min(100, (summary.targetsCompleted / Math.max(1, summary.totalTargets)) * 100)}%` }} /></i>
        </div>
        <div className="vc-stat-block">
          <span>Company funds remaining</span>
          <strong>{formatMoney(summary.fundsRemaining)}</strong>
          <i><b className="vc-funds-bar" style={{ '--bar-width': `${fundsPercent}%` }} /></i>
        </div>
        <div className="vc-stat-row">
          <div><span>Turns played</span><strong>{summary.turnsPlayed}</strong></div>
          <div><span>Funds removed</span><strong>{formatMoney(summary.fundsRemoved)}</strong></div>
        </div>
      </div>
    </div>
  )
}

function FinalMovePanel({ summary, safetyMargin }) {
  return (
    <div className="vc-panel-layout vc-final-layout">
      <div className="vc-final-chain" aria-label="Final successful move">
        <div className="vc-chain-card">
          <span><Icon type="user" /></span>
          <small>Final target</small>
          <strong>{summary.finalTarget}</strong>
        </div>
        <i className="vc-chain-line" aria-hidden="true"><b /></i>
        <div className="vc-chain-card">
          <span><Icon type="mask" /></span>
          <small>Technique</small>
          <strong>{summary.technique}</strong>
        </div>
        <i className="vc-chain-line" aria-hidden="true"><b /></i>
        <div className="vc-chain-card vc-chain-success">
          <span><Icon type="check" /></span>
          <small>Attack type</small>
          <strong>{summary.subtype}</strong>
        </div>
      </div>

      <div className="vc-final-impact">
        <span className="vc-section-kicker">Final action</span>
        <h2>The match succeeded with <em>{safetyMargin}%</em> exposure room.</h2>
        <p>
          The final target and technique combination completed the mission while
          total exposure remained below the company’s detection threshold.
        </p>
        <div className="vc-threshold-line">
          <span>Before final turn</span>
          <i><b style={{ '--bar-width': `${Math.max(0, summary.exposure - summary.exposureGain)}%` }} /></i>
          <strong>{Math.max(0, summary.exposure - summary.exposureGain)}%</strong>
        </div>
        <div className="vc-threshold-line current">
          <span>Final exposure</span>
          <i><b style={{ '--bar-width': `${Math.min(100, summary.exposure)}%` }} /></i>
          <strong>{summary.exposure}%</strong>
        </div>
        <div className="vc-safe-badge"><Icon type="shieldCheck" /> Detection threshold not reached</div>
      </div>
    </div>
  )
}

function PerformancePanel({ summary }) {
  const techniques = [
    { key: 'phishing', label: 'Phishing', icon: 'hook', colour: 'cyan' },
    { key: 'social', label: 'Fake social profile', icon: 'profile', colour: 'violet' },
    { key: 'deepfake', label: 'Deepfake', icon: 'mask', colour: 'amber' },
  ]
  const total = Math.max(1, techniques.reduce((sum, item) => sum + (summary.techniqueCounts[item.key] ?? 0), 0))
  const impactPerTurn = summary.turnsPlayed > 0 ? summary.fundsRemoved / summary.turnsPlayed : 0
  const exposurePerTurn = summary.turnsPlayed > 0 ? summary.exposure / summary.turnsPlayed : 0

  return (
    <div className="vc-performance-layout">
      <div className="vc-performance-heading">
        <span className="vc-section-kicker">Playthrough analysis</span>
        <h2>How you approached the mission</h2>
        <p>Technique variety, target matching, and controlled exposure shaped the final result.</p>
        <div className="vc-efficiency-grid">
          <div><span>Average impact</span><strong>{formatMoney(impactPerTurn)}</strong><small>per turn</small></div>
          <div><span>Exposure rate</span><strong>{exposurePerTurn.toFixed(1)}%</strong><small>per turn</small></div>
        </div>
      </div>

      <div className="vc-technique-chart">
        {techniques.map((item) => {
          const value = summary.techniqueCounts[item.key] ?? 0
          const percentage = (value / total) * 100
          return (
            <div className={`vc-technique-row ${item.colour}`} key={item.key}>
              <span className="vc-technique-icon"><Icon type={item.icon} /></span>
              <div>
                <span>{item.label}</span>
                <i><b style={{ '--bar-width': `${percentage}%` }} /></i>
              </div>
              <strong>{value}<small> uses</small></strong>
            </div>
          )
        })}
      </div>

      <div className="vc-performance-note">
        <Icon type="spark" />
        <div><strong>Replay insight</strong><p>Try completing the same target list with fewer turns or lower exposure to improve your next result.</p></div>
      </div>
    </div>
  )
}

function LessonsPanel({ activeLesson, setActiveLesson }) {
  const lesson = defenderLessons[activeLesson]

  return (
    <div className="vc-lessons-layout">
      <div className="vc-lesson-list" role="tablist" aria-label="Defender lessons">
        {defenderLessons.map((item, index) => (
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

      <article className="vc-lesson-detail" key={lesson.title}>
        <span className="vc-lesson-shield"><Icon type="shieldCheck" /></span>
        <small>Defensive action 0{activeLesson + 1}</small>
        <h2>{lesson.title}</h2>
        <p>{lesson.detail}</p>
        <div><Icon type="check" /> This behaviour disrupts the attack path demonstrated in the simulation</div>
      </article>
    </div>
  )
}

export default function Victory() {
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

  const copy = winCopy[summary.reason] ?? winCopy.completed
  const exposurePercent = Math.max(0, Math.min(100, Number(summary.exposure) || 0))
  const fundsPercent = Math.max(0, Math.min(100, (summary.fundsRemaining / Math.max(1, summary.startingFunds)) * 100))
  const safetyMargin = Math.max(0, 100 - exposurePercent)

  return (
    <main className="victory-page">
      <div className="vc-grid" aria-hidden="true" />
      <div className="vc-success-glow" aria-hidden="true" />
      <div className="vc-sweep" aria-hidden="true" />

      <header className="vc-header">
        <Link className="vc-brand" to="/" aria-label="Breach Point home">
          <span className="vc-brand-mark" aria-hidden="true"><i /><i /></span>
          <span className="vc-brand-copy">
            <span className="vc-brand-name">Breach Point</span>
            <span className="vc-brand-tagline">Social Engineering Awareness Simulation</span>
          </span>
        </Link>

        <div className="vc-system-state" aria-label="Mission completed">
          <span aria-hidden="true" /> Mission complete
        </div>

        <Link className="vc-header-restart" to="/gameplay">
          <Icon type="restart" /> Play again
        </Link>
      </header>

      <section className="vc-hero" aria-labelledby="victory-title">
        <div className="vc-hero-copy">
          <p className="vc-eyebrow"><span aria-hidden="true">///</span> Simulation objective achieved</p>
          <h1 id="victory-title">Mission successful.</h1>
          <p className="vc-status">{copy.status}</p>
          <p className="vc-hero-summary">{copy.reason}</p>
          <div className="vc-hero-tags">
            <span><i /> Status: Undetected</span>
            <span>Turn {summary.turnsPlayed}</span>
            <span>{summary.targetsCompleted} of {summary.totalTargets} targets complete</span>
          </div>
          <button type="button" className="vc-review-button" onClick={() => setActiveTab('performance')}>
            Explore your performance <Icon type="arrow" />
          </button>
        </div>

        <div className="vc-success-visual" aria-label={`Mission complete with ${exposurePercent}% attacker exposure`}>
          <div className="vc-particle-field" aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
          </div>
          <div className="vc-orbit vc-orbit-one" aria-hidden="true" />
          <div className="vc-orbit vc-orbit-two" aria-hidden="true" />
          <div className="vc-success-ring" style={{ '--exposure': `${exposurePercent * 3.6}deg` }}>
            <div>
              <Icon type="trophy" />
              <strong>Success</strong>
              <span>{exposurePercent}% exposure</span>
            </div>
          </div>
          <span className="vc-safe-margin"><Icon type="shieldCheck" /> {safetyMargin}% detection margin</span>
          <span className="vc-radar-label vc-radar-label-one">Objectives complete</span>
          <span className="vc-radar-label vc-radar-label-two">Identity protected</span>
        </div>
      </section>

      <section className="vc-debrief" aria-labelledby="victory-debrief-title">
        <div className="vc-debrief-header">
          <div>
            <span>Interactive mission report</span>
            <h2 id="victory-debrief-title">Explore how you succeeded</h2>
          </div>
          <p>Select each section to review the outcome, your final move, performance, and the real defensive lessons.</p>
        </div>

        <div className="vc-tab-list" role="tablist" aria-label="Victory report sections">
          {tabs.map((tab, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls="vc-active-panel"
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

        <div className="vc-active-panel" id="vc-active-panel" role="tabpanel" key={activeTab}>
          {activeTab === 'overview' && <OverviewPanel summary={summary} copy={copy} fundsPercent={fundsPercent} safetyMargin={safetyMargin} />}
          {activeTab === 'final-move' && <FinalMovePanel summary={summary} safetyMargin={safetyMargin} />}
          {activeTab === 'performance' && <PerformancePanel summary={summary} />}
          {activeTab === 'lessons' && <LessonsPanel activeLesson={activeLesson} setActiveLesson={setActiveLesson} />}
        </div>
      </section>

      <section className="vc-next-step">
        <div>
          <span>Mission complete</span>
          <h2>Can you win with even less exposure?</h2>
          <p>Your awareness-module progress remains available. Replay the simulation, test different combinations, or revisit a learning module.</p>
        </div>
        <nav className="vc-actions" aria-label="Victory actions">
          <Link className="vc-primary-action" to="/gameplay"><Icon type="restart" /> Play again <i>→</i></Link>
          <Link to="/learn-about-scams"><Icon type="book" /> Learning library</Link>
          <Link to="/"><Icon type="home" /> Home</Link>
        </nav>
      </section>

      <footer className="vc-footer">
        <span>Authorised educational simulation</span><i aria-hidden="true" />
        <span>Fictional targets</span><i aria-hidden="true" />
        <span>No user data collected</span>
      </footer>
    </main>
  )
}
