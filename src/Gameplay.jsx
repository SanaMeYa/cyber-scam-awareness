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

import TrainingLibrary from './training/TrainingLibrary.jsx'
import useTrainingProgress from './training/useTrainingProgress.js'
import { attackTrainingRequirements, learningModuleCatalog } from './training/trainingRegistry.js'
import { getPreferredNarrationVoice } from './training/narrationVoices.js'
import HowToPlay from './pages/HowToPlay.jsx'

// Scenario/briefing narration is generated live per selected target (the text
// is dynamic, not a fixed script), so it uses Kokoro TTS directly in the
// browser (kokoro-js — no Python/pip required) rather than pre-baked audio
// files. Generation runs in narrationWorker.js on a separate thread — Kokoro's
// generate() call is real WASM computation, and running it on the main
// thread was blocking UI responsiveness (button presses lagging) while it
// worked. This file just sends { text, voice } to the worker and gets a
// { blob } back; the worker owns loading/caching the model itself.
// NOTE: American ('af_'/'am_') voices are the most reliably supported path in
// kokoro-js today. British ('bf_'/'bm_') voices can throw "Invalid language
// identifier" errors on some kokoro-js/model builds — if you want a British
// voice, test it in isolation first before wiring it back in here.
const NARRATION_VOICE = 'af_bella'

let narrationWorker = null
let narrationRequestId = 0
const narrationWorkerRequests = new Map()

function resetNarrationWorker(error) {
  const failedWorker = narrationWorker
  narrationWorker = null

  if (failedWorker) {
    failedWorker.onmessage = null
    failedWorker.onerror = null
    failedWorker.onmessageerror = null
    failedWorker.terminate()
  }

  narrationWorkerRequests.forEach(({ reject }) => reject(error))
  narrationWorkerRequests.clear()
}

function getNarrationWorker() {
  if (!narrationWorker) {
    narrationWorker = new Worker(new URL('./narrationWorker.js', import.meta.url), { type: 'module' })
    narrationWorker.onmessage = (event) => {
      const { id, blob, error } = event.data
      const pending = narrationWorkerRequests.get(id)
      if (!pending) return
      narrationWorkerRequests.delete(id)
      if (error) pending.reject(new Error(error))
      else pending.resolve(blob)
    }
    narrationWorker.onerror = (event) => {
      // The worker itself failed to load/run — fail every request currently
      // waiting on it, then discard it so the next request creates a fresh
      // worker instead of posting to a permanently failed instance.
      event.preventDefault()
      resetNarrationWorker(new Error(event.message || 'Narration worker failed'))
    }
    narrationWorker.onmessageerror = () => {
      resetNarrationWorker(new Error('Narration worker returned an unreadable response'))
    }
  }
  return narrationWorker
}

function generateNarrationBlob(text, voice) {
  const worker = getNarrationWorker()
  const id = ++narrationRequestId
  return new Promise((resolve, reject) => {
    narrationWorkerRequests.set(id, { resolve, reject })
    try {
      worker.postMessage({ id, text, voice })
    } catch (error) {
      narrationWorkerRequests.delete(id)
      reject(error)
    }
  })
}

// A cold Kokoro start must download and initialise the model before it can
// generate the narration. That can take tens of seconds, especially after
// clearing the browser cache. The full set of chunks is prepared before
// playback begins so narration does not pause between sentences while it
// waits for the next chunk to finish generating.
const KOKORO_NARRATION_TIMEOUT_MS = 180_000

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Kokoro narration timed out')), ms)
    promise.then(
      (value) => { clearTimeout(timer); resolve(value) },
      (error) => { clearTimeout(timer); reject(error) },
    )
  })
}

// Persists generated narration clips across page reloads via IndexedDB
// (localStorage can't hold binary audio at any useful size, and blob: URLs
// from URL.createObjectURL() only live for the current page load). Once a
// chunk's Blob is found here, playback skips Kokoro/WASM entirely for it —
// only genuinely new/changed lines ever need the model loaded at all.
//
// Bump NARRATION_CACHE_VERSION to invalidate every previously cached clip
// (e.g. after changing voice or chunking behaviour) — old entries are
// simply never read again after that; they don't need to be deleted.
const NARRATION_CACHE_VERSION = 1
const NARRATION_DB_NAME = 'breach-point-narration'
const NARRATION_STORE_NAME = 'chunks'

function openNarrationDb() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB unavailable'))
      return
    }
    const request = indexedDB.open(NARRATION_DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(NARRATION_STORE_NAME)) {
        request.result.createObjectStore(NARRATION_STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function readCachedChunkBlob(key) {
  try {
    const db = await openNarrationDb()
    return await new Promise((resolve, reject) => {
      const store = db.transaction(NARRATION_STORE_NAME, 'readonly').objectStore(NARRATION_STORE_NAME)
      const request = store.get(key)
      request.onsuccess = () => resolve(request.result ?? null)
      request.onerror = () => reject(request.error)
    })
  } catch {
    return null // Private browsing / unsupported browser — just fall back to generating.
  }
}

async function writeCachedChunkBlob(key, blob) {
  try {
    const db = await openNarrationDb()
    await new Promise((resolve, reject) => {
      const store = db.transaction(NARRATION_STORE_NAME, 'readwrite').objectStore(NARRATION_STORE_NAME)
      store.put(blob, key)
      store.transaction.oncomplete = () => resolve()
      store.transaction.onerror = () => reject(store.transaction.error)
    })
  } catch {
    // Non-fatal — narration still plays for this session, it just won't persist.
  }
}

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
    vulnerabilities: { phishing: ['teams'] },
    resistances: { social: ['linkedin', 'facebook', 'instagram'] },
    lockedMessage: 'Complete an effective attack against Jordan or Priya to unlock Manager targets.',
  },
  {
    id: 'sarah', name: 'Sarah Lindqvist', initials: 'SL', role: 'HR Manager', tier: 3,
    tierLabel: 'Manager', tone: 'amber', image: sarahPortrait,
    traits: ['Responds to empathy-based appeals', 'Verifies sensitive requests by phone', 'Trusted contact for staff problems'],
    scenario: 'HR receives a sensitive request concerning an employee who may need urgent support before an upcoming meeting. The situation sounds personal and time-sensitive, but acting on it could involve confidential staff information. Sarah must balance a quick, compassionate response with the verification procedures expected of her department.',
    transcript: 'Iris: Sarah moved into HR from a people-focused role and has become the manager employees approach when they are dealing with genuine problems. A previous near-miss led her to introduce phone-verification procedures for sensitive requests, and she follows that rule firmly. In most other situations, however, she is willing to be flexible when someone appears distressed or urgently needs help.',
    vulnerabilities: { phishing: ['email'], social: ['facebook'] },
    resistances: { phishing: ['vishing'] },
    lockedMessage: 'Complete an effective attack against Jordan or Priya to unlock Manager targets.',
  },
  {
    id: 'marcus', name: 'Marcus Reyes', initials: 'MR', role: 'CEO', tier: 4,
    tierLabel: 'CEO', tone: 'red', image: marcusPortrait,
    traits: ['High-profile speaker with public footage', 'Contact is filtered through an assistant', 'Requires strong prior intelligence'],
    scenario: 'A high-impact request is timed for a narrow gap between executive meetings and appears relevant to an upcoming company decision. Marcus normally receives information through his executive assistant, so unexpected direct contact is unusual. The request must look consistent with his schedule and established communication pathways before it receives attention.',
    transcript: 'Iris: Marcus is the public face of Solstice and is comfortable speaking at industry keynotes, recorded interviews and podcasts. Those appearances have created a large amount of publicly available audio and video, but reaching him directly remains difficult. Most requests are filtered through his executive assistant, and he has become accustomed to relying on that process rather than personally checking every new contact.',
    vulnerabilities: { deepfake: ['voice', 'video'] },
    resistances: { phishing: ['email', 'teams'], social: ['linkedin', 'facebook', 'instagram'] },
    lockedMessage: 'Complete an effective attack against a Manager to unlock the CEO.',
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


const intelUnlocks = {
  jordan: {
    targetId: 'derek', targetName: 'Derek Combs',
    clue: 'Internal support messages show that Derek responds confidently when a request uses familiar technical language and appears to come from another IT worker.',
    boost: { technique: 'phishing', subtype: 'teams' },
  },
  priya: {
    targetId: 'sarah', targetName: 'Sarah Lindqvist',
    clue: 'Reception notes show that Sarah is the trusted contact for urgent staff problems and often prioritises requests that appear personal and time-sensitive.',
    boost: { technique: 'phishing', subtype: 'email' },
  },
  derek: {
    targetId: 'marcus', targetName: 'Marcus Reyes',
    clue: 'IT records point to a large archive of Marcus speaking at public events, including clean recordings where his voice can be heard clearly.',
    boost: { technique: 'deepfake', subtype: 'voice' },
  },
  sarah: {
    targetId: 'marcus', targetName: 'Marcus Reyes',
    clue: 'Executive scheduling notes reveal when Marcus is between meetings and more likely to receive an unusual request without his assistant present.',
    boost: { technique: 'deepfake', subtype: 'video' },
  },
}

const startingFunds = 5_000_000
const idleWarningDelay = 10 * 60 * 1000
const idleReturnDelay = 60 * 1000
const formatMoney = (value) => new Intl.NumberFormat('en-AU', {
  style: 'currency', currency: 'AUD', maximumFractionDigits: 0,
}).format(value)


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
  const trainingLibraryRef = useRef(null)
  const [trainingAudioPlaying, setTrainingAudioPlaying] = useState(false)
  const { completedModuleIds, completeModule, isModuleComplete, resetProgress } = useTrainingProgress()
  const [selectedTargetId, setSelectedTargetId] = useState('jordan')
  const [selectedTechnique, setSelectedTechnique] = useState('')
  const [subtypes, setSubtypes] = useState({ phishing: 'email', social: 'linkedin', deepfake: 'voice' })
  const [funds, setFunds] = useState(startingFunds)
  const [exposure, setExposure] = useState(0)
  const [turn, setTurn] = useState(0)
  const [employeeCleared, setEmployeeCleared] = useState(false)
  const [managerCleared, setManagerCleared] = useState(false)
  const [successfulTargetIds, setSuccessfulTargetIds] = useState(() => new Set())
  const [targetAttemptCounts, setTargetAttemptCounts] = useState({})
  const [techniqueCounts, setTechniqueCounts] = useState({ phishing: 0, social: 0, deepfake: 0 })
  const [result, setResult] = useState(null)
  const [pendingResult, setPendingResult] = useState(null)
  const [defenseSelection, setDefenseSelection] = useState(null)
  const [narrationState, setNarrationState] = useState('idle')
  const [narrationMuted, setNarrationMuted] = useState(false)
  const musicRef = useRef(null)
  const clickAudioContextRef = useRef(null)
  const idleWarningOpenRef = useRef(false)
  const [idleWarningOpen, setIdleWarningOpen] = useState(false)
  const [pendingLeaveAction, setPendingLeaveAction] = useState(null) // 'home' | 'restart' | null
  const [idleSecondsRemaining, setIdleSecondsRemaining] = useState(idleReturnDelay / 1000)
  const [idleSessionKey, setIdleSessionKey] = useState(0)
  const narrationAudioRef = useRef(null)
  const narrationCacheRef = useRef(new Map())
  const narrationTokenRef = useRef(0)
  const narrationEngineRef = useRef(null) // 'kokoro' | 'speech' | null — which engine is currently active

  const roundLocked = Boolean(pendingResult || result)

  const selectedTarget = useMemo(
    () => targets.find((target) => target.id === selectedTargetId) ?? targets[0],
    [selectedTargetId],
  )

  const buildNarrationText = (target) => {
    const irisBriefing = target.transcript.replace(/^Iris:\s*/i, '')
    return `Scenario. ${target.scenario} Briefing from Iris. ${irisBriefing}`
  }

  const narrationText = useMemo(() => buildNarrationText(selectedTarget), [selectedTarget])

  // Kokoro has a hard ceiling of ~510 phoneme tokens per generate() call and
  // kokoro-js does not chunk long text itself — it just truncates silently,
  // which is why narration was cutting off partway through. Splitting on
  // sentence boundaries (and hard-splitting any single sentence that's still
  // too long) keeps every chunk safely under that ceiling. 180 chars is a
  // conservative margin, since punctuation/spaces count as tokens too and
  // some words phonemize to more tokens than characters.
  const chunkNarrationText = (text, maxChars = 180) => {
    const sentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [text.trim()]
    const chunks = []
    let current = ''

    for (const sentence of sentences) {
      if (sentence.length > maxChars) {
        if (current) {
          chunks.push(current)
        }
        let remaining = sentence
        while (remaining.length > maxChars) {
          const splitAt = remaining.lastIndexOf(' ', maxChars) || maxChars
          chunks.push(remaining.slice(0, splitAt).trim())
          remaining = remaining.slice(splitAt).trim()
        }
        current = remaining
        continue
      }

      const candidate = current ? `${current} ${sentence}` : sentence
      if (candidate.length > maxChars) {
        chunks.push(current)
        current = sentence
      } else {
        current = candidate
      }
    }

    if (current) chunks.push(current)
    return chunks
  }

  // Returns an ARRAY OF PROMISES (one per chunk), not a promise of an array —
  // so chunk 0 can start playing the moment it's ready, without waiting on
  // the rest of the briefing to finish generating. Each chunk checks
  // IndexedDB first (readCachedChunkBlob) and, if found, skips Kokoro
  // entirely — that's what makes narration persist across reloads. Only a
  // genuine cache miss falls through to generating (still one at a time;
  // a single WASM session isn't meant for concurrent generate() calls), and
  // the whole per-chunk array is cached in memory too so a background
  // preload and an explicit Play press never trigger duplicate generations.
  const getCachedNarrationChunks = (text) => {
    const cache = narrationCacheRef.current
    if (!cache.has(text)) {
      const chunkTexts = chunkNarrationText(text)
      const chunkPromises = []
      chunkTexts.forEach((chunkText, index) => {
        const previous = chunkPromises[index - 1] ?? Promise.resolve()
        const dbKey = `v${NARRATION_CACHE_VERSION}::${NARRATION_VOICE}::${chunkText}`
        const chunkPromise = previous.then(async () => {
          const cachedBlob = await readCachedChunkBlob(dbKey)
          if (cachedBlob) return URL.createObjectURL(cachedBlob)

          const blob = await generateNarrationBlob(chunkText, NARRATION_VOICE)
          writeCachedChunkBlob(dbKey, blob) // fire-and-forget; don't block playback on the write
          return URL.createObjectURL(blob)
        })
        chunkPromises.push(chunkPromise)
      })
      cache.set(text, chunkPromises)

      // A rejected promise must not remain in the in-memory cache. Removing
      // the entry lets the next Play/Replay request genuinely retry Kokoro.
      Promise.all(chunkPromises).catch((error) => {
        if (cache.get(text) === chunkPromises) cache.delete(text)
        console.error('Kokoro narration could not be prepared:', error)
      })
    }
    return cache.get(text)
  }

  useEffect(() => {
    // TEMPORARILY DISABLED — reports of the page crashing after this was
    // added. Most likely cause: if the "Invalid language identifier" issue
    // is still unresolved, this was attempting 5 sequential failing WASM
    // generations on every load instead of 1, which is a much heavier hit
    // right at startup. Re-enable once a single Play-triggered generation
    // is confirmed reliably working, ideally after the kokoro-js/model
    // version investigation. To re-enable, restore the loop below:
    //
    // let cancelled = false
    // const preloadOrder = [selectedTarget, ...targets.filter((target) => target.id !== selectedTarget.id)]
    // ;(async () => {
    //   for (const target of preloadOrder) {
    //     if (cancelled) return
    //     try {
    //       await Promise.all(getCachedNarrationChunks(buildNarrationText(target)))
    //     } catch (error) {
    //       console.error(`Kokoro narration preload failed for "${target.id}":`, error)
    //     }
    //   }
    // })()
    // return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const narrationCache = narrationCacheRef.current

    return () => {
      narrationTokenRef.current += 1
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      if (narrationAudioRef.current) {
        narrationAudioRef.current.pause()
        narrationAudioRef.current = null
      }
      narrationCache.forEach((chunkPromises) => {
        chunkPromises.forEach((chunkPromise) => {
          chunkPromise.then((url) => URL.revokeObjectURL(url)).catch(() => {})
        })
      })
      narrationCache.clear()
    }
  }, [])

  useEffect(() => {
    const music = musicRef.current
    if (!music) return

    const narrationIsPlaying = narrationState === 'playing' || trainingAudioPlaying
    const duckingMultiplier = audioSettings.duckDuringNarration && narrationIsPlaying ? 0.28 : 1
    music.volume = (audioSettings.musicVolume / 100) * duckingMultiplier
    music.loop = audioSettings.loopMusic
  }, [audioSettings.duckDuringNarration, audioSettings.loopMusic, audioSettings.musicVolume, narrationState, trainingAudioPlaying])

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
    if (!pendingLeaveAction) return undefined

    const cancelOnEscape = (event) => {
      if (event.key === 'Escape') setPendingLeaveAction(null)
    }

    window.addEventListener('keydown', cancelOnEscape)
    return () => window.removeEventListener('keydown', cancelOnEscape)
  }, [pendingLeaveAction])

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

  useEffect(() => {
    let warningTimer
    let returnTimer
    let countdownTimer

    const returnToHome = () => { resetProgress(); navigate('/', { replace: true }) }

    const showIdleWarning = () => {
      idleWarningOpenRef.current = true
      setIdleWarningOpen(true)
      setIdleSecondsRemaining(idleReturnDelay / 1000)

      countdownTimer = window.setInterval(() => {
        setIdleSecondsRemaining((seconds) => Math.max(0, seconds - 1))
      }, 1000)
      returnTimer = window.setTimeout(returnToHome, idleReturnDelay)
    }

    const scheduleIdleWarning = () => {
      window.clearTimeout(warningTimer)
      warningTimer = window.setTimeout(showIdleWarning, idleWarningDelay)
    }

    const registerActivity = () => {
      if (!idleWarningOpenRef.current) scheduleIdleWarning()
    }

    const activityEvents = ['pointerdown', 'keydown', 'touchstart', 'scroll']
    activityEvents.forEach((eventName) => window.addEventListener(eventName, registerActivity, { passive: true }))
    scheduleIdleWarning()

    return () => {
      window.clearTimeout(warningTimer)
      window.clearTimeout(returnTimer)
      window.clearInterval(countdownTimer)
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, registerActivity))
    }
  }, [idleSessionKey, navigate, resetProgress])

  const continueAfterIdle = () => {
    idleWarningOpenRef.current = false
    setIdleWarningOpen(false)
    setIdleSecondsRemaining(idleReturnDelay / 1000)
    setIdleSessionKey((key) => key + 1)
  }

  const returnHome = () => {
    idleWarningOpenRef.current = false
    navigate('/', { replace: true })
  }

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
    if (!restart && narrationState === 'paused') {
      if (narrationEngineRef.current === 'speech') {
        window.speechSynthesis.resume()
      } else if (narrationAudioRef.current) {
        narrationAudioRef.current.play().catch((error) => {
          console.error('Narration resume failed:', error)
          setNarrationState('unsupported')
        })
      }
      setNarrationMuted(false)
      setNarrationState('playing')
      return
    }

    const token = ++narrationTokenRef.current
    if (narrationEngineRef.current === 'speech') window.speechSynthesis.cancel()
    if (narrationAudioRef.current) {
      narrationAudioRef.current.pause()
      narrationAudioRef.current = null
    }
    narrationEngineRef.current = null
    setNarrationMuted(false)
    setNarrationState('loading')

    // Speaks the FULL text immediately with the browser's built-in voice —
    // used as a stopgap when Kokoro isn't ready fast enough (see below).
    // No chunking needed here; speechSynthesis has no token ceiling to
    // worry about the way Kokoro does.
    const speakWithBrowserFallback = () => {
      if (!('speechSynthesis' in window)) {
        setNarrationState('unsupported')
        return
      }
      const utterance = new SpeechSynthesisUtterance(narrationText)
      utterance.voice = getPreferredNarrationVoice()
      utterance.lang = utterance.voice?.lang ?? 'en-AU'
      utterance.rate = 0.92
      utterance.pitch = 1.04
      utterance.volume = 1
      utterance.onstart = () => {
        if (token !== narrationTokenRef.current) return
        narrationEngineRef.current = 'speech'
        setNarrationState('playing')
      }
      utterance.onend = () => {
        if (token !== narrationTokenRef.current) return
        setNarrationState('idle')
      }
      utterance.onerror = () => {
        if (token !== narrationTokenRef.current) return
        setNarrationState('unsupported')
      }
      window.speechSynthesis.speak(utterance)
    }

    // Plays chunk `index`, then automatically advances to the next chunk as
    // soon as this one finishes — so the whole briefing reads start to
    // finish, not just the first ~510-token chunk.
    const playChunkAt = (chunkPromises, index) => {
      if (token !== narrationTokenRef.current) return
      const chunkPromise = chunkPromises[index]
      if (!chunkPromise) {
        setNarrationState('idle')
        return
      }

      chunkPromise
        .then((url) => {
          if (token !== narrationTokenRef.current) return
          narrationEngineRef.current = 'kokoro'
          const audio = new Audio(url)
          audio.volume = 1
          audio.onplaying = () => {
            if (token !== narrationTokenRef.current) return
            setNarrationState('playing')
          }
          audio.onended = () => {
            if (token !== narrationTokenRef.current) return
            playChunkAt(chunkPromises, index + 1)
          }
          audio.onerror = (event) => {
            if (token !== narrationTokenRef.current) return
            console.error('Narration audio playback failed:', event)
            setNarrationState('unsupported')
          }
          narrationAudioRef.current = audio
          audio.play().catch((error) => {
            console.error('Narration playback failed to start:', error)
            if (token === narrationTokenRef.current) setNarrationState('unsupported')
          })
        })
        .catch((error) => {
          console.error(`Kokoro narration generation failed on chunk ${index + 1}:`, error)
          if (token === narrationTokenRef.current) setNarrationState('unsupported')
        })
    }

    const chunkPromises = getCachedNarrationChunks(narrationText)

    // Prepare every chunk before playback starts. Previously, playback began
    // as soon as chunk 1 was available, which could leave a long silent gap
    // while chunk 2 was still being generated. Cached narration still starts
    // almost immediately because every promise resolves from IndexedDB.
    withTimeout(Promise.all(chunkPromises), KOKORO_NARRATION_TIMEOUT_MS)
      .then(() => {
        if (token !== narrationTokenRef.current) return
        playChunkAt(chunkPromises, 0)
      })
      .catch((error) => {
        if (token !== narrationTokenRef.current) return
        console.warn('Kokoro narration unavailable; using browser speech fallback:', error)
        speakWithBrowserFallback()
      })
  }

  const pauseNarration = () => {
    if (narrationState !== 'playing') return
    if (narrationEngineRef.current === 'speech') {
      window.speechSynthesis.pause()
      setNarrationState('paused')
    } else if (narrationAudioRef.current) {
      narrationAudioRef.current.pause()
      setNarrationState('paused')
    }
  }

  const toggleNarrationMute = () => {
    if (!narrationMuted) {
      narrationTokenRef.current += 1
      if (narrationEngineRef.current === 'speech') window.speechSynthesis.cancel()
      if (narrationAudioRef.current) {
        narrationAudioRef.current.pause()
        narrationAudioRef.current = null
      }
      narrationEngineRef.current = null
      setNarrationState('idle')
      setNarrationMuted(true)
    } else {
      setNarrationMuted(false)
    }
  }

  const stopNarration = () => {
    narrationTokenRef.current += 1
    if (narrationEngineRef.current === 'speech') window.speechSynthesis.cancel()
    if (narrationAudioRef.current) {
      narrationAudioRef.current.pause()
      narrationAudioRef.current = null
    }
    narrationEngineRef.current = null
    setNarrationState('idle')
    setNarrationMuted(false)
  }

  const targetLocked = (target) => {
    if (successfulTargetIds.has(target.id)) return true
    if (target.tier === 3) return !employeeCleared
    if (target.tier === 4) return !managerCleared
    return false
  }

  const unlockedIntel = Object.entries(intelUnlocks)
    .filter(([sourceTargetId]) => successfulTargetIds.has(sourceTargetId))
    .map(([sourceTargetId, intel]) => ({ ...intel, sourceTargetId }))

  const selectedTargetIntel = unlockedIntel.filter((intel) => intel.targetId === selectedTarget.id)

  const matchingIntel = (targetId, technique, subtype) => unlockedIntel.filter((intel) =>
    intel.targetId === targetId && intel.boost.technique === technique && intel.boost.subtype === subtype)

  const selectedOption = techniques.find((item) => item.id === selectedTechnique)
    ?.options.find((option) => option.id === subtypes[selectedTechnique])


  const requiredModuleForAttack = (techniqueId, subtypeId) => attackTrainingRequirements[techniqueId]?.[subtypeId] ?? null

  const isAttackTypeLocked = (techniqueId, subtypeId) => {
    const moduleId = requiredModuleForAttack(techniqueId, subtypeId)
    return Boolean(moduleId && !isModuleComplete(moduleId))
  }

  const selectedRequiredModuleId = requiredModuleForAttack(selectedTechnique, subtypes[selectedTechnique])
  const selectedAttackLocked = isAttackTypeLocked(selectedTechnique, subtypes[selectedTechnique])
  const selectedRequiredModule = learningModuleCatalog.find((module) => module.id === selectedRequiredModuleId)

  const resetGame = () => {
    stopNarration()
    resetProgress()
    setSelectedTargetId('jordan'); setSelectedTechnique(''); setFunds(startingFunds)
    setExposure(0); setTurn(0); setEmployeeCleared(false); setManagerCleared(false)
    setSuccessfulTargetIds(new Set())
    setTargetAttemptCounts({}); setResult(null)
    setTechniqueCounts({ phishing: 0, social: 0, deepfake: 0 })
    setPendingResult(null); setDefenseSelection(null)
    trainingLibraryRef.current?.closeAll()
    setTrainingAudioPlaying(false)
    setNarrationState('idle'); setNarrationMuted(false)
  }

  const openLearningModule = (moduleId) => trainingLibraryRef.current?.openModule(moduleId)

  const selectTechnique = (techniqueId) => {
    if (roundLocked) return
    setSelectedTechnique(techniqueId)
  }

  const changeTechniqueSubtype = (techniqueId, subtypeId) => {
    if (roundLocked) return
    setSelectedTechnique(techniqueId)
    setSubtypes((current) => ({ ...current, [techniqueId]: subtypeId }))
  }

  const selectTarget = (id) => {
    if (roundLocked || successfulTargetIds.has(id)) return
    stopNarration()
    setSelectedTargetId(id); setSelectedTechnique(''); setResult(null)
  }

  const runSimulation = () => {
    if (!selectedTechnique || selectedAttackLocked || targetLocked(selectedTarget) || roundLocked) return
    const subtype = subtypes[selectedTechnique]
    const selectedDefense = defenses[selectedTechnique][subtype]
    const isStrong = selectedTarget.vulnerabilities[selectedTechnique]?.includes(subtype)
    const isWeak = selectedTarget.resistances[selectedTechnique]?.includes(subtype)
    const nextRepeatCount = (targetAttemptCounts[selectedTarget.id] ?? 0) + 1

    const traitMatch = isStrong ? 'positive' : isWeak ? 'negative' : 'neutral'
    const matchingIntelCount = matchingIntel(selectedTarget.id, selectedTechnique, subtype).length
    const intelLevel = matchingIntelCount > 1 ? 'multiple'
      : matchingIntelCount === 1 ? 'relevant' : 'none'

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

    setPendingResult({
      ...turnResult,
      traitMatch,
      effectiveMatch: isStrong,
      resistedMatch: isWeak,
      targetCompleted: turnResult.success && isStrong,
      intelReward: intelUnlocks[selectedTarget.id] ?? null,
      nextRepeatCount,
    })
  }

  const launchSimulation = () => {
    if (!selectedTechnique || selectedAttackLocked || targetLocked(selectedTarget) || roundLocked) return
    runSimulation()
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
    setTargetAttemptCounts((current) => ({
      ...current,
      [selectedTarget.id]: pendingResult.nextRepeatCount,
    }))

    const nextSuccessfulTargetIds = new Set(successfulTargetIds)
    if (pendingResult.targetCompleted) nextSuccessfulTargetIds.add(selectedTarget.id)

    if (pendingResult.targetCompleted && selectedTarget.tier === 1) setEmployeeCleared(true)
    if (pendingResult.targetCompleted && selectedTarget.tier === 3) setManagerCleared(true)
    setSuccessfulTargetIds(nextSuccessfulTargetIds)

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

  // HOME and RESTART both discard the run, so they ask first. The idle warning's
  // own RETURN HOME button and the idle auto-return skip this on purpose.
  const confirmLeaveAction = () => {
    const action = pendingLeaveAction
    setPendingLeaveAction(null)
    if (action === 'home') {
      resetProgress()
      returnHome()
    }
    if (action === 'restart') resetGame()
  }

  const [howToPlayOpen, setHowToPlayOpen] = useState(false)
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
            <div className="system-status-line"><span><i />SIMULATION ONLINE</span><span>LOCAL SESSION</span><span>SESSION PROGRESS SAVED</span></div>
          </div>
          <div className="header-actions">
            <TrainingLibrary
              ref={trainingLibraryRef}
              completedModuleIds={completedModuleIds}
              onModuleComplete={completeModule}
              onAudioChange={setTrainingAudioPlaying}
              onBeforeModuleOpen={stopNarration}
            />
            <button className="utility-button" type="button" onClick={() => setPendingLeaveAction('home')}>
              <span className="navigation-icon" aria-hidden="true">⌂</span> HOME
            </button>
            <button className="utility-button" type="button" onClick={() => { stopNarration(); setHowToPlayOpen(true) }}>
              <span className="navigation-icon help-icon" aria-hidden="true">?</span> HOW TO PLAY
            </button>
            <button className="utility-button" type="button" onClick={openAudioSettings} aria-haspopup="dialog">
              <span className="settings-icon">⚙</span> SETTINGS
              <span className={`audio-status-dot ${audioSettings.musicEnabled ? 'active' : ''}`} aria-label={`Music ${audioSettings.musicEnabled ? 'on' : 'off'}`} />
            </button>
            <button className="utility-button" type="button" onClick={() => setPendingLeaveAction('restart')}><span className="restart-icon">↻</span> RESTART</button>
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
          <div className="meter-value funds-value"><strong>{formatMoney(funds)}</strong></div>
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
                const intelCount = unlockedIntel.filter((intel) => intel.targetId === target.id).length
                return <button className={`target-row ${target.id === selectedTargetId ? 'selected' : ''} ${successful ? 'completed' : ''}`} key={target.id} type="button" disabled={locked || roundLocked} title={successful ? `${target.name}: attack successful` : locked ? target.lockedMessage : roundLocked ? 'Complete the current round first' : `Select ${target.name}`} onClick={() => selectTarget(target.id)}>
                  <span className={`mini-avatar ${target.tone}`}><img src={target.image} alt="" /></span>
                  <span className="target-row-copy"><strong>{target.name}</strong><small>{target.role}</small></span>
                  <span className={`level-tag ${successful ? 'success' : intelCount ? 'has-intel' : ''}`}>{successful ? 'ATTACK SUCCESSFUL' : intelCount ? `INTEL ${intelCount}` : locked ? 'LOCKED' : `LEVEL ${target.tier}`}</span>
                </button>
              })}
            </div>
          </article>

          <article className="scenario-panel glass-panel">
            {!result ? <>
              <div className="section-kicker">SCENARIO</div><p className="scenario-copy">{selectedTarget.scenario}</p>
              <section className={`target-intel-brief ${selectedTargetIntel.length ? 'unlocked' : ''}`} aria-label={`Intelligence for ${selectedTarget.name}`}>
                <div className="intel-brief-heading">
                  <span>TARGET INTELLIGENCE // {selectedTarget.name}</span>
                  <strong>{selectedTargetIntel.length ? `${selectedTargetIntel.length} CLUE${selectedTargetIntel.length === 1 ? '' : 'S'}` : 'NO INTEL'}</strong>
                </div>
                {selectedTargetIntel.length
                  ? selectedTargetIntel.map((intel) => <p className="intel-clue" key={intel.sourceTargetId}>{intel.clue}</p>)
                  : <p>No additional intelligence has been gathered for this target. Successful attacks on other employees may reveal a useful lead.</p>}
              </section>
              <div className="audio-controls" aria-label="Narration controls">
                <button className={narrationState === 'playing' ? 'active' : ''} type="button" aria-label={narrationState === 'paused' ? 'Resume narration' : 'Play narration'} disabled={narrationState === 'unsupported' || narrationState === 'loading'} onClick={() => playNarration(false)}><span>▶</span> {narrationState === 'loading' ? 'LOADING…' : narrationState === 'paused' ? 'RESUME' : 'PLAY'}</button>
                <button className={narrationState === 'paused' ? 'active' : ''} type="button" aria-label="Pause narration" disabled={narrationState !== 'playing'} onClick={pauseNarration}><span>Ⅱ</span> PAUSE</button>
                <button type="button" aria-label="Replay narration from the beginning" disabled={narrationState === 'unsupported' || narrationState === 'loading'} onClick={() => playNarration(true)}><span>↻</span> REPLAY</button>
                <button className={narrationMuted ? 'active muted' : ''} type="button" aria-label={narrationMuted ? 'Unmute narration' : 'Mute narration'} aria-pressed={narrationMuted} disabled={narrationState === 'unsupported'} onClick={toggleNarrationMute}><span>{narrationMuted ? '🔈' : '🔇'}</span> {narrationMuted ? 'UNMUTE' : 'MUTE'}</button>
              </div>
              <div className="transcript-box"><div className="transcript-heading"><span>TRANSCRIPT</span><span>{narrationState === 'unsupported' ? 'VOICE UNAVAILABLE' : narrationMuted ? 'NARRATION MUTED' : narrationState === 'loading' ? 'GENERATING NARRATION…' : narrationState === 'playing' ? 'NARRATION PLAYING' : narrationState === 'paused' ? 'NARRATION PAUSED' : 'VISIBLE NARRATION'}</span></div><p>{selectedTarget.transcript}</p></div>
            </> : <div className="round-result" aria-live="polite">
              <div className="result-topline">
                <div>
                  <span className="section-kicker">ROUND RESULT</span>
                  <h2>{result.targetCompleted ? 'Effective Attack' : result.success ? 'Limited Impact' : 'Attack Blocked'}</h2>
                </div>
                <span className={`result-badge ${result.targetCompleted ? 'effective' : result.success ? 'partial' : 'risky'}`}>
                  {result.targetCompleted ? '✓ TARGET COMPLETED' : result.success ? '• TARGET REMAINS ACTIVE' : '! ATTACK BLOCKED'}
                </span>
              </div>
              <div className="result-impact"><div><small>COMPANY DAMAGE</small><strong>−{formatMoney(result.damage)}</strong></div><div><small>EXPOSURE GAIN</small><strong>+{result.alertIncrease}%</strong></div></div>
              <p>{result.dialogue.line}</p><div className="defence-note"><strong>DEFENSIVE LESSON</strong><span>{result.dialogue.tag}</span></div>
              {result.targetCompleted && result.intelReward && <div className="intel-unlock-notice">
                <strong>NEW TARGET INTELLIGENCE</strong>
                <span>Your successful {techniques.find((item) => item.id === selectedTechnique)?.title} attack on {selectedTarget.name} uncovered a lead on {result.intelReward.targetName}.</span>
                <p>{result.intelReward.clue}</p>
              </div>}
              {result.success && !result.targetCompleted && <div className="match-warning">This attempt caused limited simulated damage, but it did not match {selectedTarget.name}&apos;s vulnerabilities. The target remains active.</div>}
              {result.fatigue && <div className="fatigue-warning">Repeated contact made {selectedTarget.name} more alert.</div>}
            </div>}
          </article>
        </section>

        <section className="technique-section glass-panel">
          <div className="technique-heading">CHOOSE A TECHNIQUE AND TYPE</div>
          <div className="technique-layout">
            <div className="technique-cards">
              {techniques.map((technique) => {
                const activeSubtype = subtypes[technique.id]
                const activeTypeLocked = isAttackTypeLocked(technique.id, activeSubtype)

                return (
                  <article key={technique.id} className={`technique-card ${selectedTechnique === technique.id ? 'selected' : ''} ${roundLocked ? 'locked' : ''} ${selectedTechnique === technique.id && activeTypeLocked ? 'training-locked' : ''}`} onClick={() => selectTechnique(technique.id)}>
                    <button className="technique-main" type="button" disabled={roundLocked} aria-pressed={selectedTechnique === technique.id}>
                      <span className="technique-icon">{technique.icon}</span><span><strong>{technique.title}</strong><small>{technique.description}</small></span>
                    </button>
                    <label><span>TYPE</span><select value={activeSubtype} disabled={roundLocked} onClick={(event) => event.stopPropagation()} onChange={(event) => changeTechniqueSubtype(technique.id, event.target.value)}>
                      {technique.options.map((option) => {
                        const moduleId = requiredModuleForAttack(technique.id, option.id)
                        const locked = isAttackTypeLocked(technique.id, option.id)
                        const status = locked ? '🔒 ' : moduleId ? '✓ ' : ''
                        return <option key={option.id} value={option.id}>{status}{option.label}{locked ? ' — Complete module' : ''}</option>
                      })}
                    </select></label>
                  </article>
                )
              })}
            </div>
            <aside className="launch-panel">
              {!pendingResult && !result && selectedAttackLocked && <button className="launch-button training-unlock" type="button" onClick={() => openLearningModule(selectedRequiredModuleId)}>UNLOCK IN LEARNING <span>🔒</span></button>}
              {!pendingResult && !result && !selectedAttackLocked && <button className="launch-button" type="button" disabled={!selectedTechnique || targetLocked(selectedTarget)} onClick={launchSimulation}>LAUNCH SIMULATION <span>{selectedTechnique ? '▶' : '▣'}</span></button>}
              {pendingResult && <button className="launch-button defense-locked" type="button" disabled>DEFENCE SYSTEM LOCKED <span>▣</span></button>}
              {result && <button className="launch-button next" type="button" onClick={nextRound}>NEXT ROUND <span>›</span></button>}
              <p>{result ? 'Review the educational result, then continue.' : pendingResult ? 'The company has selected its defensive response. Reveal the result below.' : selectedAttackLocked ? `Complete ${selectedRequiredModule?.title} in the Learning Library to unlock this attack.` : selectedTechnique ? `${techniques.find((item) => item.id === selectedTechnique)?.title}: ${selectedOption?.label}` : 'Select a target and choose a technique type to launch the simulation.'}</p>
            </aside>
          </div>
        </section>

        <section className={`ai-defense-section glass-panel ${defenseSelection ? 'active' : ''}`} aria-live="polite">
          <div className="ai-defense-header">
            <div>
              <div className="section-kicker">COMPANY DEFENCE SYSTEM</div>
              <p>Automatically selects the company control that best matches the simulated attack.</p>
            </div>
            <span className={`ai-status ${result ? 'resolved' : defenseSelection ? 'locked' : ''}`}>
              {result ? 'ROUND RESOLVED' : defenseSelection ? 'RESPONSE LOCKED' : 'STANDBY'}
            </span>
          </div>

          <div className="ai-defense-body">
            <div className="ai-core">
              <div className="ai-core-icon"><span>DS</span></div>
              <div><strong>AEGIS DEFENCE SYSTEM</strong><small>Company controlled • User cannot modify</small></div>
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
                    <small>DEFENCE STATUS</small>
                    <strong>{result ? result.success ? 'DEFENCE BYPASSED' : 'DEFENCE HELD' : 'CONTROL DEPLOYED'}</strong>
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
      {idleWarningOpen && (
        <div className="settings-backdrop idle-backdrop" role="presentation">
          <section className="settings-modal idle-modal" role="alertdialog" aria-modal="true" aria-labelledby="idle-warning-title" aria-describedby="idle-warning-description">
            <header className="settings-modal-header">
              <div>
                <span className="section-kicker">SESSION STATUS // IDLE WARNING</span>
                <h2 id="idle-warning-title">ARE YOU STILL THERE?</h2>
              </div>
            </header>
            <div className="idle-modal-content">
              <p id="idle-warning-description">You have been idle for 10 minutes. Your current game will return to the home page in <strong>{idleSecondsRemaining} seconds</strong>.</p>
              <p>Select continue to keep playing.</p>
            </div>
            <footer className="settings-modal-footer idle-modal-actions">
              <button className="settings-cancel" type="button" onClick={returnHome}>RETURN HOME</button>
              <button className="settings-save" type="button" onClick={continueAfterIdle} autoFocus>CONTINUE SESSION</button>
            </footer>
          </section>
        </div>
      )}
      {howToPlayOpen && (
        <div className="htp-overlay" role="dialog" aria-modal="true" aria-label="How to play">
          <HowToPlay onClose={() => setHowToPlayOpen(false)} />
        </div>
      )}

      {pendingLeaveAction && (
        <div className="settings-backdrop idle-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPendingLeaveAction(null)
        }}>
          <section className="settings-modal idle-modal" role="alertdialog" aria-modal="true" aria-labelledby="leave-warning-title" aria-describedby="leave-warning-description">
            <header className="settings-modal-header">
              <div>
                <span className="section-kicker">WARNING // PROGRESS WILL BE LOST</span>
                <h2 id="leave-warning-title">{pendingLeaveAction === 'home' ? 'RETURN TO HOME?' : 'RESTART THE GAME?'}</h2>
              </div>
            </header>
            <div className="idle-modal-content">
              <p id="leave-warning-description">
                {pendingLeaveAction === 'home'
                  ? 'Leaving now will end your current game. All progress will be lost.'
                  : 'Restarting will reset the simulation. All progress will be lost.'}
              </p>
              <p>Are you sure you want to continue?</p>
            </div>
            <footer className="settings-modal-footer idle-modal-actions">
              <button className="settings-cancel" type="button" onClick={confirmLeaveAction}>
                {pendingLeaveAction === 'home' ? 'YES, GO HOME' : 'YES, RESTART'}
              </button>
              <button className="settings-save" type="button" onClick={() => setPendingLeaveAction(null)} autoFocus>
                KEEP PLAYING
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  )
}

export default Gameplay
