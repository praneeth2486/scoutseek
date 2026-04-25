import React, { useEffect, useState } from 'react'
import { songsApi, artistsApi, genresApi } from '../api'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'
import { MdAdd, MdDelete, MdCloudUpload, MdClose } from 'react-icons/md'

export default function AdminPage() {
  const [artists, setArtists] = useState([])
  const [genres, setGenres] = useState([])
  const [newArtist, setNewArtist] = useState('')
  const [newGenre, setNewGenre] = useState('')
  const { toast, showToast } = useToast()
  const [activeTab, setActiveTab] = useState('upload')

  const [songForm, setSongForm] = useState({
    title: '', durationSeconds: '', releaseDate: '',
    artistIds: [], genreIds: [], file: null
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    artistsApi.getAll().then(r => {
      const list = r.data.data || []
      const unique = Array.from(new Map(list.map(a => [a.artistId, a])).values())
      setArtists(unique.sort((a, b) => a.name.localeCompare(b.name)))
    })
    genresApi.getAll().then(r => {
      const list = r.data.data || []
      const unique = Array.from(new Map(list.map(g => [g.genreId, g])).values())
      setGenres(unique.sort((a, b) => a.name.localeCompare(b.name)))
    })
  }, [])

  const handleCreateArtist = async () => {
    if (!newArtist.trim()) return
    try {
      const res = await artistsApi.create({ name: newArtist.trim() })
      setArtists(prev => [...prev, res.data.data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewArtist('')
      showToast('Artist created')
    } catch { showToast('Failed', 'error') }
  }

  const handleCreateGenre = async () => {
    if (!newGenre.trim()) return
    try {
      const res = await genresApi.create({ name: newGenre.trim() })
      setGenres(prev => [...prev, res.data.data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewGenre('')
      showToast('Genre created')
    } catch { showToast('Failed', 'error') }
  }

  const handleDeleteArtist = async (id) => {
    try {
      await artistsApi.delete(id)
      setArtists(prev => prev.filter(a => a.artistId !== id))
      showToast('Artist deleted')
    } catch { showToast('Failed', 'error') }
  }

  const handleDeleteGenre = async (id) => {
    try {
      await genresApi.delete(id)
      setGenres(prev => prev.filter(g => g.genreId !== id))
      showToast('Genre deleted')
    } catch { showToast('Failed', 'error') }
  }

  const handleArtistSelect = (e) => {
    const id = parseInt(e.target.value)
    if (!id) return
    setSongForm(f => ({ ...f, artistIds: f.artistIds.includes(id) ? f.artistIds : [...f.artistIds, id] }))
    e.target.value = ''
  }

  const handleGenreSelect = (e) => {
    const id = parseInt(e.target.value)
    if (!id) return
    setSongForm(f => ({ ...f, genreIds: f.genreIds.includes(id) ? f.genreIds : [...f.genreIds, id] }))
    e.target.value = ''
  }

  const removeArtistId = (id) => setSongForm(f => ({ ...f, artistIds: f.artistIds.filter(x => x !== id) }))
  const removeGenreId  = (id) => setSongForm(f => ({ ...f, genreIds:  f.genreIds.filter(x => x !== id) }))

  const handleUpload = async () => {
    if (!songForm.file || !songForm.title || !songForm.durationSeconds) {
      showToast('Title, duration, and file are required', 'error'); return
    }
    if (songForm.artistIds.length === 0) { showToast('Select at least one artist', 'error'); return }
    if (songForm.genreIds.length === 0)  { showToast('Select at least one genre',  'error'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('title', songForm.title)
      fd.append('durationSeconds', songForm.durationSeconds)
      if (songForm.releaseDate) fd.append('releaseDate', songForm.releaseDate)
      songForm.artistIds.forEach(id => fd.append('artistIds', id))
      songForm.genreIds.forEach(id  => fd.append('genreIds',  id))
      fd.append('file', songForm.file)
      await songsApi.upload(fd)
      showToast('Song uploaded successfully!')
      setSongForm({ title: '', durationSeconds: '', releaseDate: '', artistIds: [], genreIds: [], file: null })
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const tabs = ['upload', 'artists', 'genres']

  const dropdownStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid var(--border)', background: 'var(--bg-hover)',
    color: 'var(--text-primary)', fontSize: 14, cursor: 'pointer', outline: 'none',
  }

  const chipStyle = (color) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 10px', borderRadius: 20, fontSize: 13,
    background: color === 'green' ? 'rgba(29,185,84,0.15)' : 'rgba(124,77,255,0.15)',
    color: color === 'green' ? '#1db954' : 'var(--accent-light)',
    border: `1px solid ${color === 'green' ? 'rgba(29,185,84,0.3)' : 'rgba(124,77,255,0.3)'}`,
  })

  return (
    <div>
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Manage music content</p>
      </div>

      <div className="page-content">
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--bg-card)', borderRadius: 10, padding: 4, width: 'fit-content', border: '1px solid var(--border)' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '8px 20px', borderRadius: 7, fontSize: 14, fontWeight: 500,
              background: activeTab === t ? 'var(--accent)' : 'transparent',
              color: activeTab === t ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s', textTransform: 'capitalize'
            }}>{t}</button>
          ))}
        </div>

        {activeTab === 'upload' && (
          <div className="card" style={{ padding: 28, maxWidth: 640 }}>
            <h2 style={{ fontSize: 18, marginBottom: 24 }}>Upload Song</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>TITLE *</label>
                <input className="input-field" placeholder="Song title"
                  value={songForm.title} onChange={e => setSongForm({ ...songForm, title: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>DURATION (seconds) *</label>
                  <input className="input-field" type="number" placeholder="e.g. 213"
                    value={songForm.durationSeconds} onChange={e => setSongForm({ ...songForm, durationSeconds: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>RELEASE DATE</label>
                  <input className="input-field" type="date"
                    value={songForm.releaseDate} onChange={e => setSongForm({ ...songForm, releaseDate: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>ARTISTS * (select one or more)</label>
                <select style={dropdownStyle} onChange={handleArtistSelect} defaultValue="">
                  <option value="" disabled>— Select an artist —</option>
                  {artists.map(a => (
                    <option key={a.artistId} value={a.artistId}>{a.name}</option>
                  ))}
                </select>
                {songForm.artistIds.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {songForm.artistIds.map(id => {
                      const a = artists.find(x => x.artistId === id)
                      return a ? (
                        <span key={id} style={chipStyle('green')}>
                          {a.name}
                          <MdClose size={14} style={{ cursor: 'pointer' }} onClick={() => removeArtistId(id)} />
                        </span>
                      ) : null
                    })}
                  </div>
                )}
                {artists.length === 0 && (
                  <span style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginTop: 6 }}>No artists yet. Create some in the Artists tab.</span>
                )}
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>GENRES * (select one or more)</label>
                <select style={dropdownStyle} onChange={handleGenreSelect} defaultValue="">
                  <option value="" disabled>— Select a genre —</option>
                  {genres.map(g => (
                    <option key={g.genreId} value={g.genreId}>{g.name}</option>
                  ))}
                </select>
                {songForm.genreIds.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {songForm.genreIds.map(id => {
                      const g = genres.find(x => x.genreId === id)
                      return g ? (
                        <span key={id} style={chipStyle('purple')}>
                          {g.name}
                          <MdClose size={14} style={{ cursor: 'pointer' }} onClick={() => removeGenreId(id)} />
                        </span>
                      ) : null
                    })}
                  </div>
                )}
                {genres.length === 0 && (
                  <span style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginTop: 6 }}>No genres yet. Create some in the Genres tab.</span>
                )}
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>AUDIO FILE * (mp3, wav, ogg)</label>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  padding: '24px', borderRadius: 10, cursor: 'pointer',
                  border: `2px dashed ${songForm.file ? 'var(--accent)' : 'var(--border)'}`,
                  background: songForm.file ? 'rgba(124,77,255,0.05)' : 'var(--bg-hover)',
                  transition: 'all 0.2s'
                }}>
                  <MdCloudUpload size={32} style={{ color: songForm.file ? 'var(--accent)' : 'var(--text-muted)' }} />
                  <span style={{ fontSize: 14, color: songForm.file ? 'var(--accent-light)' : 'var(--text-muted)' }}>
                    {songForm.file ? songForm.file.name : 'Click to select audio file'}
                  </span>
                  <input type="file" accept="audio/*" style={{ display: 'none' }}
                    onChange={e => setSongForm({ ...songForm, file: e.target.files[0] })} />
                </label>
              </div>

              <button className="btn-primary" onClick={handleUpload} disabled={uploading}
                style={{ padding: '12px', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <MdCloudUpload />
                {uploading ? 'Uploading...' : 'Upload Song'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'artists' && (
          <div style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <input className="input-field" placeholder="Artist name..."
                value={newArtist} onChange={e => setNewArtist(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateArtist()} />
              <button className="btn-primary" onClick={handleCreateArtist} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                <MdAdd /> Add Artist
              </button>
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {artists.length === 0
                ? <div style={{ padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>No artists yet</div>
                : artists.map(a => (
                  <div key={a.artistId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{a.name}</span>
                    <button className="btn-danger" onClick={() => handleDeleteArtist(a.artistId)}><MdDelete /></button>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {activeTab === 'genres' && (
          <div style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <input className="input-field" placeholder="Genre name..."
                value={newGenre} onChange={e => setNewGenre(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateGenre()} />
              <button className="btn-primary" onClick={handleCreateGenre} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                <MdAdd /> Add Genre
              </button>
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {genres.length === 0
                ? <div style={{ padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>No genres yet</div>
                : genres.map(g => (
                  <div key={g.genreId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{g.name}</span>
                    <button className="btn-danger" onClick={() => handleDeleteGenre(g.genreId)}><MdDelete /></button>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
      <Toast toast={toast} />
    </div>
  )
}