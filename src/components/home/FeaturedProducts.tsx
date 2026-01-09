'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import { FadeIn } from '@/components/animations/FadeIn'
import CircularGallery from './CircularGallery'

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(products => {
        setFeaturedProducts(products.filter((p: Product) => p.featured))
      })
      .catch(err => console.error('Failed to load products:', err))
  }, [])

  const galleryItems = featuredProducts.map((product) => ({
    image: product.images?.[0]?.src || `https://picsum.photos/seed/${product.id}/800/600`,
    text: product.name
  }))

  return (
    <section className="py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeIn>
          <h2 className="text-3xl font-display font-bold text-center">
            <span className="text-gray-800">
              Signature Pieces
            </span>
          </h2>
          <p className="text-gray-600 text-lg text-center italic"><span className="text-gray-900">Handcrafted with precision, designed to captivate</span></p>
        </FadeIn>

        {galleryItems.length > 0 && (
          <div style={{ height: '500px', position: 'relative', marginTop: '-70px' }}>
            <CircularGallery
              items={galleryItems}
              bend={3}
              textColor="#111827"
              borderRadius={0.05}
              scrollEase={0.02}
              font="bold 30px HK Grotesk"
            />
          </div>
        )}
      </div>
    </section>
  )
}
