'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Edit, Trash2, Loader2, Trophy, Image as ImageIcon, ExternalLink } from 'lucide-react'
import { addAchievement, updateAchievement, deleteAchievement, reorderAchievements } from '@/lib/actions/achievements'
import type { Achievement } from '@/lib/types/database'
import { formatDateShort } from '@/lib/utils/slug'
import { ImageUpload } from '@/components/ui/ImageUpload'

export function AchievementsManager({ items }: { items: Achievement[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>, imageFile: File | null, isPublished: boolean) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const formData = new FormData(e.currentTarget)
      if (imageFile) formData.append('image', imageFile)
      formData.append('display_order', items.length.toString())
      formData.set('is_published', isPublished ? 'true' : 'false')
      
      await addAchievement(formData)
      setIsAdding(false)
      router.refresh()
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = async (id: string, e: React.FormEvent<HTMLFormElement>, imageFile: File | null, isPublished: boolean) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const formData = new FormData(e.currentTarget)
      if (imageFile) formData.append('image', imageFile)
      formData.set('is_published', isPublished ? 'true' : 'false')
      
      await updateAchievement(id, formData)
      setEditingId(null)
      router.refresh()
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this achievement?')) return
    await deleteAchievement(id)
    router.refresh()
  }

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) return
    
    const newItems = [...items]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    // Swap
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp
    
    // Update orders
    const updates = newItems.map((item, i) => ({ id: item.id, display_order: i }))
    
    await reorderAchievements(updates)
    router.refresh()
  }

  const AchievementForm = ({ item, onSubmit, onCancel }: any) => {
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isPublished, setIsPublished] = useState<boolean>(item ? item.is_published : true)
    
    return (
      <form onSubmit={(e) => onSubmit(e, imageFile, isPublished)} className="card p-5 border-[var(--accent)] bg-[var(--accent-muted)] mb-8">
         <h3 className="font-medium mb-4">{item ? 'Edit Achievement' : 'New Achievement'}</h3>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
             <div className="md:col-span-2 space-y-4">
                 <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Title *</label>
                    <input name="title" required defaultValue={item?.title} placeholder="e.g., 1st Place - Global Hackathon" className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 mb-4">
                     <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Issuer *</label>
                        <input name="issuer" required defaultValue={item?.issuer} placeholder="e.g., Google, University..." className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm" />
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Category *</label>
                        <select name="category" required defaultValue={item?.category || 'award'} className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm text-[var(--text-secondary)]">
                            <option value="award">Award</option>
                            <option value="recognition">Recognition</option>
                            <option value="competition">Competition</option>
                            <option value="scholarship">Scholarship</option>
                            <option value="honor">Honor</option>
                            <option value="academic">Academic</option>
                        </select>
                     </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Date Achieved *</label>
                        <input name="awarded_date" type="date" required defaultValue={item?.awarded_date} className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm text-[var(--text-secondary)]" />
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">URL (Optional)</label>
                        <input name="url" type="url" defaultValue={item?.url || ''} placeholder="https://..." className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm" />
                     </div>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Description *</label>
                    <textarea name="description" required rows={4} defaultValue={item?.description} placeholder="Describe the achievement and your role..." className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm resize-y" />
                 </div>
             </div>
             
             <div>
                 <ImageUpload 
                   initialImage={item?.cover_image_url} 
                   onImageChange={setImageFile} 
                   label="Award/Badge Image" 
                   aspectRatio="video"
                 />
             </div>
         </div>

         <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/10 dark:border-white/10">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
               <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="rounded" /> Published
            </label>
            <div className="flex gap-2">
               <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm hover:bg-black/5 rounded">Cancel</button>
               <button type="submit" disabled={isSaving} className="btn-primary py-1.5 px-4 text-sm">
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
               </button>
            </div>
         </div>
      </form>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button onClick={() => setIsAdding(true)} className="btn-primary py-2 text-sm" disabled={isAdding}>
          <PlusCircle size={16} /> Add Achievement
        </button>
      </div>

      {isAdding && <AchievementForm onSubmit={handleAdd} onCancel={() => setIsAdding(false)} />}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="relative">
             {editingId === item.id ? (
                <div className="bg-[var(--bg-surface)] rounded-xl border p-1 mb-4">
                   <AchievementForm item={item} onSubmit={(e: any, file: any, pub: boolean) => handleEdit(item.id, e, file, pub)} onCancel={() => setEditingId(null)} />
                </div>
             ) : (
                <div className={`card p-5 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md group ${!item.is_published ? 'opacity-60' : ''}`}>
                    <div className="flex flex-col gap-1 text-[var(--text-tertiary)] shrink-0 self-start mt-2">
                       <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="hover:text-[var(--accent)] disabled:opacity-30">▲</button>
                       <button onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1} className="hover:text-[var(--accent)] disabled:opacity-30">▼</button>
                    </div>
                    
                    {item.cover_image_url ? (
                       <div className="w-full md:w-48 aspect-video rounded-lg overflow-hidden bg-[var(--bg-surface-2)] shrink-0 border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.cover_image_url} alt="" className="w-full h-full object-cover" />
                       </div>
                    ) : (
                       <div className="w-full md:w-48 aspect-video rounded-lg bg-[var(--bg-surface-2)] flex items-center justify-center text-[var(--text-tertiary)] shrink-0 border border-dashed">
                          <ImageIcon size={32} />
                       </div>
                    )}
                    
                    <div className="flex-1">
                       <div className="flex items-start justify-between mb-2">
                          <div>
                             <h4 className="font-semibold text-lg text-[var(--text-primary)] leading-tight flex items-center gap-2">
                                <Trophy size={18} className="text-[var(--accent)]" /> {item.title}
                             </h4>
                             <p className="text-sm text-[var(--text-secondary)] mt-1">{formatDateShort(item.awarded_date)}</p>
                          </div>
                          
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-surface-2)] rounded-md px-1 py-0.5">
                            <button onClick={() => setEditingId(item.id)} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent)] rounded"><Edit size={16}/></button>
                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 rounded"><Trash2 size={16}/></button>
                          </div>
                       </div>
                       
                       <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
                       
                       {item.url && (
                          <div className="mt-3">
                              <a href={item.url} target="_blank" rel="noreferrer" className="text-sm text-[var(--accent)] hover:underline inline-flex items-center gap-1">
                                 View details <ExternalLink size={14} />
                              </a>
                          </div>
                       )}
                    </div>
                </div>
             )}
          </div>
        ))}
      </div>
      
      {items.length === 0 && !isAdding && (
         <div className="text-center py-12 border border-dashed rounded-lg text-[var(--text-tertiary)]">
           No achievements added yet.
         </div>
      )}
    </div>
  )
}
