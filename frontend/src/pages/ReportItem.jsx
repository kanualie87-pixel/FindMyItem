import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import MapPicker from '../components/MapPicker'

const CATEGORIES = [
  ['electronics', '💻 Electronics'],
  ['documents', '📄 Documents'],
  ['keys', '🔑 Keys'],
  ['wallet', '👛 Wallet / Purse'],
  ['clothing', '👕 Clothing'],
  ['bag', '🎒 Bag / Backpack'],
  ['jewelry', '💍 Jewelry'],
  ['pet', '🐾 Pet'],
  ['other', '📦 Other'],
]

export default function ReportItem() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    item_type: 'lost',
    category: 'other',
    location: '',
    date_event: '',
    description: '',
  })
  const [coords, setCoords] = useState({ lat: null, lng: null })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  function handleImage(e) {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v !== '') data.append(k, v)
      })
      if (coords.lat != null) {
        data.append('latitude', coords.lat)
        data.append('longitude', coords.lng)
      }
      if (image) data.append('image', image)
      const res = await client.post('/items/', data)
      navigate(`/items/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not submit the report. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800">Report an item</h1>
      <p className="mt-1 text-slate-500">
        Fill in the details below. The more you share, the easier it is to find a match.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</div>
        )}

        {/* Lost / Found toggle */}
        <div>
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Are you reporting a lost or found item?
          </span>
          <div className="flex gap-3">
            {[
              ['lost', '🔴 I lost this', 'rose'],
              ['found', '🟢 I found this', 'emerald'],
            ].map(([v, label]) => (
              <button
                type="button"
                key={v}
                onClick={() => setForm({ ...form, item_type: v })}
                className={`flex-1 rounded-xl border-2 py-3 font-semibold transition ${
                  form.item_type === v
                    ? v === 'lost'
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Image upload drop */}
        <div>
          <span className="mb-1 block text-sm font-medium text-slate-700">Photo</span>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-6 text-center transition hover:border-indigo-400">
            {preview ? (
              <img src={preview} alt="preview" className="max-h-48 rounded-lg object-contain" />
            ) : (
              <>
                <span className="text-3xl">🖼️</span>
                <span className="mt-1 text-sm text-slate-500">
                  Click to upload an image (optional)
                </span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
        </div>

        <Input label="Title" value={form.title} onChange={set('title')} placeholder="e.g. Black leather wallet" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="mb-1 block text-sm font-medium text-slate-700">Category</span>
            <select
              value={form.category}
              onChange={set('category')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              {CATEGORIES.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Date lost / found"
            type="date"
            value={form.date_event}
            onChange={set('date_event')}
            required={false}
          />
        </div>

        <Input
          label="Location description"
          value={form.location}
          onChange={set('location')}
          placeholder="e.g. Main library, 2nd floor"
          required={false}
        />

        {/* Map picker */}
        <div>
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Pin the location on the map{' '}
            <span className="font-normal text-slate-400">(click to drop a pin)</span>
          </span>
          <MapPicker
            lat={coords.lat}
            lng={coords.lng}
            onPick={(lat, lng) => setCoords({ lat, lng })}
          />
          {coords.lat != null && (
            <p className="mt-1 text-xs text-slate-500">
              Selected: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </p>
          )}
        </div>

        {/* What you want to report / description */}
        <div>
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Describe what you want to report
          </span>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={4}
            placeholder="Write anything helpful: distinguishing features, contents, circumstances…"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <button
          disabled={busy}
          className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {busy ? 'Submitting…' : 'Submit report'}
        </button>
      </form>
    </div>
  )
}

function Input({ label, type = 'text', value, onChange, placeholder, required = true }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />
    </label>
  )
}
