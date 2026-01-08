'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ProductImage } from '@/types'
import { ImageGallery } from '@/components/events/ImageGallery'

interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">🪞</div>
          <p className="text-neutral-400">No images available</p>
        </div>
      </div>
    )
  }

  const currentImage = images[selectedIndex]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative aspect-square bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl overflow-hidden cursor-pointer group"
        onClick={() => setIsFullscreenOpen(true)}
      >
        <Image
          src={currentImage.src}
          alt={currentImage.alt || productName}
          width={currentImage.width}
          height={currentImage.height}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          priority={selectedIndex === 0}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 px-6 py-3 rounded-full flex items-center gap-2">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
            <span className="text-white font-medium">View Full Size</span>
          </div>
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? 'border-gray-300 scale-105 shadow-lg'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:border-zinc-700'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt || `${productName} ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Gallery */}
      <ImageGallery
        images={images.map(img => img.src)}
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        initialIndex={selectedIndex}
      />
    </div>
  )
}
