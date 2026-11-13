'use client'

import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { FitText } from '@/components/site/fit-text'
import { createKinetic } from '@/features/motion/kinetic-letters'
import { serviceIds } from '@/data/services'
import { duration, gsap, ScrollTrigger, SplitText, stagger, useGSAP } from '@/lib/gsap'

// The form (and zod with it) loads on first open, and is warmed up when the CTA gets hover or focus.
const loadForm = () => import('@/features/home/contact-form').then((module) => module.ContactForm)
const ContactForm = dynamic(loadForm, { ssr: false })

// The big SAY HELLO letters open the form below. Same kinetic letters as the hero name.
export function ContactCta() {
  const root = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [opened, setOpened] = useState(false)
  const [topic, setTopic] = useState('other')
  const { motionAllowed } = useMotion()

  useGSAP(
    () => {
      const el = root.current
      const name = el?.querySelector<HTMLElement>('[data-cta-name]')
      if (!motionAllowed || !el || !name) return

      const mm = gsap.matchMedia()
      mm.add({ always: '(min-width: 0px)', fine: '(pointer: fine)' }, (context) => {
        const fine = Boolean(context.conditions?.fine)
        const kinetic = createKinetic(el)

        SplitText.create(name, {
          type: 'chars',
          mask: 'chars',
          aria: 'none',
          autoSplit: true,
          onSplit(self) {
            const chars = self.chars as HTMLElement[]
            if (fine) kinetic.setLetters(chars.map((char) => char.parentElement ?? char), () => 0)
            gsap.set(name, { visibility: 'visible' })
            return gsap.from(chars, {
              yPercent: 110,
              ease: 'none',
              stagger: stagger.chars,
              // Ends at 85% so the last scroll position of a short page can still finish it.
              scrollTrigger: { trigger: name, start: 'top 95%', end: 'bottom 85%', scrub: true }
            })
          }
        })

        if (fine) return kinetic.start()
      })
    },
    { scope: root, dependencies: [motionAllowed], revertOnUpdate: true }
  )

  // /services?service=ai opens the form on that topic, and so does a card link on the page (a[data-service]).
  // Lenis' anchor handling does the scroll to #contact.
  useGSAP(
    (_context, contextSafe) => {
      const pick = contextSafe!((id: string) => {
        setTopic(id)
        setOpened(true)
        setOpen(true)
      })
      const fromUrl = new URLSearchParams(location.search).get('service')
      if (fromUrl && serviceIds.has(fromUrl)) pick(fromUrl)
      const onClick = (event: MouseEvent) => {
        const id = (event.target as Element).closest<HTMLElement>('a[data-service]')?.dataset.service
        if (id && serviceIds.has(id)) pick(id)
      }
      document.addEventListener('click', onClick)
      return () => document.removeEventListener('click', onClick)
    },
    { scope: root }
  )

  // The collapse is instant (0fr to 1fr) so nothing animates layout; only the form's opacity and y play.
  useGSAP(
    () => {
      const form = root.current?.querySelector<HTMLElement>('[data-cta-form]')
      if (!open || !form) return
      if (motionAllowed) ScrollTrigger.refresh()
      form.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: !motionAllowed })
      if (motionAllowed) gsap.fromTo(form, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: duration.ui, ease: 'out' })
    },
    { scope: root, dependencies: [open] }
  )

  return (
    <div ref={root}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="contact-form"
        data-cursor="Write"
        onClick={() => {
          setOpened(true)
          setOpen((value) => !value)
        }}
        onPointerEnter={loadForm}
        onFocus={loadForm}
        className="block w-full text-left text-site-accent"
      >
        <span className="sr-only">Say hello, {open ? 'close' : 'open'} the contact form</span>
        <FitText fallback={4.89} aria-hidden data-cta-name className="t-display hero-line">
          Say hello
        </FitText>
      </button>
      <p className="t-label mt-4 text-site-muted">{open ? '(Close)' : '(Click to write)'}</p>

      <div id="contact-form" className={`cta-form ${open ? 'is-open' : ''}`} inert={!open}>
        <div data-cta-form className="min-h-0 overflow-hidden">
          {opened && <ContactForm topic={topic} onTopicChange={setTopic} />}
        </div>
      </div>
    </div>
  )
}
