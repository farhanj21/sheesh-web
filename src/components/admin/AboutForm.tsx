'use client'

import { useState, useEffect } from 'react'
import { AboutContent, AboutSection } from '@/types'
import { Save, RotateCcw, Plus, Trash2, GripVertical } from 'lucide-react'

interface AboutFormProps {
  content: AboutContent
  onSave: (content: Partial<AboutContent>) => Promise<void>
  isSaving: boolean
}

export function AboutForm({ content, onSave, isSaving }: AboutFormProps) {
  const [sections, setSections] = useState<AboutSection[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (content?.sections) {
      setSections(content.sections)
    }
  }, [content])

  useEffect(() => {
    const changed = JSON.stringify(sections) !== JSON.stringify(content.sections)
    setHasChanges(changed)
  }, [sections, content.sections])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave({ sections })
  }

  const handleReset = () => {
    setSections(content.sections || [])
  }

  const addSection = () => {
    const newSection: AboutSection = {
      id: `section-${Date.now()}`,
      title: '',
      content: ''
    }
    setSections([...sections, newSection])
  }

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id))
  }

  const updateSection = (id: string, field: 'title' | 'content', value: string) => {
    setSections(sections.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= sections.length) return

    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]
    setSections(newSections)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black">Sections</h3>
        <button
          type="button"
          onClick={addSection}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          <Plus size={18} />
          Add Section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          No sections yet. Click "Add Section" to create one.
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="border border-gray-200 rounded-lg p-6 bg-gray-50"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 15l-6-6-6 6"/>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </button>
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    Section {index + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeSection(section.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Remove section"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Section Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={section.title}
                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400"
                    placeholder="e.g., Our Story"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Content <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    value={section.content}
                    onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400"
                    placeholder="Enter section content..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {content.updatedAt && (
        <p className="text-sm text-gray-500">
          Last updated: {new Date(content.updatedAt).toLocaleString()}
        </p>
      )}

      <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges || isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-black rounded-lg font-semibold hover:bg-gray-200 transition border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw size={18} />
          Reset
        </button>
        <button
          type="submit"
          disabled={!hasChanges || isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
