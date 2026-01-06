'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Track page view
  useEffect(() => {
    trackPageView('Contact')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Construct mailto link with form data
    const mailtoLink = `mailto:sheeshupyourlife@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`

    // Open default email client
    window.location.href = mailtoLink

    // Show success message and reset form
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })

      setTimeout(() => setSubmitStatus('idle'), 5000)
    }, 500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
      // href: 'https://wa.me/1234567890',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      description: 'Chat with us instantly'
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
        </svg>
      ),
      href: 'https://www.instagram.com/sheeshupyourlife/',
      color: 'from-pink-500 to-purple-600',
      hoverColor: 'hover:from-pink-600 hover:to-purple-700',
      description: 'DM Us for Orders Now'
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      // href: 'https://facebook.com/yourpage',
      color: 'from-blue-500 to-blue-700',
      hoverColor: 'hover:from-blue-600 hover:to-blue-800',
      description: 'Connect on Facebook'
    }
  ]

  return (
    <div className="min-h-screen pt-32 pb-16 bg-dark-950">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-850 to-dark-900" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-silver-400/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h1 className="text-section font-bold text-4xl mb-4">
            <span className="text-silver-shine" data-text="Get in Touch">Get in Touch</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-center">
            <span className="font-fancy text-gold-shine italic leading-relaxed" data-text="We'd love to hear from you. Reach out through your preferred channel.">
              We&apos;d love to hear from you. Reach out through your preferred channel.
            </span>
          </p>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20"
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-gradient-to-br from-dark-700/95 via-dark-800/95 to-dark-850/95 backdrop-blur-md border-2 border-silver-600/40 rounded-2xl p-8 text-center overflow-hidden transition-all duration-500 hover:border-silver-400/70 hover:shadow-[0_0_50px_rgba(192,192,192,0.4)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-silver-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-silver-300/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
              </div>

              {/* Radial glow effect behind icon */}
              <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className={`flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${social.color} ${social.hoverColor} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg group-hover:shadow-2xl`}>
                    <div className="w-10 h-10 text-white flex items-center justify-center">
                      {social.icon}
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-fancy text-silver-shine mb-3 group-hover:text-gold-shine transition-colors duration-300">
                  {social.name}
                </h3>
                <p className="text-sm font-fancy text-silver-400 italic group-hover:text-silver-300 transition-colors duration-300">
                  {social.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-silver-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.a>
          ))}
        </motion.div>

        {/* Email Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-dark-900/60 backdrop-blur-sm border border-silver-700/20 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-section font-bold text-3xl mb-2">
                <span className="text-silver-shine" data-text="Send us an Email">Send us an Email</span>
              </h2>
              <p className="text-lg">
                <span className="font-fancy text-gold-shine italic leading-relaxed" data-text="Fill out the form below and we'll get back to you soon">
                  Fill out the form below and we&apos;ll get back to you soon
                </span>
              </p>
            </div>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center font-fancy"
              >
                Thank you! Your message has been sent successfully.
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-silver-300 font-fancy mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-800/50 border-2 border-silver-700/30 rounded-lg text-silver-100 placeholder-silver-500 focus:outline-none focus:border-silver-400 focus:bg-dark-800/70 focus:shadow-[0_0_20px_rgba(192,192,192,0.2)] transition-all duration-300 font-fancy"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-silver-300 font-fancy mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-800/50 border-2 border-silver-700/30 rounded-lg text-silver-100 placeholder-silver-500 focus:outline-none focus:border-silver-400 focus:bg-dark-800/70 focus:shadow-[0_0_20px_rgba(192,192,192,0.2)] transition-all duration-300 font-fancy"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-silver-300 font-fancy mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-800/50 border-2 border-silver-700/30 rounded-lg text-silver-100 placeholder-silver-500 focus:outline-none focus:border-silver-400 focus:bg-dark-800/70 focus:shadow-[0_0_20px_rgba(192,192,192,0.2)] transition-all duration-300 font-fancy"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-silver-300 font-fancy mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-dark-800/50 border-2 border-silver-700/30 rounded-lg text-silver-100 placeholder-silver-500 focus:outline-none focus:border-silver-400 focus:bg-dark-800/70 focus:shadow-[0_0_20px_rgba(192,192,192,0.2)] transition-all duration-300 resize-none font-fancy"
                  placeholder="Tell us more..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full group inline-flex items-center justify-center gap-3 px-6 py-4 text-md font-fancy tracking-wide text-black bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 hover:from-gray-400 hover:via-gray-200 hover:to-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
