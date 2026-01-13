'use client'

import { useState, useEffect } from 'react'
import { AboutContent } from '@/types'
import { AboutForm } from './AboutForm'
import { ToastContainer, ToastType } from '@/components/ui/Toast'
import { FileText } from 'lucide-react'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface AboutManagerProps {
  token: string
}

export function AboutManager({ token }: AboutManagerProps) {
  const [content, setContent] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    fetchContent()
  }, [token])

  const showToast = (message: string, type: ToastType) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/about', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setContent(data)
      } else {
        console.error('Failed to fetch about content:', res.statusText)
        showToast('Failed to load content', 'error')
      }
    } catch (err) {
      console.error('Failed to fetch about content:', err)
      showToast('Failed to load content', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (updates: Partial<AboutContent>) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      if (res.ok) {
        const updatedContent = await res.json()
        setContent(updatedContent)
        showToast('About page content updated successfully!', 'success')
      } else {
        const error = await res.json()
        showToast(error.error || 'Failed to save changes', 'error')
      }
    } catch (err) {
      console.error('Failed to save about content:', err)
      showToast('An error occurred while saving', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="bg-white pt-6 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <FileText size={28} className="text-black" />
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              About Page Content
            </h2>
          </div>

          {loading ? (
            <div className="text-center text-black py-12">Loading...</div>
          ) : content ? (
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 md:p-8">
              <AboutForm
                content={content}
                onSave={handleSave}
                isSaving={saving}
              />
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              No content found. Save changes to create the initial content.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
