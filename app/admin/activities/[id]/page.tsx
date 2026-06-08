import { adminGetActivityById } from '@/lib/supabase/admin-queries'
import { ActivityForm } from '../_components/ActivityForm'
import { notFound } from 'next/navigation'

export const metadata = { title: 'Edit Activity | Admin CMS' }

export default async function EditActivityPage({ params }: { params: { id: string } }) {
  const activity = await adminGetActivityById(params.id)

  if (!activity) {
    notFound()
  }

  return <ActivityForm initialData={activity} isEdit />
}
