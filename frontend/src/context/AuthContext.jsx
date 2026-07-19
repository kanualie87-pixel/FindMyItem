import { createContext, useContext, useEffect, useState } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)

  // Refresh the stored user profile on mount if we have a token.
  useEffect(() => {
    if (localStorage.getItem('access') && user) {
      client
        .get('/auth/me/')
        .then((res) => {
          setUser(res.data)
          localStorage.setItem('user', JSON.stringify(res.data))
        })
        .catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function login(username, password) {
    setLoading(true)
    try {
      const { data } = await client.post('/auth/login/', { username, password })
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  async function register(formData) {
    // formData is a FormData instance (supports the profile picture upload).
    await client.post('/auth/register/', formData)
    const username = formData.get('username')
    const password = formData.get('password')
    return login(username, password)
  }

  function logout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
    setUser(null)
  }

  function updateUser(u) {
    setUser(u)
    localStorage.setItem('user', JSON.stringify(u))
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}