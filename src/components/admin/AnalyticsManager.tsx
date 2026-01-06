'use client'

import { useState, useEffect } from 'react'
import { Eye, ShoppingBag, MousePointerClick, Download, TrendingUp, TrendingDown } from 'lucide-react'
import { AnalyticsSummary } from '@/types/analytics'

interface AnalyticsManagerProps {
  token: string
}

type DateRange = '7d' | '30d' | '90d' | 'all'

export function AnalyticsManager({ token }: AnalyticsManagerProps) {
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    setError('')

    try {
      const now = new Date()
      let startDate: string

      switch (dateRange) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
          break
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
          break
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
          break
        case 'all':
          startDate = new Date(0).toISOString()
          break
      }

      const endDate = now.toISOString()

      const res = await fetch(
        `/api/admin/analytics?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await res.json()
      setAnalytics(data)
    } catch (err) {
      setError('Failed to load analytics')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const exportCSV = () => {
    if (!analytics) return

    const rows = [
      ['Product Analytics Report'],
      ['Date Range', analytics.dateRange.startDate, 'to', analytics.dateRange.endDate],
      [],
      ['Summary Metrics'],
      ['Total Page Views', analytics.totalPageViews],
      ['Total Product Views', analytics.totalProductViews],
      ['Total DM Clicks', analytics.totalDMClicks],
      [],
      ['Top Products'],
      ['Product Name', 'Views', 'DM Clicks', 'CTR %'],
      ...analytics.topProducts.map((p) => [
        p.productName,
        p.viewCount,
        p.dmClickCount,
        p.clickThroughRate.toFixed(2),
      ]),
      [],
      ['Top Categories'],
      ['Category', 'Views'],
      ...analytics.topCategories.map((c) => [c.category, c.viewCount]),
    ]

    const csvContent = rows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const getCTRColor = (ctr: number) => {
    if (ctr >= 10) return 'text-green-400'
    if (ctr >= 5) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-zinc-400">Track website traffic and product performance</p>
        </div>

        <div className="flex gap-4">
          {/* Date Range Selector */}
          <div className="flex gap-2 bg-zinc-900 rounded-lg p-1">
            {(['7d', '30d', '90d', 'all'] as DateRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  dateRange === range
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {range === 'all' ? 'All Time' : `Last ${range.replace('d', ' Days')}`}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={exportCSV}
            disabled={!analytics || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : analytics ? (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Total Product Views */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <ShoppingBag className="text-purple-400" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatNumber(analytics.totalProductViews)}
              </div>
              <div className="text-sm text-zinc-400">Total Product Views</div>
            </div>

            {/* Total DM Clicks */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <MousePointerClick className="text-green-400" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatNumber(analytics.totalDMClicks)}
              </div>
              <div className="text-sm text-zinc-400">Total DM Clicks</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Page Views by Page */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Page Views</h2>
              {analytics.pageViewsByPage.length > 0 ? (
                <div className="space-y-3">
                  {analytics.pageViewsByPage.map((pageView, index) => (
                    <div
                      key={pageView.page}
                      className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-zinc-700 rounded-full text-xs font-semibold text-zinc-300">
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">
                          {pageView.page}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {formatNumber(pageView.viewCount)}
                        </div>
                        <div className="text-xs text-zinc-400">views</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-center py-8">No page view data available</p>
              )}
            </div>

            {/* Top Products Table */}
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Top Products</h2>
              {analytics.topProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">
                          Product
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-zinc-400">
                          Views
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-zinc-400">
                          DM Clicks
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-zinc-400">
                          Interaction Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topProducts.map((product, index) => (
                        <tr
                          key={product.productId}
                          className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-zinc-800 rounded-full text-xs font-semibold text-zinc-400">
                                {index + 1}
                              </div>
                              <span className="text-white font-medium">
                                {product.productName}
                              </span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 text-white">
                            {formatNumber(product.viewCount)}
                          </td>
                          <td className="text-right py-3 px-4 text-white">
                            {formatNumber(product.dmClickCount)}
                          </td>
                          <td className="text-right py-3 px-4">
                            <span
                              className={`font-semibold ${getCTRColor(product.clickThroughRate)}`}
                            >
                              {product.clickThroughRate.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-zinc-500 text-center py-8">No product data available</p>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
