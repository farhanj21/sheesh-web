import { Product } from '@/types'
import { getDatabase } from './mongodb'

const COLLECTION_NAME = 'products'

export async function getProducts(): Promise<Product[]> {
  const db = await getDatabase()
  const products = await db.collection<Product>(COLLECTION_NAME).find({}).toArray()
  return products.map(p => ({ ...p, _id: undefined })) as Product[]
}

export async function getVisibleProducts(): Promise<Product[]> {
  const db = await getDatabase()
  const products = await db.collection<Product>(COLLECTION_NAME).find({ visible: true }).toArray()
  return products.map(p => ({ ...p, _id: undefined })) as Product[]
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDatabase()
  const product = await db.collection<Product>(COLLECTION_NAME).findOne({ id })
  return product ? ({ ...product, _id: undefined } as Product) : null
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = await getDatabase()
  const result = await db.collection<Product>(COLLECTION_NAME).findOneAndUpdate(
    { id },
    { $set: updates },
    { returnDocument: 'after' }
  )
  return result ? ({ ...result, _id: undefined } as Product) : null
}

export async function addProduct(product: Product): Promise<Product> {
  const db = await getDatabase()
  await db.collection<Product>(COLLECTION_NAME).insertOne(product as any)
  return product
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDatabase()
  const result = await db.collection<Product>(COLLECTION_NAME).deleteOne({ id })
  return result.deletedCount === 1
}

export async function initializeProducts(defaultProducts: Product[]): Promise<void> {
  const db = await getDatabase()
  const count = await db.collection(COLLECTION_NAME).countDocuments()
  
  if (count === 0) {
    await db.collection<Product>(COLLECTION_NAME).insertMany(defaultProducts as any)
    console.log(`Initialized ${defaultProducts.length} products`)
  }
}
