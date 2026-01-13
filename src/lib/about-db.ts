import { AboutContent } from '@/types'
import { getDatabase } from './mongodb'

const COLLECTION_NAME = 'about_content'
const SINGLETON_ID = 'about-page'

// Default content (current hardcoded values)
const DEFAULT_CONTENT: AboutContent = {
  id: SINGLETON_ID,
  sections: [
    {
      id: 'section-1',
      title: 'Our Story',
      content: `I'm Aliha Naeem, a filmmaker from Lahore, Pakistan, and the founder of Sheesh — a visual design brand exploring light and reflection through mirror mosaic art. My work blends contemporary design with handcrafted detail, creating pieces that respond to their surroundings by reflecting surrounding colours. Each artwork sparkles with light, offering an interactive, pixelated reflection that engages and captivates the viewer.`
    }
  ],
  updatedAt: new Date().toISOString()
}

export async function getAboutContent(): Promise<AboutContent> {
  const db = await getDatabase()
  const content = await db.collection<AboutContent>(COLLECTION_NAME).findOne({ id: SINGLETON_ID })

  if (!content) {
    return DEFAULT_CONTENT
  }

  return { ...content, _id: undefined } as AboutContent
}

export async function updateAboutContent(updates: Partial<Omit<AboutContent, 'id'>>): Promise<AboutContent> {
  const db = await getDatabase()

  const result = await db.collection<AboutContent>(COLLECTION_NAME).findOneAndUpdate(
    { id: SINGLETON_ID },
    {
      $set: {
        ...updates,
        updatedAt: new Date().toISOString()
      },
      $setOnInsert: { id: SINGLETON_ID }
    },
    {
      upsert: true,
      returnDocument: 'after'
    }
  )

  return { ...result, _id: undefined } as AboutContent
}
