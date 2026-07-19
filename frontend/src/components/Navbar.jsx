import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-lg">🔎</span>
          <span className="text-lg font-bold tracking-tight text-slate-800">
            FIND<span className="text-indigo-600">MY</span>ITEM
          </span>
        </Link>

        {/* Desktop nav links (hidden on mobile — the bottom bar handles those) */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/report" className={linkClass}>
            Report Item
          </NavLink>
          <NavLink to="/messages" className={linkClass}>
            Messages
          </NavLink>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
        </div>

        {/* Profile + logout (both breakpoints) */}
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Avatar user={user} size={32} />
            <span className="hidden text-sm font-medium text-slate-700 sm:block">
              {user.username}
              {user.is_admin && (
                <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                  ADMIN
                </span>
              )}
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  )
}