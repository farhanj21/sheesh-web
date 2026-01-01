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
            <h1 className="text-section font-bold text-4xl mb-4">
              <span
                className="text-silver-shine"
                data-text="About Sheesh"
              >
                About Sheesh
              </span>
            </h1>

            <p className="text-xl max-w-2xl mx-auto text-center">
              <span
                className="font-fancy text-gold-shine italic leading-relaxed"
                data-text="We create handcrafted reflective art that transforms spaces and captures imagination."
              >
                We create handcrafted reflective art that transforms spaces and captures
                imagination.
              </span>
            </p>

          </div>
        </FadeIn>

        <div className="space-y-24 max-w-4xl mx-auto">
          <SlideIn direction="up">
            <div className="prose prose-lg mx-auto">
                <h2 className="text-3xl font-bold mb-4">
                  <span
                    className="text-gold-shine"
                    data-text="Our Story"
                  >
                    Our Story
                  </span>
                </h2>

                <p className="leading-relaxed text-silver-shine/80">
                  I'm Aliha Naeem, a filmmaker from Lahore, Pakistan, and the founder of Sheesh — a
                  visual design brand exploring light and reflection through mirror mosaic art.
                  My work blends contemporary design with handcrafted detail, creating pieces
                  that respond to their surroundings by reflecting surrounding colours. Each
                  artwork sparkles with light, offering an interactive, pixelated reflection
                  that engages and captivates the viewer.
                </p>
            </div>
          </SlideIn>

          <SlideIn direction="up" delay={0.2}>
            <div className="prose prose-lg mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                <span
                  className="text-gold-shine"
                  data-text="Our Craft"
                >
                  Our Craft
                </span>
              </h2>
              <p className="leading-relaxed text-silver-shine/80">
                Every mirror tile is individually placed by hand. Every disco
                ball is carefully balanced for perfect rotation. We believe in
                the value of slow, intentional work—the kind that creates pieces
                meant to be cherished for years to come.
              </p>
              <p className="text-silver-shine/80 leading-relaxed">
                Our materials are sourced responsibly, our production methods are
                sustainable, and our commitment to quality is unwavering. When
                you bring a Sheesh piece into your home, you&apos;re not just adding
                decoration—you&apos;re adding a piece of our passion and dedication.
              </p>
            </div>
          </SlideIn>

          <SlideIn direction="up" delay={0.4}>
            <div className="prose prose-lg mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                <span
                  className="text-gold-shine"
                  data-text="Our Vision"
                >
                  Our Vision
                </span>
              </h2>
              <p className="text-silver-shine/80 leading-relaxed">
                We envision a world where art isn&apos;t confined to galleries and
                museums, but lives in the spaces we inhabit every day. Where the
                play of light can turn an ordinary room into something
                extraordinary. Where beauty is accessible, sustainable, and
                crafted with care.
              </p>
              <p className="text-silver-shine/80 leading-relaxed">
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
