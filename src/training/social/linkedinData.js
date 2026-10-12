export const linkedinInspectionExamples = [
  {
    id: 'fake-recruiter',
    tag: '💼 Case 1',
    type: 'The "$100/hr Remote Student Job" Scam',
    subheading: 'Fake Recruiter & Identity Theft Lure',
    profileName: 'Harper Wells (Global Tech Recruiter)',
    handle: 'harper-wells-talent-fasttrack',
    avatar: 'HW',
    avatarBg: '#0284c7',
    avatarColor: '#ffffff',
    verifiedBadge: false,
    meta: 'Joined LinkedIn 1 month ago • 120 connections • Free webmail in bio',
    roleHighlight: 'Remote Data / AI Annotation Assistant ($95 - $140/hr)',
    chatHistory: [
      { sender: 'them', time: '10:20 AM', text: 'Hello! I reviewed your profile and your background is an exceptional match for an immediate remote Junior AI Analyst role paying $95/hour.' },
      { sender: 'them', time: '10:21 AM', text: 'Because of urgent project deadlines, we are skipping live video interviews and hiring directly based on your resume.' },
      { sender: 'them', time: '10:22 AM', text: 'To secure your spot and receive your company MacBook Pro + home office stipend check, fill out our fast-track intake form: talent-onboard-solstice.net/direct-deposit (requires SSN/Tax ID & Direct Deposit banking details).' }
    ],
    hotspots: [
      { id: 'li-too-good-comp', label: 'Unrealistic $95/hr Entry Wage', targetText: '$95 - $140/hr • Skipping live video interviews', title: '🚨 Inflated Salary Bait', explanation: 'High pay for basic entry-level work with zero interview rounds is engineered to make job seekers ignore basic red flags.', teenTip: 'Real internships and entry-level jobs conduct formal video or in-person interviews.' },
      { id: 'li-early-banking-req', label: 'Demanding SSN & Bank Details', targetText: 'requires SSN/Tax ID & Direct Deposit banking details', title: '🚨 Synthetic Identity Fraud Trap', explanation: 'Legitimate employers never ask for your bank account or Social Security Number before an official offer letter is signed through a verified HR portal.', teenTip: 'Never give your bank details or tax ID on a Google Form or random website.' },
      { id: 'li-unverified-intake', label: 'Lookalike Website (.net domain)', targetText: 'talent-onboard-solstice.net/direct-deposit', title: '🚨 Fake Company Domain', explanation: 'The URL uses a secondary domain (.net) not connected to the real company.', teenTip: 'Always search the official company careers page directly on Google.' }
    ]
  },
  {
    id: 'vendor-survey-payload',
    tag: '📎 Case 2',
    type: 'The "Enable Macros" Technical Challenge',
    subheading: 'Malware & Trojan Attachment Drop',
    profileName: 'Elena Rostova (Lead Talent Partner)',
    handle: 'elena-rostova-hiring-direct',
    avatar: 'ER',
    avatarBg: '#0f766e',
    avatarColor: '#ffffff',
    verifiedBadge: false,
    meta: 'Head of Talent Acquisition • 500+ connections',
    roleHighlight: 'Mandatory Technical Assessment (.xlsm / macro file)',
    chatHistory: [
      { sender: 'them', time: '4:10 PM', text: 'Thanks for connecting! We are ready to move you to the next round of our paid student fellowship.' },
      { sender: 'them', time: '4:11 PM', text: 'Please download our assessment spreadsheet attached: "Solstice_Skills_Assessment_2026.xlsm".' },
      { sender: 'them', time: '4:12 PM', text: '⚠️ IMPORTANT: When Excel opens, you MUST click "Enable Editing" and "Enable Content / Macros" or your score will not submit to our database.' }
    ],
    hotspots: [
      { id: 'li-macro-workbook', label: 'Macro-Enabled File (.xlsm)', targetText: 'Solstice_Skills_Assessment_2026.xlsm', title: '🚨 Dangerous Macro-Enabled File', explanation: '.xlsm files contain embedded executable code (VBA macros) that can install spyware and keystroke loggers on your computer.', teenTip: 'Never enable macros on a document downloaded from social media or email!' },
      { id: 'li-enable-macros', label: 'Coaching You to Disable Security', targetText: 'MUST click "Enable Editing" and "Enable Content / Macros"', title: '🚨 Security Bypass Coaching', explanation: 'Office restricts active content because it can execute code. An unverified recruiter coaching you around that protection is a critical warning sign.', teenTip: 'Do not bypass a security warning for an unexpected file. Verify the assessment with the employer through an official channel.' }
    ]
  },
  {
    id: 'executive-synergy',
    tag: '🕶️ Case 3',
    type: 'The "Move to Telegram / Secret Crypto Project" Lure',
    subheading: 'Off-Platform Executive Infiltration',
    profileName: 'Arthur Sterling (C-Level Executive)',
    handle: 'arthur-sterling-executive-ventures',
    avatar: 'AS',
    avatarBg: '#334155',
    avatarColor: '#ffffff',
    verifiedBadge: false,
    meta: 'Managing Partner • Stock photo avatar • Minimal mutual network',
    roleHighlight: 'Confidential Investment / Startup Advisory Opportunity',
    chatHistory: [
      { sender: 'them', time: '1:15 PM', text: 'Hello. I noticed your interest in tech and web development. I am quietly launching an exclusive stealth startup and looking for sharp, ambitious young talent to join early.' },
      { sender: 'them', time: '1:16 PM', text: 'Because of confidentiality agreements with our venture fund, let’s move our conversation off LinkedIn immediately. Message my private Telegram: @SterlingVentureAlpha.' }
    ],
    hotspots: [
      { id: 'li-move-telegram', label: 'Pushing to Telegram / WhatsApp', targetText: 'move our conversation off LinkedIn immediately... Telegram: @SterlingVentureAlpha', title: '🚨 Off-Platform Evasion', explanation: 'Moving you to Telegram deletes evidence and bypasses LinkedIn\'s spam detection filters, leading into pig-butchering or fake crypto investments.', teenTip: 'Legitimate business leaders communicate through official corporate email, not anonymous Telegram handles.' },
      { id: 'li-confidential-bait', label: 'Vague Stealth Secrecy Hook', targetText: 'exclusive stealth startup... confidentiality agreements', title: '🚨 Flattery & Exclusivity Hook', explanation: 'Appealing to ambition and ego makes young professionals feel special and lowers their guard against scams.', teenTip: 'Always verify an executive by checking their verified corporate email on the company website.' }
    ]
  }
]

export const linkedinComparisonExamples = [
  {
    id: 'recruiter-outreach',
    title: 'Recruitment InMail Outreach',
    prompt: 'You receive an InMail from a recruiter offering a high-paying internship.',
    correct: 'a',
    explanation: 'Scenario A applies through official company portals with verified corporate email domains and transparent interview processes.',
    scenarios: {
      a: {
        tag: '🛡️ DEFENSIVE PRO-MOVE',
        sender: 'Apply via Official Company Careers Page',
        meta: 'Verified corporate domain (careers.solstice.com)',
        message: '“I will apply directly through the official Req # on your corporate website and schedule an interview through your official HR portal.”',
        outcome: '🎉 SAFE CAREER MOVE: You protect your personal identity and apply through legitimate corporate hiring channels.',
        isCorrect: true
      },
      b: {
        tag: '❌ RISKY MOVE',
        sender: 'Send Bank & SSN on Random Google Form / Telegram',
        meta: 'Unverified InMail promising instant hiring',
        message: '“Filling out the direct deposit form now so I can receive my equipment check!”',
        outcome: '💀 IDENTITY THEFT: Scammers open fraudulent credit cards in your name and send a fake check that bounces, costing you thousands.',
        isCorrect: false
      }
    }
  },
  {
    id: 'inmail-attachment',
    title: 'Recruiter Sends Macro Assessment Spreadsheet',
    prompt: 'A recruiter sends an Excel file (.xlsm) and tells you to enable macros to see the test.',
    correct: 'b',
    explanation: 'Scenario B refuses to run macro-enabled files from unverified strangers and requests standard PDF or web-based assessments.',
    scenarios: {
      a: {
        tag: '❌ RISKY MOVE',
        sender: 'Download .xlsm & Click "Enable Content / Macros"',
        meta: 'Bypassing Office security warnings',
        message: '“Enabling macros now so the test calculation script can run!”',
        outcome: '💀 SYSTEM COMPROMISED: A silent infostealer Trojan installs in the background, harvesting all your saved browser passwords and cookies.',
        isCorrect: false
      },
      b: {
        tag: '🛡️ DEFENSIVE PRO-MOVE',
        sender: 'Never Enable Macros + Ask for PDF / Web Test',
        meta: 'Strict security hygiene for downloads',
        message: '“I do not enable macros on downloaded files. Please provide the assessment via standard PDF or web assessment portal.”',
        outcome: '🎉 DEVICE PROTECTED: You blocked the malware payload from executing and protected your entire system.',
        isCorrect: true
      }
    }
  }
]

export const linkedinSummaryData = {
  riskLevel: 'HIGH',
  badgeTitle: 'LinkedIn Cyber Scout',
  coreTactic: 'Fake Remote Jobs, Macro Malware & Telegram Funneling',
  bestPractice: 'Always verify recruiters on official company websites and never enable macros on downloaded attachments.',
  teenRules: [
    { emoji: '💼', title: 'Real Jobs Interview Live', text: 'No real company pays $100/hr without an interview. If they hire you in 5 minutes via text, it is an identity theft scam.' },
    { emoji: '🛡️', title: 'Do Not Bypass File Protections', text: 'Treat an unexpected assessment that requires active content or scripts as high risk. Verify it with the employer and request an official portal or safer format.' },
    { emoji: '🏢', title: 'Verify the Employer Independently', text: 'A matching corporate domain is useful evidence, but confirm the vacancy and recruiter through the company’s careers site or published contact details.' }
  ]
}

export const linkedinVerificationChallenges = [
  {
    id: 'li-verify-recruiter', category: 'FAKE RECRUITER', title: 'A recruiter offers unusually high pay',
    context: 'The recruiter claims your profile is an exceptional match, skips interviews and asks for banking and identity information through a separate onboarding site.',
    question: 'What is the strongest way to confirm that the recruiter and vacancy are genuine?', correct: 'company-directory',
    options: [
      { id: 'connections', label: 'CHECK CONNECTIONS', text: 'Trust the recruiter if they have hundreds of connections and several endorsements.', feedback: 'Connections and endorsements can be accumulated, purchased or inherited through a compromised account.' },
      { id: 'company-directory', label: 'VERIFY WITH THE COMPANY', text: 'Find the vacancy on the official careers site and contact HR through the company’s published domain or switchboard.', feedback: 'This independently confirms the vacancy, recruiter and application process without using links supplied by the profile.' },
      { id: 'video', label: 'REQUEST A VIDEO CALL', text: 'Proceed if the recruiter appears on camera and discusses the role confidently.', feedback: 'A call adds context but is not definitive: the person may not represent the company, and synthetic or stolen media can be used.' },
      { id: 'document', label: 'ASK FOR AN OFFER', text: 'Proceed once the recruiter sends a professional-looking offer letter.', feedback: 'Logos, signatures and offer templates are easy to copy. Confirm the vacancy and sender through an official channel.' },
    ],
  },
  {
    id: 'li-verify-assessment', category: 'MALICIOUS ATTACHMENT', title: 'An assessment requires enabled macros',
    context: 'A supposed recruiter sends a macro-enabled spreadsheet and says the assessment cannot be scored unless you enable editing and content.',
    question: 'What response verifies the assessment without risking your device?', correct: 'official-portal',
    options: [
      { id: 'scan', label: 'RUN AN ANTIVIRUS SCAN', text: 'Download the file and open it if your antivirus reports no threat.', feedback: 'New or obfuscated malware may not be detected. A clean scan does not make an unexpected macro safe.' },
      { id: 'sandbox', label: 'USE A SPARE DEVICE', text: 'Open it on another personal device so your main computer is protected.', feedback: 'The spare device and any accounts used on it can still be compromised. Avoid executing the untrusted file.' },
      { id: 'official-portal', label: 'REQUEST A VERIFIED FORMAT', text: 'Contact the company independently and request the assessment through its official recruitment portal or a non-executable format.', feedback: 'This verifies the hiring process and removes the need to bypass built-in document protections.' },
      { id: 'view-only', label: 'OPEN READ-ONLY', text: 'Open the file but refuse to enable macros unless the questions look legitimate.', feedback: 'Previewing unexpected files still adds risk, and convincing content does not prove the embedded code is safe.' },
    ],
  },
  {
    id: 'li-verify-executive', category: 'EXECUTIVE IMPERSONATION', title: 'An executive invites you to a secret venture',
    context: 'A sparse executive profile uses flattery and confidentiality to move you immediately to Telegram for an investment or advisory opportunity.',
    question: 'Which check best establishes whether the executive initiated the conversation?', correct: 'corporate-contact',
    options: [
      { id: 'photo-search', label: 'REVERSE-SEARCH THE PHOTO', text: 'Proceed if the portrait does not appear on stock-photo sites.', feedback: 'This can expose stolen images, but a unique or generated portrait still does not verify the person or opportunity.' },
      { id: 'premium', label: 'CHECK PREMIUM STATUS', text: 'Trust the profile if it has Premium features and a detailed biography.', feedback: 'Paid features and copied biographies are not identity proof.' },
      { id: 'corporate-contact', label: 'USE CORPORATE CONTACT DETAILS', text: 'Locate the executive through the organisation’s official website and verify the approach using its published contact information.', feedback: 'A channel controlled by the real organisation can confirm whether the person and opportunity exist.' },
      { id: 'telegram-call', label: 'CALL ON TELEGRAM', text: 'Move platforms but insist on a live call before discussing money.', feedback: 'The account directing you to Telegram controls that channel too. Keep verification independent of the approach.' },
    ],
  },
]

export const linkedinResponseScenario = {
  title: 'Test a high-pressure recruitment approach',
  introduction: 'A convincing recruiter progressively requests more sensitive information. Decide where you verify, what you disclose and how you report the approach.',
  profile: { profileName: 'Harper Wells', handle: 'Global Tech Recruiter', avatar: 'HW', avatarBg: '#0284c7', avatarColor: '#ffffff' },
  turns: [
    {
      id: 'li-response-1', time: '10:20 AM', message: 'Your background is a great match for an urgent remote AI role paying $95 an hour. We are fast-tracking candidates today.',
      prompt: 'The role is attractive but unexpectedly generous. What do you do first?',
      options: [
        { id: 'official-search', label: 'VERIFY THE VACANCY', action: 'Search the company’s official careers page for the role and reference number.', reply: 'Thanks. I’ll review the vacancy on your company careers page and apply through the official portal.', risk: 0, resultTitle: 'The opportunity is tested independently', feedback: 'A genuine vacancy should be traceable through the employer’s official recruitment process.' },
        { id: 'profile-review', label: 'REVIEW THE PROFILE', action: 'Inspect the recruiter’s work history, connections and activity before responding.', reply: 'I’ll check your LinkedIn history and the company page first.', risk: 12, resultTitle: 'Useful context, but not independent proof', feedback: 'Profile research may reveal warning signs, but compromised and fabricated accounts can still appear established.' },
        { id: 'accept', label: 'ACCEPT THE FAST TRACK', action: 'Respond immediately so another candidate does not take the position.', reply: 'I’m interested and available now. Send me the fast-track steps.', risk: 28, resultTitle: 'Scarcity controls the pace', feedback: 'The attacker learns you are responsive to urgency and can escalate to information or payment requests.' },
      ],
    },
    {
      id: 'li-response-2', time: '10:23 AM', message: 'We’re skipping interviews. Complete this onboarding form with your tax ID and bank details so payroll can reserve your position.',
      prompt: 'The recruiter requests sensitive details before a verified interview or offer. How do you respond?',
      options: [
        { id: 'refuse-verify', label: 'REFUSE AND VERIFY', action: 'Do not open the form; call the company through its official switchboard.', reply: 'I don’t provide identity or banking details before a verified offer. I’ll contact HR through the company website.', risk: 0, resultTitle: 'Sensitive information stays protected', feedback: 'Legitimate onboarding follows verified interviews and formal offers through controlled HR systems.' },
        { id: 'limited-info', label: 'SHARE BASIC DETAILS', action: 'Complete only the non-banking fields to show interest.', reply: 'I can provide my address and ID details now, but I’ll leave the banking section blank.', risk: 22, resultTitle: 'Identity data is still exposed', feedback: 'Names, addresses, birth details and document numbers can support identity fraud even without banking information.' },
        { id: 'complete', label: 'COMPLETE THE FORM', action: 'Provide everything because payroll needs it before issuing equipment.', reply: 'Done—I’ve submitted my tax and banking details.', risk: 45, resultTitle: 'Identity and financial data are compromised', feedback: 'The fake onboarding page captures information that can be used for account fraud and targeted follow-up attacks.' },
      ],
    },
    {
      id: 'li-response-3', time: '10:27 AM', message: 'For confidentiality, move to Telegram and purchase the laptop from our approved supplier. We will reimburse you with your first pay.',
      prompt: 'The approach moves off-platform and introduces an upfront purchase. How do you close it?',
      options: [
        { id: 'report-company', label: 'REPORT AND NOTIFY', action: 'Preserve the messages, report the profile and notify the impersonated company’s security or recruitment team.', reply: 'I will only use verified company channels. I’m reporting this profile and notifying the organisation it is impersonating.', risk: 0, resultTitle: 'The campaign is escalated to defenders', feedback: 'Reporting protects other job seekers and gives the impersonated organisation evidence to respond.' },
        { id: 'decline', label: 'DECLINE ONLY', action: 'Politely decline and disconnect without making a report.', reply: 'No thanks, I’m no longer interested in the role.', risk: 10, resultTitle: 'You exit, but the profile continues', feedback: 'You avoid the transaction, but the fake recruiter remains able to target other candidates.' },
        { id: 'buy', label: 'PURCHASE THE EQUIPMENT', action: 'Use the supplier because reimbursement is promised in writing.', reply: 'Okay, send the supplier link and I’ll order the laptop today.', risk: 38, resultTitle: 'The fake-job payment trap succeeds', feedback: 'The supplier is controlled by the scammer, or the reimbursement uses a fraudulent payment that will later be reversed.' },
      ],
    },
  ],
  outcomes: {
    safe: { title: 'Recruitment scam contained', text: 'You verified through the employer, protected sensitive data and reported the impersonation before anyone paid.' },
    mixed: { title: 'You exited, but shared avoidable information', text: 'The largest loss was prevented, although profile-only checks or delayed reporting left residual identity and campaign risk.' },
    risky: { title: 'Fake recruitment became identity fraud', text: 'High pay and artificial urgency moved the process outside normal hiring controls and exposed personal or financial information.' },
  },
}

