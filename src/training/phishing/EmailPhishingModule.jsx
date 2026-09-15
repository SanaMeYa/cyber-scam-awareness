import { useEffect, useMemo, useState } from 'react'
import ModuleShell from '../ModuleShell.jsx'

const inspectionEmails = [
  {
    id: 'identity', kind: 'SECURITY ALERT', sender: 'Solstice Identity Centre', address: 'security@solstlce-access.example',
    subject: 'Unusual Microsoft 365 sign-in requires review', greeting: 'Hello valued user,',
    body: 'We recorded a sign-in from a new Windows device in Melbourne. Your mailbox may be at risk.',
    pressure: 'Your access will be suspended in 30 minutes unless the activity is confirmed.', action: 'REVIEW SIGN-IN',
    clues: { address: 'The sender replaces a letter in “solstice”. Lookalike domains imitate trusted organisations.', greeting: 'An internal system should normally know the employee’s name.', pressure: 'A short deadline creates panic and discourages independent checking.', action: 'Open the known account portal directly instead of an unexpected email link.' },
  },
  {
    id: 'invoice', kind: 'PAYMENT CHANGE', sender: 'Leah Warren — Apex Office Supplies', address: 'leah.warren@apex-supplies.example',
    subject: 'RE: Invoice AP-1048 — remittance details', greeting: 'Hi Accounts Team,',
    body: 'We moved our receivables account. Replace the saved beneficiary before releasing today’s $48,750 payment.',
    pressure: 'Our usual finance phone line is unavailable, so please reply here rather than calling your Apex contact.', action: 'AP-1048-Revised.pdf',
    clues: { address: 'Payment requests should be compared with the supplier domain already on file.', body: 'Unexpected beneficiary changes are a major business-email-compromise warning.', pressure: 'The sender actively blocks the normal verification route.', action: 'Sensitive attachments should not be opened before the request is verified.' },
  },
  {
    id: 'share', kind: 'FILE SHARE', sender: 'CloudDesk Documents', address: 'shares@clouddesk-access.example',
    subject: 'Jordan Malik shared a protected document with you', greeting: 'You have been invited to review a file',
    body: 'Jordan added you as an editor to Confidential_Salary_Review_Q4.docx and left two comments.',
    pressure: 'This invitation expires today at 5:00 PM and cannot be restored.', action: 'OPEN SHARED DOCUMENT',
    clues: { address: 'The organisation does not normally use this file-sharing domain.', body: 'A surprising sensitive filename is designed to trigger curiosity.', pressure: 'Expiry pressure pushes the recipient to act before checking.', action: 'Visit the approved document platform independently and look for the file there.' },
  },
  {
    id: 'executive', kind: 'EXECUTIVE REQUEST', sender: 'Marcus Reyes — CEO', address: 'ceo.private@quickrequest.example',
    subject: 'Confidential request before the client meeting', greeting: 'Sarah, can you handle a quick confidential task?',
    body: 'Purchase four $250 digital gift cards and send clear images of the codes by reply.',
    pressure: 'Keep this between us. I cannot take calls or Teams messages while the client is here.', action: 'REPLY WITH CODES',
    clues: { address: 'A company request from an unfamiliar external address requires verification.', body: 'Gift-card codes are an unusual and irreversible payment request.', pressure: 'Secrecy and blocked verification isolate the recipient from help.', action: 'Use the normal approval process and contact the executive office separately.' },
  },
]

const comparisons = [
  {
    id: 'reset', title: 'Password reset', correct: 'a',
    a: { sender: 'IT Service Desk <support@solstice.example>', subject: 'Ticket SD-2841 — password reset completed', body: 'Open the usual staff portal from your saved bookmark. If you did not request this, call the service desk through the directory.' },
    b: { sender: 'Microsoft Security <security@solstice-helpdesk.example>', subject: 'URGENT: Password expires in 20 minutes', body: 'Use this verification link and enter your current password to prevent permanent mailbox suspension.' },
    reason: 'The safer message uses an expected ticket and the normal portal, with no embedded sign-in link.',
  },
  {
    id: 'supplier', title: 'Supplier update', correct: 'b',
    a: { sender: 'Apex Billing <accounts@apex-newbank.example>', subject: 'New beneficiary required today', body: 'Replace the bank details before releasing $48,750. Our old phone line is unavailable, so reply here.' },
    b: { sender: 'Apex Billing <accounts@apex.example>', subject: 'Planned billing-system maintenance', body: 'Bank details remain unchanged. Verify any future payment change using the supplier number already in your finance system.' },
    reason: 'The safer email makes no urgent payment change and encourages independent verification.',
  },
  {
    id: 'document', title: 'Shared document', correct: 'a',
    a: { sender: 'Projects Team <projects@solstice.example>', subject: 'Orion workshop notes published', body: 'Open the existing project folder from your saved workspace bookmark. Contact Maya in Teams if access is missing.' },
    b: { sender: 'Secure Documents <notify@document-review.example>', subject: 'Private document expires in one hour', body: 'Sign in through this secure page using your company email and password before the invitation expires.' },
    reason: 'The safer message provides expected context and uses the organisation’s established workspace.',
  },
  {
    id: 'executive', title: 'Executive purchase', correct: 'b',
    a: { sender: 'Marcus Reyes <ceo.private@quickrequest.example>', subject: 'Keep this client request confidential', body: 'Buy gift cards before 4:30 PM and email the PINs. Do not involve Finance.' },
    b: { sender: 'Executive Office <executive.office@solstice.example>', subject: 'Purchase request PR-228 submitted', body: 'Review PR-228 in the approved procurement system. Call the executive assistant through the staff directory with questions.' },
    reason: 'The safer email follows a traceable approval process and provides a trusted verification route.',
  },
]

const journeyStages = ['IMPERSONATION', 'DELIVERY', 'INTERACTION', 'FAKE SIGN-IN', 'ACCOUNT MISUSE']

function MiniEmail({ email, interactive = false, found = new Set(), onClue }) {
  const clue = (area, children) => interactive && email.clues?.[area] ? (
    <button className={`email-clue ${found.has(`${email.id}-${area}`) ? 'found' : ''}`} type="button" onClick={() => onClue(`${email.id}-${area}`)}>{children}</button>
  ) : children

  return (
    <article className={`realistic-email email-layout-${email.id}`}>
      <div className="mail-appbar"><span>Outlook</span><span>Reply&nbsp;&nbsp; Forward&nbsp;&nbsp; Report</span></div>
      <div className="mail-subject">{email.subject}</div>
      <div className="mail-sender"><span className="mail-avatar">{email.sender.slice(0, 1)}</span><div><strong>{email.sender}</strong>{clue('address', <small>{email.address}</small>)}</div><time>Today</time></div>
      <div className="mail-body">
        {clue('greeting', <p>{email.greeting}</p>)}
        {clue('body', <p>{email.body}</p>)}
        {clue('pressure', <p className="mail-pressure">{email.pressure}</p>)}
        {clue('action', <span className="mail-action">{email.action}</span>)}
      </div>
    </article>
  )
}

function AttackJourney({ stage, setStage }) {
  const [building, setBuilding] = useState(false)
  const [built, setBuilt] = useState(false)
  const [delivered, setDelivered] = useState(false)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    if (!building) return undefined
    const timer = window.setTimeout(() => {
      setBuilding(false)
      setBuilt(true)
    }, 2200)
    return () => window.clearTimeout(timer)
  }, [building])

  const next = () => setStage((current) => Math.min(current + 1, journeyStages.length - 1))

  return (
    <div className="journey-workspace">
      <div className="journey-stage-tabs">
        {journeyStages.map((label, index) => <span className={`${index === stage ? 'active' : ''} ${index < stage ? 'done' : ''}`} key={label}>{index + 1}<small>{label}</small></span>)}
      </div>

      {stage === 0 && <div className="journey-canvas compose-canvas">
        <div className="journey-instruction"><h3>Watch a phishing email being assembled</h3><p>This is a safe fictional demonstration. Select the empty email workspace to begin.</p></div>
        <button className={`compose-email ${building ? 'building' : ''} ${built ? 'built' : ''}`} type="button" onClick={() => built ? next() : setBuilding(true)}>
          <span className="compose-row sender">From: Apex Accounts &lt;accounts@apex-payments.example&gt;</span>
          <span className="compose-row subject">Subject: Invoice AP-1048 needs review today</span>
          <span className="compose-row body">Hi Accounts Team,<br /><br />A payment problem is holding your order. Review the invoice details before 4:00 PM.</span>
          <span className="compose-row action">REVIEW INVOICE DETAILS</span>
          <em>{building ? 'Constructing fictional phishing email…' : built ? 'Email constructed — select it to send' : 'Select the workspace to construct the email'}</em>
        </button>
      </div>}

      {stage === 1 && <div className="journey-canvas delivery-canvas">
        <button className={`floating-phish ${delivered ? 'sent' : ''}`} type="button" onClick={() => { setDelivered(true); window.setTimeout(next, 1100) }}><small>PHISHING EMAIL</small><span>✉</span></button>
        <div className="gateway"><span>◇</span><strong>SECURE EMAIL GATEWAY</strong><small>Sender • links • reputation</small></div>
        <div className="delivery-line" aria-hidden="true" />
        <div className="outlook-preview"><strong>Inbox</strong><span>{delivered ? '1 unread message delivered' : 'Existing messages visible'}</span></div>
      </div>}

      {stage === 2 && <div className="journey-canvas outlook-canvas">
        <aside className="outlook-list"><header>Inbox ★</header><div>Apex Project<br /><small>Weekly delivery schedule</small></div><div>HR Updates<br /><small>Staff wellbeing session</small></div><button className="unread" type="button" onClick={() => setOpened(true)}><strong>Apex Accounts</strong><span>Invoice AP-1048 needs review</span><small>Payment problem — action today</small></button></aside>
        <section className="outlook-reading-pane">
          {!opened ? <div className="nothing-selected"><span>✉</span><strong>Select an item to read</strong><small>The unread message is highlighted.</small></div> : <div className="opened-phish"><MiniEmail email={{ ...inspectionEmails[1], subject: 'Invoice AP-1048 needs review today' }} /><button type="button" onClick={next}>REVIEW INVOICE DETAILS</button></div>}
        </section>
      </div>}

      {stage === 3 && <div className="journey-canvas fake-login">
        <div className="fake-login-card"><span className="fake-microsoft">▦</span><h3>Sign in</h3><label>Email<input readOnly value="accounts@solstice.example" /></label><label>Password<input readOnly type="password" value="not-a-real-password" /></label><button type="button" onClick={next}>SIGN IN</button><small>Fictional page — the address is not the real company portal.</small></div>
      </div>}

      {stage === 4 && <div className="journey-canvas impact-map">
        <div className="impact-node compromised"><span>⚠</span><strong>COMPROMISED ACCOUNT</strong><small>Credentials entered into a fake page</small></div>
        <div className="impact-grid"><div><strong>Mailbox access</strong><small>Read conversations and reset accounts</small></div><div><strong>Shared files</strong><small>Expose internal documents and contacts</small></div><div><strong>Payment fraud</strong><small>Impersonate suppliers or executives</small></div><div><strong>Business disruption</strong><small>Investigation, recovery and downtime</small></div></div>
        <p>One phishing email can spread beyond one employee. Fast reporting, password resets, session revocation, MFA and independent payment verification reduce the damage.</p>
      </div>}
    </div>
  )
}

export default function EmailPhishingModule({ onClose, onComplete, completed = false }) {
  const [step, setStep] = useState(0)
  const [found, setFound] = useState(() => new Set())
  const [answers, setAnswers] = useState({})
  const [journeyStage, setJourneyStage] = useState(0)
  const totalClues = inspectionEmails.reduce((total, email) => total + Object.keys(email.clues).length, 0)
  const comparisonComplete = comparisons.every((item) => answers[item.id] === item.correct)
  const canContinue = step === 0 ? found.size === totalClues : step === 1 ? comparisonComplete : step === 2 ? journeyStage === journeyStages.length - 1 : true

  const revealClue = (id) => setFound((current) => new Set(current).add(id))
  const clueDetails = useMemo(() => inspectionEmails.flatMap((email) => Object.entries(email.clues).map(([area, text]) => ({ id: `${email.id}-${area}`, text }))), [])

  const continueModule = () => {
    if (step < 3) setStep((current) => current + 1)
    else if (!completed) onComplete()
    else onClose()
  }

  return (
    <ModuleShell moduleId="email" title="EMAIL PHISHING AWARENESS" kicker="UNIVERSAL TRAINING MODULE // EMAIL PHISHING" steps={['SPOT THE SIGNS', 'CHOOSE THE EMAIL', 'HOW THE ATTACK WORKS', 'SUMMARY']} step={step} canContinue={canContinue} onContinue={continueModule} onClose={onClose} completed={completed}>
      {step === 0 && <div className="training-stage"><div className="stage-intro"><div><span>STEP 1 // FOUR DIFFERENT EMAILS</span><h3>Identify the warning signs</h3><p>Select every highlighted area. Genuine-looking branding does not make a message safe.</p></div><strong>{found.size} / {totalClues}<small>SIGNS FOUND</small></strong></div><div className="inspection-grid">{inspectionEmails.map((email) => <div key={email.id}><span className="example-label">{email.kind}</span><MiniEmail email={email} interactive found={found} onClue={revealClue} /></div>)}</div><div className="discovery-list">{clueDetails.filter((clue) => found.has(clue.id)).map((clue) => <p key={clue.id}><span>✓</span>{clue.text}</p>)}</div></div>}

      {step === 1 && <div className="training-stage"><div className="stage-intro"><div><span>STEP 2 // COMPARE THE CONTEXT</span><h3>Choose the safer email</h3><p>Read the sender, request and verification path. Select the safer message in each pair.</p></div><strong>{Object.keys(answers).length} / 4<small>DECISIONS</small></strong></div>{comparisons.map((item) => <article className="comparison-case" key={item.id}><h4>{item.title}</h4><div className="comparison-grid">{['a', 'b'].map((choice) => <button className={`${answers[item.id] === choice ? 'selected' : ''} ${answers[item.id] && choice === item.correct ? 'correct' : ''} ${answers[item.id] === choice && choice !== item.correct ? 'wrong' : ''}`} type="button" key={choice} onClick={() => setAnswers((current) => ({ ...current, [item.id]: choice }))}><span>EMAIL {choice.toUpperCase()}</span><strong>{item[choice].subject}</strong><small>{item[choice].sender}</small><p>{item[choice].body}</p></button>)}</div>{answers[item.id] && <p className="answer-explanation"><strong>{answers[item.id] === item.correct ? '✓ SAFER CHOICE' : 'TRY THE OTHER EMAIL'}</strong>{item.reason}</p>}</article>)}</div>}

      {step === 2 && <div className="training-stage"><div className="stage-intro"><div><span>STEP 3 // INTERACTIVE ATTACK CHAIN</span><h3>See how an email phishing attack works</h3><p>Interact with the simulated workspace to move a single message from construction to company-wide impact.</p></div><strong>{journeyStage + 1} / 5<small>ATTACK STAGES</small></strong></div><AttackJourney stage={journeyStage} setStage={setJourneyStage} /></div>}

      {step === 3 && <div className="training-stage summary-stage"><span className="summary-shield">◇</span><h3>Pause. Check. Verify independently.</h3><p>Phishing emails imitate familiar services and business relationships, then use urgency, curiosity, authority or fear to make an unsafe action feel routine.</p><div className="summary-grid"><div><strong>INSPECT</strong><p>Check the full sender and destination, not only the display name or branding.</p></div><div><strong>LEAVE THE MESSAGE</strong><p>Open the known website, app or internal system yourself.</p></div><div><strong>VERIFY</strong><p>Confirm sensitive requests through a trusted contact method already on file.</p></div><div><strong>REPORT QUICKLY</strong><p>If you clicked or entered details, contact the security team immediately.</p></div></div><div className="trusted-links"><a href="https://www.cyber.gov.au/learn-basics/explore-basics/watch-out-threats/phishing-emails-and-texts" target="_blank" rel="noreferrer">Australian Cyber Security Centre guidance ↗</a><a href="https://www.scamwatch.gov.au/types-of-scams/phishing" target="_blank" rel="noreferrer">Scamwatch phishing guidance ↗</a></div></div>}
    </ModuleShell>
  )
}
