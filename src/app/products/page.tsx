import { ProductGrid } from '@/components/products/ProductGrid'
import { products } from '@/data/products'

export const metadata = {
  title: 'Products - Sheesh',
  description: 'Explore our collection of handcrafted mosaic mirrors, disco balls, and reflective art.',
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h1 className="text-section font-bold text-4xl mb-4">
            <span className="text-silver-shine" data-text="Our Collection">Our Collection</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-center">
            <span className="font-fancy text-gold-shine italic leading-relaxed" data-text="Discover handcrafted reflective art pieces that transform any space into a captivating experience.">
              Discover handcrafted reflective art pieces that transform any space
              into a captivating experience.
            </span>
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  )
}
