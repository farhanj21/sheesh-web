'use client'

import { useEffect } from 'react'
import { Hero } from '@/components/home/Hero'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { AboutSection } from '@/components/home/AboutSection'
import { CTASection } from '@/components/home/CTASection'
import { trackPageView } from '@/lib/analytics'

export default function Home() {
  // Track page view
  useEffect(() => {
    trackPageView('Home')
  }, [])

  return (
    <>
      <Hero />
      <FeaturedProducts />
      <AboutSection />
      <CTASection />
    </>
  )
}
