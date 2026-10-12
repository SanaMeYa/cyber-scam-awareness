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
      { id: 'insta-follow-ratio', label: 'Suspicious Follower Ratio', targetText: '0 posts • 14 followers • following 3,840', title: '🚨 Bot-Like Account Pattern', explanation: 'Almost no content combined with thousands of followed accounts is consistent with newly created mass-messaging profiles.', teenTip: 'Review the profile’s content and history, but treat these details as warning signs rather than proof on their own.' },
      { id: 'insta-bio-link', label: 'Suspicious Phishing Link', targetText: 'claim-solstice-prize.xyz', title: '🚨 Credential Phishing Portal', explanation: 'The link opens a fake Instagram login page designed to steal your password and 2FA authentication codes.', teenTip: 'Never enter your Instagram password on any site opened from a DM link.' },
      { id: 'insta-urgency', label: '30-Minute Panic Countdown', targetText: 'Hurry! If you do not claim within 30 minutes', title: '🚨 Artificial Urgency Trigger', explanation: 'The countdown discourages you from checking the real brand’s official profile, website and contest terms.', teenTip: 'Do not let a deadline prevent independent verification; genuine terms should be available through official channels.' }
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
    { emoji: '🔵', title: 'Verification Is One Signal', text: 'A badge can add context but is not enough by itself. Check the exact handle, account history and links against the organisation’s official website.' }
  ]
}

export const instagramVerificationChallenges = [
  {
    id: 'ig-verify-giveaway', category: 'FAKE GIVEAWAY', title: 'A brand account says you won',
    context: 'An unverified account with a familiar logo says you won a prize. It links to a login page and gives you thirty minutes to claim it.',
    question: 'What provides the strongest evidence that the giveaway and winner notification are genuine?', correct: 'official-rules',
    options: [
      { id: 'logo', label: 'COMPARE THE LOGO', text: 'Proceed if the logo and colours match the real brand.', feedback: 'Logos and brand artwork are public and easy to copy. Appearance does not prove account ownership.' },
      { id: 'followers', label: 'CHECK FOLLOWERS', text: 'Proceed if the account has some real-looking followers and comments.', feedback: 'Followers, comments and likes can be purchased or copied. They are weak evidence on their own.' },
      { id: 'official-rules', label: 'CHECK THE OFFICIAL ACCOUNT', text: 'Open the verified brand profile yourself and locate the original contest rules and winner process.', feedback: 'You independently confirm whether the contest exists and how the real brand contacts winners without using the DM link.' },
      { id: 'open-link', label: 'PREVIEW THE LINK', text: 'Open the link but leave immediately if the page looks unusual.', feedback: 'Opening an untrusted link creates unnecessary risk, and convincing phishing pages may look identical to the real login page.' },
    ],
  },
  {
    id: 'ig-verify-support', category: 'SUPPORT IMPERSONATION', title: 'A copyright warning threatens deletion',
    context: 'A profile calling itself Meta Help Desk says your account will be permanently disabled unless you appeal through a link in its DM.',
    question: 'Where should you check whether Instagram has actually taken action against your account?', correct: 'account-status',
    options: [
      { id: 'reply', label: 'REPLY TO SUPPORT', text: 'Ask the profile to provide your case number and the reported post.', feedback: 'An impersonator can invent case details. You are still relying on the identity being questioned.' },
      { id: 'account-status', label: 'USE INSTAGRAM SETTINGS', text: 'Open Instagram directly and check Account Status or Support Requests in your settings.', feedback: 'Official in-app account status separates genuine platform notices from profiles pretending to be support.' },
      { id: 'search-name', label: 'SEARCH THE USERNAME', text: 'Trust it if search results show other support accounts with similar names.', feedback: 'Scam networks often create many similar accounts. Search volume does not establish legitimacy.' },
      { id: 'friend-opinion', label: 'ASK A FRIEND', text: 'Send a screenshot to a friend and proceed if they think it looks professional.', feedback: 'A second opinion helps, but official in-app records are much stronger evidence.' },
    ],
  },
  {
    id: 'ig-verify-friend', category: 'COMPROMISED FRIEND', title: 'A friend asks for your security code',
    context: 'A real friend’s account asks you to forward a link or code sent to your phone so they can receive a vote in a contest.',
    question: 'How do you verify the person and protect both accounts?', correct: 'call-friend',
    options: [
      { id: 'old-photo', label: 'ASK ABOUT A PHOTO', text: 'Ask who took one of the older photos on their profile.', feedback: 'A person controlling the account can see its posts and messages. Profile knowledge is not independent verification.' },
      { id: 'call-friend', label: 'CONTACT THEM ELSEWHERE', text: 'Do not share the code. Call or message your friend using a separate, previously established channel.', feedback: 'This confirms whether the account is compromised while keeping your recovery token private.' },
      { id: 'partial-code', label: 'SHARE PART OF IT', text: 'Send only the first half of the code so they can prove what it is for.', feedback: 'Security codes should never be shared. Partial information can still help an attacker manipulate you or complete another step.' },
      { id: 'dm-call', label: 'CALL INSIDE INSTAGRAM', text: 'Use Instagram’s call button on the same account to verify them.', feedback: 'This is better than text, but the suspicious account controls the channel and may decline, delay or use synthetic media. A separate saved channel is stronger.' },
    ],
  },
]

export const instagramResponseScenario = {
  title: 'Protect your account from a code-relay scam',
  introduction: 'A compromised friend account tries to turn your trust into access to your own profile. Decide how you respond as the pressure increases.',
  profile: { profileName: 'Chloe Bennett', handle: '@chloe_bennett_private', avatar: 'CB', avatarBg: '#9333ea', avatarColor: '#ffffff' },
  turns: [
    {
      id: 'ig-response-1', time: '6:10 PM', message: 'Heyy, can you help me win an ambassador contest? I only need one more vote and it takes like five seconds.',
      prompt: 'The request comes from a real friend’s account. What do you do?',
      options: [
        { id: 'verify', label: 'VERIFY FIRST', action: 'Call Chloe using her saved phone number before doing anything.', reply: 'Yeah maybe, but I’m gonna call you first—this message feels a bit random.', risk: 0, resultTitle: 'Trust is checked outside the account', feedback: 'A legitimate-looking profile can still be compromised. A separate channel tests who is actually in control.' },
        { id: 'details', label: 'ASK FOR DETAILS', action: 'Ask for the contest name and voting page before deciding.', reply: 'What contest is it? Send me the official public page first.', risk: 12, resultTitle: 'You slow the attack but stay engaged', feedback: 'Questions create time to think, but the attacker can send a convincing fake page and continue the manipulation.' },
        { id: 'agree', label: 'AGREE TO HELP', action: 'Follow the instructions because the account belongs to your friend.', reply: 'Sure, tell me what I need to do.', risk: 30, resultTitle: 'The attacker gains cooperation', feedback: 'Account ownership was assumed from appearance, giving the attacker an opening to request security information.' },
      ],
    },
    {
      id: 'ig-response-2', time: '6:11 PM', message: 'Instagram will text you a voting link. Screenshot the whole message and send it here so your vote counts.',
      prompt: 'A security message arrives on your phone. What is the safest response?',
      options: [
        { id: 'keep-private', label: 'KEEP IT PRIVATE', action: 'Do not share it. Read the security message and check your own login activity.', reply: 'Nah, that message is for my account. I’m not sending the link or code to anyone.', risk: 0, resultTitle: 'Your recovery token stays private', feedback: 'Security messages normally say not to share them. Checking your own account activity reveals whether someone initiated a login or reset.' },
        { id: 'hide-code', label: 'CROP THE SCREENSHOT', action: 'Hide the numeric code but send the rest of the message.', reply: 'I’ll hide the code and send you the rest so you can check it.', risk: 18, resultTitle: 'Sensitive context is still exposed', feedback: 'Links, usernames and recovery details can also be sensitive. There is no legitimate reason to send any part of the security message.' },
        { id: 'send-shot', label: 'SEND THE SCREENSHOT', action: 'Forward the full message so your friend gets the vote.', reply: 'Got it. Sending the screenshot now.', risk: 45, resultTitle: 'Account recovery is handed to the attacker', feedback: 'The message is connected to your account, not a contest. Sharing it may let the attacker reset your password and lock you out.' },
      ],
    },
    {
      id: 'ig-response-3', time: '6:13 PM', message: 'Why don’t you trust me? The round closes right now. Please send it and delete the chat after.',
      prompt: 'The account adds guilt, urgency and secrecy. How do you finish?',
      options: [
        { id: 'secure-report', label: 'SECURE AND REPORT', action: 'Check active sessions, enable MFA, report the account and warn Chloe elsewhere.', reply: 'I’ve confirmed this isn’t you. I’m securing my account and reporting these messages.', risk: 0, resultTitle: 'Both the account and network are protected', feedback: 'Security checks contain any attempted access, while reporting and warning the real owner reduce further victimisation.' },
        { id: 'ignore', label: 'IGNORE THE CHAT', action: 'Stop replying but take no additional action.', reply: 'I’m not sending anything. Bye.', risk: 10, resultTitle: 'The immediate request fails', feedback: 'You avoid sharing the code, but the compromised account can continue targeting followers until it is reported and recovered.' },
        { id: 'delete', label: 'DELETE THE EVIDENCE', action: 'Delete the conversation because it feels uncomfortable.', reply: 'Fine, I’m deleting this conversation.', risk: 25, resultTitle: 'Useful evidence disappears', feedback: 'Deleting first can remove details that would help report the account and explain the compromise to the real owner.' },
      ],
    },
  ],
  outcomes: {
    safe: { title: 'Account takeover prevented', text: 'You treated the security message as private, verified your friend elsewhere and contained the compromised profile.' },
    mixed: { title: 'Your code stayed private, but risk remains', text: 'You resisted the central request, although delayed reporting or partial engagement left the attacker with more opportunity.' },
    risky: { title: 'Recovery access was exposed', text: 'Trust in the compromised profile allowed the attacker to turn an account-recovery message into an account takeover.' },
  },
}

