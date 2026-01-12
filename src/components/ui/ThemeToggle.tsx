'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400 dark:hover:bg-zinc-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-black"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Track with icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun className="w-4 h-4 text-yellow-500 dark:text-gray-500 transition-colors duration-300" />
        <Moon className="w-4 h-4 text-gray-500 dark:text-blue-300 transition-colors duration-300" />
      </div>

      {/* Sliding pill */}
      <motion.div
        className="absolute top-1 left-1 w-6 h-6 bg-white dark:bg-zinc-900 rounded-full shadow-md flex items-center justify-center"
        animate={{
          x: isDark ? 32 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {/* Icon inside the pill */}
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-blue-400" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-yellow-500" />
          )}
        </motion.div>
      </motion.div>
    </button>
  )
}
