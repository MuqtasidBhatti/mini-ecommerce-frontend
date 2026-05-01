import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    setError('')
    const res = await fetch('http://localhost:5000/api/users/register', {
      method: "POST",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify(user)
    })
    const data = await res.json()
    if (res.ok) {
      navigate('/login')
    } else {
      setError(data.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">Create account</h2>
          <p className="text-sm text-neutral-400 mt-1">Fill in your details to get started</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Full name"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-400 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent transition-all duration-150"
          />
          <input
            type="email"
            placeholder="Email address"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-400 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent transition-all duration-150"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-400 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent transition-all duration-150"
          />
        </div>

        <button
          onClick={handleRegister}
          className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-3 rounded-xl transition-colors duration-150 cursor-pointer"
        >
          Create account
        </button>

        <p className="text-center text-sm text-neutral-400 mt-6">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-indigo-700 font-medium hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register