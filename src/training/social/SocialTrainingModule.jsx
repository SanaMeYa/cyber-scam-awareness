import { useEffect, useMemo, useRef, useState } from 'react'

export default function SocialTrainingModule({
  platform,
  kicker,
  title,
  inspectionExamples,
  comparisonExamples,
  summaryData,
  completed,
  onComplete,
  onClose,
}) {
  const [step, setStep] = useState(0)
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [revealedClues, setRevealedClues] = useState({})
  const [comparisonAnswers, setComparisonAnswers] = useState({})
  const [activeSimulationPath, setActiveSimulationPath] = useState('trap')
  const contentRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [step])

  const currentExample = inspectionExamples[currentExampleIndex] || inspectionExamples[0]
  const currentHotspots = currentExample?.hotspots || []
  const exampleRevealed = revealedClues[currentExample?.id] || []

  const currentScamPercent = Math.round(
    (exampleRevealed.length / Math.max(1, currentHotspots.length)) * 100
  )

  const canAdvance = useMemo(() => {
    if (step === 0) {
      return exampleRevealed.length === currentHotspots.length
    }
    if (step === 1) {
      return comparisonExamples.every((comp) => comparisonAnswers[comp.id] === comp.correct)
    }
    return true
  }, [step, exampleRevealed.length, currentHotspots.length, comparisonAnswers, comparisonExamples])

  const revealClue = (clueId) => {
    if (!currentExample) return
    setRevealedClues((prev) => {
      const existing = prev[currentExample.id] || []
      if (existing.includes(clueId)) return prev
      return {
        ...prev,
        [currentExample.id]: [...existing, clueId],
      }
    })
  }

  const handleComparisonChoice = (comparisonId, choice) => {
    setComparisonAnswers((prev) => ({
      ...prev,
      [comparisonId]: choice,
    }))
  }

  const advance = () => {
    if (step < 3) {
      setStep((current) => current + 1)
      return
    }
    onComplete()
    onClose()
  }

  const back = () => {
    if (step > 0) setStep((current) => current - 1)
  }

  return (
    <div className="email-lesson-backdrop">
      <section
        className="email-lesson-modal universal-lesson"
        role="dialog"
        aria-modal="true"
        aria-labelledby="social-module-title"
      >
        <header className="email-lesson-header">
          <div>
            <span className="lesson-kicker">{kicker}</span>
            <h2 id="social-module-title">{title}</h2>
          </div>
          <button className="lesson-close" type="button" aria-label="Close training module" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="lesson-progress" aria-label={`Training step ${step + 1} of 4`}>
          {['1. SPOT THE SIGNS', '2. CHOOSE YOUR MOVE', '3. ATTACK SIMULATION', '4. DEFENSE SHIELD'].map(
            (label, index) => (
              <div
                className={`${index === step ? 'current' : ''} ${index < step ? 'complete' : ''}`}
                key={label}
              >
                <span>{index < step ? '✓' : index + 1}</span>
                <small>{label}</small>
              </div>
            )
          )}
        </div>

        <div className="email-lesson-content" ref={contentRef}>
          {/* STEP 1: INTERACTIVE APP SCANNER */}
          {step === 0 && currentExample && (
            <div className="lesson-stage">
              <div className="lesson-stage-heading">
                <span className="lesson-step-label">STEP 1 // SPOT ALL RED FLAGS</span>
                <h3>Inspect the {platform === 'facebook' ? 'Messenger Chat' : platform === 'instagram' ? 'Direct Message' : 'LinkedIn InMail'}</h3>
                <p>
                  Scammers exploit trust, brand lookalikes, and artificial urgency. Tap each indicator below to investigate and expose the deception.
                </p>
              </div>

              {/* Case Study Switcher */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                {inspectionExamples.map((ex, idx) => (
                  <button
                    key={ex.id}
                    type="button"
                    className={`lesson-secondary ${currentExampleIndex === idx ? 'lesson-required-button' : ''}`}
                    style={{ padding: '6px 12px', fontSize: '0.6rem', fontWeight: 700 }}
                    onClick={() => setCurrentExampleIndex(idx)}
                  >
                    {ex.tag}: {ex.type}
                  </button>
                ))}
              </div>

              <div className="social-sim-container">
                {/* Phone Mockup */}
                <div className="social-phone-shell">
                  <div className="social-phone-notch">
                    <span>9:41</span>
                    <div className="phone-island"></div>
                    <span>📶 5G 🔋 98%</span>
                  </div>

                  <div className={`social-app-header ${platform}`}>
                    <div className="social-avatar-wrapper">
                      <div className={currentExample.storyActive ? 'story-ring' : ''}>
                        <div
                          className="avatar-circle"
                          style={{
                            background: currentExample.avatarBg,
                            color: currentExample.avatarColor,
                          }}
                        >
                          {currentExample.avatar}
                        </div>
                      </div>
                      {currentExample.onlineStatus && <span className="online-indicator"></span>}
                    </div>
                    <div className="social-app-header-info">
                      <h4>
                        {currentExample.profileName}
                        {currentExample.verifiedBadge && <span className="verified-badge-icon">✓</span>}
                      </h4>
                      <span>
                        {currentExample.handle} • {currentExample.meta}
                      </span>
                    </div>
                  </div>

                  {currentExample.stats && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        padding: '6px 10px',
                        background: '#120718',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        fontSize: '0.48rem',
                        color: '#cbd5e1',
                      }}
                    >
                      <span><strong>{currentExample.stats.posts}</strong> posts</span>
                      <span><strong>{currentExample.stats.followers}</strong> followers</span>
                      <span><strong>{currentExample.stats.following}</strong> following</span>
                    </div>
                  )}

                  {currentExample.roleHighlight && (
                    <div
                      style={{
                        padding: '7px 12px',
                        background: '#081726',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        fontSize: '0.52rem',
                        color: '#38bdf8',
                        fontWeight: 700,
                      }}
                    >
                      🎯 Position: {currentExample.roleHighlight}
                    </div>
                  )}

                  <div className="social-chat-feed">
                    {currentExample.mutualFriends && (
                      <div style={{ textAlign: 'center', fontSize: '0.5rem', color: '#64748b', margin: '4px 0' }}>
                        {currentExample.mutualFriends}
                      </div>
                    )}

                    {currentExample.chatHistory?.map((msg, mIdx) => (
                      <div key={mIdx} className={`social-chat-bubble them ${platform}`}>
                        <p style={{ margin: 0 }}>{msg.text}</p>
                        <span className="social-chat-time">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      padding: '10px 14px',
                      background: '#08111e',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '1rem', opacity: 0.7 }}>💬</span>
                    <div
                      style={{
                        flex: 1,
                        background: '#1e293b',
                        borderRadius: '16px',
                        padding: '6px 12px',
                        fontSize: '0.55rem',
                        color: '#64748b',
                      }}
                    >
                      Type a response... (Do not click links or send funds)
                    </div>
                  </div>
                </div>

                {/* Live Danger Gauge & Clues */}
                <div>
                  <div className="scam-danger-gauge">
                    <div className="scam-gauge-header">
                      <span>LIVE DANGER GAUGE</span>
                      <strong>
                        {currentScamPercent}% DETECTED ({exampleRevealed.length}/{currentHotspots.length})
                      </strong>
                    </div>
                    <div className="scam-gauge-bar-bg">
                      <div className="scam-gauge-bar-fill" style={{ width: `${currentScamPercent}%` }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
                      CLICK EACH INDICATOR TO EXPOSE:
                    </span>
                    {currentHotspots.map((clue) => {
                      const found = exampleRevealed.includes(clue.id)
                      return (
                        <div
                          key={clue.id}
                          onClick={() => revealClue(clue.id)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: found ? '1px solid #22c55e' : '1px dashed rgba(56, 189, 248, 0.5)',
                            background: found ? 'rgba(34, 197, 94, 0.1)' : 'rgba(56, 189, 248, 0.08)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.62rem', color: found ? '#4ade80' : '#7dd3fc' }}>
                              {found ? '✓ ' : '🔍 '} {clue.label}
                            </strong>
                            <span style={{ fontSize: '0.5rem', color: found ? '#22c55e' : '#94a3b8' }}>
                              {found ? 'DISCOVERED' : 'TAP TO REVEAL'}
                            </span>
                          </div>

                          {found && (
                            <div style={{ marginTop: '6px', fontSize: '0.55rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                              <p style={{ margin: '0 0 4px', color: '#f8fafc' }}>{clue.explanation}</p>
                              <div style={{ color: '#38bdf8', fontWeight: 700 }}>💡 Pro-Tip: {clue.teenTip}</div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DECISION CARDS */}
          {step === 1 && (
            <div className="lesson-stage">
              <div className="lesson-stage-heading">
                <span className="lesson-step-label">STEP 2 // CHOOSE YOUR MOVE</span>
                <h3>What Would You Do in Real Life?</h3>
                <p>Select the defensive choice for each scenario below to foil the attack.</p>
              </div>

              <div style={{ display: 'grid', gap: '20px' }}>
                {comparisonExamples.map((item) => {
                  const chosen = comparisonAnswers[item.id]
                  const isAnswered = Boolean(chosen)
                  const isCorrect = chosen === item.correct

                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '16px',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        background: 'rgba(15, 23, 42, 0.7)',
                        borderRadius: '12px',
                      }}
                    >
                      <h4 style={{ margin: '0 0 4px', color: '#38bdf8', fontSize: '0.8rem' }}>{item.title}</h4>
                      <p style={{ margin: '0 0 12px', fontSize: '0.62rem', color: '#94a3b8' }}>{item.prompt}</p>

                      <div className="teen-decision-grid">
                        <button
                          type="button"
                          className={`teen-decision-card ${chosen === 'a' ? (item.correct === 'a' ? 'selected-safe' : 'selected-trap') : ''}`}
                          onClick={() => handleComparisonChoice(item.id, 'a')}
                        >
                          <span className={`decision-card-badge ${item.scenarios.a.isCorrect ? 'safe' : 'risky'}`}>
                            {item.scenarios.a.tag}
                          </span>
                          <strong style={{ fontSize: '0.68rem', color: '#f8fafc', marginBottom: '4px' }}>
                            {item.scenarios.a.sender}
                          </strong>
                          <p style={{ margin: '4px 0', fontSize: '0.58rem', color: '#cbd5e1' }}>
                            {item.scenarios.a.message}
                          </p>
                          {chosen === 'a' && (
                            <div style={{ marginTop: '8px', fontSize: '0.54rem', fontWeight: 700, color: item.scenarios.a.isCorrect ? '#4ade80' : '#f87171' }}>
                              {item.scenarios.a.outcome}
                            </div>
                          )}
                        </button>

                        <button
                          type="button"
                          className={`teen-decision-card ${chosen === 'b' ? (item.correct === 'b' ? 'selected-safe' : 'selected-trap') : ''}`}
                          onClick={() => handleComparisonChoice(item.id, 'b')}
                        >
                          <span className={`decision-card-badge ${item.scenarios.b.isCorrect ? 'safe' : 'risky'}`}>
                            {item.scenarios.b.tag}
                          </span>
                          <strong style={{ fontSize: '0.68rem', color: '#f8fafc', marginBottom: '4px' }}>
                            {item.scenarios.b.sender}
                          </strong>
                          <p style={{ margin: '4px 0', fontSize: '0.58rem', color: '#cbd5e1' }}>
                            {item.scenarios.b.message}
                          </p>
                          {chosen === 'b' && (
                            <div style={{ marginTop: '8px', fontSize: '0.54rem', fontWeight: 700, color: item.scenarios.b.isCorrect ? '#4ade80' : '#f87171' }}>
                              {item.scenarios.b.outcome}
                            </div>
                          )}
                        </button>
                      </div>

                      {isAnswered && (
                        <div className="teen-pro-tip-box" style={{ borderColor: isCorrect ? '#22c55e' : '#ef4444' }}>
                          <strong style={{ color: isCorrect ? '#4ade80' : '#f87171' }}>
                            {isCorrect ? '🎯 EXCELLENT CHOICE!' : '⚠️ SECURITY VULNERABILITY!'}
                          </strong>
                          {item.explanation}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 3: ATTACK SIMULATION */}
          {step === 2 && (
            <div className="lesson-stage">
              <div className="lesson-stage-heading">
                <span className="lesson-step-label">STEP 3 // ATTACK SIMULATION</span>
                <h3>Simulate the Attack Chain Reaction</h3>
                <p>Toggle between the <strong>Attack Trap</strong> and the <strong>Defensive Shield</strong> to observe how prevention stops compromise.</p>
              </div>

              <div className="interactive-attack-sandbox">
                <div className="sandbox-path-toggle">
                  <button
                    type="button"
                    className={`sandbox-path-btn ${activeSimulationPath === 'trap' ? 'active trap-path' : ''}`}
                    onClick={() => setActiveSimulationPath('trap')}
                  >
                    💀 SCENARIO 1: VICTIM FALLS FOR THE ATTACK
                  </button>
                  <button
                    type="button"
                    className={`sandbox-path-btn ${activeSimulationPath === 'safe' ? 'active safe-path' : ''}`}
                    onClick={() => setActiveSimulationPath('safe')}
                  >
                    🛡️ SCENARIO 2: DEFENSIVE PROTOCOL ENGAGED
                  </button>
                </div>

                {activeSimulationPath === 'trap' ? (
                  <div>
                    <div className="impact-chain">
                      <article style={{ borderColor: '#ef4444' }}>
                        <span style={{ color: '#ef4444' }}>1</span>
                        <div>
                          <strong>Initial Deception Lure</strong>
                          <p>Scammer builds trust or fear with fake profiles, urgency, or too-good offers.</p>
                        </div>
                      </article>
                      <i>➔</i>
                      <article style={{ borderColor: '#ef4444' }}>
                        <span style={{ color: '#ef4444' }}>2</span>
                        <div>
                          <strong>Credentials / Funds Sent</strong>
                          <p>Victim executes the requested action without independent secondary verification.</p>
                        </div>
                      </article>
                      <i>➔</i>
                      <article style={{ borderColor: '#ef4444' }}>
                        <span style={{ color: '#ef4444' }}>3</span>
                        <div>
                          <strong>Compromise & Loss</strong>
                          <p>Funds drained, identity stolen, or account hijacked to target the victim's friends.</p>
                        </div>
                      </article>
                    </div>

                    <div className="awareness-callout" style={{ borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>
                      <strong style={{ color: '#f87171' }}>WHY THIS OCCURRED:</strong>
                      <p>Acting under artificial urgency without pausing for out-of-band verification allows social engineering attacks to succeed.</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="impact-chain">
                      <article style={{ borderColor: '#22c55e' }}>
                        <span style={{ color: '#22c55e' }}>1</span>
                        <div>
                          <strong>Red Flag Identified</strong>
                          <p>User recognizes deceptive indicators: urgency, weird URLs, or unexpected payment demands.</p>
                        </div>
                      </article>
                      <i>➔</i>
                      <article style={{ borderColor: '#22c55e' }}>
                        <span style={{ color: '#22c55e' }}>2</span>
                        <div>
                          <strong>Out-of-Band Verification</strong>
                          <p>User verifies via live phone call, official app settings, or official company portal.</p>
                        </div>
                      </article>
                      <i>➔</i>
                      <article style={{ borderColor: '#22c55e' }}>
                        <span style={{ color: '#22c55e' }}>3</span>
                        <div>
                          <strong>Attack Completely Neutralized</strong>
                          <p>Account reported and blocked. Zero funds lost, devices remain secure! 🛡️</p>
                        </div>
                      </article>
                    </div>

                    <div className="awareness-callout" style={{ borderColor: '#22c55e', background: 'rgba(34, 197, 94, 0.1)' }}>
                      <strong style={{ color: '#4ade80' }}>DEFENSIVE MASTERY:</strong>
                      <p>Taking a 10-second pause to verify through a trusted channel completely protects your digital life.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: REWARD & RULES */}
          {step === 3 && (
            <div className="lesson-stage">
              <div className="teen-achievement-card">
                <div className="achievement-icon-circle">🛡️</div>
                <span className="lesson-step-label">MODULE COMPLETE</span>
                <h3 style={{ margin: '6px 0', fontSize: '1.2rem', color: '#38bdf8' }}>{summaryData?.badgeTitle}</h3>
                <p style={{ margin: 0, fontSize: '0.62rem', color: '#94a3b8' }}>
                  You have mastered threat detection and defensive protocols for this platform.
                </p>
              </div>

              <div className="teen-golden-rules">
                {summaryData?.teenRules?.map((rule, idx) => (
                  <div key={idx} className="teen-rule-item">
                    <span className="emoji">{rule.emoji}</span>
                    <div>
                      <strong style={{ color: '#38bdf8', fontSize: '0.62rem', display: 'block', marginBottom: '2px' }}>
                        {rule.title}
                      </strong>
                      <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.4 }}>{rule.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="email-lesson-footer">
          <div>
            <strong>
              {step === 0
                ? `${exampleRevealed.length}/${currentHotspots.length}`
                : step === 1
                ? `${Object.keys(comparisonAnswers).length}/${comparisonExamples.length}`
                : 'READY'}
            </strong>
            <span>{step === 0 ? 'CLUES IN SCENARIO' : step === 1 ? 'DECISIONS MADE' : 'MODULE COMPLETE'}</span>
          </div>
          <button className="lesson-secondary" type="button" onClick={back} disabled={step === 0}>
            BACK
          </button>
          <button className="lesson-primary" type="button" onClick={advance} disabled={!canAdvance}>
            {step < 3 ? 'CONTINUE ➔' : completed ? 'COMPLETED ✓' : 'CLAIM SHIELD & FINISH'}
          </button>
        </footer>
      </section>
    </div>
  )
}
