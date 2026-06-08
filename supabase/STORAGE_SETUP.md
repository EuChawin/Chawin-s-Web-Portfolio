# ============================================================
# Supabase Storage Bucket Setup Guide
# Run this AFTER the SQL migrations in Supabase Dashboard
# ============================================================

# The SQL in 006_storage.sql will create buckets automatically.
# If it fails (storage schema not accessible), create buckets
# manually using this guide.

## Manual Bucket Setup (Supabase Dashboard → Storage → New bucket)

| Bucket Name           | Public? | Max File Size | Allowed Types                              |
|-----------------------|---------|---------------|--------------------------------------------|
| profile-images        | YES     | 5 MB          | image/webp, image/jpeg, image/png          |
| project-images        | YES     | 10 MB         | image/webp, image/jpeg, image/png          |
| activity-images       | YES     | 10 MB         | image/webp, image/jpeg, image/png          |
| certification-images  | YES     | 5 MB          | image/webp, image/jpeg, image/png          |
| achievement-images    | YES     | 5 MB          | image/webp, image/jpeg, image/png          |
| blog-images           | YES     | 10 MB         | image/webp, image/jpeg, image/png, gif     |
| skill-icons           | YES     | 1 MB          | image/svg+xml, image/webp, image/png       |
| organization-logos    | YES     | 2 MB          | image/svg+xml, image/webp, image/png       |
| gallery-images        | NO      | 20 MB         | image/webp, image/jpeg, image/png, video/* |
| resume-files          | NO      | 10 MB         | application/pdf, application/docx          |

## Folder Structure

### profile-images/
  {user_id}/
    avatar.webp                    ← current avatar
    avatars/{timestamp}.webp       ← historical versions

### project-images/
  {project-slug}/
    cover.webp                     ← primary image
    gallery/001.webp               ← additional screenshots

### activity-images/
  {activity-slug}/
    cover.webp

### certification-images/
  {certification-id}/
    badge.webp
    certificate.webp               ← full certificate scan

### achievement-images/
  {achievement-id}/
    badge.webp

### gallery-images/
  public/                          ← publicly visible via RLS
    {year}/{month}/{uuid}.webp
    {year}/{month}/{uuid}_thumb.webp
  private/                         ← admin-only via RLS
    {year}/{month}/{uuid}.webp

### blog-images/
  {post-slug}/
    cover.webp
    {uuid}.webp                    ← inline images

### skill-icons/
  {skill-slug}.svg                 ← prefer SVG for logos

### organization-logos/
  {org-slug}.webp

### resume-files/
  {user_id}/
    {YYYY-MM-DD}_{label}.pdf       ← versioned by date

## Image Optimization Strategy

Before uploading, convert to WebP in the browser:

```javascript
async function convertToWebP(file: File, maxWidth: number, quality = 0.85): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const scale = Math.min(1, maxWidth / img.width)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => resolve(blob!), 'image/webp', quality)
    }
  })
}

// Usage targets:
// cover images:  maxWidth=1200, quality=0.85
// thumbnails:    maxWidth=400,  quality=0.80
// avatars:       maxWidth=512,  quality=0.90 (center-crop first)
// blog covers:   maxWidth=1600, quality=0.85
```

## Supabase Image Transformation (Built-in CDN)

Append URL params for on-the-fly resizing (no extra service needed):

```
https://xxx.supabase.co/storage/v1/render/image/public/project-images/slug/cover.webp
  ?width=800
  &quality=80
  &resize=contain
```

Supported params: width, height, quality, resize (cover/contain/fill)
