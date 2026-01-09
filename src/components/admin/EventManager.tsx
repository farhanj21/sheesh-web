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
        <div className="bg-white pt-6 pb-12">
          <div className="container mx-auto px-4 md:px-6">
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
      <div className="bg-white pt-6 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black">Event Management</h2>
            <button
              onClick={() => {
                setEditingEvent(null)
                setShowForm(true)
              }}
              className="flex items-center justify-center gap-2 bg-black text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              <Plus size={18} />
              <span>Add Event</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center text-black py-12">Loading...</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-black">
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
                          className="border-b border-gray-200 hover:bg-gray-50 transition"
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
                                <div className="font-semibold text-black">
                                  {event.title}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {event.date}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
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
                           <tr className="border-b border-gray-200">
                               <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                   No events found.
                               </td>
                           </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {events.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8 text-center text-gray-500">
                    No events found.
                  </div>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                    >
                      <div className="p-4">
                        {/* Event Header */}
                        <div className="flex gap-3 mb-4">
                          {event.image && (
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-16 h-16 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-black text-base">
                              {event.title}
                            </h3>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="space-y-2 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Date</p>
                            <p className="text-black text-sm">{event.date}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Location</p>
                            <p className="text-black text-sm">{event.location}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => {
                              setEditingEvent(event)
                              setShowForm(true)
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition text-sm font-medium"
                          >
                            <Edit2 size={16} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => confirmDelete(event.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition text-sm font-medium"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
