// lib/supabase/storage.ts
// Image upload utilities for the admin CMS.
// All uploads go through the server client (anon key + auth session).
// The authenticated admin user has INSERT permission via storage RLS.

import { createClient } from '@/lib/supabase/server'

export type UploadResult = { url: string; path: string } | { error: string }

// Generic file uploader — returns the public URL
export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob,
  contentType?: string
): Promise<UploadResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: contentType ?? file.type,
      upsert: true, // overwrite if exists (for cover image replacement)
    })

  if (error) return { error: error.message }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return { url: urlData.publicUrl, path: data.path }
}

// Delete a file from storage
export async function deleteFile(bucket: string, path: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) return { error: error.message }
  return {}
}

// Generate a signed URL for private buckets (resume-files)
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 60 // seconds
): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)
  return data?.signedUrl ?? null
}

// Build a Supabase image transform URL for on-the-fly resizing
export function getTransformUrl(
  publicUrl: string,
  options: { width?: number; height?: number; quality?: number; resize?: 'cover' | 'contain' | 'fill' }
): string {
  if (!publicUrl.includes('supabase.co')) return publicUrl
  // Replace /object/public/ with /render/image/public/
  const renderUrl = publicUrl.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/')
  const params = new URLSearchParams()
  if (options.width)   params.set('width', String(options.width))
  if (options.height)  params.set('height', String(options.height))
  if (options.quality) params.set('quality', String(options.quality))
  if (options.resize)  params.set('resize', options.resize)
  return `${renderUrl}?${params.toString()}`
}
