import { isAdmin } from '@/lib/admin-auth'
import { createHash } from 'crypto'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) return NextResponse.json({ error: 'Cloudinary is not configured.' }, { status: 503 })
  const input = await request.formData()
  const file = input.get('file')
  if (!(file instanceof File) || !file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Choose an image smaller than 8 MB.' }, { status: 400 })
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const folder = 'rafiferdos-portfolio'
  const signature = createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest('hex')
  const form = new FormData()
  form.append('file', file); form.append('api_key', apiKey); form.append('timestamp', timestamp); form.append('folder', folder); form.append('signature', signature)
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form })
  const data = await response.json()
  if (!response.ok) return NextResponse.json({ error: data.error?.message || 'Upload failed.' }, { status: 502 })
  return NextResponse.json({ url: data.secure_url })
}
