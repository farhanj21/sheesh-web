export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  currency: 'USD' | 'EUR' | 'GBP'
  images: ProductImage[]
  category: 'mirrors' | 'disco-balls' | 'wall-art' | 'accessories'
  materials?: string[]
  dimensions?: {
    width: number
    height: number
    depth?: number
    unit: 'cm' | 'in'
  }
  featured: boolean
  externalCheckoutUrl: string
  inStock: boolean
  createdAt: string
}

export interface ProductImage {
  src: string
  alt: string
  width: number
  height: number
  isPrimary: boolean
}
