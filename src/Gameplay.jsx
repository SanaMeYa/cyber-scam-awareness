import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Gameplay.css'
import jordanPortrait from './assets/targets/jordan-malik.jpg'
import priyaPortrait from './assets/targets/priya-nandakumar.jpg'
import derekPortrait from './assets/targets/derek-combs.jpg'
import sarahPortrait from './assets/targets/sarah-lindqvist.jpg'
import marcusPortrait from './assets/targets/marcus-reyes.jpg'
import { defenses } from './gameLogic/defense/defenseConfig.js'
import { resolveTurn } from './gameLogic/resolveTurn.js'

const learningProgressSessionKey = 'breach-point:learning-progress:v1'

function readSessionLearningProgress() {
  try {
    const storedProgress = JSON.parse(window.sessionStorage.getItem(learningProgressSessionKey) ?? '[]')
    return Array.isArray(storedProgress) ? storedProgress : []
  } catch {
    return []
  }
}

function saveSessionLearningProgress(moduleIds) {
  try {
    window.sessionStorage.setItem(learningProgressSessionKey, JSON.stringify(moduleIds))
  } catch {
    // The game remains usable when browser storage is unavailable.
  }
}

const targets = [
  {
    id: 'jordan', name: 'Jordan Malik', initials: 'JM', role: 'Service Desk', tier: 1,
    tierLabel: 'Employee', tone: 'blue', image: jordanPortrait,
    traits: ['New to the role and eager to help', 'Spends downtime on Facebook', 'More cautious with unexpected calls'],
    scenario: 'The service desk queue is building during a busy afternoon when a staff member reports being locked out before an important meeting. The request includes familiar company language, but some details still need to be checked against the ticketing system. Jordan is handling the queue without direct supervision and wants to resolve the issue without delaying the employee.',
    transcript: 'Iris: Jordan joined Solstice six months ago after completing his first industry certification. He is friendly, capable and keen to show that he can manage requests independently, although he is still learning when to slow down and escalate. He sometimes checks Facebook during quiet periods, but a prank caller last month has made him more cautious whenever an unfamiliar voice contacts the desk.',
    vulnerabilities: { phishing: ['email', 'teams'], social: ['facebook'] },
    resistances: { phishing: ['vishing'] },
  },
  {
    id: 'priya', name: 'Priya Nandakumar', initials: 'PN', role: 'Receptionist', tier: 1,
    tierLabel: 'Employee', tone: 'violet', image: priyaPortrait,
    traits: ['Handles constant calls and interruptions', 'Strict about visitor sign-in procedure', 'Posts about workdays on Instagram'],
    scenario: 'The reception area is crowded as Priya manages visitors, deliveries and several incoming calls at once. A request arrives during the busiest part of the shift and appears connected to normal front-desk activity. Priya has limited time to investigate it, but she is responsible for keeping company procedures consistent while helping people quickly.',
    transcript: 'Iris: Priya has worked at the front desk for five years and remains calm when several tasks compete for her attention. She follows the visitor sign-in process carefully because the rule was strengthened after an earlier security concern. Outside work she posts ordinary updates about busy days on Instagram, while the constant volume of unscheduled calls sometimes gives her very little time to assess each caller.',
    vulnerabilities: { phishing: ['vishing'], social: ['instagram'] },
    resistances: { phishing: ['email', 'teams'] },
  },
  {
    id: 'derek', name: 'Derek Combs', initials: 'DC', role: 'IT Manager', tier: 3,
    tierLabel: 'Manager', tone: 'teal', image: derekPortrait,
    traits: ['Trusts his own technical judgement', 'Responds to fellow-IT framing', 'Accepts only mutual social contacts'],
    scenario: 'A technical request appears shortly before a scheduled board call and refers to an internal system issue that may affect senior staff. The message uses terminology familiar to the IT team and suggests that waiting could interrupt the meeting. Derek must decide whether the request fits normal internal practice while managing several other operational priorities.',
    transcript: 'Iris: Derek worked his way from helpdesk support to IT management over more than a decade. He is genuinely knowledgeable and often trusts his technical instincts because they have usually served him well. He still speaks informally with junior IT staff, but he is more guarded online and generally accepts professional connections only when a mutual contact makes them appear credible.',
    vulnerabilities: { phishing: ['teams'] },
    resistances: { social: ['linkedin', 'facebook', 'instagram'] },
    lockedMessage: 'Complete an effective attack against Jordan or Priya to unlock Manager targets.',
  },
  {
    id: 'sarah', name: 'Sarah Lindqvist', initials: 'SL', role: 'HR Manager', tier: 3,
    tierLabel: 'Manager', tone: 'amber', image: sarahPortrait,
    traits: ['Responds to empathy-based appeals', 'Verifies sensitive requests by phone', 'Trusted contact for staff problems'],
    scenario: 'HR receives a sensitive request concerning an employee who may need urgent support before an upcoming meeting. The situation sounds personal and time-sensitive, but acting on it could involve confidential staff information. Sarah must balance a quick, compassionate response with the verification procedures expected of her department.',
    transcript: 'Iris: Sarah moved into HR from a people-focused role and has become the manager employees approach when they are dealing with genuine problems. A previous near-miss led her to introduce phone-verification procedures for sensitive requests, and she follows that rule firmly. In most other situations, however, she is willing to be flexible when someone appears distressed or urgently needs help.',
    vulnerabilities: { phishing: ['email'], social: ['facebook'] },
    resistances: { phishing: ['vishing'] },
    lockedMessage: 'Complete an effective attack against Jordan or Priya to unlock Manager targets.',
  },
  {
    id: 'marcus', name: 'Marcus Reyes', initials: 'MR', role: 'CEO', tier: 4,
    tierLabel: 'CEO', tone: 'red', image: marcusPortrait,
    traits: ['High-profile speaker with public footage', 'Contact is filtered through an assistant', 'Requires strong prior intelligence'],
    scenario: 'A high-impact request is timed for a narrow gap between executive meetings and appears relevant to an upcoming company decision. Marcus normally receives information through his executive assistant, so unexpected direct contact is unusual. The request must look consistent with his schedule and established communication pathways before it receives attention.',
    transcript: 'Iris: Marcus is the public face of Solstice and is comfortable speaking at industry keynotes, recorded interviews and podcasts. Those appearances have created a large amount of publicly available audio and video, but reaching him directly remains difficult. Most requests are filtered through his executive assistant, and he has become accustomed to relying on that process rather than personally checking every new contact.',
    vulnerabilities: { deepfake: ['voice', 'video'] },
    resistances: { phishing: ['email', 'teams'], social: ['linkedin', 'facebook', 'instagram'] },
    lockedMessage: 'Complete an effective attack against a Manager to unlock the CEO.',
  },
]

const techniques = [
  { id: 'phishing', icon: '⌁', title: 'Phishing', description: 'Test a simulated message or call.', options: [
    { id: 'email', label: 'Email' }, { id: 'sms', label: 'SMS' },
    { id: 'vishing', label: 'Vishing / voice call' }, { id: 'teams', label: 'Teams / Slack DM' },
  ] },
  { id: 'social', icon: '▣', title: 'Fake Social Profile', description: 'Test a fictional connection request.', options: [
    { id: 'facebook', label: 'Facebook' }, { id: 'instagram', label: 'Instagram' }, { id: 'linkedin', label: 'LinkedIn' },
  ] },
  { id: 'deepfake', icon: '◒', title: 'Deepfake', description: 'Test synthetic media awareness.', options: [
    { id: 'voice', label: 'Voice clone' }, { id: 'video', label: 'Video / image' },
  ] },
]

const attackTrainingRequirements = {
  email: 'email',
  sms: 'sms',
  vishing: 'vishing',
}

const learningModuleCatalog = [
  {
    id: 'email', number: '01', category: 'PHISHING', theme: 'phishing', icon: '✉', title: 'Email Phishing',
    description: 'Inspect realistic inbox messages, choose safer emails, and interactively trace how one phishing message can create company-wide damage.',
    format: '4 interactive activities', available: true,
  },
  {
    id: 'sms', number: '02', category: 'PHISHING', theme: 'phishing', icon: '▤', title: 'SMS Phishing',
    description: 'Explore suspicious mobile messages, break manipulation tactics and practise choosing a safe response.',
    format: '4 interactive activities', available: true,
  },
  {
    id: 'vishing', number: '03', category: 'PHISHING', theme: 'phishing', icon: '☎', title: 'Vishing / Voice Call',
    description: 'Listen to realistic calls, challenge the caller, build a safe callback and explore a branching conversation.',
    format: '5 interactive activities', available: true,
  },
  {
    id: 'teams', number: '04', category: 'PHISHING', theme: 'phishing', icon: '◫', title: 'Teams / Slack Phishing',
    description: 'Learn how fraudulent direct messages, external accounts and malicious collaboration links imitate coworkers.',
    format: 'Module in development', available: false,
  },
  {
    id: 'facebook', number: '05', category: 'FAKE SOCIAL PROFILE', theme: 'social', icon: 'f', title: 'Facebook Impersonation',
    description: 'Investigate cloned profiles, suspicious friend requests and attempts to move conversations off-platform.',
    format: 'Module in development', available: false,
  },
  {
    id: 'instagram', number: '06', category: 'FAKE SOCIAL PROFILE', theme: 'social', icon: '◎', title: 'Instagram Impersonation',
    description: 'Recognise copied identities, deceptive direct messages and fake accounts built from public information.',
    format: 'Module in development', available: false,
  },
  {
    id: 'linkedin', number: '07', category: 'FAKE SOCIAL PROFILE', theme: 'social', icon: 'in', title: 'LinkedIn Impersonation',
    description: 'Assess fabricated professional histories, suspicious mutual connections and false recruitment approaches.',
    format: 'Module in development', available: false,
  },
  {
    id: 'voice-clone', number: '08', category: 'DEEPFAKE', theme: 'deepfake', icon: '◖', title: 'Voice-Clone Deepfake',
    description: 'Learn why a familiar voice is not proof of identity and practise independent verification techniques.',
    format: 'Module in development', available: false,
  },
  {
    id: 'video-deepfake', number: '09', category: 'DEEPFAKE', theme: 'deepfake', icon: '◉', title: 'Video / Image Deepfake',
    description: 'Examine synthetic visual media, misleading context and safer ways to verify high-impact requests.',
    format: 'Module in development', available: false,
  },
]

const phishingInspectionExamples = [
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

const emailComparisonExamples = [
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

const emailAttackJourneyStages = [
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

const smsWarningExamples = [
  {
    id: 'parcel-redelivery', layout: 'ios', type: 'Parcel redelivery', sender: 'MetroPost Delivery', senderMeta: 'Unknown mobile • +61 4 18 440 291', time: '9:12 AM', headerArea: 'sender',
    bubbles: [
      { text: 'MetroPost: We attempted to deliver parcel MP-482901 this morning. No authorised recipient was available.' },
      { text: 'A redelivery fee of $2.15 is required before the item can be scheduled again.', area: 'fee' },
      { text: 'Complete this before 10:00 AM or the parcel will be returned to the distribution centre.', area: 'deadline' },
      { text: 'Track and reschedule: metropost-redelivery.example/MP482901', area: 'link', kind: 'link' },
    ],
    clues: [
      { id: 'sms-parcel-sender', area: 'sender', title: 'Unexpected mobile number', explanation: 'The message claims to be an organisation but arrives from an unfamiliar mobile number.' },
      { id: 'sms-parcel-fee', area: 'fee', title: 'Small unexpected payment', explanation: 'A small fee can feel harmless while still leading to a fake payment page that requests card details.' },
      { id: 'sms-parcel-deadline', area: 'deadline', title: 'Artificial deadline', explanation: 'The short deadline pressures the recipient to act before checking whether a delivery is expected.' },
      { id: 'sms-parcel-link', area: 'link', title: 'Unverified tracking address', explanation: 'The address should not be trusted because it came from an unexpected message. Open the courier’s official app or site independently.' },
    ],
  },
  {
    id: 'bank-alert', layout: 'bank-thread', type: 'Bank impersonation', sender: 'Harbour Bank', senderMeta: 'Sender name shown • identity not guaranteed', time: '2:36 PM', headerArea: 'thread',
    priorMessage: 'Your one-time code for your requested login is 418 920. Never share this code with anyone.',
    bubbles: [
      { text: 'SECURITY ALERT: A $1,280 transfer to A. Patel is pending from your account.', area: 'fear' },
      { text: 'If this was not you, call our new security line immediately on 07 5550 0188.', area: 'callback' },
      { text: 'Keep your latest verification code ready so the fraud officer can cancel the transfer.', area: 'code' },
    ],
    clues: [
      { id: 'sms-bank-thread', area: 'thread', title: 'A familiar thread is not proof', explanation: 'Scam messages can sometimes appear under a familiar sender name or in an existing conversation.' },
      { id: 'sms-bank-fear', area: 'fear', title: 'Fear-driven financial alert', explanation: 'The large pending transfer creates fear and encourages an immediate response.' },
      { id: 'sms-bank-callback', area: 'callback', title: 'Number supplied by the message', explanation: 'Calling the supplied number keeps the recipient inside the unverified contact path. Use the number on the bank card or official app.' },
      { id: 'sms-bank-code', area: 'code', title: 'Request involving a security code', explanation: 'Passwords and one-time codes should never be shared with someone who contacts you unexpectedly.' },
    ],
  },
  {
    id: 'toll-notice', layout: 'android', type: 'Unpaid toll notice', sender: '+61 4 93 772 014', senderMeta: 'Not saved in contacts', time: '7:48 AM', headerArea: 'source',
    bubbles: [
      { text: 'RoadLink notice: Toll RL-774190 for vehicle 742-XQZ remains unpaid.', area: 'plate' },
      { text: 'Outstanding balance: $6.80. A $45 administration charge will be added after 6:00 PM today.', area: 'penalty' },
      { text: 'Avoid enforcement action. Review the notice at roadlink-toll-check.example/pay', area: 'link', kind: 'link' },
    ],
    clues: [
      { id: 'sms-toll-source', area: 'source', title: 'Unrecognised sender', explanation: 'The text comes from an ordinary mobile number rather than a verified communication channel.' },
      { id: 'sms-toll-plate', area: 'plate', title: 'Personal-looking detail', explanation: 'A reference or registration number can make a message feel credible, but familiar details alone do not prove who sent it.' },
      { id: 'sms-toll-penalty', area: 'penalty', title: 'Rapid penalty escalation', explanation: 'The threat of a much larger fee creates urgency that may stop the recipient from checking independently.' },
      { id: 'sms-toll-link', area: 'link', title: 'Lookalike payment link', explanation: 'Do not pay through an unexpected text link. Check for outstanding tolls through the provider’s independently located website or app.' },
    ],
  },
  {
    id: 'work-mfa', layout: 'work-chat', type: 'Work account verification', sender: 'Solstice IT Support', senderMeta: 'External SMS • +61 4 72 301 884', time: '4:21 PM', headerArea: 'external',
    bubbles: [
      { text: 'Hi Jordan, this is Daniel from Solstice IT. We are fixing an authentication outage affecting the service desk.', area: 'context' },
      { text: 'Approve the next authenticator prompt so we can synchronise your account before your shift ends.', area: 'approval' },
      { text: 'If the prompt fails, reply here with the six-digit code displayed in your app.', area: 'code' },
      { text: 'Please do not create another support ticket because it may interrupt the repair.', area: 'bypass' },
    ],
    clues: [
      { id: 'sms-work-external', area: 'external', title: 'IT request from an external number', explanation: 'An unexpected support request should be checked through the organisation’s known service-desk channel.' },
      { id: 'sms-work-context', area: 'context', title: 'Believable workplace context', explanation: 'Using the employee’s name, role and a plausible outage makes the message feel relevant, but those details may be known publicly.' },
      { id: 'sms-work-approval', area: 'approval', title: 'Unexpected approval request', explanation: 'Never approve an authentication prompt you did not initiate. It may authorise someone else’s login.' },
      { id: 'sms-work-code', area: 'code', title: 'One-time code requested', explanation: 'Legitimate support staff should not ask an employee to send a one-time authentication code.' },
      { id: 'sms-work-bypass', area: 'bypass', title: 'Normal reporting discouraged', explanation: 'The message attempts to prevent the recipient from using the official ticketing process where the request could be verified.' },
    ],
  },
  {
    id: 'reward-credit', layout: 'reward', type: 'Unexpected reward', sender: 'BrightGrid Rewards', senderMeta: 'Promotional sender ID • not previously contacted', time: '11:07 AM', headerArea: 'sender',
    bubbles: [
      { text: 'Congratulations! Your organisation’s mobile account has been selected for a $320 service credit.', area: 'reward' },
      { text: 'To confirm eligibility, provide the account holder’s name and billing postcode on the claim page.', area: 'details' },
      { text: 'Only 40 credits remain. Your allocation expires at midday if it is not activated.', area: 'scarcity' },
      { text: 'Activate credit: brightgrid-bonus.example/business', area: 'link', kind: 'link' },
    ],
    clues: [
      { id: 'sms-reward-sender', area: 'sender', title: 'Unexpected promotional sender', explanation: 'A branded sender label can look official, but it does not prove the organisation sent the message.' },
      { id: 'sms-reward-offer', area: 'reward', title: 'Unexpected reward', explanation: 'An unsolicited credit is designed to create excitement and make the recipient less cautious.' },
      { id: 'sms-reward-details', area: 'details', title: 'Business information requested', explanation: 'The claim asks for account details that could help someone impersonate the organisation later.' },
      { id: 'sms-reward-scarcity', area: 'scarcity', title: 'Artificial scarcity', explanation: 'A limited quantity and short expiry pressure the recipient to claim before checking the offer.' },
      { id: 'sms-reward-link', area: 'link', title: 'Unverified claim link', explanation: 'Check genuine account rewards through the provider’s official app or independently located website instead.' },
    ],
  },
]

const smsManipulationExamples = [
  { id: 'manipulation-urgency', label: 'Parcel expires', message: 'Pay the $2.15 redelivery fee in the next 20 minutes or your parcel will be returned.', correct: 'urgency', explanation: 'The short deadline is designed to reduce careful checking and push an immediate response.' },
  { id: 'manipulation-fear', label: 'Account threatened', message: 'Your bank account is being emptied. Call our security line now or you will be responsible for the loss.', correct: 'fear', explanation: 'The message creates fear of financial loss so the recipient reacts before verifying the alert.' },
  { id: 'manipulation-authority', label: 'Executive request', message: 'This is the CEO. Approve the authentication prompt now so I can access the board presentation.', correct: 'authority', explanation: 'The sender claims senior authority to make the recipient feel they should comply without questioning the request.' },
  { id: 'manipulation-reward', label: 'Unexpected reward', message: 'Your business number has been selected for a $500 technology rebate. Claim it before today’s allocation closes.', correct: 'reward', explanation: 'An unexpected reward creates excitement and curiosity, making the link feel more tempting.' },
  { id: 'manipulation-payroll', label: 'Payroll instruction', message: 'Payroll Manager: Complete the new salary verification form before your shift ends. This instruction has executive approval.', correct: 'authority', explanation: 'The message borrows authority from a senior role and claimed executive approval to discourage questions.' },
  { id: 'manipulation-credit', label: 'Loyalty credit', message: 'Good news—your company account qualifies for a surprise $320 service credit. Only a few allocations remain.', correct: 'reward', explanation: 'The promised credit combines reward and curiosity so the recipient focuses on claiming it rather than verifying it.' },
]

const manipulationChoices = [
  { id: 'urgency', icon: '◷', title: 'URGENCY', description: 'Act before time runs out' },
  { id: 'fear', icon: '!', title: 'FEAR', description: 'Prevent a threatened loss' },
  { id: 'authority', icon: '◆', title: 'AUTHORITY', description: 'Obey someone important' },
  { id: 'reward', icon: '★', title: 'REWARD / CURIOSITY', description: 'Gain something unexpected' },
]

const smsSafeRouteExamples = [
  {
    id: 'route-delivery', title: 'Unexpected delivery notice', situation: 'You receive a parcel-fee text, but you are unsure whether anyone ordered a delivery.', companyImpact: 'A fake payment page could expose company card details and create investigation and replacement costs.', correct: 4,
    sender: 'MetroPost Delivery', time: '9:12 AM', messages: [
      { text: 'We attempted delivery of parcel MP-482901. No authorised recipient was available.' },
      { text: 'Pay the $2.15 redelivery fee before 10:00 AM: metropost-redelivery.example/MP482901', kind: 'link' },
    ],
    options: [
      'Match the parcel number to a purchase record, then use the SMS link if it appears familiar',
      'Inspect the visible address carefully and open it only if the spelling appears correct',
      'Reply with the company address and ask the sender to confirm the intended recipient',
      'Search the courier name and call the first customer-service result that appears',
      'Open the courier’s known app or independently typed official website and enter the tracking number there',
      'Forward the message to Facilities and ask them to arrange the redelivery through the link',
    ],
    success: 'Correct. Leaving the SMS and checking through an independently accessed service breaks the untrusted path.',
  },
  {
    id: 'route-bank', title: 'Bank transfer warning', situation: 'A text reports an unfamiliar transfer and supplies a number for the “fraud team”.', companyImpact: 'Following the supplied contact path could expose verification codes or lead to unauthorised transfers.', correct: 2,
    sender: 'Harbour Bank', time: '2:36 PM', messages: [
      { text: 'SECURITY ALERT: A $1,280 transfer to A. Patel is pending.' },
      { text: 'Not you? Call our new security line on 07 5550 0188 and keep your verification code ready.', kind: 'alert' },
    ],
    options: [
      'Call the fraud number in the text but avoid mentioning any verification codes',
      'Reply that the transfer is unauthorised so the bank has a written record',
      'Open the known banking app or call the number printed on the company bank card and check the transaction there',
      'Search the supplied phone number online and call it if no scam warnings appear',
      'Wait for a second bank message before deciding whether the alert is genuine',
      'Ask another employee whether they received the same alert before responding',
    ],
    success: 'Correct. A known app or independently sourced number verifies the alert without relying on information in the SMS.',
  },
  {
    id: 'route-work', title: 'Unexpected authentication prompt', situation: 'Someone claiming to be IT asks you by SMS to approve a login prompt and avoid creating a ticket.', companyImpact: 'Approving the prompt could allow unauthorised account access, disruption and recovery work.', correct: 5,
    sender: 'Solstice IT Support', time: '4:21 PM', messages: [
      { text: 'Hi Jordan, IT is fixing today’s authentication outage.' },
      { text: 'Approve the next authenticator prompt. Do not create another support ticket while we repair your account.', kind: 'alert' },
    ],
    options: [
      'Approve the prompt, then review the login location shown in the authenticator app',
      'Reply and ask the sender to provide the internal incident or ticket number',
      'Check whether an outage was announced and approve the prompt if one exists',
      'Let the prompt expire without responding and continue working as normal',
      'Send a screenshot of the prompt but hide most of the verification code',
      'Deny the prompt and contact the service desk through the official directory or support portal',
    ],
    success: 'Correct. Denying an unrequested prompt and reporting it through the normal support channel protects the account.',
  },
  {
    id: 'route-after-click', title: 'You already entered information', situation: 'You used an SMS link and submitted a work password before noticing the address looked unusual.', companyImpact: 'Fast reporting can reduce account misuse, investigation time and wider business disruption.', correct: 3,
    sender: 'CloudDesk Documents', time: '10:44 AM', messages: [
      { text: 'A protected document is waiting. Sign in before the invitation expires: clouddesk-access.example/view', kind: 'link' },
      { text: 'You opened the page and entered your work password.', direction: 'event' },
    ],
    options: [
      'Delete the text and monitor the account for unusual activity before reporting anything',
      'Change the password through the genuine portal but do not report it unless the account is misused',
      'Turn off the phone’s connection and wait until the next workday to speak to someone',
      'Contact the security team immediately through an official channel and follow its account-recovery process',
      'Call the support number from the SMS and ask whether the page recorded the password',
      'Open the page again and enter the password once more to confirm whether the first submission worked',
    ],
    success: 'Correct. Prompt reporting lets the organisation secure access and investigate before the incident spreads.',
  },
]

const vishingCallExamples = [
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

const vishingResponseExamples = [
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

const vishingCallbackActions = [
  { id: 'source', icon: '⌕', title: 'FIND A TRUSTED CONTACT', description: 'Use the staff directory, known app, card, or official website.' },
  { id: 'report', icon: '⚑', title: 'REPORT THE ATTEMPT', description: 'Give security staff the time, claimed identity, and request.' },
  { id: 'end', icon: '✕', title: 'END THE UNVERIFIED CALL', description: 'Do not remain under the caller’s pressure.' },
  { id: 'callback', icon: '☎', title: 'CALL BACK INDEPENDENTLY', description: 'Start a new call using the trusted number you found.' },
]

const correctVishingCallbackSequence = ['end', 'source', 'callback', 'report']

const vishingConversationStages = [
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

const vishingConversationOptionOrders = [
  [2, 0, 1],
  [1, 2, 0],
  [2, 1, 0],
  [0, 2, 1],
  [1, 0, 2],
  [2, 0, 1],
]

const vishingTakeCallAudio = {
  'vishing-toll': '/audio/vishing/take-the-call/vishing-toll.mp3',
  'vishing-bank': '/audio/vishing/take-the-call/vishing-bank.mp3',
  'vishing-courier': '/audio/vishing/take-the-call/vishing-courier.mp3',
  'vishing-it': '/audio/vishing/take-the-call/vishing-it.mp3',
  'vishing-card': '/audio/vishing/take-the-call/vishing-card.mp3',
  'vishing-supplier': '/audio/vishing/take-the-call/vishing-supplier.mp3',
}

const vishingChallengeAudio = {
  'vishing-response-it': '/audio/vishing/challenge-the-caller/vishing-response-it.mp3',
  'vishing-response-bank': '/audio/vishing/challenge-the-caller/vishing-response-bank.mp3',
  'vishing-response-executive': '/audio/vishing/challenge-the-caller/vishing-response-executive.mp3',
  'vishing-response-support': '/audio/vishing/challenge-the-caller/vishing-response-support.mp3',
}

const getVishingConversationAudio = (stageIndex, role, branchType = '') => {
  const stageNumber = String(stageIndex + 1).padStart(2, '0')
  const branchSuffix = branchType ? `_${branchType}` : ''
  return `/audio/vishing/what-would-happen/wwh_s${stageNumber}_${role}${branchSuffix}.mp3`
}

const totalPhishingClues = phishingInspectionExamples.reduce((total, example) => total + example.clues.length, 0)
const totalSmsClues = smsWarningExamples.reduce((total, example) => total + example.clues.length, 0)

const startingFunds = 5_000_000
const formatMoney = (value) => new Intl.NumberFormat('en-AU', {
  style: 'currency', currency: 'AUD', maximumFractionDigits: 0,
}).format(value)

const femaleVoiceHints = [
  'natasha', 'catherine', 'karen', 'samantha', 'zira', 'aria', 'jenny',
  'sonia', 'victoria', 'moira', 'tessa', 'ava', 'susan', 'hazel', 'serena',
  'female', 'siri',
]

const getPreferredNarrationVoice = () => {
  if (!('speechSynthesis' in window)) return null

  const voices = window.speechSynthesis.getVoices()
  const scoreVoice = (voice) => {
    const name = voice.name.toLowerCase()
    const lang = voice.lang.toLowerCase()
    let score = 0

    if (lang.startsWith('en-au')) score += 50
    else if (lang.startsWith('en-gb')) score += 42
    else if (lang.startsWith('en')) score += 35
    else return -100

    if (name.includes('natural')) score += 90
    if (name.includes('online')) score += 35
    if (name.includes('premium') || name.includes('enhanced')) score += 28
    if (femaleVoiceHints.some((hint) => name.includes(hint))) score += 45
    if (name.includes('google')) score += 12
    if (voice.localService) score += 4

    return score
  }

  return [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] ?? null
}

const getPreferredParticipantVoice = (callerVoice) => {
  if (!('speechSynthesis' in window)) return null

  const differentEnglishVoices = window.speechSynthesis.getVoices().filter((voice) => (
    voice.lang.toLowerCase().startsWith('en') && voice.name !== callerVoice?.name
  ))
  const participantHints = ['william', 'daniel', 'david', 'james', 'guy', 'lee', 'mark', 'male']
  const scoreVoice = (voice) => {
    const name = voice.name.toLowerCase()
    let score = voice.lang.toLowerCase().startsWith('en-au') ? 35 : 20
    if (name.includes('natural') || name.includes('online')) score += 60
    if (name.includes('premium') || name.includes('enhanced')) score += 25
    if (participantHints.some((hint) => name.includes(hint))) score += 35
    return score
  }

  return differentEnglishVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] ?? callerVoice ?? null
}

function Gameplay() {
  const navigate = useNavigate()
  const [audioSettings, setAudioSettings] = useState({
    musicEnabled: false,
    musicVolume: 22,
    loopMusic: true,
    duckDuringNarration: true,
    soundEffectsEnabled: true,
    soundEffectsVolume: 35,
  })
  const [draftAudioSettings, setDraftAudioSettings] = useState(audioSettings)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [learningMenuOpen, setLearningMenuOpen] = useState(false)
  const [emailLessonOpen, setEmailLessonOpen] = useState(false)
  const [emailLessonMode, setEmailLessonMode] = useState('library')
  const [emailLessonComplete, setEmailLessonComplete] = useState(() => readSessionLearningProgress().includes('email'))
  const [emailLessonStep, setEmailLessonStep] = useState(0)
  const [emailCluesFound, setEmailCluesFound] = useState(() => new Set())
  const [emailComparisonAnswers, setEmailComparisonAnswers] = useState({})
  const [emailAttackJourneyStage, setEmailAttackJourneyStage] = useState(0)
  const [emailAttackConstructionStep, setEmailAttackConstructionStep] = useState(0)
  const [emailAttackConstructing, setEmailAttackConstructing] = useState(false)
  const [emailAttackSending, setEmailAttackSending] = useState(false)
  const [emailAttackInteractionOpened, setEmailAttackInteractionOpened] = useState(false)
  const [emailAttackHintVisible, setEmailAttackHintVisible] = useState(false)
  const [smsLessonOpen, setSmsLessonOpen] = useState(false)
  const [smsLessonMode, setSmsLessonMode] = useState('library')
  const [smsLessonComplete, setSmsLessonComplete] = useState(() => readSessionLearningProgress().includes('sms'))
  const [smsLessonStep, setSmsLessonStep] = useState(0)
  const [smsCluesFound, setSmsCluesFound] = useState(() => new Set())
  const [smsManipulationAnswers, setSmsManipulationAnswers] = useState({})
  const [smsSafeRouteAnswers, setSmsSafeRouteAnswers] = useState({})
  const [vishingLessonOpen, setVishingLessonOpen] = useState(false)
  const [vishingLessonMode, setVishingLessonMode] = useState('library')
  const [vishingLessonComplete, setVishingLessonComplete] = useState(() => readSessionLearningProgress().includes('vishing'))
  const [vishingLessonStep, setVishingLessonStep] = useState(0)
  const [vishingCallState, setVishingCallState] = useState('incoming')
  const [vishingCallsAnswered, setVishingCallsAnswered] = useState(() => new Set())
  const [vishingCallAnswers, setVishingCallAnswers] = useState({})
  const [vishingResponseAnswers, setVishingResponseAnswers] = useState({})
  const [vishingCallbackSequence, setVishingCallbackSequence] = useState([])
  const [vishingConversationChoices, setVishingConversationChoices] = useState([])
  const [vishingConversationStageIndex, setVishingConversationStageIndex] = useState(0)
  const [vishingConversationPhase, setVishingConversationPhase] = useState('idle')
  const [vishingClipPlayingId, setVishingClipPlayingId] = useState(null)
  const [selectedTargetId, setSelectedTargetId] = useState('jordan')
  const [selectedTechnique, setSelectedTechnique] = useState('')
  const [subtypes, setSubtypes] = useState({ phishing: 'email', social: 'linkedin', deepfake: 'voice' })
  const [funds, setFunds] = useState(startingFunds)
  const [exposure, setExposure] = useState(0)
  const [turn, setTurn] = useState(0)
  const [employeeCleared, setEmployeeCleared] = useState(false)
  const [managerCleared, setManagerCleared] = useState(false)
  const [successfulTargetIds, setSuccessfulTargetIds] = useState(() => new Set())
  const [targetAttemptCounts, setTargetAttemptCounts] = useState({})
  const [techniqueCounts, setTechniqueCounts] = useState({ phishing: 0, social: 0, deepfake: 0 })
  const [result, setResult] = useState(null)
  const [pendingResult, setPendingResult] = useState(null)
  const [defenseSelection, setDefenseSelection] = useState(null)
  const [narrationState, setNarrationState] = useState(() => 'speechSynthesis' in window ? 'idle' : 'unsupported')
  const [narrationMuted, setNarrationMuted] = useState(false)
  const musicRef = useRef(null)
  const clickAudioContextRef = useRef(null)
  const learningMenuRef = useRef(null)
  const emailLessonContentRef = useRef(null)
  const smsLessonContentRef = useRef(null)
  const vishingLessonContentRef = useRef(null)
  const narrationVoiceRef = useRef(null)
  const participantVoiceRef = useRef(null)
  const utteranceRef = useRef(null)
  const vishingUtteranceRef = useRef(null)
  const vishingAudioRef = useRef(null)
  const vishingSpeechTokenRef = useRef(0)

  const roundLocked = Boolean(pendingResult || result)

  const selectedTarget = useMemo(
    () => targets.find((target) => target.id === selectedTargetId) ?? targets[0],
    [selectedTargetId],
  )

  const narrationText = useMemo(() => {
    const irisBriefing = selectedTarget.transcript.replace(/^Iris:\s*/i, '')
    return `Scenario. ${selectedTarget.scenario} Briefing from Iris. ${irisBriefing}`
  }, [selectedTarget])

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      return undefined
    }

    const loadVoice = () => {
      narrationVoiceRef.current = getPreferredNarrationVoice()
      participantVoiceRef.current = getPreferredParticipantVoice(narrationVoiceRef.current)
    }

    loadVoice()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoice)

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoice)
      window.speechSynthesis.cancel()
      if (vishingAudioRef.current) {
        vishingAudioRef.current.pause()
        vishingAudioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const music = musicRef.current
    if (!music) return

    const narrationIsPlaying = narrationState === 'playing' || vishingCallState === 'playing'
    const duckingMultiplier = audioSettings.duckDuringNarration && narrationIsPlaying ? 0.28 : 1
    music.volume = (audioSettings.musicVolume / 100) * duckingMultiplier
    music.loop = audioSettings.loopMusic
  }, [audioSettings.duckDuringNarration, audioSettings.loopMusic, audioSettings.musicVolume, narrationState, vishingCallState])

  useEffect(() => {
    const completedModules = [
      emailLessonComplete && 'email',
      smsLessonComplete && 'sms',
      vishingLessonComplete && 'vishing',
    ].filter(Boolean)

    saveSessionLearningProgress(completedModules)
  }, [emailLessonComplete, smsLessonComplete, vishingLessonComplete])

  useEffect(() => {
    const handleButtonClick = (event) => {
      const button = event.target.closest('button')
      if (!button || button.disabled || button.closest('.audio-controls') || !audioSettings.soundEffectsEnabled) return

      const AudioContextClass = window.AudioContext ?? window.webkitAudioContext
      if (!AudioContextClass) return

      const context = clickAudioContextRef.current ?? new AudioContextClass()
      clickAudioContextRef.current = context
      if (context.state === 'suspended') context.resume()

      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const now = context.currentTime
      const level = Math.max(0.001, (audioSettings.soundEffectsVolume / 100) * 0.08)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(720, now)
      oscillator.frequency.exponentialRampToValueAtTime(390, now + 0.055)
      gain.gain.setValueAtTime(level, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start(now)
      oscillator.stop(now + 0.065)
    }

    document.addEventListener('click', handleButtonClick)
    return () => document.removeEventListener('click', handleButtonClick)
  }, [audioSettings.soundEffectsEnabled, audioSettings.soundEffectsVolume])

  useEffect(() => {
    if (!settingsOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSettingsOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [settingsOpen])

  useEffect(() => {
    if (!emailLessonOpen || emailLessonMode === 'required') return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setEmailLessonOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [emailLessonMode, emailLessonOpen])

  useEffect(() => {
    if (!smsLessonOpen || smsLessonMode === 'required') return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSmsLessonOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [smsLessonMode, smsLessonOpen])

  useEffect(() => {
    if (!vishingLessonOpen || vishingLessonMode === 'required') return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        vishingSpeechTokenRef.current += 1
        if ('speechSynthesis' in window) {
          if (window.speechSynthesis.paused) window.speechSynthesis.resume()
          window.speechSynthesis.cancel()
        }
        if (vishingAudioRef.current) {
          vishingAudioRef.current.pause()
          vishingAudioRef.current = null
        }
        vishingUtteranceRef.current = null
        setVishingClipPlayingId(null)
        setVishingCallState('idle')
        setVishingLessonOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [vishingLessonMode, vishingLessonOpen])

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

  useEffect(() => {
    if (smsLessonOpen && smsLessonContentRef.current) {
      smsLessonContentRef.current.scrollTop = 0
    }
  }, [smsLessonOpen, smsLessonStep])

  useEffect(() => {
    if (vishingLessonOpen && vishingLessonContentRef.current) {
      vishingLessonContentRef.current.scrollTop = 0
    }
  }, [vishingLessonOpen, vishingLessonStep])

  useEffect(() => {
    if (!learningMenuOpen) return undefined

    const closeLearningMenu = (event) => {
      if (!learningMenuRef.current?.contains(event.target)) setLearningMenuOpen(false)
    }
    const closeLearningMenuWithKeyboard = (event) => {
      if (event.key === 'Escape') setLearningMenuOpen(false)
    }

    document.addEventListener('mousedown', closeLearningMenu)
    document.addEventListener('keydown', closeLearningMenuWithKeyboard)
    return () => {
      document.removeEventListener('mousedown', closeLearningMenu)
      document.removeEventListener('keydown', closeLearningMenuWithKeyboard)
    }
  }, [learningMenuOpen])

  useEffect(() => {
    const music = musicRef.current
    return () => {
      music?.pause()
      clickAudioContextRef.current?.close()
    }
  }, [])

  const openAudioSettings = () => {
    setDraftAudioSettings(audioSettings)
    setSettingsOpen(true)
  }

  const updateDraftAudioSetting = (key, value) => {
    setDraftAudioSettings((current) => ({ ...current, [key]: value }))
  }

  const saveAudioSettings = () => {
    const music = musicRef.current

    if (music) {
      music.volume = draftAudioSettings.musicVolume / 100
      music.loop = draftAudioSettings.loopMusic
      if (draftAudioSettings.musicEnabled) {
        music.play().catch(() => {
          setAudioSettings((current) => ({ ...current, musicEnabled: false }))
        })
      } else {
        music.pause()
      }
    }

    setAudioSettings(draftAudioSettings)
    setSettingsOpen(false)
  }

  const playNarration = (restart = false) => {
    if (!('speechSynthesis' in window)) {
      setNarrationState('unsupported')
      return
    }

    const speech = window.speechSynthesis
    if (!restart && speech.paused) {
      speech.resume()
      setNarrationMuted(false)
      setNarrationState('playing')
      return
    }

    if (speech.paused) speech.resume()
    speech.cancel()
    const utterance = new SpeechSynthesisUtterance(narrationText)
    utterance.voice = narrationVoiceRef.current ?? getPreferredNarrationVoice()
    utterance.lang = utterance.voice?.lang ?? 'en-AU'
    utterance.rate = 0.92
    utterance.pitch = 1.04
    utterance.volume = 1
    utterance.onstart = () => setNarrationState('playing')
    utterance.onend = () => {
      setNarrationState('idle')
      utteranceRef.current = null
    }
    utterance.onerror = () => {
      setNarrationState('idle')
      utteranceRef.current = null
    }

    utteranceRef.current = utterance
    setNarrationMuted(false)
    speech.speak(utterance)
  }

  const pauseNarration = () => {
    if (!('speechSynthesis' in window)) return
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause()
      setNarrationState('paused')
    }
  }

  const toggleNarrationMute = () => {
    if (!('speechSynthesis' in window)) return

    if (!narrationMuted) {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume()
      window.speechSynthesis.cancel()
      utteranceRef.current = null
      setNarrationState('idle')
      setNarrationMuted(true)
    } else {
      setNarrationMuted(false)
    }
  }

  const stopNarration = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume()
      window.speechSynthesis.cancel()
    }
    utteranceRef.current = null
    setNarrationState('speechSynthesis' in window ? 'idle' : 'unsupported')
    setNarrationMuted(false)
  }

  function stopVishingAudio(nextState = 'idle') {
    vishingSpeechTokenRef.current += 1
    if (vishingAudioRef.current) {
      vishingAudioRef.current.onplaying = null
      vishingAudioRef.current.onended = null
      vishingAudioRef.current.onerror = null
      vishingAudioRef.current.pause()
      vishingAudioRef.current.currentTime = 0
      vishingAudioRef.current = null
    }
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume()
      window.speechSynthesis.cancel()
    }
    vishingUtteranceRef.current = null
    setVishingClipPlayingId(null)
    setVishingCallState(nextState)
  }

  const toggleVishingPause = () => {
    if (vishingAudioRef.current) {
      if (vishingCallState === 'paused') {
        vishingAudioRef.current.play().catch(() => setVishingCallState('error'))
        setVishingCallState('playing')
      } else if (!vishingAudioRef.current.paused) {
        vishingAudioRef.current.pause()
        setVishingCallState('paused')
      }
      return
    }

    if (!('speechSynthesis' in window)) return

    if (vishingCallState === 'paused') {
      window.speechSynthesis.resume()
      setVishingCallState('playing')
      return
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause()
      setVishingCallState('paused')
    }
  }

  const playVishingClip = (clipId, text, onComplete, voiceRole = 'caller', audioSrc = null) => {
    stopNarration()
    stopVishingAudio('connecting')
    const token = vishingSpeechTokenRef.current

    const finishClip = () => {
      if (token !== vishingSpeechTokenRef.current) return
      vishingAudioRef.current = null
      vishingUtteranceRef.current = null
      setVishingClipPlayingId(null)
      setVishingCallState('idle')
      onComplete?.()
    }

    const playSpeechFallback = () => {
      if (token !== vishingSpeechTokenRef.current) return
      if (!('speechSynthesis' in window)) {
        setVishingCallState('unsupported')
        onComplete?.()
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = voiceRole === 'participant'
        ? participantVoiceRef.current ?? getPreferredParticipantVoice(narrationVoiceRef.current)
        : narrationVoiceRef.current ?? getPreferredNarrationVoice()
      utterance.lang = utterance.voice?.lang ?? 'en-AU'
      utterance.rate = 0.93
      utterance.pitch = voiceRole === 'participant' ? 0.96 : 1.02
      utterance.volume = 1
      utterance.onstart = () => {
        if (token !== vishingSpeechTokenRef.current) return
        setVishingClipPlayingId(clipId)
        setVishingCallState('playing')
      }
      utterance.onend = finishClip
      utterance.onerror = (event) => {
        if (token !== vishingSpeechTokenRef.current || event.error === 'canceled' || event.error === 'interrupted') return
        finishClip()
      }

      vishingUtteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }

    if (!audioSrc) {
      playSpeechFallback()
      return
    }

    const audio = new Audio(audioSrc)
    let fallbackStarted = false
    const startFallback = () => {
      if (fallbackStarted || token !== vishingSpeechTokenRef.current) return
      fallbackStarted = true
      vishingAudioRef.current = null
      playSpeechFallback()
    }

    audio.preload = 'auto'
    audio.volume = 1
    audio.onplaying = () => {
      if (token !== vishingSpeechTokenRef.current) return
      setVishingClipPlayingId(clipId)
      setVishingCallState('playing')
    }
    audio.onended = finishClip
    audio.onerror = startFallback
    vishingAudioRef.current = audio
    audio.play().catch(startFallback)
  }

  const answerVishingCall = (example) => {
    setVishingCallsAnswered((current) => new Set(current).add(example.id))
    playVishingClip(`take-${example.id}`, example.transcript, undefined, 'caller', vishingTakeCallAudio[example.id])
  }

  const targetLocked = (target) => {
    if (successfulTargetIds.has(target.id)) return true
    if (target.tier === 3) return !employeeCleared
    if (target.tier === 4) return !managerCleared
    return false
  }

  const selectedOption = techniques.find((item) => item.id === selectedTechnique)
    ?.options.find((option) => option.id === subtypes[selectedTechnique])

  const completedAttackTraining = {
    email: emailLessonComplete,
    sms: smsLessonComplete,
    vishing: vishingLessonComplete,
  }

  const requiredModuleForAttack = (techniqueId, subtypeId) => (
    techniqueId === 'phishing' ? attackTrainingRequirements[subtypeId] ?? null : null
  )

  const isAttackTypeLocked = (techniqueId, subtypeId) => {
    const moduleId = requiredModuleForAttack(techniqueId, subtypeId)
    return Boolean(moduleId && !completedAttackTraining[moduleId])
  }

  const selectedRequiredModuleId = requiredModuleForAttack(selectedTechnique, subtypes[selectedTechnique])
  const selectedAttackLocked = isAttackTypeLocked(selectedTechnique, subtypes[selectedTechnique])
  const selectedRequiredModule = learningModuleCatalog.find((module) => module.id === selectedRequiredModuleId)

  const resetGame = () => {
    stopNarration()
    setSelectedTargetId('jordan'); setSelectedTechnique(''); setFunds(startingFunds)
    setExposure(0); setTurn(0); setEmployeeCleared(false); setManagerCleared(false)
    setSuccessfulTargetIds(new Set())
    setTargetAttemptCounts({}); setResult(null)
    setTechniqueCounts({ phishing: 0, social: 0, deepfake: 0 })
    setPendingResult(null); setDefenseSelection(null)
    setLearningMenuOpen(false)
    if (emailLessonComplete) setEmailLessonOpen(false)
    if (smsLessonComplete) setSmsLessonOpen(false)
    if (vishingLessonComplete) setVishingLessonOpen(false)
    stopVishingAudio('incoming')
    setNarrationState('idle'); setNarrationMuted(false)
  }

  const beginEmailLesson = (mode = 'library') => {
    setLearningMenuOpen(false)
    setEmailLessonMode(mode)
    setEmailLessonStep(0)
    setEmailCluesFound(new Set())
    setEmailComparisonAnswers({})
    setEmailAttackJourneyStage(0)
    setEmailAttackConstructionStep(0)
    setEmailAttackConstructing(false)
    setEmailAttackSending(false)
    setEmailAttackInteractionOpened(false)
    setEmailAttackHintVisible(false)
    setEmailLessonOpen(true)
  }

  const beginSmsLesson = (mode = 'library') => {
    setLearningMenuOpen(false)
    setSmsLessonMode(mode)
    setSmsLessonStep(0)
    setSmsCluesFound(new Set())
    setSmsManipulationAnswers({})
    setSmsSafeRouteAnswers({})
    setSmsLessonOpen(true)
  }

  const beginVishingLesson = (mode = 'library') => {
    stopNarration()
    stopVishingAudio('incoming')
    setLearningMenuOpen(false)
    setVishingLessonMode(mode)
    setVishingLessonStep(0)
    setVishingCallsAnswered(new Set())
    setVishingCallAnswers({})
    setVishingResponseAnswers({})
    setVishingCallbackSequence([])
    setVishingConversationChoices([])
    setVishingConversationStageIndex(0)
    setVishingConversationPhase('idle')
    setVishingLessonOpen(true)
  }

  const openLearningModule = (moduleId) => {
    if (moduleId === 'email') beginEmailLesson(emailLessonComplete ? 'review' : 'library')
    if (moduleId === 'sms') beginSmsLesson(smsLessonComplete ? 'review' : 'library')
    if (moduleId === 'vishing') beginVishingLesson(vishingLessonComplete ? 'review' : 'library')
  }

  const selectTechnique = (techniqueId) => {
    if (roundLocked) return
    setSelectedTechnique(techniqueId)
  }

  const changeTechniqueSubtype = (techniqueId, subtypeId) => {
    if (roundLocked) return
    setSelectedTechnique(techniqueId)
    setSubtypes((current) => ({ ...current, [techniqueId]: subtypeId }))
  }

  const selectTarget = (id) => {
    if (roundLocked || successfulTargetIds.has(id)) return
    stopNarration()
    setSelectedTargetId(id); setSelectedTechnique(''); setResult(null)
  }

  const runSimulation = () => {
    if (!selectedTechnique || selectedAttackLocked || targetLocked(selectedTarget) || roundLocked) return
    const subtype = subtypes[selectedTechnique]
    const selectedDefense = defenses[selectedTechnique][subtype]
    const isStrong = selectedTarget.vulnerabilities[selectedTechnique]?.includes(subtype)
    const isWeak = selectedTarget.resistances[selectedTechnique]?.includes(subtype)
    const nextRepeatCount = (targetAttemptCounts[selectedTarget.id] ?? 0) + 1

    const traitMatch = isStrong ? 'positive' : isWeak ? 'negative' : 'neutral'
    const intelLevel = traitMatch === 'positive'
      ? successfulTargetIds.size >= 1 ? 'multiple' : 'relevant'
      : successfulTargetIds.size >= 1 ? 'relevant' : 'none'

    const turnResult = resolveTurn({
      targetId: selectedTarget.id,
      targetName: selectedTarget.name,
      targetTier: selectedTarget.tierLabel.toLowerCase(),
      technique: selectedTechnique,
      subtype,
      intelLevel,
      traitMatch,
      attemptNumber: nextRepeatCount,
      alertLevel: exposure,
      defense: selectedDefense,
    })

    setDefenseSelection({
      ...turnResult.defense,
      technique: techniques.find((item) => item.id === selectedTechnique)?.title,
      subtype: selectedOption.label,
      target: selectedTarget.name,
    })

    setPendingResult({
      ...turnResult,
      traitMatch,
      effectiveMatch: isStrong,
      resistedMatch: isWeak,
      targetCompleted: turnResult.success && isStrong,
      nextRepeatCount,
    })
  }

  const launchSimulation = () => {
    if (!selectedTechnique || selectedAttackLocked || targetLocked(selectedTarget) || roundLocked) return
    runSimulation()
  }

  const displayRoundResult = () => {
    if (!pendingResult) return

    stopNarration()

    const nextFunds = Math.max(0, funds - pendingResult.damage)
    const nextExposure = Math.min(100, exposure + pendingResult.alertIncrease)
    const nextTurn = turn + 1
    const nextTechniqueCounts = {
      ...techniqueCounts,
      [selectedTechnique]: techniqueCounts[selectedTechnique] + 1,
    }

    setFunds(nextFunds)
    setExposure(nextExposure)
    setTechniqueCounts(nextTechniqueCounts)
    setTargetAttemptCounts((current) => ({
      ...current,
      [selectedTarget.id]: pendingResult.nextRepeatCount,
    }))

    const nextSuccessfulTargetIds = new Set(successfulTargetIds)
    if (pendingResult.targetCompleted) nextSuccessfulTargetIds.add(selectedTarget.id)

    if (pendingResult.targetCompleted && selectedTarget.tier === 1) setEmployeeCleared(true)
    if (pendingResult.targetCompleted && selectedTarget.tier === 3) setManagerCleared(true)
    setSuccessfulTargetIds(nextSuccessfulTargetIds)

    setResult(pendingResult)
    setPendingResult(null)

    const ceoTakedown = pendingResult.success && selectedTarget.id === 'marcus'
    const won = nextFunds <= 0 || ceoTakedown

    if (won || nextExposure >= 100) {
      navigate(won ? '/victory' : '/game-over', {
        state: {
          reason: !won ? 'detected' : ceoTakedown ? 'ceo' : 'bankrupt',
          turnsPlayed: nextTurn,
          startingFunds,
          fundsRemaining: nextFunds,
          fundsRemoved: startingFunds - nextFunds,
          exposure: nextExposure,
          exposureGain: pendingResult.exposureGain,
          finalTarget: selectedTarget.name,
          technique: techniques.find((item) => item.id === selectedTechnique)?.title ?? 'Technique',
          subtype: selectedOption.label,
          techniqueCounts: nextTechniqueCounts,
        },
      })
    }
  }

  const nextRound = () => {
    stopNarration()
    const nextAvailableTarget = targets.find((target) => !targetLocked(target))
    if (nextAvailableTarget) setSelectedTargetId(nextAvailableTarget.id)
    setTurn((value) => value + 1)
    setSelectedTechnique('')
    setResult(null)
    setPendingResult(null)
    setDefenseSelection(null)
  }
  const fundsPercent = (funds / startingFunds) * 100

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

    setEmailLessonComplete(true)
    setEmailLessonOpen(false)
  }

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

    setSmsLessonComplete(true)
    setSmsLessonOpen(false)
  }

  const addVishingCallbackAction = (actionId) => {
    setVishingCallbackSequence((current) => current.includes(actionId) ? current : [...current, actionId])
  }

  const removeVishingCallbackAction = (actionId) => {
    setVishingCallbackSequence((current) => current.filter((item) => item !== actionId))
  }

  const playVishingConversationCaller = (stageIndex) => {
    const stage = vishingConversationStages[stageIndex]
    if (!stage) return

    setVishingConversationStageIndex(stageIndex)
    setVishingConversationPhase('caller')
    playVishingClip(`conversation-caller-${stageIndex}`, stage.caller, () => {
      setVishingConversationPhase('choosing')
    }, 'caller', getVishingConversationAudio(stageIndex, 'caller_prompt'))
  }

  const startVishingConversation = () => {
    if (vishingConversationPhase !== 'idle') return
    setVishingConversationChoices([])
    playVishingConversationCaller(0)
  }

  const resetVishingConversation = () => {
    stopVishingAudio('idle')
    setVishingConversationChoices([])
    setVishingConversationStageIndex(0)
    setVishingConversationPhase('idle')
  }

  const chooseVishingConversationOption = (option) => {
    if (vishingConversationPhase !== 'choosing') return

    const stageIndex = vishingConversationStageIndex
    setVishingConversationChoices((current) => [...current, { stageIndex, ...option }])
    setVishingConversationPhase('participant')

    playVishingClip(`conversation-participant-${stageIndex}`, option.text, () => {
      setVishingConversationPhase('reply')
      playVishingClip(`conversation-reply-${stageIndex}`, option.reply, () => {
        const nextStageIndex = stageIndex + 1
        if (nextStageIndex >= vishingConversationStages.length) {
          setVishingConversationPhase('complete')
          return
        }
        playVishingConversationCaller(nextStageIndex)
      }, 'caller', getVishingConversationAudio(stageIndex, 'caller_reply', option.type))
    }, 'participant', getVishingConversationAudio(stageIndex, 'player', option.type))
  }

  const advanceVishingLesson = () => {
    const callsComplete = vishingCallExamples.every((example) => vishingCallAnswers[example.id] === example.isScam)
    const responsesComplete = vishingResponseExamples.every((example) => vishingResponseAnswers[example.id] === example.correct)
    const callbackComplete = vishingCallbackSequence.join('|') === correctVishingCallbackSequence.join('|')
    const conversationComplete = vishingConversationPhase === 'complete'

    if (vishingLessonStep === 0 && !callsComplete) return
    if (vishingLessonStep === 1 && !responsesComplete) return
    if (vishingLessonStep === 2 && !callbackComplete) return
    if (vishingLessonStep === 3 && !conversationComplete) return

    stopVishingAudio('idle')
    if (vishingLessonStep < 4) {
      setVishingLessonStep((current) => current + 1)
      return
    }

    setVishingLessonComplete(true)
    setVishingLessonOpen(false)
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
  const correctVishingCallCount = vishingCallExamples.filter((example) => vishingCallAnswers[example.id] === example.isScam).length
  const correctVishingResponseCount = vishingResponseExamples.filter((example) => vishingResponseAnswers[example.id] === example.correct).length
  const vishingCallbackComplete = vishingCallbackSequence.join('|') === correctVishingCallbackSequence.join('|')
  const vishingConversationComplete = vishingConversationPhase === 'complete'
  const vishingDecisionCounts = vishingConversationChoices.reduce((counts, choice) => ({
    ...counts,
    [choice.type]: counts[choice.type] + 1,
  }), { safe: 0, risky: 0, uncertain: 0 })
  const vishingConversationOutcome = vishingDecisionCounts.safe === vishingConversationStages.length
    ? { tone: 'safe', title: 'CALL SAFELY CONTAINED', impact: '$0 DIRECT LOSS', explanation: 'Every decision ended or rejected the caller-controlled process. No credentials, codes, approvals, or remote access were provided.' }
    : vishingDecisionCounts.risky === vishingConversationStages.length
      ? { tone: 'risky', title: 'ACCOUNT AND FUNDS EXPOSED', impact: '$2,400 SIMULATED LOSS', explanation: 'The caller obtained card information, an authentication code, approval, and remote access. The company would also face investigation and recovery costs.' }
      : vishingDecisionCounts.uncertain >= 4
        ? { tone: 'uncertain', title: 'DELAY INCREASED THE RISK', impact: 'RESPONSE COSTS INCREASED', explanation: 'No firm verification decision was made. Remaining on the call gave the scammer more opportunities to apply pressure, while reporting and account protection were delayed.' }
        : vishingDecisionCounts.risky > vishingDecisionCounts.safe
          ? { tone: 'risky', title: 'CALLER GAINED A FOOTHOLD', impact: 'CREDENTIAL RECOVERY REQUIRED', explanation: 'Several risky choices exposed information or access. Later caution helped, but the organisation would still need to secure the account and investigate activity.' }
          : { tone: 'mixed', title: 'PARTIAL CONTAINMENT', impact: 'LIMITED EXPOSURE', explanation: 'The employee eventually moved to safer actions, but hesitation or earlier disclosure created avoidable investigation and recovery work.' }
  const currentVishingConversationStage = vishingConversationStages[Math.min(vishingConversationStageIndex, vishingConversationStages.length - 1)]
  const vishingConversationAudioActive = ['caller', 'participant', 'reply'].includes(vishingConversationPhase)
  const vishingConversationPhaseLabel = {
    idle: 'INCOMING TRAINING CALL',
    caller: 'CALLER SPEAKING',
    choosing: 'YOUR RESPONSE',
    participant: 'YOU ARE SPEAKING',
    reply: 'CALLER RESPONDING',
    complete: 'CALL COMPLETE',
  }[vishingConversationPhase]
  const vishingCurrentStepComplete = vishingLessonStep === 0
    ? correctVishingCallCount === vishingCallExamples.length
    : vishingLessonStep === 1
      ? correctVishingResponseCount === vishingResponseExamples.length
      : vishingLessonStep === 2
        ? vishingCallbackComplete
        : vishingLessonStep === 3
          ? vishingConversationComplete
          : true
  const vishingStepProgress = vishingLessonStep === 0
    ? correctVishingCallCount / vishingCallExamples.length
    : vishingLessonStep === 1
      ? correctVishingResponseCount / vishingResponseExamples.length
      : vishingLessonStep === 2
        ? vishingCallbackSequence.length / correctVishingCallbackSequence.length
        : vishingLessonStep === 3
          ? vishingConversationChoices.length / vishingConversationStages.length
          : 1
  const vishingProgressPercent = Math.round(((vishingLessonStep + vishingStepProgress) / 5) * 100)
  const learningModuleCompletion = {
    email: emailLessonComplete,
    sms: smsLessonComplete,
    vishing: vishingLessonComplete,
  }
  const completedLearningModules = Object.values(learningModuleCompletion).filter(Boolean).length
  const availableLearningModules = learningModuleCatalog.filter((module) => module.available).length

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
    <main className="game-page">
      <audio ref={musicRef} src="/audio/max-brhon-cyberpunk.mp3" preload="metadata" />
      <div className="cyber-atmosphere" aria-hidden="true">
        <span className="ambient-orb orb-one" />
        <span className="ambient-orb orb-two" />
        <span className="scan-beam" />
      </div>
      <div className="game-shell">
        <header className="game-header">
          <div className="brand-lockup">
            <div className="game-brand" data-text="BREACH POINT">BREACH POINT</div>
            <div className="game-subtitle">SOCIAL ENGINEERING AWARENESS SIMULATION</div>
            <div className="system-status-line"><span><i />SIMULATION ONLINE</span><span>LOCAL SESSION</span><span>SESSION PROGRESS SAVED</span></div>
          </div>
          <div className="header-actions">
            <div className="learning-library" ref={learningMenuRef}>
              <button className="utility-button learning-library-trigger" type="button" aria-haspopup="dialog" aria-expanded={learningMenuOpen} aria-controls="learning-library-dialog" onClick={() => setLearningMenuOpen((current) => !current)}>
                <span className="learning-icon">◈</span> LEARNING
                <span className={`learning-status-dot ${completedLearningModules > 0 ? 'unlocked' : ''}`} aria-hidden="true" />
              </button>
              {learningMenuOpen && (
                <div className="learning-library-backdrop" role="presentation" onMouseDown={(event) => {
                  if (event.target === event.currentTarget) setLearningMenuOpen(false)
                }}>
                  <section className="learning-library-modal" id="learning-library-dialog" role="dialog" aria-modal="true" aria-labelledby="learning-library-title" onMouseDown={(event) => event.stopPropagation()}>
                    <div className="library-scan-line" aria-hidden="true" />
                    <header className="learning-library-header">
                      <div className="learning-library-title-block">
                        <span className="library-eyebrow">KNOWLEDGE // DEFENCE NETWORK</span>
                        <div>
                          <span className="library-core-icon" aria-hidden="true">◈</span>
                          <div><h2 id="learning-library-title">Awareness Training Library</h2><p>Build practical recognition and response skills through optional interactive modules.</p></div>
                        </div>
                      </div>
                      <div className="learning-library-stats" aria-label="Learning library status">
                        <div><strong>09</strong><span>TOTAL MODULES</span></div>
                        <div><strong>{String(availableLearningModules).padStart(2, '0')}</strong><span>AVAILABLE NOW</span></div>
                        <div className="complete"><strong>{String(completedLearningModules).padStart(2, '0')}</strong><span>COMPLETED</span></div>
                      </div>
                      <button className="learning-library-close" type="button" aria-label="Close Learning Library" onClick={() => setLearningMenuOpen(false)}>×</button>
                    </header>

                    <div className="learning-library-category-strip" aria-label="Module categories">
                      <span className="phishing"><i />4 PHISHING MODULES</span>
                      <span className="social"><i />3 FAKE PROFILE MODULES</span>
                      <span className="deepfake"><i />2 DEEPFAKE MODULES</span>
                    </div>

                    <div className="learning-library-grid">
                      {learningModuleCatalog.map((module) => {
                        const completed = Boolean(learningModuleCompletion[module.id])
                        return (
                          <article className={`library-module-card ${module.theme} ${module.available ? 'available' : 'coming-soon'} ${completed ? 'completed' : ''}`} key={module.id}>
                            <header><span>MODULE {module.number}</span><em>{completed ? '✓ COMPLETED' : module.available ? 'AVAILABLE' : 'COMING SOON'}</em></header>
                            <div className="library-module-main">
                              <span className="library-module-icon" aria-hidden="true">{module.icon}</span>
                              <div><small>{module.category}</small><h3>{module.title}</h3></div>
                            </div>
                            <p>{module.description}</p>
                            <footer>
                              <span>{module.format}</span>
                              <button type="button" disabled={!module.available} onClick={() => openLearningModule(module.id)}>
                                {module.available ? (completed ? 'REVIEW MODULE' : 'START MODULE') : 'IN DEVELOPMENT'} <i>›</i>
                              </button>
                            </footer>
                          </article>
                        )
                      })}
                    </div>

                    <footer className="learning-library-footer">
                      <div><span>◉</span><p><strong>OPTIONAL TRAINING</strong> Modules no longer interrupt gameplay. Open this library whenever you want to practise.</p></div>
                      <small>SESSION-ONLY PROGRESS • NO PERSONAL DATA STORED</small>
                    </footer>
                  </section>
                </div>
              )}
            </div>
            <button className="utility-button" type="button" onClick={openAudioSettings} aria-haspopup="dialog">
              <span className="settings-icon">⚙</span> SETTINGS
              <span className={`audio-status-dot ${audioSettings.musicEnabled ? 'active' : ''}`} aria-label={`Music ${audioSettings.musicEnabled ? 'on' : 'off'}`} />
            </button>
            <button className="utility-button" type="button" onClick={resetGame}><span className="restart-icon">↻</span> RESTART</button>
          </div>
        </header>

        <section className="status-grid">
          <div className="importance-card glass-panel">
            <div className="round-icon">●</div>
            <div className="importance-content">
              <div className="status-title">TARGET IMPORTANCE — LEVEL {selectedTarget.tier} OF 4</div>
              <div className="importance-track" aria-label={`Target level ${selectedTarget.tier} of 4`}>
                {[1, 2, 3, 4].map((level) => <span key={level} className={level <= selectedTarget.tier ? 'reached' : ''} />)}
              </div>
              <div className="importance-labels"><span>EMPLOYEE</span><span>SENIOR EMPLOYEE</span><span>MANAGER</span><span>CEO</span></div>
            </div>
          </div>
          <div className="turn-card glass-panel"><div className="round-icon turn">↻</div><div><div className="status-title">TURN</div><div className="turn-number">{turn}</div></div></div>
        </section>

        <section className="meter glass-panel funds-meter">
          <div className="meter-name">COMPANY FUNDS REMAINING</div>
          <div className="meter-track"><span style={{ width: `${fundsPercent}%` }} /></div>
          <div className="meter-value funds-value"><strong>{formatMoney(funds)}</strong></div>
        </section>

        <section className="meter glass-panel exposure-meter">
          <div className="shield-icon">◇</div><div className="meter-name">ATTACKER EXPOSURE</div>
          <div className="meter-track exposure-track"><span style={{ width: `${exposure}%` }} /></div>
          <div className="meter-value exposure-value">{exposure}%</div>
          <div className="detected-label"><span>◇</span> 100% = DETECTED</div>
        </section>

        <section className="gameplay-grid">
          <article className="target-panel glass-panel">
            <div className="section-kicker">TARGET</div>
            <div className={`target-avatar ${selectedTarget.tone}`}>
              <img src={selectedTarget.image} alt={`${selectedTarget.name}, ${selectedTarget.role}`} />
              <div className="avatar-rings" />
            </div>
            <div className="target-traits">
              {selectedTarget.traits.map((trait, index) => <div key={trait}><span>{['✉', '▣', '▱'][index]}</span>{trait}</div>)}
            </div>
          </article>

          <article className="selection-panel glass-panel">
            <div className="section-kicker">CHOOSE TARGET</div>
            <div className="target-list" aria-label="Available targets">
              {targets.map((target) => {
                const locked = targetLocked(target)
                const successful = successfulTargetIds.has(target.id)
                return <button className={`target-row ${target.id === selectedTargetId ? 'selected' : ''} ${successful ? 'completed' : ''}`} key={target.id} type="button" disabled={locked || roundLocked} title={successful ? `${target.name}: attack successful` : locked ? target.lockedMessage : roundLocked ? 'Complete the current round first' : `Select ${target.name}`} onClick={() => selectTarget(target.id)}>
                  <span className={`mini-avatar ${target.tone}`}><img src={target.image} alt="" /></span>
                  <span className="target-row-copy"><strong>{target.name}</strong><small>{target.role}</small></span>
                  <span className={`level-tag ${successful ? 'success' : ''}`}>{successful ? 'ATTACK SUCCESSFUL' : locked ? 'LOCKED' : `LEVEL ${target.tier}`}</span>
                </button>
              })}
            </div>
          </article>

          <article className="scenario-panel glass-panel">
            {!result ? <>
              <div className="section-kicker">SCENARIO</div><p className="scenario-copy">{selectedTarget.scenario}</p>
              <div className="audio-controls" aria-label="Narration controls">
                <button className={narrationState === 'playing' ? 'active' : ''} type="button" aria-label={narrationState === 'paused' ? 'Resume narration' : 'Play narration'} disabled={narrationState === 'unsupported'} onClick={() => playNarration(false)}><span>▶</span> {narrationState === 'paused' ? 'RESUME' : 'PLAY'}</button>
                <button className={narrationState === 'paused' ? 'active' : ''} type="button" aria-label="Pause narration" disabled={narrationState !== 'playing'} onClick={pauseNarration}><span>Ⅱ</span> PAUSE</button>
                <button type="button" aria-label="Replay narration from the beginning" disabled={narrationState === 'unsupported'} onClick={() => playNarration(true)}><span>↻</span> REPLAY</button>
                <button className={narrationMuted ? 'active muted' : ''} type="button" aria-label={narrationMuted ? 'Unmute narration' : 'Mute narration'} aria-pressed={narrationMuted} disabled={narrationState === 'unsupported'} onClick={toggleNarrationMute}><span>{narrationMuted ? '🔈' : '🔇'}</span> {narrationMuted ? 'UNMUTE' : 'MUTE'}</button>
              </div>
              <div className="transcript-box"><div className="transcript-heading"><span>TRANSCRIPT</span><span>{narrationState === 'unsupported' ? 'VOICE UNAVAILABLE' : narrationMuted ? 'NARRATION MUTED' : narrationState === 'playing' ? 'NARRATION PLAYING' : narrationState === 'paused' ? 'NARRATION PAUSED' : 'VISIBLE NARRATION'}</span></div><p>{selectedTarget.transcript}</p></div>
            </> : <div className="round-result" aria-live="polite">
              <div className="result-topline">
                <div>
                  <span className="section-kicker">ROUND RESULT</span>
                  <h2>{result.targetCompleted ? 'Effective Attack' : result.success ? 'Limited Impact' : 'Attack Blocked'}</h2>
                </div>
                <span className={`result-badge ${result.targetCompleted ? 'effective' : result.success ? 'partial' : 'risky'}`}>
                  {result.targetCompleted ? '✓ TARGET COMPLETED' : result.success ? '• TARGET REMAINS ACTIVE' : '! ATTACK BLOCKED'}
                </span>
              </div>
              <div className="result-impact"><div><small>COMPANY DAMAGE</small><strong>−{formatMoney(result.damage)}</strong></div><div><small>EXPOSURE GAIN</small><strong>+{result.alertIncrease}%</strong></div></div>
              <p>{result.dialogue.line}</p><div className="defence-note"><strong>DEFENSIVE LESSON</strong><span>{result.dialogue.tag}</span></div>
              {result.success && !result.targetCompleted && <div className="match-warning">This attempt caused limited simulated damage, but it did not match {selectedTarget.name}&apos;s vulnerabilities. The target remains active.</div>}
              {result.fatigue && <div className="fatigue-warning">Repeated contact made {selectedTarget.name} more alert.</div>}
            </div>}
          </article>
        </section>

        <section className="technique-section glass-panel">
          <div className="technique-heading">CHOOSE A TECHNIQUE AND TYPE</div>
          <div className="technique-layout">
            <div className="technique-cards">
              {techniques.map((technique) => {
                const activeSubtype = subtypes[technique.id]
                const activeTypeLocked = isAttackTypeLocked(technique.id, activeSubtype)

                return (
                  <article key={technique.id} className={`technique-card ${selectedTechnique === technique.id ? 'selected' : ''} ${roundLocked ? 'locked' : ''} ${selectedTechnique === technique.id && activeTypeLocked ? 'training-locked' : ''}`} onClick={() => selectTechnique(technique.id)}>
                    <button className="technique-main" type="button" disabled={roundLocked} aria-pressed={selectedTechnique === technique.id}>
                      <span className="technique-icon">{technique.icon}</span><span><strong>{technique.title}</strong><small>{technique.description}</small></span>
                    </button>
                    <label><span>TYPE</span><select value={activeSubtype} disabled={roundLocked} onClick={(event) => event.stopPropagation()} onChange={(event) => changeTechniqueSubtype(technique.id, event.target.value)}>
                      {technique.options.map((option) => {
                        const moduleId = requiredModuleForAttack(technique.id, option.id)
                        const locked = isAttackTypeLocked(technique.id, option.id)
                        const status = locked ? '🔒 ' : moduleId ? '✓ ' : ''
                        return <option key={option.id} value={option.id}>{status}{option.label}{locked ? ' — Complete module' : ''}</option>
                      })}
                    </select></label>
                  </article>
                )
              })}
            </div>
            <aside className="launch-panel">
              {!pendingResult && !result && selectedAttackLocked && <button className="launch-button training-unlock" type="button" onClick={() => openLearningModule(selectedRequiredModuleId)}>UNLOCK IN LEARNING <span>🔒</span></button>}
              {!pendingResult && !result && !selectedAttackLocked && <button className="launch-button" type="button" disabled={!selectedTechnique || targetLocked(selectedTarget)} onClick={launchSimulation}>LAUNCH SIMULATION <span>{selectedTechnique ? '▶' : '▣'}</span></button>}
              {pendingResult && <button className="launch-button defense-locked" type="button" disabled>DEFENCE SYSTEM LOCKED <span>▣</span></button>}
              {result && <button className="launch-button next" type="button" onClick={nextRound}>NEXT ROUND <span>›</span></button>}
              <p>{result ? 'Review the educational result, then continue.' : pendingResult ? 'The company has selected its defensive response. Reveal the result below.' : selectedAttackLocked ? `Complete ${selectedRequiredModule?.title} in the Learning Library to unlock this attack.` : selectedTechnique ? `${techniques.find((item) => item.id === selectedTechnique)?.title}: ${selectedOption?.label}` : 'Select a target and choose a technique type to launch the simulation.'}</p>
            </aside>
          </div>
        </section>

        <section className={`ai-defense-section glass-panel ${defenseSelection ? 'active' : ''}`} aria-live="polite">
          <div className="ai-defense-header">
            <div>
              <div className="section-kicker">COMPANY DEFENCE SYSTEM</div>
              <p>Automatically selects the company control that best matches the simulated attack.</p>
            </div>
            <span className={`ai-status ${result ? 'resolved' : defenseSelection ? 'locked' : ''}`}>
              {result ? 'ROUND RESOLVED' : defenseSelection ? 'RESPONSE LOCKED' : 'STANDBY'}
            </span>
          </div>

          <div className="ai-defense-body">
            <div className="ai-core">
              <div className="ai-core-icon"><span>DS</span></div>
              <div><strong>AEGIS DEFENCE SYSTEM</strong><small>Company controlled • User cannot modify</small></div>
            </div>

            {!defenseSelection ? (
              <div className="ai-defense-empty">
                <span className="scan-line" />
                <strong>WAITING FOR SIMULATION</strong>
                <p>Launch an attack to let the company analyse its channel and select a defensive control.</p>
              </div>
            ) : (
              <>
                <div className="defense-control-card">
                  <div className="defense-control-label">SELECTED DEFENSIVE CONTROL <span>LOCKED</span></div>
                  <h3>{defenseSelection.name}</h3>
                  <p>{defenseSelection.description}</p>
                  <div className="defense-tags">
                    <span>{defenseSelection.technique}</span>
                    <span>{defenseSelection.subtype}</span>
                    <span>{defenseSelection.target}</span>
                  </div>
                </div>

                <div className="defense-result-action">
                  <div className={`defense-outcome ${result ? result.success ? 'bypassed' : 'held' : 'pending'}`}>
                    <small>DEFENCE STATUS</small>
                    <strong>{result ? result.success ? 'DEFENCE BYPASSED' : 'DEFENCE HELD' : 'CONTROL DEPLOYED'}</strong>
                  </div>
                  {pendingResult && <button className="display-result-button" type="button" onClick={displayRoundResult}>DISPLAY ROUND RESULT <span>›</span></button>}
                  {result && <p className="defense-complete-note">Funds and exposure have now been updated.</p>}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {emailLessonOpen && (
        <div className="email-lesson-backdrop">
          <section className="email-lesson-modal universal-lesson" role="dialog" aria-modal="true" aria-labelledby="email-lesson-title">
            <header className="email-lesson-header">
              <div>
                <span className="lesson-kicker">UNIVERSAL TRAINING MODULE // EMAIL PHISHING</span>
                <h2 id="email-lesson-title">EMAIL PHISHING AWARENESS</h2>
              </div>
              <button className="lesson-close" type="button" aria-label="Close Email Phishing training and return to the game" onClick={() => setEmailLessonOpen(false)}>×</button>
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
                  <div className="completion-callout"><span>✓</span><div><strong>MODULE READY TO COMPLETE</strong><p>{emailLessonComplete ? 'You have reviewed the complete Email Phishing training module again.' : 'Complete the module to mark Email Phishing as finished in your Learning Library.'}</p></div></div>
                </div>
              )}
            </div>

            <footer className="email-lesson-footer">
              <button className="lesson-secondary" type="button" disabled={emailLessonStep === 0} onClick={() => setEmailLessonStep((current) => Math.max(0, current - 1))}>‹ PREVIOUS</button>
              <div><span>LEARNING PROGRESS</span><strong>{lessonProgressPercent}%</strong></div>
              <button className="lesson-primary" type="button" disabled={!currentLessonStepComplete} onClick={advanceEmailLesson}>{emailLessonStep === 3 ? (emailLessonComplete ? 'FINISH REVIEW' : 'COMPLETE MODULE') : 'CONTINUE'} <span>›</span></button>
            </footer>
          </section>
        </div>
      )}

      {smsLessonOpen && (
        <div className="email-lesson-backdrop sms-lesson-backdrop">
          <section className="email-lesson-modal universal-lesson sms-lesson-modal" role="dialog" aria-modal="true" aria-labelledby="sms-lesson-title">
            <header className="email-lesson-header sms-lesson-header">
              <div>
                <span className="lesson-kicker">UNIVERSAL TRAINING MODULE // SMS PHISHING</span>
                <h2 id="sms-lesson-title">SMS PHISHING AWARENESS</h2>
              </div>
              <button className="lesson-close" type="button" aria-label="Close SMS training and return to the game" onClick={() => setSmsLessonOpen(false)}>×</button>
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
                  <div className="completion-callout sms-completion-callout"><span>✓</span><div><strong>MODULE READY TO COMPLETE</strong><p>{smsLessonComplete ? 'You have reviewed the complete SMS Phishing training module again.' : 'Complete the module to mark SMS Phishing as finished in your Learning Library.'}</p></div></div>
                </div>
              )}
            </div>

            <footer className="email-lesson-footer sms-lesson-footer">
              <button className="lesson-secondary" type="button" disabled={smsLessonStep === 0} onClick={() => setSmsLessonStep((current) => Math.max(0, current - 1))}>‹ PREVIOUS</button>
              <div><span>LEARNING PROGRESS</span><strong>{smsProgressPercent}%</strong></div>
              <button className="lesson-primary" type="button" disabled={!smsCurrentStepComplete} onClick={advanceSmsLesson}>{smsLessonStep === 3 ? (smsLessonComplete ? 'FINISH REVIEW' : 'COMPLETE MODULE') : 'CONTINUE'} <span>›</span></button>
            </footer>
          </section>
        </div>
      )}

      {vishingLessonOpen && (
        <div className="email-lesson-backdrop vishing-lesson-backdrop">
          <section className="email-lesson-modal universal-lesson vishing-lesson-modal" role="dialog" aria-modal="true" aria-labelledby="vishing-lesson-title">
            <header className="email-lesson-header vishing-lesson-header">
              <div>
                <span className="lesson-kicker">UNIVERSAL TRAINING MODULE // VISHING</span>
                <h2 id="vishing-lesson-title">VOICE-CALL SCAM AWARENESS</h2>
              </div>
              <button className="lesson-close" type="button" aria-label="Close Vishing training and return to the game" onClick={() => { stopVishingAudio(); setVishingLessonOpen(false) }}>×</button>
            </header>

            <div className="lesson-progress vishing-lesson-progress" aria-label={`Vishing training step ${vishingLessonStep + 1} of 5`}>
              {['TAKE THE CALL', 'CHALLENGE THE CALLER', 'SAFE CALLBACK', 'WHAT WOULD HAPPEN?', 'SUMMARY'].map((label, index) => (
                <div className={`${index === vishingLessonStep ? 'current' : ''} ${index < vishingLessonStep ? 'complete' : ''}`} key={label}>
                  <span>{index < vishingLessonStep ? '✓' : index + 1}</span><small>{label}</small>
                </div>
              ))}
            </div>

            <div className="email-lesson-content vishing-lesson-content" ref={vishingLessonContentRef}>
              {vishingLessonStep === 0 && (
                <div className="lesson-stage vishing-call-stage">
                  <div className="lesson-overview-banner vishing-overview-banner">
                    <div><span className="lesson-step-label">STEP 1 // SIX INCOMING CALLS</span><h3>Take the call: scam or legitimate?</h3></div>
                    <div className="clue-counter"><strong>{correctVishingCallCount} / {vishingCallExamples.length}</strong><span>calls classified correctly</span></div>
                    <p>Answer every fictional call, listen to the short message, and decide whether it is a scam or a legitimate business call. Caller ID alone is never proof—consider the context and requested action.</p>
                  </div>

                  <div className="vishing-call-examples">
                    {vishingCallExamples.map((example, index) => {
                      const answered = vishingCallsAnswered.has(example.id)
                      const selectedAnswer = vishingCallAnswers[example.id]
                      const isCorrect = selectedAnswer === example.isScam
                      const clipId = `take-${example.id}`
                      const isPlaying = vishingClipPlayingId === clipId && vishingCallState === 'playing'
                      return (
                        <article className="vishing-call-example" key={example.id}>
                          <header><span>CALL {index + 1} OF {vishingCallExamples.length}</span><strong>{example.device.toUpperCase()} CALL INTERFACE</strong></header>
                          <div className={`voice-call-phone compact-call-phone device-${example.device} ${isPlaying ? 'call-active' : ''}`}>
                            <div className="voice-phone-status"><span>{example.time}</span><span>▮▮▮ ᯤ ▰</span></div>
                            <div className="incoming-call-copy">
                              <small>{answered ? 'CALL CONNECTED' : 'INCOMING CALL'}</small>
                              <div className="caller-avatar"><span>{example.initials}</span><i /></div>
                              <h3>{example.caller}</h3><p>{example.number}</p>
                              <div className="call-waveform" aria-hidden="true">{Array.from({ length: 18 }, (_, barIndex) => <i key={barIndex} />)}</div>
                              <strong className="call-status">{isPlaying ? 'CALL AUDIO PLAYING' : answered ? 'CALL TRANSCRIPT AVAILABLE' : 'ANSWER TO HEAR MESSAGE'}</strong>
                            </div>
                            {!answered ? (
                              <div className="single-answer-action"><button className="answer-call" type="button" onClick={() => answerVishingCall(example)}><span>☎</span><small>ANSWER &amp; LISTEN</small></button></div>
                            ) : (
                              <div className="compact-call-controls audio-controls">
                                <button type="button" onClick={() => playVishingClip(clipId, example.transcript, undefined, 'caller', vishingTakeCallAudio[example.id])}><span>↻</span><small>REPLAY</small></button>
                                <button type="button" disabled={vishingClipPlayingId !== clipId || !['playing', 'paused'].includes(vishingCallState)} onClick={toggleVishingPause}><span>{vishingCallState === 'paused' && vishingClipPlayingId === clipId ? '▶' : 'Ⅱ'}</span><small>{vishingCallState === 'paused' && vishingClipPlayingId === clipId ? 'RESUME' : 'PAUSE'}</small></button>
                                <button className="end-call" type="button" onClick={() => stopVishingAudio('ended')}><span>☎</span><small>END</small></button>
                              </div>
                            )}
                            <div className="voice-phone-home" />
                          </div>

                          <div className={`call-classification ${answered ? 'ready' : ''}`}>
                            <span>CALL TRANSCRIPT</span><p>“{example.transcript}”</p>
                            <strong>WHAT IS YOUR DECISION?</strong>
                            <div>
                              <button type="button" disabled={!answered} className={selectedAnswer === true ? (isCorrect ? 'correct' : 'incorrect') : ''} onClick={() => setVishingCallAnswers((current) => ({ ...current, [example.id]: true }))}><span>!</span>SCAM CALL</button>
                              <button type="button" disabled={!answered} className={selectedAnswer === false ? (isCorrect ? 'correct' : 'incorrect') : ''} onClick={() => setVishingCallAnswers((current) => ({ ...current, [example.id]: false }))}><span>✓</span>LEGITIMATE CALL</button>
                            </div>
                            {selectedAnswer !== undefined && <aside className={isCorrect ? 'correct' : 'incorrect'}><strong>{isCorrect ? '✓ Correct classification' : '× Reconsider the context and request'}</strong><p>{isCorrect ? example.explanation : 'Listen again and focus on what the caller asks you to do, not merely the displayed name or number.'}</p>{isCorrect && <em>{example.signal}</em>}</aside>}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              )}

              {vishingLessonStep === 1 && (
                <div className="lesson-stage vishing-response-stage">
                  <div className="lesson-overview-banner vishing-overview-banner">
                    <div><span className="lesson-step-label">STEP 2 // INTERRUPT THE SCRIPT</span><h3>Challenge the caller safely</h3></div>
                    <div className="clue-counter"><strong>{correctVishingResponseCount} / {vishingResponseExamples.length}</strong><span>safe responses selected</span></div>
                    <p>A vishing caller wants to control the pace of the conversation. Play each caller line if you wish, then choose the response that stops the pressure and restores independent verification.</p>
                  </div>

                  <div className="vishing-response-list">
                    {vishingResponseExamples.map((example, index) => {
                      const selectedAnswer = vishingResponseAnswers[example.id]
                      const isCorrect = selectedAnswer === example.correct
                      return (
                        <article className="vishing-response-card" key={example.id}>
                          <div className="caller-clip-panel">
                            <span>CALL MOMENT {index + 1}</span>
                            <div className="caller-clip-avatar">NS</div>
                            <strong>{example.identity}</strong>
                            <small className="caller-context">{example.context}</small>
                            <p>“{example.caller}”</p>
                            <div className="caller-clip-controls audio-controls">
                              <button className="play-caller-clip" type="button" onClick={() => playVishingClip(example.id, example.caller, undefined, 'caller', vishingChallengeAudio[example.id])}>
                                <span>{vishingClipPlayingId === example.id ? '↻' : '▶'}</span>{vishingClipPlayingId === example.id ? 'REPLAY CALLER AUDIO' : 'PLAY CALLER AUDIO'}
                              </button>
                              <button className="pause-caller-clip" type="button" disabled={vishingClipPlayingId !== example.id || !['playing', 'paused'].includes(vishingCallState)} onClick={toggleVishingPause}>
                                <span>{vishingClipPlayingId === example.id && vishingCallState === 'paused' ? '▶' : 'Ⅱ'}</span>{vishingClipPlayingId === example.id && vishingCallState === 'paused' ? 'RESUME' : 'PAUSE'}
                              </button>
                            </div>
                          </div>
                          <div className="caller-response-panel">
                            <span>YOUR RESPONSE</span><h3>{example.prompt}</h3>
                            <div className="caller-response-options">
                              {example.options.map((option, optionIndex) => {
                                const selected = selectedAnswer === optionIndex
                                const answerClass = selected ? (optionIndex === example.correct ? 'correct' : 'incorrect') : ''
                                return <button className={`caller-response-option ${selected ? 'selected' : ''} ${answerClass}`} type="button" key={option} aria-pressed={selected} onClick={() => setVishingResponseAnswers((current) => ({ ...current, [example.id]: optionIndex }))}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>
                              })}
                            </div>
                            {selectedAnswer !== undefined && <div className={`vishing-answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}><strong>{isCorrect ? '✓ Conversation control restored' : '× The caller still controls the verification path'}</strong><p>{isCorrect ? example.explanation : 'Try again. Choose the response that ends the unverified interaction or returns to an approved company process.'}</p></div>}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              )}

              {vishingLessonStep === 2 && (
                <div className="lesson-stage vishing-callback-stage">
                  <div className="lesson-overview-banner vishing-overview-banner">
                    <div><span className="lesson-step-label">STEP 3 // TAKE BACK CONTROL</span><h3>Build the safe callback sequence</h3></div>
                    <div className="clue-counter"><strong>{vishingCallbackSequence.length} / {correctVishingCallbackSequence.length}</strong><span>steps placed</span></div>
                    <p>An independent callback is more than asking the caller for a number. The available actions are deliberately shuffled—select them in the safest order, then reset and try again if necessary.</p>
                  </div>

                  <div className="callback-lab">
                    <section className="callback-action-bank">
                      <span>AVAILABLE ACTIONS</span>
                      <div>
                        {vishingCallbackActions.map((action) => (
                          <button type="button" disabled={vishingCallbackSequence.includes(action.id)} key={action.id} onClick={() => addVishingCallbackAction(action.id)}>
                            <span>{action.icon}</span><div><strong>{action.title}</strong><small>{action.description}</small></div><i>＋</i>
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="callback-sequence-panel">
                      <header><span>YOUR VERIFICATION ROUTE</span><button type="button" onClick={() => setVishingCallbackSequence([])} disabled={vishingCallbackSequence.length === 0}>RESET SEQUENCE</button></header>
                      <div className="callback-sequence">
                        {correctVishingCallbackSequence.map((_, index) => {
                          const selectedAction = vishingCallbackActions.find((action) => action.id === vishingCallbackSequence[index])
                          return selectedAction
                            ? <button className="filled" type="button" key={`callback-slot-${index}`} aria-label={`Remove ${selectedAction.title} from position ${index + 1}`} onClick={() => removeVishingCallbackAction(selectedAction.id)}><span>{index + 1}</span><div><strong>{selectedAction.title}</strong><small>{selectedAction.description}</small></div><i>×</i></button>
                            : <div key={`callback-slot-${index}`}><span>{index + 1}</span><em>Select the next action</em></div>
                        })}
                      </div>
                      {vishingCallbackSequence.length === correctVishingCallbackSequence.length && (
                        <div className={`callback-result ${vishingCallbackComplete ? 'correct' : 'incorrect'}`}>
                          <span>{vishingCallbackComplete ? '✓' : '×'}</span><div><strong>{vishingCallbackComplete ? 'SAFE CALLBACK BUILT' : 'SEQUENCE NEEDS ANOTHER LOOK'}</strong><p>{vishingCallbackComplete ? 'You ended the attacker-controlled contact path, found a trusted number independently, verified the issue, and reported the attempt.' : 'The new call must use independently sourced contact details, and the suspicious attempt should still be reported.'}</p></div>
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              )}

              {vishingLessonStep === 3 && (
                <div className="lesson-stage vishing-conversation-stage">
                  <div className="lesson-overview-banner vishing-overview-banner">
                    <div><span className="lesson-step-label">STEP 4 // SIX DECISION CONVERSATION</span><h3>What would happen if you stayed on the call?</h3></div>
                    <div className="clue-counter"><strong>{vishingConversationChoices.length} / {vishingConversationStages.length}</strong><span>decisions completed</span></div>
                    <p>Follow a realistic bank-impersonation call through six moments. Every choice changes the caller’s next response and contributes to the final business outcome. There is no instant correction—observe the consequence at the end.</p>
                  </div>

                  <div className={`conversation-score-strip ${vishingConversationComplete ? '' : 'locked'}`} aria-label="Conversation decision score">
                    <div className="safe"><span>✓</span><strong>{vishingConversationComplete ? vishingDecisionCounts.safe : '—'}</strong><small>SAFE DECISIONS</small></div>
                    <div className="uncertain"><span>?</span><strong>{vishingConversationComplete ? vishingDecisionCounts.uncertain : '—'}</strong><small>UNCERTAIN DECISIONS</small></div>
                    <div className="risky"><span>!</span><strong>{vishingConversationComplete ? vishingDecisionCounts.risky : '—'}</strong><small>RISKY DECISIONS</small></div>
                    <button type="button" disabled={vishingConversationPhase === 'idle'} onClick={resetVishingConversation}>RESTART CONVERSATION</button>
                  </div>

                  <div className="dual-phone-conversation">
                    <div className="conversation-phone scammer-conversation-phone">
                      <div className="conversation-phone-status"><span>9:52</span><span>▮▮▮ ᯤ ▰</span></div>
                      <header><div className="conversation-avatar">HB</div><strong>Harbour Bank Security</strong><small>Caller identity unverified</small></header>
                      <div className="scammer-call-visual">
                        <span>{vishingConversationPhaseLabel}</span>
                        <div className={`caller-radar ${vishingConversationAudioActive ? 'active' : ''}`}><i /><i /><i /><strong>☎</strong></div>
                        <h3>{vishingConversationComplete ? 'CALL COMPLETE' : `MOMENT ${vishingConversationStageIndex + 1} OF ${vishingConversationStages.length}`}</h3>
                        <p>{vishingConversationPhase === 'idle'
                          ? 'An unverified caller is waiting. Answer the simulated call to hear their first request.'
                          : vishingConversationPhase === 'participant'
                            ? vishingConversationChoices.at(-1)?.text
                            : vishingConversationPhase === 'reply' || vishingConversationComplete
                              ? vishingConversationChoices.at(-1)?.reply
                              : currentVishingConversationStage.caller}</p>
                        {vishingConversationPhase === 'idle' ? (
                          <button className="answer-training-call" type="button" onClick={startVishingConversation}><span>☎</span>ANSWER CALL</button>
                        ) : (
                          <div className="conversation-call-controls">
                            <button type="button" disabled={!vishingConversationAudioActive || !['playing', 'paused'].includes(vishingCallState)} onClick={toggleVishingPause}>
                              <span>{vishingCallState === 'paused' ? '▶' : 'Ⅱ'}</span>{vishingCallState === 'paused' ? 'RESUME CALL' : 'PAUSE CALL'}
                            </button>
                            <small>{vishingConversationAudioActive ? 'AUDIO IN PROGRESS' : vishingConversationComplete ? 'TRAINING CALL ENDED' : 'WAITING FOR YOUR RESPONSE'}</small>
                          </div>
                        )}
                      </div>
                      <div className="voice-phone-home" />
                    </div>

                    <div className="conversation-phone user-conversation-phone">
                      <div className="conversation-phone-status"><span>9:52</span><span>▮▮▮ ᯤ ▰</span></div>
                      <header><span>◉</span><div><strong>Unknown caller</strong><small>{vishingConversationPhaseLabel}</small></div><span>ⓘ</span></header>
                      <div className="user-call-visual">
                        <div className={`user-call-avatar ${vishingConversationAudioActive ? 'active' : ''}`}>?</div>
                        <strong>{vishingConversationPhase === 'idle' ? 'Incoming call' : 'Call connected'}</strong>
                        <small>{vishingConversationPhase === 'idle' ? 'Harbour Bank Security (unverified)' : vishingConversationPhaseLabel}</small>
                        <div className={`user-call-waveform ${vishingConversationAudioActive && vishingCallState !== 'paused' ? 'active' : ''}`} aria-hidden="true"><i /><i /><i /><i /><i /></div>
                        {vishingConversationPhase === 'idle' ? (
                          <button className="answer-training-call user-answer-call" type="button" onClick={startVishingConversation}><span>☎</span>ANSWER CALL</button>
                        ) : (
                          <button className="user-pause-call" type="button" disabled={!vishingConversationAudioActive || !['playing', 'paused'].includes(vishingCallState)} onClick={toggleVishingPause}><span>{vishingCallState === 'paused' ? '▶' : 'Ⅱ'}</span>{vishingCallState === 'paused' ? 'RESUME AUDIO' : 'PAUSE AUDIO'}</button>
                        )}
                      </div>
                      <div className="conversation-thread voice-call-transcript" aria-live="polite">
                        <small>LIVE ACCESSIBLE CALL TRANSCRIPT</small>
                        {vishingConversationChoices.map((choice) => {
                          const stage = vishingConversationStages[choice.stageIndex]
                          const showReply = choice.stageIndex < vishingConversationStageIndex || ['reply', 'complete'].includes(vishingConversationPhase)
                          return (
                            <div className="conversation-exchange" key={stage.id}>
                              <p className="caller-bubble"><span>CALLER</span>{stage.caller}</p>
                              <p className={`user-bubble ${choice.type}`}><span>YOU</span>{choice.text}</p>
                              {showReply && <p className="caller-bubble reply"><span>CALLER RESPONSE</span>{choice.reply}</p>}
                            </div>
                          )
                        })}
                        {vishingConversationPhase !== 'idle' && !vishingConversationChoices.some((choice) => choice.stageIndex === vishingConversationStageIndex) && (
                          <p className="caller-bubble current"><span>CALLER</span>{currentVishingConversationStage.caller}</p>
                        )}
                        {vishingConversationPhase === 'idle' && <p className="transcript-placeholder">Answer the training call to begin the transcript.</p>}
                      </div>
                      <div className="voice-phone-home" />
                    </div>
                  </div>

                  {!vishingConversationComplete ? (
                    <section className={`conversation-decision-panel ${vishingConversationPhase !== 'choosing' ? 'locked' : ''}`} aria-live="polite">
                      <span>DECISION {vishingConversationStageIndex + 1} OF {vishingConversationStages.length}</span>
                      <h3>How do you respond?</h3>
                      <p>{vishingConversationPhase === 'idle'
                        ? 'Answer the call first. Your choices will unlock after the caller finishes speaking.'
                        : vishingConversationPhase === 'choosing'
                          ? 'The caller has finished. Choose a response; it will be spoken aloud before the caller continues.'
                          : vishingConversationPhase === 'participant'
                            ? 'Your selected response is being spoken to the caller.'
                            : 'Listen to the complete caller line. Response choices unlock only when the audio finishes.'}</p>
                      <div>
                        {(vishingConversationOptionOrders[vishingConversationStageIndex] ?? [0, 1, 2]).map((optionIndex) => currentVishingConversationStage.options[optionIndex]).map((option, optionIndex) => (
                          <button type="button" disabled={vishingConversationPhase !== 'choosing'} key={option.text} onClick={() => chooseVishingConversationOption(option)}><span>{String.fromCharCode(65 + optionIndex)}</span>{option.text}</button>
                        ))}
                      </div>
                      {vishingConversationPhase !== 'choosing' && <div className="conversation-choice-lock"><span>▣</span>{vishingConversationAudioActive ? 'LISTENING REQUIRED — OPTIONS LOCKED' : 'ANSWER THE CALL TO UNLOCK OPTIONS'}</div>}
                    </section>
                  ) : (
                    <section className={`conversation-outcome ${vishingConversationOutcome.tone}`}>
                      <div><span>{vishingConversationOutcome.tone === 'safe' ? '✓' : vishingConversationOutcome.tone === 'risky' ? '!' : '?'}</span><div><small>FINAL CALL OUTCOME</small><h3>{vishingConversationOutcome.title}</h3><strong>{vishingConversationOutcome.impact}</strong></div></div>
                      <p>{vishingConversationOutcome.explanation}</p>
                      <aside><strong>WHAT TO REMEMBER</strong><p>A caller’s response to resistance is useful evidence. Legitimate organisations should allow you to stop, verify independently, and follow normal company procedures.</p></aside>
                    </section>
                  )}
                </div>
              )}

              {vishingLessonStep === 4 && (
                <div className="lesson-stage summary-stage vishing-summary-stage">
                  <div className="lesson-overview-banner summary-banner vishing-overview-banner">
                    <div><span className="lesson-step-label">STEP 5 // VISHING SUMMARY</span><h3>Stop the call. Verify through a channel you trust.</h3></div>
                    <p>Vishing is phishing conducted through a voice call. A convincing voice, caller ID, job title, or knowledge of company details does not prove identity—including when synthetic or cloned audio may be involved.</p>
                  </div>
                  <div className="summary-principles vishing-summary-principles">
                    <article><span>01</span><strong>NOTICE THE PRESSURE</strong><p>Be cautious when a caller creates urgency, fear, secrecy, authority, or a reason to avoid normal procedure.</p></article>
                    <article><span>02</span><strong>PROTECT SECRETS</strong><p>Never disclose passwords, one-time codes, card details, or approve an unexpected authentication request.</p></article>
                    <article><span>03</span><strong>CALL BACK SAFELY</strong><p>End the call and start a new one using a number from a trusted directory, known app, card, or official website.</p></article>
                    <article><span>04</span><strong>REPORT QUICKLY</strong><p>Report the claimed identity, request, time, and number so the organisation can warn others and investigate.</p></article>
                  </div>
                  <section className="summary-impact vishing-summary-impact">
                    <div><span className="lesson-step-label">HOW VISHING CAN REDUCE COMPANY FUNDS</span><h3>A voice call can trigger real business costs</h3><p>The simulation’s funds meter represents the total harm caused by a successful call, not simply money handed directly to the caller.</p></div>
                    <div className="summary-impact-grid">
                      <article><strong>UNAUTHORISED PAYMENTS</strong><p>Impersonation can pressure staff into changing payment details or approving a fraudulent transaction.</p></article>
                      <article><strong>ACCOUNT ACCESS</strong><p>Shared codes or approved prompts can expose email, cloud systems, and company information.</p></article>
                      <article><strong>INCIDENT RESPONSE</strong><p>Teams may need to secure accounts, inspect activity, contact affected people, and restore access.</p></article>
                      <article><strong>DISRUPTION &amp; TRUST</strong><p>Paused services, delayed work, customer support, and reputational damage can increase the total cost.</p></article>
                    </div>
                  </section>
                  <section className="learning-resources vishing-learning-resources">
                    <div><span className="lesson-step-label">CONTINUE LEARNING</span><h3>Official Australian guidance</h3><p>Use these resources for current advice about phone scams, phishing, and reporting suspicious calls.</p></div>
                    <div className="resource-links">
                      <a href="https://www.acma.gov.au/phone-and-sms-scams" target="_blank" rel="noreferrer"><strong>ACMA — Phone and SMS scams</strong><span>Recognise and respond to scam calls ›</span></a>
                      <a href="https://www.scamwatch.gov.au/types-of-scams/phishing-scams" target="_blank" rel="noreferrer"><strong>Scamwatch — Phishing scams</strong><span>Warning signs and reporting advice ›</span></a>
                      <a href="https://www.cyber.gov.au/threats/types-threats/phishing" target="_blank" rel="noreferrer"><strong>ACSC — Phishing</strong><span>Protect accounts and organisations ›</span></a>
                      <a href="https://www.esafety.gov.au/key-topics/staying-safe/online-scams" target="_blank" rel="noreferrer"><strong>eSafety — Online scams</strong><span>Practical safety guidance ›</span></a>
                    </div>
                  </section>
                  <div className="completion-callout vishing-completion-callout"><span>✓</span><div><strong>MODULE READY TO COMPLETE</strong><p>{vishingLessonComplete ? 'You have reviewed the complete Vishing training module again.' : 'Complete the module to mark Vishing as finished in your Learning Library.'}</p></div></div>
                </div>
              )}
            </div>

            <footer className="email-lesson-footer vishing-lesson-footer">
              <button className="lesson-secondary" type="button" disabled={vishingLessonStep === 0} onClick={() => {
                stopVishingAudio(vishingLessonStep === 1 ? 'incoming' : 'idle')
                if (vishingLessonStep === 3) {
                  setVishingConversationChoices([])
                  setVishingConversationStageIndex(0)
                  setVishingConversationPhase('idle')
                }
                setVishingLessonStep((current) => Math.max(0, current - 1))
              }}>‹ PREVIOUS</button>
              <div><span>LEARNING PROGRESS</span><strong>{vishingProgressPercent}%</strong></div>
              <button className="lesson-primary" type="button" disabled={!vishingCurrentStepComplete} onClick={advanceVishingLesson}>{vishingLessonStep === 4 ? (vishingLessonComplete ? 'FINISH REVIEW' : 'COMPLETE MODULE') : 'CONTINUE'} <span>›</span></button>
            </footer>
          </section>
        </div>
      )}

      {settingsOpen && (
        <div className="settings-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSettingsOpen(false)
        }}>
          <section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="audio-settings-title">
            <header className="settings-modal-header">
              <div>
                <span className="section-kicker">GAME OPTIONS</span>
                <h2 id="audio-settings-title">AUDIO SETTINGS</h2>
              </div>
              <button className="settings-close" type="button" aria-label="Close settings without saving" onClick={() => setSettingsOpen(false)}>×</button>
            </header>

            <div className="settings-group">
              <div className="setting-row setting-toggle-row">
                <div><strong>BACKGROUND MUSIC</strong><small>Play Max Brhon – Cyberpunk during gameplay.</small></div>
                <button className={`setting-switch ${draftAudioSettings.musicEnabled ? 'active' : ''}`} type="button" role="switch" aria-checked={draftAudioSettings.musicEnabled} onClick={() => updateDraftAudioSetting('musicEnabled', !draftAudioSettings.musicEnabled)}><span /></button>
              </div>
              <label className={`setting-row slider-row ${!draftAudioSettings.musicEnabled ? 'disabled' : ''}`}>
                <span><strong>MUSIC VOLUME</strong><output>{draftAudioSettings.musicVolume}%</output></span>
                <input type="range" min="0" max="100" step="1" value={draftAudioSettings.musicVolume} disabled={!draftAudioSettings.musicEnabled} onChange={(event) => updateDraftAudioSetting('musicVolume', Number(event.target.value))} />
              </label>
              <div className="setting-row setting-toggle-row compact">
                <div><strong>LOOP MUSIC</strong><small>Restart the track automatically when it ends.</small></div>
                <button className={`setting-switch ${draftAudioSettings.loopMusic ? 'active' : ''}`} type="button" role="switch" aria-checked={draftAudioSettings.loopMusic} onClick={() => updateDraftAudioSetting('loopMusic', !draftAudioSettings.loopMusic)}><span /></button>
              </div>
              <div className="setting-row setting-toggle-row compact">
                <div><strong>LOWER MUSIC DURING NARRATION</strong><small>Temporarily lowers music while the scenario voice is speaking.</small></div>
                <button className={`setting-switch ${draftAudioSettings.duckDuringNarration ? 'active' : ''}`} type="button" role="switch" aria-checked={draftAudioSettings.duckDuringNarration} onClick={() => updateDraftAudioSetting('duckDuringNarration', !draftAudioSettings.duckDuringNarration)}><span /></button>
              </div>
            </div>

            <div className="settings-group">
              <div className="setting-row setting-toggle-row">
                <div><strong>INTERFACE SOUND EFFECTS</strong><small>Play a short sound when interface buttons are selected.</small></div>
                <button className={`setting-switch ${draftAudioSettings.soundEffectsEnabled ? 'active' : ''}`} type="button" role="switch" aria-checked={draftAudioSettings.soundEffectsEnabled} onClick={() => updateDraftAudioSetting('soundEffectsEnabled', !draftAudioSettings.soundEffectsEnabled)}><span /></button>
              </div>
              <label className={`setting-row slider-row ${!draftAudioSettings.soundEffectsEnabled ? 'disabled' : ''}`}>
                <span><strong>EFFECTS VOLUME</strong><output>{draftAudioSettings.soundEffectsVolume}%</output></span>
                <input type="range" min="0" max="100" step="1" value={draftAudioSettings.soundEffectsVolume} disabled={!draftAudioSettings.soundEffectsEnabled} onChange={(event) => updateDraftAudioSetting('soundEffectsVolume', Number(event.target.value))} />
              </label>
              <p className="settings-note">Scenario Play, Pause, Replay and Mute controls intentionally do not use interface sound effects.</p>
            </div>

            <div className="music-credit">
              <strong>NOW PLAYING</strong>
              <span>Max Brhon – Cyberpunk [NCS Release] • Music provided by NoCopyrightSounds</span>
            </div>

            <footer className="settings-modal-footer">
              <button className="settings-cancel" type="button" onClick={() => setSettingsOpen(false)}>CANCEL</button>
              <button className="settings-save" type="button" onClick={saveAudioSettings}>SAVE OPTIONS</button>
            </footer>
          </section>
        </div>
      )}
    </main>
  )
}

export default Gameplay
