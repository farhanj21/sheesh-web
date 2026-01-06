// Analytics event types
export type AnalyticsEventType =
  | 'page_view'
  | 'product_view'
  | 'product_detail_view'
  | 'product_button_click'

export interface AnalyticsEvent {
  id: string
  eventType: AnalyticsEventType
  timestamp: string // ISO 8601 format
  metadata: {
    productId?: string
    productName?: string
    category?: string
    page?: string
    buttonLabel?: string
    url?: string
    referrer?: string
  }
  sessionId: string // Generated client-side for session tracking
  userAgent?: string
}

// Aggregated analytics for admin dashboard
export interface ProductAnalytics {
  productId: string
  productName: string
  viewCount: number
  detailViewCount: number
  dmClickCount: number
  clickThroughRate: number // (dmClickCount / viewCount) * 100
}

export interface CategoryAnalytics {
  category: string
  viewCount: number
}

export interface AnalyticsDateRange {
  startDate: string
  endDate: string
}

export interface PageViewBreakdown {
  page: string
  viewCount: number
}

export interface AnalyticsSummary {
  totalPageViews: number
  pageViewsByPage: PageViewBreakdown[]
  totalProductViews: number
  totalDMClicks: number
  dateRange: AnalyticsDateRange
  topProducts: ProductAnalytics[]
  topCategories: CategoryAnalytics[]
}
