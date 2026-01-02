'use client'

import { useState, useEffect } from 'react'
import { Event } from '@/types'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { EventForm } from './EventForm'
import { ToastContainer, ToastType } from '@/components/ui/Toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface EventManagerProps {
    token?: string;
}

export function EventManager({ token: propToken }: EventManagerProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState<string | null>(propToken || null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; eventId: string | null }>({
    isOpen: false,
    eventId: null,
  })

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token')
    if (propToken) {
        setToken(propToken)
        setIsAuthenticated(true)
        fetchEvents(propToken)
    } else if (savedToken) {
      setToken(savedToken)
      setIsAuthenticated(true)
      fetchEvents(savedToken)
    }
  }, [propToken])

  const showToast = (message: string, type: ToastType) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const fetchEvents = async (authToken: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/events', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
      } else {
          console.error('Failed to fetch events:', res.statusText)
      }
    } catch (err) {
      console.error('Failed to fetch events:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEvent = async (event: Event) => {
    if (!token) return

    try {
      const isNew = !editingEvent
      const url = isNew
        ? '/api/admin/events'
        : `/api/admin/events/${event.id}`

      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      })

      if (res.ok) {
        await fetchEvents(token)
        setShowForm(false)
        setEditingEvent(null)
        showToast(
          isNew ? 'Event created successfully!' : 'Event updated successfully!',
          'success'
        )
      } else {
        showToast('Failed to save event', 'error')
      }
    } catch (err) {
      console.error('Failed to save event:', err)
      showToast('An error occurred while saving the event', 'error')
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!token) return

    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        await fetchEvents(token)
        showToast('Event deleted successfully!', 'success')
      } else {
        showToast('Failed to delete event', 'error')
      }
    } catch (err) {
      console.error('Failed to delete event:', err)
      showToast('An error occurred while deleting the event', 'error')
    } finally {
      setDeleteDialog({ isOpen: false, eventId: null })
    }
  }

  const confirmDelete = (id: string) => {
    setDeleteDialog({ isOpen: true, eventId: id })
  }

  if (showForm) {
    return (
      <>
        <ToastContainer toasts={toasts} onClose={removeToast} />
        <div className="bg-black pt-6 pb-12">
          <div className="container mx-auto px-6">
            <EventForm
              event={editingEvent}
              onSave={handleSaveEvent}
              onCancel={() => {
                setShowForm(false)
                setEditingEvent(null)
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
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => {
          if (deleteDialog.eventId) {
            handleDeleteEvent(deleteDialog.eventId)
          }
        }}
        onCancel={() => setDeleteDialog({ isOpen: false, eventId: null })}
      />
      <div className="bg-black pt-6 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Event Management</h2>
            <button
              onClick={() => {
                setEditingEvent(null)
                setShowForm(true)
              }}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-zinc-200 transition"
            >
              <Plus size={20} />
              Add Event
            </button>
          </div>

          {loading ? (
            <div className="text-center text-white py-12">Loading...</div>
          ) : (
            <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-800 text-white">
                      <th className="px-6 py-4 text-left">Event</th>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-6 py-4 text-left">Location</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr
                        key={event.id}
                        className="border-b border-zinc-800 hover:bg-zinc-800/50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {event.image && (
                                <img
                                src={event.image}
                                alt={event.title}
                                className="w-12 h-12 object-cover rounded"
                                />
                            )}
                            <div>
                              <div className="font-semibold text-white">
                                {event.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-300">
                          {event.date}
                        </td>
                        <td className="px-6 py-4 text-zinc-300">
                          {event.location}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingEvent(event)
                                setShowForm(true)
                              }}
                              className="p-2 text-blue-400 hover:text-blue-300 transition"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => confirmDelete(event.id)}
                              className="p-2 text-red-400 hover:text-red-300 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                         <tr className="border-b border-zinc-800">
                             <td colSpan={4} className="px-6 py-8 text-center text-zinc-400">
                                 No events found.
                             </td>
                         </tr>
                    )}
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
