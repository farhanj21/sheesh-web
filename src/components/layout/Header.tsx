'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Handle keyboard navigation (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  if (pathname?.startsWith('/admin')) {
    return null
  }

  const desktopNavLinks = [
    { href: '/products', label: 'Products' },
    { href: '/events', label: 'Events' },
    { href: '/contact', label: 'Contact' },
    { href: '/about', label: 'About' },
  ]

  const mobileNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/events', label: 'Events' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(192,192,192,0.15)]'
          : 'bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(192,192,192,0.1)]'
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
          <div className="hidden md:flex items-center gap-6">
            {desktopNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-gray-700 dark:text-gray-300 transition-all duration-300 text-lg tracking-wide relative group font-medium pb-2",
                  "hover:text-gray-900 dark:hover:text-white",
                  pathname === link.href && "text-gray-900 dark:text-white"
                )}
                data-text={link.label}
              >
                {link.label}
                <span className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gray-900 dark:bg-white transition-all duration-300 ease-out rounded-full",
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                )}></span>
              </Link>
            ))}

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-all duration-300 text-gray-900 dark:text-white hover:scale-110"
            aria-label="Open mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-[9998] md:hidden"
              onClick={handleNavClick}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 right-0 bottom-0 left-0 h-screen w-full bg-white dark:bg-black z-[9999] md:hidden overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div className="flex flex-col min-h-screen">
                {/* Header with Close Button */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-gray-300 dark:border-silver-700/30 shrink-0">
                  <Link href="/" onClick={handleNavClick} className="block">
                    <img
                      src="/Logo NO BG.png"
                      alt="Logo"
                      className="h-20 w-auto drop-shadow-[0_0_8px_rgba(100,100,100,0.3)] dark:drop-shadow-[0_0_8px_rgba(192,192,192,0.3)]"
                    />
                  </Link>
                  <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <ThemeToggle />
                    <button
                      onClick={handleNavClick}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-all duration-300 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-silver-300 hover:scale-110"
                      aria-label="Close mobile menu"
                    >
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-6 pt-8 pb-12" aria-label="Mobile navigation">
                  <ul className="space-y-3">
                    {mobileNavLinks.map((link, index) => (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
                      >
                        <Link
                          href={link.href}
                          onClick={handleNavClick}
                          className={cn(
                            'block py-5 px-6 rounded-xl text-3xl transition-all duration-300',
                            pathname === link.href
                              ? 'bg-gray-200 dark:bg-zinc-800'
                              : 'hover:bg-gray-200 dark:hover:bg-zinc-800 hover:translate-x-2'
                          )}
                        >
                          <span className="text-gray-900 dark:text-white" data-text={link.label}>
                            {link.label}
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
