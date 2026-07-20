import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import client, { API_BASE } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import Avatar from '../components/Avatar'

/** WhatsApp-style delivery ticks for messages I sent. */
function Ticks({ message }) {
  if (message.is_read) {
    return <span className="text-sky-300" title="Read">✓✓</span>
  }
  if (message.is_delivered) {
    return <span className="text-indigo-200/80" title="Delivered">✓✓</span>
  }
  return <span className="text-indigo-200/80" title="Sent">✓</span>
}

function dayLabel(iso) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Messages() {
  const { user } = useAuth()
  const { notifications } = useNotifications()
  const [params, setParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(params.get('c') ? Number(params.get('c')) : null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [connected, setConnected] = useState(false)
  const [otherTyping, setOtherTyping] = useState(false)
  const [otherOnline, setOtherOnline] = useState(false)
  const socketRef = useRef(null)
  const typingTimer = useRef(null)
  const bottomRef = useRef(null)

  const loadConversations = () =>
    client.get('/conversations/').then((res) => {
      setConversations(res.data.results ?? res.data)
    })

  // Load the list of conversations on mount.
  useEffect(() => {
    loadConversations()
  }, [])

  // Refresh the list whenever a new message notification lands (updates the
  // last-message preview, unread badge and ordering for OTHER conversations).
  useEffect(() => {
    if (notifications[0]?.kind === 'message') loadConversations()
  }, [notifications])

  // When the active conversation changes: fetch history + open a websocket.
  useEffect(() => {
    if (!activeId) return
    setParams({ c: String(activeId) }, { replace: true })
    setOtherTyping(false)
    setOtherOnline(false)

    client.get(`/conversations/${activeId}/messages/`).then((res) => setMessages(res.data))
    // Opening the thread clears its unread badge locally.
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, unread_count: 0 } : c))
    )

    const token = localStorage.getItem('access')
    const wsBase = API_BASE.replace('http', 'ws')
    const socket = new WebSocket(`${wsBase}/ws/chat/${activeId}/?token=${token}`)
    socketRef.current = socket

    socket.onopen = () => {
      setConnected(true)
      // Tell the other side we've read everything up to now (blue ticks).
      socket.send(JSON.stringify({ type: 'read' }))
    }
    socket.onclose = () => setConnected(false)
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      switch (data.type) {
        case 'message': {
          const { type, ...msg } = data
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
          )
          // Someone else's message arriving while we're looking = read it.
          if (msg.sender.id !== user.id) {
            socket.send(JSON.stringify({ type: 'read' }))
          }
          break
        }
        case 'typing':
          setOtherTyping(data.state)
          break
        case 'delivered':
          setMessages((prev) =>
            prev.map((m) =>
              data.message_ids.includes(m.id) ? { ...m, is_delivered: true } : m
            )
          )
          break
        case 'read':
          setMessages((prev) =>
            prev.map((m) =>
              data.message_ids.includes(m.id)
                ? { ...m, is_delivered: true, is_read: true }
                : m
            )
          )
          break
        case 'presence':
          setOtherOnline(data.online)
          break
        default:
          break
      }
    }

    return () => socket.close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  // Auto-scroll to the newest message / when the typing bubble appears.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, otherTyping])

  function onType(e) {
    setText(e.target.value)
    const socket = socketRef.current
    if (socket?.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify({ type: 'typing', state: true }))
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      socket.send(JSON.stringify({ type: 'typing', state: false }))
    }, 1500)
  }

  function send(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    const socket = socketRef.current
    if (socket?.readyState === WebSocket.OPEN) {
      clearTimeout(typingTimer.current)
      socket.send(JSON.stringify({ type: 'typing', state: false }))
      socket.send(JSON.stringify({ type: 'message', text: trimmed }))
    } else {
      // Fallback to REST if the socket is not ready.
      client
        .post('/messages/', { conversation: activeId, text: trimmed })
        .then((res) => setMessages((prev) => [...prev, res.data]))
    }
    setText('')
  }

  const active = conversations.find((c) => c.id === activeId)
  const other = active?.participants.find((p) => p.id !== user.id)

  const status = otherTyping
    ? 'typing…'
    : otherOnline
      ? '🟢 online'
      : connected
        ? 'offline'
        : 'connecting…'

  // Group messages by calendar day for the date separators.
  const grouped = useMemo(() => {
    const out = []
    let lastDay = null
    for (const m of messages) {
      const label = dayLabel(m.created_at)
      if (label !== lastDay) {
        out.push({ divider: label, key: `d-${m.id}` })
        lastDay = label
      }
      out.push({ message: m, key: m.id })
    }
    return out
  }, [messages])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Messages</h1>

      <div className="grid h-[70vh] grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-3">
        {/* Conversation list — on mobile, hidden once a chat is open */}
        <aside
          className={`border-r border-slate-200 md:col-span-1 md:block ${
            activeId ? 'hidden' : 'block'
          }`}
        >
          <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-500">
            Conversations
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto">
            {conversations.length === 0 && (
              <p className="p-4 text-sm text-slate-400">
                No conversations yet. Message someone from an item page.
              </p>
            )}
            {conversations.map((c) => {
              const o = c.participants.find((p) => p.id !== user.id)
              const unread = c.id === activeId ? 0 : c.unread_count || 0
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                    c.id === activeId ? 'bg-indigo-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <Avatar user={o} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-800">{o?.username || 'Unknown'}</span>
                      {c.last_message && (
                        <span className="shrink-0 text-[10px] text-slate-400">
                          {new Date(c.last_message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`truncate text-xs ${
                          unread ? 'font-semibold text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        {c.last_message?.text ||
                          (c.item_title ? `About: ${c.item_title}` : 'Say hi 👋')}
                      </span>
                      {unread > 0 && (
                        <span className="grid h-5 min-w-[1.25rem] shrink-0 place-items-center rounded-full bg-green-500 px-1 text-[10px] font-bold text-white">
                          {unread > 99 ? '99+' : unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Chat panel — on mobile, hidden until a chat is open */}
        <section
          className={`flex-col md:col-span-2 md:flex ${activeId ? 'flex' : 'hidden'}`}
        >
          {active ? (
            <>
              <header className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                <button
                  onClick={() => setActiveId(null)}
                  className="rounded-lg px-1 text-slate-400 hover:bg-slate-100 md:hidden"
                  aria-label="Back to conversations"
                >
                  ←
                </button>
                <Avatar user={other} size={40} />
                <div>
                  <div className="font-semibold text-slate-800">{other?.username}</div>
                  <div
                    className={`text-xs ${
                      otherTyping ? 'italic text-green-600' : 'text-slate-400'
                    }`}
                  >
                    {status}
                    {active.item_title && !otherTyping && ` · about ${active.item_title}`}
                  </div>
                </div>
              </header>

              <div className="flex-1 space-y-1.5 overflow-y-auto bg-slate-50 p-4">
                {grouped.map((row) =>
                  row.divider ? (
                    <div key={row.key} className="my-3 flex justify-center">
                      <span className="rounded-full bg-slate-200/70 px-3 py-0.5 text-[11px] font-medium text-slate-500">
                        {row.divider}
                      </span>
                    </div>
                  ) : (
                    (() => {
                      const m = row.message
                      const mine = m.sender.id === user.id
                      return (
                        <div
                          key={row.key}
                          className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                              mine
                                ? 'rounded-br-sm bg-indigo-600 text-white'
                                : 'rounded-bl-sm bg-white text-slate-700 shadow-sm'
                            }`}
                          >
                            {m.text}
                            <div
                              className={`mt-0.5 flex items-center justify-end gap-1 text-[10px] ${
                                mine ? 'text-indigo-200' : 'text-slate-400'
                              }`}
                            >
                              {new Date(m.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                              {mine && <Ticks message={m} />}
                            </div>
                          </div>
                        </div>
                      )
                    })()
                  )
                )}

                {otherTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 shadow-sm">
                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={send} className="flex gap-2 border-t border-slate-100 p-3">
                <input
                  value={text}
                  onChange={onType}
                  placeholder="Type a message…"
                  className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <button className="rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white transition hover:bg-indigo-500">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-slate-400">
              Select a conversation to start chatting.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
