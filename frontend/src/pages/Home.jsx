import { useEffect, useState } from 'react'
import client from '../api/client'
import ItemCard from '../components/ItemCard'

const CATEGORIES = [
  ['', 'All categories'],
  ['electronics', 'Electronics'],
  ['documents', 'Documents'],
  ['keys', 'Keys'],
  ['wallet', 'Wallet / Purse'],
  ['clothing', 'Clothing'],
  ['bag', 'Bag / Backpack'],
  ['jewelry', 'Jewelry'],
  ['pet', 'Pet'],
  ['other', 'Other'],
]

export default function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('') // '', 'lost', 'found'
  const [category, setCategory] = useState('')

  function load() {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (type) params.type = type
    if (category) params.category = category
    client
      .get('/items/', { params })
      .then((res) => setItems(res.data.results ?? res.data))
      .finally(() => setLoading(false))
  }

  // Reload when filters (not the free-text box) change.
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, category])

  function handleSearch(e) {
    e.preventDefault()
    load()
  }

  return (
    <div>
      {/* Hero with search */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(255,255,255,.5) 0, transparent 25%), radial-gradient(circle at 80% 70%, rgba(255,255,255,.4) 0, transparent 25%)',
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center text-white">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Lost something? Found something?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
            FINDMYITEM reunites people with their belongings. Search the board or
            report an item in seconds.
          </p>

          {/* Prominent central search bar */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl"
          >
            <span className="pl-3 text-xl text-slate-400">🔎</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword, e.g. wallet, phone, keys…"
              className="flex-1 bg-transparent px-2 py-2 text-slate-800 outline-none"
            />
            <button className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-500">
              Search
            </button>
          </form>

          {/* Filter selectors */}
          <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2">
            <TypeToggle value={type} onChange={setType} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border-0 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow outline-none"
            >
              {CATEGORIES.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {type === 'lost' ? 'Lost items' : type === 'found' ? 'Found items' : 'Recent reports'}
          </h2>
          <span className="text-sm text-slate-500">{items.length} result(s)</span>
        </div>

        {loading ? (
          <p className="py-16 text-center text-slate-400">Loading…</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-400">
            No items match your search. Try clearing the filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function TypeToggle({ value, onChange }) {
  const opts = [
    ['', 'All'],
    ['lost', '🔴 Lost'],
    ['found', '🟢 Found'],
  ]
  return (
    <div className="flex rounded-lg bg-white/90 p-1 shadow">
      {opts.map(([v, l]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            value === v ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
