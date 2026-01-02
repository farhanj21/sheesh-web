import { Product } from '@/types'
import { getDatabase } from './mongodb'

const COLLECTION_NAME = 'products'

export async function getProducts(limit?: number, skip?: number): Promise<Product[]> {
  const db = await getDatabase()
  let query = db.collection<Product>(COLLECTION_NAME)
    .find({}, { 
      projection: { _id: 0 }
    })
    .sort({ createdAt: -1 })
  
  if (skip) query = query.skip(skip)
  if (limit) query = query.limit(limit)
  
  const products = await query.toArray()
  return products as Product[]
}

export async function getVisibleProducts(): Promise<Product[]> {
  const db = await getDatabase()
  const products = await db.collection<Product>(COLLECTION_NAME)
    .find({ visible: true }, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray()
  return products as Product[]
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDatabase()
  const product = await db.collection<Product>(COLLECTION_NAME)
    .findOne({ id }, { projection: { _id: 0 } })
  return product as Product | null
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = await getDatabase()
  const result = await db.collection<Product>(COLLECTION_NAME).findOneAndUpdate(
    { id },
    { $set: updates },
    { returnDocument: 'after', projection: { _id: 0 } }
  )
  return result as Product | null
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
    await ensureIndexes()
    console.log(`Initialized ${defaultProducts.length} products`)
  }
}

export async function ensureIndexes(): Promise<void> {
  const db = await getDatabase()
  const collection = db.collection(COLLECTION_NAME)
  
  await Promise.all([
    collection.createIndex({ id: 1 }, { unique: true }),
    collection.createIndex({ visible: 1 }),
    collection.createIndex({ category: 1 }),
    collection.createIndex({ createdAt: -1 }),
    collection.createIndex({ slug: 1 })
  ])
  
  console.log('Database indexes created')
}

export async function getProductCount(): Promise<number> {
  const db = await getDatabase()
  return await db.collection(COLLECTION_NAME).estimatedDocumentCount()
}
