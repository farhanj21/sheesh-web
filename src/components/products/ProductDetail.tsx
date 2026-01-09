'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { ProductImageGallery } from './ProductImageGallery'
import { ReviewSection } from './ReviewSection'
import { trackProductButtonClick } from '@/lib/analytics'

interface ProductDetailProps {
  product: Product
  isAdmin?: boolean
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  isAdmin = false
}) => {
  const handleOrderClick = () => {
    trackProductButtonClick('DM To Place Order', product.id, product.name, product.category)
    window.open('https://www.instagram.com/sheeshupyourlife/', '_blank')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-600 dark:text-neutral-400">
            <li>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-black dark:hover:text-white transition-colors">
                Products
              </Link>
            </li>
            <li>/</li>
            <li className="text-black dark:text-white">{product.name}</li>
          </ol>
        </nav>

        {/* Product Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Images */}
          <div>
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column - Product Info */}
          <div>
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-neutral-200 text-sm rounded-full capitalize">
                {product.category.replace('-', ' ')}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{product.name}</h1>

            {/* Price */}
            <div className="text-3xl font-bold text-black dark:text-white mb-6">
              Rs {product.price.toFixed(2)}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3 mb-6">
              {product.inStock && product.quantity <= 3 && (
                <div className="text-sm font-semibold text-orange-700 bg-orange-100 px-3 py-2 rounded-lg">
                  Only {product.quantity} left!
                </div>
              )}
              {product.inStock && product.quantity > 3 && (
                <div className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-2 rounded-lg flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  In Stock
                </div>
              )}
              {!product.inStock && (
                <div className="text-sm font-semibold text-red-700 bg-red-100 px-3 py-2 rounded-lg">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">Description</h2>
              <p className="text-gray-600 dark:text-neutral-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details */}
            {((product.materials && product.materials.length > 0) ||
              (product.dimensions && product.dimensions.width > 0 && product.dimensions.height > 0)) && (
              <div className="grid md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-xl">
                {/* Materials */}
                {product.materials && product.materials.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-black dark:text-white">Materials</h3>
                    <ul className="text-gray-600 dark:text-neutral-300 space-y-1 text-sm">
                      {product.materials.map((material, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-gray-400 dark:text-neutral-500 mt-1">•</span>
                          <span>{material}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Dimensions */}
                {product.dimensions && product.dimensions.width > 0 && product.dimensions.height > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-black dark:text-white">Dimensions</h3>
                    <p className="text-gray-600 dark:text-neutral-300 text-sm">
                      {product.dimensions.width} × {product.dimensions.height}
                      {product.dimensions.depth && product.dimensions.depth > 0 && ` × ${product.dimensions.depth}`}{' '}
                      {product.dimensions.unit}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Order Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOrderClick}
              disabled={!product.inStock}
              className="group w-full inline-flex items-center justify-center gap-3 px-6 py-4 text-lg font-bold tracking-wide text-black bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 hover:from-gray-400 hover:via-gray-200 hover:to-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span>{product.inStock ? 'DM To Place Order' : 'Out of Stock'}</span>
              {product.inStock && (
                <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              )}
            </motion.button>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg space-y-3">
              <p className="text-sm text-gray-600 dark:text-neutral-300 flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-400 dark:text-neutral-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Contact us via Instagram to discuss delivery, and payment options.
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-neutral-300 flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>
                  <strong className="text-yellow-700 dark:text-yellow-500">Payment Policy:</strong> 40% of the total price must be paid in advance for order confirmation. Cash on delivery (COD) is available with additional charges calculated separately.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={product.id} productSlug={product.slug} isAdmin={isAdmin} />
      </div>
    </div>
  )
}
