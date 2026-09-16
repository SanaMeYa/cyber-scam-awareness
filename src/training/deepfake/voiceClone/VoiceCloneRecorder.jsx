import { useEffect, useRef, useState } from 'react'
import './voice-clone-recorder.css'

const MAX_RECORDING_SECONDS = 20
const COUNTDOWN_SECONDS = 3

function chooseAudioMimeType() {
  const preferredTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
  ]

  return preferredTypes.find((type) => MediaRecorder.isTypeSupported(type)) ?? ''
}

function VoiceCloneRecorder({ onContinue = () => {}, onSkip = () => {} }) {
  const [hasConsented, setHasConsented] = useState(false)
  const [permissionState, setPermissionState] = useState('idle')
  const [countdown, setCountdown] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [recordingUrl, setRecordingUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const mediaRecorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const audioChunksRef = useRef([])
  const recordingUrlRef = useRef('')
  const recordingBlobRef = useRef(null)
  const countdownTimerRef = useRef(null)
  const recordingTimerRef = useRef(null)
  const mountedRef = useRef(true)

  const stopMicrophone = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
    mediaStreamRef.current = null
  }

  const revokeRecordingUrl = () => {
    if (recordingUrlRef.current) {
      URL.revokeObjectURL(recordingUrlRef.current)
      recordingUrlRef.current = ''
    }
  }

  const clearTimers = () => {
    window.clearInterval(countdownTimerRef.current)
    window.clearInterval(recordingTimerRef.current)
    countdownTimerRef.current = null
    recordingTimerRef.current = null
  }

  const clearRecording = () => {
    revokeRecordingUrl()
    audioChunksRef.current = []
    recordingBlobRef.current = null
    setRecordingUrl('')
    setRecordingSeconds(0)
  }

  const stopRecording = () => {
    clearTimers()
    const recorder = mediaRecorderRef.current

    if (recorder?.state === 'recording') {
      recorder.stop()
    } else {
      stopMicrophone()
      setIsRecording(false)
    }
  }

  const beginCapture = (stream) => {
    const mimeType = chooseAudioMimeType()
    const recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream)

    audioChunksRef.current = []
    mediaRecorderRef.current = recorder

    recorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) audioChunksRef.current.push(event.data)
    })

    recorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: recorder.mimeType || 'audio/webm',
      })

      if (mountedRef.current && audioBlob.size > 0) {
        recordingBlobRef.current = audioBlob
        revokeRecordingUrl()
        const nextUrl = URL.createObjectURL(audioBlob)
        recordingUrlRef.current = nextUrl
        setRecordingUrl(nextUrl)
      }

      audioChunksRef.current = []
      mediaRecorderRef.current = null
      stopMicrophone()
      if (mountedRef.current) setIsRecording(false)
    })

    recorder.start(250)
    setCountdown(null)
    setRecordingSeconds(0)
    setIsRecording(true)

    recordingTimerRef.current = window.setInterval(() => {
      setRecordingSeconds((current) => {
        const next = current + 1
        if (next >= MAX_RECORDING_SECONDS) {
          window.setTimeout(stopRecording, 0)
        }
        return Math.min(next, MAX_RECORDING_SECONDS)
      })
    }, 1000)
  }

  const requestMicrophoneAndRecord = async () => {
    clearTimers()
    clearRecording()
    setErrorMessage('')

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setPermissionState('unsupported')
      return
    }

    try {
      setPermissionState('requesting')
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      })

      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      mediaStreamRef.current = stream
      setPermissionState('granted')
      setCountdown(COUNTDOWN_SECONDS)

      let remaining = COUNTDOWN_SECONDS
      countdownTimerRef.current = window.setInterval(() => {
        remaining -= 1
        if (remaining === 0) {
          window.clearInterval(countdownTimerRef.current)
          countdownTimerRef.current = null
          beginCapture(stream)
        } else {
          setCountdown(remaining)
        }
      }, 1000)
    } catch (error) {
      stopMicrophone()
      setPermissionState('denied')
      setCountdown(null)
      setErrorMessage(
        error?.name === 'NotAllowedError'
          ? 'Microphone access was not allowed. You can enable it in the browser settings or skip this demonstration.'
          : 'The microphone could not be started. Check that it is connected and not being used by another application.',
      )
    }
  }

  const resetDemo = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    clearTimers()
    stopMicrophone()
    clearRecording()
    setCountdown(null)
    setIsRecording(false)
    setPermissionState('idle')
    setErrorMessage('')
    setHasConsented(false)
  }

  const finishDemo = () => {
    const selectedRecording = recordingBlobRef.current
    if (!selectedRecording) return
    resetDemo()
    onContinue(selectedRecording)
  }

  const skipDemo = () => {
    resetDemo()
    onSkip()
  }

  useEffect(() => {
    // React StrictMode runs an extra setup/cleanup cycle during development.
    // Restore the mounted flag when that second setup begins.
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      clearTimers()
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      stopMicrophone()
      revokeRecordingUrl()
      audioChunksRef.current = []
      recordingBlobRef.current = null
    }
  }, [])

  if (!hasConsented) {
    return (
      <section className="voice-recorder-card" aria-labelledby="voice-consent-title">
        <div className="voice-recorder-kicker">VOICE-CLONE DEMONSTRATION</div>
        <h2 id="voice-consent-title">Before we use your microphone</h2>
        <p>
          This optional activity records a short sample of your voice for an
          educational demonstration. During this recording step, the audio stays
          in this browser tab and is not placed in browser storage by the module.
        </p>

        <div className="voice-privacy-points">
          <div><span aria-hidden="true">◉</span><p><strong>Temporary</strong>Your recording is cleared when you finish, skip, re-record or leave the module.</p></div>
          <div><span aria-hidden="true">⌁</span><p><strong>Optional</strong>You can skip the demonstration and still complete the training.</p></div>
          <div><span aria-hidden="true">⊘</span><p><strong>No download</strong>The module does not provide a button to save or share your recording.</p></div>
        </div>

        <div className="voice-recorder-actions">
          <button className="voice-primary" type="button" onClick={() => setHasConsented(true)}>
            I CONSENT — CONTINUE
          </button>
          <button className="voice-secondary" type="button" onClick={skipDemo}>
            SKIP DEMONSTRATION
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="voice-recorder-card" aria-labelledby="voice-recorder-title">
      <div className="voice-recorder-kicker">TEMPORARY VOICE SAMPLE</div>
      <h2 id="voice-recorder-title">Record your reference audio</h2>
      <p className="voice-recorder-intro">
        Read the full passage naturally in a quiet voice. Aim for 12–15 seconds;
        the recording stops automatically after {MAX_RECORDING_SECONDS} seconds.
      </p>

      <blockquote>
        “Today I received an urgent request from someone claiming to be a senior
        manager. Before sharing information or approving a payment, I will pause,
        contact them through an official channel, and verify the request.”
      </blockquote>

      <div className={`voice-capture-panel ${isRecording ? 'recording' : ''}`} aria-live="polite">
        {countdown !== null ? (
          <div className="voice-countdown">
            <strong>{countdown}</strong>
            <span>Recording begins shortly</span>
          </div>
        ) : isRecording ? (
          <div className="voice-recording-status">
            <span className="voice-recording-dot" aria-hidden="true" />
            <strong>RECORDING</strong>
            <time>{String(recordingSeconds).padStart(2, '0')} / {MAX_RECORDING_SECONDS}s</time>
            <div className="voice-level-bars" aria-hidden="true">
              {Array.from({ length: 14 }, (_, index) => <i key={index} />)}
            </div>
            <button className="voice-stop" type="button" onClick={stopRecording}>STOP RECORDING</button>
          </div>
        ) : recordingUrl ? (
          <div className="voice-playback">
            <span className="voice-success-icon" aria-hidden="true">✓</span>
            <div><strong>VOICE SAMPLE READY</strong><small>Listen back before continuing.</small></div>
            <audio controls src={recordingUrl}>Your browser does not support audio playback.</audio>
          </div>
        ) : (
          <div className="voice-ready-state">
            <span aria-hidden="true">●</span>
            <strong>MICROPHONE READY</strong>
            <small>You will see a browser permission request.</small>
          </div>
        )}
      </div>

      {(permissionState === 'unsupported' || errorMessage) && (
        <div className="voice-recorder-error" role="alert">
          <strong>{permissionState === 'unsupported' ? 'Recording is not supported in this browser.' : 'Microphone unavailable'}</strong>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
      )}

      <div className="voice-recorder-actions">
        {!recordingUrl && !isRecording && countdown === null && (
          <button className="voice-primary" type="button" onClick={requestMicrophoneAndRecord} disabled={permissionState === 'requesting'}>
            {permissionState === 'requesting' ? 'REQUESTING MICROPHONE…' : 'START RECORDING'}
          </button>
        )}
        {recordingUrl && (
          <>
            <button className="voice-primary" type="button" onClick={finishDemo}>USE THIS RECORDING</button>
            <button className="voice-secondary" type="button" onClick={requestMicrophoneAndRecord}>RE-RECORD</button>
          </>
        )}
        <button className="voice-text-button" type="button" onClick={skipDemo}>SKIP DEMONSTRATION</button>
      </div>

      <p className="voice-cleanup-note">
        <span aria-hidden="true">▣</span>
        Microphone access stops immediately after recording. Temporary audio is cleared when this activity closes.
      </p>
    </section>
  )
}

export default VoiceCloneRecorder
