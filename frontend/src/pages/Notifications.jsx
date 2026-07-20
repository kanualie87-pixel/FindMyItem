import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'
import { iconFor, timeAgo } from '../utils/notifications'

/** Full-page list of every notification the user has received. */
export default function Notifications() {
  const { notifications, unread, markRead, markAllRead } = useNotifications()
  const navigate = useNavigate()

  function open(n) {
    markRead(n.id)
    if (n.url) navigate(n.url)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Notifications
          {unread > 0 && (
            <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              {unread} new
            </span>
          )}
        </h1>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {notifications.length === 0 ? (
          <p className="p-12 text-center text-slate-400">
            No notifications yet. We'll let you know when something happens 🔔
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => open(n)}
                  className={`flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-slate-50 ${
                    n.is_read ? '' : 'bg-indigo-50/60'
                  }`}
                >
                  <span className="mt-0.5 text-2xl">{iconFor(n.kind)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-800">{n.title}</div>
                    {n.body && <div className="text-sm text-slate-500">{n.body}</div>}
                    <div className="mt-1 text-xs text-slate-400">{timeAgo(n.created_at)}</div>
                  </div>
                  {!n.is_read && (
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
