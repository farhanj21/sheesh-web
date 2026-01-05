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
  externalCheckoutUrl?: string
  createdAt: string
}

export interface ProductImage {
  src: string
  alt?: string
  width: number
  height: number
  isPrimary: boolean
  isLazyLoad?: boolean // Flag to indicate if image needs to be lazy loaded
}

export interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
  image: string
  gallery: string[]
  createdAt: string
}
