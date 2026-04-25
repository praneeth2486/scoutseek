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
    artistsApi.getAll().then(r => {
      const list = r.data.data || []
      // Deduplicate by artistId, then sort A-Z
      const unique = Array.from(new Map(list.map(a => [a.artistId, a])).values())
      setArtists(unique.sort((a, b) => a.name.localeCompare(b.name)))
    })
    genresApi.getAll().then(r => {
      const list = r.data.data || []
      // Deduplicate by genreId, then sort A-Z
      const unique = Array.from(new Map(list.map(g => [g.genreId, g])).values())
      setGenres(unique.sort((a, b) => a.name.localeCompare(b.name)))
    })
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

  const handleArtistSelect = (e) => {
    const id = parseInt(e.target.value)
    if (!id) return
    setFilters(f => ({
      ...f,
      artistIds: f.artistIds.includes(id) ? f.artistIds : [...f.artistIds, id]
    }))
    e.target.value = ''
  }

  const handleGenreSelect = (e) => {
    const id = parseInt(e.target.value)
    if (!id) return
    setFilters(f => ({
      ...f,
      genreIds: f.genreIds.includes(id) ? f.genreIds : [...f.genreIds, id]
    }))
    e.target.value = ''
  }

  const removeArtist = (id) => setFilters(f => ({ ...f, artistIds: f.artistIds.filter(x => x !== id) }))
  const removeGenre  = (id) => setFilters(f => ({ ...f, genreIds:  f.genreIds.filter(x => x !== id) }))

  const handleAddToPlaylist = async (playlistId, songId) => {
    try {
      await playlistsApi.addSong(playlistId, songId)
      showToast('Added to playlist')
    } catch {
      showToast('Failed to add', 'error')
    }
  }

  const clearFilters = () => setFilters({ title: '', minDuration: '', maxDuration: '', artistIds: [], genreIds: [] })

  const activeFilterCount =
    filters.artistIds.length + filters.genreIds.length +
    (filters.minDuration ? 1 : 0) + (filters.maxDuration ? 1 : 0)

  const dropdownStyle = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--bg-hover)',
    color: 'var(--text-primary)',
    fontSize: 13,
    cursor: 'pointer',
    outline: 'none',
  }

  const chipStyle = (color) => ({
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '3px 10px', borderRadius: 20, fontSize: 12,
    background: color === 'green' ? 'rgba(29,185,84,0.15)' : 'rgba(124,77,255,0.15)',
    color: color === 'green' ? '#1db954' : 'var(--accent-light)',
    border: `1px solid ${color === 'green' ? 'rgba(29,185,84,0.3)' : 'rgba(124,77,255,0.3)'}`,
  })

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
            {activeFilterCount > 0 && (
              <span style={{ background: 'var(--accent)', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activeFilterCount}
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

            {/* Duration */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>
                DURATION RANGE (seconds)
              </label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', maxWidth: 360 }}>
                <input className="input-field" type="number" placeholder="Min (e.g. 120)"
                  value={filters.minDuration} onChange={e => setFilters({ ...filters, minDuration: e.target.value })} />
                <span style={{ color: 'var(--text-muted)' }}>—</span>
                <input className="input-field" type="number" placeholder="Max (e.g. 300)"
                  value={filters.maxDuration} onChange={e => setFilters({ ...filters, maxDuration: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

              {/* Artists dropdown */}
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                  ARTISTS (select multiple)
                </label>
                <select style={dropdownStyle} onChange={handleArtistSelect} defaultValue="">
                  <option value="" disabled>— Select an artist —</option>
                  {artists.map(a => (
                    <option key={a.artistId} value={a.artistId}>{a.name}</option>
                  ))}
                </select>
                {filters.artistIds.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {filters.artistIds.map(id => {
                      const a = artists.find(x => x.artistId === id)
                      return a ? (
                        <span key={id} style={chipStyle('green')}>
                          {a.name}
                          <MdClose size={13} style={{ cursor: 'pointer' }} onClick={() => removeArtist(id)} />
                        </span>
                      ) : null
                    })}
                  </div>
                )}
              </div>

              {/* Genres dropdown */}
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                  GENRES (select multiple)
                </label>
                <select style={dropdownStyle} onChange={handleGenreSelect} defaultValue="">
                  <option value="" disabled>— Select a genre —</option>
                  {genres.map(g => (
                    <option key={g.genreId} value={g.genreId}>{g.name}</option>
                  ))}
                </select>
                {filters.genreIds.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {filters.genreIds.map(id => {
                      const g = genres.find(x => x.genreId === id)
                      return g ? (
                        <span key={id} style={chipStyle('purple')}>
                          {g.name}
                          <MdClose size={13} style={{ cursor: 'pointer' }} onClick={() => removeGenre(id)} />
                        </span>
                      ) : null
                    })}
                  </div>
                )}
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