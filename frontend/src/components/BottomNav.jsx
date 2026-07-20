import { NavLink } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'

// Standard mobile bottom tab bar. Hidden on desktop (md+).
const TABS = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/report', label: 'Report', icon: '➕' },
  { to: '/messages', label: 'Chat', icon: '💬' },
  { to: '/notifications', label: 'Alerts', icon: '🔔', badge: true },
  { to: '/dashboard', label: 'Dashboard', icon: '📋' },
]

export default function BottomNav() {
  const { unread } = useNotifications()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition ${
                isActive ? 'text-indigo-600' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`relative text-xl transition ${isActive ? 'scale-110' : ''}`}>
                  {t.icon}
                  {t.badge && unread > 0 && (
                    <span className="absolute -right-2 -top-1 grid h-4 min-w-[1rem] place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </span>
                {t.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
