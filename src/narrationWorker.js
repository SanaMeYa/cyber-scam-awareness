// narrationWorker.js
// Runs entirely on a separate thread from the React app. Kokoro's generate()
// call does real WASM computation — if that ran on the main thread, the
// browser can't process clicks, re-render, or otherwise respond to input
// until it finishes, which is what was making the page feel laggy. Moving
// it here keeps the UI thread free the whole time.
//
// Message protocol (both directions are plain objects via postMessage):
//   in:  { id, text, voice }
//   out: { id, blob }            on success
//   out: { id, error }           on failure

import { KokoroTTS } from 'kokoro-js'

let ttsPromise = null
async function getTts() {
  if (!ttsPromise) {
    ttsPromise = KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
      dtype: 'q8',
      device: 'wasm',
    })
  }

  try {
    return await ttsPromise
  } catch (error) {
    // Do not permanently cache a rejected model download/initialisation.
    // A later Play or Replay press can retry after a temporary network,
    // IndexedDB, or WebAssembly failure.
    ttsPromise = null
    throw error
  }
}

self.onmessage = async (event) => {
  const { id, text, voice } = event.data

  try {
    const tts = await getTts()
    const audio = await tts.generate(text, { voice })
    self.postMessage({ id, blob: audio.toBlob() })
  } catch (error) {
    self.postMessage({ id, error: error?.message ?? String(error) })
  }
}
