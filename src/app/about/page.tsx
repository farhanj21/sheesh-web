'use client'

import { useEffect } from 'react'
import { FadeIn } from '@/components/animations/FadeIn'
import { SlideIn } from '@/components/animations/SlideIn'
import { trackPageView } from '@/lib/analytics'

export default function AboutPage() {
  // Track page view
  useEffect(() => {
    trackPageView('About')
  }, [])

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="text-section font-bold text-4xl mb-4">
              <span
                className="text-gray-900"
                data-text="About Sheesh"
              >
                About Sheesh
              </span>
            </h1>

            <p className="text-xl max-w-4xl mx-auto text-center">
              <span
                className="text-gray-600 italic leading-relaxed lg:whitespace-nowrap"
                data-text="We create handcrafted reflective art that transforms spaces and captures imagination."
              >
                We create handcrafted reflective art that transforms spaces and captures imagination.
              </span>
            </p>

          </div>
        </FadeIn>

        <div className="space-y-8 max-w-4xl mx-auto">
          <SlideIn direction="up">
            <div className="prose prose-lg mx-auto">
                <h2 className="text-3xl font-bold mb-4">
                  <span
                    className="text-gray-800"
                    data-text="Our Story"
                  >
                    Our Story
                  </span>
                </h2>

                <p className="leading-relaxed text-gray-800">
                  I'm Aliha Naeem, a filmmaker from Lahore, Pakistan, and the founder of Sheesh — a
                  visual design brand exploring light and reflection through mirror mosaic art.
                  My work blends contemporary design with handcrafted detail, creating pieces
                  that respond to their surroundings by reflecting surrounding colours. Each
                  artwork sparkles with light, offering an interactive, pixelated reflection
                  that engages and captivates the viewer.
                </p>
            </div>
          </SlideIn>
        </div>
      </div>
    </div>
  )
}
