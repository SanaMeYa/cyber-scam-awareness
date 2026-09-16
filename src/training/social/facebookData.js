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
      { id: 'fb-avoid-call', label: 'Refusing Voice/Call', targetText: 'Please don\'t call me rn, my mic is broken', title: '🚨 Calling Blocked by Scammer', explanation: 'Scammers always make excuses why they can\'t talk on the phone or FaceTime because hearing their voice would blow their cover.', teenTip: 'If they refuse a 5-second voice call, it is 100% a fake account.' },
      { id: 'fb-off-platform-pay', label: 'Irreversible Cash App Tag', targetText: '$alicia_voss_emergency', title: '🚨 Untraceable Payment Trap', explanation: 'Peer-to-peer payment apps (Cash App, Zelle, Venmo) are like handing someone cash. Once sent, money cannot be refunded.', teenTip: 'Never send peer-to-peer cash to someone you haven\'t verified via voice.' }
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
      { id: 'fb-market-price', label: 'Unrealistic Low Price', targetText: 'brand new PS5 Slim + 2 controllers is still available for $220', title: '🚨 Too-Good-To-Be-True Bait', explanation: 'Expensive electronics or sold-out concert tickets at half price are designed to trigger fear of missing out (FOMO).', teenTip: 'If a brand new $500 item is listed for $200, it is always a scam.' },
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
    { emoji: '📞', title: 'The 10-Second Voice Rule', text: 'If a friend DMs asking for money, call them on the phone. Scammers can clone photos, but they cannot fake their real voice on a live call.' },
    { emoji: '💳', title: 'Gift Cards = 100% Scam', text: 'No teacher, boss, or company ever asks for payment in Apple, Steam, or Amazon gift cards.' },
    { emoji: '🔒', title: 'Protect Your Friend List', text: 'Set your Facebook friend list to "Friends Only" or "Only Me" so clone bots cannot scrape and target your circle.' }
  ]
}

