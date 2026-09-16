from __future__ import annotations

import asyncio
import gc
import io
import os
import subprocess
import tempfile
import threading
from contextlib import asynccontextmanager
from pathlib import Path

import perth
import imageio_ffmpeg
import torch
import torchaudio
from chatterbox.tts_turbo import ChatterboxTurboTTS
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response


MAX_UPLOAD_BYTES = 5 * 1024 * 1024
MAX_TEXT_CHARACTERS = 140
ALLOWED_AUDIO_TYPES = {
    "audio/webm",
    "audio/mp4",
    "audio/mpeg",
    "audio/ogg",
    "audio/wav",
    "audio/x-wav",
}

model: ChatterboxTurboTTS | None = None
model_device: str | None = None
model_status = "starting"
model_load_errors: list[str] = []
generation_lock = threading.Lock()
watermark_available = perth.PerthImplicitWatermarker is not None


def configure_windows_watermark_fallback() -> None:
    if perth.PerthImplicitWatermarker is None:
        # Chatterbox currently assumes the platform-specific Perth implementation
        # exists. The dummy implementation allows a local educational prototype
        # to run, but it does NOT provide a real detectable watermark.
        perth.PerthImplicitWatermarker = perth.DummyWatermarker


def available_devices() -> list[str]:
    requested_device = os.getenv("VOICE_CLONE_DEVICE", "auto").strip().lower()
    if requested_device != "auto":
        return [requested_device, "cpu"] if requested_device != "cpu" else ["cpu"]

    devices: list[str] = []
    # AMD ROCm builds of PyTorch also expose their accelerator through the
    # torch.cuda interface, so this covers supported NVIDIA and AMD installs.
    if torch.cuda.is_available():
        devices.append("cuda")
    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        devices.append("mps")
    if hasattr(torch, "xpu") and torch.xpu.is_available():
        devices.append("xpu")
    devices.append("cpu")
    return devices


def load_model() -> tuple[ChatterboxTurboTTS | None, str | None, list[str]]:
    errors: list[str] = []

    configure_windows_watermark_fallback()
    for device in available_devices():
        try:
            print(f"Trying voice-clone model on device: {device}")
            loaded_model = ChatterboxTurboTTS.from_pretrained(device=device)
            print(f"Voice-clone model ready on device: {device}")
            return loaded_model, device, errors
        except Exception as error:
            errors.append(f"{device}: {type(error).__name__}")
            print(f"Voice-clone model could not load on {device}: {type(error).__name__}")
            release_accelerator_memory()

    return None, None, errors


def release_accelerator_memory() -> None:
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    if hasattr(torch, "xpu") and torch.xpu.is_available():
        torch.xpu.empty_cache()


@asynccontextmanager
async def lifespan(_: FastAPI):
    global model, model_device, model_status, model_load_errors
    model_status = "loading"
    model, model_device, model_load_errors = await asyncio.to_thread(load_model)
    model_status = "ready" if model is not None else "unavailable"
    yield
    model = None
    model_device = None
    release_accelerator_memory()


app = FastAPI(
    title="Breach Point Local Voice-Clone Demonstration",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health() -> dict[str, object]:
    return {
        "status": model_status,
        "device": model_device,
        "attemptedDevices": available_devices(),
        "loadErrors": model_load_errors,
        "watermarkAvailable": watermark_available,
        "temporaryProcessing": True,
    }


@app.post("/api/voice-clone")
async def create_voice_clone(
    reference_audio: UploadFile = File(...),
    text: str = Form(...),
) -> Response:
    normalised_text = " ".join(text.split())
    if not normalised_text:
        raise HTTPException(status_code=400, detail="Enter a sentence for generation.")
    if len(normalised_text) > MAX_TEXT_CHARACTERS:
        raise HTTPException(status_code=400, detail=f"Text must be {MAX_TEXT_CHARACTERS} characters or fewer.")

    content_type = (reference_audio.content_type or "").split(";", 1)[0].lower()
    if content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(status_code=415, detail="The browser supplied an unsupported audio format.")

    uploaded_audio = await reference_audio.read(MAX_UPLOAD_BYTES + 1)
    await reference_audio.close()
    if not uploaded_audio:
        raise HTTPException(status_code=400, detail="The temporary reference recording is empty.")
    if len(uploaded_audio) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="The temporary reference recording is too large.")
    if model is None:
        raise HTTPException(status_code=503, detail="No compatible local generation device is available. Use the bundled example.")

    try:
        generated_wav = await asyncio.to_thread(
            generate_audio,
            uploaded_audio,
            suffix_for_content_type(content_type),
            normalised_text,
        )
    except Exception as error:
        # Do not include user text, filenames or audio data in logs/errors.
        print(f"Voice generation failed: {type(error).__name__}: {error}")
        raise HTTPException(status_code=500, detail="Local voice generation failed. Re-record the sample and try again.") from error
    finally:
        uploaded_audio = b""

    return Response(
        content=generated_wav,
        media_type="audio/wav",
        headers={
            "Cache-Control": "no-store, max-age=0",
            "Pragma": "no-cache",
            "X-Voice-Watermark": "perth" if watermark_available else "unavailable-on-windows",
        },
    )


def generate_audio(uploaded_audio: bytes, upload_suffix: str, text: str) -> bytes:
    global model, model_device, model_status, model_load_errors
    if model is None:
        raise RuntimeError("Model is unavailable")

    with generation_lock, tempfile.TemporaryDirectory(prefix="breach-point-voice-") as temporary_directory:
        temporary_path = Path(temporary_directory)
        uploaded_path = temporary_path / f"reference{upload_suffix}"
        reference_wav_path = temporary_path / "reference.wav"
        output_path = temporary_path / "generated.wav"

        uploaded_path.write_bytes(uploaded_audio)
        try:
            waveform, sample_rate = torchaudio.load(str(uploaded_path))
        except Exception:
            convert_browser_audio_to_wav(uploaded_path, reference_wav_path)
            waveform, sample_rate = torchaudio.load(str(reference_wav_path))
        if waveform.numel() == 0:
            raise ValueError("Decoded audio is empty")

        if waveform.shape[0] > 1:
            waveform = waveform.mean(dim=0, keepdim=True)

        duration_seconds = waveform.shape[-1] / sample_rate
        if duration_seconds < 3:
            raise ValueError("Reference recording is shorter than three seconds")
        if duration_seconds > 20:
            maximum_frames = int(sample_rate * 20)
            waveform = waveform[:, :maximum_frames]

        torchaudio.save(str(reference_wav_path), waveform, sample_rate)
        try:
            generated = model.generate(text, audio_prompt_path=str(reference_wav_path))
        except Exception as accelerator_error:
            if model_device == "cpu":
                raise

            failed_device = model_device
            print(f"Generation failed on {failed_device}; attempting CPU fallback: {type(accelerator_error).__name__}")
            model = None
            model_device = None
            release_accelerator_memory()
            try:
                model = ChatterboxTurboTTS.from_pretrained(device="cpu")
                model_device = "cpu"
                model_status = "ready"
                generated = model.generate(text, audio_prompt_path=str(reference_wav_path))
            except Exception as cpu_error:
                model = None
                model_status = "unavailable"
                model_load_errors.extend([
                    f"{failed_device} generation: {type(accelerator_error).__name__}",
                    f"cpu generation: {type(cpu_error).__name__}",
                ])
                raise RuntimeError("Accelerated and CPU voice generation both failed") from cpu_error
        torchaudio.save(str(output_path), generated.cpu(), model.sr)
        result = output_path.read_bytes()

        # TemporaryDirectory removes the source, converted reference and result
        # when this block exits, including when model generation raises.
        return result


def suffix_for_content_type(content_type: str) -> str:
    return {
        "audio/mp4": ".m4a",
        "audio/mpeg": ".mp3",
        "audio/ogg": ".ogg",
        "audio/wav": ".wav",
        "audio/x-wav": ".wav",
    }.get(content_type, ".webm")


def convert_browser_audio_to_wav(source_path: Path, output_path: Path) -> None:
    ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
    completed = subprocess.run(
        [
            ffmpeg_path,
            "-nostdin",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(source_path),
            "-ac",
            "1",
            "-ar",
            "24000",
            str(output_path),
        ],
        capture_output=True,
        check=False,
        timeout=30,
    )
    if completed.returncode != 0 or not output_path.is_file():
        raise ValueError("The browser audio recording could not be decoded")


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("VOICE_CLONE_HOST", "127.0.0.1")
    port = int(os.getenv("VOICE_CLONE_PORT", "8000"))
    uvicorn.run(app, host=host, port=port, log_level="info")
