'use client'

import { products } from '@/data/products'
import { FadeIn } from '@/components/animations/FadeIn'
import CircularGallery from './CircularGallery'

export function FeaturedProducts() {
  const featuredProducts = products.filter((p) => p.featured)

  const galleryItems = featuredProducts.map((product) => ({
    image: product.images?.[0]?.src || `https://picsum.photos/seed/${product.id}/800/600`,
    text: product.name
  }))

  return (
    <section className="py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeIn>
          <h2 className="text-3xl font-display font-bold text-center">
            <span className="text-gold-shine" data-text="Signature Pieces">
              Signature Pieces
            </span>
          </h2>
          <p className="text-gray-600 text-lg text-center font-fancy italic"><span className="text-silver-shine" data-text="Handcrafted with precision, designed to captivate">Handcrafted with precision, designed to captivate</span></p>
        </FadeIn>

        <div style={{ height: '500px', position: 'relative', marginTop: '-70px' }}>
          <CircularGallery 
            items={galleryItems}
            bend={3} 
            textColor="#ffffff" 
            borderRadius={0.05} 
            scrollEase={0.02}
          />
        </div>
      </div>
    </section>
  )
}
