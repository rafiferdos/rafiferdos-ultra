'use client'

import { useState, type FormEvent } from 'react'
import { z } from 'zod'
import { contactSchema } from '@/lib/validation/contact'

type Field = 'name' | 'email' | 'message'
type Status = 'idle' | 'sending' | 'sent' | 'error'

const messages: Record<Field, string> = {
  name: 'Enter your name, 2 characters or more.',
  email: 'Enter a valid email address.',
  message: 'Write at least 10 characters.'
}

const fieldClass =
  'w-full border-b border-site-line-strong bg-transparent py-3 text-lead outline-none transition-colors placeholder:text-site-faint focus:border-site-accent aria-[invalid=true]:border-site-accent'

// The API also requires a subject; the form has no subject field, so every message carries this one.
const SUBJECT = 'Message from the portfolio'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [failure, setFailure] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>
    const parsed = contactSchema.safeParse({ ...values, subject: SUBJECT })
    if (!parsed.success) {
      const bad = z.flattenError(parsed.error).fieldErrors
      setErrors(Object.fromEntries((Object.keys(messages) as Field[]).filter((key) => bad[key]).map((key) => [key, messages[key]])))
      setStatus('idle')
      return
    }

    setErrors({})
    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data)
      })
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error)
      }
      form.reset()
      setStatus('sent')
    } catch (error) {
      setFailure(error instanceof Error && error.message ? error.message : 'The message could not be sent.')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Contact form" className="grid gap-8 py-12 md:grid-cols-2">
      {(['name', 'email'] as const).map((field) => (
        <div key={field}>
          <label htmlFor={`contact-${field}`} className="t-label text-site-muted">
            {field === 'name' ? 'Name' : 'Email'}
          </label>
          <input
            id={`contact-${field}`}
            name={field}
            type={field === 'email' ? 'email' : 'text'}
            autoComplete={field}
            autoFocus={field === 'name'}
            aria-invalid={Boolean(errors[field])}
            aria-describedby={errors[field] ? `contact-${field}-error` : undefined}
            className={fieldClass}
          />
          {errors[field] && (
            <p id={`contact-${field}-error`} className="t-label-s mt-2 text-site-accent">
              {errors[field]}
            </p>
          )}
        </div>
      ))}
      <div className="md:col-span-2">
        <label htmlFor="contact-message" className="t-label text-site-muted">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={`${fieldClass} resize-none`}
        />
        {errors.message && (
          <p id="contact-message-error" className="t-label-s mt-2 text-site-accent">
            {errors.message}
          </p>
        )}
      </div>
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="t-label flex flex-wrap items-center justify-between gap-4 md:col-span-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-full border border-site-ink px-6 py-3 uppercase transition-colors hover:border-site-accent hover:text-site-accent disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending...' : 'Send message'}
        </button>
        <p role="status" aria-live="polite" className={status === 'error' ? 'text-site-accent' : 'text-site-muted'}>
          {status === 'sent' && 'Message received. I will get back to you soon.'}
          {status === 'error' && `${failure} You can also email me directly.`}
          {status === 'idle' && Object.keys(errors).length > 0 && 'Please fix the highlighted fields.'}
        </p>
      </div>
    </form>
  )
}
