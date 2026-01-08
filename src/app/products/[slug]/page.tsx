import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/products-db'
import { ProductDetail } from '@/components/products/ProductDetail'

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

  // Check if user is admin (for review management features)
  // In a real app, this would check server-side auth
  // For now, we'll pass isAdmin as false and let client-side handle it
  const isAdmin = false

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
              url: `https://sheeshmirrorworks.com/products/${product.slug}`
            },
            brand: {
              '@type': 'Brand',
              name: 'Sheesh Mirrorworks'
            },
            category: product.category
          })
        }}
      />

      <ProductDetail product={product} isAdmin={isAdmin} />
    </>
  )
}
