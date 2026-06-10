'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { GalleryCategoryDB } from '@/lib/types/database'
import type { GalleryItem } from '@/lib/types'
import { updateGalleryItem, deleteGalleryItem, bulkDeleteGalleryItems, bulkMoveGalleryItems, bulkToggleFeatured, bulkTogglePublished, reorderGalleryItems } from '@/lib/actions/gallery'
import { Trash2, Link as LinkIcon, Eye, Star, Globe, CheckSquare, Square, FolderInput, Grip } from 'lucide-react'
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
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortablePhotoCard({
  item,
  isSelected,
  onToggleSelect,
  onDelete,
  onTogglePublic,
  onToggleFeatured
}: {
  item: GalleryItem
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onDelete: (id: string) => void
  onTogglePublic: (id: string, current: boolean) => void
  onToggleFeatured: (id: string, current: boolean) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-square rounded-lg border overflow-hidden bg-[var(--bg-surface-2)] ${
        isDragging ? 'opacity-50 shadow-xl border-[var(--accent)]' : isSelected ? 'border-[var(--accent)] ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg-surface)]' : 'border-[var(--border)]'
      }`}
    >
       {/* Checkbox Overlay (always visible if selected, otherwise on hover) */}
       <div className={`absolute top-2 left-2 z-20 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
         <button onClick={() => onToggleSelect(item.id)} className="bg-black/40 rounded p-1 text-white hover:bg-black/60 transition-colors backdrop-blur-sm">
            {isSelected ? <CheckSquare size={18} className="text-[var(--accent)]" /> : <Square size={18} />}
         </button>
       </div>

       {/* Drag Handle Overlay */}
       <div {...attributes} {...listeners} className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded p-1 text-white hover:bg-black/60 backdrop-blur-sm cursor-grab">
          <Grip size={18} />
       </div>

       {item.file_type === 'video' ? (
           <video src={item.file_url} className="w-full h-full object-cover" muted loop playsInline />
       ) : (
           /* eslint-disable-next-line @next/next/no-img-element */
           <img src={item.file_url} alt="" loading="lazy" className="w-full h-full object-cover" />
       )}
       
       {/* Hover Overlay Actions */}
       <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 pt-8 flex flex-col justify-end text-white z-10">
          <div className="flex items-center justify-between gap-1">
             <div className="flex gap-1">
                 <button 
                   onClick={() => onTogglePublic(item.id, item.is_public)}
                   className={`p-1.5 rounded transition-colors ${item.is_public ? 'text-emerald-400 hover:bg-emerald-400/20' : 'text-amber-400 hover:bg-amber-400/20'}`}
                   title={item.is_public ? 'Public' : 'Private'}
                 >
                    <Globe size={14} />
                 </button>
                 <button 
                   onClick={() => onToggleFeatured(item.id, item.is_featured)}
                   className={`p-1.5 rounded transition-colors ${item.is_featured ? 'text-amber-400 hover:bg-amber-400/20' : 'text-white/70 hover:bg-white/20'}`}
                   title={item.is_featured ? 'Unfeature' : 'Feature'}
                 >
                    <Star size={14} fill={item.is_featured ? 'currentColor' : 'none'} />
                 </button>
             </div>
             
             <div className="flex gap-1">
                 <a href={item.file_url} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-white/20 rounded transition-colors" title="View Full">
                     <Eye size={14} />
                 </a>
                 <button onClick={() => {
                     navigator.clipboard.writeText(item.file_url)
                     alert('Copied URL')
                 }} className="p-1.5 hover:bg-white/20 rounded transition-colors" title="Copy URL">
                     <LinkIcon size={14} />
                 </button>
                 <button onClick={() => onDelete(item.id)} className="p-1.5 hover:bg-red-500/80 rounded transition-colors text-white" title="Delete">
                    <Trash2 size={14} />
                 </button>
             </div>
          </div>
       </div>
    </div>
  )
}

export function PhotoGrid({ items, categories }: { items: GalleryItem[], categories: GalleryCategoryDB[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all')
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())

  // We manage items locally for optimistic reordering
  const [localItems, setLocalItems] = useState(items)

  // Filter items by selected album
  const filteredItems = localItems.filter(item => {
    if (selectedAlbumId === 'all') return true
    if (selectedAlbumId === 'uncategorized') return !item.category_id
    return item.category_id === selectedAlbumId
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setLocalItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        
        // Save the reordered state (we only want to update the display_order of the currently filtered items)
        const newFiltered = arrayMove(filteredItems, filteredItems.findIndex(i => i.id === active.id), filteredItems.findIndex(i => i.id === over.id))
        
        startTransition(async () => {
          await reorderGalleryItems(newFiltered.map(i => i.id))
        })
        
        return newItems
      })
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedPhotos)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedPhotos(next)
  }

  const toggleSelectAll = () => {
    if (selectedPhotos.size === filteredItems.length && filteredItems.length > 0) {
      setSelectedPhotos(new Set())
    } else {
      setSelectedPhotos(new Set(filteredItems.map(i => i.id)))
    }
  }

  // Single Item Actions
  const handleTogglePublic = async (id: string, currentIsPublic: boolean) => {
      const formData = new FormData()
      formData.append('is_public', currentIsPublic ? 'false' : 'true')
      startTransition(async () => {
        await updateGalleryItem(id, formData)
      })
  }

  const handleToggleFeatured = async (id: string, currentIsFeatured: boolean) => {
      const formData = new FormData()
      formData.append('is_featured', currentIsFeatured ? 'false' : 'true')
      startTransition(async () => {
        await updateGalleryItem(id, formData)
      })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo forever?')) return
    startTransition(async () => {
      await deleteGalleryItem(id)
      setLocalItems(prev => prev.filter(i => i.id !== id))
      setSelectedPhotos(prev => { const n = new Set(prev); n.delete(id); return n; })
    })
  }

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (selectedPhotos.size === 0) return
    if (!confirm(`Delete ${selectedPhotos.size} photos forever?`)) return
    
    startTransition(async () => {
      await bulkDeleteGalleryItems(Array.from(selectedPhotos))
      setLocalItems(prev => prev.filter(i => !selectedPhotos.has(i.id)))
      setSelectedPhotos(new Set())
    })
  }

  const handleBulkMove = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCatId = e.target.value === 'uncategorized' ? null : e.target.value
    if (newCatId === '' || selectedPhotos.size === 0) return // 'move' placeholder selected

    startTransition(async () => {
      await bulkMoveGalleryItems(Array.from(selectedPhotos), newCatId)
      // Optimistically update local
      setLocalItems(prev => prev.map(i => selectedPhotos.has(i.id) ? { ...i, category_id: newCatId } : i))
      setSelectedPhotos(new Set())
      e.target.value = '' // reset dropdown
    })
  }

  const handleBulkFeature = async (feature: boolean) => {
    if (selectedPhotos.size === 0) return
    startTransition(async () => {
      await bulkToggleFeatured(Array.from(selectedPhotos), feature)
      setLocalItems(prev => prev.map(i => selectedPhotos.has(i.id) ? { ...i, is_featured: feature } : i))
    })
  }

  const handleBulkPublish = async (publish: boolean) => {
    if (selectedPhotos.size === 0) return
    startTransition(async () => {
      await bulkTogglePublished(Array.from(selectedPhotos), publish)
      setLocalItems(prev => prev.map(i => selectedPhotos.has(i.id) ? { ...i, is_published: publish } : i))
    })
  }

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-surface-2)] p-4 rounded-xl border border-[var(--border)]">
        
        <div className="flex items-center gap-4">
          <select
            value={selectedAlbumId}
            onChange={(e) => {
              setSelectedAlbumId(e.target.value)
              setSelectedPhotos(new Set()) // clear selection on album change
            }}
            className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="all">All Photos</option>
            <option value="uncategorized">Uncategorized</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          <span className="text-sm text-[var(--text-secondary)]">
            {filteredItems.length} photos
          </span>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2">
           <button 
             onClick={toggleSelectAll} 
             className="flex items-center gap-2 text-sm px-3 py-1.5 hover:bg-[var(--bg-surface)] rounded-md transition-colors border border-transparent hover:border-[var(--border)]"
           >
             {selectedPhotos.size > 0 && selectedPhotos.size === filteredItems.length ? <CheckSquare size={16} className="text-[var(--accent)]" /> : <Square size={16} />}
             <span className="hidden sm:inline">{selectedPhotos.size > 0 ? `Selected ${selectedPhotos.size}` : 'Select All'}</span>
           </button>

           <div className={`flex items-center gap-2 transition-opacity duration-200 ${selectedPhotos.size > 0 ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'}`}>
              <div className="h-6 w-px bg-[var(--border)] mx-1"></div>
              
              <select
                onChange={handleBulkMove}
                className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-[var(--accent)] max-w-[120px]"
                title="Move selected to album"
              >
                <option value="">Move to...</option>
                <option value="uncategorized">Uncategorized</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>

              <button onClick={() => handleBulkFeature(true)} className="p-1.5 hover:bg-[var(--bg-surface)] rounded text-[var(--text-secondary)] hover:text-amber-500 transition-colors" title="Mark Featured">
                 <Star size={16} />
              </button>
              
              <button onClick={() => handleBulkPublish(true)} className="p-1.5 hover:bg-[var(--bg-surface)] rounded text-[var(--text-secondary)] hover:text-emerald-500 transition-colors" title="Publish">
                 <Globe size={16} />
              </button>

              <button onClick={handleBulkDelete} className="p-1.5 hover:bg-red-500/10 rounded text-[var(--text-secondary)] hover:text-red-500 transition-colors" title="Delete Selected">
                 <Trash2 size={16} />
              </button>
           </div>
        </div>
      </div>

      {/* Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
          <SortableContext items={filteredItems.map(i => i.id)} strategy={rectSortingStrategy}>
            {filteredItems.map(item => (
              <SortablePhotoCard
                key={item.id}
                item={item}
                isSelected={selectedPhotos.has(item.id)}
                onToggleSelect={toggleSelect}
                onDelete={handleDelete}
                onTogglePublic={handleTogglePublic}
                onToggleFeatured={handleToggleFeatured}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-xl">
          <FolderInput size={32} className="mx-auto text-[var(--text-tertiary)] mb-3" />
          <p className="text-[var(--text-secondary)] text-sm">No photos found in this view.</p>
        </div>
      )}
    </div>
  )
}
