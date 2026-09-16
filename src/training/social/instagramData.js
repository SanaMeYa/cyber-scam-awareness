export const instagramInspectionExamples = [
  {
    id: 'giveaway-winner',
    tag: '🎁 Case 1',
    type: 'The "You Won an iPhone / $1000" DM',
    subheading: 'Fake Brand Contest Phishing',
    profileName: 'solstice_giveaways_official_',
    handle: '@solstice_giveaways_official_',
    avatar: 'SG',
    avatarBg: '#db2777',
    avatarColor: '#ffffff',
    verifiedBadge: false,
    stats: { posts: '0', followers: '14', following: '3,840' },
    meta: 'Created 3 days ago • Not followed by anyone you know',
    storyActive: true,
    chatHistory: [
      { sender: 'them', time: '8:42 PM', text: '🎉 CONGRATULATIONS! You were randomly selected as our 1st Place Grand Winner for the 2026 Tech Creators Pack (iPhone 16 Pro + $500 Apple Gift Card)!' },
      { sender: 'them', time: '8:43 PM', text: 'To claim your prize pack before midnight, click the official link in our bio (claim-solstice-prize.xyz) and sign in with your Instagram account to verify your delivery address!' },
      { sender: 'them', time: '8:44 PM', text: 'Hurry! If you do not claim within 30 minutes, we will re-roll a new winner!' }
    ],
    hotspots: [
      { id: 'insta-handle-spoof', label: 'Lookalike Handle with Underscores', targetText: '@solstice_giveaways_official_', title: '🚨 Fake Lookalike Account', explanation: 'Scammers add extra underscores, dots, or "official_" to impersonate real brands.', teenTip: 'Real brands have a blue verified badge and won\'t have numbers or extra symbols in their handle.' },
      { id: 'insta-follow-ratio', label: 'Suspicious Follower Ratio', targetText: '0 posts • 14 followers • following 3,840', title: '🚨 Bot Follower Imbalance', explanation: 'A profile with almost zero followers following thousands of accounts is an automated scam account.', teenTip: 'Always tap their profile to check their posts and account history.' },
      { id: 'insta-bio-link', label: 'Suspicious Phishing Link', targetText: 'claim-solstice-prize.xyz', title: '🚨 Credential Phishing Portal', explanation: 'The link opens a fake Instagram login page designed to steal your password and 2FA authentication codes.', teenTip: 'Never enter your Instagram password on any site opened from a DM link.' },
      { id: 'insta-urgency', label: '30-Minute Panic Countdown', targetText: 'Hurry! If you do not claim within 30 minutes', title: '🚨 Artificial Urgency Trigger', explanation: 'The fake countdown stops you from asking friends or checking the real brand\'s official website.', teenTip: 'Contests that force you to act in minutes are always fraudulent.' }
    ]
  },
  {
    id: 'copyright-infringement',
    tag: '⚠️ Case 2',
    type: 'The "Account Ban / Copyright Violation" Threat',
    subheading: 'Meta Support Impersonation',
    profileName: 'Meta Help Desk Resolution',
    handle: '@meta_copyright_appeals_case99',
    avatar: 'MC',
    avatarBg: '#2563eb',
    avatarColor: '#ffffff',
    verifiedBadge: false,
    stats: { posts: '1', followers: '62', following: '890' },
    meta: 'Direct Message • Support Request Flag',
    storyActive: false,
    chatHistory: [
      { sender: 'them', time: '2:15 PM', text: '⚠️ NOTICE OF INTELLECTUAL PROPERTY INFRINGEMENT: Your Instagram account has violated copyright policies in your recent posts/reels.' },
      { sender: 'them', time: '2:16 PM', text: 'If you believe this is an error, submit an appeal immediately at meta-appeals-support.cc/login or your account will be PERMANENTLY DISABLED within 24 hours.' },
      { sender: 'them', time: '2:17 PM', text: 'Do not reply to this message directly. Use the verification portal.' }
    ],
    hotspots: [
      { id: 'insta-dm-support', label: 'Support DMing You', targetText: 'Direct Message • Support Request Flag', title: '🚨 Instagram Never DMs Support Warnings', explanation: 'Meta/Instagram communicates official copyright or policy violations only via in-app Settings > Support Requests, NEVER via direct messages.', teenTip: 'If an account called "Meta Support" DMs you, block and report it immediately.' },
      { id: 'insta-threat-ban', label: 'Threat of 24h Permanent Deletion', targetText: 'PERMANENTLY DISABLED within 24 hours', title: '🚨 Fear-Based Manipulation', explanation: 'Fear of losing your followers, memories, and photos causes panic so you click before inspecting the URL.', teenTip: 'Take a breath: real policy appeals give full documentation in your app settings.' },
      { id: 'insta-fake-appeal-domain', label: 'Sketchy Fake Domain (.cc)', targetText: 'meta-appeals-support.cc/login', title: '🚨 Fake Login Trap', explanation: 'The domain uses an obscure extension (.cc) rather than instagram.com or meta.com.', teenTip: 'Look at the address bar: if it does not say instagram.com, do not type anything!' }
    ]
  },
  {
    id: 'crypto-ambassador',
    tag: '💎 Case 3',
    type: 'The "Help Me Vote / Send My 2FA Link" Trick',
    subheading: 'Account Hijack & Relay Trap',
    profileName: 'Chloe Bennett (Friend Profile)',
    handle: '@chloe_bennett_private',
    avatar: 'CB',
    avatarBg: '#9333ea',
    avatarColor: '#ffffff',
    verifiedBadge: false,
    stats: { posts: '85', followers: '840', following: '720' },
    meta: 'Account recently compromised • DM sent to all mutuals',
    storyActive: true,
    chatHistory: [
      { sender: 'them', time: '6:10 PM', text: 'Heyy! Can you do me a huge quick favor? I am competing in an online influencer ambassador contest and need 2 more votes to win!' },
      { sender: 'them', time: '6:11 PM', text: 'Instagram is going to send an SMS link to your phone number to verify your vote. Can you screenshot the link and send it back to me here so my vote counts? 🙏' },
      { sender: 'them', time: '6:12 PM', text: 'It only takes 5 seconds please!' }
    ],
    hotspots: [
      { id: 'insta-vote-lure', label: 'Ambassador Contest Hook', targetText: 'competing in an online influencer ambassador contest', title: '🚨 Classic Hijacking Bait', explanation: 'Scammers take over one friend\'s account and immediately DM everyone on their friend list with this fake voting story.', teenTip: 'Your friend didn\'t send this—an automated hacker who stole their account is typing.' },
      { id: 'insta-sms-relay', label: 'Asking for Your SMS Security Link', targetText: 'send an SMS link to your phone... screenshot the link and send it back', title: '🚨 2FA Hijacking / Account Theft', explanation: 'The SMS link is actually YOUR OWN password reset or two-factor link generated by the hacker attempting to log in to YOUR account.', teenTip: 'The moment you send that screenshot or code, the hacker takes over YOUR Instagram account!' }
    ]
  }
]

export const instagramComparisonExamples = [
  {
    id: 'brand-contest',
    title: 'Brand Giveaway Notification',
    prompt: 'You receive a DM saying you won a shopping spree contest.',
    correct: 'b',
    explanation: 'Scenario B looks for the official verified badge, public story announcements, and never asks for your login credentials.',
    scenarios: {
      a: {
        tag: '❌ RISKY MOVE',
        sender: 'Click DM link from @brand_giveaway_official_',
        meta: 'Lookalike unverified profile with 20 followers',
        message: '“Click here to log into your account and claim your $500 voucher!”',
        outcome: '💀 YOU GET HACKED: You enter your username and password into their fake page. Hackers lock you out and post crypto spam on your story.',
        isCorrect: false
      },
      b: {
        tag: '🛡️ DEFENSIVE PRO-MOVE',
        sender: 'Check Verified Brand Profile & Rules',
        meta: 'Official blue-badged brand page with millions of followers',
        message: '“Official brands announce winners in tagged posts and never ask for passwords or login links.”',
        outcome: '🎉 ACCOUNT PROTECTED: You spot the fake account, report it to Instagram, and keep your login credentials 100% secure.',
        isCorrect: true
      }
    }
  },
  {
    id: 'friend-2fa-vote',
    title: 'Friend Asks for a "Vote Link / SMS Code"',
    prompt: 'A friend DMs you: "Instagram sent a code to your phone to help me vote in an ambassador contest, send it to me!"',
    correct: 'a',
    explanation: 'Scenario A recognizes that the code is actually your own account recovery token and refuses to share it.',
    scenarios: {
      a: {
        tag: '🛡️ DEFENSIVE PRO-MOVE',
        sender: 'Refuse to Share Code + Call Friend',
        meta: 'Never screenshot or forward security codes',
        message: '“Do NOT forward that text. Call your friend on Snapchat/phone to tell them they got hacked.”',
        outcome: '🎉 ATTACK FOILED: You prevented the hacker from taking over your account and alerted your friend to recover theirs.',
        isCorrect: true
      },
      b: {
        tag: '❌ RISKY MOVE',
        sender: 'Screenshot SMS & Send in DM',
        meta: 'Sending your own password reset link',
        message: '“Sure, here is the screenshot of the text message I just got!”',
        outcome: '💀 ACCOUNT STOLEN: The hacker clicks the password reset link in the screenshot, changes your email, and locks you out forever.',
        isCorrect: false
      }
    }
  }
]

export const instagramSummaryData = {
  riskLevel: 'CRITICAL',
  badgeTitle: 'Instagram Security Guardian',
  coreTactic: 'Fake Giveaways, Copyright Fear & 2FA SMS Hijacking',
  bestPractice: 'Never share SMS security codes with anyone and never click login links sent inside DMs.',
  teenRules: [
    { emoji: '🔑', title: 'The Golden 2FA Rule', text: 'NEVER screenshot or send an SMS code to anyone—even your closest friend. That code is the key to YOUR account.' },
    { emoji: '🚫', title: 'Support Never DMs', text: 'Instagram will never send copyright strikes or account deletion notices in your DMs. Official notices are always inside Settings.' },
    { emoji: '🔵', title: 'Look for the Blue Check', text: 'Real brands and influencers have official verified badges. Always look for spelling errors, extra numbers, or weird follower ratios.' }
  ]
}

