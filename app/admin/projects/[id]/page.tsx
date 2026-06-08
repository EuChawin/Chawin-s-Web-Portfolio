import { adminGetProjectById } from '@/lib/supabase/admin-queries'
import { ProjectForm } from '../_components/ProjectForm'
import { notFound } from 'next/navigation'

export const metadata = { title: 'Edit Project | Admin CMS' }

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await adminGetProjectById(params.id)

  if (!project) {
    notFound()
  }

  return <ProjectForm initialData={project} isEdit />
}
