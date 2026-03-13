import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
}

// Songs
export const songsApi = {
  getAll: (page = 0, size = 20) => api.get(`/songs?page=${page}&size=${size}`),
  getById: (id) => api.get(`/songs/${id}`),
  search: (params) => api.get('/songs/search', { params }),
  upload: (formData) => api.post('/songs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/songs/${id}`)
}

// Artists
export const artistsApi = {
  getAll: () => api.get('/artists'),
  create: (data) => api.post('/artists', data),
  delete: (id) => api.delete(`/artists/${id}`)
}

// Genres
export const genresApi = {
  getAll: () => api.get('/genres'),
  create: (data) => api.post('/genres', data),
  delete: (id) => api.delete(`/genres/${id}`)
}

// Playlists
export const playlistsApi = {
  getAll: () => api.get('/playlists'),
  getById: (id) => api.get(`/playlists/${id}`),
  create: (data) => api.post('/playlists', data),
  addSong: (playlistId, songId) => api.post(`/playlists/${playlistId}/songs/${songId}`),
  removeSong: (playlistId, songId) => api.delete(`/playlists/${playlistId}/songs/${songId}`),
  delete: (id) => api.delete(`/playlists/${id}`)
}

// Analytics
export const analyticsApi = {
  recordPlay: (data) => api.post('/analytics/play', data),
  getMyAnalytics: () => api.get('/analytics/me'),
  getGlobal: () => api.get('/analytics/global')
}

export default api
