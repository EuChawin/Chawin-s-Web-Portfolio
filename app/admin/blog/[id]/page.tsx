import { adminGetBlogPostById } from '@/lib/supabase/admin-queries'
import { BlogPostForm } from '../_components/BlogPostForm'
import { notFound } from 'next/navigation'

export const metadata = { title: 'Edit Post | Admin CMS' }

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await adminGetBlogPostById(id)

  if (!post) {
    notFound()
  }

  return <BlogPostForm initialData={post} isEdit />
}
