'use client'

import { useState } from 'react'
import type { GalleryCategoryDB } from '@/lib/types/database'
import type { GalleryItem } from '@/lib/types'
import { AlbumManager } from './AlbumManager'
import { PhotoGrid } from './PhotoGrid'
import { BulkUploader } from './BulkUploader'

export function GalleryManager({ 
  initialItems, 
  initialCategories 
}: { 
  initialItems: GalleryItem[], 
  initialCategories: GalleryCategoryDB[] 
}) {
  const [activeTab, setActiveTab] = useState<'photos' | 'albums' | 'upload'>('photos')

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-[var(--border)] pb-2">
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'photos'
              ? 'border-b-2 border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]'
          }`}
        >
          Photos
        </button>
        <button
          onClick={() => setActiveTab('albums')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'albums'
              ? 'border-b-2 border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]'
          }`}
        >
          Albums
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'upload'
              ? 'border-b-2 border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]'
          }`}
        >
          Upload
        </button>
      </div>

      <div>
        {activeTab === 'photos' && <PhotoGrid items={initialItems} categories={initialCategories} />}
        {activeTab === 'albums' && <AlbumManager categories={initialCategories} />}
        {activeTab === 'upload' && <BulkUploader categories={initialCategories} onUploadComplete={() => setActiveTab('photos')} />}
      </div>
    </div>
  )
}
