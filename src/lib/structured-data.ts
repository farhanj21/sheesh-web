import { siteConfig } from './seo-utils'
import type { Event, Product, ReviewStats } from '@/types'
import type { WithContext, Organization, LocalBusiness, BreadcrumbList, Event as SchemaEvent, Product as SchemaProduct, AggregateRating } from 'schema-dts'

// Organization Schema for the company
export function getOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description: siteConfig.description,
    founder: {
      '@type': 'Person',
      name: siteConfig.founder
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: 'Customer Service'
    },
    sameAs: [
      siteConfig.social.instagram,
    ]
  }
}

// LocalBusiness Schema for contact page
export function getLocalBusinessSchema(): WithContext<LocalBusiness> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.name,
    image: `${siteConfig.url}/images/og-image.jpg`,
    '@id': siteConfig.url,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: 'PKR 1000-100000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '20:00'
      }
    ],
    sameAs: [
      siteConfig.social.instagram,
    ]
  }
}

// BreadcrumbList Schema for navigation
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteConfig.url}${item.url}`
    }))
  }
}

// Event Schema for events page
export function getEventSchema(event: Event): WithContext<SchemaEvent> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date,
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteConfig.address.addressLocality,
        addressCountry: siteConfig.address.addressCountry
      }
    },
    description: event.description,
    image: event.image.startsWith('http') ? event.image : `${siteConfig.url}${event.image}`,
    organizer: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url
    }
  }
}

// Product Schema with optional AggregateRating
export function getProductSchema(
  product: Product,
  reviewStats?: ReviewStats
): WithContext<SchemaProduct> {
  const schema: WithContext<SchemaProduct> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(img => img.src),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${siteConfig.url}/products/${product.slug}`
    },
    brand: {
      '@type': 'Brand',
      name: siteConfig.name
    },
    category: product.category
  }

  // Add aggregate rating if reviews exist
  if (reviewStats && reviewStats.totalReviews > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: reviewStats.averageRating,
      reviewCount: reviewStats.totalReviews,
      bestRating: 5,
      worstRating: 1
    }
  }

  return schema
}

// Helper to render JSON-LD script tag
export function renderJsonLd(data: WithContext<any>) {
  return {
    __html: JSON.stringify(data)
  }
}
