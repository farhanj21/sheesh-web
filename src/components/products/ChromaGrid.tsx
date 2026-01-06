'use client'

import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { Product } from '@/types'
import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { trackProductView, trackProductButtonClick } from '@/lib/analytics'

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Convert products to ChromaItem format
  const categoryColors: Record<string, { border: string; gradient: string }> = {
    mirrors: {
      border: '#C0C0C0',
      gradient: 'linear-gradient(145deg, #C0C0C0, #000)'
    },
    'disco-balls': {
      border: '#FFD700',
      gradient: 'linear-gradient(180deg, #FFD700, #000)'
    },
    'wall-art': {
      border: '#8B5CF6',
      gradient: 'linear-gradient(225deg, #8B5CF6, #000)'
    },
    accessories: {
      border: '#10B981',
      gradient: 'linear-gradient(210deg, #10B981, #000)'
    }
  }

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
    trackProductView(product._id, product.name, product.category)
    setSelectedProduct(product)
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
                '--spotlight-color': 'rgba(255,255,255,0.3)'
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
            <footer className="relative z-10 h-[100px] p-3 text-white font-sans grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 items-start">
              <h3 className="m-0 text-[1.05rem] font-semibold line-clamp-2">{c.title}</h3>
              {c.handle && <span className="text-[0.95rem] opacity-80 text-right whitespace-nowrap">{c.handle}</span>}
              <p className="m-0 text-[0.85rem] opacity-85">{c.subtitle}</p>
            </footer>
          </article>
        ))}
      </div>

      {/* Product Detail Modal */}
{selectedProduct && (
  <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
    <div className="bg-black text-white rounded-2xl p-6 max-w-lg w-full">
      {/* Image Section */}
      <div className="aspect-square bg-gradient-to-br from-primary-100 to-accent-disco/20 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
        {selectedProduct.images.length > 0 ? (
          <Image 
            src={selectedProduct.images.find(img => img.isPrimary)?.src || selectedProduct.images[0].src} 
            alt={selectedProduct.name}
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-8xl">
            {selectedProduct.category === 'disco-balls' ? '✨' : '🪞'}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
        <div className="text-xl font-bold text-primary-400 whitespace-nowrap ml-4">
          Rs {selectedProduct.price.toFixed(2)}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        {selectedProduct.inStock && selectedProduct.quantity <= 3 && (
          <div className="text-xs font-semibold text-orange-400 bg-orange-950 px-2 py-1 rounded">
            Only {selectedProduct.quantity} left!
          </div>
        )}
        {selectedProduct.inStock && selectedProduct.quantity > 3 && (
          <div className="text-xs font-semibold text-green-400 bg-green-950 px-2 py-1 rounded">
            In Stock
          </div>
        )}
        {!selectedProduct.inStock && (
          <div className="text-xs font-semibold text-red-400 bg-red-950 px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>

      <p className="text-neutral-300 text-sm mb-3 leading-relaxed line-clamp-3">
        {selectedProduct.description}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        {selectedProduct.materials && selectedProduct.materials.length > 0 && (
          <div>
            <h3 className="font-semibold mb-1 text-white text-xs">Materials</h3>
            <ul className="text-neutral-300 space-y-0.5 text-xs">
              {selectedProduct.materials.slice(0, 3).map((material) => (
                <li key={material}>• {material}</li>
              ))}
            </ul>
          </div>
        )}

        {selectedProduct.dimensions && selectedProduct.dimensions.width > 0 && selectedProduct.dimensions.height > 0 && (
          <div>
            <h3 className="font-semibold mb-1 text-white text-xs">Dimensions</h3>
            <p className="text-neutral-300 text-xs">
              {selectedProduct.dimensions.width} × {selectedProduct.dimensions.height}
              {selectedProduct.dimensions.depth && ` × ${selectedProduct.dimensions.depth}`}{' '}
              {selectedProduct.dimensions.unit}
            </p>
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="group w-full inline-flex items-center justify-center gap-3 px-2 py-2 text-md font-fancy tracking-wide text-black bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 hover:from-gray-400 hover:via-gray-200 hover:to-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => {
          trackProductButtonClick('DM To Place Order', selectedProduct._id, selectedProduct.name, selectedProduct.category)
          window.open('https://www.instagram.com/sheeshupyourlife/', '_blank')
        }}
        disabled={!selectedProduct.inStock}
      >
        <span>{selectedProduct.inStock ? 'DM To Place Order' : 'Out of Stock'}</span>
        <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-black/20 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
      </motion.button>
    </div>
  </Modal>
)}
    </>
  )
}

export default ChromaGrid
