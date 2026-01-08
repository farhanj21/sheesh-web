'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

export default function PrivacyPage() {
  useEffect(() => {
    trackPageView('Privacy')
  }, [])
  return (
    <div className="min-h-screen pt-32 pb-16 bg-dark-950">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-850 to-dark-900" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-silver-400/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 max-w-4xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-section font-bold text-4xl mb-4">
            <span className="text-white" data-text="Privacy Policy">Privacy Policy</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-center">
            <span className="text-gray-300 italic leading-relaxed" data-text="Last updated: December 31, 2025">
              Last updated: December 31, 2025
            </span>
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-dark-900/60 backdrop-blur-sm border border-silver-700/20 rounded-2xl p-8 md:p-12 space-y-8"
        >
          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">Introduction</h2>
            <p className="text-silver-400 leading-relaxed">
              Welcome to Sheesh. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or purchase our products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">Information We Collect</h2>
            <p className="text-silver-400 leading-relaxed mb-3">
              We may collect the following types of information:
            </p>
            <ul className="list-disc list-inside text-silver-400 leading-relaxed space-y-2 ml-4">
              <li>Personal identification information (name, email address, phone number)</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information (processed securely through third-party payment processors)</li>
              <li>Order history and preferences</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">How We Use Your Information</h2>
            <p className="text-silver-400 leading-relaxed mb-3">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-silver-400 leading-relaxed space-y-2 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and inquiries</li>
              <li>Send promotional materials and updates (with your consent)</li>
              <li>Improve our products and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">Data Security</h2>
            <p className="text-silver-400 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">Third-Party Services</h2>
            <p className="text-silver-400 leading-relaxed">
              We may use third-party service providers to help us operate our business and website or administer activities on our behalf. These third parties have access to your personal information only to perform specific tasks and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">Cookies</h2>
            <p className="text-silver-400 leading-relaxed">
              Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect some functionality of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">Your Rights</h2>
            <p className="text-silver-400 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-silver-400 leading-relaxed space-y-2 ml-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to processing of your personal information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">Changes to This Policy</h2>
            <p className="text-silver-400 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-4">Contact Us</h2>
            <p className="text-silver-400 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us through our <a href="/contact" className="text-gray-300 hover:text-gold-400 transition-colors">Contact page</a>.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}
