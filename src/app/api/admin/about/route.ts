import { NextRequest, NextResponse } from 'next/server'
import { getAboutContent, updateAboutContent } from '@/lib/about-db'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  const token = authHeader.substring(7)
  return token === ADMIN_PASSWORD
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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

export async function PUT(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const updates = await request.json()

    const { sections } = updates
    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Sections array is required' },
        { status: 400 }
      )
    }

    // Validate each section has required fields
    for (const section of sections) {
      if (!section.id || !section.title || !section.content) {
        return NextResponse.json(
          { error: 'Each section must have id, title, and content' },
          { status: 400 }
        )
      }
    }

    const updatedContent = await updateAboutContent({ sections })

    return NextResponse.json(updatedContent)
  } catch (error) {
    console.error('Failed to update about content:', error)
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    )
  }
}
