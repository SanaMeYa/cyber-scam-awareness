import { useEffect, useMemo, useState } from 'react'
import VoiceCloneDemo from './VoiceCloneDemo.jsx'
import {
  requiredVoiceRequestClues,
  responseOptions,
  verificationActions,
  verificationOrder,
  voiceCloneStageOrder,
  voiceCloneStages,
  voiceRequestClues,
} from './voiceCloneData.js'
import './voice-clone-module.css'

const moduleSteps = ['HOW IT WORKS', 'LIVE DEMO', 'INVESTIGATE', 'RESPOND', 'VERIFY', 'RESULTS']

function arraysMatch(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

const verificationChoiceOrder = ['contact', 'pause', 'report', 'end', 'confirm']

function VoiceCloneModule({ onComplete = () => {}, onClose = () => {} }) {
  const [step, setStep] = useState(0)
  const [cloneSequence, setCloneSequence] = useState([])
  const [cloneSequenceChecked, setCloneSequenceChecked] = useState(false)
  const [demoWasSkipped, setDemoWasSkipped] = useState(false)
  const [selectedClues, setSelectedClues] = useState(() => new Set())
  const [incorrectClueSelections, setIncorrectClueSelections] = useState(() => new Set())
  const [clueFeedbackId, setClueFeedbackId] = useState(null)
  const [selectedResponse, setSelectedResponse] = useState('')
  const [verificationSequence, setVerificationSequence] = useState([])
  const [verificationChecked, setVerificationChecked] = useState(false)

  const cloneSequenceCorrect = arraysMatch(cloneSequence, voiceCloneStageOrder)
  const verificationCorrect = arraysMatch(verificationSequence, verificationOrder)
  const selectedResponseDetails = responseOptions.find((option) => option.id === selectedResponse)
  const selectedWarningCount = requiredVoiceRequestClues.filter((id) => selectedClues.has(id)).length
  const investigationCorrect = selectedWarningCount === requiredVoiceRequestClues.length && incorrectClueSelections.size === 0
  const results = [
    {
      title: 'Understood the cloning process',
      correct: cloneSequenceCorrect,
      feedback: cloneSequenceCorrect
        ? 'You correctly ordered the four stages used to create and deliver a voice clone.'
        : 'Remember: collect reference audio, analyse it, generate new speech, then deliver the impersonation.',
    },
    {
      title: 'Recognised contextual warning signs',
      correct: investigationCorrect,
      feedback: investigationCorrect
        ? 'You identified the suspicious context without treating the sound of the voice as proof.'
        : `You found ${selectedWarningCount} of ${requiredVoiceRequestClues.length} warning signs. Focus on urgency, secrecy, bypassed procedures and unexpected contact channels.`,
    },
    {
      title: 'Chose an independent response',
      correct: selectedResponse === 'verify',
      feedback: selectedResponse === 'verify'
        ? 'You left the attacker-controlled interaction and verified through a trusted channel.'
        : 'A familiar voice or personal knowledge is not authentication. End the interaction and verify independently.',
    },
    {
      title: 'Built a safe verification path',
      correct: verificationCorrect,
      feedback: verificationCorrect
        ? 'Your path paused the request, changed channels, confirmed the process and reported the attempt.'
        : 'The safest path pauses action and leaves the suspicious channel before contacting the claimed sender.',
    },
  ]
  const resultScore = results.filter((result) => result.correct).length

  const progress = useMemo(() => Math.round((step / (moduleSteps.length - 1)) * 100), [step])

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  const selectCloneStage = (stageId) => {
    if (cloneSequence.includes(stageId)) return
    setCloneSequence((current) => [...current, stageId])
    setCloneSequenceChecked(false)
  }

  const checkCloneSequence = () => {
    setCloneSequenceChecked(true)
  }

  const toggleClue = (clue) => {
    setClueFeedbackId(clue.id)
    if (!clue.isWarning) {
      setIncorrectClueSelections((current) => new Set(current).add(clue.id))
      return
    }
    setSelectedClues((current) => {
      const next = new Set(current)
      next.add(clue.id)
      return next
    })
  }

  const addVerificationAction = (actionId) => {
    if (verificationSequence.includes(actionId)) return
    setVerificationSequence((current) => [...current, actionId])
    setVerificationChecked(false)
  }

  const removeVerificationAction = (actionId) => {
    setVerificationSequence((current) => current.filter((id) => id !== actionId))
    setVerificationChecked(false)
  }

  const finishModule = () => {
    onComplete('voice-clone')
  }

  if (step === 1) {
    return (
      <div className="voice-module-backdrop">
        <section className="voice-module-shell" role="dialog" aria-modal="true" aria-labelledby="voice-module-title">
          <ModuleHeader step={step} progress={progress} onClose={onClose} />
          <main className="voice-module-content">
            <VoiceCloneDemo
              onComplete={() => setStep(2)}
              onSkip={() => {
                setDemoWasSkipped(true)
                setStep(2)
              }}
            />
          </main>
        </section>
      </div>
    )
  }

  return (
    <div className="voice-module-backdrop">
      <section className="voice-module-shell" role="dialog" aria-modal="true" aria-labelledby="voice-module-title">
        <ModuleHeader step={step} progress={progress} onClose={onClose} />

        <main className="voice-module-content">
        {step === 0 && (
          <div className="voice-module-stage">
            <StageHeading kicker="STEP 1 // ATTACK ANATOMY" title="How is a voice clone created?" description="Select the four stages in the order an attacker would use them. This simplified model explains the process without requiring technical knowledge." />

            <div className="voice-stage-options">
              {[voiceCloneStages[2], voiceCloneStages[0], voiceCloneStages[3], voiceCloneStages[1]].map((stage) => (
                <button type="button" key={stage.id} disabled={cloneSequence.includes(stage.id)} onClick={() => selectCloneStage(stage.id)}>
                  <span>{stage.number}</span><div><strong>{stage.title}</strong><small>{stage.description}</small></div><i>＋</i>
                </button>
              ))}
            </div>

            <div className="voice-sequence-board">
              <header><strong>YOUR ATTACK SEQUENCE</strong><button type="button" disabled={!cloneSequence.length} onClick={() => { setCloneSequence([]); setCloneSequenceChecked(false) }}>RESET</button></header>
              <div>
                {voiceCloneStageOrder.map((_, index) => {
                  const selected = voiceCloneStages.find((stage) => stage.id === cloneSequence[index])
                  return selected
                    ? <button type="button" key={selected.id} onClick={() => { setCloneSequence((current) => current.filter((id) => id !== selected.id)); setCloneSequenceChecked(false) }}><span>{index + 1}</span><strong>{selected.title}</strong><i>×</i></button>
                    : <div className="voice-empty-slot" key={`clone-slot-${index}`}><span>{index + 1}</span><small>Select the next stage</small></div>
                })}
              </div>
            </div>

            {cloneSequenceChecked && (
              <div className={`voice-module-feedback ${cloneSequenceCorrect ? 'correct' : 'incorrect'}`} role="status">
                <strong>{cloneSequenceCorrect ? '✓ Voice-clone process assembled' : '× The sequence needs another look'}</strong>
                <p>{cloneSequenceCorrect ? 'Reference audio is analysed before new speech can be generated and delivered as an impersonation.' : 'Start with audio that already exists. The system must analyse that reference before it can generate new speech.'}</p>
              </div>
            )}

            <StageActions>
              {!cloneSequenceChecked
                ? <button className="voice-module-primary" type="button" disabled={cloneSequence.length !== voiceCloneStageOrder.length} onClick={checkCloneSequence}>CHECK SEQUENCE</button>
                : <button className="voice-module-primary" type="button" onClick={() => setStep(1)}>CONTINUE TO LIVE DEMO</button>}
            </StageActions>
          </div>
        )}

        {step === 2 && (
          <div className="voice-module-stage">
            <StageHeading kicker="STEP 3 // INVESTIGATE THE REQUEST" title="The voice sounds right. Does the request?" description="Marcus appears to call an employee directly. Select every contextual warning sign. Do not rely on whether the audio sounds robotic." />

            {demoWasSkipped && <div className="voice-demo-skipped">The live demonstration was skipped. You can still complete every educational activity.</div>}

            <article className="voice-request-card">
              <header><span className="voice-caller-avatar">MR</span><div><strong>MARCUS REYES</strong><small>Incoming voice message • Identity unverified</small></div><span>0:18</span></header>
              <blockquote>“I’m about to enter a confidential board meeting. Transfer the supplier payment immediately and don’t contact Finance yet—I’ll explain everything afterward.”</blockquote>
              <div><span>CLAIMED ROLE</span><strong>Chief Executive Officer</strong><span>EXPECTED PROCESS</span><strong>Requests normally arrive through his assistant</strong></div>
            </article>

            <div className="voice-clue-grid">
              {voiceRequestClues.map((clue) => {
                const selected = selectedClues.has(clue.id)
                return <button type="button" className={selected ? 'selected' : ''} key={clue.id} onClick={() => toggleClue(clue)}><span>{selected ? '✓' : '?'}</span>{clue.label}</button>
              })}
            </div>

            {clueFeedbackId && (() => {
              const clue = voiceRequestClues.find((item) => item.id === clueFeedbackId)
              return <div className={`voice-module-feedback ${clue.isWarning ? 'correct' : 'lesson'}`} role="status"><strong>{clue.isWarning ? '✓ Contextual warning sign' : '◉ Important distinction'}</strong><p>{clue.explanation}</p></div>
            })()}

            <div className="voice-clue-progress"><strong>{selectedWarningCount} / {requiredVoiceRequestClues.length}</strong><span>contextual warning signs found</span></div>

            <StageActions>
              <button className="voice-module-primary" type="button" disabled={!selectedClues.size && !incorrectClueSelections.size} onClick={() => setStep(3)}>SUBMIT AND CONTINUE</button>
            </StageActions>
          </div>
        )}

        {step === 3 && (
          <div className="voice-module-stage">
            <StageHeading kicker="STEP 4 // MAKE THE DECISION" title="How should the employee respond?" description="The request is urgent and the voice is convincing. Choose the response that provides the strongest defence." />

            <div className="voice-response-options">
              {responseOptions.map((option, index) => (
                <button type="button" className={selectedResponse === option.id ? `selected ${option.tone}` : ''} key={option.id} onClick={() => setSelectedResponse(option.id)}>
                  <span>{String.fromCharCode(65 + index)}</span><div><strong>{option.title}</strong><small>{option.description}</small></div>
                </button>
              ))}
            </div>

            {selectedResponseDetails && (
              <div className={`voice-response-result ${selectedResponseDetails.tone}`} role="status">
                <strong>{selectedResponseDetails.tone === 'safe' ? '✓ SAFE RESPONSE' : selectedResponseDetails.tone === 'risky' ? '× RISKY RESPONSE' : '? PARTIAL DEFENCE'}</strong>
                <p>{selectedResponseDetails.feedback}</p>
              </div>
            )}

            <StageActions>
              <button className="voice-module-secondary" type="button" onClick={() => setStep(2)}>BACK</button>
              <button className="voice-module-primary" type="button" disabled={!selectedResponse} onClick={() => setStep(4)}>BUILD THE VERIFICATION PATH</button>
            </StageActions>
          </div>
        )}

        {step === 4 && (
          <div className="voice-module-stage">
            <StageHeading kicker="STEP 5 // RESTORE TRUST" title="Build the independent verification path" description="Select the actions in the safest order. Verification must leave the communication channel controlled by the suspected attacker." />

            <div className="voice-verification-layout">
              <div className="voice-verification-actions">
                {verificationChoiceOrder.map((actionId) => {
                  const action = verificationActions.find((item) => item.id === actionId)
                  return <button type="button" key={action.id} disabled={verificationSequence.includes(action.id)} onClick={() => addVerificationAction(action.id)}><strong>{action.title}</strong><small>{action.description}</small><i>＋</i></button>
                })}
              </div>
              <div className="voice-verification-sequence">
                <header><strong>YOUR VERIFICATION PATH</strong><button type="button" disabled={!verificationSequence.length} onClick={() => { setVerificationSequence([]); setVerificationChecked(false) }}>RESET</button></header>
                {verificationOrder.map((_, index) => {
                  const selected = verificationActions.find((action) => action.id === verificationSequence[index])
                  return selected
                    ? <button type="button" key={selected.id} onClick={() => removeVerificationAction(selected.id)}><span>{index + 1}</span><div><strong>{selected.title}</strong><small>{selected.description}</small></div><i>×</i></button>
                    : <div className="voice-empty-slot" key={`verification-slot-${index}`}><span>{index + 1}</span><small>Select the next defensive action</small></div>
                })}
              </div>
            </div>

            {verificationChecked && <div className={`voice-module-feedback ${verificationCorrect ? 'correct' : 'incorrect'}`} role="status"><strong>{verificationCorrect ? '✓ Independent verification established' : '× Verification path needs another look'}</strong><p>{verificationCorrect ? 'The employee paused, left the suspicious channel, used trusted contact details, confirmed the process and reported the attempt.' : 'First stop the pressured decision. Leave the attacker-controlled channel before independently contacting the claimed sender.'}</p></div>}

            <StageActions>
              {!verificationChecked
                ? <button className="voice-module-primary" type="button" disabled={verificationSequence.length !== verificationOrder.length} onClick={() => setVerificationChecked(true)}>CHECK VERIFICATION PATH</button>
                : <button className="voice-module-primary" type="button" onClick={() => setStep(5)}>VIEW RESULTS</button>}
            </StageActions>
          </div>
        )}

        {step === 5 && (
          <div className="voice-module-stage voice-module-summary">
            <StageHeading kicker="STEP 6 // YOUR RESULTS" title={`${resultScore} of ${results.length} safe decisions`} description="Review your decisions below. Incorrect answers do not prevent completion—they show where a real attacker could apply pressure." />

            <div className="voice-results-overview" aria-label={`Result: ${resultScore} out of ${results.length}`}>
              <div className="voice-results-score"><strong>{resultScore}</strong><span>/ {results.length}</span></div>
              <div><strong>{resultScore === results.length ? 'Excellent threat response' : resultScore >= 2 ? 'Good start—review the highlighted lessons' : 'Review the safe response before continuing'}</strong><p>The demonstration was {demoWasSkipped ? 'skipped and was not graded.' : 'completed and was not graded.'}</p></div>
            </div>

            <div className="voice-results-list">
              {results.map((result) => (
                <article className={result.correct ? 'correct' : 'improve'} key={result.title}>
                  <span aria-hidden="true">{result.correct ? '✓' : '!'}</span>
                  <div><strong>{result.title}</strong><p>{result.feedback}</p></div>
                  <small>{result.correct ? 'SAFE DECISION' : 'REVIEW'}</small>
                </article>
              ))}
            </div>

            <StageHeading kicker="KEY TAKEAWAYS" title="A familiar voice is not proof of identity" description="You do not need to prove that audio is fake before choosing to verify an important request." />

            <div className="voice-summary-principles">
              <article><span>01</span><strong>Consider the context</strong><p>Urgency, secrecy and requests to bypass procedure remain warning signs even when the voice sounds natural.</p></article>
              <article><span>02</span><strong>Leave the suspicious channel</strong><p>Do not let the caller control how their identity or request is checked.</p></article>
              <article><span>03</span><strong>Verify and report</strong><p>Use established contact details, follow approval procedures and report the suspected impersonation.</p></article>
            </div>

            <div className="voice-module-complete"><span>✓</span><div><strong>VOICE-CLONE MODULE COMPLETE</strong><p>Your temporary demonstration audio has been cleared. You are ready to return to the Training Library.</p></div></div>

            <StageActions>
              <button className="voice-module-primary" type="button" onClick={finishModule}>COMPLETE MODULE</button>
            </StageActions>
          </div>
        )}
        </main>
      </section>
    </div>
  )
}

function ModuleHeader({ step, progress, onClose }) {
  return (
    <header className="voice-module-header">
      <div><span>UNIVERSAL TRAINING MODULE // DEEPFAKE</span><h1 id="voice-module-title">VOICE-CLONE DEEPFAKE</h1></div>
      <div className="voice-module-progress"><span>STEP {step + 1} OF {moduleSteps.length}</span><div><i style={{ width: `${progress}%` }} /></div><strong>{progress}%</strong></div>
      <button type="button" aria-label="Close Voice-Clone Deepfake training" onClick={onClose}>×</button>
    </header>
  )
}

function StageHeading({ kicker, title, description }) {
  return <header className="voice-stage-heading"><span>{kicker}</span><h2>{title}</h2><p>{description}</p></header>
}

function StageActions({ children }) {
  return <footer className="voice-stage-actions">{children}</footer>
}

export default VoiceCloneModule
