'use client'

import { Product } from '@/types'
import ChromaGrid from './ChromaGrid'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-neutral-600">No products found.</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '600px', position: 'relative' }}>
      <ChromaGrid 
        products={products}
        radius={300}
        damping={0.45}
        fadeOut={0.6}
        ease="power3.out"
      />
    </div>
  )
}
