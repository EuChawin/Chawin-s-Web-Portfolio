'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Edit, Trash2, CheckCircle2, GripVertical, Save, X, Loader2 } from 'lucide-react'
import { addCurrently, updateCurrently, deleteCurrently, reorderCurrently } from '@/lib/actions/currently'
import type { Currently } from '@/lib/types/database'

export function CurrentlyManager({ items }: { items: Currently[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const formData = new FormData(e.currentTarget)
      formData.append('display_order', items.length.toString())
      await addCurrently(formData)
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
      await updateCurrently(id, new FormData(e.currentTarget))
      setEditingId(null)
      router.refresh()
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return
    await deleteCurrently(id)
    router.refresh()
  }

  // Simplified drag and drop - just move up/down
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
    
    await reorderCurrently(updates)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsAdding(true)} 
          className="btn-primary py-2 text-sm"
          disabled={isAdding}
        >
          <PlusCircle size={16} /> Add Item
        </button>
      </div>

      <div className="space-y-3">
        {/* Add Form */}
        {isAdding && (
          <form onSubmit={handleAdd} className="card p-4 border-[var(--accent)] bg-[var(--accent-muted)]">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                   <input name="title" required placeholder="What are you doing? (e.g., Reading 'Dune')" className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50" />
                </div>
                <div>
                   <input name="url" placeholder="Optional URL" className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50" />
                </div>
                <div>
                   <input name="emoji" placeholder="Emoji (e.g., 📖)" className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50" />
                </div>
             </div>
             <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                   <input type="checkbox" name="is_active" defaultChecked className="rounded" /> Active
                </label>
                <div className="flex gap-2">
                   <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-sm hover:bg-black/5 rounded">Cancel</button>
                   <button type="submit" disabled={isSaving} className="btn-primary py-1.5 px-4 text-sm">
                      {isSaving ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
                   </button>
                </div>
             </div>
          </form>
        )}

        {/* Item List */}
        {items.map((item, index) => (
          <div key={item.id}>
            {editingId === item.id ? (
              <form onSubmit={(e) => handleEdit(item.id, e)} className="card p-4 border-[var(--border)]">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                       <input name="title" required defaultValue={item.title} className="w-full px-3 py-2 rounded border bg-[var(--bg)]" />
                    </div>
                    <div>
                       <input name="url" defaultValue={item.url || ''} placeholder="URL" className="w-full px-3 py-2 rounded border bg-[var(--bg)]" />
                    </div>
                    <div>
                       <input name="emoji" defaultValue={item.emoji || ''} placeholder="Emoji" className="w-full px-3 py-2 rounded border bg-[var(--bg)]" />
                    </div>
                    <input type="hidden" name="display_order" value={item.display_order} />
                 </div>
                 <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                       <input type="checkbox" name="is_active" defaultChecked={item.is_active} className="rounded" /> Active
                    </label>
                    <div className="flex gap-2">
                       <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1.5 text-sm hover:bg-[var(--bg-surface-2)] rounded">Cancel</button>
                       <button type="submit" disabled={isSaving} className="btn-primary py-1.5 px-4 text-sm">Save</button>
                    </div>
                 </div>
              </form>
            ) : (
              <div className={`card p-4 flex items-center justify-between group ${!item.is_active ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1 text-[var(--text-tertiary)]">
                     <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="hover:text-[var(--accent)] disabled:opacity-30">▲</button>
                     <button onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1} className="hover:text-[var(--accent)] disabled:opacity-30">▼</button>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{item.title}</p>
                    <div className="flex gap-3 text-xs text-[var(--text-tertiary)] mt-1">
                       {item.url && <span>{item.url}</span>}
                       {item.emoji && <span>Emoji: {item.emoji}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingId(item.id)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] rounded"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500 rounded"><Trash2 size={16}/></button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {items.length === 0 && !isAdding && (
           <div className="text-center py-8 border border-dashed rounded-lg text-[var(--text-tertiary)]">
             No items yet. Add something you are currently doing.
           </div>
        )}
      </div>
    </div>
  )
}
