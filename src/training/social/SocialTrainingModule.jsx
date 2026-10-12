import { useEffect, useMemo, useRef, useState } from 'react'
import './SocialTrainingModule.css'

const platformUi = {
  facebook: {
    mark: 'f', name: 'Facebook', surface: 'Messenger',
    navigation: ['Home', 'Friends', 'Marketplace', 'Messages'],
    reportPath: 'Profile menu → Find support or report',
  },
  instagram: {
    mark: '◎', name: 'Instagram', surface: 'Direct messages',
    navigation: ['Home', 'Explore', 'Reels', 'Messages'],
    reportPath: 'Profile menu → Report → Pretending to be someone',
  },
  linkedin: {
    mark: 'in', name: 'LinkedIn', surface: 'Messaging',
    navigation: ['Home', 'My Network', 'Jobs', 'Messaging'],
    reportPath: 'Profile More menu → Report or block',
  },
}

const stageLabels = [
  ['01', 'PROFILE FORENSICS'],
  ['02', 'VERIFY THE IDENTITY'],
  ['03', 'CONTROL THE OUTCOME'],
  ['04', 'FIELD SUMMARY'],
]

function ShieldIcon({ checked = false }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 20 6v6c0 5-3.2 8.1-8 10-4.8-1.9-8-5-8-10V6l8-3Z" />
      {checked && <path d="m8.5 12 2.3 2.3 4.9-5" />}
    </svg>
  )
}

function ProfileAvatar({ example }) {
  return (
    <span
      className="social-profile-avatar"
      style={{ '--avatar-background': example.avatarBg, '--avatar-color': example.avatarColor }}
      aria-hidden="true"
    >
      {example.avatar}
    </span>
  )
}

function findEvidenceSegment(text, clue) {
  const source = String(text ?? '')
  const candidates = String(clue.targetText ?? '')
    .split(/\.\.\.|…|•/)
    .map((part) => part.trim().replace(/^['“”]|['“”]$/g, ''))
    .filter((part) => part.length >= 4)
    .sort((a, b) => b.length - a.length)

  for (const candidate of candidates) {
    const index = source.toLocaleLowerCase().indexOf(candidate.toLocaleLowerCase())
    if (index >= 0) return { index, length: candidate.length }
  }

  return null
}

function EvidenceText({ as = 'span', text, hotspots, revealedClues, onReveal, hintedClueId, className = '' }) {
  const matches = hotspots
    .map((clue) => ({ clue, match: findEvidenceSegment(text, clue) }))
    .filter(({ match }) => match)
    .sort((a, b) => a.match.index - b.match.index)
    .filter((item, index, items) => index === 0 || item.match.index >= items[index - 1].match.index + items[index - 1].match.length)

  if (!matches.length) {
    const Element = as
    return <Element className={className}>{text}</Element>
  }

  const content = []
  let cursor = 0

  matches.forEach(({ clue, match }) => {
    if (match.index > cursor) content.push(text.slice(cursor, match.index))
    const found = revealedClues.includes(clue.id)
    content.push(
      <button
        className={`social-inline-evidence ${found ? 'found' : ''} ${!found && hintedClueId === clue.id ? 'hint' : ''}`}
        type="button"
        key={clue.id}
        onClick={() => onReveal(clue.id)}
        aria-pressed={found}
        aria-label={`${found ? 'Found' : 'Inspect'} warning sign: ${clue.label}`}
      >
        {text.slice(match.index, match.index + match.length)}
        {found && <span aria-hidden="true">✓</span>}
      </button>,
    )
    cursor = match.index + match.length
  })

  if (cursor < text.length) content.push(text.slice(cursor))
  const Element = as
  return <Element className={className}>{content}</Element>
}

function PlatformProfile({ platform, example, revealedClues, onReveal, hintedClueId }) {
  const ui = platformUi[platform]
  const stats = example.stats
  const statsText = stats ? `${stats.posts} posts • ${stats.followers} followers • following ${stats.following}` : ''

  return (
    <article className={`social-platform-window social-platform-${platform}`}>
      <header className="social-network-bar">
        <span className="social-network-mark" aria-hidden="true">{ui.mark}</span>
        <label>
          <span className="sr-only">Search {ui.name}</span>
          <input value={`Search ${ui.name}`} readOnly tabIndex="-1" aria-hidden="true" />
        </label>
        <nav aria-label={`${ui.name} preview navigation`}>
          {ui.navigation.map((item, index) => <span className={index === 3 ? 'active' : ''} key={item}>{item}</span>)}
        </nav>
      </header>

      <div className="social-profile-cover" aria-hidden="true"><span>PUBLIC PROFILE // CASE PREVIEW</span></div>

      <section className="social-profile-identity">
        <ProfileAvatar example={example} />
        <div>
          <h4>{example.profileName}{example.verifiedBadge && <span className="social-verified-badge" title="Verified profile">✓</span>}</h4>
          <EvidenceText as="p" text={example.handle} hotspots={example.hotspots} revealedClues={revealedClues} onReveal={onReveal} hintedClueId={hintedClueId} />
          <EvidenceText as="small" text={example.meta} hotspots={example.hotspots} revealedClues={revealedClues} onReveal={onReveal} hintedClueId={hintedClueId} />
        </div>
        <button type="button" tabIndex="-1" aria-hidden="true">{platform === 'linkedin' ? 'Connect' : 'Message'}</button>
      </section>

      {(stats || example.roleHighlight || example.mutualFriends) && (
        <div className="social-profile-facts">
          {stats && <EvidenceText as="span" className="social-stats-evidence" text={statsText} hotspots={example.hotspots} revealedClues={revealedClues} onReveal={onReveal} hintedClueId={hintedClueId} />}
          {example.roleHighlight && <span className="wide"><strong>Claimed role</strong><EvidenceText text={example.roleHighlight} hotspots={example.hotspots} revealedClues={revealedClues} onReveal={onReveal} hintedClueId={hintedClueId} /></span>}
          {example.mutualFriends && <span className="wide"><strong>Network</strong><EvidenceText text={example.mutualFriends} hotspots={example.hotspots} revealedClues={revealedClues} onReveal={onReveal} hintedClueId={hintedClueId} /></span>}
        </div>
      )}

      <div className="social-message-area">
        <header><ProfileAvatar example={example} /><div><strong>{example.profileName}</strong><span>{example.onlineStatus || ui.surface}</span></div></header>
        <div className="social-message-thread">
          {example.chatHistory?.map((message, index) => (
            <div className="social-message" key={`${message.time}-${index}`}>
              <EvidenceText as="p" text={message.text} hotspots={example.hotspots} revealedClues={revealedClues} onReveal={onReveal} hintedClueId={hintedClueId} />
              <span>{message.time}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function FindingPanel({ example, revealedClues }) {
  const activeFinding = example.hotspots.find((clue) => clue.id === revealedClues.at(-1))

  return (
    <aside className="social-findings-panel">
      <div className="social-risk-dial" style={{ '--risk-progress': `${(revealedClues.length / Math.max(1, example.hotspots.length)) * 360}deg` }}>
        <div><strong>{revealedClues.length}</strong><span>OF {example.hotspots.length}</span></div>
      </div>
      <div className="social-findings-heading">
        <small>CASE FINDINGS</small>
        <h4>{revealedClues.length === example.hotspots.length ? 'Profile deception exposed' : 'Build the evidence picture'}</h4>
        <p>{revealedClues.length === example.hotspots.length
          ? 'You found every warning sign in this profile. Finish the remaining cases to continue.'
          : 'A single detail may be harmless. Several inconsistencies together form a reliable warning pattern.'}</p>
      </div>

      {activeFinding ? (
        <article className="social-active-finding" key={activeFinding.id}>
          <span>NEW FINDING</span><h5>{activeFinding.title}</h5><p>{activeFinding.explanation}</p>
          <div><strong>SAFER MOVE</strong>{activeFinding.teenTip}</div>
        </article>
      ) : (
        <div className="social-empty-finding"><span aria-hidden="true">⌖</span><p>Inspect the profile and conversation, then select the suspicious words or details directly.</p></div>
      )}

      <div className="social-case-checklist">
        {example.hotspots.map((clue) => (
          <span className={revealedClues.includes(clue.id) ? 'found' : ''} key={clue.id}>
            <i>{revealedClues.includes(clue.id) ? '✓' : '○'}</i>{clue.label}
          </span>
        ))}
      </div>
    </aside>
  )
}

export default function SocialTrainingModule({
  platform, kicker, title, inspectionExamples, verificationChallenges,
  responseScenario, summaryData, completed, onComplete, onClose,
}) {
  const [step, setStep] = useState(0)
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [revealedClues, setRevealedClues] = useState({})
  const [verificationIndex, setVerificationIndex] = useState(0)
  const [verificationAnswers, setVerificationAnswers] = useState({})
  const [verificationPassed, setVerificationPassed] = useState([])
  const [responseTurn, setResponseTurn] = useState(0)
  const [responseHistory, setResponseHistory] = useState([])
  const [simulationFinished, setSimulationFinished] = useState(false)
  const [hintedClueId, setHintedClueId] = useState(null)
  const contentRef = useRef(null)
  const conversationRef = useRef(null)
  const ui = platformUi[platform]

  useEffect(() => {
    const handleKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => { contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  useEffect(() => {
    conversationRef.current?.scrollTo({ top: conversationRef.current.scrollHeight, behavior: 'smooth' })
  }, [responseHistory])

  const currentExample = inspectionExamples[currentExampleIndex] ?? inspectionExamples[0]
  const currentRevealed = revealedClues[currentExample.id] ?? []
  const firstUnresolvedClueId = currentExample.hotspots.find((clue) => !currentRevealed.includes(clue.id))?.id ?? null
  const totalClues = inspectionExamples.reduce((total, example) => total + example.hotspots.length, 0)
  const foundClues = Object.values(revealedClues).reduce((total, ids) => total + ids.length, 0)
  const allCluesFound = foundClues === totalClues
  const currentVerification = verificationChallenges[verificationIndex] ?? verificationChallenges[0]
  const currentVerificationAnswer = verificationAnswers[currentVerification.id]
  const currentVerificationPassed = verificationPassed.includes(currentVerification.id)
  const currentResponse = responseScenario.turns[responseTurn]
  const currentResponseRecord = responseHistory[responseTurn]
  const currentResponseAnswer = currentResponseRecord?.option.id
  const allResponsesMade = responseHistory.length === responseScenario.turns.length

  useEffect(() => {
    if (step !== 0 || currentRevealed.length > 0) return undefined

    const hintTimer = window.setTimeout(() => {
      setHintedClueId(firstUnresolvedClueId)
    }, 15000)

    return () => window.clearTimeout(hintTimer)
  }, [step, currentExample.id, currentRevealed.length, firstUnresolvedClueId])

  const safeResponseCount = useMemo(
    () => responseHistory.filter(({ option }) => option.risk === 0).length,
    [responseHistory],
  )

  const score = Math.round(
    (foundClues / Math.max(1, totalClues)) * 40
    + (verificationPassed.length / Math.max(1, verificationChallenges.length)) * 30
    + (safeResponseCount / Math.max(1, responseScenario.turns.length)) * 30
  )

  const exposure = responseHistory.reduce((total, { option }) => total + option.risk, 0)

  const canAdvance = step === 0 ? allCluesFound
    : step === 1 ? verificationPassed.length === verificationChallenges.length
      : step === 2 ? simulationFinished : true

  const revealClue = (clueId) => {
    setHintedClueId(null)
    setRevealedClues((current) => {
      const existing = current[currentExample.id] ?? []
      return existing.includes(clueId) ? current : { ...current, [currentExample.id]: [...existing, clueId] }
    })
  }

  const selectInspectionExample = (index) => {
    setHintedClueId(null)
    setCurrentExampleIndex(index)
  }

  const chooseVerificationAnswer = (optionId) => {
    if (currentVerificationPassed) return
    setVerificationAnswers((current) => ({ ...current, [currentVerification.id]: optionId }))
    if (optionId === currentVerification.correct) {
      setVerificationPassed((current) => current.includes(currentVerification.id) ? current : [...current, currentVerification.id])
    }
  }

  const chooseResponse = (optionId) => {
    if (!currentResponse || currentResponseAnswer) return
    const option = currentResponse.options.find((item) => item.id === optionId)
    if (!option) return
    setResponseHistory((current) => [...current, { turn: currentResponse, option }])
  }

  const resetResponse = () => { setResponseHistory([]); setResponseTurn(0); setSimulationFinished(false) }
  const advance = () => { if (step < 3) setStep((current) => current + 1); else { onComplete(); onClose() } }
  const back = () => { if (step > 0) setStep((current) => current - 1) }

  return (
    <div className={`email-lesson-backdrop social-training-backdrop social-theme-${platform}`}>
      <section className="email-lesson-modal universal-lesson social-training-modal" role="dialog" aria-modal="true" aria-labelledby={`${platform}-module-title`}>
        <header className="email-lesson-header social-training-header">
          <div className="social-training-title"><span className="social-module-mark" aria-hidden="true">{ui.mark}</span><div><span className="lesson-kicker">{kicker}</span><h2 id={`${platform}-module-title`}>{title}</h2></div></div>
          <div className="social-training-header-status"><span /> LIVE AWARENESS LAB</div>
          <button className="lesson-close" type="button" aria-label="Close training module" onClick={onClose}>×</button>
        </header>

        <nav className="lesson-progress social-training-progress" aria-label={`Training stage ${step + 1} of 4`}>
          {stageLabels.map(([number, label], index) => (
            <button type="button" className={`${index === step ? 'current' : ''} ${index < step ? 'complete' : ''}`} key={number} disabled={index > step} onClick={() => index < step && setStep(index)} aria-current={index === step ? 'step' : undefined}>
              <span>{index < step ? '✓' : number}</span><small>{label}</small>
            </button>
          ))}
        </nav>

        <div className={`email-lesson-content social-training-content ${step === 0 ? 'social-forensics-open' : ''}`} ref={contentRef}>
          {step === 0 && (
            <div className="lesson-stage social-forensics-stage">
              <div className="social-stage-intro">
                <div><span className="lesson-step-label">STAGE 01 // PROFILE FORENSICS</span><h3>Investigate before you trust</h3><p>Fake profiles rarely fail in just one place. Compare the account history, identity details, network and request. Find every inconsistency across all three case files.</p></div>
                <div className="social-stage-stat"><strong>{foundClues}<small> / {totalClues}</small></strong><span>WARNING SIGNS FOUND</span></div>
              </div>

              <div className="social-case-tabs" role="tablist" aria-label="Fake profile case files">
                {inspectionExamples.map((example, index) => {
                  const found = (revealedClues[example.id] ?? []).length
                  const complete = found === example.hotspots.length
                  return (
                    <button className={`${index === currentExampleIndex ? 'active' : ''} ${complete ? 'complete' : ''}`} type="button" role="tab" aria-selected={index === currentExampleIndex} key={example.id} onClick={() => selectInspectionExample(index)}>
                      <span>{complete ? '✓' : `0${index + 1}`}</span><div><small>{example.tag.replace(/[^\w\s]/g, '').trim()}</small><strong>{example.type}</strong></div><em>{found}/{example.hotspots.length}</em>
                    </button>
                  )
                })}
              </div>

              <div className="social-forensics-grid"><PlatformProfile platform={platform} example={currentExample} revealedClues={currentRevealed} onReveal={revealClue} hintedClueId={hintedClueId} /><FindingPanel example={currentExample} revealedClues={currentRevealed} /></div>
            </div>
          )}

          {step === 1 && (
            <div className="lesson-stage social-verification-stage">
              <div className="social-stage-intro">
                <div><span className="lesson-step-label">STAGE 02 // VERIFY THE IDENTITY</span><h3>Move from suspicion to proof</h3><p>A polished profile, mutual connections and a familiar photo are not proof. Choose the strongest independent verification method for each situation.</p></div>
                <div className="social-stage-stat"><strong>{verificationPassed.length}<small> / {verificationChallenges.length}</small></strong><span>IDENTITIES VERIFIED</span></div>
              </div>

              <div className="social-verification-workspace">
                <aside className="social-verification-cases"><span>VERIFICATION QUEUE</span>{verificationChallenges.map((challenge, index) => (
                  <button className={`${index === verificationIndex ? 'active' : ''} ${verificationPassed.includes(challenge.id) ? 'complete' : ''}`} type="button" key={challenge.id} onClick={() => setVerificationIndex(index)}>
                    <i>{verificationPassed.includes(challenge.id) ? '✓' : index + 1}</i><div><strong>{challenge.title}</strong><small>{challenge.category}</small></div>
                  </button>
                ))}</aside>

                <section className="social-verification-case">
                  <header><span>CASE {String(verificationIndex + 1).padStart(2, '0')}</span><div><small>{currentVerification.category}</small><h4>{currentVerification.title}</h4></div></header>
                  <div className="social-verification-context"><span aria-hidden="true">?</span><p>{currentVerification.context}</p></div>
                  <p className="social-verification-question">{currentVerification.question}</p>
                  <div className="social-verification-options">
                    {currentVerification.options.map((option) => {
                      const selected = currentVerificationAnswer === option.id
                      const correct = selected && option.id === currentVerification.correct
                      const incorrect = selected && option.id !== currentVerification.correct
                      return (
                        <button className={`${selected ? 'selected' : ''} ${correct ? 'correct' : ''} ${incorrect ? 'incorrect' : ''}`} type="button" key={option.id} onClick={() => chooseVerificationAnswer(option.id)} disabled={currentVerificationPassed}>
                          <span>{option.label}</span><p>{option.text}</p><i>{selected ? (correct ? '✓ VERIFIED' : '× NOT ENOUGH') : 'SELECT'}</i>
                        </button>
                      )
                    })}
                  </div>
                  {currentVerificationAnswer && (
                    <div className={`social-verification-feedback ${currentVerificationPassed ? 'correct' : 'incorrect'}`}><ShieldIcon checked={currentVerificationPassed} /><div><strong>{currentVerificationPassed ? 'Independent verification complete' : 'That evidence can still be manipulated'}</strong><p>{currentVerification.options.find((option) => option.id === currentVerificationAnswer)?.feedback}</p>{!currentVerificationPassed && <small>Try another verification route.</small>}</div></div>
                  )}
                </section>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="lesson-stage social-response-stage">
              <div className="social-stage-intro">
                <div><span className="lesson-step-label">STAGE 03 // CONTROL THE OUTCOME</span><h3>{responseScenario.title}</h3><p>{responseScenario.introduction}</p></div>
                <div className={`social-exposure-meter ${exposure >= 60 ? 'critical' : exposure > 0 ? 'elevated' : ''}`}><strong>{Math.min(100, exposure)}%</strong><span>COMPROMISE RISK</span><i><b style={{ width: `${Math.min(100, exposure)}%` }} /></i></div>
              </div>

              <div className="social-response-workspace">
                <section className={`social-conversation-window social-platform-${platform}`}>
                  <header><ProfileAvatar example={responseScenario.profile} /><div><strong>{responseScenario.profile.profileName}</strong><span>{responseScenario.profile.handle} • Active now</span></div><i>•••</i></header>
                  <div className="social-conversation-history" ref={conversationRef}>
                    <div className="social-conversation-exchange">
                      <div className="incoming"><p>{responseScenario.turns[0].message}</p><span>{responseScenario.turns[0].time}</span></div>
                    </div>
                    {responseHistory.map(({ turn, option }, index) => (
                      <div className="social-conversation-exchange" key={turn.id}>
                        <div className={`outgoing ${option.risk === 0 ? 'safe' : option.risk >= 30 ? 'risky' : 'uncertain'}`}><p>{option.reply}</p><span>Your response</span></div>
                        <div className="incoming social-scammer-reaction"><p>{option.scammerReply}</p><span>{option.scammerTime ?? `Follow-up ${index + 1}`}</span></div>
                        {index < responseTurn && <small>{option.feedback}</small>}
                      </div>
                    ))}
                  </div>
                  <footer><span>＋</span><div>{currentResponseAnswer ? 'Response sent' : 'Choose a response from the decision console'}</div><button type="button" tabIndex="-1">➤</button></footer>
                </section>

                <section className="social-decision-console">
                  {!simulationFinished ? (
                    <>
                      <header><span>DECISION {responseTurn + 1} OF {responseScenario.turns.length}</span><strong>{currentResponse.prompt}</strong></header>
                      <div className="social-response-options">{currentResponse.options.map((option) => {
                        const selected = currentResponseAnswer === option.id
                        return <button className={`${selected ? 'selected' : ''} ${selected ? (option.risk === 0 ? 'safe' : option.risk >= 30 ? 'risky' : 'uncertain') : ''}`} type="button" key={option.id} onClick={() => chooseResponse(option.id)} disabled={Boolean(currentResponseAnswer)}><span>{option.label}</span><p>{option.action}</p></button>
                      })}</div>
                      {currentResponseAnswer && (
                        <div className={`social-response-feedback ${currentResponseRecord.option.risk === 0 ? 'safe' : 'risk'}`}>
                          <strong>{currentResponseRecord.option.resultTitle}</strong><p>{currentResponseRecord.option.feedback}</p>
                          {responseTurn < responseScenario.turns.length - 1
                            ? <button type="button" onClick={() => setResponseTurn((current) => current + 1)}>CONTINUE CONVERSATION →</button>
                            : allResponsesMade && <button type="button" onClick={() => setSimulationFinished(true)}>VIEW OUTCOME →</button>}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={`social-simulation-result ${exposure === 0 ? 'safe' : exposure >= 60 ? 'critical' : 'mixed'}`}>
                      <span className="social-result-shield"><ShieldIcon checked={exposure === 0} /></span><small>SIMULATION COMPLETE</small>
                      <h4>{exposure === 0 ? responseScenario.outcomes.safe.title : exposure >= 60 ? responseScenario.outcomes.risky.title : responseScenario.outcomes.mixed.title}</h4>
                      <p>{exposure === 0 ? responseScenario.outcomes.safe.text : exposure >= 60 ? responseScenario.outcomes.risky.text : responseScenario.outcomes.mixed.text}</p>
                      <div><span>SAFE DECISIONS</span><strong>{safeResponseCount} / {responseScenario.turns.length}</strong></div><button type="button" onClick={resetResponse}>↻ REPLAY DECISIONS</button>
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="lesson-stage social-summary-stage">
              <div className="social-completion-hero"><div className="social-completion-rings" aria-hidden="true"><span><ShieldIcon checked /></span></div><div><span className="lesson-step-label">STAGE 04 // FIELD SUMMARY</span><h3>{summaryData.badgeTitle}</h3><p>You can now recognise, verify and safely respond to fake {ui.name} profiles.</p></div><div className="social-final-score"><strong>{score}</strong><span>AWARENESS SCORE</span></div></div>

              <div className="social-summary-grid">
                <section className="social-summary-panel"><header><span>01</span><div><small>RECOGNISE</small><h4>Look for a pattern, not one clue</h4></div></header><p>Check account age, naming, content history, network quality, links and the nature of the request together.</p><div className="social-summary-patterns"><span>{summaryData.coreTactic}</span></div></section>
                <section className="social-summary-panel"><header><span>02</span><div><small>VERIFY</small><h4>Leave the suspicious conversation</h4></div></header><p>{summaryData.bestPractice}</p><div className="social-summary-patterns"><span>Use a saved number</span><span>Open the official site yourself</span></div></section>
                <section className="social-summary-panel"><header><span>03</span><div><small>CONTAIN</small><h4>Protect the wider network</h4></div></header><p>Do not send money, credentials, codes or files. Capture useful evidence, report the account and warn the real person through another channel.</p><div className="social-summary-patterns"><span>{ui.reportPath}</span></div></section>
              </div>

              <section className="social-field-rules"><header><span>FIELD RULES</span><p>Keep these behaviours after the simulation.</p></header><div>{summaryData.teenRules.map((rule) => <article key={rule.title}><span aria-hidden="true">{rule.emoji}</span><div><strong>{rule.title}</strong><p>{rule.text}</p></div></article>)}</div></section>
              <div className="social-summary-note"><ShieldIcon checked /><p><strong>Remember:</strong> A profile can look convincing because the photos, job title and mutual connections may all be copied from a real person. Verify the person—not the appearance of the account.</p></div>
            </div>
          )}
        </div>

        <footer className="email-lesson-footer social-training-footer">
          <div><strong>{step === 0 ? `${foundClues}/${totalClues}` : step === 1 ? `${verificationPassed.length}/${verificationChallenges.length}` : step === 2 ? `${responseHistory.length}/${responseScenario.turns.length}` : `${score}%`}</strong><span>{step === 0 ? 'EVIDENCE FOUND' : step === 1 ? 'CASES VERIFIED' : step === 2 ? 'DECISIONS MADE' : 'FINAL SCORE'}</span></div>
          <button className="lesson-secondary" type="button" onClick={back} disabled={step === 0}>BACK</button>
          <button className="lesson-primary" type="button" onClick={advance} disabled={!canAdvance}>{step < 3 ? 'CONTINUE →' : completed ? 'COMPLETE REVIEW ✓' : 'COMPLETE MODULE ✓'}</button>
        </footer>
      </section>
    </div>
  )
}
