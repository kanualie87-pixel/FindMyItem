import { Link } from 'react-router-dom'
import { mediaUrl } from '../api/client'

const CATEGORY_EMOJI = {
  electronics: '💻',
  documents: '📄',
  keys: '🔑',
  wallet: '👛',
  clothing: '👕',
  bag: '🎒',
  jewelry: '💍',
  pet: '🐾',
  other: '📦',
}

// Standardized, reusable card: image, lost/found badge, location, date.
export default function ItemCard({ item }) {
  const isLost = item.item_type === 'lost'
  const img = mediaUrl(item.image)
  const date = item.date_event || item.created_at?.slice(0, 10)

  return (
    <Link
      to={`/items/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {img ? (
          <img
            src={img}
            alt={item.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">
            {CATEGORY_EMOJI[item.category] || '📦'}
          </div>
        )}

        {/* Lost / Found badge */}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow ${
            isLost ? 'bg-rose-500' : 'bg-emerald-500'
          }`}
        >
          {isLost ? '🔴 Lost' : '🟢 Found'}
        </span>

        {item.status === 'resolved' && (
          <span className="absolute right-3 top-3 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold text-white">
            ✓ Resolved
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-lg">{CATEGORY_EMOJI[item.category] || '📦'}</span>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {item.category_display || item.category}
          </span>
        </div>
        <h3 className="line-clamp-1 font-semibold text-slate-800">{item.title}</h3>
        <p className="mb-3 line-clamp-2 flex-1 text-sm text-slate-500">
          {item.description || 'No description provided.'}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            📍 {item.location || 'Unknown'}
          </span>
          <span className="flex items-center gap-1">📅 {date}</span>
        </div>
      </div>
    </Link>
  )
}
