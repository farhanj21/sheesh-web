/**
 * Setup MongoDB indexes for analytics collection
 * Run with: npm run setup-analytics-indexes
 */

import { getDatabase } from '../src/lib/db'

const COLLECTION_NAME = 'analytics'

async function setupIndexes() {
  console.log('Setting up analytics collection indexes...')

  try {
    const db = await getDatabase()
    const collection = db.collection(COLLECTION_NAME)

    // Create indexes
    const indexes = [
      {
        key: { timestamp: -1 },
        name: 'timestamp_desc',
        background: true,
      },
      {
        key: { eventType: 1 },
        name: 'eventType_asc',
        background: true,
      },
      {
        key: { 'metadata.productId': 1 },
        name: 'metadata_productId_asc',
        background: true,
      },
      {
        key: { 'metadata.category': 1 },
        name: 'metadata_category_asc',
        background: true,
      },
      {
        key: { sessionId: 1 },
        name: 'sessionId_asc',
        background: true,
      },
      {
        key: { timestamp: -1, eventType: 1 },
        name: 'timestamp_eventType_compound',
        background: true,
      },
    ]

    console.log(`Creating ${indexes.length} indexes...`)

    for (const index of indexes) {
      try {
        await collection.createIndex(index.key, {
          name: index.name,
          background: index.background,
        })
        console.log(`✓ Created index: ${index.name}`)
      } catch (err) {
        console.error(`✗ Failed to create index ${index.name}:`, err)
      }
    }

    // List all indexes
    const existingIndexes = await collection.listIndexes().toArray()
    console.log('\nExisting indexes:')
    existingIndexes.forEach((idx) => {
      console.log(`  - ${idx.name}`)
    })

    console.log('\n✅ Analytics indexes setup complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to setup indexes:', error)
    process.exit(1)
  }
}

setupIndexes()
