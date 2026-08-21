'use client'

import { SectionHeading } from '@/components/Home/SectionHeading'
import { BorderBeam } from '@/components/ui/border-beam'
import { Reveal } from '@/components/ui/reveal'
import {
  ArrowUpRight,
  AtSign,
  Linkedin,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Send
} from 'lucide-react'
import { FormEvent, useState } from 'react'

export default function Contact() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('sending')
    const form = event.currentTarget
    const payload = Object.fromEntries(new FormData(form))
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) throw new Error('Unable to send')
      form.reset()
      setState('sent')
    } catch {
      setState('error')
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 py-24 sm:py-32">
      <SectionHeading
        eyebrow="06 · Contact"
        title="Hiring for a product team—"
        accent="or need one built?"
        description="Share the role, product goal or delivery problem. I’ll respond with the most useful next step, whether that is an interview, a technical conversation or a scoped build."
      />
      <div className="mt-14 grid overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-2xl shadow-black/5 sm:rounded-[2rem] lg:grid-cols-[.78fr_1.22fr]">
        <Reveal direction="right" className="h-full">
          <div className="relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden bg-white p-5 text-foreground dark:bg-zinc-950 sm:min-h-[420px] sm:p-10">
            <div className="absolute -left-16 top-12 size-64 rounded-full bg-amber-400/15 blur-3xl" />
            <div className="absolute -bottom-20 right-0 size-72 rounded-full bg-violet-500/15 blur-3xl" />
            <BorderBeam
              size={140}
              duration={12}
              colorFrom="#f59e0b"
              colorTo="#8b5cf6"
            />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[.24em] text-amber-700 dark:text-amber-300">
                Direct line
              </p>
              <h3 className="mt-4 max-w-sm text-4xl font-semibold tracking-[-.05em]">
                Good products start with a precise conversation.
              </h3>
            </div>
            <div className="relative space-y-4">
              <a
                href="mailto:rafiferdos@gmail.com"
                className="flex items-center justify-between rounded-2xl border border-border bg-background/65 p-4 transition hover:bg-muted/70"
              >
                <span className="flex items-center gap-3">
                  <Mail className="size-4 text-amber-700 dark:text-amber-300" />
                  <span className="text-sm">rafiferdos@gmail.com</span>
                </span>
                <ArrowUpRight className="size-4" />
              </a>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="tel:+8801921479294"
                  aria-label="Call Rafi"
                  className="flex items-center justify-center rounded-xl border border-border bg-background/65 p-3 transition hover:text-primary"
                >
                  <Phone className="size-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/rafiferdos"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Rafi on LinkedIn"
                  className="flex items-center justify-center rounded-xl border border-border bg-background/65 p-3 transition hover:text-primary"
                >
                  <Linkedin className="size-4" />
                </a>
                <a
                  href="https://x.com/rafiferdos"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Rafi on X"
                  className="flex items-center justify-center rounded-xl border border-border bg-background/65 p-3 transition hover:text-primary"
                >
                  <AtSign className="size-4" />
                </a>
              </div>
              <a
                href="tel:+8801921479294"
                className="flex items-center gap-3 px-4 text-sm text-muted-foreground transition hover:text-foreground"
              >
                <Phone className="size-4 text-amber-700 dark:text-amber-300" />
                +880 1921-479294
              </a>
              <div className="flex items-center gap-3 px-4 text-sm text-muted-foreground">
                <MapPin className="size-4 text-amber-700 dark:text-amber-300" />
                Dhaka, Bangladesh · Remote worldwide
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal direction="left" delay={0.08} className="h-full">
          <form
            onSubmit={handleSubmit}
            className="grid h-full gap-5 p-5 sm:p-10"
            aria-label="Contact form"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Name
                <input
                  required
                  name="name"
                  autoComplete="name"
                  className="h-12 rounded-xl border border-border bg-background px-4 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
                  placeholder="Your name"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Email
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="h-12 rounded-xl border border-border bg-background px-4 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
                  placeholder="you@company.com"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              Role or product
              <input
                required
                name="subject"
                className="h-12 rounded-xl border border-border bg-background px-4 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
                placeholder="Full-stack role, product, website, mobile app…"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Useful context
              <textarea
                required
                name="message"
                rows={6}
                className="resize-none rounded-xl border border-border bg-background p-4 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
                placeholder="The role or goal, current context, and what a good next step looks like."
              />
            </label>
            <input
              name="website"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                Usually replies within 1–2 business days.
              </p>
              <button
                disabled={state === 'sending'}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition hover:scale-[1.02] disabled:opacity-60"
              >
                {state === 'sending' ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {state === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </div>
            <div aria-live="polite" className="min-h-5 text-sm">
              {state === 'sent' && (
                <p className="text-emerald-600">
                  Message received. I’ll get back to you soon.
                </p>
              )}
              {state === 'error' && (
                <p className="text-rose-500">
                  The form backend is not connected yet. Please email me
                  directly.
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
