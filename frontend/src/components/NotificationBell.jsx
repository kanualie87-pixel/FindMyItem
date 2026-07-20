import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'
import { iconFor, timeAgo } from '../utils/notifications'

/**
 * Bell icon with an unread badge + a dropdown of the most recent
 * notifications. Lives in the navbar; clicking a row marks it read and
 * navigates to whatever the notification points at.
 */
export default function NotificationBell() {
  const { notifications, unread, markRead, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const ref = useRef(null)

  // Close the dropdown when clicking outside it.
  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function openNotification(n) {
    markRead(n.id)
    setOpen(false)
    if (n.url) navigate(n.url)
  }

  const recent = notifications.slice(0, 8)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-9 w-9 place-items-center rounded-lg text-xl text-slate-600 transition hover:bg-slate-100"
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="text-sm font-semibold text-slate-700">Notifications</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-indigo-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
            {recent.length === 0 && (
              <p className="p-6 text-center text-sm text-slate-400">
                You're all caught up 🎉
              </p>
            )}
            {recent.map((n) => (
              <button
                key={n.id}
                onClick={() => openNotification(n)}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${
                  n.is_read ? '' : 'bg-indigo-50/60'
                }`}
              >
                <span className="mt-0.5 text-lg">{iconFor(n.kind)}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-800">{n.title}</div>
                  {n.body && (
                    <div className="truncate text-xs text-slate-500">{n.body}</div>
                  )}
                  <div className="mt-0.5 text-[10px] text-slate-400">
                    {timeAgo(n.created_at)}
                  </div>
                </div>
                {!n.is_read && (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setOpen(false)
              navigate('/notifications')
            }}
            className="block w-full border-t border-slate-100 py-2.5 text-center text-sm font-medium text-indigo-600 hover:bg-slate-50"
          >
            See all
          </button>
        </div>
      )}
    </div>
  )
}
