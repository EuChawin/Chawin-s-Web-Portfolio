'use client'

import { useState } from 'react'
import Image from 'next/image'

interface RecommenderAvatarProps {
  name: string
  initials: string
  image: string
  size?: 'sm' | 'lg'
}

export function RecommenderAvatar({ name, initials, image, size = 'sm' }: RecommenderAvatarProps) {
  const [imgError, setImgError] = useState(false)

  const sizeClasses = size === 'lg' 
    ? 'w-20 h-20 md:w-24 md:h-24 text-2xl md:text-3xl' 
    : 'w-14 h-14 text-xl'

  if (imgError || !image) {
    return (
      <div className={`${sizeClasses} shrink-0 rounded-full bg-[var(--bg-surface-2)] flex items-center justify-center font-serif text-[var(--text-secondary)] border-2 border-[var(--border)]`}>
        {initials}
      </div>
    )
  }

  return (
    <div className={`${sizeClasses} shrink-0 relative rounded-full overflow-hidden border-2 border-[var(--border)] bg-[var(--bg-surface-2)]`}>
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover"
        sizes={size === 'lg' ? '96px' : '56px'}
        onError={() => setImgError(true)}
      />
    </div>
  )
}
