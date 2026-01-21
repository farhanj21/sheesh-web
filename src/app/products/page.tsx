import { Metadata } from 'next'
import { generateMetadata as genMeta, pageKeywords } from '@/lib/seo-utils'
import { getVisibleProducts } from '@/lib/products-db'
import { ProductsContent } from '@/components/products/ProductsContent'

export const metadata: Metadata = genMeta({
  title: 'Products',
  description: 'Browse our collection of handcrafted mosaic mirrors, disco balls, wall art, and reflective accessories. Each piece is meticulously crafted to transform your space.',
  path: '/products',
  keywords: pageKeywords.products
})

export default async function ProductsPage() {
  const products = await getVisibleProducts()

  return <ProductsContent initialProducts={products} />
}
