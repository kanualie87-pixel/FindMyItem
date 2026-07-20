import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthShell, Field } from './Login'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
  })
  const [picture, setPicture] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function handlePicture(e) {
    const file = e.target.files[0]
    if (file) {
      setPicture(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      if (picture) data.append('profile_picture', picture)
      await register(data)
      navigate('/dashboard')
    } catch (err) {
      if (!err.response) {
        setError(
          'Cannot reach the server. Make sure the backend is running and open the app at http://localhost:5173'
        )
      } else {
        const d = err.response.data
        setError(
          (d && (d.username?.[0] || d.email?.[0] || d.password?.[0] || d.detail)) ||
            'Registration failed. Please check your details.'
        )
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Join FINDMYITEM and help reunite people with their things.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {error}
          </div>
        )}

        {/* Profile picture upload with live preview */}
        <div className="flex flex-col items-center gap-2">
          <label className="cursor-pointer">
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-2xl text-slate-400 transition hover:border-indigo-400">
              {preview ? (
                <img src={preview} alt="preview" className="h-full w-full object-cover" />
              ) : (
                '📷'
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handlePicture} />
          </label>
          <span className="text-xs text-slate-400">Add a profile picture (optional)</span>
        </div>

        <Field label="Username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} placeholder="pick a username" />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@example.com" />
        <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="optional" required={false} />
        <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} placeholder="at least 6 characters" />

        <button
          disabled={busy}
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {busy ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> c5411e13992c2599f34ac36cbbb60fd05ac78bd8
