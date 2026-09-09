import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Gameplay.css'
import jordanPortrait from './assets/targets/jordan-malik.jpg'
import priyaPortrait from './assets/targets/priya-nandakumar.jpg'
import derekPortrait from './assets/targets/derek-combs.jpg'
import sarahPortrait from './assets/targets/sarah-lindqvist.jpg'
import marcusPortrait from './assets/targets/marcus-reyes.jpg'
import { defenses } from './gameLogic/defense/defenseConfig.js'
import { resolveTurn } from './gameLogic/resolveTurn.js'

const targets = [
  {
    id: 'jordan', name: 'Jordan Malik', initials: 'JM', role: 'Service Desk', tier: 1,
    tierLabel: 'Employee', tone: 'blue', image: jordanPortrait,
    traits: ['New to the role and eager to help', 'Spends downtime on Facebook', 'More cautious with unexpected calls'],
    scenario: 'The service desk queue is building during a busy afternoon when a staff member reports being locked out before an important meeting. The request includes familiar company language, but some details still need to be checked against the ticketing system. Jordan is handling the queue without direct supervision and wants to resolve the issue without delaying the employee.',
    transcript: 'Iris: Jordan joined Solstice six months ago after completing his first industry certification. He is friendly, capable and keen to show that he can manage requests independently, although he is still learning when to slow down and escalate. He sometimes checks Facebook during quiet periods, but a prank caller last month has made him more cautious whenever an unfamiliar voice contacts the desk.',
    vulnerabilities: { phishing: ['email', 'teams'], social: ['facebook'] },
    resistances: { phishing: ['vishing'] },
  },
  {
    id: 'priya', name: 'Priya Nandakumar', initials: 'PN', role: 'Receptionist', tier: 1,
    tierLabel: 'Employee', tone: 'violet', image: priyaPortrait,
    traits: ['Handles constant calls and interruptions', 'Strict about visitor sign-in procedure', 'Posts about workdays on Instagram'],
    scenario: 'The reception area is crowded as Priya manages visitors, deliveries and several incoming calls at once. A request arrives during the busiest part of the shift and appears connected to normal front-desk activity. Priya has limited time to investigate it, but she is responsible for keeping company procedures consistent while helping people quickly.',
    transcript: 'Iris: Priya has worked at the front desk for five years and remains calm when several tasks compete for her attention. She follows the visitor sign-in process carefully because the rule was strengthened after an earlier security concern. Outside work she posts ordinary updates about busy days on Instagram, while the constant volume of unscheduled calls sometimes gives her very little time to assess each caller.',
    vulnerabilities: { phishing: ['vishing'], social: ['instagram'] },
    resistances: { phishing: ['email', 'teams'] },
  },
  {
    id: 'derek', name: 'Derek Combs', initials: 'DC', role: 'IT Manager', tier: 3,
    tierLabel: 'Manager', tone: 'teal', image: derekPortrait,
    traits: ['Trusts his own technical judgement', 'Responds to fellow-IT framing', 'Accepts only mutual social contacts'],
    scenario: 'A technical request appears shortly before a scheduled board call and refers to an internal system issue that may affect senior staff. The message uses terminology familiar to the IT team and suggests that waiting could interrupt the meeting. Derek must decide whether the request fits normal internal practice while managing several other operational priorities.',
    transcript: 'Iris: Derek worked his way from helpdesk support to IT management over more than a decade. He is genuinely knowledgeable and often trusts his technical instincts because they have usually served him well. He still speaks informally with junior IT staff, but he is more guarded online and generally accepts professional connections only when a mutual contact makes them appear credible.',
    vulnerabilities: { phishing: ['email', 'teams'] },
    resistances: { social: ['linkedin', 'facebook', 'instagram'] },
    lockedMessage: 'Gain a successful foothold with Jordan or Priya to unlock Manager targets.',
  },
  {
    id: 'sarah', name: 'Sarah Lindqvist', initials: 'SL', role: 'HR Manager', tier: 3,
    tierLabel: 'Manager', tone: 'amber', image: sarahPortrait,
    traits: ['Responds to empathy-based appeals', 'Verifies sensitive requests by phone', 'Trusted contact for staff problems'],
    scenario: 'HR receives a sensitive request concerning an employee who may need urgent support before an upcoming meeting. The situation sounds personal and time-sensitive, but acting on it could involve confidential staff information. Sarah must balance a quick, compassionate response with the verification procedures expected of her department.',
    transcript: 'Iris: Sarah moved into HR from a people-focused role and has become the manager employees approach when they are dealing with genuine problems. A previous near-miss led her to introduce phone-verification procedures for sensitive requests, and she follows that rule firmly. In most other situations, however, she is willing to be flexible when someone appears distressed or urgently needs help.',
    vulnerabilities: { phishing: ['email', 'teams'], social: ['facebook', 'instagram'] },
    resistances: { phishing: ['vishing'] },
    lockedMessage: 'Gain a successful foothold with Jordan or Priya to unlock Manager targets.',
  },
  {
    id: 'marcus', name: 'Marcus Reyes', initials: 'MR', role: 'CEO', tier: 4,
    tierLabel: 'CEO', tone: 'red', image: marcusPortrait,
    traits: ['High-profile speaker with public footage', 'Contact is filtered through an assistant', 'Requires strong prior intelligence'],
    scenario: 'A high-impact request is timed for a narrow gap between executive meetings and appears relevant to an upcoming company decision. Marcus normally receives information through his executive assistant, so unexpected direct contact is unusual. The request must look consistent with his schedule and established communication pathways before it receives attention.',
    transcript: 'Iris: Marcus is the public face of Solstice and is comfortable speaking at industry keynotes, recorded interviews and podcasts. Those appearances have created a large amount of publicly available audio and video, but reaching him directly remains difficult. Most requests are filtered through his executive assistant, and he has become accustomed to relying on that process rather than personally checking every new contact.',
    vulnerabilities: { deepfake: ['voice', 'video'] },
    resistances: { phishing: ['email', 'teams'], social: ['linkedin', 'facebook', 'instagram'] },
    lockedMessage: 'Complete at least one successful Manager attempt to unlock the CEO.',
  },
]

const techniques = [
  { id: 'phishing', icon: '⌁', title: 'Phishing', description: 'Test a simulated message or call.', options: [
    { id: 'email', label: 'Email' }, { id: 'sms', label: 'SMS' },
    { id: 'vishing', label: 'Vishing / voice call' }, { id: 'teams', label: 'Teams / Slack DM' },
  ] },
  { id: 'social', icon: '▣', title: 'Fake Social Profile', description: 'Test a fictional connection request.', options: [
    { id: 'facebook', label: 'Facebook' }, { id: 'instagram', label: 'Instagram' }, { id: 'linkedin', label: 'LinkedIn' },
  ] },
  { id: 'deepfake', icon: '◒', title: 'Deepfake', description: 'Test synthetic media awareness.', options: [
    { id: 'voice', label: 'Voice clone' }, { id: 'video', label: 'Video / image' },
  ] },
]

const startingFunds = 5_000_000
const formatMoney = (value) => new Intl.NumberFormat('en-AU', {
  style: 'currency', currency: 'AUD', maximumFractionDigits: 0,
}).format(value)

const femaleVoiceHints = [
  'natasha', 'catherine', 'karen', 'samantha', 'zira', 'aria', 'jenny',
  'sonia', 'victoria', 'moira', 'tessa', 'ava', 'susan', 'hazel',
]

const getPreferredNarrationVoice = () => {
  if (!('speechSynthesis' in window)) return null

  const voices = window.speechSynthesis.getVoices()
  const isFemaleVoice = (voice) => femaleVoiceHints.some((hint) => voice.name.toLowerCase().includes(hint))

  return voices.find((voice) => voice.lang.toLowerCase().startsWith('en-au') && isFemaleVoice(voice))
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('en') && isFemaleVoice(voice))
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('en-au'))
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('en'))
    ?? null
}

function Gameplay() {
  const navigate = useNavigate()
  const [audioSettings, setAudioSettings] = useState({
    musicEnabled: false,
    musicVolume: 22,
    loopMusic: true,
    duckDuringNarration: true,
    soundEffectsEnabled: true,
    soundEffectsVolume: 35,
  })
  const [draftAudioSettings, setDraftAudioSettings] = useState(audioSettings)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedTargetId, setSelectedTargetId] = useState('jordan')
  const [selectedTechnique, setSelectedTechnique] = useState('')
  const [subtypes, setSubtypes] = useState({ phishing: 'email', social: 'linkedin', deepfake: 'voice' })
  const [funds, setFunds] = useState(startingFunds)
  const [exposure, setExposure] = useState(0)
  const [turn, setTurn] = useState(0)
  const [techniqueCounts, setTechniqueCounts] = useState({ phishing: 0, social: 0, deepfake: 0 })
  const [employeeCleared, setEmployeeCleared] = useState(false)
  const [managerCleared, setManagerCleared] = useState(false)
  const [successfulTargetIds, setSuccessfulTargetIds] = useState(() => new Set())
  const [lastTargetId, setLastTargetId] = useState(null)
  const [repeatCount, setRepeatCount] = useState(0)
  const [result, setResult] = useState(null)
  const [pendingResult, setPendingResult] = useState(null)
  const [defenseSelection, setDefenseSelection] = useState(null)
  const [narrationState, setNarrationState] = useState(() => 'speechSynthesis' in window ? 'idle' : 'unsupported')
  const [narrationMuted, setNarrationMuted] = useState(false)
  const musicRef = useRef(null)
  const clickAudioContextRef = useRef(null)
  const narrationVoiceRef = useRef(null)
  const utteranceRef = useRef(null)

  const roundLocked = Boolean(pendingResult || result)

  const selectedTarget = useMemo(
    () => targets.find((target) => target.id === selectedTargetId) ?? targets[0],
    [selectedTargetId],
  )

  const narrationText = useMemo(() => {
    const irisBriefing = selectedTarget.transcript.replace(/^Iris:\s*/i, '')
    return `Scenario. ${selectedTarget.scenario} Briefing from Iris. ${irisBriefing}`
  }, [selectedTarget])

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      return undefined
    }

    const loadVoice = () => {
      narrationVoiceRef.current = getPreferredNarrationVoice()
    }

    loadVoice()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoice)

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoice)
      window.speechSynthesis.cancel()
    }
  }, [])

  useEffect(() => {
    const music = musicRef.current
    if (!music) return

    const narrationIsPlaying = narrationState === 'playing'
    const duckingMultiplier = audioSettings.duckDuringNarration && narrationIsPlaying ? 0.28 : 1
    music.volume = (audioSettings.musicVolume / 100) * duckingMultiplier
    music.loop = audioSettings.loopMusic
  }, [audioSettings.duckDuringNarration, audioSettings.loopMusic, audioSettings.musicVolume, narrationState])

  useEffect(() => {
    const handleButtonClick = (event) => {
      const button = event.target.closest('button')
      if (!button || button.disabled || button.closest('.audio-controls') || !audioSettings.soundEffectsEnabled) return

      const AudioContextClass = window.AudioContext ?? window.webkitAudioContext
      if (!AudioContextClass) return

      const context = clickAudioContextRef.current ?? new AudioContextClass()
      clickAudioContextRef.current = context
      if (context.state === 'suspended') context.resume()

      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const now = context.currentTime
      const level = Math.max(0.001, (audioSettings.soundEffectsVolume / 100) * 0.08)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(720, now)
      oscillator.frequency.exponentialRampToValueAtTime(390, now + 0.055)
      gain.gain.setValueAtTime(level, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start(now)
      oscillator.stop(now + 0.065)
    }

    document.addEventListener('click', handleButtonClick)
    return () => document.removeEventListener('click', handleButtonClick)
  }, [audioSettings.soundEffectsEnabled, audioSettings.soundEffectsVolume])

  useEffect(() => {
    if (!settingsOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSettingsOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [settingsOpen])

  useEffect(() => {
    const music = musicRef.current
    return () => {
      music?.pause()
      clickAudioContextRef.current?.close()
    }
  }, [])

  const openAudioSettings = () => {
    setDraftAudioSettings(audioSettings)
    setSettingsOpen(true)
  }

  const updateDraftAudioSetting = (key, value) => {
    setDraftAudioSettings((current) => ({ ...current, [key]: value }))
  }

  const saveAudioSettings = () => {
    const music = musicRef.current

    if (music) {
      music.volume = draftAudioSettings.musicVolume / 100
      music.loop = draftAudioSettings.loopMusic
      if (draftAudioSettings.musicEnabled) {
        music.play().catch(() => {
          setAudioSettings((current) => ({ ...current, musicEnabled: false }))
        })
      } else {
        music.pause()
      }
    }

    setAudioSettings(draftAudioSettings)
    setSettingsOpen(false)
  }

  const playNarration = (restart = false) => {
    if (!('speechSynthesis' in window)) {
      setNarrationState('unsupported')
      return
    }

    const speech = window.speechSynthesis
    if (!restart && speech.paused) {
      speech.resume()
      setNarrationMuted(false)
      setNarrationState('playing')
      return
    }

    if (speech.paused) speech.resume()
    speech.cancel()
    const utterance = new SpeechSynthesisUtterance(narrationText)
    utterance.voice = narrationVoiceRef.current ?? getPreferredNarrationVoice()
    utterance.lang = utterance.voice?.lang ?? 'en-AU'
    utterance.rate = 0.92
    utterance.pitch = 1.04
    utterance.volume = 1
    utterance.onstart = () => setNarrationState('playing')
    utterance.onend = () => {
      setNarrationState('idle')
      utteranceRef.current = null
    }
    utterance.onerror = () => {
      setNarrationState('idle')
      utteranceRef.current = null
    }

    utteranceRef.current = utterance
    setNarrationMuted(false)
    speech.speak(utterance)
  }

  const pauseNarration = () => {
    if (!('speechSynthesis' in window)) return
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause()
      setNarrationState('paused')
    }
  }

  const toggleNarrationMute = () => {
    if (!('speechSynthesis' in window)) return

    if (!narrationMuted) {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume()
      window.speechSynthesis.cancel()
      utteranceRef.current = null
      setNarrationState('idle')
      setNarrationMuted(true)
    } else {
      setNarrationMuted(false)
    }
  }

  const stopNarration = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume()
      window.speechSynthesis.cancel()
    }
    utteranceRef.current = null
    setNarrationState('speechSynthesis' in window ? 'idle' : 'unsupported')
    setNarrationMuted(false)
  }

  const targetLocked = (target) => {
    if (successfulTargetIds.has(target.id)) return true
    if (target.tier === 3) return !employeeCleared
    if (target.tier === 4) return !managerCleared
    return false
  }

  const selectedOption = techniques.find((item) => item.id === selectedTechnique)
    ?.options.find((option) => option.id === subtypes[selectedTechnique])

  const resetGame = () => {
    stopNarration()
    setSelectedTargetId('jordan'); setSelectedTechnique(''); setFunds(startingFunds)
    setExposure(0); setTurn(0); setEmployeeCleared(false); setManagerCleared(false)
    setTechniqueCounts({ phishing: 0, social: 0, deepfake: 0 })
    setSuccessfulTargetIds(new Set())
    setLastTargetId(null); setRepeatCount(0); setResult(null)
    setPendingResult(null); setDefenseSelection(null)
    setNarrationState('idle'); setNarrationMuted(false)
  }

  const selectTarget = (id) => {
    if (roundLocked || successfulTargetIds.has(id)) return
    stopNarration()
    setSelectedTargetId(id); setSelectedTechnique(''); setResult(null)
  }

  const launchSimulation = () => {
    if (!selectedTechnique || targetLocked(selectedTarget) || roundLocked) return
    const subtype = subtypes[selectedTechnique]
    const selectedDefense = defenses[selectedTechnique][subtype]
    const isStrong = selectedTarget.vulnerabilities[selectedTechnique]?.includes(subtype)
    const isWeak = selectedTarget.resistances[selectedTechnique]?.includes(subtype)
    const nextRepeatCount = lastTargetId === selectedTarget.id ? repeatCount + 1 : 1

    const traitMatch = isStrong ? 'positive' : isWeak ? 'negative' : 'neutral'
    const intelLevel = traitMatch === 'positive'
      ? successfulTargetIds.size >= 1 ? 'multiple' : 'relevant'
      : successfulTargetIds.size >= 1 ? 'relevant' : 'none'

    const turnResult = resolveTurn({
      targetId: selectedTarget.id,
      targetName: selectedTarget.name,
      targetTier: selectedTarget.tierLabel.toLowerCase(),
      technique: selectedTechnique,
      subtype,
      intelLevel,
      traitMatch,
      attemptNumber: nextRepeatCount,
      alertLevel: exposure,
      defense: selectedDefense,
    })

    setDefenseSelection({
      ...turnResult.defense,
      technique: techniques.find((item) => item.id === selectedTechnique)?.title,
      subtype: selectedOption.label,
      target: selectedTarget.name,
    })

    setPendingResult({ ...turnResult, nextRepeatCount })
  }

  const displayRoundResult = () => {
    if (!pendingResult) return

    stopNarration()

    const nextFunds = Math.max(0, funds - pendingResult.damage)
    const nextExposure = Math.min(100, exposure + pendingResult.alertIncrease)
    const nextTurn = turn + 1
    const nextTechniqueCounts = {
      ...techniqueCounts,
      [selectedTechnique]: techniqueCounts[selectedTechnique] + 1,
    }

    setFunds(nextFunds)
    setExposure(nextExposure)
    setTechniqueCounts(nextTechniqueCounts)
    setLastTargetId(selectedTarget.id)
    setRepeatCount(pendingResult.nextRepeatCount)

    if (pendingResult.success && selectedTarget.tier === 1) setEmployeeCleared(true)
    if (pendingResult.success && selectedTarget.tier === 3) setManagerCleared(true)
    if (pendingResult.success) {
      setSuccessfulTargetIds((current) => new Set(current).add(selectedTarget.id))
    }

    setResult(pendingResult)
    setPendingResult(null)

    const ceoTakedown = pendingResult.success && selectedTarget.id === 'marcus'
    const won = nextFunds <= 0 || ceoTakedown

    if (won || nextExposure >= 100) {
      navigate(won ? '/victory' : '/game-over', {
        state: {
          reason: !won ? 'detected' : ceoTakedown ? 'ceo' : 'bankrupt',
          turnsPlayed: nextTurn,
          startingFunds,
          fundsRemaining: nextFunds,
          fundsRemoved: startingFunds - nextFunds,
          exposure: nextExposure,
          exposureGain: pendingResult.exposureGain,
          finalTarget: selectedTarget.name,
          technique: techniques.find((item) => item.id === selectedTechnique)?.title ?? 'Technique',
          subtype: selectedOption.label,
          techniqueCounts: nextTechniqueCounts,
        },
      })
    }
  }

  const nextRound = () => {
    stopNarration()
    const nextAvailableTarget = targets.find((target) => !targetLocked(target))
    if (nextAvailableTarget) setSelectedTargetId(nextAvailableTarget.id)
    setTurn((value) => value + 1)
    setSelectedTechnique('')
    setResult(null)
    setPendingResult(null)
    setDefenseSelection(null)
  }
  const fundsPercent = (funds / startingFunds) * 100

  return (
    <main className="game-page">
      <audio ref={musicRef} src="/audio/max-brhon-cyberpunk.mp3" preload="metadata" />
      <div className="cyber-atmosphere" aria-hidden="true">
        <span className="ambient-orb orb-one" />
        <span className="ambient-orb orb-two" />
        <span className="scan-beam" />
      </div>
      <div className="game-shell">
        <header className="game-header">
          <div className="brand-lockup">
            <div className="game-brand" data-text="BREACH POINT">BREACH POINT</div>
            <div className="game-subtitle">SOCIAL ENGINEERING AWARENESS SIMULATION</div>
            <div className="system-status-line"><span><i />SIMULATION ONLINE</span><span>LOCAL SESSION</span><span>NO DATA STORED</span></div>
          </div>
          <div className="header-actions">
            <button className="utility-button" type="button" onClick={openAudioSettings} aria-haspopup="dialog">
              <span className="settings-icon">⚙</span> SETTINGS
              <span className={`audio-status-dot ${audioSettings.musicEnabled ? 'active' : ''}`} aria-label={`Music ${audioSettings.musicEnabled ? 'on' : 'off'}`} />
            </button>
            <button className="utility-button" type="button" onClick={resetGame}><span className="restart-icon">↻</span> RESTART</button>
          </div>
        </header>

        <section className="status-grid">
          <div className="importance-card glass-panel">
            <div className="round-icon">●</div>
            <div className="importance-content">
              <div className="status-title">TARGET IMPORTANCE — LEVEL {selectedTarget.tier} OF 4</div>
              <div className="importance-track" aria-label={`Target level ${selectedTarget.tier} of 4`}>
                {[1, 2, 3, 4].map((level) => <span key={level} className={level <= selectedTarget.tier ? 'reached' : ''} />)}
              </div>
              <div className="importance-labels"><span>EMPLOYEE</span><span>SENIOR EMPLOYEE</span><span>MANAGER</span><span>CEO</span></div>
            </div>
          </div>
          <div className="turn-card glass-panel"><div className="round-icon turn">↻</div><div><div className="status-title">TURN</div><div className="turn-number">{turn}</div></div></div>
        </section>

        <section className="meter glass-panel funds-meter">
          <div className="meter-name">COMPANY FUNDS REMAINING</div>
          <div className="meter-track"><span style={{ width: `${fundsPercent}%` }} /></div>
          <div className="meter-value funds-value"><strong>{formatMoney(funds)}</strong><small>STARTING FUNDS: {formatMoney(startingFunds)}</small></div>
        </section>

        <section className="meter glass-panel exposure-meter">
          <div className="shield-icon">◇</div><div className="meter-name">ATTACKER EXPOSURE</div>
          <div className="meter-track exposure-track"><span style={{ width: `${exposure}%` }} /></div>
          <div className="meter-value exposure-value">{exposure}%</div>
          <div className="detected-label"><span>◇</span> 100% = DETECTED</div>
        </section>

        <section className="gameplay-grid">
          <article className="target-panel glass-panel">
            <div className="section-kicker">TARGET</div>
            <div className={`target-avatar ${selectedTarget.tone}`}>
              <img src={selectedTarget.image} alt={`${selectedTarget.name}, ${selectedTarget.role}`} />
              <div className="avatar-rings" />
            </div>
            <div className="target-traits">
              {selectedTarget.traits.map((trait, index) => <div key={trait}><span>{['✉', '▣', '▱'][index]}</span>{trait}</div>)}
            </div>
          </article>

          <article className="selection-panel glass-panel">
            <div className="section-kicker">CHOOSE TARGET</div>
            <div className="target-list" aria-label="Available targets">
              {targets.map((target) => {
                const locked = targetLocked(target)
                const successful = successfulTargetIds.has(target.id)
                return <button className={`target-row ${target.id === selectedTargetId ? 'selected' : ''} ${successful ? 'completed' : ''}`} key={target.id} type="button" disabled={locked || roundLocked} title={successful ? `${target.name}: attack successful` : locked ? target.lockedMessage : roundLocked ? 'Complete the current round first' : `Select ${target.name}`} onClick={() => selectTarget(target.id)}>
                  <span className={`mini-avatar ${target.tone}`}><img src={target.image} alt="" /></span>
                  <span className="target-row-copy"><strong>{target.name}</strong><small>{target.role}</small></span>
                  <span className={`level-tag ${successful ? 'success' : ''}`}>{successful ? 'ATTACK SUCCESSFUL' : locked ? 'LOCKED' : `LEVEL ${target.tier}`}</span>
                </button>
              })}
            </div>
          </article>

          <article className="scenario-panel glass-panel">
            {!result ? <>
              <div className="section-kicker">SCENARIO</div><p className="scenario-copy">{selectedTarget.scenario}</p>
              <div className="audio-controls" aria-label="Narration controls">
                <button className={narrationState === 'playing' ? 'active' : ''} type="button" aria-label={narrationState === 'paused' ? 'Resume narration' : 'Play narration'} disabled={narrationState === 'unsupported'} onClick={() => playNarration(false)}><span>▶</span> {narrationState === 'paused' ? 'RESUME' : 'PLAY'}</button>
                <button className={narrationState === 'paused' ? 'active' : ''} type="button" aria-label="Pause narration" disabled={narrationState !== 'playing'} onClick={pauseNarration}><span>Ⅱ</span> PAUSE</button>
                <button type="button" aria-label="Replay narration from the beginning" disabled={narrationState === 'unsupported'} onClick={() => playNarration(true)}><span>↻</span> REPLAY</button>
                <button className={narrationMuted ? 'active muted' : ''} type="button" aria-label={narrationMuted ? 'Unmute narration' : 'Mute narration'} aria-pressed={narrationMuted} disabled={narrationState === 'unsupported'} onClick={toggleNarrationMute}><span>{narrationMuted ? '🔈' : '🔇'}</span> {narrationMuted ? 'UNMUTE' : 'MUTE'}</button>
              </div>
              <div className="transcript-box"><div className="transcript-heading"><span>TRANSCRIPT</span><span>{narrationState === 'unsupported' ? 'VOICE UNAVAILABLE' : narrationMuted ? 'NARRATION MUTED' : narrationState === 'playing' ? 'NARRATION PLAYING' : narrationState === 'paused' ? 'NARRATION PAUSED' : 'VISIBLE NARRATION'}</span></div><p>{selectedTarget.transcript}</p></div>
            </> : <div className="round-result" aria-live="polite">
              <div className="result-topline"><div><span className="section-kicker">ROUND RESULT</span><h2>{result.dialogue.title}</h2></div><span className={`result-badge ${result.success ? 'effective' : 'risky'}`}>{result.success ? '✓ ATTACK SUCCESSFUL' : '! ATTACK BLOCKED'}</span></div>
              <div className="result-impact"><div><small>COMPANY DAMAGE</small><strong>−{formatMoney(result.damage)}</strong></div><div><small>EXPOSURE GAIN</small><strong>+{result.alertIncrease}%</strong></div></div>
              <p>{result.dialogue.line}</p><div className="defence-note"><strong>DEFENSIVE LESSON</strong><span>{result.dialogue.tag}</span></div>
              {result.fatigue && <div className="fatigue-warning">Repeated contact made {selectedTarget.name} more alert.</div>}
            </div>}
          </article>
        </section>

        <section className="technique-section glass-panel">
          <div className="technique-heading">CHOOSE A TECHNIQUE AND TYPE</div>
          <div className="technique-layout">
            <div className="technique-cards">
              {techniques.map((technique) => <article key={technique.id} className={`technique-card ${selectedTechnique === technique.id ? 'selected' : ''} ${roundLocked ? 'locked' : ''}`} onClick={() => !roundLocked && setSelectedTechnique(technique.id)}>
                <button className="technique-main" type="button" disabled={roundLocked} aria-pressed={selectedTechnique === technique.id}>
                  <span className="technique-icon">{technique.icon}</span><span><strong>{technique.title}</strong><small>{technique.description}</small></span>
                </button>
                <label><span>TYPE</span><select value={subtypes[technique.id]} disabled={roundLocked} onClick={(event) => event.stopPropagation()} onChange={(event) => { setSelectedTechnique(technique.id); setSubtypes((current) => ({ ...current, [technique.id]: event.target.value })) }}>
                  {technique.options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                </select></label>
              </article>)}
            </div>
            <aside className="launch-panel">
              {!pendingResult && !result && <button className="launch-button" type="button" disabled={!selectedTechnique || targetLocked(selectedTarget)} onClick={launchSimulation}>LAUNCH SIMULATION <span>{selectedTechnique ? '▶' : '▣'}</span></button>}
              {pendingResult && <button className="launch-button defense-locked" type="button" disabled>AI DEFENSE LOCKED <span>▣</span></button>}
              {result && <button className="launch-button next" type="button" onClick={nextRound}>NEXT ROUND <span>›</span></button>}
              <p>{result ? 'Review the educational result, then continue.' : pendingResult ? 'The company has selected its defensive response. Reveal the result below.' : selectedTechnique ? `${techniques.find((item) => item.id === selectedTechnique)?.title}: ${selectedOption?.label}` : 'Select a target and choose a technique type to launch the simulation.'}</p>
            </aside>
          </div>
        </section>

        <section className={`ai-defense-section glass-panel ${defenseSelection ? 'active' : ''}`} aria-live="polite">
          <div className="ai-defense-header">
            <div>
              <div className="section-kicker">COMPANY AI DEFENSE</div>
              <p>Automatically selects the company control that best matches the simulated attack.</p>
            </div>
            <span className={`ai-status ${result ? 'resolved' : defenseSelection ? 'locked' : ''}`}>
              {result ? 'ROUND RESOLVED' : defenseSelection ? 'RESPONSE LOCKED' : 'STANDBY'}
            </span>
          </div>

          <div className="ai-defense-body">
            <div className="ai-core">
              <div className="ai-core-icon"><span>AI</span></div>
              <div><strong>AEGIS DEFENSE ENGINE</strong><small>Company controlled • User cannot modify</small></div>
            </div>

            {!defenseSelection ? (
              <div className="ai-defense-empty">
                <span className="scan-line" />
                <strong>WAITING FOR SIMULATION</strong>
                <p>Launch an attack to let the company analyse its channel and select a defensive control.</p>
              </div>
            ) : (
              <>
                <div className="defense-control-card">
                  <div className="defense-control-label">SELECTED DEFENSIVE CONTROL <span>LOCKED</span></div>
                  <h3>{defenseSelection.name}</h3>
                  <p>{defenseSelection.description}</p>
                  <div className="defense-tags">
                    <span>{defenseSelection.technique}</span>
                    <span>{defenseSelection.subtype}</span>
                    <span>{defenseSelection.target}</span>
                  </div>
                </div>

                <div className="defense-result-action">
                  <div className={`defense-outcome ${result ? result.success ? 'bypassed' : 'held' : 'pending'}`}>
                    <small>DEFENSE STATUS</small>
                    <strong>{result ? result.success ? 'DEFENSE BYPASSED' : 'DEFENSE HELD' : 'CONTROL DEPLOYED'}</strong>
                  </div>
                  {pendingResult && <button className="display-result-button" type="button" onClick={displayRoundResult}>DISPLAY ROUND RESULT <span>›</span></button>}
                  {result && <p className="defense-complete-note">Funds and exposure have now been updated.</p>}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {settingsOpen && (
        <div className="settings-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSettingsOpen(false)
        }}>
          <section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="audio-settings-title">
            <header className="settings-modal-header">
              <div>
                <span className="section-kicker">GAME OPTIONS</span>
                <h2 id="audio-settings-title">AUDIO SETTINGS</h2>
              </div>
              <button className="settings-close" type="button" aria-label="Close settings without saving" onClick={() => setSettingsOpen(false)}>×</button>
            </header>

            <div className="settings-group">
              <div className="setting-row setting-toggle-row">
                <div><strong>BACKGROUND MUSIC</strong><small>Play Max Brhon – Cyberpunk during gameplay.</small></div>
                <button className={`setting-switch ${draftAudioSettings.musicEnabled ? 'active' : ''}`} type="button" role="switch" aria-checked={draftAudioSettings.musicEnabled} onClick={() => updateDraftAudioSetting('musicEnabled', !draftAudioSettings.musicEnabled)}><span /></button>
              </div>
              <label className={`setting-row slider-row ${!draftAudioSettings.musicEnabled ? 'disabled' : ''}`}>
                <span><strong>MUSIC VOLUME</strong><output>{draftAudioSettings.musicVolume}%</output></span>
                <input type="range" min="0" max="100" step="1" value={draftAudioSettings.musicVolume} disabled={!draftAudioSettings.musicEnabled} onChange={(event) => updateDraftAudioSetting('musicVolume', Number(event.target.value))} />
              </label>
              <div className="setting-row setting-toggle-row compact">
                <div><strong>LOOP MUSIC</strong><small>Restart the track automatically when it ends.</small></div>
                <button className={`setting-switch ${draftAudioSettings.loopMusic ? 'active' : ''}`} type="button" role="switch" aria-checked={draftAudioSettings.loopMusic} onClick={() => updateDraftAudioSetting('loopMusic', !draftAudioSettings.loopMusic)}><span /></button>
              </div>
              <div className="setting-row setting-toggle-row compact">
                <div><strong>LOWER MUSIC DURING NARRATION</strong><small>Temporarily lowers music while the scenario voice is speaking.</small></div>
                <button className={`setting-switch ${draftAudioSettings.duckDuringNarration ? 'active' : ''}`} type="button" role="switch" aria-checked={draftAudioSettings.duckDuringNarration} onClick={() => updateDraftAudioSetting('duckDuringNarration', !draftAudioSettings.duckDuringNarration)}><span /></button>
              </div>
            </div>

            <div className="settings-group">
              <div className="setting-row setting-toggle-row">
                <div><strong>INTERFACE SOUND EFFECTS</strong><small>Play a short sound when interface buttons are selected.</small></div>
                <button className={`setting-switch ${draftAudioSettings.soundEffectsEnabled ? 'active' : ''}`} type="button" role="switch" aria-checked={draftAudioSettings.soundEffectsEnabled} onClick={() => updateDraftAudioSetting('soundEffectsEnabled', !draftAudioSettings.soundEffectsEnabled)}><span /></button>
              </div>
              <label className={`setting-row slider-row ${!draftAudioSettings.soundEffectsEnabled ? 'disabled' : ''}`}>
                <span><strong>EFFECTS VOLUME</strong><output>{draftAudioSettings.soundEffectsVolume}%</output></span>
                <input type="range" min="0" max="100" step="1" value={draftAudioSettings.soundEffectsVolume} disabled={!draftAudioSettings.soundEffectsEnabled} onChange={(event) => updateDraftAudioSetting('soundEffectsVolume', Number(event.target.value))} />
              </label>
              <p className="settings-note">Scenario Play, Pause, Replay and Mute controls intentionally do not use interface sound effects.</p>
            </div>

            <div className="music-credit">
              <strong>NOW PLAYING</strong>
              <span>Max Brhon – Cyberpunk [NCS Release] • Music provided by NoCopyrightSounds</span>
            </div>

            <footer className="settings-modal-footer">
              <button className="settings-cancel" type="button" onClick={() => setSettingsOpen(false)}>CANCEL</button>
              <button className="settings-save" type="button" onClick={saveAudioSettings}>SAVE OPTIONS</button>
            </footer>
          </section>
        </div>
      )}
    </main>
  )
}

export default Gameplay
