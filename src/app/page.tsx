import { Metadata } from 'next'
import { generateMetadata as genMeta, pageKeywords } from '@/lib/seo-utils'
import { HomeContent } from '@/components/home/HomeContent'

export const metadata: Metadata = genMeta({
  title: 'Home',
  description: 'Discover handcrafted mosaic mirror art, disco balls, and reflective artistic products. Transform your space with Sheesh Mirrorworks - Premium custom designs from Lahore, Pakistan.',
  path: '/',
  keywords: pageKeywords.home
})

export default function Home() {
  return <HomeContent />
}
