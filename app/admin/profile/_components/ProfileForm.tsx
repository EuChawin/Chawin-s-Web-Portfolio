'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2 } from 'lucide-react'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { updateProfile } from '@/lib/actions/profile'
import type { Profile } from '@/lib/types/database'

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      if (avatarFile) formData.set('avatar', avatarFile)

      const result = await updateProfile(formData)
      if (result.error) throw new Error(result.error)

      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-h2 mb-1">Profile</h1>
          <p className="text-body-sm text-[var(--text-secondary)]">Manage your personal information and bio</p>
        </div>
        <button type="submit" disabled={isSaving} className="btn-primary py-2 px-5 text-sm">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Profile
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-5">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
                  <input id="full_name" name="full_name" required defaultValue={profile.full_name} className="w-full px-4 py-2.5 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]" />
               </div>
               <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Contact Email</label>
                  <input id="email" name="email" required type="email" defaultValue={profile.email || ''} className="w-full px-4 py-2.5 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]" />
               </div>
               <div className="md:col-span-2">
                  <label htmlFor="headline" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Headline</label>
                  <input id="headline" name="headline" required defaultValue={profile.headline || ''} className="w-full px-4 py-2.5 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]" placeholder="e.g. Computer Engineering Student & Builder" />
               </div>
             </div>
          </div>

          <div className="card p-6 space-y-5">
             <div>
                <label htmlFor="bio_short" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Short Bio (Hero section)</label>
                <textarea id="bio_short" name="bio_short" rows={3} required defaultValue={profile.bio_short || ''} className="w-full px-4 py-2.5 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)] resize-y" />
             </div>
             <div>
                <label htmlFor="bio_long" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Long Bio (About page)</label>
                <textarea id="bio_long" name="bio_long" rows={6} defaultValue={profile.bio_long || ''} className="w-full px-4 py-2.5 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)] resize-y" />
             </div>
          </div>
          
          <div className="card p-6 space-y-5">
             <h3 className="font-medium text-[var(--text-primary)] border-b border-[var(--border)] pb-3 mb-4">Social Links</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div>
                  <label htmlFor="github_url" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">GitHub URL</label>
                  <input id="github_url" name="github_url" type="url" defaultValue={profile.github_url || ''} className="w-full px-4 py-2.5 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)]" />
               </div>
               <div>
                  <label htmlFor="linkedin_url" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">LinkedIn URL</label>
                  <input id="linkedin_url" name="linkedin_url" type="url" defaultValue={profile.linkedin_url || ''} className="w-full px-4 py-2.5 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)]" />
               </div>
               <div>
                  <label htmlFor="twitter_url" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Twitter / X URL</label>
                  <input id="twitter_url" name="twitter_url" type="url" defaultValue={profile.twitter_url || ''} className="w-full px-4 py-2.5 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)]" />
               </div>
               <div>
                  <label htmlFor="location" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Location</label>
                  <input id="location" name="location" defaultValue={profile.location || ''} className="w-full px-4 py-2.5 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]" placeholder="e.g. Bangkok, Thailand" />
               </div>
             </div>
          </div>

          {/* Metrics — "By the Numbers" */}
          <div className="card p-6 space-y-5">
            <div className="border-b border-[var(--border)] pb-3 mb-4">
              <h3 className="font-medium text-[var(--text-primary)]">By the Numbers</h3>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">These values power the metrics strip on the homepage.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="gpa" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">GPA</label>
                <input
                  id="gpa" name="gpa" type="number" step="0.01" min="0" max="4"
                  defaultValue={profile.gpa || ''}
                  placeholder="e.g. 3.8"
                  className="w-full px-4 py-2.5 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label htmlFor="ielts_score" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">IELTS Score</label>
                <input
                  id="ielts_score" name="ielts_score" type="number" step="0.5" min="0" max="9"
                  defaultValue={(profile.metadata as Record<string,unknown>)?.['ielts_score'] as string || ''}
                  placeholder="e.g. 7.0"
                  className="w-full px-4 py-2.5 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label htmlFor="countries_count" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Countries</label>
                <input
                  id="countries_count" name="countries_count" type="number" step="1" min="0"
                  defaultValue={(profile.metadata as Record<string,unknown>)?.['countries_count'] as string || ''}
                  placeholder="e.g. 2"
                  className="w-full px-4 py-2.5 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label htmlFor="certifications_count" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Certifications</label>
                <input
                  id="certifications_count" name="certifications_count" type="number" step="1" min="0"
                  defaultValue={(profile.metadata as Record<string,unknown>)?.['certifications_count'] as string || ''}
                  placeholder="e.g. 10"
                  className="w-full px-4 py-2.5 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label htmlFor="projects_count" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Projects</label>
                <input
                  id="projects_count" name="projects_count" type="number" step="1" min="0"
                  defaultValue={(profile.metadata as Record<string,unknown>)?.['projects_count'] as string || ''}
                  placeholder="e.g. 5"
                  className="w-full px-4 py-2.5 rounded-md border text-body-sm bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <ImageUpload 
              initialImage={profile.avatar_url}
              onImageChange={setAvatarFile}
              label="Profile Avatar"
              aspectRatio="square"
            />
          </div>
        </div>
      </div>
    </form>
  )
}
