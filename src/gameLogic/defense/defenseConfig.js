export const TECHNIQUE_BASE_CHANCE = { social: 60, phishing: 50, deepfake: 40 }
export const INTEL_MODIFIER = { none: 0, relevant: 15, multiple: 25 }
export const TRAIT_MODIFIER = { positive: 15, neutral: 0, negative: -20 }
export const TARGET_MODIFIER = { employee: 10, manager: 0, ceo: -15 }
export const REPEAT_ATTEMPT_MODIFIER = {
  first: 0, second: -10, third: -20, fourthOrLater: -30,
}
export const ALERT_MODIFIER = { low: 0, elevated: -10, high: -20 }
export const MIN_SUCCESS_CHANCE = 5
export const MAX_SUCCESS_CHANCE = 95

export const defenses = {
  phishing: {
    email: {
      id: 'secure-email-gateway', name: 'Secure Email Gateway', modifier: -10,
      description: 'Scans links and attachments, detects spoofed domains, and checks SPF, DKIM and DMARC before delivery.',
    },
    sms: {
      id: 'mobile-threat-defence', name: 'Mobile Threat Defence', modifier: -10,
      description: 'Flags suspicious senders and malicious links in SMS messages before an employee can interact with them.',
    },
    vishing: {
      id: 'trusted-callback-verification', name: 'Trusted Callback Verification', modifier: -15,
      description: 'Requires sensitive phone requests to be verified using a known number from the company directory.',
    },
    teams: {
      id: 'collaboration-security-gateway', name: 'Collaboration Security Gateway', modifier: -10,
      description: 'Marks external users, scans shared links and files, and restricts unexpected direct messages.',
    },
  },
  social: {
    facebook: {
      id: 'identity-impersonation-monitoring', name: 'Identity and Impersonation Monitoring', modifier: -10,
      description: 'Detects cloned profiles and requires staff to verify unexpected connection requests through a trusted channel.',
    },
    instagram: {
      id: 'social-impersonation-detection', name: 'Social Impersonation Detection', modifier: -10,
      description: 'Monitors lookalike accounts and warns employees about unverified profiles using company or staff identities.',
    },
    linkedin: {
      id: 'professional-network-verification', name: 'Professional Network Verification', modifier: -15,
      description: 'Checks mutual connections, profile history and identity signals before a work-related request is trusted.',
    },
  },
  deepfake: {
    voice: {
      id: 'voice-verification-protocol', name: 'Voice Verification Protocol', modifier: -15,
      description: 'Uses challenge-response questions and a trusted callback before approving requests made by voice.',
    },
    video: {
      id: 'liveness-media-provenance-check', name: 'Liveness and Media Provenance Check', modifier: -20,
      description: 'Checks liveness signals, media provenance and request context, then confirms the request through a second channel.',
    },
  },
}
