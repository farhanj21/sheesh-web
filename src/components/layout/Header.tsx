'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  if (pathname?.startsWith('/admin')) {
    return null
  }

  const navLinks = [
    { href: '/products', label: 'Products' },
    { href: '/events', label: 'Events' },
    { href: '/contact', label: 'Contact' },
    { href: '/about', label: 'About' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-dark-900/95 backdrop-blur-md shadow-[0_8px_32px_rgba(192,192,192,0.15)]'
          : 'bg-dark-900/80 backdrop-blur-sm shadow-[0_4px_24px_rgba(192,192,192,0.1)]'
      )}
    >
      <nav className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-3xl font-display font-bold text-metallic hover:scale-105 transition-all duration-300"
          >
            <img src="/Logo NO BG.png" alt="Logo" className="h-16 w-auto drop-shadow-[0_0_8px_rgba(192,192,192,0.3)]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-silver-shine transition-all duration-300 font-fancy text-lg tracking-wide relative group hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                data-text={link.label}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-silver-100 to-transparent group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 mr-5 hover:bg-silver-700/30 rounded-lg transition-all duration-300 text-silver-300 hover:scale-110 hover:shadow-[0_0_12px_rgba(192,192,192,0.2)]"
                aria-label="Toggle mobile menu"
              >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-dark-850/50 backdrop-blur-md"
            >
              <div className="py-4 border-t border-silver-700/20">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className="block py-4 px-4 text-silver-shine transition-all duration-300 font-fancy text-xl text-center hover:bg-silver-700/10 hover:scale-105"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
