import {
  contentBackendConfigured,
  insertRecord,
  updateRecord
} from '@/lib/content-store'
import { contactSchema } from '@/lib/validation/contact'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      })[character]!
  )
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    )
  }
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Please complete every field correctly.' },
      { status: 400 }
    )
  if (parsed.data.website) return NextResponse.json({ ok: true })
  if (!contentBackendConfigured())
    return NextResponse.json(
      { error: 'Contact storage is not configured.' },
      { status: 503 }
    )

  const record = {
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message
  }
  let saved: Awaited<ReturnType<typeof insertRecord>>
  try {
    saved = await insertRecord('messages', { ...record, status: 'new' })
  } catch (error) {
    console.error('Contact storage failed', error)
    return NextResponse.json(
      { error: 'Your message could not be saved. Please email me directly.' },
      { status: 503 }
    )
  }

  const savedId =
    typeof saved === 'object' && saved && 'id' in saved ? String(saved.id) : ''
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL
  const to = process.env.CONTACT_NOTIFICATION_TO || 'rafiferdos@gmail.com'
  let emailDelivered = false
  let notificationError = ''

  if (apiKey && from) {
    try {
      const resend = new Resend(apiKey)
      const { error } = await resend.emails.send({
        from,
        to,
        replyTo: record.email,
        subject: `Portfolio enquiry · ${record.subject}`,
        text: `From: ${record.name} <${record.email}>\nSubject: ${record.subject}\n\n${record.message}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto"><p style="color:#666">New portfolio enquiry</p><h1 style="font-size:24px">${escapeHtml(record.subject)}</h1><p><strong>${escapeHtml(record.name)}</strong><br><a href="mailto:${escapeHtml(record.email)}">${escapeHtml(record.email)}</a></p><div style="white-space:pre-wrap;line-height:1.7;border-top:1px solid #ddd;padding-top:20px">${escapeHtml(record.message)}</div></div>`
      })
      if (error) throw new Error(error.message)
      emailDelivered = true
    } catch (error) {
      notificationError =
        error instanceof Error ? error.message : 'Email delivery failed'
      console.error('Contact email failed', { message: notificationError })
    }
  } else notificationError = 'Resend is not configured'

  if (savedId) {
    await updateRecord('messages', savedId, {
      notificationSent: emailDelivered,
      notificationError: notificationError || null
    }).catch((error) =>
      console.error('Message delivery status update failed', error)
    )
  }

  return NextResponse.json({ ok: true, emailDelivered }, { status: 201 })
}
