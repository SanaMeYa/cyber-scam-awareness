export const phishingInspectionExamples = [
  {
    id: 'account-alert',
    layout: 'security-alert',
    type: 'Account alert',
    senderName: 'Solstice Identity Centre',
    senderAddress: 'security@solstlce-access.example',
    recipient: 'jordan.malik@solstice.example',
    subject: 'Unusual Microsoft 365 sign-in requires review',
    greeting: 'Hello valued user,',
    message: 'Our automated monitoring recorded a sign-in to your work account from a new Windows device in Melbourne at 8:42 AM. If this was not you, your mailbox and shared files may be at risk.',
    detail: 'Device: Windows 11 • Browser: Edge • Location: Melbourne, AU',
    pressureText: 'Your access will be suspended in 30 minutes unless the activity is confirmed.',
    actionText: 'REVIEW SIGN-IN',
    clues: [
      { id: 'account-sender', area: 'sender', title: 'Lookalike sender domain', explanation: 'The sender replaces a letter in “solstice”. Small spelling changes can imitate a trusted organisation.' },
      { id: 'account-greeting', area: 'greeting', title: 'Generic greeting', explanation: 'An internal identity system would normally know the employee’s name. A generic greeting deserves closer inspection.' },
      { id: 'account-pressure', area: 'deadline', title: 'Artificial deadline', explanation: 'The short deadline creates panic and discourages the recipient from checking through the official account portal.' },
      { id: 'account-action', area: 'action', title: 'Unexpected sign-in link', explanation: 'Account alerts should be checked by opening the known service directly, not by following an unexpected email link.' },
    ],
  },
  {
    id: 'invoice-change',
    layout: 'invoice-thread',
    type: 'Payment redirection',
    senderName: 'Leah Warren — Apex Office Supplies',
    senderAddress: 'leah.warren@apex-supplies.example',
    replyTo: 'apex.accounts@payment-mail.example',
    recipient: 'accounts@solstice.example',
    subject: 'RE: Invoice AP-1048 — remittance details',
    greeting: 'Hi Accounts Team,',
    message: 'Thanks for confirming that invoice AP-1048 is scheduled for this afternoon. We recently moved our receivables account to a new banking provider, so the details shown on last month’s invoice are no longer current.',
    bankNotice: 'Please replace the saved beneficiary with the account in “AP-1048-Revised.pdf” before releasing the $48,750 payment.',
    verificationText: 'Our finance phone line is being migrated today, so please reply to this email instead of calling your usual Apex contact.',
    attachmentName: 'AP-1048-Revised.pdf',
    clues: [
      { id: 'invoice-reply-to', area: 'replyto', title: 'Different reply-to address', explanation: 'The visible sender and reply-to domains do not match. Replies would be redirected to a different mailbox.' },
      { id: 'invoice-bank-change', area: 'bankchange', title: 'Unexpected bank-detail change', explanation: 'A sudden change to beneficiary details is a major business email compromise warning sign.' },
      { id: 'invoice-verification', area: 'verify', title: 'Normal verification discouraged', explanation: 'The message gives a reason not to call the known supplier contact. Payment changes should be verified independently.' },
      { id: 'invoice-attachment', area: 'attachment', title: 'Unverified revised invoice', explanation: 'The attachment supports a sensitive payment change. Verify the request before opening or acting on the document.' },
    ],
  },
  {
    id: 'shared-document',
    layout: 'file-share',
    type: 'Fake file share',
    senderName: 'CloudDesk Documents',
    senderAddress: 'shares@clouddesk-access.example',
    recipient: 'priya.nandakumar@solstice.example',
    subject: 'Jordan Malik shared a protected document with you',
    greeting: 'You have been invited to review a file',
    message: 'Jordan Malik added you as an editor and left two comments. Sign in with your work account to view the document and respond.',
    fileName: 'Confidential_Salary_Review_Q4.docx',
    fileMeta: 'Protected document • 2 comments • Editor access',
    pressureText: 'For security, this invitation expires today at 5:00 PM and cannot be restored.',
    actionText: 'OPEN SHARED DOCUMENT',
    clues: [
      { id: 'share-sender', area: 'sender', title: 'Unfamiliar sharing service', explanation: 'The organisation does not normally use this service. Unexpected platforms should be checked before signing in.' },
      { id: 'share-file', area: 'file', title: 'Unexpected sensitive file', explanation: 'The highly sensitive filename is designed to trigger curiosity, but the recipient was not expecting this document.' },
      { id: 'share-pressure', area: 'expiry', title: 'Unusual expiry pressure', explanation: 'The expiry warning encourages quick action before the recipient checks whether the invitation is genuine.' },
      { id: 'share-action', area: 'action', title: 'Login requested through email', explanation: 'The safer approach is to open the organisation’s approved document platform directly and check for the file there.' },
    ],
  },
  {
    id: 'executive-request',
    layout: 'plain-executive',
    type: 'Executive impersonation',
    senderName: 'Marcus Reyes — CEO',
    senderAddress: 'marcus.reyes.executive@fastmail-request.example',
    recipient: 'sarah.lindqvist@solstice.example',
    subject: 'Confidential request before the client meeting',
    greeting: 'Sarah, are you available for a quick confidential task?',
    message: 'I am about to join the Northstar client meeting and need four $250 digital gift cards for the guests. Purchase them using the department card and send me clear images of the codes by reply.',
    pressureText: 'Please keep this between us until the client announcement is made.',
    contactRestriction: 'I cannot take calls or Teams messages while the client is in the room. Reply here as soon as the purchase is complete.',
    signature: 'Marcus • Sent from mobile',
    clues: [
      { id: 'executive-sender', area: 'sender', title: 'Personal external address', explanation: 'A senior leader making a company request from an unfamiliar external account should be verified through an approved channel.' },
      { id: 'executive-secrecy', area: 'secrecy', title: 'Request for secrecy', explanation: 'Secrecy isolates the recipient from colleagues who might question or verify the unusual request.' },
      { id: 'executive-payment', area: 'payment', title: 'Unusual gift-card payment', explanation: 'Requests for gift cards or codes are inconsistent with normal company purchasing and approval processes.' },
      { id: 'executive-contact', area: 'contact', title: 'Verification is blocked', explanation: 'The sender claims other contact methods are unavailable, removing the normal verification step.' },
    ],
  },
]

export const emailComparisonExamples = [
  {
    id: 'password-reset',
    title: 'Password reset notice',
    prompt: 'Select the safer email.',
    correct: 'a',
    explanation: 'Email A directs staff to the normal internal portal and does not request credentials through an email link.',
    emails: {
      a: { sender: 'IT Service Desk <support@solstice.example>', to: 'Jordan Malik', sent: '9:16 AM', subject: 'Service request SD-2841 — password reset completed', body: ['The password reset you requested by phone has been completed under ticket SD-2841.', 'Open the usual staff portal from your saved bookmark and choose “Set new password”. If you did not request this change, call the service desk using the number in the staff directory.'], detail: 'Internal sender • Expected ticket • No embedded login link' },
      b: { sender: 'Microsoft Security Desk <security@solstice-helpdesk.example>', to: 'Undisclosed recipients', sent: '9:14 AM', subject: 'URGENT: Password expires today — final notice', body: ['We were unable to validate your company password during today’s security synchronisation.', 'Use the account verification button within 20 minutes and enter your current password to prevent permanent mailbox suspension.'], detail: 'External sender • Generic delivery • Unexpected credential link' },
    },
  },
  {
    id: 'supplier-payment',
    title: 'Supplier payment update',
    prompt: 'Select the safer email.',
    correct: 'b',
    explanation: 'Email B asks the recipient to verify the change using the supplier contact already held by the company.',
    emails: {
      a: { sender: 'Apex Billing <accounts@apex-newbank.example>', to: 'Solstice Accounts', sent: '1:42 PM', subject: 'RE: AP-1048 — new beneficiary required today', body: ['Our receivables account changed during a banking migration. Please replace the beneficiary before releasing the $48,750 payment this afternoon.', 'The old accounts telephone line is unavailable, so confirm completion by replying to this message. Revised instructions are attached.'], detail: 'New domain • Bank-detail change • Verification discouraged' },
      b: { sender: 'Apex Billing <accounts@apex.example>', to: 'Solstice Accounts', sent: '10:05 AM', subject: 'Notice: planned billing-system maintenance', body: ['Our invoice layout will change from 1 October as part of scheduled maintenance. Existing bank and contact details remain unchanged.', 'If a future message requests a payment change, contact Leah using the supplier number already held in your finance system before updating any record.'], detail: 'Known sender • No payment change • Independent verification encouraged' },
    },
  },
  {
    id: 'document-share',
    title: 'Shared project document',
    prompt: 'Select the safer email.',
    correct: 'a',
    explanation: 'Email A provides expected project context and directs the recipient to the organisation’s normal workspace without asking them to sign in through the message.',
    emails: {
      a: { sender: 'Projects Team <projects@solstice.example>', to: 'Orion project group', sent: '3:28 PM', subject: 'Orion workshop notes published in staff workspace', body: ['The approved notes and action register from today’s Orion workshop are now available in the existing project folder.', 'Open the normal staff workspace from your saved bookmark, then select Projects → Orion → Workshops. Contact Maya in Teams if your access is missing.'], detail: 'Expected project • Known workspace • Trusted support contact' },
      b: { sender: 'Secure Documents <notify@document-review.example>', to: 'you', sent: '3:31 PM', subject: 'Private document waiting — access expires in one hour', body: ['A confidential employee document has been shared with your work account. The sender has requested an immediate review.', 'Sign in through the secure document page using your company email and password before this protected invitation expires.'], detail: 'Unknown service • No project context • Work credential request' },
    },
  },
  {
    id: 'executive-task',
    title: 'Executive request',
    prompt: 'Select the safer email.',
    correct: 'b',
    explanation: 'Email B follows a normal approval process and gives the recipient a trusted way to confirm the request.',
    emails: {
      a: { sender: 'Marcus Reyes <ceo.private@quickrequest.example>', to: 'Sarah Lindqvist', sent: '4:03 PM', subject: 'Keep this client request confidential', body: ['I am in a board meeting and cannot take calls. Purchase four digital gift cards for the Northstar guests before 4:30 PM.', 'Send the card numbers and PINs by reply. Do not involve Finance because the client announcement is still confidential.'], detail: 'External account • Secrecy • Urgent unusual payment' },
      b: { sender: 'Executive Office <executive.office@solstice.example>', to: 'Sarah Lindqvist', sent: '11:20 AM', subject: 'Client-event purchase request PR-228 submitted', body: ['Procurement request PR-228 has been submitted for the Northstar client event and is awaiting Finance approval.', 'Review it inside the approved procurement system. For questions, call the executive assistant using the staff directory and quote PR-228.'], detail: 'Internal workflow • Traceable request • Independent verification' },
    },
  },
]

export const emailAttackJourneyStages = [
  {
    id: 'impersonation', icon: '◇', label: 'IMPERSONATION', title: 'A believable identity is imitated',
    description: 'Watch a safe fictional message take shape. Familiar branding, a lookalike sender, urgency and a disguised sign-in path are combined to make the email feel believable.',
    defence: 'Checking the complete sender address and confirming the request with the known supplier can stop the chain here.',
  },
  {
    id: 'delivery', icon: '✉', label: 'DELIVERY', title: 'The email reaches the company gateway',
    description: 'Automated controls inspect the sender, links and message reputation. Some suspicious emails are blocked, but a new or carefully disguised message may still reach an inbox.',
    defence: 'Secure email gateways reduce risk, but reporting controls and employee awareness remain necessary because filters are not perfect.',
  },
  {
    id: 'interaction', icon: '◉', label: 'INTERACTION', title: 'The employee trusts the business context',
    description: 'The message refers to a believable invoice problem and creates urgency. The employee opens it because the request resembles normal work rather than an obvious scam.',
    defence: 'Pausing to inspect the domain, unexpected deadline and verification method can prevent interaction.',
  },
  {
    id: 'capture', icon: '▣', label: 'FAKE SIGN-IN', title: 'A copied sign-in page requests information',
    description: 'The simulated link opens a visual copy of a familiar sign-in screen. Any details entered would be sent to the scammer instead of the genuine service.',
    defence: 'Open the known service from a saved bookmark or company portal rather than signing in through an unexpected email link.',
  },
  {
    id: 'account', icon: '⌁', label: 'ACCOUNT MISUSE', title: 'One compromised account can affect several company systems',
    description: 'The connected diagram shows how access to email, shared files and finance conversations can create further phishing, recovery work, disruption and possible financial loss.',
    defence: 'Phishing-resistant MFA, rapid password resets, session revocation, payment verification and prompt reporting can contain the incident.',
  },
]


export const totalPhishingClues = phishingInspectionExamples.reduce((total, example) => total + example.clues.length, 0)
