'use client'

import { useState, useEffect, useRef } from 'react'
import { Product, ProductImage } from '@/types'
import { X, Plus, Trash2, Upload } from 'lucide-react'

interface ProductFormProps {
  product: Product | null
  onSave: (product: Product) => void
  onCancel: () => void
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    slug: '',
    description: '',
    price: 0,
    currency: 'PKR',
    images: [],
    category: 'disco-balls',
    materials: [],
    dimensions: { width: 0, height: 0, depth: 0, unit: 'cm' },
    featured: false,
    inStock: true,
    quantity: 0,
    visible: true,
    createdAt: new Date().toISOString().split('T')[0],
  })

  // const [materialInput, setMaterialInput] = useState('')
  const [imageInput, setImageInput] = useState({
    src: '',
    width: 1200,
    height: 1600,
  })
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (product) {
      setFormData(product)
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
    const id = formData.id || `${slug}-${Date.now()}`
    
    onSave({
      ...formData,
      id,
      slug,
      inStock: formData.quantity > 0,
    })
  }

  // const addMaterial = () => {
  //   if (materialInput.trim()) {
  //     setFormData({
  //       ...formData,
  //       materials: [...(formData.materials || []), materialInput.trim()],
  //     })
  //     setMaterialInput('')
  //   }
  // }

  // const removeMaterial = (index: number) => {
  //   setFormData({
  //     ...formData,
  //     materials: formData.materials?.filter((_, i) => i !== index),
  //   })
  // }

  const addImage = () => {
    if (imageInput.src) {
      const newImage: ProductImage = {
        ...imageInput,
        isPrimary: formData.images.length === 0,
        alt: ''
      }
      setFormData({
        ...formData,
        images: [...formData.images, newImage],
      })
      setImageInput({ src: '', width: 1200, height: 1600 })
    }
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
          }

          // Max dimensions
          const MAX_WIDTH = 1920
          const MAX_HEIGHT = 1920
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob failed'))
                return
              }
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            },
            'image/jpeg',
            0.85 // Compression quality
          )
        }
        img.onerror = () => reject(new Error('Image load failed'))
      }
      reader.onerror = () => reject(new Error('FileReader failed'))
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        // Compress image before upload
        const compressedFile = await compressImage(file)
        
        // Check size (Vercel limit is ~4.5MB)
        if (compressedFile.size > 4 * 1024 * 1024) {
          alert(`Image ${file.name} is too large even after compression. Please use a smaller image.`)
          continue
        }

        const formDataUpload = new FormData()
        formDataUpload.append('file', compressedFile)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        })
        
        if (!response.ok) {
          throw new Error('Upload failed')
        }
        
        const { url, width, height } = await response.json()
        
        const newImage: ProductImage = {
          src: url,
          isPrimary: formData.images.length === 0,
          width: width || 1200,
          height: height || 1600,
        }
        
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, newImage],
        }))
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-black transition"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Product ID (auto-generated if empty)
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              disabled={!!product}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400 disabled:opacity-50"
              placeholder="unique-product-id (optional)"
            />
          </div> */}

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Product Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400"
              placeholder="Enter product name here"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Slug (optional, auto-generated)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400"
              placeholder="classic-disco-ball"
            />
          </div> */}

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Category
            </label>
              <div className="relative w-full">
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as Product['category'],
                    })
                  }
                  className="w-full appearance-none px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400"
                >
                  <option value="disco-balls">Disco Balls</option>
                  <option value="mirrors">Mirrors</option>
                  <option value="wall-art">Wall Art</option>
                  <option value="accessories">Accessories</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Price <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price || ''}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400"
              placeholder="Enter price here"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Quantity <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              required
              value={formData.quantity || ''}
              onChange={(e) =>
                setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400"
              placeholder="Enter quantity here"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-black cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-5 h-5 bg-white border border-gray-300 rounded"
              />
              <span>Featured</span>
            </label>

            <label className="flex items-center gap-2 text-black cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visible}
                onChange={(e) =>
                  setFormData({ ...formData, visible: e.target.checked })
                }
                className="w-5 h-5 bg-white border border-gray-300 rounded"
              />
              <span>Visible</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400"
            placeholder="Enter description here"
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-black mb-4">Dimensions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">Width</label>
              <input
                type="number"
                value={formData.dimensions?.width || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dimensions: {
                      ...formData.dimensions!,
                      width: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Height</label>
              <input
                type="number"
                value={formData.dimensions?.height || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dimensions: {
                      ...formData.dimensions!,
                      height: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Depth</label>
              <input
                type="number"
                value={formData.dimensions?.depth || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dimensions: {
                      ...formData.dimensions!,
                      depth: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Unit</label>
            <div className="relative w-full">
              <select
                value={formData.dimensions?.unit || 'cm'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dimensions: {
                      ...formData.dimensions!,
                      unit: e.target.value as 'cm' | 'in',
                    },
                  })
                }
                className="w-full appearance-none px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400"
              >
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>

              {/* Custom chevron */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-black mb-4">Materials</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={materialInput}
              onChange={(e) => setMaterialInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400"
              placeholder="Add material..."
            />
            <button
              type="button"
              onClick={addMaterial}
              className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.materials?.map((material, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full text-white"
              >
                <span>{material}</span>
                <button
                  type="button"
                  onClick={() => removeMaterial(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div> */}

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-black mb-4">Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              value={imageInput.src}
              onChange={(e) =>
                setImageInput({ ...imageInput, src: e.target.value })
              }
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400"
              placeholder="Enter image URL here"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              <Plus size={20} className="inline mr-2" />
              Add URL
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-gray-100 text-black rounded-lg font-semibold hover:bg-gray-200 transition border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={20} className="inline mr-2" />
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden border border-gray-300"
              >
                <img
                  src={image.src}
                  alt=""
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 size={16} />
                </button>
                {image.isPrimary && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-100 text-black rounded-lg font-semibold hover:bg-gray-200 transition border border-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {product ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
