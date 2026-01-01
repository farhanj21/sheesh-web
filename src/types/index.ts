export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  currency: 'PKR' | 'EUR' | 'GBP'
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
  inStock: boolean
  quantity: number
  visible: boolean
  createdAt: string
}

export interface ProductImage {
  src: string
  alt?: string
  width: number
  height: number
  isPrimary: boolean
}
