'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Edit, Trash2, Loader2, Calendar } from 'lucide-react'
import { addTimelineItem, updateTimelineItem, deleteTimelineItem } from '@/lib/actions/timeline'
import type { TimelineItem } from '@/lib/types/database'
import { formatDateShort } from '@/lib/utils/slug'

const ROLE_TYPES = ['work', 'education', 'project', 'life', 'award', 'travel', 'certification']

export function TimelineManager({ items }: { items: TimelineItem[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await addTimelineItem(new FormData(e.currentTarget))
      setIsAdding(false)
      router.refresh()
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = async (id: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateTimelineItem(id, new FormData(e.currentTarget))
      setEditingId(null)
      router.refresh()
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this timeline item?')) return
    await deleteTimelineItem(id)
    router.refresh()
  }

  const TimelineForm = ({ item, onSubmit, onCancel }: any) => {
    const [isCurrent, setIsCurrent] = useState(item?.is_current || false)
    
    return (
      <form onSubmit={onSubmit} className="card p-5 border-[var(--accent)] bg-[var(--accent-muted)] mb-8">
         <h3 className="font-medium mb-4">{item ? 'Edit Timeline Event' : 'New Timeline Event'}</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
               <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Title / Role *</label>
               <input name="title" required defaultValue={item?.title} placeholder="e.g., Software Engineering Intern" className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm" />
            </div>
            <div>
               <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Organization / Company *</label>
               <input name="organization" required defaultValue={item?.organization} placeholder="e.g., Google" className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm" />
            </div>
            <div>
               <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Type *</label>
               <select name="type" required defaultValue={item?.type || 'work'} className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm capitalize">
                  {ROLE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
               </select>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                   <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Start Date *</label>
                   <input name="start_date" type="date" required defaultValue={item?.start_date} className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm text-[var(--text-secondary)]" />
                </div>
                <div>
                   <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">End Date</label>
                   <input name="end_date" type="date" disabled={isCurrent} defaultValue={item?.end_date || ''} className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm disabled:opacity-50 text-[var(--text-secondary)]" />
                </div>
                <div className="flex items-end pb-2">
                   <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="is_current" checked={isCurrent} onChange={(e) => setIsCurrent(e.target.checked)} className="rounded" /> Current
                   </label>
                </div>
            </div>
            <div className="md:col-span-2">
               <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Location (Optional)</label>
               <input name="location" defaultValue={item?.location || ''} placeholder="e.g., Helsinki, Finland" className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm" />
            </div>
            <div className="md:col-span-2">
               <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Description (Optional)</label>
               <textarea name="description" rows={3} defaultValue={item?.description || ''} placeholder="Brief summary of what you did..." className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50 text-sm resize-y" />
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
          <PlusCircle size={16} /> Add Event
        </button>
      </div>

      {isAdding && <TimelineForm onSubmit={handleAdd} onCancel={() => setIsAdding(false)} />}

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border)] before:to-transparent">
        {items.map((item) => (
          <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
             {/* Icon */}
             <div className="flex items-center justify-center w-10 h-10 rounded-full border-[4px] border-[var(--bg)] bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-colors group-hover:border-[var(--accent)] group-hover:bg-[var(--accent-muted)] group-hover:text-[var(--accent)]">
                 <Calendar size={16} />
             </div>
             
             {/* Card */}
             <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                 {editingId === item.id ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                       <div className="w-full max-w-2xl bg-[var(--bg)] rounded-xl shadow-xl overflow-hidden">
                          <TimelineForm item={item} onSubmit={(e: any) => handleEdit(item.id, e)} onCancel={() => setEditingId(null)} />
                       </div>
                    </div>
                 ) : (
                    <div className={!item.is_published ? 'opacity-50' : ''}>
                       <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono font-medium text-[var(--accent)] tracking-wider">
                             {formatDateShort(item.start_date)} — {item.is_current ? 'Present' : formatDateShort(item.end_date)}
                          </span>
                          <span className="badge badge-default uppercase">{item.type}</span>
                       </div>
                       
                       <h4 className="text-body font-semibold text-[var(--text-primary)] mb-0.5">{item.title}</h4>
                       <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">{item.organization}</p>
                       
                       {item.description && (
                          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">{item.description}</p>
                       )}
                       
                       <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                           <div className="text-xs text-[var(--text-tertiary)]">
                               {!item.is_published && "Draft"}
                           </div>
                           <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => setEditingId(item.id)} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent)] rounded"><Edit size={16}/></button>
                             <button onClick={() => handleDelete(item.id)} className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 rounded"><Trash2 size={16}/></button>
                           </div>
                       </div>
                    </div>
                 )}
             </div>
          </div>
        ))}
        {items.length === 0 && !isAdding && (
           <div className="text-center py-12 text-[var(--text-tertiary)]">
             No timeline events yet. Add your education or work history.
           </div>
        )}
      </div>
    </div>
  )
}
