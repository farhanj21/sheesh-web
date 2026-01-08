'use client'

import Image from 'next/image'
import { SlideIn } from '@/components/animations/SlideIn'

export function AboutSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-12">

        <div className="space-y-16">
          {/* Block 1 */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <SlideIn direction="left">
              <div className="w-fit mx-auto rounded-2xl bg-gradient-to-br from-gray-300/20 to-purple-300/20 flex items-center justify-center border border-gray-400/30 shimmer-overlay p-4">
                <Image src="/images/craftsman.jpeg" alt="Meticulous Craftsmanship" width={300} height={300} className="rounded-lg" />
              </div>
            </SlideIn>
            <SlideIn direction="right" delay={0.2}>
              <div className="space-y-4">
                <h3 className="text-4xl font-display font-bold text-gray-900">Meticulous Craftsmanship</h3>
                <p className="text-lg text-gray-800 leading-relaxed italic">
                  Each piece is meticulously handcrafted by skilled artisans who
                  pour their passion into every mirror tile and reflective
                  surface. We believe in the beauty of imperfection and the
                  unique character that comes from human touch.
                </p>
              </div>
            </SlideIn>
          </div>

          {/* Block 2 */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <SlideIn direction="left" delay={0.2} className="order-2 md:order-1">
              <div className="space-y-4">
                <h3 className="text-4xl font-display font-bold text-gray-900">Transform Any Space</h3>
                <p className="text-lg text-gray-800 leading-relaxed italic">
                  From intimate gatherings to grand celebrations, our reflective
                  art pieces create captivating atmospheres that enchant and
                  inspire. Watch as light dances across surfaces, creating
                  ever-changing patterns that breathe life into your space.
                </p>
              </div>
            </SlideIn>
            <SlideIn direction="right" className="order-1 md:order-2">
              <div className="w-fit mx-auto rounded-2xl bg-gradient-to-br from-purple-300/20 to-gray-400/30 flex items-center justify-center border border-gray-400/30 shimmer-overlay p-4">
                <Image src="/images/about-two.jpeg" alt="Transform Any Space" width={300} height={300} className="rounded-lg" />
              </div>
            </SlideIn>
          </div>

          {/* Block 3 */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <SlideIn direction="left">
              <div className="w-fit mx-auto rounded-2xl bg-gradient-to-br from-amber-100/10 to-gray-300/20 flex items-center justify-center border border-gray-400/30 shimmer-overlay p-4">
                <Image src="/images/craftsmanship.jpeg" alt="Sustainable Beauty" width={300} height={300} className="rounded-lg" />
              </div>
            </SlideIn>
            <SlideIn direction="right" delay={0.2}>
              <div className="space-y-4">
                <h3 className="text-4xl font-display font-bold text-gray-900">Sustainable Beauty</h3>
                <p className="text-lg text-gray-800 leading-relaxed italic">
                  We&apos;re committed to sustainable materials and ethical
                  production practices. Our pieces are built to last generations,
                  combining timeless design with responsible sourcing to create
                  art that feels as good as it looks.
                </p>
              </div>
            </SlideIn>
          </div>
        </div>
      </div>
    </section>
  )
}
