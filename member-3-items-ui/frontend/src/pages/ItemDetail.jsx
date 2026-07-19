import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import client, { mediaUrl } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'

export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [claimMsg, setClaimMsg] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    client
      .get(`/items/${id}/`)
      .then((res) => setItem(res.data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false))
  }, [id])

  async function submitClaim(e) {
    e.preventDefault()
    if (!user) return navigate('/login')
    try {
      await client.post('/claims/', { item: item.id, message: claimMsg })
      setNotice('Your claim has been sent to the owner.')
      setClaimMsg('')
    } catch (err) {
      setNotice(err.response?.data?.detail || 'Could not submit claim.')
    }
  }

  async function messageOwner() {
    if (!user) return navigate('/login')
    const { data } = await client.post('/conversations/start/', {
      user_id: item.owner.id,
      item: item.id,
    })
    navigate(`/messages?c=${data.id}`)
  }

  if (loading) return <p className="py-20 text-center text-slate-400">Loading…</p>
  if (!item) return <p className="py-20 text-center text-slate-400">Item not found.</p>

  const isLost = item.item_type === 'lost'
  const isOwner = user && user.id === item.owner.id
  const img = mediaUrl(item.image)

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-slate-500 hover:underline">
        ← Back
      </button>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {img ? (
            <img src={img} alt={item.title} className="h-72 w-full object-cover" />
          ) : (
            <div className="flex h-72 items-center justify-center bg-slate-100 text-6xl">📦</div>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase text-white ${
                isLost ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
            >
              {isLost ? 'Lost' : 'Found'}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {item.category_display}
            </span>
            {item.status === 'resolved' && (
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-white">
                ✓ Resolved
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-slate-800">{item.title}</h1>
          <p className="mt-2 whitespace-pre-line text-slate-600">
            {item.description || 'No description provided.'}
          </p>

          <dl className="mt-4 space-y-1 text-sm text-slate-600">
            <div className="flex gap-2">
              <dt className="font-semibold">📍 Location:</dt>
              <dd>{item.location || 'Unknown'}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold">📅 Date:</dt>
              <dd>{item.date_event || item.created_at?.slice(0, 10)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3">
            <Avatar user={item.owner} size={40} />
            <div className="text-sm">
              <div className="font-semibold text-slate-700">
                Posted by {item.owner.username}
              </div>
              <div className="text-slate-400">{item.owner.email}</div>
            </div>
          </div>

          {!isOwner && (
            <button
              onClick={messageOwner}
              className="mt-4 w-full rounded-lg bg-slate-800 py-2.5 font-semibold text-white transition hover:bg-slate-700"
            >
              💬 Message {item.owner.username}
            </button>
          )}
        </div>
      </div>

      {/* Claim box */}
      {!isOwner && item.status !== 'resolved' && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">
            {isLost ? 'Did you find this?' : 'Is this yours?'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Send a claim to the person who posted it. They will review and get in touch.
          </p>
          {notice && (
            <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {notice}
            </div>
          )}
          <form onSubmit={submitClaim} className="mt-3 space-y-3">
            <textarea
              value={claimMsg}
              onChange={(e) => setClaimMsg(e.target.value)}
              rows={3}
              required
              placeholder="Add proof or details that show this is the right match…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <button className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-500">
              Submit claim
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
