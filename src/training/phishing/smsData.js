export const smsWarningExamples = [
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

export const smsManipulationExamples = [
  { id: 'manipulation-urgency', label: 'Parcel expires', message: 'Pay the $2.15 redelivery fee in the next 20 minutes or your parcel will be returned.', correct: 'urgency', explanation: 'The short deadline is designed to reduce careful checking and push an immediate response.' },
  { id: 'manipulation-fear', label: 'Account threatened', message: 'Your bank account is being emptied. Call our security line now or you will be responsible for the loss.', correct: 'fear', explanation: 'The message creates fear of financial loss so the recipient reacts before verifying the alert.' },
  { id: 'manipulation-authority', label: 'Executive request', message: 'This is the CEO. Approve the authentication prompt now so I can access the board presentation.', correct: 'authority', explanation: 'The sender claims senior authority to make the recipient feel they should comply without questioning the request.' },
  { id: 'manipulation-reward', label: 'Unexpected reward', message: 'Your business number has been selected for a $500 technology rebate. Claim it before today’s allocation closes.', correct: 'reward', explanation: 'An unexpected reward creates excitement and curiosity, making the link feel more tempting.' },
  { id: 'manipulation-payroll', label: 'Payroll instruction', message: 'Payroll Manager: Complete the new salary verification form before your shift ends. This instruction has executive approval.', correct: 'authority', explanation: 'The message borrows authority from a senior role and claimed executive approval to discourage questions.' },
  { id: 'manipulation-credit', label: 'Loyalty credit', message: 'Good news—your company account qualifies for a surprise $320 service credit. Only a few allocations remain.', correct: 'reward', explanation: 'The promised credit combines reward and curiosity so the recipient focuses on claiming it rather than verifying it.' },
]

export const manipulationChoices = [
  { id: 'urgency', icon: '◷', title: 'URGENCY', description: 'Act before time runs out' },
  { id: 'fear', icon: '!', title: 'FEAR', description: 'Prevent a threatened loss' },
  { id: 'authority', icon: '◆', title: 'AUTHORITY', description: 'Obey someone important' },
  { id: 'reward', icon: '★', title: 'REWARD / CURIOSITY', description: 'Gain something unexpected' },
]

export const smsSafeRouteExamples = [
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


export const totalSmsClues = smsWarningExamples.reduce((total, example) => total + example.clues.length, 0)
