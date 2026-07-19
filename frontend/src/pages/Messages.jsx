import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import client, { API_BASE } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'

export default function Messages() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(params.get('c') ? Number(params.get('c')) : null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)
  const bottomRef = useRef(null)

  // Load the list of conversations once.
  useEffect(() => {
    client.get('/conversations/').then((res) => {
      setConversations(res.data.results ?? res.data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When the active conversation changes: fetch history + open a websocket.
  useEffect(() => {
    if (!activeId) return
    setParams({ c: String(activeId) }, { replace: true })

    client.get(`/conversations/${activeId}/messages/`).then((res) => setMessages(res.data))

    const token = localStorage.getItem('access')
    const wsBase = API_BASE.replace('http', 'ws')
    const socket = new WebSocket(`${wsBase}/ws/chat/${activeId}/?token=${token}`)
    socketRef.current = socket

    socket.onopen = () => setConnected(true)
    socket.onclose = () => setConnected(false)
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      setMessages((prev) => [...prev, msg])
    }

    return () => socket.close()
  }, [activeId, setParams])

  // Auto-scroll to the newest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ text: trimmed }))
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
                    <div className="font-medium text-slate-800">{o?.username || 'Unknown'}</div>
                    <div className="truncate text-xs text-slate-400">
                      {c.last_message?.text || (c.item_title ? `About: ${c.item_title}` : 'Say hi 👋')}
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
                  <div className="text-xs text-slate-400">
                    {connected ? '🟢 Live' : '⚪ Connecting…'}
                    {active.item_title && ` · about ${active.item_title}`}
                  </div>
                </div>
              </header>

              <div className="flex-1 space-y-2 overflow-y-auto bg-slate-50 p-4">
                {messages.map((m) => {
                  const mine = m.sender.id === user.id
                  return (
                    <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                          mine
                            ? 'rounded-br-sm bg-indigo-600 text-white'
                            : 'rounded-bl-sm bg-white text-slate-700 shadow-sm'
                        }`}
                      >
                        {m.text}
                        <div
                          className={`mt-0.5 text-[10px] ${mine ? 'text-indigo-200' : 'text-slate-400'}`}
                        >
                          {new Date(m.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={send} className="flex gap-2 border-t border-slate-100 p-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
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
