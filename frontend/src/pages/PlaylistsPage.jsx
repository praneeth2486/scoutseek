import React, { useEffect, useState } from 'react'
import { playlistsApi } from '../api'
import SongRow from '../components/SongRow'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'
import { usePlayer } from '../context/PlayerContext'
import { MdQueueMusic, MdAdd, MdDelete, MdChevronRight, MdArrowBack, MdPlayArrow } from 'react-icons/md'

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const { toast, showToast } = useToast()
  const { playSong } = usePlayer()

  const fetchPlaylists = async () => {
    try {
      const res = await playlistsApi.getAll()
      setPlaylists(res.data.data || [])
    } catch {
      showToast('Failed to load playlists', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPlaylists() }, [])

  const handleCreate = async () => {
    if (!newName.trim()) return
    try {
      await playlistsApi.create({ name: newName.trim() })
      showToast('Playlist created')
      setNewName('')
      setCreating(false)
      fetchPlaylists()
    } catch {
      showToast('Failed to create', 'error')
    }
  }

  const handleDelete = async (playlistId) => {
    if (!confirm('Delete this playlist?')) return
    try {
      await playlistsApi.delete(playlistId)
      showToast('Playlist deleted')
      if (selected?.playlistId === playlistId) setSelected(null)
      fetchPlaylists()
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  const handleRemoveSong = async (songId) => {
    try {
      const res = await playlistsApi.removeSong(selected.playlistId, songId)
      setSelected(res.data.data)
      showToast('Song removed')
      fetchPlaylists()
    } catch {
      showToast('Failed to remove', 'error')
    }
  }

  const handleOpenPlaylist = async (pl) => {
    try {
      const res = await playlistsApi.getById(pl.playlistId)
      setSelected(res.data.data)
    } catch {
      setSelected(pl)
    }
  }

  // ── Playlist detail view ──
  if (selected) {
    const songs = selected.songs || []
    return (
      <div>
        <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn-icon" onClick={() => setSelected(null)}>
            <MdArrowBack size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <h1>{selected.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
              {songs.length} song{songs.length !== 1 ? 's' : ''}
            </p>
          </div>
          {songs.length > 0 && (
            <button className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={() => playSong(songs[0], songs)}>
              <MdPlayArrow size={20} /> Play All
            </button>
          )}
        </div>

        <div className="page-content">
          {songs.length === 0 ? (
            <div className="empty-state">
              <MdQueueMusic size={48} />
              <span>No songs in this playlist yet</span>
            </div>
          ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
              <table className="song-table">
                <thead>
                  <tr>
                    <th style={{ width: 48 }}></th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Genre</th>
                    <th>Duration</th>
                    <th style={{ width: 48 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {songs.map((song, i) => (
                    <SongRow
                      key={song.songId}
                      song={song}
                      index={i}
                      songs={songs}
                      playlists={[]}
                      onDelete={() => handleRemoveSong(song.songId)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <Toast toast={toast} />
      </div>
    )
  }

  // ── Playlists list view ──
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Playlists</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setCreating(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MdAdd /> New Playlist
        </button>
      </div>

      <div className="page-content">
        {creating && (
          <div className="card" style={{ padding: 20, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
            <input className="input-field" placeholder="Playlist name..."
              value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoFocus style={{ flex: 1 }} />
            <button className="btn-primary" onClick={handleCreate}>Create</button>
            <button className="btn-ghost" onClick={() => { setCreating(false); setNewName('') }}>Cancel</button>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Loading playlists...</div>
        ) : playlists.length === 0 ? (
          <div className="empty-state">
            <MdQueueMusic size={48} />
            <span>No playlists yet. Create your first one!</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {playlists.map(pl => (
              <div key={pl.playlistId} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--accent), #b040ff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
                  }}>♫</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {pl.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {pl.songs?.length || 0} songs
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button className="btn-primary"
                    style={{ flex: 1, fontSize: 13, padding: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    onClick={() => handleOpenPlaylist(pl)}>
                    Open <MdChevronRight />
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(pl.playlistId)} style={{ padding: '8px 12px' }}>
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toast toast={toast} />
    </div>
  )
}