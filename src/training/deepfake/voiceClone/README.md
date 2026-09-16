# Voice-clone recorder prototype

This folder contains the first two isolated layers of the Voice-Clone Deepfake
training module. It records and replays a short microphone sample, accepts a
short generation script, and calls a replaceable local generation adapter.

## Current component interface

```jsx
<VoiceCloneDemo onComplete={completeModule} onSkip={continueWithoutDemo} />
```

`VoiceCloneRecorder` remains available as the lower-level recording component.
Its `onContinue` callback now receives the in-memory recording `Blob`.

## Current privacy boundary

- The recording is held as an in-memory `Blob` and played through a temporary
  object URL.
- Re-recording, skipping, continuing, or unmounting revokes that URL and stops
  the microphone.
- The default adapter sends the recording only to
  `http://127.0.0.1:8000/api/voice-clone`; it does not use a third-party URL.
- The local service is not implemented yet, so generation currently displays a
  clear service-unavailable message.
- Microphone recording requires `localhost` or HTTPS.

## Next stage

Implement the local `POST /api/voice-clone` service. It must accept multipart
fields named `reference_audio` and `text`, then return an audio response. It
must process temporary data in memory where practical and guarantee file
cleanup in a `finally` block if temporary files are required by the model.
