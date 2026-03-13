import React, { useEffect, useState } from 'react'
import { songsApi, playlistsApi } from '../api'
import SongRow from '../components/SongRow'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'
import { MdLibraryMusic, MdChevronLeft, MdChevronRight } from 'react-icons/md'

export default function LibraryPage() {
  const [songs, setSongs] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const { toast, showToast } = useToast()

  const fetchSongs = async (p = 0) => {
    setLoading(true)
    try {
      const res = await songsApi.getAll(p, 20)
      const data = res.data.data
      setSongs(data.content || [])
      setTotalPages(data.totalPages || 1)
      setPage(p)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSongs()
    playlistsApi.getAll().then(r => setPlaylists(r.data.data || [])).catch(() => {})
  }, [])

  const handleDelete = async (songId) => {
    try {
      await songsApi.delete(songId)
      showToast('Song deleted')
      fetchSongs(page)
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  const handleAddToPlaylist = async (playlistId, songId) => {
    try {
      await playlistsApi.addSong(playlistId, songId)
      showToast('Added to playlist')
    } catch {
      showToast('Failed to add', 'error')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Music Library</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>
          {songs.length} songs
        </p>
      </div>

      <div className="page-content">
        {loading ? (
          <div className="loading-spinner">Loading library...</div>
        ) : songs.length === 0 ? (
          <div className="empty-state">
            <MdLibraryMusic size={48} />
            <span>Library is empty</span>
          </div>
        ) : (
          <>
            <div className="card" style={{ overflow: 'hidden' }}>
              <table className="song-table">
                <thead>
                  <tr>
                    <th style={{ width: 48 }}>#</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Genre</th>
                    <th>Duration</th>
                    <th style={{ width: 48 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {songs.map((song, i) => (
                    <SongRow key={song.songId} song={song} index={page * 20 + i + 1}
                      songs={songs} playlists={playlists}
                      onDelete={handleDelete} onAddToPlaylist={handleAddToPlaylist} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                <button className="btn-ghost" onClick={() => fetchSongs(page - 1)} disabled={page === 0}>
                  <MdChevronLeft size={20} />
                </button>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  Page {page + 1} of {totalPages}
                </span>
                <button className="btn-ghost" onClick={() => fetchSongs(page + 1)} disabled={page >= totalPages - 1}>
                  <MdChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Toast toast={toast} />
    </div>
  )
}
