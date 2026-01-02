'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { ProductForm } from './ProductForm'
import { ToastContainer, ToastType } from '@/components/ui/Toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

interface Toast {
  id: string
  message: string
  type: ToastType
}

export function StockManager({ token: propToken, onLogout }: { token?: string, onLogout?: () => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [token, setToken] = useState<string | null>(propToken || null)
  const [error, setError] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; productId: string | null }>({
    isOpen: false,
    productId: null,
  })

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token')
    if (propToken) {
      setToken(propToken)
      setIsAuthenticated(true)
      fetchProducts(propToken)
    } else if (savedToken) {
      setToken(savedToken)
      setIsAuthenticated(true)
      fetchProducts(savedToken)
    }
  }, [propToken])

  const showToast = (message: string, type: ToastType) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const login = async () => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        const data = await res.json()
        setToken(data.token)
        localStorage.setItem('admin_token', data.token)
        setIsAuthenticated(true)
        setError('')
        fetchProducts(data.token)
      } else {
        setError('Invalid password')
      }
    } catch (err) {
      setError('Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setToken(null)
    setProducts([])
    if (onLogout) onLogout()
  }

  const fetchProducts = async (authToken: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (res.ok) {
        const data = await res.json()
        console.log('Fetched products:', data)
        setProducts(data.products || data)
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProduct = async (product: Product) => {
    if (!token) return

    try {
      const isNew = !editingProduct
      const url = isNew
        ? '/api/admin/products'
        : `/api/admin/products/${product.id}`

      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      })

      if (res.ok) {
        await fetchProducts(token)
        setShowForm(false)
        setEditingProduct(null)
        showToast(
          isNew ? 'Product created successfully!' : 'Product updated successfully!',
          'success'
        )
      } else {
        showToast('Failed to save product', 'error')
      }
    } catch (err) {
      console.error('Failed to save product:', err)
      showToast('An error occurred while saving the product', 'error')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!token) return

    console.log('Deleting product with ID:', id)

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        await fetchProducts(token)
        showToast('Product deleted successfully!', 'success')
      } else {
        let errorMessage = 'Unknown error'
        try {
          const error = await res.json()
          errorMessage = error.error || errorMessage
        } catch {
          errorMessage = `HTTP ${res.status}: ${res.statusText}`
        }
        console.error('Delete failed:', errorMessage)
        showToast(`Failed to delete product: ${errorMessage}`, 'error')
      }
    } catch (err) {
      console.error('Failed to delete product:', err)
      showToast('An error occurred while deleting the product', 'error')
    } finally {
      setDeleteDialog({ isOpen: false, productId: null })
    }
  }

  const confirmDelete = (id: string) => {
    setDeleteDialog({ isOpen: true, productId: id })
  }

  const toggleVisibility = async (product: Product) => {
    if (!token) return

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ visible: !product.visible }),
      })

      if (res.ok) {
        await fetchProducts(token)
        showToast(
          `Product ${!product.visible ? 'shown' : 'hidden'} successfully!`,
          'success'
        )
      } else {
        showToast('Failed to update visibility', 'error')
      }
    } catch (err) {
      console.error('Failed to update visibility:', err)
      showToast('An error occurred while updating visibility', 'error')
    }
  }

  const updateStock = async (product: Product, quantity: number) => {
    if (!token) return

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          quantity,
          inStock: quantity > 0 
        }),
      })

      if (res.ok) {
        await fetchProducts(token)
        showToast('Stock updated successfully!', 'success')
      } else {
        showToast('Failed to update stock', 'error')
      }
    } catch (err) {
      console.error('Failed to update stock:', err)
      showToast('An error occurred while updating stock', 'error')
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer toasts={toasts} onClose={removeToast} />
        <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-white">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg mb-4 text-white focus:outline-none focus:border-zinc-500"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            onClick={login}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-zinc-200 transition"
          >
            Login
          </button>
        </div>
      </div>
      </>
    )
  }

  if (showForm) {
    return (
      <>
        <ToastContainer toasts={toasts} onClose={removeToast} />
        <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="container mx-auto px-6">
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
          />
        </div>
      </div>
      </>
    )
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => {
          if (deleteDialog.productId) {
            handleDeleteProduct(deleteDialog.productId)
          }
        }}
        onCancel={() => setDeleteDialog({ isOpen: false, productId: null })}
      />
      <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Stock Management</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setEditingProduct(null)
                setShowForm(true)
              }}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-zinc-200 transition"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white py-12">Loading...</div>
        ) : (
          <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-800 text-white">
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">Category</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-center">Stock</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Visible</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-zinc-800 hover:bg-zinc-800/50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.images[0]?.src}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <div className="font-semibold text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-zinc-400">
                              {product.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-zinc-300">
                        Rs {product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) =>
                            updateStock(product, parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-white text-center focus:outline-none focus:border-zinc-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.inStock
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleVisibility(product)}
                          className="text-zinc-400 hover:text-white transition"
                        >
                          {product.visible ? (
                            <Eye size={20} />
                          ) : (
                            <EyeOff size={20} />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product)
                              setShowForm(true)
                            }}
                            className="p-2 text-blue-400 hover:text-blue-300 transition"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => confirmDelete(product.id)}
                            className="p-2 text-red-400 hover:text-red-300 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
