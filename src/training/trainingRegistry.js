export const attackTrainingRequirements = {
  phishing: {
    email: 'email',
    sms: 'sms',
    vishing: 'vishing',
  },
  deepfake: {
    voice: 'voice-clone',
    video:'video-deepfake'
  },
  social: {
    facebook: 'facebook',
    instagram: 'instagram',
    linkedin: 'linkedin',
  },
}

export const learningModuleCatalog = [
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
    format: '4 interactive activities', available: true,
  },
  {
    id: 'instagram', number: '06', category: 'FAKE SOCIAL PROFILE', theme: 'social', icon: '◎', title: 'Instagram Impersonation',
    description: 'Recognise copied identities, deceptive direct messages and fake accounts built from public information.',
    format: '4 interactive activities', available: true,
  },
  {
    id: 'linkedin', number: '07', category: 'FAKE SOCIAL PROFILE', theme: 'social', icon: 'in', title: 'LinkedIn Impersonation',
    description: 'Assess fabricated professional histories, suspicious mutual connections and false recruitment approaches.',
    format: '4 interactive activities', available: true,
  },
  {
    id: 'voice-clone', number: '08', category: 'DEEPFAKE', theme: 'deepfake', icon: '◖', title: 'Voice-Clone Deepfake',
    description: 'Learn why a familiar voice is not proof of identity and practise independent verification techniques.',
    format: '6 interactive activities', available: true,
  },
  {
    id: 'video-deepfake', number: '09', category: 'DEEPFAKE', theme: 'deepfake', icon: '◉', title: 'Video / Image Deepfake',
    description: 'Examine synthetic visual media, misleading context and safer ways to verify high-impact requests.',
    format: 'Module in development', available: true,
  },
]
