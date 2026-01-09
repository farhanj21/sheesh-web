# Dark Mode Toggle Implementation Guide

## Overview

Implement a theme toggle feature allowing users to switch between light and dark themes across the entire application, including admin dashboard. The implementation uses Tailwind's class-based dark mode strategy with React Context for state management and localStorage for persistence.

---

## User Requirements

✅ **Toggle Location**: Header navigation with sun/moon icon
✅ **Default Theme**: Light theme (falls back to system preference on first visit)
✅ **Admin Dashboard**: Follows the theme toggle (not fixed)
✅ **Implementation**: Tailwind class-based strategy with `dark:` variants
✅ **Persistence**: localStorage with system preference detection

---

## Current State Analysis

### Theme Status
- **Public pages**: Currently mixed (Header is dark, Footer is light, most components are light)
- **Admin dashboard**: Currently light theme (white backgrounds, black text)
- **Infrastructure**: No theme context, provider, or toggle exists
- **Tailwind config**: Has color palettes but no `darkMode` configuration

### Key Issues
1. No theme state management
2. No localStorage persistence
3. Components use hardcoded colors (especially ChromaGrid with RGB gradients)
4. Inconsistent styling between Header (dark) and Footer (light)

---

## Implementation Phases

### Phase 1: Foundation (4-5 hours)

#### 1.1 Create Theme Context & Provider

**File**: `src/contexts/ThemeContext.tsx` (CREATE)

```typescript
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const savedTheme = localStorage.getItem('theme') as Theme | null

    if (savedTheme) {
      setThemeState(savedTheme)
      applyTheme(savedTheme)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const systemTheme = prefersDark ? 'dark' : 'light'
      setThemeState(systemTheme)
      applyTheme(systemTheme)
      localStorage.setItem('theme', systemTheme)
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('theme')
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light'
        setThemeState(newTheme)
        applyTheme(newTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

#### 1.2 Create Theme Script (Prevent FOUC)

**File**: `src/lib/themeScript.ts` (CREATE)

```typescript
export const themeScript = `
(function() {
  function getTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  const theme = getTheme();
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();
`
```

#### 1.3 Update Tailwind Config

**File**: `tailwind.config.ts` (MODIFY)

Add this line at the top level of the config object:

```typescript
const config: Config = {
  darkMode: 'class', // ADD THIS LINE
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ... rest of config
}
```

#### 1.4 Update Global CSS

**File**: `src/app/globals.css` (MODIFY)

**1. Add transition to html element** (after line 7):
```css
html {
  scroll-behavior: smooth;
  overflow-x: hidden;
  max-width: 100vw;
  --font-sans: var(--font-hk-grotesk);
  font-family: var(--font-hk-grotesk);
  transition: background-color 0.3s ease, color 0.3s ease; /* ADD THIS */
}
```

**2. Update body styles** (lines 15-24):
```css
body {
  color: #111827;
  background-color: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  overflow-x: hidden;
  max-width: 100vw;
  position: relative;
}

/* Dark mode body styles */
.dark body {
  color: #f5f5f5;
  background-color: #0a0a0a;
}
```

#### 1.5 Update Layout Root

**File**: `src/app/layout.tsx` (MODIFY)

```typescript
import { ThemeProvider } from '@/contexts/ThemeContext'
import { themeScript } from '@/lib/themeScript'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID

  return (
    <html
      lang="en"
      className={`${hkGrotesk.variable} overflow-x-hidden`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans overflow-x-hidden">
        <ThemeProvider>
          {/* Google Analytics code remains unchanged */}
          {GA4_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA4_ID}', {
                    page_path: window.location.pathname,
                  });
                `}
              </Script>
            </>
          )}

          <Header />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Key changes**:
- Remove `bg-white text-gray-900` from body className
- Add `suppressHydrationWarning` to html element
- Wrap content in `<ThemeProvider>`
- Inject theme script in `<head>`

---

### Phase 2: Theme Toggle UI (2-3 hours)

#### 2.1 Create Theme Toggle Component

**File**: `src/components/ui/ThemeToggle.tsx` (CREATE)

```tsx
'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all duration-300 hover:scale-110 group"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Moon className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Sun className="w-5 h-5 text-white group-hover:text-silver-300 transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
```

#### 2.2 Integrate Toggle into Header

**File**: `src/components/layout/Header.tsx` (MODIFY)

**Import**:
```tsx
import { ThemeToggle } from '@/components/ui/ThemeToggle'
```

**Update header background** (around line 72):
```tsx
<header
  className={cn(
    'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
    isScrolled
      ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(192,192,192,0.15)]'
      : 'bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(192,192,192,0.1)]'
  )}
>
```

**Desktop navigation - Add ThemeToggle after nav links**:
```tsx
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

  {/* ADD THEME TOGGLE HERE */}
  <ThemeToggle />
</div>
```

**Mobile menu button**:
```tsx
<button
  onClick={() => setIsMobileMenuOpen(true)}
  className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-all duration-300 text-gray-900 dark:text-white hover:scale-110"
  aria-label="Open mobile menu"
  aria-expanded={isMobileMenuOpen}
>
  {/* SVG unchanged */}
</button>
```

**Mobile menu - Update backdrop and panel**:
```tsx
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
        {/* ADD THEME TOGGLE HERE */}
        <ThemeToggle />
        <button
          onClick={handleNavClick}
          className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-all duration-300 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-silver-300 hover:scale-110"
          aria-label="Close mobile menu"
        >
          {/* Close icon unchanged */}
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
```

---

### Phase 3: Layout Components (2-3 hours)

#### 3.1 Update Footer

**File**: `src/components/layout/Footer.tsx` (MODIFY)

Apply dark variants systematically:

- **Container** (line ~15):
  ```tsx
  className="bg-white dark:bg-dark-900 text-gray-600 dark:text-neutral-400 pt-8 md:pt-16 pb-4 md:pb-6 border-t border-gray-200 dark:border-silver-700/30"
  ```

- **Brand text** (line ~24):
  ```tsx
  className="text-sm text-gray-700 dark:text-silver-100 md:whitespace-nowrap"
  ```

- **All navigation links**:
  ```tsx
  className="text-gray-600 dark:text-neutral-400 hover:text-black dark:hover:text-silver-300 transition-all duration-300 relative group inline-block pb-1"
  ```

- **Link underlines**:
  ```tsx
  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-black dark:bg-white transition-all duration-300 ease-out rounded-full group-hover:w-full"
  ```

- **Section headings** (lines ~81, etc.):
  ```tsx
  className="text-black dark:text-white font-semibold text-lg"
  ```

- **Social links**:
  ```tsx
  className="text-gray-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-all hover:scale-110 duration-300"
  ```

- **Copyright text**:
  ```tsx
  className="text-gray-600 dark:text-neutral-400"
  ```

---

### Phase 4: Home Components (3-4 hours)

#### 4.1 Hero Component

**File**: `src/components/home/Hero.tsx` (MODIFY)

**Main container** (line ~11):
```tsx
className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-dark-950"
```

**Background gradient** (line ~13):
```tsx
className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900"
```

**Shimmer overlay** (line ~17):
```tsx
className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/15 to-transparent dark:via-silver-400/15 animate-shimmer bg-[length:200%_100%]"
```

**Radial glow** (line ~21):
```tsx
className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] bg-gray-400/8 dark:bg-silver-400/8 rounded-full blur-[120px]"
```

**Main heading** (line ~32):
```tsx
className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-fancy max-w-3xl mb-6 md:mb-8 italic drop-shadow-[0_0_30px_rgba(100,100,100,0.15)] dark:drop-shadow-[0_0_30px_rgba(192,192,192,0.15)] leading-tight"
```

**Text spans within heading**:
```tsx
<span className="text-gray-900 dark:text-white">...</span>
<span className="text-gray-700 dark:text-silver-200">...</span>
```

**Subheading** (line ~50):
```tsx
className="text-lg sm:text-xl md:text-2xl font-fancy text-gray-600 dark:text-silver-300 max-w-xl mb-6 md:mb-8 italic"
```

**Scroll indicator** (line ~76):
```tsx
className="text-gray-600 dark:text-neutral-400 animate-pulse text-sm sm:text-base"
```

#### 4.2 FeaturedProducts

**File**: `src/components/home/FeaturedProducts.tsx` (MODIFY)

- Heading: `text-gray-800 dark:text-silver-100`
- Subheading: `text-gray-900 dark:text-white`

#### 4.3 AboutSection

**File**: `src/components/home/AboutSection.tsx` (MODIFY)

- Background: `bg-gray-50 dark:bg-dark-900`
- Gradient containers: `from-gray-300/20 dark:from-silver-300/20 border-gray-400/30 dark:border-silver-400/30`
- Headings: `text-gray-900 dark:text-white`
- Text: `text-gray-800 dark:text-silver-100`

#### 4.4 CTASection

**File**: `src/components/home/CTASection.tsx` (MODIFY)

Apply standard conversions (currently dark section, needs light variant support)

---

### Phase 5: Product Components (5-6 hours) ⚠️ MOST COMPLEX

#### 5.1 ChromaGrid Component

**File**: `src/components/products/ChromaGrid.tsx` (MODIFY)

This is the most complex component due to hardcoded RGB gradients.

**Add import**:
```tsx
import { useTheme } from '@/contexts/ThemeContext'
```

**Add theme hook and dual color schemes**:
```tsx
const ChromaGrid: React.FC<ChromaGridProps> = ({ products, onProductClick }) => {
  const { theme } = useTheme()

  // Light theme gradients
  const categoryColorsLight: Record<string, { border: string; gradient: string }> = {
    mirrors: {
      border: '#808080',
      gradient: 'linear-gradient(145deg, #909090, #f0f0f0)'
    },
    'disco-balls': {
      border: '#FFD700',
      gradient: 'linear-gradient(180deg, #FFD700, #f5f5f5)'
    },
    'wall-art': {
      border: '#8B5CF6',
      gradient: 'linear-gradient(225deg, #8B5CF6, #f5f5f5)'
    },
    accessories: {
      border: '#10B981',
      gradient: 'linear-gradient(210deg, #10B981, #f5f5f5)'
    }
  }

  // Dark theme gradients
  const categoryColorsDark: Record<string, { border: string; gradient: string }> = {
    mirrors: {
      border: '#c0c0c0',
      gradient: 'linear-gradient(145deg, #909090, #1a1a1a)'
    },
    'disco-balls': {
      border: '#FFD700',
      gradient: 'linear-gradient(180deg, #FFD700, #0a0a0a)'
    },
    'wall-art': {
      border: '#8B5CF6',
      gradient: 'linear-gradient(225deg, #8B5CF6, #0a0a0a)'
    },
    accessories: {
      border: '#10B981',
      gradient: 'linear-gradient(210deg, #10B981, #0a0a0a)'
    }
  }

  const categoryColors = theme === 'dark' ? categoryColorsDark : categoryColorsLight

  // ... rest of component uses categoryColors
}
```

**Update spotlight color** (in card style object around line 164):
```tsx
style={{
  '--mouse-x': `${mousePosition.x}px`,
  '--mouse-y': `${mousePosition.y}px`,
  '--spotlight-color': theme === 'dark' ? 'rgba(192,192,192,0.3)' : 'rgba(100,100,100,0.3)',
  // ... other styles
} as React.CSSProperties}
```

**Update text color** (around line 184):
```tsx
className="relative z-10 h-[100px] p-3 text-gray-900 dark:text-white font-sans grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 items-start"
```

#### 5.2 ProductCard

**File**: `src/components/products/ProductCard.tsx` (MODIFY)

Apply standard conversions:
- Card: `bg-white dark:bg-dark-900 border-neutral-200 dark:border-zinc-800`
- Text: `text-neutral-900 dark:text-white`, `text-neutral-600 dark:text-neutral-400`
- Hover: `hover:border-neutral-300 dark:hover:border-zinc-700`

#### 5.3 ProductGrid & ProductDetail

Apply standard conversion patterns to remaining product components.

---

### Phase 6: UI Components (2-3 hours)

#### 6.1 Button Component

**File**: `src/components/ui/Button.tsx` (MODIFY)

**Update variants**:

**Primary** (line ~18):
```tsx
'bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-500 hover:to-gray-700 hover:scale-105 hover:shadow-glow-dark dark:from-silver-400 dark:to-silver-500 dark:text-dark-950 dark:hover:from-silver-300 dark:hover:to-silver-400 dark:hover:shadow-glow active:scale-100 font-semibold'
```

**Secondary** (line ~20):
```tsx
'bg-gray-200 text-gray-900 border border-gray-400 hover:bg-gray-300 hover:scale-105 hover:shadow-glow-dark active:scale-100 dark:bg-zinc-800 dark:text-silver-300 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:shadow-glow'
```

**Ghost** (line ~22):
```tsx
'bg-transparent text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-silver-300 dark:hover:bg-zinc-800 dark:hover:text-white'
```

**Focus ring** (line ~15):
```tsx
'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 dark:focus-visible:ring-silver-400 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black'
```

#### 6.2 Modal Component

**File**: `src/components/ui/Modal.tsx` (MODIFY)

- Backdrop: `bg-black/60 dark:bg-black/80`
- Modal: `bg-white dark:bg-dark-900 border-gray-300 dark:border-zinc-800 shadow-glow-dark-lg dark:shadow-glow-lg`
- Close button: `bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-silver-300`

#### 6.3 Card Component

**File**: `src/components/ui/Card.tsx` (MODIFY)

- Base: `bg-white dark:bg-dark-900 border-gray-300 dark:border-zinc-800 shadow-glow-dark dark:shadow-glow`
- Title: `text-gray-900 dark:text-white`
- Description: `text-gray-600 dark:text-neutral-400`

#### 6.4 LoadingScreen

**File**: `src/components/shared/LoadingScreen.tsx` (MODIFY)

- Background: `bg-white dark:bg-dark-950`
- Spinner: `border-gray-300/30 dark:border-zinc-800/30`, `border-t-gray-900 dark:border-t-white`
- Text: `text-gray-900 dark:text-white`, `text-gray-600 dark:text-neutral-400`

---

### Phase 7: Admin Components (3-4 hours)

**IMPORTANT**: Admin dashboard should follow the theme toggle.

#### 7.1 AdminDashboard

**File**: `src/components/admin/AdminDashboard.tsx` (MODIFY)

Apply dark variants systematically:

**Login screen** (line ~55):
```tsx
<div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-950 px-4 md:px-0">
  <div className="bg-white dark:bg-dark-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-zinc-800">
    <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Admin Login</h2>
    <input
      className="w-full px-4 py-3 pr-12 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded-lg text-black dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-zinc-700"
    />
    <button
      className="w-full bg-black dark:bg-gradient-to-r dark:from-silver-400 dark:to-silver-500 text-white dark:text-dark-950 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:from-silver-300 dark:hover:to-silver-400 transition"
    >
      Login
    </button>
  </div>
</div>
```

**Dashboard container** (line ~89):
```tsx
<div className="min-h-screen bg-white dark:bg-dark-950">
```

**Navigation bar** (line ~91):
```tsx
<nav className="fixed top-0 left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-800 z-50">
```

**Dashboard title**:
```tsx
<span className="text-lg font-bold text-black dark:text-white">Admin Dashboard</span>
```

**Tab buttons**:
```tsx
className={cn(
  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
  activeTab === 'products'
    ? "bg-black dark:bg-gradient-to-r dark:from-silver-400 dark:to-silver-500 text-white dark:text-dark-950"
    : "text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
)}
```

**Logout button**:
```tsx
className="border-2 border-red-500 text-red-500 px-3 py-1.5 text-sm rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out"
```

#### 7.2 Other Admin Components

Apply the same patterns to:
- `StockManager.tsx`
- `EventManager.tsx`
- `AnalyticsManager.tsx`
- Any other admin components

---

### Phase 8: Remaining Pages (3-4 hours)

Apply standard conversions to all page files:

- `src/app/products/page.tsx`
- `src/app/events/page.tsx`
- `src/app/about/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/privacy/page.tsx`
- `src/components/events/*`

---

### Phase 9: Testing & Polish (4-5 hours)

#### Testing Checklist

**Functionality**:
- [ ] Toggle button appears in desktop header
- [ ] Toggle button appears in mobile menu
- [ ] Clicking toggle switches theme instantly
- [ ] Theme persists after page refresh
- [ ] Theme persists across different pages
- [ ] System preference detected on first visit
- [ ] System preference changes respected (only if no manual override)
- [ ] No flash of wrong theme on page load

**Visual Testing by Page**:
- [ ] **Home page**: Hero, FeaturedProducts, AboutSection, CTASection all correct in both themes
- [ ] **Products page**: ChromaGrid renders with correct gradients in both themes
- [ ] **Individual product pages**: All elements styled correctly
- [ ] **Events page**: Cards and gallery work in both themes
- [ ] **Contact page**: Form and elements styled correctly
- [ ] **About page**: Content readable in both themes
- [ ] **Privacy page**: Content readable in both themes
- [ ] **Admin login**: Styled correctly in both themes
- [ ] **Admin dashboard**: All tabs and content work in both themes

**Component Testing**:
- [ ] Header: Navigation links, logo, mobile menu
- [ ] Footer: Links, text, social icons
- [ ] Buttons: All variants (primary, secondary, ghost) in both themes
- [ ] Modals: Background, content, close button
- [ ] Cards: Borders, shadows, text
- [ ] Loading screen: Spinner and text visible

**Visual Quality**:
- [ ] All text readable (contrast check)
- [ ] Images appropriate for both themes
- [ ] Shadows visible and appropriate
- [ ] Borders visible in both themes
- [ ] Gradients smooth in both themes
- [ ] Smooth 300ms transitions when toggling
- [ ] No layout shift when toggling
- [ ] Hover states work in both themes

**Accessibility**:
- [ ] Toggle button focusable with Tab key
- [ ] Toggle activates with Enter/Space
- [ ] Focus ring visible in both themes
- [ ] Toggle has proper aria-label
- [ ] Theme change announced (if using screen reader)
- [ ] Text contrast ≥ 4.5:1 (WCAG AA)
- [ ] Focus indicators ≥ 3:1 contrast

**Responsive Testing**:
- [ ] Mobile: 375px, 414px
- [ ] Tablet: 768px, 1024px
- [ ] Desktop: 1280px, 1440px, 1920px
- [ ] Toggle visible and usable at all sizes
- [ ] Mobile menu toggle works
- [ ] No horizontal scroll at any size

**Browser Testing**:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Performance**:
- [ ] Page load time unchanged
- [ ] Toggle responds instantly (<100ms)
- [ ] No janky animations
- [ ] Theme script doesn't block page load
- [ ] localStorage operations fast

---

## Standard Conversion Rules

### Quick Reference

```css
/* Backgrounds */
bg-white → bg-white dark:bg-dark-950
bg-gray-50 → bg-gray-50 dark:bg-dark-900
bg-gray-100 → bg-gray-100 dark:bg-dark-850
bg-gray-200 → bg-gray-200 dark:bg-zinc-800
bg-gray-300 → bg-gray-300 dark:bg-zinc-700

/* Text */
text-gray-900 → text-gray-900 dark:text-white
text-gray-800 → text-gray-800 dark:text-silver-100
text-gray-700 → text-gray-700 dark:text-silver-200
text-gray-600 → text-gray-600 dark:text-silver-300
text-gray-500 → text-gray-500 dark:text-neutral-400

/* Borders */
border-gray-300 → border-gray-300 dark:border-silver-700/30
border-gray-200 → border-gray-200 dark:border-zinc-800
border-gray-400 → border-gray-400 dark:border-zinc-700

/* Shadows */
shadow-glow-dark → shadow-glow-dark dark:shadow-glow
rgba(0,0,0,0.1) → rgba(0,0,0,0.1) in light, rgba(192,192,192,0.15) in dark
rgba(100,100,100,0.3) → rgba(100,100,100,0.3) in light, rgba(192,192,192,0.3) in dark
```

---

## Critical Files

### Files to CREATE
1. `src/contexts/ThemeContext.tsx` - Core theme infrastructure
2. `src/lib/themeScript.ts` - Prevent FOUC
3. `src/components/ui/ThemeToggle.tsx` - Toggle button UI

### Files to MODIFY
1. `tailwind.config.ts` - Enable dark mode
2. `src/app/globals.css` - Dark mode styles
3. `src/app/layout.tsx` - Integrate provider
4. `src/components/layout/Header.tsx` - Add toggle, update styling
5. `src/components/layout/Footer.tsx` - Update styling
6. `src/components/products/ChromaGrid.tsx` - Complex gradient logic
7. `src/components/ui/Button.tsx` - Update variants
8. `src/components/ui/Modal.tsx` - Update styling
9. `src/components/ui/Card.tsx` - Update styling
10. `src/components/shared/LoadingScreen.tsx` - Update styling
11. `src/components/admin/AdminDashboard.tsx` - Admin theme support
12. All home components (Hero, FeaturedProducts, AboutSection, CTASection)
13. All page files (products, events, about, contact, privacy)

---

## Implementation Timeline

| Phase | Description | Estimated Hours |
|-------|-------------|-----------------|
| 1 | Foundation (Context, Config, Layout) | 4-5 |
| 2 | Toggle UI Component | 2-3 |
| 3 | Layout Components (Header, Footer) | 2-3 |
| 4 | Home Components | 3-4 |
| 5 | Product Components (incl. ChromaGrid) | 5-6 |
| 6 | UI Components | 2-3 |
| 7 | Admin Components | 3-4 |
| 8 | Remaining Pages | 3-4 |
| 9 | Testing & Polish | 4-5 |
| **TOTAL** | **Complete Implementation** | **28-37 hours** |

---

## Verification Steps

### After Phase 1 (Foundation)
1. Open browser console
2. Run: `document.documentElement.classList.toggle('dark')`
3. Verify body background changes between white and black
4. Check localStorage has 'theme' key

### After Phase 2 (Toggle UI)
1. Navigate to home page
2. Click theme toggle in header
3. Verify icon animates and theme switches
4. Refresh page, verify theme persists
5. Try mobile view, verify toggle in mobile menu

### After All Phases
1. **Navigate all pages** in light theme, verify visual correctness
2. **Toggle to dark theme**, verify all pages update
3. **Open admin dashboard**, verify it follows theme
4. **Test ChromaGrid** specifically - inspect gradients
5. **Test on mobile device** or emulator
6. **Check accessibility** with keyboard navigation
7. **Run Lighthouse audit** for performance
8. **Test in different browsers**

---

## Edge Cases & Troubleshooting

### Edge Case: localStorage Unavailable
**Symptom**: Theme doesn't persist
**Solution**: Falls back to system preference, still functional

### Edge Case: JavaScript Disabled
**Symptom**: Toggle doesn't work
**Solution**: Initial theme from script still applies, site remains usable

### Edge Case: System Preference Changes
**Symptom**: Theme changes unexpectedly
**Solution**: Only changes if user hasn't manually set preference (expected behavior)

### Troubleshooting: Flash of Wrong Theme (FOUC)
**Cause**: Theme script not running before React hydration
**Fix**: Verify script in `<head>` of layout.tsx, check `suppressHydrationWarning` on html element

### Troubleshooting: Theme Not Persisting
**Cause**: localStorage not being set
**Fix**: Check browser console for errors, verify localStorage permissions

### Troubleshooting: Components Not Updating
**Cause**: Missing `dark:` variants
**Fix**: Search component for class names, add dark variants using conversion rules

---

## Success Criteria

✅ Toggle button visible and functional in header (desktop + mobile)
✅ Theme persists across page reloads and navigation
✅ No flash of unstyled content on page load
✅ All pages functional and visually correct in both themes
✅ Admin dashboard follows theme toggle
✅ ChromaGrid gradients correct in both themes
✅ All text has sufficient contrast (WCAG AA)
✅ Toggle accessible via keyboard
✅ Performance impact minimal (<2.5KB added)
✅ All tests pass

---

## Notes

- **ChromaGrid is most complex** due to hardcoded RGB values - prioritize early testing
- **Admin components need updates** to follow theme (currently light only)
- **Keep existing CSS classes** (.text-metallic, .text-metallic-light) for conditional use
- **Test thoroughly on mobile** - toggle placement in mobile menu is critical
- **Consider adding** theme preference to user settings/profile in future
- **Monitor bundle size** after implementation to ensure minimal impact

---

## Future Enhancements

### Nice-to-Have Features
1. **Auto theme mode**: Toggle between auto/light/dark (auto follows system)
2. **Theme preview**: Hover toggle to preview without applying
3. **Smooth transitions**: Use CSS View Transitions API for smoother theme changes
4. **Per-page preferences**: Remember theme per route
5. **Custom accent colors**: Allow users to customize theme colors
6. **Analytics**: Track theme preference distribution

### Maintenance
1. **Documentation**: Add theme system to README
2. **Component guidelines**: Document dark mode patterns for new developers
3. **ESLint rule**: Require dark: variants on color classes
4. **Storybook**: Add theme toggle to component stories

---

## Reference Links

- [Tailwind Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [Next.js Themes](https://nextjs.org/docs/pages/building-your-application/configuring/themes)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Web Accessibility Evaluation Tool](https://wave.webaim.org/)
