import { NavLink } from 'react-router-dom'
<<<<<<< HEAD
import { useNotifications } from '../context/NotificationContext'
=======
>>>>>>> c5411e13992c2599f34ac36cbbb60fd05ac78bd8

// Standard mobile bottom tab bar. Hidden on desktop (md+).
const TABS = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/report', label: 'Report', icon: '➕' },
  { to: '/messages', label: 'Chat', icon: '💬' },
<<<<<<< HEAD
  { to: '/notifications', label: 'Alerts', icon: '🔔', badge: true },
=======
>>>>>>> c5411e13992c2599f34ac36cbbb60fd05ac78bd8
  { to: '/dashboard', label: 'Dashboard', icon: '📋' },
]

export default function BottomNav() {
<<<<<<< HEAD
  const { unread } = useNotifications()

=======
>>>>>>> c5411e13992c2599f34ac36cbbb60fd05ac78bd8
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
<<<<<<< HEAD
                <span className={`relative text-xl transition ${isActive ? 'scale-110' : ''}`}>
                  {t.icon}
                  {t.badge && unread > 0 && (
                    <span className="absolute -right-2 -top-1 grid h-4 min-w-[1rem] place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
=======
                <span className={`text-xl transition ${isActive ? 'scale-110' : ''}`}>
                  {t.icon}
>>>>>>> c5411e13992c2599f34ac36cbbb60fd05ac78bd8
                </span>
                {t.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> c5411e13992c2599f34ac36cbbb60fd05ac78bd8
