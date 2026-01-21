'use client'

import { useEffect } from 'react'
import { FadeIn } from '@/components/animations/FadeIn'
import { SlideIn } from '@/components/animations/SlideIn'
import { trackPageView } from '@/lib/analytics'
import { AboutContent as AboutContentType } from '@/types'

interface AboutContentProps {
  content: AboutContentType
}

export function AboutContent({ content }: AboutContentProps) {
  useEffect(() => {
    trackPageView('About')
  }, [])

  return (
    <div className="min-h-screen pt-32 pb-16 dark:bg-black">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="text-section font-bold text-4xl mb-4">
              <span
                className="text-black dark:text-white"
                data-text="About Sheesh"
              >
                About Sheesh
              </span>
            </h1>

            <p className="text-xl max-w-4xl mx-auto text-center">
              <span
                className="text-gray-600 dark:text-gray-400 italic leading-relaxed lg:whitespace-nowrap"
                data-text="We create handcrafted reflective art that transforms spaces and captures imagination."
              >
                We create handcrafted reflective art that transforms spaces and captures imagination.
              </span>
            </p>

          </div>
        </FadeIn>

        <div className="space-y-8 max-w-4xl mx-auto">
          {content.sections.map((section, index) => (
            <SlideIn key={section.id} direction="up" delay={index * 0.1}>
              <div className="prose prose-lg mx-auto">
                <h2 className="text-3xl font-bold mb-4">
                  <span
                    className="text-black dark:text-white"
                    data-text={section.title}
                  >
                    {section.title}
                  </span>
                </h2>

                <p className="leading-relaxed text-gray-800 dark:text-gray-300">
                  {section.content}
                </p>
              </div>
            </SlideIn>
          ))}
        </div>
      </div>
    </div>
  )
}
