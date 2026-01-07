'use client'

import { useState, useEffect } from 'react'
import { StockManager } from './StockManager'
import { EventManager } from './EventManager'
import { AnalyticsManager } from './AnalyticsManager'
import { LayoutGrid, Calendar, TrendingUp, Eye, EyeOff } from 'lucide-react'

export function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'products' | 'events' | 'analytics'>('products')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token')
    if (savedToken) {
      setToken(savedToken)
      setIsAuthenticated(true)
    }
  }, [])

  const login = async () => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        const data = await res.json()
        setToken(data.token)
        localStorage.setItem('admin_token', data.token)
        setIsAuthenticated(true)
        setError('')
      } else {
        setError('Invalid password')
      }
    } catch (err) {
      setError('Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setToken(null)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4 md:px-0">
        <div className="bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-white">Admin Login</h2>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              className="w-full px-4 py-3 pr-12 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            onClick={login}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-zinc-200 transition"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-zinc-900 border-b border-zinc-800 z-50">
        <div className="container mx-auto px-4 md:px-6">
          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Top row - Title and Logout */}
            <div className="flex items-center justify-between h-14 border-b border-zinc-800">
              <span className="text-lg font-bold text-white">Admin Dashboard</span>
              <button
                onClick={logout}
                className="border-2 border-red-500 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out"
              >
                Logout
              </button>
            </div>
            {/* Bottom row - Tabs */}
            <div className="flex justify-around py-2">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                  activeTab === 'products'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutGrid size={18} />
                <span className="text-xs">Products</span>
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                  activeTab === 'events'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Calendar size={18} />
                <span className="text-xs">Events</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                  activeTab === 'analytics'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <TrendingUp size={18} />
                <span className="text-xs">Analytics</span>
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <span className="text-xl font-bold text-white">Admin Dashboard</span>
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    activeTab === 'products'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid size={20} />
                  Products
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    activeTab === 'events'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Calendar size={20} />
                  Events
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    activeTab === 'analytics'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <TrendingUp size={20} />
                  Analytics
                </button>
              </div>
            </div>
            <button
              onClick={logout}
              className="border-2 border-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-[112px] md:pt-20">
        {activeTab === 'products' ? (
          <StockManager token={token!} onLogout={logout} />
        ) : activeTab === 'events' ? (
          <EventManager token={token!} />
        ) : (
          <AnalyticsManager token={token!} />
        )}
      </div>
    </div>
  )
}
