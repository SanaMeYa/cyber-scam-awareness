export const femaleVoiceHints = [
  'natasha', 'catherine', 'karen', 'samantha', 'zira', 'aria', 'jenny',
  'sonia', 'victoria', 'moira', 'tessa', 'ava', 'susan', 'hazel', 'serena',
  'female', 'siri',
]

export const getPreferredNarrationVoice = () => {
  if (!('speechSynthesis' in window)) return null

  const voices = window.speechSynthesis.getVoices()
  const scoreVoice = (voice) => {
    const name = voice.name.toLowerCase()
    const lang = voice.lang.toLowerCase()
    let score = 0

    if (lang.startsWith('en-au')) score += 50
    else if (lang.startsWith('en-gb')) score += 42
    else if (lang.startsWith('en')) score += 35
    else return -100

    if (name.includes('natural')) score += 90
    if (name.includes('online')) score += 35
    if (name.includes('premium') || name.includes('enhanced')) score += 28
    if (femaleVoiceHints.some((hint) => name.includes(hint))) score += 45
    if (name.includes('google')) score += 12
    if (voice.localService) score += 4

    return score
  }

  return [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] ?? null
}

export const getPreferredParticipantVoice = (callerVoice) => {
  if (!('speechSynthesis' in window)) return null

  const differentEnglishVoices = window.speechSynthesis.getVoices().filter((voice) => (
    voice.lang.toLowerCase().startsWith('en') && voice.name !== callerVoice?.name
  ))
  const participantHints = ['william', 'daniel', 'david', 'james', 'guy', 'lee', 'mark', 'male']
  const scoreVoice = (voice) => {
    const name = voice.name.toLowerCase()
    let score = voice.lang.toLowerCase().startsWith('en-au') ? 35 : 20
    if (name.includes('natural') || name.includes('online')) score += 60
    if (name.includes('premium') || name.includes('enhanced')) score += 25
    if (participantHints.some((hint) => name.includes(hint))) score += 35
    return score
  }

  return differentEnglishVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] ?? callerVoice ?? null
}
