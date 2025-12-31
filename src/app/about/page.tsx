import { FadeIn } from '@/components/animations/FadeIn'
import { SlideIn } from '@/components/animations/SlideIn'

export const metadata = {
  title: 'About - Sheesh',
  description: 'Learn about Sheesh and our passion for creating handcrafted reflective art.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-section font-bold mb-6">About Sheesh</h1>
            <p className="text-xl text-neutral-600">
              We create handcrafted reflective art that transforms spaces and
              captures imagination.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-24 max-w-4xl mx-auto">
          <SlideIn direction="up">
            <div className="prose prose-lg mx-auto">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-neutral-600 leading-relaxed">
                Sheesh was born from a simple fascination with light and
                reflection. What started as a passion project in a small
                workshop has grown into a celebration of craftsmanship,
                creativity, and the transformative power of art.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Each piece we create is a testament to the beauty that emerges
                when traditional artisan techniques meet contemporary design.
                Our disco balls and mosaic mirrors aren&apos;t just decorative
                objects—they&apos;re conversation starters, mood setters, and works
                of art that bring joy to everyday spaces.
              </p>
            </div>
          </SlideIn>

          <SlideIn direction="up" delay={0.2}>
            <div className="prose prose-lg mx-auto">
              <h2 className="text-3xl font-bold mb-4">Our Craft</h2>
              <p className="text-neutral-600 leading-relaxed">
                Every mirror tile is individually placed by hand. Every disco
                ball is carefully balanced for perfect rotation. We believe in
                the value of slow, intentional work—the kind that creates pieces
                meant to be cherished for years to come.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Our materials are sourced responsibly, our production methods are
                sustainable, and our commitment to quality is unwavering. When
                you bring a Sheesh piece into your home, you&apos;re not just adding
                decoration—you&apos;re adding a piece of our passion and dedication.
              </p>
            </div>
          </SlideIn>

          <SlideIn direction="up" delay={0.4}>
            <div className="prose prose-lg mx-auto">
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-neutral-600 leading-relaxed">
                We envision a world where art isn&apos;t confined to galleries and
                museums, but lives in the spaces we inhabit every day. Where the
                play of light can turn an ordinary room into something
                extraordinary. Where beauty is accessible, sustainable, and
                crafted with care.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Thank you for being part of our journey. We&apos;re honored to help
                you transform your space.
              </p>
            </div>
          </SlideIn>
        </div>
      </div>
    </div>
  )
}
