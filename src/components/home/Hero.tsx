'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Suspense } from 'react'
import { SplineScene } from './SplineScene'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-black">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-black dark:via-black dark:to-black" />

      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/15 to-transparent dark:via-silver-400/15 animate-shimmer bg-[length:200%_100%]" />
      </div>

      {/* Radial glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] bg-gray-400/8 dark:bg-silver-400/8 rounded-full blur-[120px]" />

      <div className="relative z-10 container mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-[45%_55%] gap-8 lg:gap-12 items-center min-h-screen py-20 lg:py-0">
          {/* Left side - Text content */}
          <div className="flex flex-col justify-center text-left order-2 lg:order-1">
            {/* Main heading */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-fancy max-w-3xl mb-6 md:mb-8 italic drop-shadow-[0_0_30px_rgba(100,100,100,0.15)] dark:drop-shadow-[0_0_30px_rgba(192,192,192,0.15)] leading-tight"
            >
              <span className="text-gray-900 dark:text-white block sm:inline">
                Handcrafted
              </span>{' '}
              <span className="text-gray-700 dark:text-silver-200 block sm:inline">
                Mosaic Mirror Art
              </span>
              <span className="text-gray-900 dark:text-white block">
                That Transforms Your Space And Vibe
              </span>
            </motion.p>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg sm:text-xl md:text-2xl font-fancy text-gray-600 dark:text-silver-300 max-w-xl mb-6 md:mb-8 italic"
            >
              Sheesh Up Your Life
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href="/products">
                <Button 
                  size="md" 
                  className="text-sm sm:text-md font-fancy tracking-wide text-black bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 hover:from-gray-400 hover:via-gray-200 hover:to-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                >
                  Explore Collection
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right side - 3D Spline Model */}
          <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-screen order-1 lg:order-2">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-600 dark:text-neutral-400 animate-pulse text-sm sm:text-base">Loading 3D model...</div>
              </div>
            }>
              <div className="w-full h-full [&>canvas]:!bg-transparent brightness-125 contrast-110 saturate-110 drop-shadow-[0_0_30px_rgba(100,100,100,0.15)]">
                <SplineScene scene="https://prod.spline.design/EBYi2LZiB-m6IC2a/scene.splinecode" />
              </div>
            </Suspense>
            {/* Glow effect behind model */}
            <div className="absolute inset-0 -z-10 bg-gradient-radial from-gray-400/15 via-transparent to-transparent blur-3xl" />
          </div>
        </div>
      </div>

      {/* Scroll indicator - hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="hidden md:block absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2 text-gray-600 dark:text-neutral-400">
          <motion.svg
            className="w-6 h-6"
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </motion.svg>
        </div>
      </motion.div>
    </section>
  )
}
