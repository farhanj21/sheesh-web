import { Metadata } from 'next'
import { generateMetadata as genMeta, pageKeywords } from '@/lib/seo-utils'
import { getAboutContent } from '@/lib/about-db'
import { AboutContent } from '@/components/about/AboutContent'

export const metadata: Metadata = genMeta({
  title: 'About Us',
  description: 'Learn about Aliha Naeem and Sheesh Mirrorworks - a visual design brand from Lahore, Pakistan, exploring light and reflection through handcrafted mirror mosaic art.',
  path: '/about',
  keywords: pageKeywords.about
})

export default async function AboutPage() {
  const content = await getAboutContent()

  return <AboutContent content={content} />
}
