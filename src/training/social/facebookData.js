export const facebookInspectionExamples = [
  {
    id: 'cloned-friend',
    tag: '🔥 Case 1',
    type: 'The "Stranded Bestie" Clone',
    subheading: 'Cloned Profile & Emergency Cash Scam',
    profileName: 'Alicia Voss',
    handle: 'alicia.voss.real.98',
    avatar: 'AV',
    avatarBg: '#2563eb',
    avatarColor: '#ffffff',
    onlineStatus: 'Active 2m ago',
    mutualFriends: '42 mutual friends (mostly from school/work)',
    meta: 'Joined 2 days ago • 1 profile photo • Sent via Messenger',
    chatHistory: [
      { sender: 'them', time: '10:14 PM', text: 'Heyy!! Are you awake?? I really need your help with something crazy right now 😭' },
      { sender: 'them', time: '10:15 PM', text: 'My wallet got stolen while I was out and my banking app is locked out. Can you please send me $150 on Cash App so I can get an Uber home? I promise I will wire you $200 first thing tomorrow morning!' },
      { sender: 'them', time: '10:16 PM', text: 'Please don\'t call me rn, my mic is broken from dropping my phone. Just send to $alicia_voss_emergency 🙏' }
    ],
    hotspots: [
      { id: 'fb-cloned-account', label: 'Brand New Account', targetText: 'Joined 2 days ago • 1 profile photo', title: '🚨 Cloned Account Warning', explanation: 'Scammers download photos from real friends and create duplicate profiles with similar usernames to trick mutual friends.', teenTip: 'Always check if you are already friends with their original profile!' },
      { id: 'fb-urgent-funds', label: 'Emergency Cash Pressure', targetText: 'My wallet got stolen... send me $150 on Cash App', title: '🚨 Emotional Urgency Pressure', explanation: 'Fabricating a late-night emergency stops you from slowing down and thinking logically before sending money.', teenTip: 'Real friends won\'t get angry if you double-check before sending money.' },
      { id: 'fb-avoid-call', label: 'Blocking Independent Contact', targetText: 'Please don\'t call me rn, my mic is broken', title: '🚨 Verification Avoidance', explanation: 'An excuse that prevents you from using a previously trusted contact route keeps the scammer in control of the conversation.', teenTip: 'Leave the new profile and contact the person through a saved number or another established channel.' },
      { id: 'fb-off-platform-pay', label: 'New Payment Destination', targetText: '$alicia_voss_emergency', title: '🚨 Payment Diversion', explanation: 'Peer-to-peer transfers can be difficult to reverse, especially when sent to a newly supplied account.', teenTip: 'Verify both the person and the payment destination independently before transferring money.' }
    ]
  },
  {
    id: 'marketplace-scam',
    tag: '🏷️ Case 2',
    type: 'The "Too-Good" PS5 / Concert Ticket',
    subheading: 'Marketplace Deposit Scam',
    profileName: 'Tyler Miller Deals',
    handle: 'tyler.deals.verified',
    avatar: 'TM',
    avatarBg: '#059669',
    avatarColor: '#ffffff',
    onlineStatus: 'Active now',
    mutualFriends: '0 mutual friends',
    meta: 'Joined Marketplace this week • 0 seller reviews',
    chatHistory: [
      { sender: 'them', time: '3:30 PM', text: 'Hey! Yes, the brand new PS5 Slim + 2 controllers is still available for $220. Selling cheap because I am moving tomorrow.' },
      { sender: 'them', time: '3:31 PM', text: 'I have 6 other people messaging me right now. If you want me to hold it for you, send a $100 deposit on PayPal Friends & Family right now and I will mark it pending.' },
      { sender: 'them', time: '3:32 PM', text: 'Do NOT use Goods & Services because PayPal holds the funds for 21 days and I need moving cash today.' }
    ],
    hotspots: [
      { id: 'fb-market-price', label: 'Unrealistic Low Price', targetText: 'brand new PS5 Slim + 2 controllers is still available for $220', title: '🚨 Too-Good-To-Be-True Bait', explanation: 'Expensive electronics or sold-out tickets at unusually low prices can trigger fear of missing out and suppress careful checking.', teenTip: 'Compare normal prices and inspect the item before paying; a dramatic discount is a warning sign, not proof by itself.' },
      { id: 'fb-friends-family', label: 'Demanding Friends & Family', targetText: 'send a $100 deposit on PayPal Friends & Family', title: '🚨 Bypassing Buyer Protection', explanation: 'PayPal "Friends & Family" removes buyer protection. Scammers demand it so you cannot dispute or charge back the scam.', teenTip: 'Never use Friends & Family when buying items from strangers online!' },
      { id: 'fb-deposit-pressure', label: 'Fake Buyer Rush', targetText: 'I have 6 other people messaging me right now', title: '🚨 Artificial Scarcity Panic', explanation: 'Claiming other buyers are waiting is a classic trick to rush you into sending money before you can inspect the seller.', teenTip: 'Insist on meeting in a safe public spot (like a police station) to pay in person.' }
    ]
  },
  {
    id: 'executive-charity',
    tag: '👑 Case 3',
    type: 'The "Principal / Boss" Gift Card',
    subheading: 'Authority Impersonation Lure',
    profileName: 'Mr. Marcus Reyes (Principal)',
    handle: 'marcus.reyes.leadership',
    avatar: 'MR',
    avatarBg: '#7c3aed',
    avatarColor: '#ffffff',
    onlineStatus: 'Active 1h ago',
    mutualFriends: '3 mutual contacts',
    meta: 'Secondary profile • Solstice Academy Community',
    chatHistory: [
      { sender: 'them', time: '11:05 AM', text: 'Good morning. I am in a confidential board meeting right now and need a quick favor from an active student council / staff member.' },
      { sender: 'them', time: '11:06 AM', text: 'Could you run to the store and pick up two $100 Apple or Steam gift cards for the student recognition awards? Scratch the backs and send photos of the codes here. The school will reimburse you this afternoon.' },
      { sender: 'them', time: '11:07 AM', text: 'Keep this private until the formal assembly presentation.' }
    ],
    hotspots: [
      { id: 'fb-authority-lure', label: 'Authority Figure DM', targetText: 'Good morning. I am in a confidential board meeting', title: '🚨 Authority Figure Impersonation', explanation: 'Scammers pose as principals, teachers, or bosses to make you feel obligated to comply quickly without questioning.', teenTip: 'Schools and workplaces have official budgets; they never ask students to buy gift cards.' },
      { id: 'fb-gift-card-pay', label: 'Gift Card Code Demand', targetText: 'pick up two $100 Apple or Steam gift cards... send photos of the codes', title: '🚨 Gift Card Extortion Trap', explanation: 'Gift card codes are anonymous and untraceable. The moment a scammer gets the pin numbers, the money is drained worldwide.', teenTip: 'No legitimate organization or leader will EVER ask you to pay via gift cards!' },
      { id: 'fb-secrecy-pressure', label: 'Demanding Secrecy', targetText: 'Keep this private until the formal assembly', title: '🚨 Isolation & Secrecy Tactic', explanation: 'Telling you to keep it secret is designed to stop you from asking other teachers or parents who would immediately spot the scam.', teenTip: 'Whenever someone says "keep this secret", pause and verify with someone else.' }
    ]
  }
]

export const facebookComparisonExamples = [
  {
    id: 'friend-request',
    title: 'Friend Request & Late-Night DM',
    prompt: 'You receive an unexpected friend request and message from someone you are already friends with.',
    correct: 'b',
    explanation: 'Scenario B correctly verifies identity using a phone call or existing conversation, refusing to send money to duplicate accounts.',
    scenarios: {
      a: {
        tag: '❌ RISKY MOVE',
        sender: 'Accept New Account & Send $50 Cash App',
        meta: 'New account with your friend\'s picture',
        message: '“Hey bestie, my account was locked! Send $50 for gas on Cash App real quick!”',
        outcome: '💀 YOU GET SCAMMED: You send the money, then call your friend tomorrow only to find out their account was cloned. The $50 is gone forever.',
        isCorrect: false
      },
      b: {
        tag: '🛡️ DEFENSIVE PRO-MOVE',
        sender: 'Stop, Do NOT Send Cash, Call Real Friend',
        meta: 'Use your existing phone contact / group chat',
        message: '“Let me call your actual cell number to make sure you are safe.”',
        outcome: '🎉 SCAM CRUSHED: Your real friend answers, confirms they never made a new account, and reports the clone profile to Facebook.',
        isCorrect: true
      }
    }
  },
  {
    id: 'marketplace-deal',
    title: 'Buying Concert Tickets on Facebook Marketplace',
    prompt: 'You found sold-out concert tickets for your favorite artist listed at retail price.',
    correct: 'a',
    explanation: 'Scenario A uses protected in-person exchange or verified ticketing transfers. Scenario B sends unrecoverable Zelle deposits.',
    scenarios: {
      a: {
        tag: '🛡️ DEFENSIVE PRO-MOVE',
        sender: 'Meet at Venue Box Office / Police Exchange Zone',
        meta: 'Protected hand-off with ticket verification',
        message: '“I will pay cash or through official app only when we meet at the box office or when the ticket is transferred in Ticketmaster.”',
        outcome: '🎉 SAFE DEAL: Scammer makes an excuse and blocks you (proving they were fake), saving your hard-earned money.',
        isCorrect: true
      },
      b: {
        tag: '❌ RISKY MOVE',
        sender: 'Send $100 Zelle / Cash App Deposit Upfront',
        meta: 'Seller promises to email PDF tickets immediately',
        message: '“Sending the deposit now so you don\'t sell them to someone else!”',
        outcome: '💀 YOU GET SCAMMED: The seller blocks you immediately after payment. The PDF tickets were fake or never sent.',
        isCorrect: false
      }
    }
  }
]

export const facebookSummaryData = {
  riskLevel: 'VERY HIGH',
  badgeTitle: 'Facebook Shield Master',
  coreTactic: 'Identity Cloning & Late-Night Emergency Bait',
  bestPractice: 'Always verify unexpected money requests by calling your friend\'s real number or asking a secret question.',
  teenRules: [
    { emoji: '📞', title: 'Use an Established Channel', text: 'If a friend messages from a new profile asking for money, contact them through a number or conversation you already trusted before the request.' },
    { emoji: '💳', title: 'Treat Gift Cards as a Critical Warning', text: 'Unexpected requests to buy gift cards and send the codes are a strong sign of impersonation. Verify the requester independently.' },
    { emoji: '🔒', title: 'Protect Your Friend List', text: 'Set your Facebook friend list to "Friends Only" or "Only Me" so clone bots cannot scrape and target your circle.' }
  ]
}

export const facebookVerificationChallenges = [
  {
    id: 'fb-verify-clone',
    category: 'CLONED FRIEND PROFILE',
    title: 'A familiar face asks for emergency money',
    context: 'A new account uses Alicia’s real photos and has dozens of mutual friends. It says her phone is damaged and asks for an urgent transfer.',
    question: 'Which action gives you the strongest independent proof that Alicia really sent the request?',
    correct: 'saved-number',
    options: [
      { id: 'mutuals', label: 'CHECK MUTUALS', text: 'Trust the account because many people you know already accepted it.', feedback: 'Mutual friends may also have accepted the clone without checking. Network size is supporting context, not identity proof.' },
      { id: 'challenge', label: 'ASK IN MESSENGER', text: 'Ask the new profile a personal question only Alicia might know.', feedback: 'Answers may be visible in old posts, stolen messages or public information. You are still verifying through the suspicious account.' },
      { id: 'saved-number', label: 'USE A SAVED CHANNEL', text: 'Call Alicia using the number already stored in your phone and ask about the request.', feedback: 'This leaves the suspicious account and uses a contact route established before the emergency message appeared.' },
      { id: 'small-transfer', label: 'TEST WITH LESS', text: 'Send a small amount first and wait to see whether Alicia confirms it.', feedback: 'A smaller transfer still rewards the scammer and does not establish identity.' },
    ],
  },
  {
    id: 'fb-verify-marketplace',
    category: 'MARKETPLACE SELLER',
    title: 'A seller pressures you to reserve an item',
    context: 'The listing is much cheaper than comparable items. The seller wants a deposit through Friends & Family because several other buyers are “waiting”.',
    question: 'What is the safest way to verify both the item and the seller?',
    correct: 'protected-exchange',
    options: [
      { id: 'photo', label: 'REQUEST A PHOTO', text: 'Ask for another photo of the item with today’s date written beside it.', feedback: 'A fresh photo can add evidence, but images can be stolen, edited or generated. It does not protect the payment.' },
      { id: 'profile-age', label: 'READ THE PROFILE', text: 'Proceed if the seller has old posts and several believable friends.', feedback: 'Compromised or purchased accounts can have long histories. Profile age alone does not make the transaction safe.' },
      { id: 'protected-exchange', label: 'VERIFY AT EXCHANGE', text: 'Inspect the item in a safe public location and use the platform’s protected payment process.', feedback: 'You independently confirm the item exists and retain the protections provided by the marketplace or payment provider.' },
      { id: 'deposit', label: 'PAY A DEPOSIT', text: 'Send the smallest deposit the seller will accept so they hold the item.', feedback: 'Deposit pressure is the mechanism of the scam. A smaller loss is still a loss and may lead to further demands.' },
    ],
  },
  {
    id: 'fb-verify-authority',
    category: 'AUTHORITY IMPERSONATION',
    title: 'A leader requests gift cards in private',
    context: 'A profile using a principal or manager’s name asks you to buy gift cards for a confidential event and promises reimbursement.',
    question: 'How should you verify the request without alerting the possible impersonator?',
    correct: 'official-contact',
    options: [
      { id: 'profile-message', label: 'MESSAGE THE PROFILE', text: 'Ask the same account to confirm its job title and office location.', feedback: 'The impersonator can copy those details from public pages and answer from the same compromised channel.' },
      { id: 'official-contact', label: 'CONTACT THE ORGANISATION', text: 'Use the organisation’s published phone number or internal directory to contact the person or their office.', feedback: 'An independently sourced organisational channel can confirm the person and the request without relying on the suspicious profile.' },
      { id: 'coworker', label: 'ASK ONE COWORKER', text: 'Proceed if another person recognises the profile picture.', feedback: 'Recognising a copied photo does not verify who controls the account.' },
      { id: 'receipt', label: 'REQUEST A RECEIPT', text: 'Buy the cards only after the profile sends a written promise to reimburse you.', feedback: 'A written promise from an impersonated account has no value, and gift-card codes can be redeemed immediately.' },
    ],
  },
]

export const facebookResponseScenario = {
  title: 'Stop a cloned-friend payment scam',
  introduction: 'The profile changes tactics as you hesitate. Your decisions affect whether money is lost and whether the real account owner is warned.',
  profile: { profileName: 'Alicia Voss — new account', handle: 'alicia.voss.real.98', avatar: 'AV', avatarBg: '#2563eb', avatarColor: '#ffffff' },
  turns: [
    {
      id: 'fb-response-1', time: '10:15 PM',
      message: 'Hey, I’m stuck across town and my banking app is locked. Could you send $150 now? I’ll return $200 tomorrow.',
      prompt: 'The request feels urgent and comes from a familiar face. What do you do first?',
      options: [
        { id: 'call', label: 'VERIFY ELSEWHERE', action: 'Call Alicia using the number already saved in your phone.', reply: 'I’m gonna call your usual number first, just to make sure you’re okay.', risk: 0, resultTitle: 'You leave the attacker’s channel', feedback: 'A pre-existing contact method is stronger than anything shown by the new profile.' },
        { id: 'questions', label: 'KEEP CHATTING', action: 'Ask the profile where Alicia is and what happened.', reply: 'Where are you exactly, and what happened to your banking app?', risk: 15, resultTitle: 'You gather context but remain exposed', feedback: 'Questions may expose inconsistencies, but the scammer can improvise and keep applying pressure.' },
        { id: 'send', label: 'HELP IMMEDIATELY', action: 'Send the money because delaying could leave your friend stranded.', reply: 'Okay, sending it now. Let me know when it lands.', risk: 40, resultTitle: 'The payment leaves your control', feedback: 'Urgency has replaced verification. Peer-to-peer transfers may be difficult to recover.' },
      ],
    },
    {
      id: 'fb-response-2', time: '10:16 PM',
      message: 'Please don’t call—my microphone is broken and my battery is nearly dead. Just use this new payment tag before it cuts out.',
      prompt: 'The account blocks your verification attempt. What is your next move?',
      options: [
        { id: 'trusted-person', label: 'CROSS-CHECK', action: 'Contact a mutual friend or family member through an existing conversation.', reply: 'No worries. I’ll check with someone nearby and make sure you’re safe.', risk: 0, resultTitle: 'The excuse no longer controls the process', feedback: 'A second independent person can expose the cloned profile and help reach the real Alicia.' },
        { id: 'wait', label: 'WAIT IN CHAT', action: 'Tell the account you will wait until its microphone works.', reply: 'I’ll wait here until you can call me back.', risk: 10, resultTitle: 'You avoid payment but do not contain the scam', feedback: 'Waiting is safer than paying, but the fake profile remains free to target other friends.' },
        { id: 'payment-tag', label: 'TRUST THE EXCUSE', action: 'Use the new payment tag because the account appears distressed.', reply: 'Alright, I’ll use the new tag. Hope you get home safely.', risk: 35, resultTitle: 'A second warning sign is ignored', feedback: 'Changing payment details while preventing a call strongly increases the likelihood of impersonation.' },
      ],
    },
    {
      id: 'fb-response-3', time: '10:18 PM',
      message: 'Why are you making this difficult? If you cared, you would send it. Don’t tell anyone—I’m embarrassed.',
      prompt: 'The profile adds guilt and secrecy. How do you close the incident?',
      options: [
        { id: 'report-warn', label: 'REPORT AND WARN', action: 'Capture the profile URL, report the clone, warn Alicia and notify mutual friends.', reply: 'I’ve confirmed this isn’t Alicia. I’m reporting the profile and warning the people it contacted.', risk: 0, resultTitle: 'The attack is contained', feedback: 'Reporting reduces reach while warning the real person and mutual contacts protects the wider network.' },
        { id: 'block-only', label: 'BLOCK ONLY', action: 'Block the account and move on without telling anyone.', reply: 'I’m blocking this account now.', risk: 10, resultTitle: 'You are safer, but others remain exposed', feedback: 'Blocking protects your inbox, but reporting and warning contacts would contain the impersonation more effectively.' },
        { id: 'argue', label: 'CONFRONT PUBLICLY', action: 'Post accusations and continue arguing with the profile.', reply: 'Everyone needs to know you’re a scammer. I’m posting this conversation.', risk: 20, resultTitle: 'Evidence and attention may be lost', feedback: 'Public confrontation can cause the account to disappear before useful details are reported and may spread personal information.' },
      ],
    },
  ],
  outcomes: {
    safe: { title: 'Clone contained before harm', text: 'You verified through trusted channels, refused emotional pressure and protected the wider friend network.' },
    mixed: { title: 'Payment avoided, exposure remains', text: 'You avoided the worst outcome, but delayed verification or reporting left time for the scammer to target others.' },
    risky: { title: 'Impersonation caused financial loss', text: 'The fake profile converted urgency and secrecy into payment before identity was independently verified.' },
  },
}

