import { useEffect, useRef, useState } from 'react'
import { emailAttackJourneyStages, emailComparisonExamples, phishingInspectionExamples, totalPhishingClues } from './emailData.js'

export default function EmailPhishingModule({ completed, onComplete, onClose }) {
  const emailLessonOpen = true
  const emailLessonMode = 'library'
  const [emailLessonStep, setEmailLessonStep] = useState(0)
  const [emailCluesFound, setEmailCluesFound] = useState(() => new Set())
  const [emailComparisonAnswers, setEmailComparisonAnswers] = useState({})
  const [emailAttackJourneyStage, setEmailAttackJourneyStage] = useState(0)
  const [emailAttackConstructionStep, setEmailAttackConstructionStep] = useState(0)
  const [emailAttackConstructing, setEmailAttackConstructing] = useState(false)
  const [emailAttackSending, setEmailAttackSending] = useState(false)
  const [emailAttackInteractionOpened, setEmailAttackInteractionOpened] = useState(false)
  const [emailAttackHintVisible, setEmailAttackHintVisible] = useState(false)
  const emailLessonContentRef = useRef(null)

  useEffect(() => {
    if (!emailLessonOpen || emailLessonMode === 'required') return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [emailLessonMode, emailLessonOpen, onClose])

  useEffect(() => {
    if (emailLessonOpen && emailLessonContentRef.current) {
      emailLessonContentRef.current.scrollTop = 0
    }
  }, [emailLessonOpen, emailLessonStep])

  useEffect(() => {
    if (!emailLessonOpen || emailLessonStep !== 2 || !emailAttackConstructing) return undefined

    const timers = [
      window.setTimeout(() => setEmailAttackConstructionStep(1), 450),
      window.setTimeout(() => setEmailAttackConstructionStep(2), 1250),
      window.setTimeout(() => setEmailAttackConstructionStep(3), 2150),
      window.setTimeout(() => setEmailAttackConstructionStep(4), 3050),
      window.setTimeout(() => {
        setEmailAttackConstructing(false)
        setEmailAttackHintVisible(false)
      }, 3900),
    ]

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [emailAttackConstructing, emailLessonOpen, emailLessonStep])

  useEffect(() => {
    if (!emailLessonOpen || emailLessonStep !== 2 || !emailAttackSending) return undefined

    const timer = window.setTimeout(() => {
      setEmailAttackSending(false)
      setEmailAttackJourneyStage(2)
      setEmailAttackHintVisible(false)
    }, 2200)

    return () => window.clearTimeout(timer)
  }, [emailAttackSending, emailLessonOpen, emailLessonStep])

  useEffect(() => {
    if (!emailLessonOpen || emailLessonStep !== 2 || emailAttackConstructing || emailAttackSending || emailAttackJourneyStage >= emailAttackJourneyStages.length - 1) return undefined

    const timer = window.setTimeout(() => setEmailAttackHintVisible(true), 15000)
    return () => window.clearTimeout(timer)
  }, [emailAttackConstructing, emailAttackInteractionOpened, emailAttackJourneyStage, emailAttackSending, emailLessonOpen, emailLessonStep])

  const revealEmailClue = (clueId) => {
    setEmailCluesFound((current) => new Set(current).add(clueId))
  }

  const resetEmailAttackJourney = () => {
    setEmailAttackJourneyStage(0)
    setEmailAttackConstructionStep(0)
    setEmailAttackConstructing(false)
    setEmailAttackSending(false)
    setEmailAttackInteractionOpened(false)
    setEmailAttackHintVisible(false)
  }

  const startEmailAttackConstruction = () => {
    if (emailAttackJourneyStage !== 0 || emailAttackConstructing) return

    if (emailAttackConstructionStep === 4) {
      setEmailAttackHintVisible(false)
      setEmailAttackJourneyStage(1)
      return
    }

    setEmailAttackConstructionStep(0)
    setEmailAttackHintVisible(false)
    setEmailAttackConstructing(true)
  }

  const sendEmailThroughGateway = () => {
    if (emailAttackJourneyStage !== 1 || emailAttackSending) return
    setEmailAttackHintVisible(false)
    setEmailAttackSending(true)
  }

  const openPhishingInboxMessage = () => {
    if (emailAttackJourneyStage !== 2 || emailAttackInteractionOpened) return
    setEmailAttackHintVisible(false)
    setEmailAttackInteractionOpened(true)
  }

  const openSimulatedSignIn = () => {
    if (emailAttackJourneyStage !== 2 || !emailAttackInteractionOpened) return
    setEmailAttackHintVisible(false)
    setEmailAttackJourneyStage(3)
  }

  const submitSimulatedSignIn = () => {
    if (emailAttackJourneyStage !== 3) return
    setEmailAttackHintVisible(false)
    setEmailAttackJourneyStage(4)
  }

  const advanceEmailLesson = () => {
    const comparisonsComplete = emailComparisonExamples.every((example) => emailComparisonAnswers[example.id] === example.correct)

    if (emailLessonStep === 0 && emailCluesFound.size < totalPhishingClues) return
    if (emailLessonStep === 1 && !comparisonsComplete) return
    if (emailLessonStep === 2 && emailAttackJourneyStage < emailAttackJourneyStages.length - 1) return

    if (emailLessonStep < 3) {
      setEmailLessonStep((current) => current + 1)
      return
    }

    onComplete()
    onClose()
  }

  const comparisonsComplete = emailComparisonExamples.every((example) => emailComparisonAnswers[example.id] === example.correct)
  const correctComparisonCount = emailComparisonExamples.filter((example) => emailComparisonAnswers[example.id] === example.correct).length
  const currentLessonStepComplete = emailLessonStep === 0
    ? emailCluesFound.size === totalPhishingClues
    : emailLessonStep === 1
      ? comparisonsComplete
      : emailLessonStep === 2
        ? emailAttackJourneyStage === emailAttackJourneyStages.length - 1
        : true
  const lessonStepProgress = emailLessonStep === 0
    ? emailCluesFound.size / totalPhishingClues
    : emailLessonStep === 1
      ? correctComparisonCount / emailComparisonExamples.length
      : emailLessonStep === 2
        ? emailAttackJourneyStage / (emailAttackJourneyStages.length - 1)
        : 1
  const lessonProgressPercent = Math.round(((emailLessonStep + lessonStepProgress) / 4) * 100)
  const currentEmailAttackStage = emailAttackJourneyStages[emailAttackJourneyStage]
  const emailAttackJourneyComplete = emailAttackJourneyStage === emailAttackJourneyStages.length - 1
  const emailAttackHint = emailAttackJourneyStage === 0
    ? emailAttackConstructionStep === 4
      ? 'The phishing email is fully constructed. Select anywhere inside the workspace to continue to delivery.'
      : 'Select the construction workspace to watch the fictional phishing email take shape.'
    : emailAttackJourneyStage === 1
      ? 'Select the glowing envelope inside the Threat Simulation panel to send it through the gateway.'
      : emailAttackJourneyStage === 2 && !emailAttackInteractionOpened
        ? 'Open the highlighted unread message from Apex Supplier Accounts.'
        : emailAttackJourneyStage === 2
          ? 'Select “Review invoice details” inside the opened email.'
          : 'Select the prefilled “Simulated sign in” control to reveal the possible company-wide consequences.'

  const renderEmailJourneyInbox = (showPhishingEmail = false) => {
    const phishingEmailOpen = showPhishingEmail && emailAttackInteractionOpened

    return (
      <div className={`journey-inbox outlook-inbox split-outlook ${showPhishingEmail ? 'phishing-delivered' : 'delivery-preview'}`} aria-live="polite">
        <section className="outlook-message-pane">
          <header><div><h4>Inbox <span>★</span></h4></div><span>▣ {' '} ↓ {' '} ≡ {' '} ↕</span></header>
          <div className="outlook-date-divider"><span>⌄</span><strong>Today</strong></div>
          <div className="journey-mail-list">
            {showPhishingEmail && (
              <button className={`journey-mail-row phishing unread phishing-arrival ${phishingEmailOpen ? 'selected' : ''}`} type="button" onClick={openPhishingInboxMessage}>
                <span>AS</span><div><strong>Apex Supplier Accounts</strong><small>Payment processing paused — AP-1048</small><p>Action required before today’s payment run</p></div><em>NOW<i>UNREAD</i></em>
              </button>
            )}
            <div className="journey-mail-row"><span>SD</span><div><strong>Service Desk</strong><small>MFA enrolment completed</small><p>Your security registration was completed successfully.</p></div><em>9:08 AM</em></div>
            <div className="journey-mail-row"><span>SL</span><div><strong>Sarah Lindqvist</strong><small>Updated leave schedule for review</small><p>Please check the team schedule before Friday.</p></div><em>8:41 AM</em></div>
            <div className="outlook-date-divider mail-divider"><span>⌄</span><strong>Yesterday</strong></div>
            <div className="journey-mail-row"><span>TC</span><div><strong>Team Calendar</strong><small>Product sync moved to Meeting Room 2</small><p>The room and video link have been updated.</p></div><em>4:26 PM</em></div>
            <div className="journey-mail-row"><span>FM</span><div><strong>Facilities</strong><small>Level 3 kitchen maintenance</small><p>Maintenance is scheduled after 5:30 PM.</p></div><em>2:14 PM</em></div>
          </div>
        </section>

        <section className={`outlook-reading-pane ${phishingEmailOpen ? 'message-selected' : ''}`} aria-label="Email reading pane">
          {phishingEmailOpen ? (
            <div className="journey-open-email realistic-phishing-email outlook-reading-email">
              <div className="outlook-open-toolbar"><span>MESSAGE OPENED</span><span>↶ Reply {' '} ↠ Forward {' '} ⌫ Delete {' '} ⚑ Report</span></div>
              <div className="external-sender-warning"><span>!</span>EXTERNAL SENDER — VERIFY LINKS AND REQUESTS</div>
              <h4>Payment processing paused — Invoice AP-1048</h4>
              <header><span>AS</span><div><strong>Apex Supplier Accounts</strong><small>accounts@apex-billing.example</small></div></header>
              <div className="email-recipient-line">To: Jordan Malik &lt;jordan.malik@solstice.example&gt;</div>
              <p>Hi Jordan,</p><p>Our updated invoice portal could not verify the details attached to AP-1048. The supplier payment is currently paused and may miss today’s processing window.</p>
              <div className="invoice-summary"><span>INVOICE</span><strong>AP-1048</strong><small>STATUS: REVIEW REQUIRED BY 3:30 PM</small></div>
              <p>Please use the secure review below. The previous accounts line cannot access this new portal, so replies may be delayed.</p>
              <button className="simulated-email-link" type="button" onClick={openSimulatedSignIn}>REVIEW INVOICE DETAILS</button>
              <em>Safe training message • Fictional addresses • No live link</em>
            </div>
          ) : (
            <div className="outlook-empty-reading">
              <div className="outlook-empty-envelope" aria-hidden="true"><span /></div>
              <strong>Select an item to read</strong><small>Nothing is selected</small>
            </div>
          )}
        </section>
      </div>
    )
  }

  return (
        <div className="email-lesson-backdrop">
          <section className="email-lesson-modal universal-lesson" role="dialog" aria-modal="true" aria-labelledby="email-lesson-title">
            <header className="email-lesson-header">
              <div>
                <span className="lesson-kicker">UNIVERSAL TRAINING MODULE // EMAIL PHISHING</span>
                <h2 id="email-lesson-title">EMAIL PHISHING AWARENESS</h2>
              </div>
              <button className="lesson-close" type="button" aria-label="Close Email Phishing training and return to the game" onClick={() => onClose()}>×</button>
            </header>

            <div className="lesson-progress" aria-label={`Training step ${emailLessonStep + 1} of 4`}>
              {['SPOT THE SIGNS', 'CHOOSE THE EMAIL', 'HOW THE ATTACK WORKS', 'SUMMARY'].map((label, index) => (
                <div className={`${index === emailLessonStep ? 'current' : ''} ${index < emailLessonStep ? 'complete' : ''}`} key={label}>
                  <span>{index < emailLessonStep ? '✓' : index + 1}</span>
                  <small>{label}</small>
                </div>
              ))}
            </div>

            <div className="email-lesson-content" ref={emailLessonContentRef}>
              {emailLessonStep === 0 && (
                <div className="lesson-stage inspection-stage">
                  <div className="lesson-overview-banner">
                    <div><span className="lesson-step-label">STEP 1 // INSPECT FOUR MESSAGES</span><h3>Identify the warning signs</h3></div>
                    <div className="clue-counter"><strong>{emailCluesFound.size} / {totalPhishingClues}</strong><span>warning signs found</span></div>
                    <p>Phishing emails can imitate account alerts, suppliers, file-sharing services and senior leaders. Select every highlighted area to learn what deserves a second look.</p>
                  </div>

                  <div className="inspection-list">
                    {phishingInspectionExamples.map((example, index) => {
                      const renderHotspot = (area, content, className = 'email-hotspot') => {
                        const clue = example.clues.find((item) => item.area === area)
                        if (!clue) return null
                        const found = emailCluesFound.has(clue.id)
                        return <button className={`${className} ${found ? 'found' : ''}`} type="button" aria-pressed={found} onClick={() => revealEmailClue(clue.id)}>{content} <span>◎</span></button>
                      }

                      return (
                        <article className="inspection-example" key={example.id}>
                          <header className="inspection-example-header"><span>EXAMPLE {index + 1}</span><strong>{example.type}</strong></header>
                          <div className="inspection-email-layout">
                            <div className={`training-email expanded-email email-layout-${example.layout}`} aria-label={`Fictional ${example.type} phishing email`}>
                              {example.layout === 'security-alert' && (
                                <>
                                  <div className="email-window-bar security-window"><span /><span /><span /><strong>SECURITY NOTIFICATION</strong></div>
                                  <div className="security-mail-brand"><span>◇</span><div><strong>SOLSTICE</strong><small>IDENTITY CENTRE</small></div></div>
                                  <div className="email-message-head">
                                    <div className="email-sender-avatar">SI</div>
                                    <div><strong>{example.senderName}</strong>{renderHotspot('sender', example.senderAddress)}</div>
                                    <small>8:45 AM</small>
                                  </div>
                                  <div className="email-subject">{example.subject}</div>
                                  <div className="email-body-copy security-alert-body">
                                    {renderHotspot('greeting', example.greeting, 'email-hotspot email-hotspot-inline')}
                                    <p>{example.message}</p>
                                    <div className="security-event-card"><strong>NEW SIGN-IN DETAILS</strong><span>{example.detail}</span></div>
                                    {renderHotspot('deadline', example.pressureText, 'email-hotspot email-hotspot-block')}
                                    {renderHotspot('action', example.actionText, 'email-action-simulation')}
                                    <small className="email-training-note">This mailbox is not monitored. © Solstice Identity Services</small>
                                  </div>
                                </>
                              )}

                              {example.layout === 'invoice-thread' && (
                                <>
                                  <div className="email-window-bar invoice-window"><span /><span /><span /><strong>OUTLOOK // CONVERSATION VIEW</strong></div>
                                  <div className="email-toolbar"><span>↩ Reply</span><span>↪ Forward</span><span>Archive</span><span>Report</span></div>
                                  <div className="email-subject invoice-subject">{example.subject}</div>
                                  <div className="invoice-address-grid">
                                    <span>From</span><strong>{example.senderName} &lt;{example.senderAddress}&gt;</strong>
                                    <span>Reply-to</span>{renderHotspot('replyto', example.replyTo, 'email-hotspot email-hotspot-inline')}
                                    <span>To</span><em>{example.recipient}</em>
                                  </div>
                                  <div className="invoice-thread-history">▸ 2 earlier messages in this conversation</div>
                                  <div className="email-body-copy invoice-body">
                                    <p>{example.greeting}</p><p>{example.message}</p>
                                    {renderHotspot('bankchange', example.bankNotice, 'email-hotspot email-hotspot-block invoice-bank-change')}
                                    {renderHotspot('verify', example.verificationText, 'email-hotspot email-hotspot-block')}
                                    <p>Regards,<br />Leah Warren<br />Accounts Receivable</p>
                                    {renderHotspot('attachment', `▧ ${example.attachmentName} · 184 KB`, 'email-attachment-hotspot')}
                                    <small className="email-training-note">Fictional supplier message — the attachment cannot be opened.</small>
                                  </div>
                                </>
                              )}

                              {example.layout === 'file-share' && (
                                <>
                                  <div className="email-window-bar share-window"><span /><span /><span /><strong>CLOUDDESK NOTIFICATION</strong></div>
                                  <div className="share-brand-header"><span>◆</span><strong>CloudDesk</strong><small>Secure document collaboration</small></div>
                                  <div className="share-sender-line"><span>Notification sent by</span>{renderHotspot('sender', example.senderAddress, 'email-hotspot email-hotspot-inline')}</div>
                                  <div className="share-invitation">
                                    <small>{example.greeting}</small><h3>{example.subject}</h3><p>{example.message}</p>
                                    {renderHotspot('file', <><strong>{example.fileName}</strong><small>{example.fileMeta}</small></>, 'share-file-card')}
                                    {renderHotspot('expiry', example.pressureText, 'email-hotspot email-hotspot-block share-expiry')}
                                    {renderHotspot('action', example.actionText, 'email-action-simulation share-action')}
                                    <span className="share-help">Wasn’t expecting this file? Contact the sender before signing in.</span>
                                  </div>
                                </>
                              )}

                              {example.layout === 'plain-executive' && (
                                <>
                                  <div className="email-window-bar executive-window"><span /><span /><span /><strong>INBOX</strong></div>
                                  <div className="email-toolbar executive-toolbar"><span>← Back</span><span>Reply</span><span>Forward</span><span>More</span></div>
                                  <div className="executive-message-head">
                                    <div className="email-sender-avatar">MR</div>
                                    <div><strong>{example.senderName}</strong>{renderHotspot('sender', example.senderAddress)}</div>
                                    <small>4:12 PM</small>
                                  </div>
                                  <div className="email-subject">{example.subject}</div>
                                  <div className="email-body-copy executive-body">
                                    <p>{example.greeting}</p>
                                    {renderHotspot('payment', example.message, 'email-hotspot email-hotspot-block executive-payment')}
                                    {renderHotspot('secrecy', example.pressureText, 'email-hotspot email-hotspot-block')}
                                    {renderHotspot('contact', example.contactRestriction, 'email-hotspot email-hotspot-block')}
                                    <p className="executive-signature">{example.signature}</p>
                                    <small className="email-training-note">External sender: treat unexpected executive requests with caution.</small>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="example-clue-results" aria-live="polite">
                              {example.clues.map((clue) => (
                                <div className={emailCluesFound.has(clue.id) ? 'revealed' : ''} key={clue.id}>
                                  <span>{emailCluesFound.has(clue.id) ? '✓' : '?'}</span>
                                  <div><strong>{emailCluesFound.has(clue.id) ? clue.title : 'Clue hidden'}</strong><p>{emailCluesFound.has(clue.id) ? clue.explanation : 'Select the highlighted area inside the email.'}</p></div>
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

              {emailLessonStep === 1 && (
                <div className="lesson-stage comparison-stage">
                  <div className="lesson-overview-banner">
                    <div><span className="lesson-step-label">STEP 2 // COMPARE THE MESSAGES</span><h3>Choose the safer email</h3></div>
                    <div className="clue-counter"><strong>{correctComparisonCount} / {emailComparisonExamples.length}</strong><span>correct choices</span></div>
                    <p>Compare the sender, context and requested action. Choose one email in every pair; an incorrect choice can be reconsidered.</p>
                  </div>
                  <div className="comparison-list">
                    {emailComparisonExamples.map((example, index) => (
                      <article className="comparison-example" key={example.id}>
                        <header><span>DECISION {index + 1}</span><div><strong>{example.title}</strong><small>{example.prompt}</small></div></header>
                        <div className="comparison-grid">
                          {Object.entries(example.emails).map(([key, email]) => {
                            const selected = emailComparisonAnswers[example.id] === key
                            const answerClass = selected ? (key === example.correct ? 'correct' : 'incorrect') : ''
                            return (
                              <button className={`comparison-email-option ${selected ? 'selected' : ''} ${answerClass}`} type="button" key={key} aria-pressed={selected} onClick={() => setEmailComparisonAnswers((current) => ({ ...current, [example.id]: key }))}>
                                <span className="email-choice-label">EMAIL {key.toUpperCase()}</span>
                                <div className="choice-email-meta"><span><small>FROM</small><strong>{email.sender}</strong></span><em>{email.sent}</em></div>
                                <small>TO</small><strong>{email.to}</strong>
                                <small>SUBJECT</small><h4>{email.subject}</h4>
                                <div className="choice-email-body">{email.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><em className="choice-email-detail">{email.detail}</em>
                              </button>
                            )
                          })}
                        </div>
                        {emailComparisonAnswers[example.id] && (
                          <div className={`answer-feedback ${emailComparisonAnswers[example.id] === example.correct ? 'correct' : 'incorrect'}`}>
                            <strong>{emailComparisonAnswers[example.id] === example.correct ? '✓ Correct choice' : '× Look again'}</strong>
                            <p>{emailComparisonAnswers[example.id] === example.correct ? example.explanation : 'Compare the real sender address, the normal company process and whether the email encourages independent verification.'}</p>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {emailLessonStep === 2 && (
                <div className="lesson-stage email-attack-journey-stage">
                  <div className="lesson-overview-banner">
                    <div><span className="lesson-step-label">STEP 3 // TRACE THE ATTACK</span><h3>How can one phishing email create company-wide damage?</h3></div>
                    <div className="clue-counter"><strong>{emailAttackJourneyStage + 1} / {emailAttackJourneyStages.length}</strong><span>current stage</span></div>
                    <p>Interact directly with a safe fictional workspace. Follow the message from its construction to the connected company systems that could be affected after credentials are entered.</p>
                  </div>

                  <section className={`email-attack-journey phase-${emailAttackJourneyStage}`}>
                    <div className="attack-chain-map" aria-label={`Email phishing attack journey stage ${emailAttackJourneyStage + 1} of ${emailAttackJourneyStages.length}`}>
                      {emailAttackJourneyStages.map((stage, index) => {
                        const complete = index < emailAttackJourneyStage
                        const current = index === emailAttackJourneyStage
                        return (
                          <div className={`${complete ? 'reached' : ''} ${current ? 'current' : ''}`} key={stage.id}>
                            <span>{complete ? '✓' : stage.icon}</span><strong>{stage.label}</strong><i />
                          </div>
                        )
                      })}
                    </div>

                    <div className={`attack-journey-workspace ${emailAttackJourneyStage === 0 ? 'construction-mode' : ''} ${emailAttackJourneyStage > 0 && emailAttackJourneyStage < 3 ? 'delivery-flow-mode' : ''} ${emailAttackJourneyStage === 4 ? 'account-impact-mode' : ''}`}>
                      {emailAttackJourneyStage === 0 && (
                        <article
                          className={`email-construction-lab ${emailAttackConstructing ? 'constructing' : ''} build-step-${emailAttackConstructionStep}`}
                          role="button"
                          tabIndex={0}
                          aria-label={emailAttackConstructing ? 'Fictional phishing email construction is in progress' : emailAttackConstructionStep === 4 ? 'Construction complete. Continue to the delivery stage' : 'Start the fictional phishing email construction animation'}
                          onClick={startEmailAttackConstruction}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault()
                              startEmailAttackConstruction()
                            }
                          }}
                        >
                          <header><div><span>PHISHING EMAIL // SAFE SIMULATION</span><strong>{emailAttackConstructing ? 'CONSTRUCTION IN PROGRESS' : emailAttackConstructionStep === 4 ? 'CONSTRUCTION COMPLETE — SELECT THE WORKSPACE TO CONTINUE' : 'SELECT THIS WORKSPACE TO BEGIN'}</strong></div><em>NO MESSAGE WILL BE SENT</em></header>
                          <div className="construction-layout">
                            <div className="construction-signals">
                              <span className={emailAttackConstructionStep >= 1 ? 'built' : ''}><i>01</i><strong>FAMILIAR IDENTITY</strong><small>A supplier display name appears first.</small></span>
                              <span className={emailAttackConstructionStep >= 2 ? 'built' : ''}><i>02</i><strong>LOOKALIKE SENDER</strong><small>The full address does not match the genuine domain.</small></span>
                              <span className={emailAttackConstructionStep >= 3 ? 'built' : ''}><i>03</i><strong>TIME PRESSURE</strong><small>An urgent invoice deadline discourages checking.</small></span>
                              <span className={emailAttackConstructionStep >= 4 ? 'built' : ''}><i>04</i><strong>DISGUISED DESTINATION</strong><small>The review control leads toward a copied sign-in page.</small></span>
                            </div>
                            <div className="construction-email-preview journey-open-email realistic-phishing-email construction-real-email">
                              <div className={`construct-part part-identity ${emailAttackConstructionStep >= 1 ? 'visible' : ''}`}>
                                <div className="external-sender-warning"><span>!</span>EXTERNAL SENDER — VERIFY LINKS AND REQUESTS</div>
                                <header><span>AS</span><div><strong>Apex Supplier Accounts</strong><small>accounts@apex-billing.example</small></div></header>
                              </div>
                              <div className={`construct-part part-recipient ${emailAttackConstructionStep >= 2 ? 'visible' : ''}`}>
                                <div className="email-recipient-line">To: Jordan Malik &lt;jordan.malik@solstice.example&gt;</div>
                              </div>
                              <div className={`construct-part part-message ${emailAttackConstructionStep >= 3 ? 'visible' : ''}`}>
                                <h4>Payment processing paused — Invoice AP-1048</h4>
                                <p>Hi Jordan,</p><p>Our updated invoice portal could not verify the details attached to AP-1048. The supplier payment is currently paused and may miss today’s processing window.</p>
                              </div>
                              <div className={`construct-part part-action ${emailAttackConstructionStep >= 4 ? 'visible' : ''}`}>
                                <div className="invoice-summary"><span>INVOICE</span><strong>AP-1048</strong><small>STATUS: REVIEW REQUIRED BY 3:30 PM</small></div>
                                <p>Please use the secure review below. The previous accounts line cannot access this new portal, so replies may be delayed.</p>
                                <span className="simulated-email-link">REVIEW INVOICE DETAILS</span>
                                <em>Safe training message • Fictional addresses • No live link</em>
                              </div>
                            </div>
                          </div>
                          <footer><span>{emailAttackConstructing ? `BUILDING FICTIONAL EMAIL ${emailAttackConstructionStep} / 4` : emailAttackConstructionStep === 4 ? 'EMAIL COMPLETE — SELECT ANYWHERE TO CONTINUE' : 'SELECT ANYWHERE INSIDE THE WORKSPACE'}</span><i /></footer>
                        </article>
                      )}

                      {emailAttackJourneyStage > 0 && emailAttackJourneyStage < 4 && (
                        <>
                          <article className="attack-origin-panel active minimal-threat-panel">
                            <div className="phishing-email-origin">
                              <strong>PHISHING EMAIL</strong>
                              <button className={`attack-envelope assembled interactive ${emailAttackSending ? 'sending' : ''}`} type="button" disabled={emailAttackJourneyStage !== 1 || emailAttackSending} onClick={sendEmailThroughGateway} aria-label="Send the fictional phishing email through the simulated company gateway"><span>✉</span><i /><i /><i /></button>
                              {emailAttackJourneyStage === 1 && <small>{emailAttackSending ? 'TRAVELLING TO THE INBOX' : 'SELECT THE EMAIL TO DELIVER IT'}</small>}
                            </div>
                          </article>

                          <div className={`attack-delivery-lane ${emailAttackSending ? 'active' : ''} ${emailAttackJourneyStage >= 2 ? 'delivered' : ''}`}>
                            <span className="delivery-packet" aria-hidden="true">✉</span>
                            <i className="delivery-line" aria-hidden="true" />
                            <div className="gateway-node"><span>⌬</span><strong>EMAIL GATEWAY</strong><small>{emailAttackSending ? 'SCANNING MESSAGE' : emailAttackJourneyStage >= 2 ? 'DELIVERY ALLOWED' : 'AWAITING MESSAGE'}</small></div>
                            <div className="delivery-route-labels" aria-hidden="true"><span>SENT</span><span>SCANNED</span><span>DELIVERED</span></div>
                            {(emailAttackSending || emailAttackJourneyStage >= 2) && <em>FILTERS REDUCE RISK, BUT DO NOT CATCH EVERY MESSAGE</em>}
                          </div>

                          <article className="attack-recipient-panel">
                            <header><span>SOLSTICE WORKSTATION</span><em>{emailAttackJourneyStage === 3 ? 'COPIED PAGE' : 'EMPLOYEE INBOX'}</em></header>
                            <div className="recipient-screen" key={`${emailAttackJourneyStage}-${emailAttackInteractionOpened}`}>
                              {emailAttackJourneyStage === 1 && renderEmailJourneyInbox(false)}
                              {emailAttackJourneyStage === 2 && renderEmailJourneyInbox(true)}
                              {emailAttackJourneyStage === 3 && (
                                <div className="journey-fake-login">
                                  <div className="fake-browser-bar"><i /><i /><i /><span>solstice-access.example/session</span></div>
                                  <div className="fake-page-warning"><span>!</span>SIMULATED COPY — THIS IS NOT A REAL SIGN-IN PAGE</div>
                                  <div className="fake-login-card"><span>◇</span><strong>Solstice Workspace</strong><small>Session expired. Sign in to view Invoice AP-1048.</small><div><small>WORK EMAIL</small><span>jordan.malik@solstice.example</span><small>PASSWORD</small><span>••••••••••••</span></div><button className="fake-signin-control" type="button" onClick={submitSimulatedSignIn}>SIMULATED SIGN IN</button><em>PREFILLED TRAINING DATA • NOTHING IS COLLECTED</em></div>
                                </div>
                              )}
                            </div>
                          </article>
                        </>
                      )}

                      {emailAttackJourneyStage === 4 && (
                        <article className="company-impact-map">
                          <header><div><span>ACCOUNT MISUSE // CONNECTED CONSEQUENCES</span><h3>How one captured sign-in can spread across the company</h3></div><em>SAFE CONSEQUENCE MODEL</em></header>
                          <div className="impact-map-canvas">
                            <svg viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
                              <path d="M500 62 C500 105 168 95 168 145" />
                              <path d="M500 62 L500 145" />
                              <path d="M500 62 C500 105 832 95 832 145" />
                              <path d="M168 215 L168 270" />
                              <path d="M500 215 L500 270" />
                              <path d="M832 215 L832 270" />
                            </svg>
                            <div className="impact-node compromised"><span>!</span><strong>COMPROMISED ACCOUNT</strong><small>Captured sign-in reused</small></div>
                            <div className="impact-node asset mail"><span>✉</span><strong>EMAIL &amp; CONTACTS</strong><small>Messages and trusted conversations may be viewed</small></div>
                            <div className="impact-node asset files"><span>▤</span><strong>SHARED FILES</strong><small>Accessible documents may need investigation</small></div>
                            <div className="impact-node asset finance"><span>$</span><strong>FINANCE CONTEXT</strong><small>Invoices and approval patterns may be exposed</small></div>
                            <div className="impact-node consequence coworkers"><span>01</span><strong>INTERNAL PHISHING</strong><small>Coworkers may trust messages sent from the real account</small><em>MORE PEOPLE AT RISK</em></div>
                            <div className="impact-node consequence recovery"><span>02</span><strong>RESPONSE &amp; DOWNTIME</strong><small>Sessions are revoked, access is reset and activity is reviewed</small><em>STAFF TIME + DISRUPTION</em></div>
                            <div className="impact-node consequence fraud"><span>03</span><strong>PAYMENT FRAUD RISK</strong><small>Changed payment details or false approvals may be attempted</small><em>POSSIBLE FINANCIAL LOSS</em></div>
                          </div>
                          <footer><span>ONE EMAIL INTERACTION</span><i>→</i><strong>MULTIPLE SYSTEMS AND PEOPLE MAY BE AFFECTED</strong><p>The exact impact varies. Fast reporting can break these connections before the incident spreads.</p></footer>
                        </article>
                      )}

                      {emailAttackHintVisible && !emailAttackJourneyComplete && (
                        <aside className="attack-context-hint" role="status"><span>?</span><div><strong>NEED A HINT?</strong><p>{emailAttackHint}</p></div><button type="button" aria-label="Dismiss hint" onClick={() => setEmailAttackHintVisible(false)}>×</button></aside>
                      )}
                    </div>

                    <div className={`attack-stage-explainer ${emailAttackJourneyComplete ? 'complete' : ''}`}>
                      <span className="attack-stage-number">{String(emailAttackJourneyStage + 1).padStart(2, '0')}</span>
                      <div className="attack-stage-copy">
                        <small>{currentEmailAttackStage.label}</small>
                        <h3>{currentEmailAttackStage.title}</h3>
                        <p>{currentEmailAttackStage.description}</p>
                      </div>
                      <aside><span>🛡</span><div><strong>DEFENSIVE BREAK POINT</strong><p>{currentEmailAttackStage.defence}</p></div></aside>
                    </div>

                    <div className="attack-journey-controls">
                      <button className="attack-journey-reset" type="button" disabled={emailAttackJourneyStage === 0 && !emailAttackConstructing} onClick={resetEmailAttackJourney}>↻ RESET JOURNEY</button>
                      <div><span>{emailAttackJourneyComplete ? '✓ ATTACK JOURNEY COMPLETE' : 'INTERACT WITH THE WORKSPACE TO CONTINUE'}</span><small>SAFE VISUAL • NO REAL EMAIL, SIGN-IN OR ACCOUNT ACTIVITY</small></div>
                    </div>
                  </section>
                </div>
              )}

              {emailLessonStep === 3 && (
                <div className="lesson-stage summary-stage">
                  <div className="lesson-overview-banner summary-banner">
                    <div><span className="lesson-step-label">STEP 4 // TRAINING SUMMARY</span><h3>Pause. Inspect. Verify. Report.</h3></div>
                    <p>Phishing uses believable messages to create trust, urgency or curiosity. No single clue proves an email is malicious, so check the full context before acting.</p>
                  </div>
                  <div className="summary-principles">
                    <article><span>01</span><strong>PAUSE</strong><p>Slow down when a message pressures you to act immediately, keep a request secret or avoid normal procedure.</p></article>
                    <article><span>02</span><strong>INSPECT</strong><p>Check the full sender address, spelling, expected context, requested information, links and attachments.</p></article>
                    <article><span>03</span><strong>VERIFY</strong><p>Use a saved bookmark, staff directory or known phone number. Do not rely on contact details supplied by the message.</p></article>
                    <article><span>04</span><strong>REPORT</strong><p>Use the organisation’s reporting process quickly so security staff can investigate and protect other recipients.</p></article>
                  </div>
                  <section className="summary-impact">
                    <div><span className="lesson-step-label">WHY PHISHING CAN REDUCE COMPANY FUNDS</span><h3>One message can create several types of cost</h3><p>The game’s funds meter represents total simulated business harm, not only money directly transferred.</p></div>
                    <div className="summary-impact-grid">
                      <article><strong>ACCOUNT RECOVERY</strong><p>Compromised access may require investigation, credential resets and additional monitoring.</p></article>
                      <article><strong>PAYMENT LOSS</strong><p>Impersonation can redirect invoices or convince staff to approve an unauthorised payment.</p></article>
                      <article><strong>BUSINESS DISRUPTION</strong><p>Systems and accounts may be isolated while teams confirm what happened and restore normal work.</p></article>
                      <article><strong>DATA &amp; REPUTATION</strong><p>Exposed information can lead to notification, legal, support and trust-rebuilding costs.</p></article>
                    </div>
                  </section>
                  <section className="learning-resources">
                    <div><span className="lesson-step-label">CONTINUE LEARNING</span><h3>Official Australian guidance</h3><p>Open these resources in a new tab for current prevention and reporting advice.</p></div>
                    <div className="resource-links">
                      <a href="https://www.cyber.gov.au/threats/types-threats/phishing" target="_blank" rel="noreferrer"><strong>ACSC — Phishing</strong><span>Understand phishing threats and protection ›</span></a>
                      <a href="https://www.scamwatch.gov.au/types-of-scams/phishing-scams" target="_blank" rel="noreferrer"><strong>Scamwatch — Phishing scams</strong><span>Recognise and respond to phishing scams ›</span></a>
                      <a href="https://www.esafety.gov.au/key-topics/staying-safe/online-scams" target="_blank" rel="noreferrer"><strong>eSafety — Online scams</strong><span>Practical advice for staying safe online ›</span></a>
                      <a href="https://www.cyber.gov.au/protect-yourself/spotting-scams" target="_blank" rel="noreferrer"><strong>ACSC — Spotting scams</strong><span>Review common warning signs ›</span></a>
                    </div>
                  </section>
                  <div className="completion-callout"><span>✓</span><div><strong>MODULE READY TO COMPLETE</strong><p>{completed ? 'You have reviewed the complete Email Phishing training module again.' : 'Complete the module to mark Email Phishing as finished in your Learning Library.'}</p></div></div>
                </div>
              )}
            </div>

            <footer className="email-lesson-footer">
              <button className="lesson-secondary" type="button" disabled={emailLessonStep === 0} onClick={() => setEmailLessonStep((current) => Math.max(0, current - 1))}>‹ PREVIOUS</button>
              <div><span>LEARNING PROGRESS</span><strong>{lessonProgressPercent}%</strong></div>
              <button className="lesson-primary" type="button" disabled={!currentLessonStepComplete} onClick={advanceEmailLesson}>{emailLessonStep === 3 ? (completed ? 'FINISH REVIEW' : 'COMPLETE MODULE') : 'CONTINUE'} <span>›</span></button>
            </footer>
          </section>
        </div>
  )
}
