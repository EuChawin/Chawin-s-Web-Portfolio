'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { createActivity, updateActivity } from '@/lib/actions/activities'
import type { Activity } from '@/lib/types/database'

interface ActivityFormProps {
  initialData?: Activity
  isEdit?: boolean
}

const ACTIVITY_TYPES = [
  'course', 'workshop', 'hackathon', 'event', 'reading', 
  'research', 'volunteering', 'travel', 'competition', 
  'camp', 'leadership', 'conference'
]

export function ActivityForm({ initialData, isEdit = false }: ActivityFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      formData.set('tags', JSON.stringify(tags))
      
      formData.set('is_featured', formData.get('is_featured') === 'on' ? 'true' : 'false')
      formData.set('is_published', formData.get('is_published') === 'on' ? 'true' : 'false')
      formData.set('is_completed', formData.get('is_completed') === 'on' ? 'true' : 'false')

      if (coverFile) formData.set('cover_image', coverFile)

      let result
      if (isEdit && initialData) {
        result = await updateActivity(initialData.id, formData)
      } else {
        result = await createActivity(formData)
      }

      if (result.error) throw new Error(result.error)

      router.push('/admin/activities')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save activity')
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/activities" className="p-2 -ml-2 rounded-md hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-serif text-h3">{isEdit ? 'Edit Activity' : 'New Activity'}</h1>
        </div>
        <button type="submit" disabled={isSaving} className="btn-primary py-2 px-5 text-sm">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Activity
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Title *</label>
                  <input id="title" name="title" required defaultValue={initialData?.title} className="w-full px-4 py-2.5 rounded-md border text-body-sm outline-none transition-all focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]" placeholder="e.g., Advanced React Course" />
               </div>
               <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Slug</label>
                  <input id="slug" name="slug" defaultValue={initialData?.slug} className="w-full px-4 py-2.5 rounded-md border text-body-sm outline-none transition-all focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]" placeholder="Auto-generates if blank" />
               </div>
               <div>
                  <label htmlFor="type" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Type *</label>
                  <select id="type" name="type" required defaultValue={initialData?.type || 'course'} className="w-full px-4 py-2.5 rounded-md border text-body-sm outline-none transition-all focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)] capitalize">
                    {ACTIVITY_TYPES.map(type => (
                      <option key={type} value={type}>{type.replace('_', ' ')}</option>
                    ))}
                  </select>
               </div>
               <div className="md:col-span-2">
                  <label htmlFor="provider" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Provider / Organization</label>
                  <input id="provider" name="provider" defaultValue={initialData?.provider || ''} className="w-full px-4 py-2.5 rounded-md border text-body-sm outline-none transition-all focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]" placeholder="e.g., Coursera, MIT" />
               </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Description</label>
              <textarea id="description" name="description" rows={5} defaultValue={initialData?.description || ''} className="w-full px-4 py-2.5 rounded-md border text-body-sm outline-none transition-all focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)] resize-y" />
            </div>
          </div>

          <div className="card p-6 space-y-5">
            <h3 className="font-medium text-[var(--text-primary)] border-b border-[var(--border)] pb-3 mb-4">Links & Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Activity URL</label>
                <input id="url" name="url" type="url" defaultValue={initialData?.url || ''} className="w-full px-4 py-2 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)]" />
              </div>
              <div>
                <label htmlFor="certificate_url" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Certificate URL</label>
                <input id="certificate_url" name="certificate_url" type="url" defaultValue={initialData?.certificate_url || ''} className="w-full px-4 py-2 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)]" />
              </div>
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Start Date</label>
                <input id="start_date" name="start_date" type="date" defaultValue={initialData?.start_date || ''} className="w-full px-4 py-2 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-secondary)]" />
              </div>
              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">End Date</label>
                <input id="end_date" name="end_date" type="date" defaultValue={initialData?.end_date || ''} className="w-full px-4 py-2 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-secondary)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 space-y-5">
            <h3 className="font-medium text-[var(--text-primary)] border-b border-[var(--border)] pb-3 mb-4">Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Completed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="is_completed" defaultChecked={initialData?.is_completed} className="sr-only peer" />
                <div className="w-11 h-6 bg-[var(--border)] rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Published</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="is_published" defaultChecked={initialData?.is_published} className="sr-only peer" />
                <div className="w-11 h-6 bg-[var(--border)] rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Featured</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="is_featured" defaultChecked={initialData?.is_featured} className="sr-only peer" />
                <div className="w-11 h-6 bg-[var(--border)] rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
              </label>
            </div>
          </div>

          <div className="card p-6">
            <ImageUpload initialImage={initialData?.cover_image_url} onImageChange={setCoverFile} label="Cover Image" />
          </div>

          <div className="card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, i) => (
                  <span key={i} className="tag pr-1">
                    {tag}
                    <button type="button" onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="ml-1 p-0.5 rounded-full hover:bg-[var(--border)]">
                      <XCircle size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                className="w-full px-4 py-2 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]"
                placeholder="Type and press Enter"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
