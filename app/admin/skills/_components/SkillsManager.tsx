'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Edit, Trash2, Loader2, GripVertical } from 'lucide-react'
import { addSkill, updateSkill, deleteSkill, reorderSkills } from '@/lib/actions/skills'
import type { Skill } from '@/lib/types/database'

const SKILL_CATEGORIES = ['Languages', 'Frameworks', 'Tools', 'Hardware', 'Soft Skills']

export function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Group skills by category for display
  const skillsByCategory = SKILL_CATEGORIES.reduce((acc, category) => {
    acc[category] = initialSkills.filter(s => s.category === category).sort((a, b) => a.display_order - b.display_order)
    return acc
  }, {} as Record<string, Skill[]>)
  
  // Add any skills with unknown categories to an "Other" group
  const knownCategorySkills = new Set(Object.values(skillsByCategory).flat().map(s => s.id))
  const otherSkills = initialSkills.filter(s => !knownCategorySkills.has(s.id)).sort((a, b) => a.display_order - b.display_order)
  if (otherSkills.length > 0) {
      skillsByCategory['Other'] = otherSkills
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const formData = new FormData(e.currentTarget)
      const category = formData.get('category') as string
      // Put at the end of the selected category
      const order = (skillsByCategory[category]?.length || 0)
      formData.append('display_order', order.toString())
      
      await addSkill(formData)
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
      await updateSkill(id, new FormData(e.currentTarget))
      setEditingId(null)
      router.refresh()
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    await deleteSkill(id)
    router.refresh()
  }

  const moveItem = async (category: string, index: number, direction: 'up' | 'down') => {
    const list = skillsByCategory[category]
    if (!list) return
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === list.length - 1)) return
    
    const newItems = [...list]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    // Swap
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp
    
    // Update orders
    const updates = newItems.map((item, i) => ({ id: item.id, display_order: i }))
    
    await reorderSkills(updates)
    router.refresh()
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button onClick={() => setIsAdding(true)} className="btn-primary py-2 text-sm" disabled={isAdding}>
          <PlusCircle size={16} /> Add Skill
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="card p-5 border-[var(--accent)] bg-[var(--accent-muted)] mb-8">
           <h3 className="font-medium mb-4">New Skill</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="lg:col-span-2">
                 <input name="name" required placeholder="Skill name (e.g., Python)" className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50" />
              </div>
              <div>
                 <select name="category" required className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50">
                    {SKILL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    <option value="Other">Other</option>
                 </select>
              </div>
              <div>
                 <input name="proficiency" type="number" min="1" max="100" placeholder="Proficiency % (optional)" className="w-full px-3 py-2 rounded border bg-white dark:bg-black/50" />
              </div>
           </div>
           <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                 <input type="checkbox" name="is_published" defaultChecked className="rounded" /> Published
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

      {Object.entries(skillsByCategory).map(([category, items]) => {
         if (items.length === 0 && category !== 'Other') return null
         
         return (
           <div key={category} className="mb-8">
             <h3 className="font-medium text-[var(--text-secondary)] uppercase tracking-wider text-xs mb-3">{category}</h3>
             
             <div className="card divide-y divide-[var(--border)]">
               {items.map((item, index) => (
                 <div key={item.id}>
                   {editingId === item.id ? (
                     <form onSubmit={(e) => handleEdit(item.id, e)} className="p-4 bg-[var(--bg-surface-2)]">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                           <div className="md:col-span-2">
                              <input name="name" required defaultValue={item.name} className="w-full px-3 py-2 rounded border bg-[var(--bg)]" />
                           </div>
                           <div>
                              <select name="category" required defaultValue={item.category} className="w-full px-3 py-2 rounded border bg-[var(--bg)]">
                                 {SKILL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                 <option value="Other">Other</option>
                              </select>
                           </div>
                        </div>
                        <input type="hidden" name="display_order" value={item.display_order} />
                        <div className="flex items-center justify-between">
                           <label className="flex items-center gap-2 text-sm">
                              <input type="checkbox" name="is_published" defaultChecked={item.is_published} className="rounded" /> Published
                           </label>
                           <div className="flex gap-2">
                              <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1.5 text-sm hover:bg-[var(--bg)] rounded border">Cancel</button>
                              <button type="submit" disabled={isSaving} className="btn-primary py-1.5 px-4 text-sm">Save</button>
                           </div>
                        </div>
                     </form>
                   ) : (
                     <div className={`p-4 flex items-center justify-between group ${!item.is_published ? 'opacity-50' : ''}`}>
                       <div className="flex items-center gap-4">
                         <div className="flex flex-col gap-1 text-[var(--text-tertiary)]">
                            <button onClick={() => moveItem(category, index, 'up')} disabled={index === 0} className="hover:text-[var(--accent)] disabled:opacity-30">▲</button>
                            <button onClick={() => moveItem(category, index, 'down')} disabled={index === items.length - 1} className="hover:text-[var(--accent)] disabled:opacity-30">▼</button>
                         </div>
                         <div>
                           <p className="font-medium text-[var(--text-primary)]">{item.name}</p>
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
               {items.length === 0 && (
                  <div className="p-4 text-sm text-[var(--text-tertiary)] italic">No skills in this category.</div>
               )}
             </div>
           </div>
         )
      })}
    </div>
  )
}
