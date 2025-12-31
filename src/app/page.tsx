import { Hero } from '@/components/home/Hero'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { AboutSection } from '@/components/home/AboutSection'
import { CTASection } from '@/components/home/CTASection'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <AboutSection />
      <CTASection />
    </>
  )
}
