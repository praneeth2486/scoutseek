import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { usePlayer } from '../context/PlayerContext'
import { useAuth } from '../context/AuthContext'
import { MdPlayArrow, MdPause, MdMoreVert, MdDelete, MdPlaylistAdd } from 'react-icons/md'

function formatDuration(secs) {
  if (!secs) return '--'
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function DropdownMenu({ menuPos, playlists, onAddToPlaylist, onDelete, showDelete, onClose, song }) {
  const menuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose()
      }
    }
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 10)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handler) }
  }, [onClose])

  return ReactDOM.createPortal(
    <div ref={menuRef} style={{
      position: 'fixed',
      top: menuPos.top,
      left: menuPos.left,
      zIndex: 99999,
      background: '#1e1e2e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10,
      padding: 6,
      minWidth: 200,
      boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
    }}>
      {playlists?.length > 0 ? (
        <>
          <div style={{ padding: '4px 10px 6px', fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Add to playlist
          </div>
          {playlists.map(pl => (
            <button key={pl.playlistId}
              onMouseDown={(e) => { e.stopPropagation(); onAddToPlaylist?.(pl.playlistId, song.songId); onClose() }}
              style={{
                width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center',
                gap: 8, padding: '9px 10px', borderRadius: 6, fontSize: 14,
                background: 'transparent', color: 'white', cursor: 'pointer', border: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,77,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <MdPlaylistAdd size={16} style={{ color: '#7c4dff' }} /> {pl.name}
            </button>
          ))}
        </>
      ) : (
        <div style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          No playlists yet — create one in Playlists
        </div>
      )}

      {showDelete && (
        <>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '4px 0' }} />
          <button
            onMouseDown={(e) => { e.stopPropagation(); onDelete?.(song.songId); onClose() }}
            style={{
              width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center',
              gap: 8, padding: '9px 10px', borderRadius: 6, fontSize: 14,
              background: 'transparent', color: '#ff5555', cursor: 'pointer', border: 'none'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,85,85,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <MdDelete size={16} /> Delete song
          </button>
        </>
      )}
    </div>,
    document.body
  )
}

export default function SongRow({ song, index, songs = [], playlists = [], onDelete, onAddToPlaylist }) {
  const { playSong, currentSong, isPlaying } = usePlayer()
  const { isAdmin } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)

  const isActive = currentSong?.songId === song.songId

  const handleMenuClick = (e) => {
    e.stopPropagation()
    if (showMenu) { setShowMenu(false); return }
    const rect = btnRef.current.getBoundingClientRect()
    const menuHeight = (playlists.length * 42) + 80
    const spaceBelow = window.innerHeight - rect.bottom
    const top = spaceBelow < menuHeight ? rect.top - menuHeight : rect.bottom + 4
    const left = Math.min(rect.right - 200, window.innerWidth - 210)
    setMenuPos({ top, left })
    setShowMenu(true)
  }

  return (
    <>
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
          <button ref={btnRef} className="btn-icon" onClick={handleMenuClick}>
            <MdMoreVert />
          </button>
        </td>
      </tr>

      {showMenu && (
        <DropdownMenu
          menuPos={menuPos}
          playlists={playlists}
          song={song}
          showDelete={isAdmin()}
          onAddToPlaylist={onAddToPlaylist}
          onDelete={onDelete}
          onClose={() => setShowMenu(false)}
        />
      )}
    </>
  )
}