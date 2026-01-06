import { getDatabase } from './mongodb'
import {
  AnalyticsEvent,
  AnalyticsSummary,
  ProductAnalytics,
  CategoryAnalytics,
} from '@/types/analytics'

const COLLECTION_NAME = 'analytics'

/**
 * Track a single analytics event
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  const db = await getDatabase()
  await db.collection<AnalyticsEvent>(COLLECTION_NAME).insertOne(event as any)
}

/**
 * Track multiple analytics events (batch insert)
 */
export async function trackEventsBatch(events: AnalyticsEvent[]): Promise<void> {
  if (events.length === 0) return
  const db = await getDatabase()
  await db.collection<AnalyticsEvent>(COLLECTION_NAME).insertMany(events as any)
}

/**
 * Get analytics summary for a date range
 */
export async function getAnalyticsSummary(
  startDate: string,
  endDate: string
): Promise<AnalyticsSummary> {
  const db = await getDatabase()
  const collection = db.collection<AnalyticsEvent>(COLLECTION_NAME)

  // Date filter for all queries
  const dateFilter = {
    timestamp: {
      $gte: startDate,
      $lte: endDate,
    },
  }

  // Aggregate total page views
  const totalPageViews = await collection.countDocuments({
    ...dateFilter,
    eventType: 'page_view',
  })

  // Aggregate total product views
  const totalProductViews = await collection.countDocuments({
    ...dateFilter,
    eventType: { $in: ['product_view', 'product_detail_view'] },
  })

  // Aggregate total DM clicks
  const totalDMClicks = await collection.countDocuments({
    ...dateFilter,
    eventType: 'product_button_click',
    'metadata.buttonLabel': { $regex: /DM.*Order/i },
  })

  // Get top products by views
  const topProductsAgg = await collection
    .aggregate([
      {
        $match: {
          ...dateFilter,
          eventType: { $in: ['product_view', 'product_detail_view'] },
          'metadata.productId': { $exists: true },
        },
      },
      {
        $group: {
          _id: '$metadata.productId',
          productName: { $first: '$metadata.productName' },
          viewCount: { $sum: 1 },
        },
      },
      { $sort: { viewCount: -1 } },
      { $limit: 10 },
    ])
    .toArray()

  // Get DM clicks per product for CTR calculation
  const dmClicksAgg = await collection
    .aggregate([
      {
        $match: {
          ...dateFilter,
          eventType: 'product_button_click',
          'metadata.buttonLabel': { $regex: /DM.*Order/i },
          'metadata.productId': { $exists: true },
        },
      },
      {
        $group: {
          _id: '$metadata.productId',
          dmClickCount: { $sum: 1 },
        },
      },
    ])
    .toArray()

  // Map DM clicks by productId for easy lookup
  const dmClicksMap = new Map(
    dmClicksAgg.map((item) => [item._id, item.dmClickCount])
  )

  // Combine product data with DM clicks
  const topProducts: ProductAnalytics[] = topProductsAgg.map((item) => {
    const dmClicks = dmClicksMap.get(item._id) || 0
    return {
      productId: item._id,
      productName: item.productName || 'Unknown',
      viewCount: item.viewCount,
      detailViewCount: 0, // Can be enhanced later
      dmClickCount: dmClicks,
      clickThroughRate: item.viewCount > 0 ? (dmClicks / item.viewCount) * 100 : 0,
    }
  })

  // Get top categories
  const topCategoriesAgg = await collection
    .aggregate([
      {
        $match: {
          ...dateFilter,
          eventType: { $in: ['product_view', 'product_detail_view'] },
          'metadata.category': { $exists: true },
        },
      },
      {
        $group: {
          _id: '$metadata.category',
          viewCount: { $sum: 1 },
        },
      },
      { $sort: { viewCount: -1 } },
      { $limit: 10 },
    ])
    .toArray()

  const topCategories: CategoryAnalytics[] = topCategoriesAgg.map((item) => ({
    category: item._id,
    viewCount: item.viewCount,
  }))

  return {
    totalPageViews,
    totalProductViews,
    totalDMClicks,
    dateRange: { startDate, endDate },
    topProducts,
    topCategories,
  }
}

/**
 * Create database indexes for optimal query performance
 */
export async function ensureAnalyticsIndexes(): Promise<void> {
  const db = await getDatabase()
  const collection = db.collection(COLLECTION_NAME)

  await Promise.all([
    collection.createIndex({ timestamp: -1 }), // Most queries filter by date
    collection.createIndex({ eventType: 1 }), // Filter by event type
    collection.createIndex({ 'metadata.productId': 1 }), // Product-specific queries
    collection.createIndex({ 'metadata.category': 1 }), // Category queries
    collection.createIndex({ sessionId: 1 }), // Session-based analysis (future)
    collection.createIndex({ timestamp: -1, eventType: 1 }), // Compound index for common queries
  ])

  console.log('Analytics indexes created')
}

/**
 * Get total event count (for testing/admin purposes)
 */
export async function getAnalyticsCount(): Promise<number> {
  const db = await getDatabase()
  return await db.collection(COLLECTION_NAME).estimatedDocumentCount()
}

/**
 * Delete old analytics data (for GDPR compliance / data retention)
 */
export async function deleteOldAnalytics(daysToKeep: number = 90): Promise<number> {
  const db = await getDatabase()
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

  const result = await db.collection(COLLECTION_NAME).deleteMany({
    timestamp: { $lt: cutoffDate.toISOString() },
  })

  return result.deletedCount
}
