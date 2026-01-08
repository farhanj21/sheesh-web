export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8 h-4 w-64 bg-zinc-800 rounded animate-pulse"></div>

        {/* Product Content Skeleton */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Image Skeleton */}
          <div>
            <div className="aspect-square bg-zinc-900 rounded-2xl animate-pulse"></div>
            <div className="grid grid-cols-5 gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-square bg-zinc-900 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Right Column - Info Skeleton */}
          <div>
            <div className="mb-4 h-6 w-32 bg-zinc-800 rounded-full animate-pulse"></div>
            <div className="mb-4 h-12 w-3/4 bg-zinc-800 rounded animate-pulse"></div>
            <div className="mb-6 h-10 w-48 bg-zinc-800 rounded animate-pulse"></div>
            <div className="mb-6 h-8 w-40 bg-zinc-800 rounded-lg animate-pulse"></div>

            <div className="mb-8 space-y-3">
              <div className="h-4 w-full bg-zinc-800 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-zinc-800 rounded animate-pulse"></div>
              <div className="h-4 w-4/6 bg-zinc-800 rounded animate-pulse"></div>
            </div>

            <div className="mb-8 p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-28 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="h-4 w-36 bg-zinc-800 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="h-14 w-full bg-zinc-800 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Reviews Section Skeleton */}
        <div className="border-t border-zinc-800 pt-12">
          <div className="h-9 w-48 bg-zinc-800 rounded animate-pulse mb-8"></div>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="h-16 w-24 bg-zinc-800 rounded animate-pulse mx-auto mb-4"></div>
              <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse mx-auto"></div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 w-full bg-zinc-800 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
