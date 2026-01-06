'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { FadeIn } from '@/components/animations/FadeIn'
import { motion } from 'framer-motion'
import { trackProductView, trackProductDetailView, trackProductButtonClick } from '@/lib/analytics'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Track product impression when component mounts
  useEffect(() => {
    trackProductView(product._id, product.name, product.category)
  }, [product._id, product.name, product.category])

  // Track when modal opens (Quick View clicked)
  useEffect(() => {
    if (isModalOpen) {
      trackProductDetailView(product._id, product.name, product.category)
    }
  }, [isModalOpen, product._id, product.name, product.category])

  return (
    <>
      <FadeIn delay={index * 0.1}>
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
          className="group h-full"
        >
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-full flex flex-col border border-neutral-200 hover:shadow-lg transition-shadow duration-300">
            {/* Product Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary-100 to-accent-disco/20">
              <motion.div
                className="absolute inset-0 flex items-center justify-center text-6xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {product.category === 'disco-balls' ? '✨' : '🪞'}
              </motion.div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

              {/* Featured badge */}
              {product.featured && (
                <div className="absolute top-4 right-4 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Featured
                </div>
              )}

              {/* Out of stock overlay */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white text-neutral-900 px-4 py-2 rounded-lg font-semibold">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-500 transition-colors">
                  {product.name}
                </h3>
                <p className="text-neutral-600 text-sm line-clamp-2 mb-4">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary-500">
                    Rs {product.price.toFixed(2)}
                  </div>
                  {product.inStock && product.quantity <= 3 && (
                    <div className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                      Items Left: {product.quantity}
                    </div>
                  )}
                  {product.inStock && product.quantity > 3 && (
                    <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                      In Stock
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1"
                    disabled={!product.inStock}
                  >
                    Quick View
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      trackProductButtonClick('DM To Place Order', product._id, product.name, product.category)
                      window.open(product.externalCheckoutUrl, '_blank')
                    }}
                    className="flex-1"
                    disabled={!product.inStock}
                  >
                    DM To Place Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </FadeIn>

      {/* Quick View Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-8">
          <div className="aspect-square bg-gradient-to-br from-primary-100 to-accent-disco/20 rounded-xl mb-6 flex items-center justify-center text-8xl">
            {product.category === 'disco-balls' ? '✨' : '🪞'}
          </div>

          <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
          <div className="flex items-center justify-between mb-6">
            <div className="text-3xl font-bold text-primary-500">
              Rs {product.price.toFixed(2)}
            </div>
            {product.inStock && product.quantity <= 3 && (
              <div className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-2 rounded">
                Only {product.quantity} items left!
              </div>
            )}
            {product.inStock && product.quantity > 3 && (
              <div className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-2 rounded">
                In Stock
              </div>
            )}
          </div>

          <p className="text-neutral-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          {product.materials && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Materials:</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                {product.materials.map((material) => (
                  <li key={material}>• {material}</li>
                ))}
              </ul>
            </div>
          )}

          {product.dimensions && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Dimensions:</h3>
              <p className="text-sm text-neutral-600">
                {product.dimensions.width} × {product.dimensions.height}
                {product.dimensions.depth && ` × ${product.dimensions.depth}`}{' '}
                {product.dimensions.unit}
              </p>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => {
              trackProductButtonClick('DM To Place Order', product._id, product.name, product.category)
              window.open(product.externalCheckoutUrl, '_blank')
            }}
            disabled={!product.inStock}
          >
            {product.inStock ? 'DM To Place Order' : 'Out of Stock'}
          </Button>
        </div>
      </Modal>
    </>
  )
}
