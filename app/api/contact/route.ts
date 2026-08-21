import { contentBackendConfigured, insertRecord } from '@/lib/content-store'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  if (body.website) return NextResponse.json({ ok: true })
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const subject = String(body.subject || '').trim()
  const message = String(body.message || '').trim()
  if (!name || !email.includes('@') || !subject || message.length < 10)
    return NextResponse.json(
      { error: 'Please complete every field.' },
      { status: 400 }
    )
  const record = { name, email, subject, message, status: 'new' }
  if (contentBackendConfigured()) await insertRecord('messages', record)
  else if (process.env.CONTACT_WEBHOOK_URL) {
    const response = await fetch(process.env.CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(record)
    })
    if (!response.ok)
      return NextResponse.json({ error: 'Unable to send.' }, { status: 502 })
  } else
    return NextResponse.json(
      { error: 'Contact backend is not configured.' },
      { status: 503 }
    )
  return NextResponse.json({ ok: true })
}
