import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wraps routes that require authentication.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return children
<<<<<<< HEAD
}
=======
}
>>>>>>> c5411e13992c2599f34ac36cbbb60fd05ac78bd8
