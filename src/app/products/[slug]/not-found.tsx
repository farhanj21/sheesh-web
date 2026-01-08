import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-neutral-400 mb-8">
          Sorry, we couldn&apos;t find the product you&apos;re looking for. It may have been removed or the link might be incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 hover:from-gray-400 hover:via-gray-200 hover:to-gray-400 text-black font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
          >
            Browse All Products
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-neutral-300 rounded-full transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
