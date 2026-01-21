import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/products-db'
import { getReviewStats } from '@/lib/reviews-db'
import { ProductDetail } from '@/components/products/ProductDetail'
import { getBreadcrumbSchema, getProductSchema, renderJsonLd } from '@/lib/structured-data'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found - Sheesh Mirrorworks',
      description: 'The product you are looking for could not be found.'
    }
  }

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]

  return {
    title: `${product.name} - Sheesh Mirrorworks`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      images: primaryImage ? [primaryImage.src] : [],
      siteName: 'Sheesh Mirrorworks'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: primaryImage ? [primaryImage.src] : []
    },
    alternates: {
      canonical: `/products/${product.slug}`
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Get review stats for aggregate rating
  const reviewStats = await getReviewStats(product.id)

  // Generate structured data schemas
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.name, url: `/products/${product.slug}` }
  ])

  const productSchema = getProductSchema(
    product,
    reviewStats.totalReviews > 0 ? reviewStats : undefined
  )

  // Check if user is admin (for review management features)
  // In a real app, this would check server-side auth
  // For now, we'll pass isAdmin as false and let client-side handle it
  const isAdmin = false

  return (
    <>
      {/* BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJsonLd(breadcrumbSchema)}
      />

      {/* Product Structured Data with AggregateRating */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJsonLd(productSchema)}
      />

      <ProductDetail product={product} isAdmin={isAdmin} />
    </>
  )
}
