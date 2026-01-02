import { ensureIndexes } from '../src/lib/products-db'

async function setupIndexes() {
  try {
    console.log('Setting up database indexes...')
    await ensureIndexes()
    console.log('✅ Indexes created successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to create indexes:', error)
    process.exit(1)
  }
}

setupIndexes()
