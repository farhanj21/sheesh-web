'use client'

import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const buttonStyles = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    info: 'bg-blue-500 hover:bg-blue-600',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl max-w-md w-full mx-4 animate-scaleIn">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-full ${type === 'danger' ? 'bg-red-500/20' : type === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'}`}>
              <AlertTriangle 
                size={24} 
                className={type === 'danger' ? 'text-red-400' : type === 'warning' ? 'text-yellow-400' : 'text-blue-400'}
              />
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <p className="text-zinc-300 mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700 transition border border-zinc-700"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg font-semibold transition ${buttonStyles[type]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
