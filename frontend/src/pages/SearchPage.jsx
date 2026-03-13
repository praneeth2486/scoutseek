import React, { useEffect, useState } from 'react'
import { songsApi, artistsApi, genresApi, playlistsApi } from '../api'
import SongRow from '../components/SongRow'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'
import { MdSearch, MdTune, MdClose } from 'react-icons/md'

export default function SearchPage() {
  const [songs, setSongs] = useState([])
  const [artists, setArtists] = useState([])
  const [genres, setGenres] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const { toast, showToast } = useToast()

  const [filters, setFilters] = useState({
    title: '',
    minDuration: '',
    maxDuration: '',
    artistIds: [],
    genreIds: []
  })

  useEffect(() => {
    artistsApi.getAll().then(r => setArtists(r.data.data || []))
    genresApi.getAll().then(r => setGenres(r.data.data || []))
    playlistsApi.getAll().catch(() => {}).then(r => setPlaylists(r?.data?.data || []))
  }, [])

  const doSearch = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.title) params.title = filters.title
      if (filters.minDuration) params.minDuration = parseInt(filters.minDuration)
      if (filters.maxDuration) params.maxDuration = parseInt(filters.maxDuration)
      if (filters.artistIds.length) params.artistIds = filters.artistIds.join(',')
      if (filters.genreIds.length) params.genreIds = filters.genreIds.join(',')
      const res = await songsApi.search(params)
      setSongs(res.data.data.content || [])
      setSearched(true)
    } catch {
      showToast('Search failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const toggleArtist = (id) => {
    setFilters(f => ({
      ...f,
      artistIds: f.artistIds.includes(id) ? f.artistIds.filter(x => x !== id) : [...f.artistIds, id]
    }))
  }

  const toggleGenre = (id) => {
    setFilters(f => ({
      ...f,
      genreIds: f.genreIds.includes(id) ? f.genreIds.filter(x => x !== id) : [...f.genreIds, id]
    }))
  }

  const handleAddToPlaylist = async (playlistId, songId) => {
    try {
      await playlistsApi.addSong(playlistId, songId)
      showToast('Added to playlist')
    } catch {
      showToast('Failed to add', 'error')
    }
  }

  const clearFilters = () => setFilters({ title: '', minDuration: '', maxDuration: '', artistIds: [], genreIds: [] })

  return (
    <div>
      <div className="page-header">
        <h1>Search</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>
          Filter by title, artists, genres, and duration
        </p>
      </div>

      <div className="page-content">
        {/* Search bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <MdSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 20 }} />
            <input
              className="input-field"
              placeholder="Search by song title..."
              value={filters.title}
              style={{ paddingLeft: 42 }}
              onChange={e => setFilters({ ...filters, title: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
            />
          </div>
          <button className="btn-ghost" onClick={() => setShowFilters(!showFilters)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', borderRadius: 8, padding: '0 16px' }}>
            <MdTune /> Filters
            {(filters.artistIds.length + filters.genreIds.length + (filters.minDuration ? 1 : 0) + (filters.maxDuration ? 1 : 0)) > 0 && (
              <span style={{ background: 'var(--accent)', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {filters.artistIds.length + filters.genreIds.length + (filters.minDuration ? 1 : 0) + (filters.maxDuration ? 1 : 0)}
              </span>
            )}
          </button>
          <button className="btn-primary" onClick={doSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15 }}>Filters</h3>
              <button className="btn-ghost" onClick={clearFilters} style={{ fontSize: 13 }}>Clear all</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Duration */}
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>
                  DURATION RANGE (seconds)
                </label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input className="input-field" type="number" placeholder="Min (e.g. 120)"
                    value={filters.minDuration} onChange={e => setFilters({ ...filters, minDuration: e.target.value })} />
                  <span style={{ color: 'var(--text-muted)' }}>—</span>
                  <input className="input-field" type="number" placeholder="Max (e.g. 300)"
                    value={filters.maxDuration} onChange={e => setFilters({ ...filters, maxDuration: e.target.value })} />
                </div>
              </div>

              {/* Placeholder to balance grid */}
              <div />

              {/* Artists */}
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>
                  ARTISTS (select multiple)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {artists.map(a => (
                    <button key={a.artistId} onClick={() => toggleArtist(a.artistId)} style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: 13, cursor: 'pointer', border: 'none',
                      background: filters.artistIds.includes(a.artistId) ? 'rgba(29,185,84,0.2)' : 'var(--bg-hover)',
                      color: filters.artistIds.includes(a.artistId) ? '#1db954' : 'var(--text-secondary)',
                      transition: 'all 0.15s'
                    }}>{a.name}</button>
                  ))}
                </div>
              </div>

              {/* Genres */}
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>
                  GENRES (select multiple)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {genres.map(g => (
                    <button key={g.genreId} onClick={() => toggleGenre(g.genreId)} style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: 13, cursor: 'pointer', border: 'none',
                      background: filters.genreIds.includes(g.genreId) ? 'rgba(124,77,255,0.2)' : 'var(--bg-hover)',
                      color: filters.genreIds.includes(g.genreId) ? 'var(--accent-light)' : 'var(--text-secondary)',
                      transition: 'all 0.15s'
                    }}>{g.name}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading && <div className="loading-spinner">Searching...</div>}
        {!loading && searched && songs.length === 0 && (
          <div className="empty-state">
            <MdSearch size={48} />
            <span>No songs match your filters</span>
          </div>
        )}
        {!loading && songs.length > 0 && (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              {songs.length} result{songs.length !== 1 ? 's' : ''} found
            </p>
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
                    <SongRow key={song.songId} song={song} index={i}
                      songs={songs} playlists={playlists}
                      onAddToPlaylist={handleAddToPlaylist} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <Toast toast={toast} />
    </div>
  )
}
