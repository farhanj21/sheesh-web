'use client'

import { AnalyticsEvent, AnalyticsEventType } from '@/types/analytics'

// Session ID generation (persists in sessionStorage)
function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

// Event queue for batching
let eventQueue: AnalyticsEvent[] = []
let batchTimeout: NodeJS.Timeout | null = null
const BATCH_SIZE = 10
const BATCH_DELAY_MS = 5000 // Send batch after 5 seconds of inactivity

/**
 * Send queued events to the server
 */
async function flushEventQueue(): Promise<void> {
  if (eventQueue.length === 0) return

  const eventsToSend = [...eventQueue]
  eventQueue = []

  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: eventsToSend }),
    })
  } catch (error) {
    // Silent failure - don't break user experience
    console.debug('Analytics tracking failed:', error)
  }
}

/**
 * Queue an event for tracking
 */
function queueEvent(event: AnalyticsEvent): void {
  eventQueue.push(event)

  // Send immediately if batch size reached
  if (eventQueue.length >= BATCH_SIZE) {
    if (batchTimeout) clearTimeout(batchTimeout)
    flushEventQueue()
  } else {
    // Schedule batch send
    if (batchTimeout) clearTimeout(batchTimeout)
    batchTimeout = setTimeout(flushEventQueue, BATCH_DELAY_MS)
  }
}

/**
 * Track a generic analytics event
 */
export function trackEvent(
  eventType: AnalyticsEventType,
  metadata: AnalyticsEvent['metadata'] = {}
): void {
  if (typeof window === 'undefined') return

  const event: AnalyticsEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    eventType,
    timestamp: new Date().toISOString(),
    metadata: {
      ...metadata,
      url: window.location.href,
      referrer: document.referrer || undefined,
    },
    sessionId: getSessionId(),
    userAgent: navigator.userAgent,
  }

  queueEvent(event)
}

/**
 * Track page view
 */
export function trackPageView(pageName?: string): void {
  trackEvent('page_view', {
    page: pageName || document.title,
    url: window.location.pathname,
  })
}

/**
 * Track product view (when product appears in list/grid)
 */
export function trackProductView(
  productId: string,
  productName: string,
  category: string
): void {
  trackEvent('product_view', {
    productId,
    productName,
    category,
    page: 'products',
  })
}

/**
 * Track product detail view (when modal/detail page opens)
 */
export function trackProductDetailView(
  productId: string,
  productName: string,
  category: string
): void {
  trackEvent('product_detail_view', {
    productId,
    productName,
    category,
  })
}

/**
 * Track product-specific button click (DM To Place Order)
 */
export function trackProductButtonClick(
  buttonLabel: string,
  productId: string,
  productName: string,
  category: string
): void {
  trackEvent('product_button_click', {
    buttonLabel,
    productId,
    productName,
    category,
    page: window.location.pathname,
  })
}

/**
 * Flush remaining events (call on page unload)
 */
export function flushAnalytics(): void {
  if (eventQueue.length > 0) {
    // Use sendBeacon for reliable unload tracking
    if (navigator.sendBeacon && eventQueue.length > 0) {
      const blob = new Blob([JSON.stringify({ events: eventQueue })], {
        type: 'application/json',
      })
      navigator.sendBeacon('/api/analytics/track', blob)
      eventQueue = []
    } else {
      flushEventQueue()
    }
  }
}

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushAnalytics)
  window.addEventListener('pagehide', flushAnalytics)
}
