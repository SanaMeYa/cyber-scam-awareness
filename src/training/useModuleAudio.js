import { useCallback, useEffect, useRef, useState } from 'react'

export default function useModuleAudio(onPlayingChange) {
  const audioRef = useRef(null)
  const [playingId, setPlayingId] = useState(null)
  const [paused, setPaused] = useState(false)

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setPlayingId(null)
    setPaused(false)
    onPlayingChange?.(false)
  }, [onPlayingChange])

  const play = useCallback((id, src, onEnded) => {
    if (audioRef.current && playingId === id) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {})
        setPaused(false)
        onPlayingChange?.(true)
      } else {
        audioRef.current.pause()
        setPaused(true)
        onPlayingChange?.(false)
      }
      return
    }

    stop()
    const audio = new Audio(src)
    audioRef.current = audio
    setPlayingId(id)
    setPaused(false)
    onPlayingChange?.(true)
    audio.onended = () => {
      setPlayingId(null)
      setPaused(false)
      onPlayingChange?.(false)
      onEnded?.()
    }
    audio.onerror = () => stop()
    audio.play().catch(() => stop())
  }, [onPlayingChange, playingId, stop])

  useEffect(() => stop, [stop])

  return { playingId, paused, play, stop }
}
