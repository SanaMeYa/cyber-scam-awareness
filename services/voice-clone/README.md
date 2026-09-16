# Local voice-clone service prototype

This is an isolated, local-only Chatterbox Turbo proof of concept for the
Breach Point Voice-Clone Deepfake training module. The service tries compatible
accelerators first and then CPU. If local generation remains unavailable, the
React module automatically uses its bundled fictional example.

## Hardware selection

The default setting is `auto`. The service attempts devices in this order when
they are reported as available by the installed PyTorch build:

1. `cuda` (NVIDIA CUDA, or AMD ROCm on supported systems)
2. `mps` (Apple Silicon)
3. `xpu` (supported Intel accelerators)
4. `cpu`

PyTorch must be installed for the computer's actual platform. Detecting a GPU
does not install its driver or the appropriate PyTorch build. The device may be
overridden before starting the service:

```powershell
$env:VOICE_CLONE_DEVICE = "cpu"
```

The startup script normally uses `.venv`. A different environment can be used
without editing the script:

```powershell
$env:VOICE_CLONE_PYTHON = "C:\path\to\environment\Scripts\python.exe"
.\start-service.ps1
```

The `/health` endpoint reports the selected device and any device types that
could not load the model.

## Python dependencies

Use Python 3.11. Install the correct PyTorch and torchaudio packages for the
computer first, following the platform-specific PyTorch instructions. Then run:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

The first model start requires internet access to download the Chatterbox model.
Do not commit `.venv`, `.model-cache`, `.python`, `.uv-cache` or `.uv-tool`.

## Start

From PowerShell:

```powershell
& "C:\Users\kiera\Documents\Codex\2026-08-07\annagriffith-cyber-scam-awareness-https-github\work\voice-clone-service\start-service.ps1"
```

Wait until the terminal reports that the application startup is complete,
then keep that terminal open while using the React test page.

Health check: <http://127.0.0.1:8000/health>

## Request contract

`POST /api/voice-clone` accepts multipart fields:

- `reference_audio`: a browser recording, maximum 5 MiB
- `text`: the sentence to generate, maximum 140 characters

It returns `audio/wav` with `Cache-Control: no-store`.

## Privacy and safety boundary

- The server binds to `127.0.0.1`, not the local network.
- It does not use an external generation API.
- Upload, converted reference and generated files live inside a unique
  `TemporaryDirectory` and are deleted after each request.
- The service does not log the supplied text, filename or audio.
- Requests are serialised to avoid concurrent GPU-memory spikes.
- Generated audio is not downloadable through the React interface.

## Known constraint

The real Perth audio-watermark implementation is unavailable in the current
Windows package. The prototype uses Perth's explicit `DummyWatermarker` so
Chatterbox can run, but the resulting audio is **not genuinely watermarked**.
The final project must disclose this constraint or add a Windows-compatible
watermarking implementation.

## Bundled fallback

`fallback-voice-clone.wav` is a pre-generated fictional training example. The
browser labels it clearly and does not claim it was created from the learner's
recording. It is used automatically if the service is absent, times out, or
reports that no local device can generate audio.
