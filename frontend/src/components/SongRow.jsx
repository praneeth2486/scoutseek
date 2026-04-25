import React, { useState, useRef, useEffect } from 'react'
import { usePlayer } from '../context/PlayerContext'
import { useAuth } from '../context/AuthContext'
import { MdPlayArrow, MdPause, MdMoreVert, MdDelete, MdPlaylistAdd } from 'react-icons/md'

function formatDuration(secs) {
  if (!secs) return '--'
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function SongRow({ song, index, songs = [], playlists = [], onDelete, onAddToPlaylist }) {
  const { playSong, currentSong, isPlaying } = usePlayer()
  const { isAdmin } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  const isActive = currentSong?.songId === song.songId

  const handleMenuToggle = () => {
    if (!showMenu && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const top = spaceBelow < 200 ? rect.top - 200 : rect.bottom + 4
      const left = rect.right - 190
      setMenuPos({ top, left })
    }
    setShowMenu(v => !v)
  }

  useEffect(() => {
    if (!showMenu) return
    const handler = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showMenu])

  return (
    <tr>
      <td style={{ width: 48, color: 'var(--text-muted)', textAlign: 'center', cursor: 'pointer' }}
          onClick={() => playSong(song, songs)}>
        {isActive && isPlaying
          ? <MdPause style={{ color: 'var(--accent)', fontSize: 18 }} />
          : <MdPlayArrow style={{ fontSize: 18, opacity: 0.6 }} />
        }
      </td>
      <td style={{ cursor: 'pointer', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--accent-light)' : 'inherit' }}
          onClick={() => playSong(song, songs)}>
        {song.title}
      </td>
      <td>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {song.artists?.map(a => (
            <span key={a.artistId} className="tag tag-artist">{a.name}</span>
          ))}
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {song.genres?.map(g => (
            <span key={g.genreId} className="tag tag-genre">{g.name}</span>
          ))}
        </div>
      </td>
      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
        {formatDuration(song.durationSeconds)}
      </td>
      <td>
        <button ref={btnRef} className="btn-icon" onClick={handleMenuToggle}>
          <MdMoreVert />
        </button>

        {showMenu && (
          <div ref={menuRef} style={{
            position: 'fixed',
            top: menuPos.top,
            left: menuPos.left,
            zIndex: 9999,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 10,
            padding: 8,
            minWidth: 190,
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
          }}>
            {playlists?.length > 0
              ? playlists.map(pl => (
                  <button key={pl.playlistId}
                    className="btn-ghost"
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 6 }}
                    onClick={() => { onAddToPlaylist?.(pl.playlistId, song.songId); setShowMenu(false) }}>
                    <MdPlaylistAdd /> Add to {pl.name}
                  </button>
                ))
              : (
                <div style={{ padding: '8px 10px', color: 'var(--text-muted)', fontSize: 13 }}>
                  No playlists yet
                </div>
              )
            }
            {isAdmin() && (
              <>
                <div style={{ borderTop: '1px solid var(--border)', margin: '6px 0' }} />
                <button className="btn-danger"
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 6 }}
                  onClick={() => { onDelete?.(song.songId); setShowMenu(false) }}>
                  <MdDelete /> Delete song
                </button>
              </>
            )}
          </div>
        )}
      </td>
    </tr>
  )
}