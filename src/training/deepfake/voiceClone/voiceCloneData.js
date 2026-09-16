export const voiceCloneStages = [
  {
    id: 'collect',
    number: '01',
    title: 'Collect reference audio',
    description: 'Public interviews, conference talks, videos and voicemail can provide samples of a person’s voice.',
  },
  {
    id: 'analyse',
    number: '02',
    title: 'Analyse the voice',
    description: 'A voice-cloning system extracts characteristics such as pitch, rhythm, pronunciation and vocal tone.',
  },
  {
    id: 'generate',
    number: '03',
    title: 'Generate new speech',
    description: 'The attacker enters words that the real speaker never recorded and generates synthetic audio in a similar voice.',
  },
  {
    id: 'deliver',
    number: '04',
    title: 'Deliver the impersonation',
    description: 'The generated audio is used in a call, voicemail or message designed to make an unusual request seem authentic.',
  },
]

export const voiceCloneStageOrder = voiceCloneStages.map((stage) => stage.id)

export const voiceRequestClues = [
  {
    id: 'authority',
    label: 'Familiar executive voice',
    isWarning: false,
    explanation: 'A familiar voice makes the request persuasive, but it does not prove identity. Treat it as unverified information rather than a warning sign you can safely resolve by listening harder.',
  },
  {
    id: 'urgency',
    label: 'Payment must happen immediately',
    isWarning: true,
    explanation: 'Artificial urgency reduces the time available to think, verify and follow normal approval procedures.',
  },
  {
    id: 'secrecy',
    label: 'The request must remain confidential',
    isWarning: true,
    explanation: 'Secrecy isolates the employee from coworkers who might question the request or recognise the impersonation.',
  },
  {
    id: 'bypass',
    label: 'Normal finance approval is bypassed',
    isWarning: true,
    explanation: 'Authority does not remove established controls. Requests to bypass them should be independently verified.',
  },
  {
    id: 'channel',
    label: 'Contact arrives through an unexpected channel',
    isWarning: true,
    explanation: 'An unexpected direct call is inconsistent with the CEO’s usual assistant-filtered communication process.',
  },
  {
    id: 'artefact',
    label: 'No obvious robotic audio artefacts',
    isWarning: false,
    explanation: 'Natural-sounding audio does not make the request safe. Modern clones may not contain an obvious glitch for the listener to detect.',
  },
]

export const requiredVoiceRequestClues = voiceRequestClues
  .filter((clue) => clue.isWarning)
  .map((clue) => clue.id)

export const responseOptions = [
  {
    id: 'comply',
    tone: 'risky',
    title: 'Follow the instruction',
    description: 'Approve the payment because the caller sounds exactly like Marcus.',
    feedback: 'The voice is being treated as authentication. If it was cloned, the attacker now controls the decision.',
  },
  {
    id: 'knowledge',
    tone: 'uncertain',
    title: 'Ask a personal company question',
    description: 'Ask the caller to name a recent project or employee before proceeding.',
    feedback: 'This introduces friction, but attackers may obtain company details through public sources, earlier attacks or stolen information.',
  },
  {
    id: 'verify',
    tone: 'safe',
    title: 'Verify through a trusted channel',
    description: 'End the interaction and contact Marcus or his assistant using established company details.',
    feedback: 'This removes the attacker’s control of the communication channel and checks the request against normal company procedure.',
  },
]

export const verificationActions = [
  { id: 'pause', title: 'Pause the request', description: 'Do not act while urgency is controlling the decision.' },
  { id: 'end', title: 'End the unverified interaction', description: 'Do not continue negotiating identity through the suspicious channel.' },
  { id: 'contact', title: 'Use an established contact method', description: 'Find the number or account in the company directory, not in the incoming message.' },
  { id: 'confirm', title: 'Confirm the request and approvals', description: 'Check both the person and the required business process.' },
  { id: 'report', title: 'Report the attempt', description: 'Preserve relevant details and alert the appropriate security or management contact.' },
]

export const verificationOrder = verificationActions.map((action) => action.id)
