import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client, { mediaUrl } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const isAdmin = user?.is_admin
  const [tab, setTab] = useState('items')
  const [items, setItems] = useState([])
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    // Admins see all items; regular users see only their own.
    const itemsReq = isAdmin ? client.get('/items/') : client.get('/items/?mine=1')
    Promise.all([itemsReq, client.get('/claims/')])
      .then(([i, c]) => {
        setItems(i.data.results ?? i.data)
        setClaims(c.data.results ?? c.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function deleteItem(id) {
    if (!confirm('Delete this item permanently? (admin only)')) return
    await client.delete(`/items/${id}/`)
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  async function respondClaim(claimId, status) {
    const { data } = await client.post(`/claims/${claimId}/respond/`, { status })
    setClaims((prev) => prev.map((c) => (c.id === claimId ? data : c)))
    load()
  }

  // Claims where I am the item owner (incoming) vs. claims I made (outgoing).
  const incoming = claims.filter((c) => c.claimant.id !== user.id)
  const outgoing = claims.filter((c) => c.claimant.id === user.id)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isAdmin ? 'Admin dashboard' : 'My dashboard'}
          </h1>
          <p className="text-slate-500">
            {isAdmin
              ? 'Manage every item on the platform. Only you can delete.'
              : 'Your reports and the claims connected to them.'}
          </p>
        </div>
        <Link
          to="/report"
          className="rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-500"
        >
          + Report item
        </Link>
      </div>

      <div className="mb-5 flex gap-2">
        <TabBtn active={tab === 'items'} onClick={() => setTab('items')}>
          {isAdmin ? 'All items' : 'My items'} ({items.length})
        </TabBtn>
        <TabBtn active={tab === 'incoming'} onClick={() => setTab('incoming')}>
          Incoming claims ({incoming.length})
        </TabBtn>
        <TabBtn active={tab === 'outgoing'} onClick={() => setTab('outgoing')}>
          My claims ({outgoing.length})
        </TabBtn>
      </div>

      {loading ? (
        <p className="py-16 text-center text-slate-400">Loading…</p>
      ) : tab === 'items' ? (
        <ItemsTable items={items} isAdmin={isAdmin} onDelete={deleteItem} />
      ) : tab === 'incoming' ? (
        <ClaimsList claims={incoming} respondable onRespond={respondClaim} />
      ) : (
        <ClaimsList claims={outgoing} />
      )}
    </div>
  )
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
        active ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  )
}

function ItemsTable({ items, isAdmin, onDelete }) {
  if (items.length === 0)
    return <Empty text="No items yet. Report your first one!" />

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Item</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Claims</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((it) => (
            <tr key={it.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {mediaUrl(it.image) ? (
                    <img src={mediaUrl(it.image)} alt="" className="h-10 w-10 rounded object-cover" />
                  ) : (
                    <div className="grid h-10 w-10 place-items-center rounded bg-slate-100">📦</div>
                  )}
                  <Link to={`/items/${it.id}`} className="font-medium text-slate-800 hover:text-indigo-600">
                    {it.title}
                  </Link>
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    it.item_type === 'lost'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {it.item_type_display}
                </span>
              </td>
              <td className="px-4 py-3 capitalize text-slate-600">{it.status}</td>
              <td className="px-4 py-3 text-slate-600">{it.claims_count}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    to={`/items/${it.id}`}
                    className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                  >
                    View
                  </Link>
                  {isAdmin ? (
                    <button
                      onClick={() => onDelete(it.id)}
                      className="rounded bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-200"
                    >
                      Delete
                    </button>
                  ) : (
                    <span
                      title="Only an admin can delete items"
                      className="rounded bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-300"
                    >
                      Delete 🔒
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ClaimsList({ claims, respondable = false, onRespond }) {
  if (claims.length === 0) return <Empty text="No claims here yet." />

  const color = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-rose-100 text-rose-700',
  }

  return (
    <div className="space-y-3">
      {claims.map((c) => (
        <div
          key={c.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div>
            <Link to={`/items/${c.item}`} className="font-semibold text-slate-800 hover:text-indigo-600">
              {c.item_title}
            </Link>
            <p className="text-sm text-slate-500">
              {respondable ? `From ${c.claimant.username}: ` : 'Your message: '}
              {c.message}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${color[c.status]}`}>
              {c.status}
            </span>
            {respondable && c.status === 'pending' && (
              <>
                <button
                  onClick={() => onRespond(c.id, 'approved')}
                  className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  Approve
                </button>
                <button
                  onClick={() => onRespond(c.id, 'rejected')}
                  className="rounded bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function Empty({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-400">
      {text}
    </div>
  )
}
