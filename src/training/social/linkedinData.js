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
      { id: 'li-enable-macros', label: 'Coaching You to Disable Security', targetText: 'MUST click "Enable Editing" and "Enable Content / Macros"', title: '🚨 Security Bypass Coaching', explanation: 'Windows and Microsoft Office block macros by default to protect you. Scammers specifically coach you to bypass this defense.', teenTip: 'If a stranger tells you to bypass security warnings, it is 100% malicious.' }
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
    { emoji: '🛡️', title: 'Never Enable Macros', text: 'Legitimate interview assessments never require enabling macros (.xlsm) or running scripts on your personal computer.' },
    { emoji: '🏢', title: 'Check the Corporate Domain', text: 'Real recruiters email from @companyname.com, never free Gmail, Outlook, or Telegram handles.' }
  ]
}

