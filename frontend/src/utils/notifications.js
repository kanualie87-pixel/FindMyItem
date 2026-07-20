// Presentation helpers shared by the notification bell and the full page.

// An emoji per notification kind (matches Notification.Kind on the backend).
export const KIND_ICON = {
  message: '💬',
  claim: '🙋',
  claim_approved: '✅',
  claim_rejected: '❌',
  item_new: '📦',
  item_resolved: '🎉',
  system: '🔔',
}

export function iconFor(kind) {
  return KIND_ICON[kind] || '🔔'
}

// "just now", "5m", "3h", "2d" — compact relative time.
export function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return new Date(iso).toLocaleDateString()
}
