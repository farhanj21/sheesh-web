'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function CTASection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative rounded-[32px] bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
        >
          {/* Decorative Concentric Circles - Right Side */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none hidden lg:block">
            {/* Outer circle */}
            <div className="absolute inset-0 rounded-full border-[2px] border-white/10 scale-100"></div>
            <div className="absolute inset-[40px] rounded-full border-[2px] border-white/15 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="absolute inset-[80px] rounded-full border-[2px] border-white/20 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute inset-[120px] rounded-full border-[2px] border-white/25 bg-gradient-to-br from-gray-400/20 to-transparent"></div>
            <div className="absolute inset-[160px] rounded-full border-[2px] border-white/30 bg-gradient-to-br from-gray-300/30 to-white/10"></div>
            <div className="absolute inset-[200px] rounded-full border-[2px] border-white/40 bg-gradient-to-br from-gray-200/40 to-white/20"></div>
            <div className="absolute inset-[240px] rounded-full bg-gradient-to-br from-white/50 to-white/30"></div>
          </div>

          {/* Content - Left Side */}
          <div className="relative z-10 px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
            <div className="max-w-2xl">
              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-silver-shine mb-6 leading-tight"
                data-text="Let's Get In Touch."
              >
                Let&apos;s Get In Touch.
              </motion.h2>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg md:text-xl text-silver-shine mb-10 leading-relaxed max-w-xl"
                data-text="Discover how our handcrafted mosaic mirror art can transform your space. Let's discuss your vision and explore our latest collections."
              >
                Discover how our handcrafted mosaic mirror art can transform your space. Let&apos;s discuss your vision and explore our latest collections.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {/* Button 1 - Contact Us */}
                <Link href="/contact" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 px-6 py-4 text-md font-fancy tracking-wide text-black bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 hover:from-gray-400 hover:via-gray-200 hover:to-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
                  >
                    <span>Get in Touch</span>
                    <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </motion.button>
                </Link>

                {/* Button 2 - View Products - Hidden on mobile */}
                <Link href="/products" className="hidden sm:block">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group inline-flex items-center justify-center gap-3 px-6 py-4 text-md font-fancy tracking-wide text-black bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 hover:from-gray-400 hover:via-gray-200 hover:to-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
                  >
                    <span>View Products</span>
                    <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

