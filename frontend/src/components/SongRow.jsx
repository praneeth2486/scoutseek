import React, { useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import { useAuth } from '../context/AuthContext'
import { songsApi, playlistsApi } from '../api'
import { MdPlayArrow, MdPause, MdMoreVert, MdDelete, MdAdd, MdPlaylistAdd } from 'react-icons/md'

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

  const isActive = currentSong?.songId === song.songId

  return (
    <tr style={{ position: 'relative' }}>
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
        <div style={{ position: 'relative' }}>
          <button className="btn-icon" onClick={() => setShowMenu(!showMenu)}>
            <MdMoreVert />
          </button>
          {showMenu && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', zIndex: 100,
              background: 'var(--bg-card)', border: '1px solid var(--border-light)',
              borderRadius: 10, padding: 8, minWidth: 180,
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }} onMouseLeave={() => setShowMenu(false)}>
              {playlists?.map(pl => (
                <button key={pl.playlistId}
                  className="btn-ghost"
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
                  onClick={() => { onAddToPlaylist?.(pl.playlistId, song.songId); setShowMenu(false) }}>
                  <MdPlaylistAdd /> Add to {pl.name}
                </button>
              ))}
              {isAdmin() && (
                <button className="btn-danger"
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
                  onClick={() => { onDelete?.(song.songId); setShowMenu(false) }}>
                  <MdDelete /> Delete song
                </button>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}
