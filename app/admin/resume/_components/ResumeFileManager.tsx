'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, CheckCircle2, Circle, Trash2, FileText, Loader2 } from 'lucide-react'
import { uploadResumeFile, setActiveResumeFile, deleteResumeFile } from '@/lib/actions/resume'
import type { ResumeFile } from '@/lib/types/database'

interface ResumeFileManagerProps {
  files: ResumeFile[]
}

export function ResumeFileManager({ files }: ResumeFileManagerProps) {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [versionNotes, setVersionNotes] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }

    setIsUploading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (versionNotes) formData.append('version_notes', versionNotes)
      // If it's the first file, make it active automatically
      formData.append('is_active', files.length === 0 ? 'true' : 'false')

      const result = await uploadResumeFile(formData)
      if (result.error) throw new Error(result.error)
      
      setVersionNotes('')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSetActive = async (id: string) => {
    try {
      await setActiveResumeFile(id)
      router.refresh()
    } catch (err) {
      alert('Failed to set active resume')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resume version?')) return
    try {
      const res = await deleteResumeFile(id)
      if (res.error) alert(res.error)
      else router.refresh()
    } catch (err) {
      alert('Failed to delete resume')
    }
  }

  return (
    <div className="card p-6">
      <h3 className="font-medium text-[var(--text-primary)] border-b border-[var(--border)] pb-3 mb-6 flex items-center gap-2">
        <FileText size={18} /> Resume PDF Manager
      </h3>
      
      {error && (
        <div className="p-3 mb-6 rounded-md bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Upload area */}
      <div className="mb-8 p-6 border-2 border-dashed border-[var(--border)] rounded-lg bg-[var(--bg-surface-2)]">
         <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full space-y-3">
               <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Version Notes (Optional)</label>
                  <input 
                    type="text" 
                    value={versionNotes}
                    onChange={(e) => setVersionNotes(e.target.value)}
                    placeholder="e.g. Updated for 2025 AI roles"
                    className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-sm"
                  />
               </div>
            </div>
            
            <div className="shrink-0 flex flex-col items-center justify-center w-full md:w-auto">
              <label className="btn-primary cursor-pointer w-full md:w-auto justify-center">
                 {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                 {isUploading ? 'Uploading...' : 'Upload PDF'}
                 <input type="file" className="hidden" accept="application/pdf" onChange={handleUpload} disabled={isUploading}/>
              </label>
              <p className="text-xs text-[var(--text-tertiary)] mt-2 text-center">PDF max 5MB</p>
            </div>
         </div>
      </div>

      {/* Version List */}
      <div>
        <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3 uppercase tracking-wider">Version History</h4>
        
        {files.length === 0 ? (
           <div className="text-center py-6 text-[var(--text-tertiary)] text-sm italic">
              No resumes uploaded yet.
           </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${file.is_active ? 'border-[var(--accent)] bg-[var(--accent-muted)]' : 'border-[var(--border)] hover:bg-[var(--bg-surface-2)]'}`}>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => !file.is_active && handleSetActive(file.id)}
                    className={file.is_active ? 'text-[var(--accent)] cursor-default' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}
                    title={file.is_active ? 'Current Active Version' : 'Set as Active'}
                  >
                    {file.is_active ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <div>
                    <p className="font-medium text-[var(--text-primary)] text-sm flex items-center gap-2">
                       {file.file_name}
                       {file.is_active && <span className="badge badge-accent text-[10px]">Active</span>}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-secondary)]">
                       <span>Uploaded: {new Date(file.created_at).toLocaleDateString()}</span>
                       {file.notes && (
                         <>
                           <span>&bull;</span>
                           <span className="italic">"{file.notes}"</span>
                         </>
                       )}
                    </div>
                  </div>
                </div>
                
                {!file.is_active && (
                   <button 
                     onClick={() => handleDelete(file.id)} 
                     className="p-2 text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                     title="Delete"
                   >
                     <Trash2 size={16} />
                   </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
