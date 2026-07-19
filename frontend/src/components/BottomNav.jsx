import { NavLink } from 'react-router-dom'

// Standard mobile bottom tab bar. Hidden on desktop (md+).
const TABS = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/report', label: 'Report', icon: '➕' },
  { to: '/messages', label: 'Chat', icon: '💬' },
  { to: '/dashboard', label: 'Dashboard', icon: '📋' },
]

export default function BottomNav() {
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
                <span className={`text-xl transition ${isActive ? 'scale-110' : ''}`}>
                  {t.icon}
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