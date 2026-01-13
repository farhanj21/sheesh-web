import { NextResponse } from 'next/server'
import { getAboutContent } from '@/lib/about-db'

export const revalidate = 60

export async function GET() {
  try {
    const content = await getAboutContent()
    return NextResponse.json(content)
  } catch (error) {
    console.error('Failed to get about content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}
