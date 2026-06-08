'use server'

import { createClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/supabase/storage'

export async function uploadImageFromEditor(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return { error: 'Unauthorized' }
  }

  const file = formData.get('file') as File
  if (!file) {
    return { error: 'No file provided' }
  }

  const date = new Date()
  const path = `content/${date.getFullYear()}/${date.getMonth()+1}/${crypto.randomUUID()}`
  
  try {
    const result = await uploadFile('blog-images', path, file, file.type)
    return result
  } catch (err: any) {
    return { error: err.message || 'Upload failed' }
  }
}
