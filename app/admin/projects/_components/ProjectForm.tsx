'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Globe, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { createProject, updateProject } from '@/lib/actions/projects'
import type { Project } from '@/lib/types/database'

interface ProjectFormProps {
  initialData?: Project
  isEdit?: boolean
}

export function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Tags and Tech Stack state
  const [techStack, setTechStack] = useState<string[]>(initialData?.tech_stack || [])
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [techInput, setTechInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  
  // Image state
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const handleArrayAdd = (e: React.KeyboardEvent, input: string, setter: any, list: string[], setInput: any) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault()
      if (!list.includes(input.trim())) {
        setter([...list, input.trim()])
      }
      setInput('')
    }
  }

  const handleArrayRemove = (index: number, setter: any, list: string[]) => {
    setter(list.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      formData.set('tech_stack', JSON.stringify(techStack))
      formData.set('tags', JSON.stringify(tags))
      
      // Explicitly handle booleans from checkboxes
      formData.set('is_featured', formData.get('is_featured') === 'on' ? 'true' : 'false')
      formData.set('is_published', formData.get('is_published') === 'on' ? 'true' : 'false')

      if (coverFile) {
        formData.set('cover_image', coverFile)
      }

      let result
      if (isEdit && initialData) {
        result = await updateProject(initialData.id, formData)
      } else {
        result = await createProject(formData)
      }

      if (result.error) {
        throw new Error(result.error)
      }

      router.push('/admin/projects')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save project')
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects" className="p-2 -ml-2 rounded-md hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-serif text-h3">{isEdit ? 'Edit Project' : 'New Project'}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary py-2 px-5 text-sm"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Project
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Project Title *</label>
              <input
                id="title"
                name="title"
                required
                defaultValue={initialData?.title}
                className="w-full px-4 py-2.5 rounded-md border text-body-sm outline-none transition-all focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]"
                placeholder="e.g., AI Robotics Platform"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Slug (URL)</label>
              <input
                id="slug"
                name="slug"
                defaultValue={initialData?.slug}
                className="w-full px-4 py-2.5 rounded-md border text-body-sm outline-none transition-all focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]"
                placeholder="Leave blank to auto-generate from title"
              />
            </div>

            <div>
              <label htmlFor="tagline" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Tagline</label>
              <input
                id="tagline"
                name="tagline"
                defaultValue={initialData?.tagline || ''}
                className="w-full px-4 py-2.5 rounded-md border text-body-sm outline-none transition-all focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]"
                placeholder="A short one-liner describing the project"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Description</label>
              <textarea
                id="description"
                name="description"
                rows={5}
                defaultValue={initialData?.description || ''}
                className="w-full px-4 py-2.5 rounded-md border text-body-sm outline-none transition-all focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)] resize-y"
                placeholder="Full project details..."
              />
            </div>
          </div>

          {/* Links & Dates */}
          <div className="card p-6 space-y-5">
            <h3 className="font-medium text-[var(--text-primary)] border-b border-[var(--border)] pb-3 mb-4">Links & Timeline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="demo_url" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Live Demo URL</label>
                <input
                  id="demo_url"
                  name="demo_url"
                  type="url"
                  defaultValue={initialData?.demo_url || ''}
                  className="w-full px-4 py-2 rounded-md border text-body-sm outline-none focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)]"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label htmlFor="repo_url" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">GitHub Repository</label>
                <input
                  id="repo_url"
                  name="repo_url"
                  type="url"
                  defaultValue={initialData?.repo_url || ''}
                  className="w-full px-4 py-2 rounded-md border text-body-sm outline-none focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)]"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Start Date</label>
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  defaultValue={initialData?.start_date || ''}
                  className="w-full px-4 py-2 rounded-md border text-body-sm outline-none focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-secondary)]"
                />
              </div>
              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">End Date</label>
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  defaultValue={initialData?.end_date || ''}
                  className="w-full px-4 py-2 rounded-md border text-body-sm outline-none focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-secondary)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <div className="card p-6 space-y-5">
            <h3 className="font-medium text-[var(--text-primary)] border-b border-[var(--border)] pb-3 mb-4">Settings</h3>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Status</label>
              <select
                id="status"
                name="status"
                defaultValue={initialData?.status || 'completed'}
                className="w-full px-4 py-2 rounded-md border text-body-sm outline-none focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]"
              >
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="concept">Concept</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Published</p>
                <p className="text-xs text-[var(--text-tertiary)]">Visible to the public</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="is_published" defaultChecked={initialData?.is_published} className="sr-only peer" />
                <div className="w-11 h-6 bg-[var(--border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Featured</p>
                <p className="text-xs text-[var(--text-tertiary)]">Show on homepage</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="is_featured" defaultChecked={initialData?.is_featured} className="sr-only peer" />
                <div className="w-11 h-6 bg-[var(--border)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
              </label>
            </div>
          </div>

          {/* Cover Image */}
          <div className="card p-6">
            <ImageUpload 
              initialImage={initialData?.cover_image_url}
              onImageChange={setCoverFile}
              label="Cover Image"
              aspectRatio="video"
            />
          </div>

          {/* Tags & Tech */}
          <div className="card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Tech Stack</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {techStack.map((tech, i) => (
                  <span key={i} className="tag pr-1">
                    {tech}
                    <button type="button" onClick={() => handleArrayRemove(i, setTechStack, techStack)} className="ml-1 p-0.5 rounded-full hover:bg-[var(--border)]">
                      <XCircle size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => handleArrayAdd(e, techInput, setTechStack, techStack, setTechInput)}
                className="w-full px-4 py-2 rounded-md border text-body-sm outline-none focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]"
                placeholder="Type and press Enter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, i) => (
                  <span key={i} className="tag pr-1">
                    {tag}
                    <button type="button" onClick={() => handleArrayRemove(i, setTags, tags)} className="ml-1 p-0.5 rounded-full hover:bg-[var(--border)]">
                      <XCircle size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => handleArrayAdd(e, tagInput, setTags, tags, setTagInput)}
                className="w-full px-4 py-2 rounded-md border text-body-sm outline-none focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]"
                placeholder="Type and press Enter"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

function XCircle(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    </svg>
  )
}
