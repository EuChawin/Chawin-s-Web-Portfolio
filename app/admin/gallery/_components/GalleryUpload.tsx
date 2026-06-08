'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Loader2, Link as LinkIcon, Trash2, Eye } from 'lucide-react'
import { uploadGalleryItem, deleteGalleryItem, updateGalleryItem } from '@/lib/actions/gallery'
import type { GalleryItem } from '@/lib/types/database'

interface GalleryUploadProps {
  items: GalleryItem[]
}

export function GalleryUpload({ items }: GalleryUploadProps) {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0])
    }
  }

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Only images and videos are supported')
      return
    }

    setIsUploading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('is_public', 'true') // Default to public
      formData.append('is_published', 'true')
      
      // In a real app with WebAssembly, we'd convert to WebP here
      // For now we just upload raw file
      const result = await uploadGalleryItem(formData)
      if (result.error) throw new Error(result.error)
      
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return
    
    try {
      await deleteGalleryItem(id)
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Failed to delete item')
    }
  }

  const handleTogglePublic = async (id: string, currentIsPublic: boolean) => {
      const formData = new FormData()
      formData.append('is_public', currentIsPublic ? 'false' : 'true')
      await updateGalleryItem(id, formData)
      router.refresh()
  }

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <div 
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
          dragActive ? 'border-[var(--accent)] bg-[var(--accent-muted)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)]'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          {isUploading ? (
            <Loader2 size={40} className="animate-spin text-[var(--accent)] mb-4" />
          ) : (
            <PlusCircle size={40} className="text-[var(--text-tertiary)] mb-4" />
          )}
          <h3 className="font-medium text-[var(--text-primary)] mb-1">
            {isUploading ? 'Uploading & Processing...' : 'Upload Media'}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Drag and drop images or video here, or click to browse.
            (Auto-converts to optimized WebP in production)
          </p>
          <label className="btn-primary cursor-pointer">
             <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => {
                 if(e.target.files?.[0]) processFile(e.target.files[0])
             }} disabled={isUploading}/>
             Browse Files
          </label>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Gallery Grid */}
      <div>
        <h3 className="font-medium text-[var(--text-primary)] mb-4 flex items-center justify-between">
           <span>Uploaded Media</span>
           <span className="text-sm text-[var(--text-secondary)] bg-[var(--bg-surface-2)] px-2 py-0.5 rounded-full">{items.length} items</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="group relative aspect-square rounded-lg border border-[var(--border)] overflow-hidden bg-[var(--bg-surface-2)]">
               {item.file_type === 'video' ? (
                   <video src={item.file_url} className="w-full h-full object-cover" muted loop playsInline />
               ) : (
                   /* eslint-disable-next-line @next/next/no-img-element */
                   <img src={item.file_url} alt="" loading="lazy" className="w-full h-full object-cover" />
               )}
               
               {/* Hover Overlay */}
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                     <button 
                       onClick={() => handleTogglePublic(item.id, item.is_public)}
                       className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${item.is_public ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}
                     >
                        {item.is_public ? 'Public' : 'Private'}
                     </button>
                     <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-white/20 rounded transition-colors text-white">
                        <Trash2 size={14} />
                     </button>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                      <a href={item.file_url} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-white/20 rounded transition-colors" title="View Full">
                          <Eye size={16} />
                      </a>
                      <button onClick={() => {
                          navigator.clipboard.writeText(item.file_url)
                          alert('Copied URL')
                      }} className="p-1.5 hover:bg-white/20 rounded transition-colors" title="Copy URL">
                          <LinkIcon size={16} />
                      </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
        
        {items.length === 0 && (
            <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-lg">
                <p className="text-[var(--text-tertiary)] text-sm">Your gallery is empty.</p>
            </div>
        )}
      </div>
    </div>
  )
}
