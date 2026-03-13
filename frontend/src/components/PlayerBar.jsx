import React from 'react'
import { usePlayer } from '../context/PlayerContext'
import {
  MdPlayArrow, MdPause, MdSkipNext, MdSkipPrevious,
  MdVolumeUp, MdVolumeMute
} from 'react-icons/md'

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function PlayerBar() {
  const { currentSong, isPlaying, progress, duration, volume,
          togglePlay, playNext, playPrev, seek, changeVolume } = usePlayer()

  const pct = duration ? (progress / duration) * 100 : 0

  return (
    <div className="player-bar" style={{
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr',
      alignItems: 'center',
      padding: '0 24px',
      height: 'var(--player-height)'
    }}>
      {/* Song info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {currentSong ? (
          <>
            <div style={{
              width: 48, height: 48, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent), #b040ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0
            }}>♪</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                {currentSong.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {currentSong.artists?.map(a => a.name).join(', ')}
              </div>
            </div>
          </>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No song playing</div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn-icon" onClick={playPrev}><MdSkipPrevious size={22} /></button>
          <button
            onClick={togglePlay}
            disabled={!currentSong}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: currentSong ? 'var(--accent)' : 'var(--bg-hover)',
              color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: currentSong ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            {isPlaying ? <MdPause size={22} /> : <MdPlayArrow size={22} />}
          </button>
          <button className="btn-icon" onClick={playNext}><MdSkipNext size={22} /></button>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', maxWidth: 400 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 36, textAlign: 'right' }}>
            {formatTime(progress)}
          </span>
          <div
            className="progress-bar"
            style={{ flex: 1 }}
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect()
              const ratio = (e.clientX - rect.left) / rect.width
              seek(ratio * duration)
            }}
          >
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 36 }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn-icon" onClick={() => changeVolume(volume > 0 ? 0 : 0.8)}>
          {volume === 0 ? <MdVolumeMute size={20} /> : <MdVolumeUp size={20} />}
        </button>
        <input
          type="range" min="0" max="1" step="0.01" value={volume}
          onChange={e => changeVolume(parseFloat(e.target.value))}
          style={{ width: 80, accentColor: 'var(--accent)', cursor: 'pointer' }}
        />
      </div>
    </div>
  )
}
