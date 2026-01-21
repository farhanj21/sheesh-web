import { MetadataRoute } from 'next'
import { getVisibleProducts } from '@/lib/products-db'
import { siteConfig } from '@/lib/seo-utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Get all visible products from database
  const products = await getVisibleProducts()

  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamic product pages - filter out any with invalid slugs
  const productPages: MetadataRoute.Sitemap = products
    .filter(product => product.slug && typeof product.slug === 'string')
    .map((product) => {
      // Ensure valid date
      let lastMod: Date
      try {
        lastMod = new Date(product.createdAt)
        // Check if date is valid
        if (isNaN(lastMod.getTime())) {
          lastMod = new Date()
        }
      } catch {
        lastMod = new Date()
      }

      return {
        url: `${baseUrl}/products/${encodeURIComponent(product.slug)}`,
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }
    })

  return [...staticPages, ...productPages]
}
