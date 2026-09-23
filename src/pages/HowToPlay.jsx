import { useState } from 'react'
import { Link } from 'react-router-dom'
import './how-to-play.css'

const Icon = ({ type }) => {
  const icons = {
    back: <path d="M20 12H4m6-6-6 6 6 6" />,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    shield: (
      <>
        <path d="M12 3 19 6v6c0 4.4-3 8.2-7 10-4-1.8-7-5.6-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c1.2-4 3.5-6 7-6s5.8 2 7 6M12 2v2M3 12h2M19 12h2" />
      </>
    ),
    attack: (
      <>
        <path d="M4 6h16v12H4z" />
        <path d="m5 7 7 6 7-6M17 3l3 3M20 3l-3 3" />
      </>
    ),
    book: (
      <>
        <path d="M3 5c3.5-1 6.5-.4 9 2v14c-2.5-2.4-5.5-3-9-2V5ZM21 5c-3.5-1-6.5-.4-9 2v14c2.5-2.4 5.5-3 9-2V5Z" />
        <path d="m8 10 2 2 3-4" />
      </>
    ),
    result: (
      <>
        <path d="M5 20V10M12 20V4M19 20v-7" />
        <path d="M3 20h18" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    unlock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M9 10V7a4 4 0 0 1 7.5-2M12 14v3" />
      </>
    ),
    exposure: (
      <>
        <path d="M12 3 20 7v5c0 4.6-3.2 8.2-8 10-4.8-1.8-8-5.4-8-10V7l8-4Z" />
        <path d="M12 8v5M12 17h.01" />
      </>
    ),
    funds: (
      <>
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v5c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 11v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[type]}
    </svg>
  )
}

const steps = [
  {
    number: '01',
    icon: 'book',
    label: 'Training access',
    title: 'Complete awareness modules',
    summary: 'Learn an attack before using it in the simulation.',
    description:
      'Open the Learning Library and complete the interactive module for a supported attack type. Finished modules remain available to replay and permanently unlock their matching techniques for your browser session.',
    callout: 'Learn first → unlock the attack → apply your knowledge',
    visual: 'modules',
  },
  {
    number: '02',
    icon: 'target',
    label: 'Target analysis',
    title: 'Choose a fictional target',
    summary: 'Study each person before making your move.',
    description:
      'Read the target’s role, behaviour, scenario, and visible transcript. Higher-importance targets may create greater financial impact, but a poor match can raise your exposure much faster.',
    callout: 'Target traits influence every result',
    visual: 'targets',
  },
  {
    number: '03',
    icon: 'attack',
    label: 'Attack selection',
    title: 'Match a technique and type',
    summary: 'Choose the approach that best fits the target.',
    description:
      'Select Phishing, Fake Social Profile, or Deepfake, then choose its specific type. An effective target-and-technique match is rewarded; weak choices increase risk and may cause little damage.',
    callout: 'There is no single attack that works on everyone',
    visual: 'attacks',
  },
  {
    number: '04',
    icon: 'shield',
    label: 'Defence response',
    title: 'Face the company defence',
    summary: 'See how organisational safeguards respond.',
    description:
      'After launch, the Company Defence System selects a relevant safeguard. The final outcome combines your target choice, attack type, target suitability, and the strength of that defence.',
    callout: 'Defences reduce risk—but people and context still matter',
    visual: 'defence',
  },
  {
    number: '05',
    icon: 'result',
    label: 'Round debrief',
    title: 'Review, learn, and continue',
    summary: 'Understand what happened before the next turn.',
    description:
      'Review the financial impact, exposure gained, result explanation, and practical defensive lesson. Successful targets become locked, helping you track who remains in the simulation.',
    callout: 'Every result is a short cyber-awareness lesson',
    visual: 'results',
  },
]

function StepVisual({ type }) {
  if (type === 'modules') {
    return (
      <div className="htp-visual htp-module-visual" aria-label="Learning modules unlock attack types">
        <div className="htp-module-card htp-module-complete">
          <span><Icon type="book" /></span>
          <strong>Email phishing</strong>
          <small>Module complete</small>
        </div>
        <div className="htp-unlock-path" aria-hidden="true">
          <i /><i /><i />
        </div>
        <div className="htp-tech-unlocked">
          <span><Icon type="unlock" /></span>
          <strong>Attack unlocked</strong>
          <small>Ready to use</small>
        </div>
      </div>
    )
  }

  if (type === 'targets') {
    return (
      <div className="htp-visual htp-target-visual" aria-label="Compare target importance and risk">
        <div className="htp-target-profile">
          <div className="htp-avatar"><Icon type="target" /></div>
          <span>Employee</span>
          <strong>Level 1</strong>
        </div>
        <div className="htp-target-scale">
          <div><span>Impact</span><i><b style={{ width: '42%' }} /></i></div>
          <div><span>Exposure risk</span><i><b className="risk" style={{ width: '28%' }} /></i></div>
        </div>
        <div className="htp-target-profile htp-target-profile-high">
          <div className="htp-avatar"><Icon type="target" /></div>
          <span>CEO</span>
          <strong>Level 4</strong>
        </div>
      </div>
    )
  }

  if (type === 'attacks') {
    return (
      <div className="htp-visual htp-attack-visual" aria-label="Choose one attack technique">
        {[
          ['Phishing', 'Email · SMS · Voice'],
          ['Fake profile', 'LinkedIn · Instagram'],
          ['Deepfake', 'Voice · Video'],
        ].map(([title, types], index) => (
          <div className={`htp-mini-attack ${index === 0 ? 'is-selected' : ''}`} key={title}>
            <span><Icon type={index === 0 ? 'attack' : index === 1 ? 'target' : 'shield'} /></span>
            <strong>{title}</strong>
            <small>{types}</small>
            {index === 0 && <i>Selected</i>}
          </div>
        ))}
      </div>
    )
  }

  if (type === 'defence') {
    return (
      <div className="htp-visual htp-defence-visual" aria-label="Attack passes through the company defence system">
        <div className="htp-signal htp-signal-attack">
          <Icon type="attack" />
          <span>Attack</span>
        </div>
        <div className="htp-data-line" aria-hidden="true"><i /></div>
        <div className="htp-defence-core">
          <span><Icon type="shield" /></span>
          <strong>Defence system</strong>
          <small>Analysing response</small>
        </div>
        <div className="htp-data-line htp-data-line-out" aria-hidden="true"><i /></div>
        <div className="htp-signal htp-signal-result">
          <Icon type="result" />
          <span>Outcome</span>
        </div>
      </div>
    )
  }

  return (
    <div className="htp-visual htp-result-visual" aria-label="Review company impact and attacker exposure">
      <div className="htp-result-status">
        <span>Round result</span>
        <strong>Effective attack</strong>
      </div>
      <div className="htp-result-meter">
        <div><span>Company impact</span><strong>−$420,000</strong></div>
        <i><b className="funds" /></i>
      </div>
      <div className="htp-result-meter">
        <div><span>Exposure gained</span><strong>+12%</strong></div>
        <i><b className="exposure" /></i>
      </div>
      <div className="htp-result-lesson"><Icon type="book" /> Defensive lesson unlocked</div>
    </div>
  )
}

export default function HowToPlay() {
  const [activeStep, setActiveStep] = useState(0)
  const step = steps[activeStep]

  return (
    <main className="how-to-play">
      <div className="htp-grid" aria-hidden="true" />
      <div className="htp-glow htp-glow-one" aria-hidden="true" />
      <div className="htp-glow htp-glow-two" aria-hidden="true" />

      <header className="htp-header">
        <Link className="htp-brand" to="/" aria-label="Breach Point home">
          <span className="htp-brand-mark" aria-hidden="true"><i /><i /></span>
          <span className="htp-brand-copy">
            <span className="htp-brand-name">Breach Point</span>
            <span className="htp-brand-tagline">Social Engineering Awareness Simulation</span>
          </span>
        </Link>

        <div className="htp-header-progress" aria-label="Five mission stages">
          <span>Mission briefing</span>
          <div>{steps.map((item, index) => <i className={index <= activeStep ? 'active' : ''} key={item.number} />)}</div>
          <strong>{activeStep + 1} / {steps.length}</strong>
        </div>

        <Link className="htp-back-button" to="/">
          <Icon type="back" />
          Back to home
        </Link>
      </header>

      <section className="htp-intro" aria-labelledby="how-to-play-title">
        <div>
          <p className="htp-eyebrow"><span aria-hidden="true">///</span> Mission briefing</p>
          <h1 id="how-to-play-title">Learn the system.<br /><span>Complete the mission.</span></h1>
        </div>
        <p>
          Your goal is to successfully complete every fictional target before
          attacker exposure reaches 100%. Learn the techniques first, choose
          carefully, and review what each round teaches you.
        </p>
      </section>

      <section className="htp-console" aria-label="Interactive gameplay instructions">
        <div className="htp-step-navigation" role="tablist" aria-label="Gameplay stages">
          <p>Mission sequence</p>
          {steps.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={index === activeStep}
              aria-controls="htp-step-panel"
              className={index === activeStep ? 'active' : ''}
              onClick={() => setActiveStep(index)}
              key={item.number}
            >
              <span className="htp-step-number">{item.number}</span>
              <span className="htp-step-nav-icon"><Icon type={item.icon} /></span>
              <span className="htp-step-nav-copy">
                <small>{item.label}</small>
                <strong>{item.title}</strong>
              </span>
              <span className="htp-step-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>

        <article className="htp-step-panel" id="htp-step-panel" role="tabpanel" key={step.number}>
          <div className="htp-panel-topline">
            <span>Stage {step.number}</span>
            <span className="htp-panel-status"><i /> Interactive briefing</span>
          </div>

          <div className="htp-panel-content">
            <div className="htp-panel-copy">
              <span className="htp-panel-icon"><Icon type={step.icon} /></span>
              <p>{step.label}</p>
              <h2>{step.title}</h2>
              <h3>{step.summary}</h3>
              <p className="htp-panel-description">{step.description}</p>
              <div className="htp-panel-callout">
                <Icon type="shield" />
                <span>{step.callout}</span>
              </div>
            </div>

            <StepVisual type={step.visual} />
          </div>

          <div className="htp-panel-controls">
            <button
              type="button"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((current) => Math.max(0, current - 1))}
            >
              ← Previous
            </button>
            <span>{step.number} / 0{steps.length}</span>
            {activeStep < steps.length - 1 ? (
              <button type="button" onClick={() => setActiveStep((current) => current + 1)}>
                Next stage →
              </button>
            ) : (
              <Link to="/gameplay">Enter simulation →</Link>
            )}
          </div>
        </article>
      </section>

      <section className="htp-rules" aria-labelledby="mission-rules-title">
        <div className="htp-rules-heading">
          <span>Mission parameters</span>
          <h2 id="mission-rules-title">Know what the indicators mean</h2>
        </div>

        <div className="htp-rule-grid">
          <article className="htp-rule-card htp-rule-success">
            <span className="htp-rule-icon"><Icon type="target" /></span>
            <div><small>Mission success</small><h3>Complete every target</h3><p>Find an effective attack match for all fictional targets.</p></div>
          </article>
          <article className="htp-rule-card htp-rule-danger">
            <span className="htp-rule-icon"><Icon type="exposure" /></span>
            <div><small>Game over</small><h3>Exposure reaches 100%</h3><p>Poor or suspicious choices make the attacker easier to detect.</p></div>
          </article>
          <article className="htp-rule-card htp-rule-impact">
            <span className="htp-rule-icon"><Icon type="funds" /></span>
            <div><small>Business impact</small><h3>Funds show the damage</h3><p>Financial loss demonstrates how attacks can harm an organisation.</p></div>
          </article>
        </div>
      </section>

      <section className="htp-cta">
        <div>
          <span>Briefing complete</span>
          <h2>Ready to test your awareness?</h2>
          <p>Learn the modules, assess the targets, and keep your exposure below the detection threshold.</p>
        </div>
        <Link className="htp-primary-button" to="/gameplay">
          <span><Icon type="play" /></span>
          Start simulation
          <i aria-hidden="true">→</i>
        </Link>
      </section>

      <footer className="htp-footer">
        <span>Authorised educational simulation</span>
        <i aria-hidden="true" />
        <span>Fictional targets</span>
        <i aria-hidden="true" />
        <span>No user data collected</span>
      </footer>
    </main>
  )
}
