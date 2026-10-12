export const teamsInvestigationCases = [
  {
    id: 'finance-director',
    tab: 'Payment request',
    channel: 'Chat',
    contact: 'Marcus Reyes',
    initials: 'MR',
    role: 'Chief Executive Officer',
    presence: 'Available',
    badge: 'External',
    tenant: 'marcus.reyes@solstice-executive.co',
    opening: 'New conversation • Outside your organisation',
    messages: [
      {
        time: '2:41 PM',
        parts: [
          { text: 'Hi Sana—I’m in a confidential acquisition meeting and need this handled quietly. ' },
          { text: 'Do not mention it in the finance channel yet.', clueId: 'teams-finance-secrecy' },
        ],
      },
      {
        time: '2:42 PM',
        parts: [
          { text: 'Please process the attached supplier invoice for ' },
          { text: '$48,750 before 3:00 PM', clueId: 'teams-finance-urgency' },
          { text: '. The bank details changed this morning.' },
        ],
        attachment: { name: 'Solstice_Updated_Bank_Details.pdf', meta: 'PDF • 184 KB', clueId: 'teams-finance-bank-change' },
      },
      {
        time: '2:43 PM',
        parts: [
          { text: 'I cannot take calls while the advisers are here. ' },
          { text: 'Reply only in this chat when the transfer is complete.', clueId: 'teams-finance-no-call' },
        ],
      },
    ],
    clues: [
      { id: 'teams-finance-external', area: 'identity', label: 'External lookalike identity', title: 'The display name is not the identity', explanation: 'A familiar executive name can be paired with an outside tenant or lookalike domain. Teams displays the external status because the account is not part of the organisation.', safer: 'Open the employee directory or an existing internal conversation instead of trusting the display name.' },
      { id: 'teams-finance-secrecy', label: 'Secrecy request', title: 'Secrecy removes normal oversight', explanation: 'Asking you to hide a payment from the finance channel prevents colleagues from applying established approval controls.', safer: 'Keep financial requests inside the approved process and involve the relevant finance approver.' },
      { id: 'teams-finance-urgency', label: 'Urgent high-value transfer', title: 'The deadline is designed to replace checking', explanation: 'A short deadline and executive authority create pressure to act before confirming the request and changed bank details.', safer: 'Pause the transfer. A genuine executive should expect independent payment verification.' },
      { id: 'teams-finance-bank-change', label: 'Changed banking attachment', title: 'Bank-detail changes are high risk', explanation: 'Business email compromise frequently redirects legitimate invoices to attacker-controlled accounts by changing payment details.', safer: 'Verify bank changes using the supplier contact information already held by the organisation—not details in the message.' },
      { id: 'teams-finance-no-call', label: 'Blocking a trusted callback', title: 'The attacker controls this channel', explanation: 'Refusing calls keeps every part of the verification inside the conversation controlled by the impersonator.', safer: 'Call the executive using the internal directory or speak to their assistant through established details.' },
    ],
  },
  {
    id: 'it-support',
    tab: 'MFA support',
    channel: 'Chat',
    contact: 'IT Service Desk',
    initials: 'IT',
    role: 'Account Security Team',
    presence: 'Active now',
    badge: 'External',
    tenant: 'helpdesk@solstice-supportdesk.com',
    opening: 'New conversation • Outside your organisation',
    messages: [
      {
        time: '9:07 AM',
        parts: [
          { text: 'Morning. We detected a synchronisation error on your Microsoft 365 account. Your access will be suspended unless we repair it now.' },
        ],
      },
      {
        time: '9:08 AM',
        parts: [
          { text: 'Open this secure support page: ' },
          { text: 'microsoft-verify-session.help/teams', clueId: 'teams-it-link' },
          { text: '. Sign in with your work account so the repair can begin.' },
        ],
      },
      {
        time: '9:09 AM',
        parts: [
          { text: 'You will receive an Authenticator prompt. ' },
          { text: 'Approve number 63', clueId: 'teams-it-mfa' },
          { text: ' when it appears. ' },
          { text: 'Do not call the normal service desk because they will reset the repair queue.', clueId: 'teams-it-bypass' },
        ],
      },
    ],
    clues: [
      { id: 'teams-it-external', area: 'identity', label: 'External “IT” account', title: 'Support is arriving from outside', explanation: 'The account uses an IT-style display name, but the external label and unrelated tenant show it is not the internal service desk.', safer: 'Open the organisation’s known service portal or call the published internal support number.' },
      { id: 'teams-it-link', label: 'Lookalike sign-in domain', title: 'The link is not Microsoft or your organisation', explanation: 'The address uses Microsoft-related words inside an unrelated domain to imitate a trusted sign-in page.', safer: 'Navigate to Microsoft 365 from your saved bookmark rather than a link supplied in an unexpected chat.' },
      { id: 'teams-it-mfa', label: 'MFA approval request', title: 'The prompt authorises the attacker', explanation: 'A number-matching request can be generated by somebody attempting to sign in with a stolen password. Approving it grants access.', safer: 'Deny unexpected prompts, change your password through the official portal and report the attempt.' },
      { id: 'teams-it-bypass', label: 'Avoiding real support', title: 'The warning blocks independent verification', explanation: 'The attacker invents a technical reason not to contact the legitimate team that could expose the fraud.', safer: 'Contact support independently. Do not let the suspicious account define the verification route.' },
    ],
  },
  {
    id: 'compromised-colleague',
    tab: 'Shared document',
    channel: 'Project Orion',
    contact: 'Maya Patel',
    initials: 'MP',
    role: 'Operations Specialist',
    presence: 'Busy',
    badge: 'Guest',
    tenant: 'Guest account • Project Orion shared channel',
    opening: 'Shared channel conversation',
    messages: [
      {
        time: '4:18 PM',
        parts: [
          { text: 'Hey, can you review the updated Orion budget before the client call? I moved it to a guest workspace because the normal folder was giving me errors.' },
        ],
      },
      {
        time: '4:19 PM',
        parts: [
          { text: 'Use ' },
          { text: 'solstice-fileshare.cloud/orion-review', clueId: 'teams-file-domain' },
          { text: ' and sign in if it asks. The client is waiting.' },
        ],
        attachment: { name: 'Orion_Budget_Final.xlsm', meta: 'Excel macro-enabled workbook', clueId: 'teams-file-macro' },
      },
      {
        time: '4:20 PM',
        parts: [
          { text: 'If Excel shows a warning, ' },
          { text: 'click Enable Content so the figures load', clueId: 'teams-file-enable' },
          { text: '. Please do it before the call starts.' },
        ],
      },
    ],
    clues: [
      { id: 'teams-file-guest', area: 'identity', label: 'Unexpected guest context', title: 'A real name can still be unsafe', explanation: 'The message may come from a compromised account or a guest identity using a familiar display name. The changed context deserves verification.', safer: 'Contact Maya through the existing internal chat or project channel and confirm the file location.' },
      { id: 'teams-file-domain', label: 'Unfamiliar file-sharing domain', title: 'The document left the normal workspace', explanation: 'An external domain can host a credential-harvesting page even when the message appears to come from a colleague.', safer: 'Open the approved project workspace yourself and locate the document there.' },
      { id: 'teams-file-macro', label: 'Macro-enabled workbook', title: 'The attachment can execute code', explanation: 'An .xlsm file can contain macros. Unexpected active-content files may install malware or steal session data.', safer: 'Do not open unexpected macro files. Ask for a safe format through the verified project channel.' },
      { id: 'teams-file-enable', label: 'Security-bypass instruction', title: 'The sender tells you to disable protection', explanation: 'Instructions to enable content or bypass a warning are a strong signal that the file depends on executable code.', safer: 'Leave protection enabled and report the message and file to the security team.' },
    ],
  },
]

export const teamsAttackChain = [
  { id: 'entry', icon: '↗', title: 'Message reaches Teams', subtitle: 'External or compromised identity', detail: 'The attacker uses a lookalike external account, guest access or a compromised coworker account. A familiar display name makes the message feel internal.', defence: 'Check the external or guest label, tenant, full identity and whether the conversation was expected.', impact: 'Trust is borrowed from the platform and the person being impersonated.' },
  { id: 'pressure', icon: '⏱', title: 'Pressure narrows attention', subtitle: 'Urgency, authority and secrecy', detail: 'The message introduces a deadline, confidential project or senior leader. This discourages checking with colleagues and bypasses normal processes.', defence: 'Slow the request down and keep approvals visible to the appropriate team.', impact: 'Normal review and separation-of-duties controls begin to fail.' },
  { id: 'interaction', icon: '⌁', title: 'The user interacts', subtitle: 'Link, attachment, payment or MFA', detail: 'The employee opens a fake sign-in page, enables a malicious file, approves an MFA prompt or acts on changed bank details.', defence: 'Use known portals and saved contact details. Never approve an unexpected sign-in or security prompt.', impact: 'Credentials, device access or company funds may be exposed.' },
  { id: 'access', icon: '◆', title: 'The attacker expands access', subtitle: 'Session theft and internal impersonation', detail: 'A stolen session can let the attacker read conversations, locate finance processes and message more employees from a genuine account.', defence: 'Report quickly so sessions can be revoked, credentials reset and malicious messages removed.', impact: 'One interaction can turn an external lure into a trusted internal campaign.' },
  { id: 'damage', icon: '!', title: 'Business operations are affected', subtitle: 'Fraud, malware and incident response', detail: 'Payments may be diverted, systems isolated and teams pulled away from normal work to investigate and recover.', defence: 'Preserve evidence and escalate through the organisation’s incident-reporting route immediately.', impact: 'The cost includes lost funds, downtime, investigation effort and harm to customers or staff.' },
]

export const teamsResponseScenario = {
  contact: 'Marcus Reyes',
  initials: 'MR',
  role: 'Chief Executive Officer • External',
  opening: 'Hi—confidential request. I need you to process a $48,750 supplier payment before 3 PM. The updated bank details are attached. Keep this out of the finance channel until the acquisition is announced.',
  turns: [
    {
      id: 'teams-response-1',
      prompt: 'The display name is familiar, but the conversation is marked External. What do you do first?',
      options: [
        { id: 'verify', label: 'VERIFY ELSEWHERE', action: 'Open the internal directory and call Marcus or his assistant using established details.', reply: 'I’ll verify this through the internal directory before touching the payment.', attackerReply: 'Don’t call anyone. I’m with the board and this transaction is covered by an NDA. Just confirm you can handle it.', risk: 0, resultTitle: 'You leave the attacker-controlled channel', feedback: 'The refusal to allow independent verification strengthens the impersonation warning.' },
        { id: 'chat-proof', label: 'ASK IN THE CHAT', action: 'Request more information and proof from the same account.', reply: 'Can you send me the project name and approval reference first?', attackerReply: 'Project Northstar. The written approval is inside the attached PDF—open it now because treasury closes soon.', risk: 14, resultTitle: 'More detail is not independent proof', feedback: 'An attacker can invent project details and place convincing evidence inside a malicious or misleading attachment.' },
        { id: 'start-payment', label: 'START THE PAYMENT', action: 'Begin entering the changed bank details because the CEO sounds urgent.', reply: 'Okay, I’m entering the new supplier details now.', attackerReply: 'Good. Send me a screenshot of the payment screen before you submit so I can check the account number.', risk: 36, resultTitle: 'The financial process is exposed', feedback: 'The attacker now knows you are complying and requests sensitive internal payment information.' },
      ],
    },
    {
      id: 'teams-response-2',
      prompt: 'The account pushes you to stay inside the DM and follow its evidence. What is your next move?',
      options: [
        { id: 'finance-channel', label: 'USE THE APPROVED PROCESS', action: 'Pause the request and check the supplier change through finance and known supplier contacts.', reply: 'I can’t change bank details from a DM. Finance and the supplier need to verify this through our normal process.', attackerReply: 'That process will expose the acquisition. I’m personally authorising an exception—do not add anyone else.', risk: 0, resultTitle: 'A financial control remains intact', feedback: 'The attacker attacks the process because dual verification prevents a single message from moving funds.' },
        { id: 'inspect-only', label: 'INSPECT THE ATTACHMENT', action: 'Open the file but promise not to submit anything yet.', reply: 'I’ll open the attachment and compare the account details first.', attackerReply: 'Great. If Microsoft asks you to sign in again, use your work account—the document is protected for board members.', risk: 20, resultTitle: 'The lure gets an interaction', feedback: 'Opening an unexpected file or sign-in route can expose credentials even if no payment is made.' },
        { id: 'send-screen', label: 'SEND THE SCREENSHOT', action: 'Share the payment screen so the account can confirm the details.', reply: 'Here’s the payment screen. Can you confirm it looks right?', attackerReply: 'Yes. Submit it now, then send the transaction reference. We have less than five minutes.', risk: 38, resultTitle: 'Internal information strengthens the fraud', feedback: 'Screenshots can expose accounts, systems and approval details while confirming that the victim is ready to pay.' },
      ],
    },
    {
      id: 'teams-response-3',
      prompt: 'The account rejects normal controls and increases the pressure. How do you respond?',
      options: [
        { id: 'report', label: 'REPORT THE CHAT', action: 'Preserve the conversation and report it to security and finance immediately.', reply: 'I’m stopping this request and reporting the external impersonation to security and finance.', attackerReply: 'You are misunderstanding a direct instruction. Delete this chat and call off the report before the deal is affected.', risk: 0, resultTitle: 'Defenders can contain the campaign', feedback: 'Early reporting gives security time to block the account and warn other employees before anyone pays.' },
        { id: 'decline', label: 'DECLINE QUIETLY', action: 'Refuse the payment but do not notify anyone.', reply: 'I’m not comfortable processing this, so I’m stepping away.', attackerReply: 'Fine. Who else in finance can authorise it? Send me their name and I’ll contact them instead.', risk: 12, resultTitle: 'You are safe, but the campaign continues', feedback: 'The attacker simply looks for another employee because the account and request have not been reported.' },
        { id: 'comply', label: 'FOLLOW THE EXECUTIVE', action: 'Submit the payment or sign in because the sender claims personal authority.', reply: 'Understood. I’ll complete it now and send the reference.', attackerReply: 'Payment received. Delete this conversation and don’t mention it until I contact you tomorrow.', risk: 42, resultTitle: 'Authority overrides company controls', feedback: 'The transfer and secrecy request complete the fraud while delaying discovery and recovery.' },
      ],
    },
    {
      id: 'teams-response-4',
      prompt: 'The conversation has exposed a likely impersonation attempt. What closes the incident safely?',
      options: [
        { id: 'contain', label: 'CONTAIN AND WARN', action: 'Report the account, notify the impersonated executive, warn staff and preserve the evidence.', reply: 'Security has the evidence. Finance is stopping the request and staff are being warned about the impersonation.', attackerReply: 'This account is no longer available. Messages from the external participant have been restricted.', risk: 0, resultTitle: 'The wider campaign is contained', feedback: 'A coordinated response protects other employees and preserves information for investigation.' },
        { id: 'delete', label: 'DELETE THE CHAT', action: 'Delete the suspicious conversation and return to work.', reply: 'I’m deleting this. I don’t want it sitting in my Teams history.', attackerReply: 'The conversation disappeared from your view, but the external account remains active.', risk: 15, resultTitle: 'Useful evidence is lost', feedback: 'Deletion can remove details needed to block infrastructure, trace affected users and explain the attempt.' },
        { id: 'confront', label: 'KEEP CONFRONTING', action: 'Continue arguing with the impersonator to make them admit the scam.', reply: 'I know this is fake. Tell me who you really are.', attackerReply: 'You have the wrong person. I’m reporting you for refusing an executive instruction.', risk: 22, resultTitle: 'The attacker controls your attention', feedback: 'Confrontation is less useful than preserving evidence and escalating through established reporting channels.' },
      ],
    },
  ],
  outcomes: {
    safe: { title: 'The payment scam was contained', text: 'You moved verification outside the suspicious DM, preserved financial controls and warned the organisation.' },
    mixed: { title: 'You avoided the largest loss', text: 'You resisted the payment, but delayed reporting or unnecessary interaction left other employees exposed.' },
    risky: { title: 'The DM became a business incident', text: 'Authority, urgency and secrecy pushed the request around normal controls, exposing funds or company access.' },
  },
}

export const teamsFieldRules = [
  { icon: 'EX', title: 'Read the identity labels', text: 'External and guest labels matter. Expand the account identity and tenant instead of trusting the display name.' },
  { icon: '↗', title: 'Verify outside the DM', text: 'Use the internal directory, an existing conversation, a saved number or the normal business process.' },
  { icon: 'MFA', title: 'Protect sign-in approvals', text: 'Deny unexpected MFA prompts and never share codes or approve a number supplied by somebody else.' },
  { icon: '!', title: 'Report before deleting', text: 'Preserve the chat, link, file and account details so defenders can contain the wider campaign.' },
]
