import { NextRequest, NextResponse } from 'next/server'
import { getAnalyticsSummary } from '@/lib/analytics-db'

export const dynamic = 'force-dynamic'
export const revalidate = 60

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

/**
 * Verify Bearer token authentication
 */
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  const token = authHeader.substring(7)
  return token === ADMIN_PASSWORD
}

/**
 * GET /api/admin/analytics
 * Retrieve analytics data for admin dashboard
 * Query params: startDate, endDate (ISO 8601 format)
 */
export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)

    // Get date range from query params
    let startDate = searchParams.get('startDate')
    let endDate = searchParams.get('endDate')

    // Default to last 30 days if not provided
    if (!endDate) {
      endDate = new Date().toISOString()
    }

    if (!startDate) {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      startDate = thirtyDaysAgo.toISOString()
    }

    const summary = await getAnalyticsSummary(startDate, endDate)

    return NextResponse.json(summary, {
      headers: {
        'Cache-Control': 'private, max-age=60',
      },
    })
  } catch (error) {
    console.error('Failed to get analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
