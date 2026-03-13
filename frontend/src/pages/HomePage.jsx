import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { songsApi, playlistsApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'
import SongRow from '../components/SongRow'
import { playlistsApi as plApi } from '../api'
import { MdLibraryMusic, MdSearch, MdTrendingUp } from 'react-icons/md'

export default function HomePage() {
  const [recentSongs, setRecentSongs] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      songsApi.getAll(0, 10),
      plApi.getAll().catch(() => ({ data: { data: [] } }))
    ]).then(([songsRes, plRes]) => {
      setRecentSongs(songsRes.data.data.content || [])
      setPlaylists(plRes.data.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const handleAddToPlaylist = (playlistId, songId) => {
    plApi.addSong(playlistId, songId)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Good {getGreeting()}, {user?.username || 'there'} 👋</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 14 }}>
          Discover and enjoy your music
        </p>
      </div>

      <div className="page-content">
        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 36 }}>
          {[
            { icon: <MdLibraryMusic size={24} />, label: 'Browse Library', sub: 'All your songs', to: '/library', color: '#7c4dff' },
            { icon: <MdSearch size={24} />, label: 'Search', sub: 'Find anything', to: '/search', color: '#1db954' },
            { icon: <MdTrendingUp size={24} />, label: 'Analytics', sub: 'Your stats', to: '/analytics', color: '#ff6b6b' }
          ].map(item => (
            <div key={item.to} className="card" style={{ padding: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
                 onClick={() => navigate(item.to)}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${item.color}22`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent songs */}
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recently Added</h2>
        {loading ? (
          <div className="loading-spinner">Loading songs...</div>
        ) : recentSongs.length === 0 ? (
          <div className="empty-state">
            <MdLibraryMusic />
            <span>No songs yet. An admin can upload songs.</span>
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
                {recentSongs.map((song, i) => (
                  <SongRow key={song.songId} song={song} index={i}
                    songs={recentSongs} playlists={playlists}
                    onAddToPlaylist={handleAddToPlaylist} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}
