'use client'

import { useState, type FormEvent } from 'react'
import { z } from 'zod'
import { services } from '@/data/services'
import { contactSchema } from '@/lib/validation/contact'

type Field = 'name' | 'email' | 'message'
type Status = 'idle' | 'sending' | 'sent' | 'error'

const messages: Record<Field, string> = {
  name: 'Your name, please. 2 characters or more.',
  email: 'Enter a valid email address.',
  message: 'A few more words, please. 10 characters or more.'
}

const fieldClass =
  'w-full border-b border-site-line-strong bg-transparent py-3 text-lead outline-none transition-colors placeholder:text-site-faint focus:border-site-accent aria-[invalid=true]:border-site-accent'

// The API requires a subject. The topic picks it; "Something else" keeps the plain one.
const SUBJECT = 'Message from the portfolio'
const subjectFor = (topic: string) => {
  const service = services.find(({ id }) => id === topic)
  return service ? `Project enquiry: ${service.title}` : SUBJECT
}

type Props = { topic: string; onTopicChange: (topic: string) => void }

export function ContactForm({ topic, onTopicChange }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [failure, setFailure] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>
    const parsed = contactSchema.safeParse({ ...values, subject: subjectFor(topic) })
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
        <label htmlFor="contact-topic" className="t-label text-site-muted">
          Topic
        </label>
        <select
          id="contact-topic"
          name="topic"
          value={topic}
          onChange={(event) => onTopicChange(event.target.value)}
          className={`${fieldClass} appearance-none`}
        >
          {services.map(({ id, title }) => (
            <option key={id} value={id}>
              {title}
            </option>
          ))}
          <option value="other">Something else</option>
        </select>
      </div>
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
          {status === 'sending' ? 'Sending' : 'Send message'}
        </button>
        <p role="status" aria-live="polite" className={status === 'error' ? 'text-site-accent' : 'text-site-muted'}>
          {status === 'sent' && 'Got it. I will reply by email.'}
          {status === 'error' && `${failure} You can also email me directly.`}
          {status === 'idle' && Object.keys(errors).length > 0 && 'Check the highlighted fields.'}
        </p>
      </div>
    </form>
  )
}
