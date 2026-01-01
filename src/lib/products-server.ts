import { Product } from '@/types'
import fs from 'fs'
import path from 'path'

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json')

function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

export const defaultProducts: Product[] = [
  {
    id: 'disco-ball-classic-30cm',
    name: 'Classic Disco Balls',
    slug: 'classic-disco-ball-30cm',
    description:
      'Handcrafted mirror ball with premium reflective tiles. Perfect for creating an enchanting atmosphere in any space. Each tile is individually placed to ensure maximum light reflection and stunning visual effects.',
    price: 129.99,
    currency: 'USD',
    images: [
      {
        src: '/images/products/double-ball.jpeg',
        alt: 'Classic 30cm disco ball hanging in modern living room',
        width: 1200,
        height: 1600,
        isPrimary: true,
      },
    ],
    category: 'disco-balls',
    materials: ['Mirror glass', 'Foam core', 'Metal hanging fixture'],
    dimensions: { width: 30, height: 30, depth: 30, unit: 'cm' },
    featured: true,
    externalCheckoutUrl: 'https://example.com/checkout/disco-ball-30cm',
    inStock: true,
    quantity: 15,
    visible: true,
    createdAt: '2025-01-15',
  },
  {
    id: 'mosaic-mirror-hexagon',
    name: 'Mini Classic Disco Balls',
    slug: 'mini-classic-disco-balls',
    description:
      'Contemporary hexagonal mirror featuring hand-placed mosaic tiles in a stunning geometric pattern. A statement piece that adds depth and light to any room.',
    price: 189.99,
    currency: 'USD',
    images: [
      {
        src: '/images/products/mini-balls.jpeg',
        alt: 'Hexagonal mosaic mirror on white wall',
        width: 1200,
        height: 1600,
        isPrimary: true,
      },
    ],
    category: 'mirrors',
    materials: ['Mirror glass', 'MDF backing', 'Mosaic tiles'],
    dimensions: { width: 60, height: 70, depth: 3, unit: 'cm' },
    featured: true,
    externalCheckoutUrl: 'https://example.com/checkout/hexagon-mirror',
    inStock: true,
    quantity: 8,
    visible: true,
    createdAt: '2025-01-10',
  },
  {
    id: 'shiny-stickers',
    name: 'Shiny Stickers',
    slug: 'shiny-stickers',
    description:
      'Compact disco ball perfect for smaller spaces or as decorative accents. Features the same premium craftsmanship as our larger pieces in a more intimate size.',
    price: 79.99,
    currency: 'USD',
    images: [
      {
        src: '/images/products/stickers.jpeg',
        alt: 'Small 20cm disco ball in bedroom setting',
        width: 1200,
        height: 1600,
        isPrimary: true,
      },
    ],
    category: 'disco-balls',
    materials: ['Mirror glass', 'Foam core', 'Metal hanging fixture'],
    dimensions: { width: 20, height: 20, depth: 20, unit: 'cm' },
    featured: true,
    externalCheckoutUrl: 'https://example.com/checkout/disco-ball-20cm',
    inStock: true,
    quantity: 25,
    visible: true,
    createdAt: '2025-01-12',
  },
  {
    id: 'wall-art-sunset',
    name: 'Mosaic Wall Art & Beads',
    slug: 'mosaic-wall-art-beads',
    description:
      'Breathtaking wall art piece featuring gradient mosaic tiles that capture the warm hues of a sunset. A unique focal point for any living space.',
    price: 249.99,
    currency: 'USD',
    images: [
      {
        src: '/images/products/beads.jpeg',
        alt: 'Mosaic wall art with sunset gradient colors',
        width: 1200,
        height: 1600,
        isPrimary: true,
      },
    ],
    category: 'wall-art',
    materials: ['Glass mosaic tiles', 'Wood backing', 'Hanging hardware'],
    dimensions: { width: 80, height: 60, depth: 2, unit: 'cm' },
    featured: true,
    externalCheckoutUrl: 'https://example.com/checkout/sunset-wall-art',
    inStock: true,
    quantity: 5,
    visible: true,
    createdAt: '2025-01-08',
  },
  {
    id: 'random-art',
    name: 'Miscellaneous Art Pieces',
    slug: 'random-art',
    description:
      'Breathtaking wall art pieces featuring gradient mosaic tiles that capture the warm hues of a sunset. Unique focal points for any living space.',
    price: 249.99,
    currency: 'USD',
    images: [
      {
        src: '/images/products/miscellaneous.jpeg',
        alt: 'Mosaic wall art with sunset gradient colors',
        width: 1200,
        height: 1600,
        isPrimary: true,
      },
    ],
    category: 'wall-art',
    materials: ['Glass mosaic tiles', 'Wood backing', 'Hanging hardware'],
    dimensions: { width: 80, height: 60, depth: 2, unit: 'cm' },
    featured: true,
    externalCheckoutUrl: 'https://example.com/checkout/sunset-wall-art',
    inStock: true,
    quantity: 12,
    visible: true,
    createdAt: '2025-01-08',
  },
]

export function loadProductsFromFile(): Product[] {
  try {
    ensureDataDir()
    if (fs.existsSync(PRODUCTS_FILE)) {
      const fileData = fs.readFileSync(PRODUCTS_FILE, 'utf-8')
      return JSON.parse(fileData)
    }
  } catch (error) {
    console.error('Error loading products from file:', error)
  }
  return defaultProducts
}

export function saveProductsToFile(products: Product[]) {
  try {
    ensureDataDir()
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving products to file:', error)
  }
}

let productsCache: Product[] | null = null

export function getProducts() {
  if (!productsCache) {
    productsCache = loadProductsFromFile()
  }
  return productsCache
}

export function getVisibleProducts() {
  return getProducts().filter(p => p.visible)
}

export function updateProduct(id: string, updates: Partial<Product>) {
  const products = getProducts()
  const index = products.findIndex(p => p.id === id)
  if (index !== -1) {
    products[index] = { ...products[index], ...updates }
    saveProductsToFile(products)
    productsCache = products
    return products[index]
  }
  return null
}

export function addProduct(product: Product) {
  const products = getProducts()
  products.push(product)
  saveProductsToFile(products)
  productsCache = products
  return product
}

export function deleteProduct(id: string) {
  const products = getProducts()
  const index = products.findIndex(p => p.id === id)
  if (index !== -1) {
    products.splice(index, 1)
    saveProductsToFile(products)
    productsCache = products
    return true
  }
  return false
}
