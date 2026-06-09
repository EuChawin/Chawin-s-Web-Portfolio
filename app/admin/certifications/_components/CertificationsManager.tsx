'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Edit, Trash2, Loader2, Award, ExternalLink } from 'lucide-react'
import { addCertification, updateCertification, deleteCertification } from '@/lib/actions/certifications'
import type { Certification } from '@/lib/types/database'
import { formatDateShort } from '@/lib/utils/slug'
import { ImageUpload } from '@/components/ui/ImageUpload'

export function CertificationsManager({ items }: { items: Certification[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>, imageFile: File | null) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const formData = new FormData(e.currentTarget)
      if (imageFile) formData.append('image', imageFile)
      formData.append('display_order', items.length.toString())
      await addCertification(formData)
      setIsAdding(false)
      router.refresh()
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = async (id: string, e: React.FormEvent<HTMLFormElement>, imageFile: File | null) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const formData = new FormData(e.currentTarget)
      if (imageFile) formData.append('image', imageFile)
      await updateCertification(id, formData)
      setEditingId(null)
      router.refresh()
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certification?')) return
    await deleteCertification(id)
    router.refresh()
  }

  const CertForm = ({ item, onSubmit, onCancel }: any) => {
    const [imageFile, setImageFile] = useState<File | null>(null)
    
    return (
      <form onSubmit={(e) => onSubmit(e, imageFile)} className="card p-5 border-[var(--accent)] bg-[var(--accent-muted)] mb-8">
         <h3 className="font-medium mb-4">{item ? 'Edit Certification' : 'New Certification'}</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
             <div className="md:col-span-2 space-y-4">
                 <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Certification Name *</label>
                    <input name="name" required defaultValue={item?.name} placeholder="e.g., AWS Certified Solutions Architect" className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm" />
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Issuing Organization *</label>
                    <input name="issuer" required defaultValue={item?.issuer} placeholder="e.g., Amazon Web Services" className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Issue Date *</label>
                        <input name="issue_date" type="date" required defaultValue={item?.issue_date} className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm text-[var(--text-secondary)]" />
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Expiration Date</label>
                        <input name="expiry_date" type="date" defaultValue={item?.expiry_date || ''} className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm text-[var(--text-secondary)]" />
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Credential ID</label>
                        <input name="credential_id" defaultValue={item?.credential_id || ''} placeholder="e.g., AWS-12345" className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm" />
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Credential URL</label>
                        <input name="credential_url" type="url" defaultValue={item?.credential_url || ''} placeholder="https://..." className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm" />
                     </div>
                 </div>
             </div>
             
             <div>
                 <ImageUpload 
                   initialImage={item?.cover_image_url} 
                   onImageChange={setImageFile} 
                   label="Certificate Image" 
                   aspectRatio="video"
                 />
             </div>
         </div>
         <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/10 dark:border-white/10">
            <label className="flex items-center gap-2 text-sm">
               <input type="checkbox" name="is_published" defaultChecked={item ? item.is_published : true} className="rounded" /> Published
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
          <PlusCircle size={16} /> Add Certification
        </button>
      </div>

      {isAdding && <CertForm onSubmit={handleAdd} onCancel={() => setIsAdding(false)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="relative">
             {editingId === item.id ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-4xl bg-[var(--bg)] rounded-xl shadow-xl overflow-hidden">
                      <CertForm item={item} onSubmit={(e: any, file: any) => handleEdit(item.id, e, file)} onCancel={() => setEditingId(null)} />
                   </div>
                </div>
             ) : (
                <div className={`card p-5 h-full flex flex-col transition-all hover:shadow-md group ${!item.is_published ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                       <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface-2)] flex items-center justify-center text-[var(--accent)] shrink-0">
                          <Award size={20} />
                       </div>
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-surface-2)] rounded-md">
                         <button onClick={() => setEditingId(item.id)} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent)] rounded"><Edit size={14}/></button>
                         <button onClick={() => handleDelete(item.id)} className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 rounded"><Trash2 size={14}/></button>
                       </div>
                    </div>
                    
                    <h4 className="font-semibold text-[var(--text-primary)] mb-1 leading-tight">{item.name}</h4>
                    <p className="text-sm font-medium text-[var(--text-secondary)] mb-4">{item.issuer}</p>
                    
                    <div className="mt-auto pt-4 border-t border-[var(--border)] text-xs text-[var(--text-tertiary)] flex flex-wrap justify-between gap-2">
                       <div>
                          Issued: <span className="text-[var(--text-secondary)]">{formatDateShort(item.issue_date)}</span>
                          {item.expiry_date && (
                             <> &bull; Expires: <span className="text-[var(--text-secondary)]">{formatDateShort(item.expiry_date)}</span></>
                          )}
                       </div>
                       
                       {item.credential_url && (
                          <a href={item.credential_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent)] hover:underline">
                             Show credential <ExternalLink size={10} />
                          </a>
                       )}
                    </div>
                </div>
             )}
          </div>
        ))}
      </div>
      
      {items.length === 0 && !isAdding && (
         <div className="text-center py-12 border border-dashed rounded-lg text-[var(--text-tertiary)]">
           No certifications added yet.
         </div>
      )}
    </div>
  )
}
