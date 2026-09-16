const DEFAULT_SERVICE_URL = 'http://127.0.0.1:8000/api/voice-clone'

export class VoiceCloneServiceError extends Error {
  constructor(message, code = 'VOICE_CLONE_ERROR') {
    super(message)
    this.name = 'VoiceCloneServiceError'
    this.code = code
  }
}

export async function generateVoiceClone({
  recording,
  text,
  signal,
  serviceUrl = DEFAULT_SERVICE_URL,
}) {
  if (!(recording instanceof Blob) || recording.size === 0) {
    throw new VoiceCloneServiceError('A valid temporary voice recording is required.', 'INVALID_RECORDING')
  }

  const normalisedText = text.trim()
  if (!normalisedText) {
    throw new VoiceCloneServiceError('Enter a sentence for the generated voice.', 'INVALID_TEXT')
  }

  const formData = new FormData()
  formData.append('reference_audio', recording, `reference.${fileExtensionFor(recording.type)}`)
  formData.append('text', normalisedText)

  let response
  try {
    response = await fetch(serviceUrl, {
      method: 'POST',
      body: formData,
      signal,
    })
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    throw new VoiceCloneServiceError(
      'The local voice-generation service is not running yet. Your recording has not been uploaded to an external service.',
      'SERVICE_UNAVAILABLE',
    )
  }

  if (!response.ok) {
    let detail = ''
    try {
      const errorBody = await response.json()
      detail = errorBody.detail || errorBody.message || ''
    } catch {
      // The service may return an empty or non-JSON error response.
    }

    throw new VoiceCloneServiceError(
      detail || `Voice generation failed with status ${response.status}.`,
      'GENERATION_FAILED',
    )
  }

  const generatedAudio = await response.blob()
  if (!generatedAudio.type.startsWith('audio/') || generatedAudio.size === 0) {
    throw new VoiceCloneServiceError('The local service returned an invalid audio response.', 'INVALID_RESPONSE')
  }

  return generatedAudio
}

function fileExtensionFor(mimeType) {
  if (mimeType.includes('mp4')) return 'm4a'
  if (mimeType.includes('ogg')) return 'ogg'
  return 'webm'
}
