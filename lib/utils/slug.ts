// lib/utils/slug.ts
// Slug generation and reading time helpers for the CMS

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // remove special chars
    .replace(/[\s_-]+/g, '-')  // spaces/underscores to hyphens
    .replace(/^-+|-+$/g, '')   // trim leading/trailing hyphens
}

export function estimateReadingTime(content: string): number {
  // Strip HTML tags for word count
  const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = text.split(' ').filter(Boolean).length
  const wpm = 200 // average reading speed
  return Math.max(1, Math.ceil(wordCount / wpm))
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}
