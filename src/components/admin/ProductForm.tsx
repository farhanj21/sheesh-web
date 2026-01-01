'use client'

import { useState, useEffect } from 'react'
import { Product, ProductImage } from '@/types'
import { X, Plus, Trash2 } from 'lucide-react'

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
    externalCheckoutUrl: '',
    inStock: true,
    quantity: 0,
    visible: true,
    createdAt: new Date().toISOString().split('T')[0],
  })

  const [materialInput, setMaterialInput] = useState('')
  const [imageInput, setImageInput] = useState({
    src: '',
    alt: '',
    width: 1200,
    height: 1600,
  })

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

  const addMaterial = () => {
    if (materialInput.trim()) {
      setFormData({
        ...formData,
        materials: [...(formData.materials || []), materialInput.trim()],
      })
      setMaterialInput('')
    }
  }

  const removeMaterial = (index: number) => {
    setFormData({
      ...formData,
      materials: formData.materials?.filter((_, i) => i !== index),
    })
  }

  const addImage = () => {
    if (imageInput.src) {
      const newImage: ProductImage = {
        ...imageInput,
        isPrimary: formData.images.length === 0,
      }
      setFormData({
        ...formData,
        images: [...formData.images, newImage],
      })
      setImageInput({ src: '', alt: '', width: 1200, height: 1600 })
    }
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          onClick={onCancel}
          className="text-zinc-400 hover:text-white transition"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Product ID (auto-generated if empty)
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              disabled={!!product}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 disabled:opacity-50"
              placeholder="unique-product-id (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Product Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              placeholder="Classic Disco Ball"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Slug (optional, auto-generated)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              placeholder="classic-disco-ball"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as Product['category'],
                })
              }
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
            >
              <option value="disco-balls">Disco Balls</option>
              <option value="mirrors">Mirrors</option>
              <option value="wall-art">Wall Art</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              placeholder="99.99"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Quantity
            </label>
            <input
              type="number"
              required
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              placeholder="10"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              External Checkout URL
            </label>
            <input
              type="url"
              required
              value={formData.externalCheckoutUrl}
              onChange={(e) =>
                setFormData({ ...formData, externalCheckoutUrl: e.target.value })
              }
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              placeholder="https://example.com/checkout/product"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-5 h-5 bg-zinc-800 border border-zinc-700 rounded"
              />
              <span>Featured</span>
            </label>

            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visible}
                onChange={(e) =>
                  setFormData({ ...formData, visible: e.target.checked })
                }
                className="w-5 h-5 bg-zinc-800 border border-zinc-700 rounded"
              />
              <span>Visible</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Description
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
            placeholder="Detailed product description..."
          />
        </div>

        <div className="border-t border-zinc-800 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Dimensions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Width</label>
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
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Height</label>
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
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Depth</label>
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
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Unit</label>
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
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              >
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Materials</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={materialInput}
              onChange={(e) => setMaterialInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
              className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              placeholder="Add material..."
            />
            <button
              type="button"
              onClick={addMaterial}
              className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
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
        </div>

        <div className="border-t border-zinc-800 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              value={imageInput.src}
              onChange={(e) =>
                setImageInput({ ...imageInput, src: e.target.value })
              }
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              placeholder="Image URL"
            />
            <input
              type="text"
              value={imageInput.alt}
              onChange={(e) =>
                setImageInput({ ...imageInput, alt: e.target.value })
              }
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              placeholder="Alt text"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
            >
              <Plus size={20} className="inline mr-2" />
              Add Image
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden border border-zinc-700"
              >
                <img
                  src={image.src}
                  alt={image.alt}
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

        <div className="flex justify-end gap-4 border-t border-zinc-800 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700 transition border border-zinc-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
          >
            {product ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
