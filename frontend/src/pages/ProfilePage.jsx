import React, { useEffect, useState } from 'react'
import { analyticsApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { MdMusicNote, MdPerson, MdCategory, MdEmojiEvents } from 'react-icons/md'

export default function ProfilePage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsApi.getMyAnalytics()
      .then(r => setAnalytics(r.data.data))
      .finally(() => setLoading(false))
  }, [])

  const topSong = analytics?.topSongs?.[0]
  const topArtist = analytics?.topArtists?.[0]
  const topGenre = analytics?.topGenres?.[0]

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
      </div>

      <div className="page-content">
        {/* Profile card */}
        <div className="card" style={{ padding: 28, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), #b040ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 800, color: 'white', fontFamily: 'Syne'
          }}>
            {(user?.username || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>{user?.username || 'User'}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{user?.email}</p>
            <span style={{
              display: 'inline-flex', marginTop: 8, padding: '3px 10px', borderRadius: 20,
              background: user?.role === 'ADMIN' ? 'rgba(124,77,255,0.2)' : 'rgba(29,185,84,0.15)',
              color: user?.role === 'ADMIN' ? 'var(--accent-light)' : '#1db954',
              fontSize: 12, fontWeight: 600
            }}>{user?.role}</span>
          </div>
        </div>

        {/* Stats summary */}
        {loading ? (
          <div className="loading-spinner">Loading stats...</div>
        ) : (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Listening Summary</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
              {[
                { label: 'Total Plays', value: analytics?.totalPlays || 0, icon: <MdMusicNote />, color: 'var(--accent)' },
                { label: 'Top Song', value: topSong?.name || '—', icon: <MdEmojiEvents />, color: '#f0c040' },
                { label: 'Top Artist', value: topArtist?.name || '—', icon: <MdPerson />, color: '#1db954' },
                { label: 'Top Genre', value: topGenre?.name || '—', icon: <MdCategory />, color: '#ff6b6b' }
              ].map((item, i) => (
                <div key={i} className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                  <div className="stat-icon" style={{ background: `${item.color}22`, color: item.color }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Syne', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Top songs list */}
            {analytics?.topSongs?.length > 0 && (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Your Most Played Songs</h2>
                <div className="card" style={{ overflow: 'hidden', marginBottom: 28 }}>
                  <table className="song-table">
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}>RANK</th>
                        <th>SONG</th>
                        <th>PLAYS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topSongs.slice(0, 10).map((s, i) => (
                        <tr key={i}>
                          <td style={{ color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'Syne' }}>#{i + 1}</td>
                          <td style={{ fontWeight: 500 }}>{s.name}</td>
                          <td>
                            <span style={{ background: 'rgba(124,77,255,0.15)', color: 'var(--accent-light)', padding: '3px 10px', borderRadius: 20, fontSize: 13 }}>
                              {s.playCount} plays
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
