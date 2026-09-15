import { useEffect, useRef, useState } from 'react'
import { getPreferredNarrationVoice, getPreferredParticipantVoice } from '../narrationVoices.js'
import { correctVishingCallbackSequence, getVishingConversationAudio, vishingCallExamples, vishingChallengeAudio, vishingConversationOptionOrders, vishingConversationStages, vishingResponseExamples, vishingTakeCallAudio, vishingCallbackActions } from './vishingData.js'

export default function VishingModule({ completed, onComplete, onClose, onAudioChange }) {
  const vishingLessonOpen = true
  const vishingLessonMode = 'library'
  const [vishingLessonStep, setVishingLessonStep] = useState(0)
  const [vishingCallState, setVishingCallState] = useState('incoming')
  const [vishingCallsAnswered, setVishingCallsAnswered] = useState(() => new Set())
  const [vishingCallAnswers, setVishingCallAnswers] = useState({})
  const [vishingResponseAnswers, setVishingResponseAnswers] = useState({})
  const [vishingCallbackSequence, setVishingCallbackSequence] = useState([])
  const [vishingConversationChoices, setVishingConversationChoices] = useState([])
  const [vishingConversationStageIndex, setVishingConversationStageIndex] = useState(0)
  const [vishingConversationPhase, setVishingConversationPhase] = useState('idle')
  const [vishingClipPlayingId, setVishingClipPlayingId] = useState(null)
  const vishingLessonContentRef = useRef(null)
  const narrationVoiceRef = useRef(null)
  const participantVoiceRef = useRef(null)
  const vishingUtteranceRef = useRef(null)
  const vishingAudioRef = useRef(null)
  const vishingSpeechTokenRef = useRef(0)

  useEffect(() => {
    if (!('speechSynthesis' in window)) return undefined
    const loadVoice = () => {
      narrationVoiceRef.current = getPreferredNarrationVoice()
      participantVoiceRef.current = getPreferredParticipantVoice(narrationVoiceRef.current)
    }
    loadVoice()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoice)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoice)
      window.speechSynthesis.cancel()
      if (vishingAudioRef.current) vishingAudioRef.current.pause()
    }
  }, [])

  useEffect(() => {
    onAudioChange(vishingCallState === 'playing')
    return () => onAudioChange(false)
  }, [onAudioChange, vishingCallState])

  useEffect(() => {
    if (!vishingLessonOpen || vishingLessonMode === 'required') return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        vishingSpeechTokenRef.current += 1
        if ('speechSynthesis' in window) {
          if (window.speechSynthesis.paused) window.speechSynthesis.resume()
          window.speechSynthesis.cancel()
        }
        if (vishingAudioRef.current) {
          vishingAudioRef.current.pause()
          vishingAudioRef.current = null
        }
        vishingUtteranceRef.current = null
        setVishingClipPlayingId(null)
        setVishingCallState('idle')
        onClose()
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [vishingLessonMode, vishingLessonOpen, onClose])

  useEffect(() => {
    if (vishingLessonOpen && vishingLessonContentRef.current) {
      vishingLessonContentRef.current.scrollTop = 0
    }
  }, [vishingLessonOpen, vishingLessonStep])

  const stopNarration = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume()
      window.speechSynthesis.cancel()
    }
  }

  function stopVishingAudio(nextState = 'idle') {
    vishingSpeechTokenRef.current += 1
    if (vishingAudioRef.current) {
      vishingAudioRef.current.onplaying = null
      vishingAudioRef.current.onended = null
      vishingAudioRef.current.onerror = null
      vishingAudioRef.current.pause()
      vishingAudioRef.current.currentTime = 0
      vishingAudioRef.current = null
    }
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume()
      window.speechSynthesis.cancel()
    }
    vishingUtteranceRef.current = null
    setVishingClipPlayingId(null)
    setVishingCallState(nextState)
  }

  const toggleVishingPause = () => {
    if (vishingAudioRef.current) {
      if (vishingCallState === 'paused') {
        vishingAudioRef.current.play().catch(() => setVishingCallState('error'))
        setVishingCallState('playing')
      } else if (!vishingAudioRef.current.paused) {
        vishingAudioRef.current.pause()
        setVishingCallState('paused')
      }
      return
    }

    if (!('speechSynthesis' in window)) return

    if (vishingCallState === 'paused') {
      window.speechSynthesis.resume()
      setVishingCallState('playing')
      return
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause()
      setVishingCallState('paused')
    }
  }

  const playVishingClip = (clipId, text, onComplete, voiceRole = 'caller', audioSrc = null) => {
    stopNarration()
    stopVishingAudio('connecting')
    const token = vishingSpeechTokenRef.current

    const finishClip = () => {
      if (token !== vishingSpeechTokenRef.current) return
      vishingAudioRef.current = null
      vishingUtteranceRef.current = null
      setVishingClipPlayingId(null)
      setVishingCallState('idle')
      onComplete?.()
    }

    const playSpeechFallback = () => {
      if (token !== vishingSpeechTokenRef.current) return
      if (!('speechSynthesis' in window)) {
        setVishingCallState('unsupported')
        onComplete?.()
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = voiceRole === 'participant'
        ? participantVoiceRef.current ?? getPreferredParticipantVoice(narrationVoiceRef.current)
        : narrationVoiceRef.current ?? getPreferredNarrationVoice()
      utterance.lang = utterance.voice?.lang ?? 'en-AU'
      utterance.rate = 0.93
      utterance.pitch = voiceRole === 'participant' ? 0.96 : 1.02
      utterance.volume = 1
      utterance.onstart = () => {
        if (token !== vishingSpeechTokenRef.current) return
        setVishingClipPlayingId(clipId)
        setVishingCallState('playing')
      }
      utterance.onend = finishClip
      utterance.onerror = (event) => {
        if (token !== vishingSpeechTokenRef.current || event.error === 'canceled' || event.error === 'interrupted') return
        finishClip()
      }

      vishingUtteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }

    if (!audioSrc) {
      playSpeechFallback()
      return
    }

    const audio = new Audio(audioSrc)
    let fallbackStarted = false
    const startFallback = () => {
      if (fallbackStarted || token !== vishingSpeechTokenRef.current) return
      fallbackStarted = true
      vishingAudioRef.current = null
      playSpeechFallback()
    }

    audio.preload = 'auto'
    audio.volume = 1
    audio.onplaying = () => {
      if (token !== vishingSpeechTokenRef.current) return
      setVishingClipPlayingId(clipId)
      setVishingCallState('playing')
    }
    audio.onended = finishClip
    audio.onerror = startFallback
    vishingAudioRef.current = audio
    audio.play().catch(startFallback)
  }

  const answerVishingCall = (example) => {
    setVishingCallsAnswered((current) => new Set(current).add(example.id))
    playVishingClip(`take-${example.id}`, example.transcript, undefined, 'caller', vishingTakeCallAudio[example.id])
  }

  const addVishingCallbackAction = (actionId) => {
    setVishingCallbackSequence((current) => current.includes(actionId) ? current : [...current, actionId])
  }

  const removeVishingCallbackAction = (actionId) => {
    setVishingCallbackSequence((current) => current.filter((item) => item !== actionId))
  }

  const playVishingConversationCaller = (stageIndex) => {
    const stage = vishingConversationStages[stageIndex]
    if (!stage) return

    setVishingConversationStageIndex(stageIndex)
    setVishingConversationPhase('caller')
    playVishingClip(`conversation-caller-${stageIndex}`, stage.caller, () => {
      setVishingConversationPhase('choosing')
    }, 'caller', getVishingConversationAudio(stageIndex, 'caller_prompt'))
  }

  const startVishingConversation = () => {
    if (vishingConversationPhase !== 'idle') return
    setVishingConversationChoices([])
    playVishingConversationCaller(0)
  }

  const resetVishingConversation = () => {
    stopVishingAudio('idle')
    setVishingConversationChoices([])
    setVishingConversationStageIndex(0)
    setVishingConversationPhase('idle')
  }

  const chooseVishingConversationOption = (option) => {
    if (vishingConversationPhase !== 'choosing') return

    const stageIndex = vishingConversationStageIndex
    setVishingConversationChoices((current) => [...current, { stageIndex, ...option }])
    setVishingConversationPhase('participant')

    playVishingClip(`conversation-participant-${stageIndex}`, option.text, () => {
      setVishingConversationPhase('reply')
      playVishingClip(`conversation-reply-${stageIndex}`, option.reply, () => {
        const nextStageIndex = stageIndex + 1
        if (nextStageIndex >= vishingConversationStages.length) {
          setVishingConversationPhase('complete')
          return
        }
        playVishingConversationCaller(nextStageIndex)
      }, 'caller', getVishingConversationAudio(stageIndex, 'caller_reply', option.type))
    }, 'participant', getVishingConversationAudio(stageIndex, 'player', option.type))
  }

  const advanceVishingLesson = () => {
    const callsComplete = vishingCallExamples.every((example) => vishingCallAnswers[example.id] === example.isScam)
    const responsesComplete = vishingResponseExamples.every((example) => vishingResponseAnswers[example.id] === example.correct)
    const callbackComplete = vishingCallbackSequence.join('|') === correctVishingCallbackSequence.join('|')
    const conversationComplete = vishingConversationPhase === 'complete'

    if (vishingLessonStep === 0 && !callsComplete) return
    if (vishingLessonStep === 1 && !responsesComplete) return
    if (vishingLessonStep === 2 && !callbackComplete) return
    if (vishingLessonStep === 3 && !conversationComplete) return

    stopVishingAudio('idle')
    if (vishingLessonStep < 4) {
      setVishingLessonStep((current) => current + 1)
      return
    }

    onComplete()
    onClose()
  }

  const correctVishingCallCount = vishingCallExamples.filter((example) => vishingCallAnswers[example.id] === example.isScam).length
  const correctVishingResponseCount = vishingResponseExamples.filter((example) => vishingResponseAnswers[example.id] === example.correct).length
  const vishingCallbackComplete = vishingCallbackSequence.join('|') === correctVishingCallbackSequence.join('|')
  const vishingConversationComplete = vishingConversationPhase === 'complete'
  const vishingDecisionCounts = vishingConversationChoices.reduce((counts, choice) => ({
    ...counts,
    [choice.type]: counts[choice.type] + 1,
  }), { safe: 0, risky: 0, uncertain: 0 })
  const vishingConversationOutcome = vishingDecisionCounts.safe === vishingConversationStages.length
    ? { tone: 'safe', title: 'CALL SAFELY CONTAINED', impact: '$0 DIRECT LOSS', explanation: 'Every decision ended or rejected the caller-controlled process. No credentials, codes, approvals, or remote access were provided.' }
    : vishingDecisionCounts.risky === vishingConversationStages.length
      ? { tone: 'risky', title: 'ACCOUNT AND FUNDS EXPOSED', impact: '$2,400 SIMULATED LOSS', explanation: 'The caller obtained card information, an authentication code, approval, and remote access. The company would also face investigation and recovery costs.' }
      : vishingDecisionCounts.uncertain >= 4
        ? { tone: 'uncertain', title: 'DELAY INCREASED THE RISK', impact: 'RESPONSE COSTS INCREASED', explanation: 'No firm verification decision was made. Remaining on the call gave the scammer more opportunities to apply pressure, while reporting and account protection were delayed.' }
        : vishingDecisionCounts.risky > vishingDecisionCounts.safe
          ? { tone: 'risky', title: 'CALLER GAINED A FOOTHOLD', impact: 'CREDENTIAL RECOVERY REQUIRED', explanation: 'Several risky choices exposed information or access. Later caution helped, but the organisation would still need to secure the account and investigate activity.' }
          : { tone: 'mixed', title: 'PARTIAL CONTAINMENT', impact: 'LIMITED EXPOSURE', explanation: 'The employee eventually moved to safer actions, but hesitation or earlier disclosure created avoidable investigation and recovery work.' }
  const currentVishingConversationStage = vishingConversationStages[Math.min(vishingConversationStageIndex, vishingConversationStages.length - 1)]
  const vishingConversationAudioActive = ['caller', 'participant', 'reply'].includes(vishingConversationPhase)
  const vishingConversationPhaseLabel = {
    idle: 'INCOMING TRAINING CALL',
    caller: 'CALLER SPEAKING',
    choosing: 'YOUR RESPONSE',
    participant: 'YOU ARE SPEAKING',
    reply: 'CALLER RESPONDING',
    complete: 'CALL COMPLETE',
  }[vishingConversationPhase]
  const vishingCurrentStepComplete = vishingLessonStep === 0
    ? correctVishingCallCount === vishingCallExamples.length
    : vishingLessonStep === 1
      ? correctVishingResponseCount === vishingResponseExamples.length
      : vishingLessonStep === 2
        ? vishingCallbackComplete
        : vishingLessonStep === 3
          ? vishingConversationComplete
          : true
  const vishingStepProgress = vishingLessonStep === 0
    ? correctVishingCallCount / vishingCallExamples.length
    : vishingLessonStep === 1
      ? correctVishingResponseCount / vishingResponseExamples.length
      : vishingLessonStep === 2
        ? vishingCallbackSequence.length / correctVishingCallbackSequence.length
        : vishingLessonStep === 3
          ? vishingConversationChoices.length / vishingConversationStages.length
          : 1
  const vishingProgressPercent = Math.round(((vishingLessonStep + vishingStepProgress) / 5) * 100)

  return (
        <div className="email-lesson-backdrop vishing-lesson-backdrop">
          <section className="email-lesson-modal universal-lesson vishing-lesson-modal" role="dialog" aria-modal="true" aria-labelledby="vishing-lesson-title">
            <header className="email-lesson-header vishing-lesson-header">
              <div>
                <span className="lesson-kicker">UNIVERSAL TRAINING MODULE // VISHING</span>
                <h2 id="vishing-lesson-title">VOICE-CALL SCAM AWARENESS</h2>
              </div>
              <button className="lesson-close" type="button" aria-label="Close Vishing training and return to the game" onClick={() => { stopVishingAudio(); onClose() }}>×</button>
            </header>

            <div className="lesson-progress vishing-lesson-progress" aria-label={`Vishing training step ${vishingLessonStep + 1} of 5`}>
              {['TAKE THE CALL', 'CHALLENGE THE CALLER', 'SAFE CALLBACK', 'WHAT WOULD HAPPEN?', 'SUMMARY'].map((label, index) => (
                <div className={`${index === vishingLessonStep ? 'current' : ''} ${index < vishingLessonStep ? 'complete' : ''}`} key={label}>
                  <span>{index < vishingLessonStep ? '✓' : index + 1}</span><small>{label}</small>
                </div>
              ))}
            </div>

            <div className="email-lesson-content vishing-lesson-content" ref={vishingLessonContentRef}>
              {vishingLessonStep === 0 && (
                <div className="lesson-stage vishing-call-stage">
                  <div className="lesson-overview-banner vishing-overview-banner">
                    <div><span className="lesson-step-label">STEP 1 // SIX INCOMING CALLS</span><h3>Take the call: scam or legitimate?</h3></div>
                    <div className="clue-counter"><strong>{correctVishingCallCount} / {vishingCallExamples.length}</strong><span>calls classified correctly</span></div>
                    <p>Answer every fictional call, listen to the short message, and decide whether it is a scam or a legitimate business call. Caller ID alone is never proof—consider the context and requested action.</p>
                  </div>

                  <div className="vishing-call-examples">
                    {vishingCallExamples.map((example, index) => {
                      const answered = vishingCallsAnswered.has(example.id)
                      const selectedAnswer = vishingCallAnswers[example.id]
                      const isCorrect = selectedAnswer === example.isScam
                      const clipId = `take-${example.id}`
                      const isPlaying = vishingClipPlayingId === clipId && vishingCallState === 'playing'
                      return (
                        <article className="vishing-call-example" key={example.id}>
                          <header><span>CALL {index + 1} OF {vishingCallExamples.length}</span><strong>{example.device.toUpperCase()} CALL INTERFACE</strong></header>
                          <div className={`voice-call-phone compact-call-phone device-${example.device} ${isPlaying ? 'call-active' : ''}`}>
                            <div className="voice-phone-status"><span>{example.time}</span><span>▮▮▮ ᯤ ▰</span></div>
                            <div className="incoming-call-copy">
                              <small>{answered ? 'CALL CONNECTED' : 'INCOMING CALL'}</small>
                              <div className="caller-avatar"><span>{example.initials}</span><i /></div>
                              <h3>{example.caller}</h3><p>{example.number}</p>
                              <div className="call-waveform" aria-hidden="true">{Array.from({ length: 18 }, (_, barIndex) => <i key={barIndex} />)}</div>
                              <strong className="call-status">{isPlaying ? 'CALL AUDIO PLAYING' : answered ? 'CALL TRANSCRIPT AVAILABLE' : 'ANSWER TO HEAR MESSAGE'}</strong>
                            </div>
                            {!answered ? (
                              <div className="single-answer-action"><button className="answer-call" type="button" onClick={() => answerVishingCall(example)}><span>☎</span><small>ANSWER &amp; LISTEN</small></button></div>
                            ) : (
                              <div className="compact-call-controls audio-controls">
                                <button type="button" onClick={() => playVishingClip(clipId, example.transcript, undefined, 'caller', vishingTakeCallAudio[example.id])}><span>↻</span><small>REPLAY</small></button>
                                <button type="button" disabled={vishingClipPlayingId !== clipId || !['playing', 'paused'].includes(vishingCallState)} onClick={toggleVishingPause}><span>{vishingCallState === 'paused' && vishingClipPlayingId === clipId ? '▶' : 'Ⅱ'}</span><small>{vishingCallState === 'paused' && vishingClipPlayingId === clipId ? 'RESUME' : 'PAUSE'}</small></button>
                                <button className="end-call" type="button" onClick={() => stopVishingAudio('ended')}><span>☎</span><small>END</small></button>
                              </div>
                            )}
                            <div className="voice-phone-home" />
                          </div>

                          <div className={`call-classification ${answered ? 'ready' : ''}`}>
                            <span>CALL TRANSCRIPT</span><p>“{example.transcript}”</p>
                            <strong>WHAT IS YOUR DECISION?</strong>
                            <div>
                              <button type="button" disabled={!answered} className={selectedAnswer === true ? (isCorrect ? 'correct' : 'incorrect') : ''} onClick={() => setVishingCallAnswers((current) => ({ ...current, [example.id]: true }))}><span>!</span>SCAM CALL</button>
                              <button type="button" disabled={!answered} className={selectedAnswer === false ? (isCorrect ? 'correct' : 'incorrect') : ''} onClick={() => setVishingCallAnswers((current) => ({ ...current, [example.id]: false }))}><span>✓</span>LEGITIMATE CALL</button>
                            </div>
                            {selectedAnswer !== undefined && <aside className={isCorrect ? 'correct' : 'incorrect'}><strong>{isCorrect ? '✓ Correct classification' : '× Reconsider the context and request'}</strong><p>{isCorrect ? example.explanation : 'Listen again and focus on what the caller asks you to do, not merely the displayed name or number.'}</p>{isCorrect && <em>{example.signal}</em>}</aside>}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              )}

              {vishingLessonStep === 1 && (
                <div className="lesson-stage vishing-response-stage">
                  <div className="lesson-overview-banner vishing-overview-banner">
                    <div><span className="lesson-step-label">STEP 2 // INTERRUPT THE SCRIPT</span><h3>Challenge the caller safely</h3></div>
                    <div className="clue-counter"><strong>{correctVishingResponseCount} / {vishingResponseExamples.length}</strong><span>safe responses selected</span></div>
                    <p>A vishing caller wants to control the pace of the conversation. Play each caller line if you wish, then choose the response that stops the pressure and restores independent verification.</p>
                  </div>

                  <div className="vishing-response-list">
                    {vishingResponseExamples.map((example, index) => {
                      const selectedAnswer = vishingResponseAnswers[example.id]
                      const isCorrect = selectedAnswer === example.correct
                      return (
                        <article className="vishing-response-card" key={example.id}>
                          <div className="caller-clip-panel">
                            <span>CALL MOMENT {index + 1}</span>
                            <div className="caller-clip-avatar">NS</div>
                            <strong>{example.identity}</strong>
                            <small className="caller-context">{example.context}</small>
                            <p>“{example.caller}”</p>
                            <div className="caller-clip-controls audio-controls">
                              <button className="play-caller-clip" type="button" onClick={() => playVishingClip(example.id, example.caller, undefined, 'caller', vishingChallengeAudio[example.id])}>
                                <span>{vishingClipPlayingId === example.id ? '↻' : '▶'}</span>{vishingClipPlayingId === example.id ? 'REPLAY CALLER AUDIO' : 'PLAY CALLER AUDIO'}
                              </button>
                              <button className="pause-caller-clip" type="button" disabled={vishingClipPlayingId !== example.id || !['playing', 'paused'].includes(vishingCallState)} onClick={toggleVishingPause}>
                                <span>{vishingClipPlayingId === example.id && vishingCallState === 'paused' ? '▶' : 'Ⅱ'}</span>{vishingClipPlayingId === example.id && vishingCallState === 'paused' ? 'RESUME' : 'PAUSE'}
                              </button>
                            </div>
                          </div>
                          <div className="caller-response-panel">
                            <span>YOUR RESPONSE</span><h3>{example.prompt}</h3>
                            <div className="caller-response-options">
                              {example.options.map((option, optionIndex) => {
                                const selected = selectedAnswer === optionIndex
                                const answerClass = selected ? (optionIndex === example.correct ? 'correct' : 'incorrect') : ''
                                return <button className={`caller-response-option ${selected ? 'selected' : ''} ${answerClass}`} type="button" key={option} aria-pressed={selected} onClick={() => setVishingResponseAnswers((current) => ({ ...current, [example.id]: optionIndex }))}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>
                              })}
                            </div>
                            {selectedAnswer !== undefined && <div className={`vishing-answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}><strong>{isCorrect ? '✓ Conversation control restored' : '× The caller still controls the verification path'}</strong><p>{isCorrect ? example.explanation : 'Try again. Choose the response that ends the unverified interaction or returns to an approved company process.'}</p></div>}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              )}

              {vishingLessonStep === 2 && (
                <div className="lesson-stage vishing-callback-stage">
                  <div className="lesson-overview-banner vishing-overview-banner">
                    <div><span className="lesson-step-label">STEP 3 // TAKE BACK CONTROL</span><h3>Build the safe callback sequence</h3></div>
                    <div className="clue-counter"><strong>{vishingCallbackSequence.length} / {correctVishingCallbackSequence.length}</strong><span>steps placed</span></div>
                    <p>An independent callback is more than asking the caller for a number. The available actions are deliberately shuffled—select them in the safest order, then reset and try again if necessary.</p>
                  </div>

                  <div className="callback-lab">
                    <section className="callback-action-bank">
                      <span>AVAILABLE ACTIONS</span>
                      <div>
                        {vishingCallbackActions.map((action) => (
                          <button type="button" disabled={vishingCallbackSequence.includes(action.id)} key={action.id} onClick={() => addVishingCallbackAction(action.id)}>
                            <span>{action.icon}</span><div><strong>{action.title}</strong><small>{action.description}</small></div><i>＋</i>
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="callback-sequence-panel">
                      <header><span>YOUR VERIFICATION ROUTE</span><button type="button" onClick={() => setVishingCallbackSequence([])} disabled={vishingCallbackSequence.length === 0}>RESET SEQUENCE</button></header>
                      <div className="callback-sequence">
                        {correctVishingCallbackSequence.map((_, index) => {
                          const selectedAction = vishingCallbackActions.find((action) => action.id === vishingCallbackSequence[index])
                          return selectedAction
                            ? <button className="filled" type="button" key={`callback-slot-${index}`} aria-label={`Remove ${selectedAction.title} from position ${index + 1}`} onClick={() => removeVishingCallbackAction(selectedAction.id)}><span>{index + 1}</span><div><strong>{selectedAction.title}</strong><small>{selectedAction.description}</small></div><i>×</i></button>
                            : <div key={`callback-slot-${index}`}><span>{index + 1}</span><em>Select the next action</em></div>
                        })}
                      </div>
                      {vishingCallbackSequence.length === correctVishingCallbackSequence.length && (
                        <div className={`callback-result ${vishingCallbackComplete ? 'correct' : 'incorrect'}`}>
                          <span>{vishingCallbackComplete ? '✓' : '×'}</span><div><strong>{vishingCallbackComplete ? 'SAFE CALLBACK BUILT' : 'SEQUENCE NEEDS ANOTHER LOOK'}</strong><p>{vishingCallbackComplete ? 'You ended the attacker-controlled contact path, found a trusted number independently, verified the issue, and reported the attempt.' : 'The new call must use independently sourced contact details, and the suspicious attempt should still be reported.'}</p></div>
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              )}

              {vishingLessonStep === 3 && (
                <div className="lesson-stage vishing-conversation-stage">
                  <div className="lesson-overview-banner vishing-overview-banner">
                    <div><span className="lesson-step-label">STEP 4 // SIX DECISION CONVERSATION</span><h3>What would happen if you stayed on the call?</h3></div>
                    <div className="clue-counter"><strong>{vishingConversationChoices.length} / {vishingConversationStages.length}</strong><span>decisions completed</span></div>
                    <p>Follow a realistic bank-impersonation call through six moments. Every choice changes the caller’s next response and contributes to the final business outcome. There is no instant correction—observe the consequence at the end.</p>
                  </div>

                  <div className={`conversation-score-strip ${vishingConversationComplete ? '' : 'locked'}`} aria-label="Conversation decision score">
                    <div className="safe"><span>✓</span><strong>{vishingConversationComplete ? vishingDecisionCounts.safe : '—'}</strong><small>SAFE DECISIONS</small></div>
                    <div className="uncertain"><span>?</span><strong>{vishingConversationComplete ? vishingDecisionCounts.uncertain : '—'}</strong><small>UNCERTAIN DECISIONS</small></div>
                    <div className="risky"><span>!</span><strong>{vishingConversationComplete ? vishingDecisionCounts.risky : '—'}</strong><small>RISKY DECISIONS</small></div>
                    <button type="button" disabled={vishingConversationPhase === 'idle'} onClick={resetVishingConversation}>RESTART CONVERSATION</button>
                  </div>

                  <div className="dual-phone-conversation">
                    <div className="conversation-phone scammer-conversation-phone">
                      <div className="conversation-phone-status"><span>9:52</span><span>▮▮▮ ᯤ ▰</span></div>
                      <header><div className="conversation-avatar">HB</div><strong>Harbour Bank Security</strong><small>Caller identity unverified</small></header>
                      <div className="scammer-call-visual">
                        <span>{vishingConversationPhaseLabel}</span>
                        <div className={`caller-radar ${vishingConversationAudioActive ? 'active' : ''}`}><i /><i /><i /><strong>☎</strong></div>
                        <h3>{vishingConversationComplete ? 'CALL COMPLETE' : `MOMENT ${vishingConversationStageIndex + 1} OF ${vishingConversationStages.length}`}</h3>
                        <p>{vishingConversationPhase === 'idle'
                          ? 'An unverified caller is waiting. Answer the simulated call to hear their first request.'
                          : vishingConversationPhase === 'participant'
                            ? vishingConversationChoices.at(-1)?.text
                            : vishingConversationPhase === 'reply' || vishingConversationComplete
                              ? vishingConversationChoices.at(-1)?.reply
                              : currentVishingConversationStage.caller}</p>
                        {vishingConversationPhase === 'idle' ? (
                          <button className="answer-training-call" type="button" onClick={startVishingConversation}><span>☎</span>ANSWER CALL</button>
                        ) : (
                          <div className="conversation-call-controls">
                            <button type="button" disabled={!vishingConversationAudioActive || !['playing', 'paused'].includes(vishingCallState)} onClick={toggleVishingPause}>
                              <span>{vishingCallState === 'paused' ? '▶' : 'Ⅱ'}</span>{vishingCallState === 'paused' ? 'RESUME CALL' : 'PAUSE CALL'}
                            </button>
                            <small>{vishingConversationAudioActive ? 'AUDIO IN PROGRESS' : vishingConversationComplete ? 'TRAINING CALL ENDED' : 'WAITING FOR YOUR RESPONSE'}</small>
                          </div>
                        )}
                      </div>
                      <div className="voice-phone-home" />
                    </div>

                    <div className="conversation-phone user-conversation-phone">
                      <div className="conversation-phone-status"><span>9:52</span><span>▮▮▮ ᯤ ▰</span></div>
                      <header><span>◉</span><div><strong>Unknown caller</strong><small>{vishingConversationPhaseLabel}</small></div><span>ⓘ</span></header>
                      <div className="user-call-visual">
                        <div className={`user-call-avatar ${vishingConversationAudioActive ? 'active' : ''}`}>?</div>
                        <strong>{vishingConversationPhase === 'idle' ? 'Incoming call' : 'Call connected'}</strong>
                        <small>{vishingConversationPhase === 'idle' ? 'Harbour Bank Security (unverified)' : vishingConversationPhaseLabel}</small>
                        <div className={`user-call-waveform ${vishingConversationAudioActive && vishingCallState !== 'paused' ? 'active' : ''}`} aria-hidden="true"><i /><i /><i /><i /><i /></div>
                        {vishingConversationPhase === 'idle' ? (
                          <button className="answer-training-call user-answer-call" type="button" onClick={startVishingConversation}><span>☎</span>ANSWER CALL</button>
                        ) : (
                          <button className="user-pause-call" type="button" disabled={!vishingConversationAudioActive || !['playing', 'paused'].includes(vishingCallState)} onClick={toggleVishingPause}><span>{vishingCallState === 'paused' ? '▶' : 'Ⅱ'}</span>{vishingCallState === 'paused' ? 'RESUME AUDIO' : 'PAUSE AUDIO'}</button>
                        )}
                      </div>
                      <div className="conversation-thread voice-call-transcript" aria-live="polite">
                        <small>LIVE ACCESSIBLE CALL TRANSCRIPT</small>
                        {vishingConversationChoices.map((choice) => {
                          const stage = vishingConversationStages[choice.stageIndex]
                          const showReply = choice.stageIndex < vishingConversationStageIndex || ['reply', 'complete'].includes(vishingConversationPhase)
                          return (
                            <div className="conversation-exchange" key={stage.id}>
                              <p className="caller-bubble"><span>CALLER</span>{stage.caller}</p>
                              <p className={`user-bubble ${choice.type}`}><span>YOU</span>{choice.text}</p>
                              {showReply && <p className="caller-bubble reply"><span>CALLER RESPONSE</span>{choice.reply}</p>}
                            </div>
                          )
                        })}
                        {vishingConversationPhase !== 'idle' && !vishingConversationChoices.some((choice) => choice.stageIndex === vishingConversationStageIndex) && (
                          <p className="caller-bubble current"><span>CALLER</span>{currentVishingConversationStage.caller}</p>
                        )}
                        {vishingConversationPhase === 'idle' && <p className="transcript-placeholder">Answer the training call to begin the transcript.</p>}
                      </div>
                      <div className="voice-phone-home" />
                    </div>
                  </div>

                  {!vishingConversationComplete ? (
                    <section className={`conversation-decision-panel ${vishingConversationPhase !== 'choosing' ? 'locked' : ''}`} aria-live="polite">
                      <span>DECISION {vishingConversationStageIndex + 1} OF {vishingConversationStages.length}</span>
                      <h3>How do you respond?</h3>
                      <p>{vishingConversationPhase === 'idle'
                        ? 'Answer the call first. Your choices will unlock after the caller finishes speaking.'
                        : vishingConversationPhase === 'choosing'
                          ? 'The caller has finished. Choose a response; it will be spoken aloud before the caller continues.'
                          : vishingConversationPhase === 'participant'
                            ? 'Your selected response is being spoken to the caller.'
                            : 'Listen to the complete caller line. Response choices unlock only when the audio finishes.'}</p>
                      <div>
                        {(vishingConversationOptionOrders[vishingConversationStageIndex] ?? [0, 1, 2]).map((optionIndex) => currentVishingConversationStage.options[optionIndex]).map((option, optionIndex) => (
                          <button type="button" disabled={vishingConversationPhase !== 'choosing'} key={option.text} onClick={() => chooseVishingConversationOption(option)}><span>{String.fromCharCode(65 + optionIndex)}</span>{option.text}</button>
                        ))}
                      </div>
                      {vishingConversationPhase !== 'choosing' && <div className="conversation-choice-lock"><span>▣</span>{vishingConversationAudioActive ? 'LISTENING REQUIRED — OPTIONS LOCKED' : 'ANSWER THE CALL TO UNLOCK OPTIONS'}</div>}
                    </section>
                  ) : (
                    <section className={`conversation-outcome ${vishingConversationOutcome.tone}`}>
                      <div><span>{vishingConversationOutcome.tone === 'safe' ? '✓' : vishingConversationOutcome.tone === 'risky' ? '!' : '?'}</span><div><small>FINAL CALL OUTCOME</small><h3>{vishingConversationOutcome.title}</h3><strong>{vishingConversationOutcome.impact}</strong></div></div>
                      <p>{vishingConversationOutcome.explanation}</p>
                      <aside><strong>WHAT TO REMEMBER</strong><p>A caller’s response to resistance is useful evidence. Legitimate organisations should allow you to stop, verify independently, and follow normal company procedures.</p></aside>
                    </section>
                  )}
                </div>
              )}

              {vishingLessonStep === 4 && (
                <div className="lesson-stage summary-stage vishing-summary-stage">
                  <div className="lesson-overview-banner summary-banner vishing-overview-banner">
                    <div><span className="lesson-step-label">STEP 5 // VISHING SUMMARY</span><h3>Stop the call. Verify through a channel you trust.</h3></div>
                    <p>Vishing is phishing conducted through a voice call. A convincing voice, caller ID, job title, or knowledge of company details does not prove identity—including when synthetic or cloned audio may be involved.</p>
                  </div>
                  <div className="summary-principles vishing-summary-principles">
                    <article><span>01</span><strong>NOTICE THE PRESSURE</strong><p>Be cautious when a caller creates urgency, fear, secrecy, authority, or a reason to avoid normal procedure.</p></article>
                    <article><span>02</span><strong>PROTECT SECRETS</strong><p>Never disclose passwords, one-time codes, card details, or approve an unexpected authentication request.</p></article>
                    <article><span>03</span><strong>CALL BACK SAFELY</strong><p>End the call and start a new one using a number from a trusted directory, known app, card, or official website.</p></article>
                    <article><span>04</span><strong>REPORT QUICKLY</strong><p>Report the claimed identity, request, time, and number so the organisation can warn others and investigate.</p></article>
                  </div>
                  <section className="summary-impact vishing-summary-impact">
                    <div><span className="lesson-step-label">HOW VISHING CAN REDUCE COMPANY FUNDS</span><h3>A voice call can trigger real business costs</h3><p>The simulation’s funds meter represents the total harm caused by a successful call, not simply money handed directly to the caller.</p></div>
                    <div className="summary-impact-grid">
                      <article><strong>UNAUTHORISED PAYMENTS</strong><p>Impersonation can pressure staff into changing payment details or approving a fraudulent transaction.</p></article>
                      <article><strong>ACCOUNT ACCESS</strong><p>Shared codes or approved prompts can expose email, cloud systems, and company information.</p></article>
                      <article><strong>INCIDENT RESPONSE</strong><p>Teams may need to secure accounts, inspect activity, contact affected people, and restore access.</p></article>
                      <article><strong>DISRUPTION &amp; TRUST</strong><p>Paused services, delayed work, customer support, and reputational damage can increase the total cost.</p></article>
                    </div>
                  </section>
                  <section className="learning-resources vishing-learning-resources">
                    <div><span className="lesson-step-label">CONTINUE LEARNING</span><h3>Official Australian guidance</h3><p>Use these resources for current advice about phone scams, phishing, and reporting suspicious calls.</p></div>
                    <div className="resource-links">
                      <a href="https://www.acma.gov.au/phone-and-sms-scams" target="_blank" rel="noreferrer"><strong>ACMA — Phone and SMS scams</strong><span>Recognise and respond to scam calls ›</span></a>
                      <a href="https://www.scamwatch.gov.au/types-of-scams/phishing-scams" target="_blank" rel="noreferrer"><strong>Scamwatch — Phishing scams</strong><span>Warning signs and reporting advice ›</span></a>
                      <a href="https://www.cyber.gov.au/threats/types-threats/phishing" target="_blank" rel="noreferrer"><strong>ACSC — Phishing</strong><span>Protect accounts and organisations ›</span></a>
                      <a href="https://www.esafety.gov.au/key-topics/staying-safe/online-scams" target="_blank" rel="noreferrer"><strong>eSafety — Online scams</strong><span>Practical safety guidance ›</span></a>
                    </div>
                  </section>
                  <div className="completion-callout vishing-completion-callout"><span>✓</span><div><strong>MODULE READY TO COMPLETE</strong><p>{completed ? 'You have reviewed the complete Vishing training module again.' : 'Complete the module to mark Vishing as finished in your Learning Library.'}</p></div></div>
                </div>
              )}
            </div>

            <footer className="email-lesson-footer vishing-lesson-footer">
              <button className="lesson-secondary" type="button" disabled={vishingLessonStep === 0} onClick={() => {
                stopVishingAudio(vishingLessonStep === 1 ? 'incoming' : 'idle')
                if (vishingLessonStep === 3) {
                  setVishingConversationChoices([])
                  setVishingConversationStageIndex(0)
                  setVishingConversationPhase('idle')
                }
                setVishingLessonStep((current) => Math.max(0, current - 1))
              }}>‹ PREVIOUS</button>
              <div><span>LEARNING PROGRESS</span><strong>{vishingProgressPercent}%</strong></div>
              <button className="lesson-primary" type="button" disabled={!vishingCurrentStepComplete} onClick={advanceVishingLesson}>{vishingLessonStep === 4 ? (completed ? 'FINISH REVIEW' : 'COMPLETE MODULE') : 'CONTINUE'} <span>›</span></button>
            </footer>
          </section>
        </div>
  )
}
