import React, { useEffect, useState } from 'react'
import { analyticsApi } from '../api'
import { MdBarChart, MdMusicNote, MdPerson, MdCategory } from 'react-icons/md'

function StatList({ title, icon, items, color }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
        <span style={{ color }}>{icon}</span>
        {title}
      </h3>
      {items?.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No data yet</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items?.slice(0, 8).map((item, i) => {
            const max = items[0]?.playCount || 1
            const pct = (item.playCount / max) * 100
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.playCount} plays</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: color, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function AnalyticsPage() {
  const [myData, setMyData] = useState(null)
  const [globalData, setGlobalData] = useState(null)
  const [tab, setTab] = useState('me')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      analyticsApi.getMyAnalytics(),
      analyticsApi.getGlobal()
    ]).then(([myRes, globalRes]) => {
      setMyData(myRes.data.data)
      setGlobalData(globalRes.data.data)
    }).finally(() => setLoading(false))
  }, [])

  const data = tab === 'me' ? myData : globalData

  if (loading) return <div className="loading-spinner">Loading analytics...</div>

  return (
    <div>
      <div className="page-header">
        <h1>Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
          Track your listening habits
        </p>
      </div>

      <div className="page-content">
        {/* Tab switch */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--bg-card)', borderRadius: 10, padding: 4, width: 'fit-content', border: '1px solid var(--border)' }}>
          {['me', 'global'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', borderRadius: 7, fontSize: 14, fontWeight: 500,
              background: tab === t ? 'var(--accent)' : 'transparent',
              color: tab === t ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s', textTransform: 'capitalize'
            }}>{t === 'me' ? 'My Stats' : 'Global'}</button>
          ))}
        </div>

        {/* Total plays card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(124,77,255,0.15)', color: 'var(--accent)' }}>
              <MdBarChart />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne' }}>{data?.totalPlays || 0}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Total Plays</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(29,185,84,0.15)', color: '#1db954' }}>
              <MdMusicNote />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne' }}>{data?.topSongs?.length || 0}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Unique Songs</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(255,107,107,0.15)', color: '#ff6b6b' }}>
              <MdPerson />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne' }}>{data?.topArtists?.length || 0}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Artists Played</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          <StatList title="TOP SONGS" icon={<MdMusicNote />} items={data?.topSongs} color="var(--accent)" />
          <StatList title="TOP ARTISTS" icon={<MdPerson />} items={data?.topArtists} color="#1db954" />
          <StatList title="TOP GENRES" icon={<MdCategory />} items={data?.topGenres} color="#ff6b6b" />
        </div>
      </div>
    </div>
  )
}
