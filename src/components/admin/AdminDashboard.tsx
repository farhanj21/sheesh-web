'use client'

import { useState, useEffect } from 'react'
import { StockManager } from './StockManager'
import { EventManager } from './EventManager'
import { AnalyticsManager } from './AnalyticsManager'
import { LayoutGrid, Calendar, TrendingUp } from 'lucide-react'

export function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'products' | 'events' | 'analytics'>('products')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-white">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg mb-4 text-white focus:outline-none focus:border-zinc-500"
          />
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
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
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
      <div className="pt-20">
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
