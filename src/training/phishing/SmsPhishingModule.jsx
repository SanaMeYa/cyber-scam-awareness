import { useEffect, useRef, useState } from 'react'
import { manipulationChoices, smsManipulationExamples, smsSafeRouteExamples, smsWarningExamples, totalSmsClues } from './smsData.js'

export default function SmsPhishingModule({ completed, onComplete, onClose }) {
  const smsLessonOpen = true
  const smsLessonMode = 'library'
  const [smsLessonStep, setSmsLessonStep] = useState(0)
  const [smsCluesFound, setSmsCluesFound] = useState(() => new Set())
  const [smsManipulationAnswers, setSmsManipulationAnswers] = useState({})
  const [smsSafeRouteAnswers, setSmsSafeRouteAnswers] = useState({})
  const smsLessonContentRef = useRef(null)

  useEffect(() => {
    if (!smsLessonOpen || smsLessonMode === 'required') return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [smsLessonMode, smsLessonOpen, onClose])

  useEffect(() => {
    if (smsLessonOpen && smsLessonContentRef.current) {
      smsLessonContentRef.current.scrollTop = 0
    }
  }, [smsLessonOpen, smsLessonStep])

  const revealSmsClue = (clueId) => {
    setSmsCluesFound((current) => new Set(current).add(clueId))
  }

  const advanceSmsLesson = () => {
    const manipulationComplete = smsManipulationExamples.every((example) => smsManipulationAnswers[example.id] === example.correct)
    const safeRoutesComplete = smsSafeRouteExamples.every((example) => smsSafeRouteAnswers[example.id] === example.correct)

    if (smsLessonStep === 0 && smsCluesFound.size < totalSmsClues) return
    if (smsLessonStep === 1 && !manipulationComplete) return
    if (smsLessonStep === 2 && !safeRoutesComplete) return

    if (smsLessonStep < 3) {
      setSmsLessonStep((current) => current + 1)
      return
    }

    onComplete()
    onClose()
  }

  const correctManipulationCount = smsManipulationExamples.filter((example) => smsManipulationAnswers[example.id] === example.correct).length
  const correctSafeRouteCount = smsSafeRouteExamples.filter((example) => smsSafeRouteAnswers[example.id] === example.correct).length
  const smsCurrentStepComplete = smsLessonStep === 0
    ? smsCluesFound.size === totalSmsClues
    : smsLessonStep === 1
      ? correctManipulationCount === smsManipulationExamples.length
      : smsLessonStep === 2
        ? correctSafeRouteCount === smsSafeRouteExamples.length
        : true
  const smsStepProgress = smsLessonStep === 0
    ? smsCluesFound.size / totalSmsClues
    : smsLessonStep === 1
      ? correctManipulationCount / smsManipulationExamples.length
      : smsLessonStep === 2
        ? correctSafeRouteCount / smsSafeRouteExamples.length
        : 1
  const smsProgressPercent = Math.round(((smsLessonStep + smsStepProgress) / 4) * 100)

  return (
        <div className="email-lesson-backdrop sms-lesson-backdrop">
          <section className="email-lesson-modal universal-lesson sms-lesson-modal" role="dialog" aria-modal="true" aria-labelledby="sms-lesson-title">
            <header className="email-lesson-header sms-lesson-header">
              <div>
                <span className="lesson-kicker">UNIVERSAL TRAINING MODULE // SMS PHISHING</span>
                <h2 id="sms-lesson-title">SMS PHISHING AWARENESS</h2>
              </div>
              <button className="lesson-close" type="button" aria-label="Close SMS training and return to the game" onClick={() => onClose()}>×</button>
            </header>

            <div className="lesson-progress sms-lesson-progress" aria-label={`SMS training step ${smsLessonStep + 1} of 4`}>
              {['SPOT THE SIGNS', 'BREAK THE PRESSURE', 'SAFE RESPONSE', 'SUMMARY'].map((label, index) => (
                <div className={`${index === smsLessonStep ? 'current' : ''} ${index < smsLessonStep ? 'complete' : ''}`} key={label}>
                  <span>{index < smsLessonStep ? '✓' : index + 1}</span><small>{label}</small>
                </div>
              ))}
            </div>

            <div className="email-lesson-content sms-lesson-content" ref={smsLessonContentRef}>
              {smsLessonStep === 0 && (
                <div className="lesson-stage sms-warning-stage">
                  <div className="lesson-overview-banner sms-overview-banner">
                    <div><span className="lesson-step-label">STEP 1 // INSPECT FOUR CONVERSATIONS</span><h3>Tap the warning signs</h3></div>
                    <div className="clue-counter"><strong>{smsCluesFound.size} / {totalSmsClues}</strong><span>warning signs found</span></div>
                    <p>SMS phishing—sometimes called smishing—can imitate delivery services, banks, toll providers and workplace support. Tap every highlighted part of these fictional messages.</p>
                  </div>

                  <div className="sms-warning-list">
                    {smsWarningExamples.map((example, index) => {
                      const renderSmsHotspot = (area, content, className = 'sms-hotspot', key) => {
                        const clue = example.clues.find((item) => item.area === area)
                        if (!clue) return content
                        const found = smsCluesFound.has(clue.id)
                        return <button className={`sms-hotspot ${className} ${found ? 'found' : ''}`} type="button" key={key} aria-pressed={found} onClick={() => revealSmsClue(clue.id)}>{content}<span>◎</span></button>
                      }

                      return (
                        <article className="sms-warning-example" key={example.id}>
                          <header><span>CONVERSATION {index + 1}</span><strong>{example.type}</strong></header>
                          <div className="sms-example-layout">
                            <div className={`training-phone phone-${example.layout}`} aria-label={`Fictional ${example.type} SMS conversation`}>
                              <div className="phone-status"><span>{example.time}</span><i>▮▮▮ ᯤ ▰</i></div>
                              <div className="phone-contact">
                                <span className="phone-back">‹</span><div className="phone-contact-avatar">{example.sender.slice(0, 1)}</div>
                                <div><strong>{example.sender}</strong>{renderSmsHotspot(example.headerArea, example.senderMeta, 'sms-header-hotspot')}</div><span className="phone-info">ⓘ</span>
                              </div>
                              <div className="phone-thread">
                                <div className="phone-date">TODAY</div>
                                {example.priorMessage && <div className="sms-prior-message"><small>EARLIER GENUINE MESSAGE</small><p>{example.priorMessage}</p></div>}
                                {example.bubbles.map((bubble, bubbleIndex) => bubble.area
                                  ? renderSmsHotspot(bubble.area, <>{bubble.text}</>, `sms-bubble sms-bubble-${bubble.kind ?? 'text'}`, `${example.id}-${bubble.area}`)
                                  : <div className="sms-bubble" key={`${example.id}-${bubbleIndex}`}>{bubble.text}</div>)}
                                <small className="sms-training-note">Fictional training conversation — links and phone numbers are inactive.</small>
                              </div>
                              <div className="phone-compose"><span>＋</span><div>Text message</div><span>↑</span></div>
                            </div>

                            <div className="sms-clue-results" aria-live="polite">
                              {example.clues.map((clue) => (
                                <div className={smsCluesFound.has(clue.id) ? 'revealed' : ''} key={clue.id}>
                                  <span>{smsCluesFound.has(clue.id) ? '✓' : '?'}</span>
                                  <div><strong>{smsCluesFound.has(clue.id) ? clue.title : 'Warning sign hidden'}</strong><p>{smsCluesFound.has(clue.id) ? clue.explanation : 'Tap one of the highlighted areas inside the phone.'}</p></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              )}

              {smsLessonStep === 1 && (
                <div className="lesson-stage sms-manipulation-stage">
                  <div className="lesson-overview-banner sms-overview-banner">
                    <div><span className="lesson-step-label">STEP 2 // UNDERSTAND THE PRESSURE</span><h3>Break the manipulation</h3></div>
                    <div className="clue-counter"><strong>{correctManipulationCount} / {smsManipulationExamples.length}</strong><span>tactics identified</span></div>
                    <p>SMS messages are short, so scammers often rely on a strong emotional trigger. Identify the main tactic used in each message.</p>
                  </div>
                  <div className="manipulation-grid">
                    {smsManipulationExamples.map((example, index) => (
                      <article className="manipulation-card" key={example.id}>
                        <header><span>MESSAGE {index + 1}</span><strong>{example.label}</strong></header>
                        <div className="mini-sms-preview"><div className="mini-phone-sender">Unknown sender</div><p>{example.message}</p><small>Received now</small></div>
                        <div className="manipulation-options">
                          {manipulationChoices.map((choice) => {
                            const selected = smsManipulationAnswers[example.id] === choice.id
                            const answerClass = selected ? (choice.id === example.correct ? 'correct' : 'incorrect') : ''
                            return <button className={`manipulation-option ${selected ? 'selected' : ''} ${answerClass}`} type="button" key={choice.id} aria-pressed={selected} onClick={() => setSmsManipulationAnswers((current) => ({ ...current, [example.id]: choice.id }))}><span>{choice.icon}</span><div><strong>{choice.title}</strong><small>{choice.description}</small></div></button>
                          })}
                        </div>
                        {smsManipulationAnswers[example.id] && (
                          <div className={`sms-answer-feedback ${smsManipulationAnswers[example.id] === example.correct ? 'correct' : 'incorrect'}`}>
                            <strong>{smsManipulationAnswers[example.id] === example.correct ? '✓ Tactic identified' : '× Look at the emotion being triggered'}</strong>
                            <p>{smsManipulationAnswers[example.id] === example.correct ? example.explanation : 'Ask what feeling the message wants to create before you have time to verify it.'}</p>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {smsLessonStep === 2 && (
                <div className="lesson-stage sms-route-stage">
                  <div className="lesson-overview-banner sms-overview-banner">
                    <div><span className="lesson-step-label">STEP 3 // LEAVE THE UNTRUSTED PATH</span><h3>Choose the safe response</h3></div>
                    <div className="clue-counter"><strong>{correctSafeRouteCount} / {smsSafeRouteExamples.length}</strong><span>safe routes chosen</span></div>
                    <p>The safest response usually leaves the SMS conversation and uses a contact method you found independently. Resolve each scenario.</p>
                  </div>
                  <div className="safe-route-list">
                    {smsSafeRouteExamples.map((example, index) => {
                      const selectedAnswer = smsSafeRouteAnswers[example.id]
                      const isCorrect = selectedAnswer === example.correct
                      return (
                        <article className="safe-route-card" key={example.id}>
                          <div className="route-situation">
                            <span>SCENARIO {index + 1}</span><h3>{example.title}</h3>
                            <div className="route-phone-preview" aria-label={`Fictional message from ${example.sender}`}>
                              <div className="route-phone-status"><span>{example.time}</span><i>▮▮▮ ᯤ ▰</i></div>
                              <div className="route-phone-contact"><span>‹</span><div><strong>{example.sender}</strong><small>Text message</small></div><span>ⓘ</span></div>
                              <div className="route-phone-thread">
                                <small>TODAY</small>
                                {example.messages.map((message, messageIndex) => (
                                  <div className={`route-message ${message.kind ?? ''} ${message.direction ?? ''}`} key={`${example.id}-message-${messageIndex}`}>{message.direction === 'event' && <span>!</span>}{message.text}</div>
                                ))}
                              </div>
                            </div>
                            <p className="route-context"><strong>CONTEXT</strong>{example.situation}</p>
                            <div className="route-impact"><strong>WHY IT MATTERS TO THE COMPANY</strong><p>{example.companyImpact}</p></div>
                          </div>
                          <div className="route-decisions">
                            <span>WHAT SHOULD YOU DO NEXT?</span>
                            <div className="route-options-grid">
                              {example.options.map((option, optionIndex) => {
                                const selected = selectedAnswer === optionIndex
                                const answerClass = selected ? (optionIndex === example.correct ? 'correct' : 'incorrect') : ''
                                return <button className={`route-option ${selected ? 'selected' : ''} ${answerClass}`} type="button" key={option} aria-pressed={selected} onClick={() => setSmsSafeRouteAnswers((current) => ({ ...current, [example.id]: optionIndex }))}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>
                              })}
                            </div>
                            {selectedAnswer !== undefined && <div className={`sms-answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}><strong>{isCorrect ? '✓ Safe route selected' : '× This keeps you in an unverified path'}</strong><p>{isCorrect ? example.success : 'Try again. Choose an option that does not rely on the link, number or identity supplied by the SMS.'}</p></div>}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              )}

              {smsLessonStep === 3 && (
                <div className="lesson-stage summary-stage sms-summary-stage">
                  <div className="lesson-overview-banner summary-banner sms-overview-banner">
                    <div><span className="lesson-step-label">STEP 4 // SMS PHISHING SUMMARY</span><h3>Stop. Leave the message. Verify independently.</h3></div>
                    <p>A sender name, familiar conversation or personal detail is not proof of identity. Treat unexpected links, payment requests, login prompts and requests for one-time codes as reasons to pause.</p>
                  </div>
                  <div className="summary-principles sms-summary-principles">
                    <article><span>01</span><strong>STOP</strong><p>Notice urgency, fear, authority or reward before the emotion drives the decision.</p></article>
                    <article><span>02</span><strong>DON’T USE THE SMS</strong><p>Do not follow its link, call its number, reply with information or approve an unexpected prompt.</p></article>
                    <article><span>03</span><strong>CHECK INDEPENDENTLY</strong><p>Open the known app or website, or use a phone number already held by the organisation.</p></article>
                    <article><span>04</span><strong>REPORT QUICKLY</strong><p>Report suspicious messages and any information entered so the company can respond early.</p></article>
                  </div>
                  <section className="summary-impact sms-summary-impact">
                    <div><span className="lesson-step-label">HOW SMS PHISHING CAN REDUCE COMPANY FUNDS</span><h3>A short message can create long-term costs</h3><p>The simulation’s funds meter represents the wider business harm caused when SMS phishing succeeds.</p></div>
                    <div className="summary-impact-grid">
                      <article><strong>PAYMENT &amp; CARD LOSS</strong><p>Fake fees, payment pages and impersonation can expose company cards or redirect money.</p></article>
                      <article><strong>ACCOUNT COMPROMISE</strong><p>Passwords, authentication approvals or one-time codes can expose company services.</p></article>
                      <article><strong>RESPONSE &amp; DOWNTIME</strong><p>Security teams may need to secure accounts, inspect devices and pause affected work.</p></article>
                      <article><strong>DATA &amp; TRUST</strong><p>Exposed customer or staff information can create notification, support and reputation costs.</p></article>
                    </div>
                  </section>
                  <section className="learning-resources sms-learning-resources">
                    <div><span className="lesson-step-label">CONTINUE LEARNING</span><h3>Official Australian guidance</h3><p>Use these resources for current SMS scam prevention and reporting advice.</p></div>
                    <div className="resource-links">
                      <a href="https://www.cyber.gov.au/threats/types-threats/phishing" target="_blank" rel="noreferrer"><strong>ACSC — Phishing</strong><span>Email and text-message protection advice ›</span></a>
                      <a href="https://www.scamwatch.gov.au/types-of-scams/phishing-scams" target="_blank" rel="noreferrer"><strong>Scamwatch — Phishing scams</strong><span>Warning signs and safe verification ›</span></a>
                      <a href="https://www.acma.gov.au/phone-and-sms-scams" target="_blank" rel="noreferrer"><strong>ACMA — Phone and SMS scams</strong><span>Protect yourself from scam messages ›</span></a>
                      <a href="https://www.esafety.gov.au/key-topics/staying-safe/online-scams" target="_blank" rel="noreferrer"><strong>eSafety — Online scams</strong><span>Practical online safety guidance ›</span></a>
                    </div>
                  </section>
                  <div className="completion-callout sms-completion-callout"><span>✓</span><div><strong>MODULE READY TO COMPLETE</strong><p>{completed ? 'You have reviewed the complete SMS Phishing training module again.' : 'Complete the module to mark SMS Phishing as finished in your Learning Library.'}</p></div></div>
                </div>
              )}
            </div>

            <footer className="email-lesson-footer sms-lesson-footer">
              <button className="lesson-secondary" type="button" disabled={smsLessonStep === 0} onClick={() => setSmsLessonStep((current) => Math.max(0, current - 1))}>‹ PREVIOUS</button>
              <div><span>LEARNING PROGRESS</span><strong>{smsProgressPercent}%</strong></div>
              <button className="lesson-primary" type="button" disabled={!smsCurrentStepComplete} onClick={advanceSmsLesson}>{smsLessonStep === 3 ? (completed ? 'FINISH REVIEW' : 'COMPLETE MODULE') : 'CONTINUE'} <span>›</span></button>
            </footer>
          </section>
        </div>
  )
}
