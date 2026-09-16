import { useEffect, useRef, useState } from 'react'
import VoiceCloneRecorder from './VoiceCloneRecorder.jsx'
import { generateVoiceClone, VoiceCloneServiceError } from './voiceCloneService.js'
import fallbackVoiceCloneUrl from './fallback-voice-clone.wav'
import './voice-clone-demo.css'

const MAX_GENERATION_CHARACTERS = 140
const GENERATION_TIMEOUT_MS = 90000
const FALLBACK_TRANSCRIPT = 'Please verify this request through an official company channel before taking action.'

const suggestedSentences = [
  'Please transfer the payment before the meeting begins.',
  'I need you to send me the confidential report immediately.',
  'Do not contact anyone else until this request is complete.',
]

function VoiceCloneDemo({
  onComplete = () => {},
  onSkip = () => {},
  generateClone = generateVoiceClone,
}) {
  const [stage, setStage] = useState('record')
  const [referenceAudio, setReferenceAudio] = useState(null)
  const [referenceUrl, setReferenceUrl] = useState('')
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [text, setText] = useState(suggestedSentences[0])
  const [generationState, setGenerationState] = useState('idle')
  const [generationSource, setGenerationSource] = useState('personal')
  const [errorMessage, setErrorMessage] = useState('')

  const referenceUrlRef = useRef('')
  const generatedUrlRef = useRef('')
  const generationControllerRef = useRef(null)

  const revokeUrl = (urlRef) => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = ''
    }
  }

  const clearGeneratedAudio = () => {
    revokeUrl(generatedUrlRef)
    setGeneratedUrl('')
    setGenerationState('idle')
    setGenerationSource('personal')
    setErrorMessage('')
  }

  const clearAllTemporaryAudio = () => {
    generationControllerRef.current?.abort()
    generationControllerRef.current = null
    revokeUrl(referenceUrlRef)
    revokeUrl(generatedUrlRef)
    setReferenceUrl('')
    setGeneratedUrl('')
    setReferenceAudio(null)
    setGenerationState('idle')
    setErrorMessage('')
  }

  const acceptRecording = (recording) => {
    revokeUrl(referenceUrlRef)
    const nextUrl = URL.createObjectURL(recording)
    referenceUrlRef.current = nextUrl
    setReferenceAudio(recording)
    setReferenceUrl(nextUrl)
    setStage('compose')
  }

  const returnToRecorder = () => {
    clearAllTemporaryAudio()
    setStage('record')
  }

  const requestGeneration = async () => {
    if (!referenceAudio || !text.trim()) return

    clearGeneratedAudio()
    const controller = new AbortController()
    let generationTimedOut = false
    const timeoutId = window.setTimeout(() => {
      generationTimedOut = true
      controller.abort()
    }, GENERATION_TIMEOUT_MS)
    generationControllerRef.current = controller
    setGenerationState('generating')

    try {
      const audioBlob = await generateClone({
        recording: referenceAudio,
        text: text.trim(),
        signal: controller.signal,
      })

      if (controller.signal.aborted) return
      const nextUrl = URL.createObjectURL(audioBlob)
      generatedUrlRef.current = nextUrl
      setGeneratedUrl(nextUrl)
      setGenerationSource('personal')
      setGenerationState('complete')
      setStage('result')
    } catch (error) {
      if (error?.name === 'AbortError' && !generationTimedOut) return
      setErrorMessage(
        generationTimedOut
          ? 'The local model did not respond within 90 seconds. You can try again or delete the recording and continue without the demonstration.'
          : error instanceof VoiceCloneServiceError
          ? error.message
          : 'Voice generation could not be completed. Please try again.',
      )
      setGeneratedUrl(fallbackVoiceCloneUrl)
      setGenerationSource('fallback')
      setGenerationState('complete')
      setStage('result')
    } finally {
      window.clearTimeout(timeoutId)
      if (generationControllerRef.current === controller) {
        generationControllerRef.current = null
      }
    }
  }

  const finishActivity = () => {
    clearAllTemporaryAudio()
    onComplete()
  }

  const skipActivity = () => {
    clearAllTemporaryAudio()
    onSkip()
  }

  useEffect(() => () => {
    generationControllerRef.current?.abort()
    revokeUrl(referenceUrlRef)
    revokeUrl(generatedUrlRef)
  }, [])

  if (stage === 'record') {
    return <VoiceCloneRecorder onContinue={acceptRecording} onSkip={skipActivity} />
  }

  if (stage === 'result') {
    return (
      <section className="voice-demo-card" aria-labelledby="voice-result-title">
        <div className="voice-demo-kicker">VOICE-CLONE DEMONSTRATION // RESULT</div>
        <h2 id="voice-result-title">{generationSource === 'personal' ? 'You never recorded those words' : 'Live generation was unavailable'}</h2>
        <p>
          {generationSource === 'personal'
            ? 'The generated clip used characteristics from your temporary reference sample to produce a sentence you did not speak.'
            : 'The module has continued with a pre-generated fictional example. Your temporary recording was not used to create this example.'}
        </p>

        {generationSource === 'fallback' && (
          <div className="voice-fallback-notice" role="status">
            <strong>PRE-GENERATED FALLBACK ACTIVE</strong>
            <p>{errorMessage} You can still complete the lesson normally.</p>
          </div>
        )}

        <div className="voice-audio-comparison">
          <article>
            <span>01 // {generationSource === 'personal' ? 'ORIGINAL' : 'YOUR RECORDING'}</span>
            <h3>{generationSource === 'personal' ? 'Your reference recording' : 'Not used for fallback audio'}</h3>
            <audio controls src={referenceUrl}>Original voice recording</audio>
          </article>
          <article className="generated">
            <span>02 // {generationSource === 'personal' ? 'GENERATED' : 'FICTIONAL EXAMPLE'}</span>
            <h3>{generationSource === 'personal' ? 'Words you typed' : 'Bundled example clone'}</h3>
            <blockquote>“{generationSource === 'personal' ? text : FALLBACK_TRANSCRIPT}”</blockquote>
            <audio controls src={generatedUrl}>Generated voice-clone audio</audio>
          </article>
        </div>

        <div className="voice-capability-note">
          <strong>This demonstration is only one example of voice-cloning technology.</strong>
          <p>
            Other tools can use different models, more reference audio and additional
            processing to produce a more convincing and realistic result. An imperfect
            clone here should not be treated as the limit of what an attacker could create.
          </p>
        </div>

        <div className="voice-warning-message">
          <strong>A familiar voice is not proof of identity.</strong>
          <p>Evaluate the request and verify important actions through a separate trusted channel.</p>
        </div>

        <div className="voice-demo-actions">
          <button className="voice-demo-primary" type="button" onClick={finishActivity}>DELETE AUDIO AND CONTINUE</button>
          <button className="voice-demo-secondary" type="button" onClick={() => { clearGeneratedAudio(); setStage('compose') }}>TRY DIFFERENT TEXT</button>
        </div>
      </section>
    )
  }

  return (
    <section className="voice-demo-card" aria-labelledby="voice-compose-title">
      <div className="voice-demo-kicker">VOICE-CLONE DEMONSTRATION // CREATE</div>
      <h2 id="voice-compose-title">What could your cloned voice say?</h2>
      <p>
        Enter a short fictional request. The next stage will send this text and
        your temporary sample only to the local demonstration service.
      </p>

      <div className="voice-reference-ready">
        <span aria-hidden="true">✓</span>
        <div><strong>REFERENCE SAMPLE READY</strong><small>Stored temporarily in this browser tab</small></div>
        <audio controls src={referenceUrl}>Temporary reference recording</audio>
      </div>

      <label className="voice-text-entry">
        <span>GENERATED SPEECH TEXT</span>
        <textarea
          value={text}
          maxLength={MAX_GENERATION_CHARACTERS}
          rows="3"
          onChange={(event) => {
            setText(event.target.value)
            if (generationState === 'error') {
              setGenerationState('idle')
              setErrorMessage('')
            }
          }}
        />
        <small>{text.length} / {MAX_GENERATION_CHARACTERS} characters</small>
      </label>

      <div className="voice-suggestions">
        <span>SAFE DEMONSTRATION EXAMPLES</span>
        <div>
          {suggestedSentences.map((sentence) => (
            <button type="button" key={sentence} onClick={() => setText(sentence)}>{sentence}</button>
          ))}
        </div>
      </div>

      {generationState === 'generating' && (
        <div className="voice-generation-status" role="status">
          <span aria-hidden="true" />
          <div><strong>GENERATING LOCALLY</strong><small>This may take several seconds once the model is connected.</small></div>
        </div>
      )}

      {generationState === 'error' && (
        <div className="voice-generation-error" role="alert">
          <strong>LOCAL GENERATOR NOT AVAILABLE</strong>
          <p>{errorMessage}</p>
          <small>The temporary reference sample is still held only in this browser tab.</small>
        </div>
      )}

      <div className="voice-demo-actions">
        <button className="voice-demo-primary" type="button" disabled={!text.trim() || generationState === 'generating'} onClick={requestGeneration}>
          {generationState === 'generating' ? 'GENERATING…' : 'GENERATE TEMPORARY AUDIO'}
        </button>
        <button className="voice-demo-secondary" type="button" disabled={generationState === 'generating'} onClick={returnToRecorder}>RE-RECORD VOICE</button>
        <button className="voice-demo-text" type="button" onClick={skipActivity}>{generationState === 'generating' ? 'CANCEL GENERATION AND SKIP' : 'DELETE AND SKIP'}</button>
      </div>

      <p className="voice-local-note"><span aria-hidden="true">▣</span>No third-party generation service is configured.</p>
    </section>
  )
}

export default VoiceCloneDemo
