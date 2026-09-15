import { useMemo, useState } from 'react'
import ModuleShell from '../ModuleShell.jsx'
import useModuleAudio from '../useModuleAudio.js'

const calls = [
  { id: 'vishing-toll', device: 'ios', caller: 'RoadLink Accounts', number: 'Unknown mobile number', isScam: true, transcript: 'Hi, RoadLink accounts here. Looks like you have an unpaid toll from yesterday and it rolls into a late fee tonight. I can sort it now—just read me the card number you want to use.', reason: 'Unexpected debt, a short deadline and a request for card information are strong warning signs.' },
  { id: 'vishing-bank', device: 'android', caller: 'Harbour Bank Security', number: 'Caller ID: HARBOUR BANK', isScam: true, transcript: 'Hi, it’s Aaron from Harbour Bank security. I’m looking at a two-thousand-dollar transfer. If that wasn’t you, no worries—I can stop it, but I need the six-digit code that just came through.', reason: 'Caller ID can be spoofed, and a bank should never ask for a one-time security code.' },
  { id: 'vishing-courier', device: 'pixel', caller: 'MetroPost Deliveries', number: 'Saved contact • MetroPost', isScam: false, transcript: 'Hey, it’s Elena from MetroPost returning your call about tomorrow’s parcel. I don’t need payment details—just update the delivery window in the MetroPost app whenever you’re free.', reason: 'This expected callback requests no secret information and directs the person to an independently opened app.' },
  { id: 'vishing-it', device: 'samsung', caller: 'Solstice IT Service Desk', number: '+61 418 330 274', isScam: true, transcript: 'Hey Jordan, Sam from IT. We’re fixing today’s sign-in issue. When the next approval pops up, tap Accept for me, and don’t open another ticket because it’ll slow things down.', reason: 'The caller requests an unexpected authentication approval and discourages the official process.' },
  { id: 'vishing-card', device: 'office', caller: 'Harbour Bank Business', number: 'Scheduled callback • HB-2047', isScam: false, transcript: 'Hi, Maya from Harbour Bank. I’m returning your scheduled call about the replacement card. I won’t ask for passwords or codes—call the number printed on the card and quote HB-2047.', reason: 'It matches an expected case, requests no secrets and encourages independent verification.' },
  { id: 'vishing-supplier', device: 'fold', caller: 'Apex Supplier Accounts', number: 'Private number', isScam: true, transcript: 'Hi, Ben from Apex accounts. Your payment bounced because we changed banks this morning. Could you swap the beneficiary before five? The old accounts number is disconnected, so don’t call it.', reason: 'A sudden bank change, deadline and blocked verification are payment-redirection warning signs.' },
]

const challenges = [
  { id: 'vishing-response-it', caller: 'Internal IT technician', transcript: 'Hey Jordan, Daniel from infrastructure. Your mailbox keeps dropping out. A Microsoft code should’ve come through—can you read it back so I can reconnect the account?', prompt: 'Which response protects the account?', correct: 2, options: ['Ask the caller to say the code first', 'Share only the final three digits', 'Refuse, end the call and contact IT through the official directory', 'Keep them talking while a colleague searches the number'], reason: 'Authentication codes are secrets. Contact the real service desk using a trusted source.' },
  { id: 'vishing-response-bank', caller: 'Bank fraud investigator', transcript: 'Hi, Harbour Bank corporate fraud team. We paused a forty-eight-thousand-dollar supplier payment. I can stop it, but I need the card number and the approval code sent to the finance phone.', prompt: 'How should the employee verify the alert?', correct: 1, options: ['Confirm the cardholder name', 'End the call and use the number on the card or known banking app', 'Ask for the caller’s employee number', 'Transfer the caller to a manager'], reason: 'Never verify a financial alert through the caller who delivered it.' },
  { id: 'vishing-response-executive', caller: 'Executive assistant', transcript: 'Hi, Claire from Marcus’s office. He’s already in the Northstar meeting and says the supplier deposit was missed. Can you release it before the client notices? Keep it within the project team.', prompt: 'What breaks the authority and secrecy pressure?', correct: 3, options: ['Ask for the CEO’s full title', 'Release a smaller payment', 'Request an email while staying on the line', 'Pause and use the approved payment-authorisation process'], reason: 'Authority and secrecy never replace normal approval controls.' },
  { id: 'vishing-response-support', caller: 'Software support engineer', transcript: 'Hey, I can see the service desk is flat out, so I opened a priority repair directly. Don’t create another internal ticket—just stay on the call and I’ll walk you through the settings.', prompt: 'What is the strongest warning sign?', correct: 0, options: ['The caller wants to keep you away from the official verification path', 'The issue sounds urgent', 'The caller may lack ticket access', 'Wait until the repair window ends'], reason: 'A request to avoid normal reporting is a warning sign.' },
]

const callbackActions = [
  { id: 'report', title: 'REPORT THE ATTEMPT', detail: 'Give security the time, claimed identity and request.' },
  { id: 'source', title: 'FIND A TRUSTED CONTACT', detail: 'Use a known app, card, directory or official website.' },
  { id: 'callback', title: 'CALL BACK INDEPENDENTLY', detail: 'Start a new call using the trusted number.' },
  { id: 'end', title: 'END THE UNVERIFIED CALL', detail: 'Leave the caller’s pressure before verifying.' },
]
const correctCallback = ['end', 'source', 'callback', 'report']

const conversation = [
  { caller: 'Hi, Mia from Harbour Bank security. We’ve got a $2,400 transfer sitting on the company account, and I just need to check I’m speaking with the authorised cardholder.', options: [
    { type: 'safe', text: 'Hmm, I’m gonna hang up and check the banking app myself.', reply: 'You can, but if you disconnect now the transfer might go through before you reach anyone.' },
    { type: 'risky', text: 'Yeah, I manage the card. What do you need from me?', reply: 'Great. Grab the card and read me the number so I can open the fraud case.' },
    { type: 'uncertain', text: 'Wait, what transfer? How come it needs me to approve anything?', reply: 'I get that it’s confusing, but the cancellation window is already counting down.' },
  ] },
  { caller: 'The payment’s marked urgent. I only need the company card number to pull up the right account and block it.', options: [
    { type: 'risky', text: 'OK, I’ve got the card here. I’ll read the number out now.', reply: 'Perfect. Next, I’ll need the security code to approve the cancellation.' },
    { type: 'uncertain', text: 'I mean, I can give you the last four digits. Is that enough?', reply: 'The full number would be quicker, but the last four might get us started.' },
    { type: 'safe', text: 'Nah, I’m not giving card details on an incoming call, mate. I’ll ring the bank myself.', reply: 'That’s your choice, but the normal number may put you in a queue.' },
  ] },
  { caller: 'You should have a six-digit security code on the finance phone. Read it out and I can reverse the payment.', options: [
    { type: 'uncertain', text: 'Well, I got the code, but how do I know you actually work for the bank?', reply: 'Fair question. My reference is HB-7714, but the code will expire while we check.' },
    { type: 'risky', text: 'Right, the code is 418920. Can you cancel it now?', reply: 'Got it. I’m processing that, but the account needs another security check.' },
    { type: 'safe', text: 'What? No, those codes are private. I’m ending this call and reporting it.', reply: 'Please don’t hang up—the transfer is about to leave.' },
  ] },
  { caller: 'Your banking app should show an approval request. Tap Approve and I can attach the cancellation.', options: [
    { type: 'safe', text: 'Nope, I didn’t start that. I’m denying it and calling through the app.', reply: 'If you deny it, you could remove the protection I placed on the transfer.' },
    { type: 'uncertain', text: 'OK, but like, what does that approval actually give you?', reply: 'It only connects the cancellation, but it expires soon.' },
    { type: 'risky', text: 'OK, I see it. I’ve approved it—what now?', reply: 'Thanks. Keep the app open while I secure the account.' },
  ] },
  { caller: 'Another device is interfering. I’ll send our support tool—install it and I can remove the device remotely.', options: [
    { type: 'risky', text: 'Righto, send the link and talk me through what to press.', reply: 'It’s on the way. Allow every permission so the secure session works.' },
    { type: 'safe', text: 'Yeah, no. I’m not installing anything from some random call. Security can handle it.', reply: 'Your team may not see the transfer until tomorrow.' },
    { type: 'uncertain', text: 'Can’t I just search for the support app myself?', reply: 'Only the version in my message connects to the fraud record.' },
  ] },
  { caller: 'This is the last chance to stop it. I need you to stay with me and finish the security process now.', options: [
    { type: 'uncertain', text: 'I don’t know… give me another minute. I’m still not sure.', reply: 'The caller stays on the line and keeps applying pressure.' },
    { type: 'safe', text: 'No, I’m done. I’m hanging up, locking the account properly and reporting this call.', reply: 'The caller disconnects once the employee refuses the unverified process.' },
    { type: 'risky', text: 'OK, fine. Tell me what else you need and let’s finish this.', reply: 'The caller continues using the information and access gathered.' },
  ] },
]

const audioPath = (group, id) => `/audio/vishing/${group}/${id}.mp3`
const conversationAudio = (stage, role, branch = '') => `/audio/vishing/what-would-happen/wwh_s${String(stage + 1).padStart(2, '0')}_${role}${branch ? `_${branch}` : ''}.mp3`

function CallPhone({ call, state, onPlay }) {
  return <article className={`call-phone ${call.device}`}><div className="phone-status"><span>9:41</span><span>▮▮ ◔</span></div><div className="call-avatar">{call.caller.split(' ').map((word) => word[0]).slice(0, 2).join('')}</div><strong>{call.caller}</strong><small>{call.number}</small><div className="call-wave"><i /><i /><i /><i /><i /></div><button type="button" onClick={onPlay}><span>{state === 'playing' ? 'Ⅱ' : '▶'}</span>{state === 'playing' ? 'PAUSE' : state === 'paused' ? 'RESUME' : 'PLAY CALL'}</button><p>{call.transcript}</p></article>
}

export default function VishingModule({ onClose, onComplete, onAudioChange, completed = false }) {
  const [step, setStep] = useState(0)
  const [listened, setListened] = useState(() => new Set())
  const [callAnswers, setCallAnswers] = useState({})
  const [challengeAnswers, setChallengeAnswers] = useState({})
  const [sequence, setSequence] = useState([])
  const [conversationStage, setConversationStage] = useState(0)
  const [conversationPhase, setConversationPhase] = useState('idle')
  const [choices, setChoices] = useState([])
  const { playingId, paused, play, stop } = useModuleAudio(onAudioChange)

  const correctCalls = calls.every((call) => callAnswers[call.id] === call.isScam)
  const correctChallenges = challenges.every((item) => challengeAnswers[item.id] === item.correct)
  const callbackComplete = sequence.join('|') === correctCallback.join('|')
  const conversationComplete = conversationPhase === 'complete'
  const canContinue = step === 0 ? correctCalls : step === 1 ? correctChallenges : step === 2 ? callbackComplete : step === 3 ? conversationComplete : true

  const counts = useMemo(() => choices.reduce((result, choice) => ({ ...result, [choice.type]: (result[choice.type] ?? 0) + 1 }), {}), [choices])
  const outcome = counts.safe === conversation.length ? 'You broke every pressure tactic and protected the account.' : (counts.risky ?? 0) >= 3 ? 'The caller gained enough information or access to cause financial loss and account recovery work.' : 'The caller kept the employee engaged. No immediate loss is guaranteed, but the account remains at risk and the incident should be reported.'

  const playCall = (call) => play(call.id, audioPath('take-the-call', call.id), () => setListened((current) => new Set(current).add(call.id)))
  const playChallenge = (item) => play(item.id, audioPath('challenge-the-caller', item.id), () => setListened((current) => new Set(current).add(item.id)))

  const startConversation = () => {
    setConversationPhase('caller')
    play(`conversation-caller-${conversationStage}`, conversationAudio(conversationStage, 'caller_prompt'), () => setConversationPhase('choose'))
  }
  const chooseConversation = (option) => {
    if (conversationPhase !== 'choose') return
    setChoices((current) => [...current, option])
    setConversationPhase('player')
    play(`conversation-player-${conversationStage}`, conversationAudio(conversationStage, 'player', option.type), () => {
      setConversationPhase('reply')
      play(`conversation-reply-${conversationStage}`, conversationAudio(conversationStage, 'caller_reply', option.type), () => {
        if (conversationStage === conversation.length - 1) setConversationPhase('complete')
        else {
          setConversationStage((current) => current + 1)
          setConversationPhase('idle')
        }
      })
    })
  }

  const continueModule = () => {
    stop()
    if (step < 4) setStep((current) => current + 1)
    else if (!completed) onComplete()
    else onClose()
  }

  return <ModuleShell moduleId="vishing" title="VISHING / VOICE-CALL AWARENESS" kicker="UNIVERSAL TRAINING MODULE // VISHING" steps={['TAKE THE CALL', 'CHALLENGE THE CALLER', 'SAFE CALLBACK', 'WHAT WOULD HAPPEN?', 'SUMMARY']} step={step} canContinue={canContinue} onContinue={continueModule} onClose={() => { stop(); onClose() }} completed={completed}>
    {step === 0 && <div className="training-stage"><div className="stage-intro magenta"><div><span>STEP 1 // SIX INCOMING CALLS</span><h3>Take the call</h3><p>Listen first, then decide whether each call is a scam or genuine. Caller ID alone is not evidence.</p></div><strong>{Object.keys(callAnswers).length} / 6<small>CALLS ASSESSED</small></strong></div><div className="call-grid">{calls.map((call) => <div className="call-case" key={call.id}><CallPhone call={call} state={playingId === call.id ? paused ? 'paused' : 'playing' : 'idle'} onPlay={() => playCall(call)} /><div className="binary-choice"><button type="button" disabled={!listened.has(call.id)} onClick={() => setCallAnswers((current) => ({ ...current, [call.id]: true }))}>SCAM CALL</button><button type="button" disabled={!listened.has(call.id)} onClick={() => setCallAnswers((current) => ({ ...current, [call.id]: false }))}>GENUINE CALL</button></div>{callAnswers[call.id] !== undefined && <p className={callAnswers[call.id] === call.isScam ? 'correct-note' : 'wrong-note'}>{callAnswers[call.id] === call.isScam ? '✓ Correct. ' : 'Listen and reassess. '}{call.reason}</p>}</div>)}</div></div>}

    {step === 1 && <div className="training-stage"><div className="stage-intro magenta"><div><span>STEP 2 // VERIFY THE REQUEST</span><h3>Challenge the caller</h3><p>Play or pause each call, then choose the response that restores independent verification.</p></div><strong>{Object.keys(challengeAnswers).length} / 4<small>CHALLENGES</small></strong></div><div className="challenge-grid">{challenges.map((item) => <article key={item.id}><header><div><span>☎</span><strong>{item.caller}</strong></div><button type="button" onClick={() => playChallenge(item)}>{playingId === item.id && !paused ? 'Ⅱ PAUSE' : '▶ PLAY CALL'}</button></header><blockquote>“{item.transcript}”</blockquote><h4>{item.prompt}</h4>{item.options.map((option, index) => <button className={`challenge-option ${challengeAnswers[item.id] === index ? 'selected' : ''}`} type="button" disabled={!listened.has(item.id)} key={option} onClick={() => setChallengeAnswers((current) => ({ ...current, [item.id]: index }))}>{option}</button>)}{challengeAnswers[item.id] !== undefined && <p className={challengeAnswers[item.id] === item.correct ? 'correct-note' : 'wrong-note'}>{challengeAnswers[item.id] === item.correct ? '✓ ' : 'Try another response. '}{item.reason}</p>}</article>)}</div></div>}

    {step === 2 && <div className="training-stage"><div className="stage-intro magenta"><div><span>STEP 3 // BUILD A VERIFICATION ROUTE</span><h3>Safe callback</h3><p>The actions are deliberately jumbled. Select them in the safest order; select an added action to return it.</p></div><strong>{sequence.length} / 4<small>ACTIONS PLACED</small></strong></div><div className="callback-builder"><section><h4>AVAILABLE ACTIONS</h4>{callbackActions.filter((item) => !sequence.includes(item.id)).map((item) => <button type="button" key={item.id} onClick={() => setSequence((current) => [...current, item.id])}><strong>{item.title}</strong><small>{item.detail}</small></button>)}</section><section><h4>YOUR VERIFICATION ROUTE</h4>{sequence.map((id, index) => { const item = callbackActions.find((action) => action.id === id); return <button type="button" key={id} onClick={() => setSequence((current) => current.filter((actionId) => actionId !== id))}><span>{index + 1}</span><strong>{item.title}</strong><small>Select to return this action</small></button> })}{sequence.length === 0 && <p>Select an available action to begin.</p>}<button className="reset-sequence" type="button" onClick={() => setSequence([])}>RESET SEQUENCE</button></section></div>{sequence.length === 4 && <p className={callbackComplete ? 'correct-note wide-note' : 'wrong-note wide-note'}>{callbackComplete ? '✓ Correct. End the pressure, find a trusted source, call independently, then report.' : 'That route still relies on the caller too early. Select placed actions to return them and try again.'}</p>}</div>}

    {step === 3 && <div className="training-stage"><div className="stage-intro magenta"><div><span>STEP 4 // BRANCHING VOICE CONVERSATION</span><h3>What would happen?</h3><p>Listen to each line. Your responses unlock only after the caller finishes speaking.</p></div><strong>{Math.min(conversationStage + 1, 6)} / 6<small>CALL STAGES</small></strong></div>{conversationPhase !== 'complete' ? <div className="conversation-simulator"><div className="dual-call"><div className="voice-call scammer"><span className="call-avatar">HB</span><strong>Harbour Bank Security</strong><small>Incoming caller • identity unverified</small><div className="call-wave"><i /><i /><i /><i /><i /></div><p>{conversation[conversationStage].caller}</p></div><div className="voice-call participant"><span className="call-avatar">YOU</span><strong>Company cardholder</strong><small>Call connected</small><div className="call-wave"><i /><i /><i /><i /><i /></div><p>{choices[conversationStage]?.text ?? 'Listen to the caller before responding.'}</p></div></div><button className="listen-caller" type="button" disabled={conversationPhase !== 'idle'} onClick={startConversation}>{conversationPhase === 'idle' ? '▶ PLAY CALLER LINE' : conversationPhase === 'choose' ? 'CHOOSE YOUR RESPONSE' : 'VOICE PLAYING…'}</button><div className="conversation-options"><h4>How do you respond?</h4>{conversation[conversationStage].options.map((option) => <button type="button" disabled={conversationPhase !== 'choose'} key={option.text} onClick={() => chooseConversation(option)}>{option.text}</button>)}</div></div> : <div className="conversation-outcome"><span>◇</span><h3>Conversation complete</h3><p>{outcome}</p><div><strong>{counts.safe ?? 0} SAFE</strong><strong>{counts.uncertain ?? 0} UNCERTAIN</strong><strong>{counts.risky ?? 0} RISKY</strong></div></div>}</div>}

    {step === 4 && <div className="training-stage summary-stage magenta-summary"><span className="summary-shield">☎</span><h3>A familiar voice is not proof of identity.</h3><p>Vishing callers use urgency, authority, fear and helpful-sounding conversation to keep people inside the attacker’s verification path.</p><div className="summary-grid"><div><strong>END THE PRESSURE</strong><p>You are allowed to end any unexpected call.</p></div><div><strong>CALL BACK SAFELY</strong><p>Use a number from a card, known app, directory or official website.</p></div><div><strong>KEEP SECRETS SECRET</strong><p>Never share passwords, card details or one-time codes.</p></div><div><strong>REPORT THE ATTEMPT</strong><p>Fast reporting protects colleagues from the same campaign.</p></div></div></div>}
  </ModuleShell>
}
