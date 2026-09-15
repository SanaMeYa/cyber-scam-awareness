export const vishingCallExamples = [
  {
    id: 'vishing-toll', device: 'ios', time: '9:41', caller: 'RoadLink Accounts', initials: 'RL', number: 'Unknown mobile number', isScam: true,
    transcript: 'Hi, RoadLink accounts here. It looks like you have an unpaid toll from yesterday, and it rolls into a late fee tonight. I can sort it out now—just read me the card number you want to use.',
    explanation: 'This personal call is a scam. It combines an unexpected debt, a short deadline, and a request for card information. Check your toll account through the provider’s known app or website instead.',
    signal: 'Unexpected payment and card request',
  },
  {
    id: 'vishing-bank', device: 'android', time: '11:08', caller: 'Harbour Bank Security', initials: 'HB', number: 'Caller ID: HARBOUR BANK', isScam: true,
    transcript: 'Hi, it’s Aaron from Harbour Bank security. I’m looking at a two-thousand-dollar transfer from the business account. If that wasn’t you, no worries—I can stop it, but I need the six-digit code that just came through.',
    explanation: 'This is a scam. Caller ID can be spoofed, and a bank should not ask for a one-time security code. End the call and use the number on the company bank card.',
    signal: 'Fear plus a one-time-code request',
  },
  {
    id: 'vishing-courier', device: 'pixel', time: '1:24', caller: 'MetroPost Deliveries', initials: 'MP', number: 'Saved contact • MetroPost', isScam: false,
    transcript: 'Hey, it’s Elena from MetroPost returning your call about tomorrow’s parcel delivery. I don’t need any payment details—just update the delivery window in the MetroPost app whenever you’re free.',
    explanation: 'This personal call is legitimate. It follows an expected request, asks for no secret information or payment, and directs the recipient to an independently opened app they already use.',
    signal: 'Expected context and no sensitive request',
  },
  {
    id: 'vishing-it', device: 'samsung', time: '2:52', caller: 'Solstice IT Service Desk', initials: 'IT', number: '+61 4 18 330 274', isScam: true,
    transcript: 'Hey Jordan, it’s Sam from IT. We’re fixing today’s sign-in issue and your mailbox is still disconnected. When the next approval pops up, tap Accept for me, and don’t open another ticket because it’ll slow things down.',
    explanation: 'This is a scam. The caller requests an unexpected authentication approval and discourages the official ticketing process. Deny the prompt and contact the real service desk.',
    signal: 'Authentication approval and process bypass',
  },
  {
    id: 'vishing-card', device: 'office', time: '3:17', caller: 'Harbour Bank Business', initials: 'HB', number: 'Scheduled callback • Case HB-2047', isScam: false,
    transcript: 'Hi, Maya here from Harbour Bank. I’m returning your scheduled call about the replacement company card. I won’t ask you for any passwords or codes—when you’re ready, call the number printed on the card and quote case HB-2047.',
    explanation: 'This is a legitimate callback. It matches an expected case, requests no secrets, and actively moves verification to a number the employee already trusts.',
    signal: 'Scheduled contact and independent callback',
  },
  {
    id: 'vishing-supplier', device: 'fold', time: '4:36', caller: 'Apex Supplier Accounts', initials: 'AP', number: 'Private number', isScam: true,
    transcript: 'Hi, it’s Ben from Apex accounts. Your payment bounced because we changed banks this morning. Could you swap the beneficiary details before five? The old accounts number is disconnected, so please don’t call it.',
    explanation: 'This is a scam. A sudden bank change, deadline, and instruction not to use the known supplier number are strong payment-redirection warning signs.',
    signal: 'Bank-detail change and blocked verification',
  },
]

export const vishingResponseExamples = [
  {
    id: 'vishing-response-it',
    identity: 'Internal IT technician', context: 'An unscheduled call during a company-wide login problem',
    caller: 'Hey Jordan, Daniel here from infrastructure. Your mailbox keeps dropping out, so I’ve started a remote repair under the outage ticket. A Microsoft code should’ve just come through—can you read it back so I can reconnect the account?',
    prompt: 'Which response protects the account without ignoring a possible outage?',
    correct: 2,
    options: [
      'Ask the caller to state the code first so you can compare it',
      'Share only the final three digits to limit the risk',
      'Refuse to share the code, end the call, and contact IT through the official directory',
      'Keep the caller talking while another employee checks the number online',
    ],
    explanation: 'Authentication codes are secrets. End the unverified call and contact the real service desk using a trusted source.',
  },
  {
    id: 'vishing-response-bank',
    identity: 'Bank fraud investigator', context: 'Caller ID displays the company bank’s name',
    caller: 'Hi, I’m calling from Harbour Bank’s corporate fraud team. We’ve paused a new supplier payment for forty-eight thousand dollars. I can stop it leaving today, but I’ll need the company card number and the approval code sent to the finance phone.',
    prompt: 'How should the employee verify the claimed payment alert?',
    correct: 1,
    options: [
      'Confirm the cardholder name but not the card number',
      'End the call and use the number printed on the company card or the known banking app',
      'Ask for the caller’s employee number and continue if they provide one',
      'Transfer the caller to a manager so they can decide',
    ],
    explanation: 'Do not verify a financial alert through the caller who delivered it. Use a known banking channel instead.',
  },
  {
    id: 'vishing-response-executive',
    identity: 'Executive assistant', context: 'The caller knows the CEO’s current meeting schedule',
    caller: 'Hi, it’s Claire from Marcus’s office. He’s already in the Northstar meeting and says the supplier deposit was missed. Can you release it before the client notices? Keep it within the project team for now—the announcement’s still confidential.',
    prompt: 'What response breaks the authority and secrecy pressure?',
    correct: 3,
    options: [
      'Ask the caller to repeat the CEO’s full name and role',
      'Release a smaller payment while waiting for written confirmation',
      'Request an email from the caller while remaining on the line',
      'Pause the request and verify it through the approved payment-authorisation process',
    ],
    explanation: 'Authority and secrecy never replace normal approval controls. Use the established payment process and trusted contacts.',
  },
  {
    id: 'vishing-response-support',
    identity: 'Software support engineer', context: 'The caller quotes a genuine product name and employee role',
    caller: 'Hey, I can see the service desk is flat out, so I opened a priority repair directly with the vendor. Don’t create another internal ticket—two engineers changing the account could mess up the recovery. Just stay on the call and I’ll walk you through the settings.',
    prompt: 'What is the strongest warning sign in this request?',
    correct: 0,
    options: [
      'The caller is trying to keep you away from the official verification path',
      'The issue is too urgent for the normal support process',
      'The caller probably has limited access to the ticketing system',
      'You should wait until the repair window finishes before reporting it',
    ],
    explanation: 'A request to avoid normal reporting is a warning sign. Genuine staff should support independent verification.',
  },
]

export const vishingCallbackActions = [
  { id: 'source', icon: '⌕', title: 'FIND A TRUSTED CONTACT', description: 'Use the staff directory, known app, card, or official website.' },
  { id: 'report', icon: '⚑', title: 'REPORT THE ATTEMPT', description: 'Give security staff the time, claimed identity, and request.' },
  { id: 'end', icon: '✕', title: 'END THE UNVERIFIED CALL', description: 'Do not remain under the caller’s pressure.' },
  { id: 'callback', icon: '☎', title: 'CALL BACK INDEPENDENTLY', description: 'Start a new call using the trusted number you found.' },
]

export const correctVishingCallbackSequence = ['end', 'source', 'callback', 'report']

export const vishingConversationStages = [
  {
    id: 'conversation-alert',
    caller: 'Hi, this is Mia from Harbour Bank security. We’ve got a $2,400 transfer sitting on the company account, and I just need to check I’m speaking with the authorised cardholder.',
    options: [
      { type: 'safe', text: 'Hmm, I’m gonna hang up and check the banking app myself.', reply: 'You can, but if you disconnect now the transfer might go through before you reach anyone.' },
      { type: 'risky', text: 'Yeah, I manage the card. What do you need from me?', reply: 'Great, thanks. Just grab the card and read me the number so I can open the fraud case.' },
      { type: 'uncertain', text: 'Wait, what transfer? How come it needs me to approve anything?', reply: 'I understand it’s confusing, but the cancellation window is already counting down.' },
    ],
  },
  {
    id: 'conversation-card',
    caller: 'The payment’s marked as urgent. I only need the company card number to pull up the right account and block it for you.',
    options: [
      { type: 'safe', text: 'Nah, I’m not giving card details on an incoming call, mate. I’ll ring the bank myself.', reply: 'That’s your choice, but the normal number may put you in a queue while the transfer completes.' },
      { type: 'risky', text: 'OK, I’ve got the card here. I’ll read the number out now.', reply: 'Perfect, that matches. Next, I’ll need the security code to approve the cancellation.' },
      { type: 'uncertain', text: 'I mean, I can give you the last four digits. Is that enough?', reply: 'The full number would be quicker, but yes, the last four might let me get started.' },
    ],
  },
  {
    id: 'conversation-code',
    caller: 'You should have a six-digit security code on the finance phone now. Read that out and I can reverse the payment straight away.',
    options: [
      { type: 'safe', text: 'What? No, those codes are private. I’m ending this call and reporting it.', reply: 'Please don’t hang up—the transfer is about to leave and a report won’t stop it in time.' },
      { type: 'risky', text: 'Right, the code is 418920. Can you cancel it now?', reply: 'Got it. I’m processing that, but the account needs one more security check.' },
      { type: 'uncertain', text: 'Well, I got the code, but how do I know you actually work for the bank?', reply: 'Fair question. My staff reference is HB-7714, but that code will expire while we keep checking.' },
    ],
  },
  {
    id: 'conversation-app',
    caller: 'Your banking app should be showing an approval request now. Tap Approve and I can attach the cancellation to your account.',
    options: [
      { type: 'safe', text: 'Nope, I didn’t start that. I’m denying it and calling the bank through the app.', reply: 'If you deny it, you could remove the protection I’ve already placed on the transfer.' },
      { type: 'risky', text: 'OK, I see the prompt. I’ve approved it—what now?', reply: 'Thanks, approval received. Keep the app open while I secure the online account.' },
      { type: 'uncertain', text: 'OK, but like, what does that approval actually give you?', reply: 'It only connects the cancellation, but it expires soon, so I need you to decide now.' },
    ],
  },
  {
    id: 'conversation-software',
    caller: 'I’m still seeing another device interfering with the account. I’ll send you our support tool—install it and I can remove the device remotely.',
    options: [
      { type: 'safe', text: 'Yeah, no. I’m not installing anything from some random call. Our security team can handle it.', reply: 'I’m trying to help, but your team may not even see the transfer until tomorrow’s reconciliation.' },
      { type: 'risky', text: 'Righto, send the link and just talk me through what I need to press.', reply: 'It’s on the way. When it opens, allow every permission so the secure session works.' },
      { type: 'uncertain', text: 'Can’t I just search for the support app myself instead of using your link?', reply: 'Not for this case. Only the version in my message connects to the fraud record.' },
    ],
  },
  {
    id: 'conversation-final',
    caller: 'This is the last chance to stop the transfer. I need you to stay with me and finish the security process now.',
    options: [
      { type: 'safe', text: 'No, I’m done. I’m hanging up, locking the account properly, and reporting this call.', reply: 'The caller disconnects once the employee refuses to continue through the unverified process.' },
      { type: 'risky', text: 'OK, fine. Just tell me what else you need and let’s finish this.', reply: 'The caller continues using the information and access gathered during the conversation.' },
      { type: 'uncertain', text: 'I don’t know… give me another minute. I’m still not sure about this.', reply: 'The caller stays on the line and keeps applying pressure while the account remains at risk.' },
    ],
  },
]

export const vishingConversationOptionOrders = [
  [2, 0, 1],
  [1, 2, 0],
  [2, 1, 0],
  [0, 2, 1],
  [1, 0, 2],
  [2, 0, 1],
]

export const vishingTakeCallAudio = {
  'vishing-toll': '/audio/vishing/take-the-call/vishing-toll.mp3',
  'vishing-bank': '/audio/vishing/take-the-call/vishing-bank.mp3',
  'vishing-courier': '/audio/vishing/take-the-call/vishing-courier.mp3',
  'vishing-it': '/audio/vishing/take-the-call/vishing-it.mp3',
  'vishing-card': '/audio/vishing/take-the-call/vishing-card.mp3',
  'vishing-supplier': '/audio/vishing/take-the-call/vishing-supplier.mp3',
}

export const vishingChallengeAudio = {
  'vishing-response-it': '/audio/vishing/challenge-the-caller/vishing-response-it.mp3',
  'vishing-response-bank': '/audio/vishing/challenge-the-caller/vishing-response-bank.mp3',
  'vishing-response-executive': '/audio/vishing/challenge-the-caller/vishing-response-executive.mp3',
  'vishing-response-support': '/audio/vishing/challenge-the-caller/vishing-response-support.mp3',
}

export const getVishingConversationAudio = (stageIndex, role, branchType = '') => {
  const stageNumber = String(stageIndex + 1).padStart(2, '0')
  const branchSuffix = branchType ? `_${branchType}` : ''
  return `/audio/vishing/what-would-happen/wwh_s${stageNumber}_${role}${branchSuffix}.mp3`
}

