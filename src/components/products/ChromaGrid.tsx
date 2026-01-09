'use client'

import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { Product } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { trackProductView } from '@/lib/analytics'
import { useTheme } from '@/contexts/ThemeContext'

export interface ChromaItem {
  image: string
  title: string
  subtitle: string
  handle?: string
  borderColor?: string
  gradient?: string
  url?: string
}

export interface ChromaGridProps {
  products: Product[]
  className?: string
  radius?: number
  damping?: number
  fadeOut?: number
  ease?: string
}

type SetterFn = (v: number | string) => void

const ChromaGrid: React.FC<ChromaGridProps> = ({
  products,
  className = '',
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const fadeRef = useRef<HTMLDivElement>(null)
  const setX = useRef<SetterFn | null>(null)
  const setY = useRef<SetterFn | null>(null)
  const pos = useRef({ x: 0, y: 0 })
  const router = useRouter()
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

  const items: ChromaItem[] = products.map(product => {
    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]
    const colorScheme = categoryColors[product.category] || categoryColors.mirrors
    
    const stockText = !product.inStock 
      ? 'OUT OF STOCK' 
      : product.quantity <= 3 
        ? `ONLY ${product.quantity} LEFT`
        : 'IN STOCK'

    return {
      image: primaryImage?.src || '/placeholder.jpg',
      title: product.name,
      subtitle: `Rs ${product.price.toFixed(2)}`,
      handle: stockText,
      borderColor: colorScheme.border,
      gradient: colorScheme.gradient,
      url: `/products/${product.slug}`
    }
  })

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    setX.current = gsap.quickSetter(el, '--x', 'px') as SetterFn
    setY.current = gsap.quickSetter(el, '--y', 'px') as SetterFn
    const { width, height } = el.getBoundingClientRect()
    pos.current = { x: width / 2, y: height / 2 }
    setX.current(pos.current.x)
    setY.current(pos.current.y)
  }, [])

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x)
        setY.current?.(pos.current.y)
      },
      overwrite: true
    })
  }

  const handleMove = (e: React.PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect()
    moveTo(e.clientX - r.left, e.clientY - r.top)
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true })
  }

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true
    })
  }

  const handleCardClick = (index: number) => {
    const product = products[index]
    trackProductView(product.id, product.name, product.category)
    router.push(`/products/${product.slug}`)
  }

  const handleCardMove: React.MouseEventHandler<HTMLElement> = e => {
    const c = e.currentTarget as HTMLElement
    const rect = c.getBoundingClientRect()
    c.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    c.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  return (
    <>
      <div
        ref={rootRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className={`relative w-full h-full flex flex-wrap justify-center items-start gap-3 ${className}`}
        style={
          {
            '--r': `${radius}px`,
            '--x': '50%',
            '--y': '50%'
          } as React.CSSProperties
        }
      >
        {items.map((c, i) => (
          <article
            key={i}
            onMouseMove={handleCardMove}
            onClick={() => handleCardClick(i)}
            className="group relative flex flex-col w-[300px] h-[400px] rounded-[20px] overflow-hidden border-2 border-transparent transition-colors duration-300 cursor-pointer"
            style={
              {
                '--card-border': c.borderColor || 'transparent',
                background: c.gradient,
                '--spotlight-color': theme === 'dark' ? 'rgba(192,192,192,0.3)' : 'rgba(100,100,100,0.3)'
              } as React.CSSProperties
            }
          >
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)'
              }}
            />
            <div className="relative z-10 w-full h-[300px] p-[10px] box-border">
              <Image 
                src={c.image} 
                alt={c.title} 
                width={280} 
                height={280} 
                className="w-full h-full object-cover rounded-[10px]" 
              />
            </div>
            <footer className="relative z-10 h-[100px] p-3 text-gray-900 dark:text-white font-sans grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 items-start">
              <h3 className="m-0 text-[1.05rem] font-semibold line-clamp-2">{c.title}</h3>
              {c.handle && <span className="text-[0.95rem] opacity-80 text-right whitespace-nowrap">{c.handle}</span>}
              <p className="m-0 text-[0.85rem] opacity-85">{c.subtitle}</p>
            </footer>
          </article>
        ))}
      </div>
    </>
  )
}

export default ChromaGrid
