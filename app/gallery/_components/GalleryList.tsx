'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'
import { X, Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { GalleryCategoryDB } from '@/lib/types/database'
import type { GalleryItem } from '@/lib/types'
import { fetchGalleryPage } from '@/lib/actions/gallery-public'
import { useInView } from 'react-intersection-observer'

export function GalleryList({ 
  initialItems, 
  initialCount,
  categories 
}: { 
  initialItems: GalleryItem[]
  initialCount: number
  categories: GalleryCategoryDB[] 
}) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [items, setItems] = useState<GalleryItem[]>(initialItems)
  const [totalCount, setTotalCount] = useState<number>(initialCount)
  const [page, setPage] = useState<number>(1)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null)

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '400px',
  })

  // Reset and load category on switch
  const handleCategoryChange = async (categoryId: string) => {
    setActiveCategory(categoryId)
    setPage(1)
    setItems([])
    setIsLoadingMore(true)

    try {
      const result = await fetchGalleryPage(1, categoryId === 'all' ? undefined : categoryId)
      setItems(result.data)
      setTotalCount(result.count)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Load more on infinite scroll
  const loadMore = useCallback(async () => {
    if (isLoadingMore || items.length >= totalCount) return

    setIsLoadingMore(true)
    const nextPage = page + 1

    try {
      const result = await fetchGalleryPage(nextPage, activeCategory === 'all' ? undefined : activeCategory)
      if (result.data.length > 0) {
        setItems(prev => {
          // avoid duplicates just in case
          const existingIds = new Set(prev.map(i => i.id))
          const newItems = result.data.filter(i => !existingIds.has(i.id))
          return [...prev, ...newItems]
        })
        setPage(nextPage)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, items.length, totalCount, page, activeCategory])

  useEffect(() => {
    if (inView && items.length > 0 && items.length < totalCount) {
      loadMore()
    }
  }, [inView, items.length, totalCount, loadMore])

  const featuredItems = items.filter(item => item.is_featured)
  const regularItems = items.filter(item => !item.is_featured)

  return (
    <>
      {/* Category filter */}
      <Reveal delay={0.2}>
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => handleCategoryChange('all')}
            className={cn(
              "px-4 py-1.5 rounded-full text-body-sm font-medium border transition-all duration-200",
              activeCategory === 'all'
                ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
            )}
          >
            All Photos
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-body-sm font-medium border transition-all duration-200 group relative",
                activeCategory === cat.id
                  ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
              )}
            >
              {cat.title}
              {cat.description && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-[200px] bg-[var(--bg-surface-2)] border border-[var(--border)] px-3 py-2 rounded-lg text-xs text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl">
                   {cat.description}
                </div>
              )}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="space-y-12">
        {/* Featured Section (only in 'all' view if there are featured items) */}
        {activeCategory === 'all' && featuredItems.length > 0 && (
          <Reveal delay={0.25}>
            <div className="mb-8">
               <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-tertiary)] mb-4">Featured Highlights</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                 {featuredItems.slice(0, 3).map((item) => (
                   <button
                     key={`featured-${item.id}`}
                     onClick={() => setLightboxItem(item)}
                     className="group relative rounded-xl overflow-hidden cursor-zoom-in transition-transform duration-300 hover:-translate-y-1 aspect-[4/3] bg-[var(--bg-surface-2)] border border-[var(--border)]"
                   >
                     {item.file_type === 'video' ? (
                       <video src={item.file_url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                     ) : (
                       <Image src={item.file_url} alt={item.title || item.alt_text || "Gallery image"} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                       {item.title && <p className="text-white font-medium text-left line-clamp-1">{item.title}</p>}
                       {item.category_data && <p className="text-white/70 text-xs text-left mt-1">{item.category_data.title}</p>}
                     </div>
                   </button>
                 ))}
               </div>
            </div>
          </Reveal>
        )}

        {/* Regular Grid */}
        <Reveal delay={0.3}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px]">
            {regularItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setLightboxItem(item)}
                className="group relative rounded-xl overflow-hidden cursor-zoom-in transition-all duration-300 hover:-translate-y-1 bg-[var(--bg-surface-2)] border border-[var(--border)]"
              >
                {item.file_type === 'video' ? (
                  <video src={item.file_url} className="w-full h-full object-cover" muted loop playsInline onMouseEnter={e => e.currentTarget.play()} onMouseLeave={e => e.currentTarget.pause()} />
                ) : (
                  <Image src={item.file_url} alt={item.title || item.alt_text || "Gallery image"} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex flex-col justify-end">
                  <p className="text-white text-body-sm font-medium text-left line-clamp-2">{item.title}</p>
                </div>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Infinite Scroll Trigger */}
        {items.length > 0 && items.length < totalCount && (
          <div ref={ref} className="py-10 flex justify-center">
            {isLoadingMore && <Loader2 className="animate-spin text-[var(--accent)]" size={24} />}
          </div>
        )}

        {items.length === 0 && !isLoadingMore && (
          <div className="text-center py-24 border border-dashed rounded-xl border-[var(--border)]">
            <p className="text-[var(--text-tertiary)]">No images in this album yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ background: "rgba(0,0,0,0.95)" }}
            onClick={() => setLightboxItem(null)}
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors z-50"
              aria-label="Close"
            >
              <X size={18} className="text-white" />
            </button>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4 max-w-5xl w-full h-full justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-h-[75vh] flex-1 rounded-xl flex items-center justify-center overflow-hidden bg-transparent">
                {lightboxItem.file_type === 'video' ? (
                  <video src={lightboxItem.file_url} className="w-full h-full object-contain" controls autoPlay playsInline />
                ) : (
                  <Image src={lightboxItem.file_url} alt={lightboxItem.title || "Image"} fill className="object-contain" />
                )}
              </div>
              
              <div className="text-center max-w-2xl px-4">
                <p className="text-white font-medium text-lg sm:text-xl">{lightboxItem.title}</p>
                {lightboxItem.description && (
                  <p className="text-white/80 text-sm mt-2">{lightboxItem.description}</p>
                )}
                
                <div className="flex items-center justify-center gap-3 mt-3">
                  {lightboxItem.category_data && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-white/10 text-white/90">
                      {lightboxItem.category_data.title}
                    </span>
                  )}
                  {lightboxItem.taken_at && (
                    <span className="text-white/50 text-xs">
                      {new Date(lightboxItem.taken_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
