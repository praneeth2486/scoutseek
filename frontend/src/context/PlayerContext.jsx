import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { analyticsApi } from '../api'
import { useAuth } from './AuthContext'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null)
  const [queue, setQueue] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const audioRef = useRef(new Audio())
  const { user } = useAuth()
  const playRecorded = useRef(false)

  useEffect(() => {
    const audio = audioRef.current
    audio.volume = volume

    const onTimeUpdate = () => setProgress(audio.currentTime)
    const onDurationChange = () => setDuration(audio.duration)
    const onEnded = () => {
      playNext()
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
    }
  }, [queue])

  const playSong = (song, songQueue = []) => {
    audioRef.current.src = song.filePath
    audioRef.current.play()
    setCurrentSong(song)
    setIsPlaying(true)
    setProgress(0)
    playRecorded.current = false
    if (songQueue.length) setQueue(songQueue)

    // Record play after 10s
    setTimeout(() => {
      if (user && !playRecorded.current) {
        analyticsApi.recordPlay({ songId: song.songId, listenedSeconds: 10 }).catch(() => {})
        playRecorded.current = true
      }
    }, 10000)
  }

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const playNext = () => {
    if (!queue.length || !currentSong) return
    const idx = queue.findIndex(s => s.songId === currentSong.songId)
    if (idx < queue.length - 1) playSong(queue[idx + 1], queue)
  }

  const playPrev = () => {
    if (!queue.length || !currentSong) return
    const idx = queue.findIndex(s => s.songId === currentSong.songId)
    if (idx > 0) playSong(queue[idx - 1], queue)
  }

  const seek = (time) => {
    audioRef.current.currentTime = time
    setProgress(time)
  }

  const changeVolume = (v) => {
    audioRef.current.volume = v
    setVolume(v)
  }

  return (
    <PlayerContext.Provider value={{
      currentSong, isPlaying, progress, duration, volume,
      playSong, togglePlay, playNext, playPrev, seek, changeVolume, queue
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  return useContext(PlayerContext)
}
