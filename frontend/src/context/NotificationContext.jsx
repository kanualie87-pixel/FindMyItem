import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import client, { API_BASE } from '../api/client'
import { useAuth } from './AuthContext'

const NotificationContext = createContext(null)

/**
 * Single source of truth for in-app notifications.
 *
 * On login it loads the history over REST and opens ONE WebSocket to
 * `ws/notifications/`, so every new notification pushed by the backend arrives
 * live (the bell badge and the Notifications page share this state).
 */
export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const socketRef = useRef(null)

  const refresh = useCallback(() => {
    if (!user) return
    client.get('/notifications/').then((res) => {
      const list = res.data.results ?? res.data
      setNotifications(list)
      setUnread(list.filter((n) => !n.is_read).length)
    })
  }, [user])

  // Load history + open the live socket whenever we have a logged-in user.
  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnread(0)
      return
    }

    refresh()

    const token = localStorage.getItem('access')
    const wsBase = API_BASE.replace('http', 'ws')
    const socket = new WebSocket(`${wsBase}/ws/notifications/?token=${token}`)
    socketRef.current = socket

    socket.onmessage = (event) => {
      const n = JSON.parse(event.data)
      setNotifications((prev) => [n, ...prev])
      setUnread((c) => c + 1)
      // A gentle native heads-up, if the user has granted permission.
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(n.title, { body: n.body })
      }
    }

    return () => socket.close()
  }, [user, refresh])

  // Ask once for permission to show desktop notifications.
  useEffect(() => {
    if (user && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }
  }, [user])

  const markRead = useCallback((id) => {
    setNotifications((prev) => {
      const target = prev.find((n) => n.id === id)
      if (target && !target.is_read) setUnread((c) => Math.max(0, c - 1))
      return prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    })
    client.post(`/notifications/${id}/read/`).catch(() => {})
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnread(0)
    client.post('/notifications/read_all/').catch(() => {})
  }, [])

  return (
    <NotificationContext.Provider
      value={{ notifications, unread, refresh, markRead, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}
