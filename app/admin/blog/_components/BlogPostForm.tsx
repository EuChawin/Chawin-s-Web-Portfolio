'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { TiptapEditor } from '@/components/ui/TiptapEditor'
import { createBlogPost, updateBlogPost } from '@/lib/actions/blog'
import type { BlogPost } from '@/lib/types/database'

interface BlogPostFormProps {
  initialData?: BlogPost
  isEdit?: boolean
}

export function BlogPostForm({ initialData, isEdit = false }: BlogPostFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [content, setContent] = useState(initialData?.content || '')

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
      formData.set('content', content) // from Tiptap state
      formData.set('is_featured', formData.get('is_featured') === 'on' ? 'true' : 'false')

      if (coverFile) formData.set('cover_image', coverFile)

      let result
      if (isEdit && initialData) {
        result = await updateBlogPost(initialData.id, formData)
      } else {
        result = await createBlogPost(formData)
      }

      if (result.error) throw new Error(result.error)

      router.push('/admin/blog')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save blog post')
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 -ml-2 rounded-md hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-serif text-h3">{isEdit ? 'Edit Post' : 'New Post'}</h1>
        </div>
        <button type="submit" disabled={isSaving} className="btn-primary py-2 px-5 text-sm">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Post
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="card p-6 space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Title *</label>
              <input id="title" name="title" required defaultValue={initialData?.title} className="w-full font-serif text-2xl px-4 py-3 rounded-md border outline-none transition-all focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]" placeholder="An interesting title..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Slug</label>
                  <input id="slug" name="slug" defaultValue={initialData?.slug} className="w-full px-4 py-2.5 rounded-md border text-body-sm outline-none transition-all focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]" placeholder="Auto-generates if blank" />
               </div>
               <div>
                  <label htmlFor="category" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Category</label>
                  <input id="category" name="category" defaultValue={initialData?.category || ''} className="w-full px-4 py-2.5 rounded-md border text-body-sm outline-none transition-all focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]" placeholder="e.g., Engineering" />
               </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Excerpt</label>
              <textarea id="excerpt" name="excerpt" rows={3} defaultValue={initialData?.excerpt || ''} className="w-full px-4 py-2.5 rounded-md border text-body-sm outline-none transition-all focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)] resize-y" placeholder="Brief summary for list views..." />
            </div>
          </div>

          <div className="card p-6">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-4">Content *</label>
            <TiptapEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 space-y-5">
            <h3 className="font-medium text-[var(--text-primary)] border-b border-[var(--border)] pb-3 mb-4">Publishing</h3>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Status</label>
              <select id="status" name="status" defaultValue={initialData?.status || 'draft'} className="w-full px-4 py-2 rounded-md border text-body-sm outline-none focus:border-[var(--accent)] bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label htmlFor="published_at" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Publish Date</label>
              <input 
                id="published_at" 
                name="published_at" 
                type="datetime-local" 
                defaultValue={initialData?.published_at ? new Date(initialData.published_at).toISOString().slice(0, 16) : ''} 
                className="w-full px-4 py-2 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-secondary)]" 
              />
              <p className="text-xs text-[var(--text-tertiary)] mt-1">Leave blank to auto-set on publish</p>
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
