import { createClient } from '@/lib/supabase/client'
import { useState, useRef } from 'react'
import { Image as ImageIcon, X, UploadCloud, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  initialImage?: string | null
  onImageChange: (file: File | null) => void
  label?: string
  aspectRatio?: 'video' | 'square' | 'auto'
}

export function ImageUpload({ 
  initialImage, 
  onImageChange, 
  label = "Cover Image",
  aspectRatio = 'video'
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return

    setIsProcessing(true)
    
    try {
      // Create a local preview immediately
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      
      // In a production app with more time, we would implement the 
      // canvas-based WebP conversion here as outlined in STORAGE_SETUP.md.
      // For now, we pass the raw file to the server action.
      onImageChange(file)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const aspectClass = 
    aspectRatio === 'video' ? 'aspect-video' : 
    aspectRatio === 'square' ? 'aspect-square' : 
    'aspect-auto min-h-[200px]'

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      
      <div 
        className={`relative border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
          isDragging ? 'border-[var(--accent)] bg-[var(--accent-muted)]' : 'border-[var(--border)] hover:bg-[var(--bg-surface-2)]'
        } ${aspectClass}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
               <button
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                 title="Change image"
               >
                 <ImageIcon size={18} />
               </button>
               <button
                 type="button"
                 onClick={handleRemove}
                 className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                 title="Remove image"
               >
                 <X size={18} />
               </button>
            </div>
          </>
        ) : (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-tertiary)] cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {isProcessing ? (
              <Loader2 size={32} className="animate-spin mb-2" />
            ) : (
              <UploadCloud size={32} className="mb-2" />
            )}
            <p className="text-sm font-medium text-[var(--text-secondary)]">Click or drag image to upload</p>
            <p className="text-xs mt-1">WebP, PNG, JPG up to 10MB</p>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0])
            }
          }}
        />
      </div>
    </div>
  )
}
