import axios from 'axios'

// Base URL of the Django backend.
export const API_BASE = 'http://127.0.0.1:8000'

const client = axios.create({
  baseURL: `${API_BASE}/api`,
})

// Attach the JWT access token to every request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, try to refresh the access token once; otherwise log out.
let refreshing = null
client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const refresh = localStorage.getItem('refresh')
    if (error.response?.status === 401 && refresh && !original._retry) {
      original._retry = true
      try {
        refreshing =
          refreshing ||
          axios.post(`${API_BASE}/api/auth/refresh/`, { refresh })
        const { data } = await refreshing
        refreshing = null
        localStorage.setItem('access', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return client(original)
      } catch {
        refreshing = null
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Build an absolute URL for media (images) returned by the API.
export function mediaUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}

export default client
