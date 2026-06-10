'use client'

import { useState, useRef, useCallback } from 'react'
import type { GalleryCategoryDB } from '@/lib/types/database'
import { uploadGalleryItem } from '@/lib/actions/gallery'
import { UploadCloud, FileImage, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface UploadFile {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export function BulkUploader({ 
  categories,
  onUploadComplete
}: { 
  categories: GalleryCategoryDB[]
  onUploadComplete: () => void
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'))
    
    if (validFiles.length !== newFiles.length) {
      alert('Some files were ignored because they are not images or videos.')
    }

    const newUploadFiles: UploadFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: 'pending'
    }))

    setFiles(prev => [...prev, ...newUploadFiles])
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const startUpload = async () => {
    if (files.length === 0) return
    setIsUploading(true)

    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error')
    
    // Concurrency limit of 5
    const CONCURRENCY = 5
    let index = 0

    const uploadNext = async (): Promise<void> => {
      if (index >= pendingFiles.length) return
      
      const currentIndex = index++
      const uploadFile = pendingFiles[currentIndex]
      
      // Update status to uploading
      setFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: 'uploading', progress: 10 } : f))

      try {
        const formData = new FormData()
        formData.append('file', uploadFile.file)
        formData.append('is_public', 'true')
        formData.append('is_published', 'true')
        formData.append('title', uploadFile.file.name.split('.')[0])
        
        if (selectedCategory) {
          formData.append('category_id', selectedCategory)
        }

        // We use server action which handles upload directly, can't track real progress easily without presigned URLs,
        // so we fake progress to 90% then 100% on success.
        setFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, progress: 90 } : f))
        
        const result = await uploadGalleryItem(formData)
        
        if (result.error) {
          throw new Error(result.error)
        }

        setFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: 'success', progress: 100 } : f))
      } catch (err: any) {
        setFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: 'error', error: err.message || 'Upload failed' } : f))
      }

      await uploadNext()
    }

    const workers = Array(Math.min(CONCURRENCY, pendingFiles.length)).fill(null).map(() => uploadNext())
    await Promise.all(workers)

    setIsUploading(false)
  }

  const pendingCount = files.filter(f => f.status === 'pending').length
  const successCount = files.filter(f => f.status === 'success').length
  const errorCount = files.filter(f => f.status === 'error').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Bulk Upload</h3>
        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={isUploading}
            className="bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="">No Album (Uncategorized)</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          <button 
            onClick={startUpload} 
            disabled={isUploading || pendingCount === 0}
            className="btn-primary flex items-center gap-2"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            Upload {pendingCount > 0 ? pendingCount : ''} Files
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
          dragActive ? 'border-[var(--accent)] bg-[var(--accent-muted)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)]'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center max-w-md mx-auto pointer-events-none">
          <UploadCloud size={40} className="text-[var(--text-tertiary)] mb-4" />
          <h3 className="font-medium text-[var(--text-primary)] mb-1">
            Drag & Drop Media Here
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            or click to select multiple files
          </p>
        </div>
        <input 
          type="file" 
          multiple 
          accept="image/*,video/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          disabled={isUploading}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--bg-surface)]">
            <h4 className="font-medium text-sm">
              Upload Queue ({files.length})
            </h4>
            <div className="flex gap-4 text-sm text-[var(--text-secondary)]">
               <span className="text-emerald-500">{successCount} successful</span>
               {errorCount > 0 && <span className="text-red-500">{errorCount} failed</span>}
               {successCount > 0 && !isUploading && pendingCount === 0 && (
                 <button onClick={onUploadComplete} className="text-[var(--accent)] hover:underline ml-4">
                   View Photos →
                 </button>
               )}
            </div>
          </div>
          <div className="max-h-[400px] overflow-y-auto p-2">
            <div className="space-y-2">
              {files.map(f => (
                <div key={f.id} className="flex items-center gap-3 p-3 bg-[var(--bg-surface)] rounded-lg border border-[var(--border)]">
                  <FileImage size={20} className="text-[var(--text-tertiary)] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium truncate">{f.file.name}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">{(f.file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    {f.status === 'uploading' && (
                      <div className="w-full bg-[var(--bg-surface-2)] rounded-full h-1.5">
                        <div className="bg-[var(--accent)] h-1.5 rounded-full transition-all duration-300" style={{ width: `${f.progress}%` }}></div>
                      </div>
                    )}
                    {f.status === 'error' && <p className="text-xs text-red-500 mt-1">{f.error}</p>}
                  </div>
                  
                  <div className="shrink-0 w-8 flex justify-end">
                    {f.status === 'pending' && (
                      <button onClick={(e) => { e.stopPropagation(); removeFile(f.id) }} className="text-[var(--text-tertiary)] hover:text-red-500">
                        <X size={16} />
                      </button>
                    )}
                    {f.status === 'uploading' && <Loader2 size={16} className="text-[var(--accent)] animate-spin" />}
                    {f.status === 'success' && <CheckCircle size={16} className="text-emerald-500" />}
                    {f.status === 'error' && <AlertCircle size={16} className="text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
