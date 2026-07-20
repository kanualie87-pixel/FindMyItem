import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ReportItem from './pages/ReportItem'
import ItemDetail from './pages/ItemDetail'
import Dashboard from './pages/Dashboard'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'

function App() {
  const { user } = useAuth()

  // Auth-first: until the user logs in, the ONLY thing they can see is the
  // login / register screens. No navigation bar is shown.
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // Logged in: show the navigation bar (top on web, bottom tabs on phone).
  return (
    <div className="min-h-full pb-16 md:pb-0">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          {/* Once logged in, /login and /register just go home. */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

function NotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-800">404</h1>
      <p className="mt-2 text-slate-500">This page could not be found.</p>
    </div>
  )
}

export default App
