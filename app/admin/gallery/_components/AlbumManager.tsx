'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { GalleryCategoryDB } from '@/lib/types/database'
import { createGalleryCategory, updateGalleryCategory, deleteGalleryCategory, reorderGalleryCategories } from '@/lib/actions/gallery'
import { Plus, GripVertical, Trash2, Edit2, Loader2, Save, X } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableAlbumRow({
  category,
  onEdit,
  onDelete,
}: {
  category: GalleryCategoryDB
  onEdit: (c: GalleryCategoryDB) => void
  onDelete: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 mb-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg ${
        isDragging ? 'opacity-50 shadow-lg border-[var(--accent)]' : ''
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab hover:text-[var(--text-primary)] text-[var(--text-tertiary)] p-1">
        <GripVertical size={20} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-[var(--text-primary)]">{category.title}</h4>
          {!category.is_published && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-500">
              Draft
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--text-secondary)]">{category.slug}</p>
        {category.description && (
          <p className="text-sm text-[var(--text-tertiary)] mt-1 truncate">{category.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(category)}
          className="p-2 hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded transition-colors"
          title="Edit Album"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="p-2 hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 rounded transition-colors"
          title="Delete Album"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export function AlbumManager({ categories }: { categories: GalleryCategoryDB[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState(categories)
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<GalleryCategoryDB | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    is_published: true,
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        
        startTransition(async () => {
          await reorderGalleryCategories(newItems.map(i => i.id))
        })
        
        return newItems
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this album? Photos in this album will NOT be deleted, but will become uncategorized.')) return
    
    startTransition(async () => {
      await deleteGalleryCategory(id)
      router.refresh()
      setItems(items.filter(i => i.id !== id))
    })
  }

  const openEdit = (category: GalleryCategoryDB) => {
    setEditingCategory(category)
    setFormData({
      title: category.title,
      slug: category.slug,
      description: category.description || '',
      is_published: category.is_published,
    })
    setIsFormOpen(true)
  }

  const openNew = () => {
    setEditingCategory(null)
    setFormData({ title: '', slug: '', description: '', is_published: true })
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const data = new FormData()
    data.append('title', formData.title)
    data.append('slug', formData.slug)
    data.append('description', formData.description)
    data.append('is_published', String(formData.is_published))

    startTransition(async () => {
      if (editingCategory) {
        await updateGalleryCategory(editingCategory.id, data)
      } else {
        await createGalleryCategory(data)
      }
      setIsFormOpen(false)
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Albums</h3>
        <button onClick={openNew} className="btn-primary py-2 px-4 flex items-center gap-2">
          <Plus size={16} /> New Album
        </button>
      </div>

      {isFormOpen && (
        <div className="p-6 bg-[var(--bg-surface-2)] rounded-xl border border-[var(--border)] mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">{editingCategory ? 'Edit Album' : 'Create Album'}</h4>
            <button onClick={() => setIsFormOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value
                    setFormData({
                      ...formData,
                      title,
                      slug: editingCategory ? formData.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                    })
                  }}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <label htmlFor="is_published" className="text-sm">Published (Visible in gallery)</label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={isPending} className="btn-primary flex items-center gap-2">
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {editingCategory ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {items.length === 0 && !isFormOpen && (
        <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-lg">
          <p className="text-[var(--text-tertiary)] text-sm mb-2">No albums yet.</p>
          <button onClick={openNew} className="text-sm text-[var(--accent)] hover:underline">
            Create your first album
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className="relative">
          {isPending && (
            <div className="absolute inset-0 bg-black/5 z-20 flex items-center justify-center rounded-lg">
              <Loader2 className="animate-spin text-[var(--accent)]" />
            </div>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map(i => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((category) => (
                <SortableAlbumRow
                  key={category.id}
                  category={category}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}
