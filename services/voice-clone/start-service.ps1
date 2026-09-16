$ErrorActionPreference = 'Stop'

$serviceRoot = $PSScriptRoot
$defaultPythonPath = Join-Path $serviceRoot '.venv\Scripts\python.exe'
$pythonPath = if ($env:VOICE_CLONE_PYTHON) {
    $env:VOICE_CLONE_PYTHON
} else {
    $defaultPythonPath
}

if (-not (Test-Path -LiteralPath $pythonPath)) {
    throw "The local Python environment was not found at $pythonPath. Create .venv or set VOICE_CLONE_PYTHON to another environment's python.exe."
}

$env:HF_HOME = Join-Path $serviceRoot '.model-cache'
$env:HF_HUB_CACHE = Join-Path $env:HF_HOME 'hub'
$env:HF_HUB_DISABLE_SYMLINKS_WARNING = '1'
$env:PYTHONUNBUFFERED = '1'

Write-Host 'Starting the Breach Point local voice-clone service...'
Write-Host "Python environment: $pythonPath"
Write-Host 'Keep this window open while testing. Press Ctrl+C to stop.'
Write-Host 'No external voice-generation API is configured.'

& $pythonPath (Join-Path $serviceRoot 'server.py')
