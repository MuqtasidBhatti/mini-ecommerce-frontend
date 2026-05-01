import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
      method: "POST",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify(user)
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      navigate('/')
    } else {
      setError(data.message || 'Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">Welcome back</h2>
          <p className="text-sm text-neutral-400 mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
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
          onClick={handleLogin}
          className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-3 rounded-xl transition-colors duration-150 cursor-pointer"
        >
          Sign in
        </button>

        <p className="text-center text-sm text-neutral-400 mt-6">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-indigo-700 font-medium hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login