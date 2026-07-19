import { mediaUrl } from '../api/client'

// Circular avatar. Falls back to the user's initial when no picture is set.
export default function Avatar({ user, size = 36 }) {
  const src = mediaUrl(user?.profile_picture)
  const initial = (user?.username || '?').charAt(0).toUpperCase()
  const style = { width: size, height: size }

  if (src) {
    return (
      <img
        src={src}
        alt={user?.username}
        style={style}
        className="rounded-full object-cover ring-2 ring-white/60"
      />
    )
  }
  return (
    <div
      style={style}
      className="flex items-center justify-center rounded-full bg-indigo-500 font-semibold text-white ring-2 ring-white/60"
    >
      {initial}
    </div>
  )
}
