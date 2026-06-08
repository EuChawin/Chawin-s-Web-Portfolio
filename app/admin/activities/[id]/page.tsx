import { adminGetActivityById } from '@/lib/supabase/admin-queries'
import { ActivityForm } from '../_components/ActivityForm'
import { notFound } from 'next/navigation'

export const metadata = { title: 'Edit Activity | Admin CMS' }

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const activity = await adminGetActivityById(id)

  if (!activity) {
    notFound()
  }

  return <ActivityForm initialData={activity} isEdit />
}
