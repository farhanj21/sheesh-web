'use client'

import { useState, useEffect, useCallback } from 'react'
import { ProductGrid } from '@/components/products/ProductGrid'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { Product } from '@/types'
import { trackPageView } from '@/lib/analytics'
import { ToastContainer, ToastType } from '@/components/ui/Toast'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType, duration?: number) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  useEffect(() => {
    // Track page view and show disclaimer toast
    trackPageView('Products')
    const id = `${Date.now()}-${Math.random()}`
    setToasts([{ id, message: 'Note: Please DM us on Instagram to place orders!', type: 'info', duration: 5000 }])

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (isLoading) {
    return <LoadingScreen pageName="Products" />
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h1 className="text-section font-bold text-4xl mb-4">
              <span className="text-black dark:text-white" data-text="Our Collection">Our Collection</span>
            </h1>
            <p className="text-xl max-w-5xl mx-auto text-center">
              <span className="text-gray-600 dark:text-gray-400 italic leading-relaxed lg:whitespace-nowrap" data-text="Discover handcrafted reflective art pieces that transform any space into a captivating experience.">
                Discover handcrafted reflective art pieces that transform any space into a captivating experience.
              </span>
            </p>
          </div>

          <ProductGrid products={products} />
        </div>
      </div>
    </>
  )
}
