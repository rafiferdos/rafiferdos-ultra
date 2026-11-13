'use client'

import { useRef, useState } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { ContactForm } from '@/features/home/contact-form'
import { createKinetic } from '@/features/motion/kinetic-letters'
import { duration, gsap, ScrollTrigger, SplitText, stagger, useGSAP } from '@/lib/gsap'

// The big SAY HELLO letters open the form below. Same kinetic letters as the hero name.
export function ContactCta() {
  const root = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
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
        onClick={() => setOpen((value) => !value)}
        className="block w-full text-left text-site-accent"
      >
        <span className="sr-only">Say hello, {open ? 'close' : 'open'} the contact form</span>
        <span aria-hidden data-cta-name className="t-display cta-name hero-line block">
          Say hello
        </span>
      </button>
      <p className="t-label mt-4 text-site-muted">{open ? '(Close)' : '(Click to write)'}</p>

      <div id="contact-form" className={`cta-form ${open ? 'is-open' : ''}`} inert={!open}>
        <div data-cta-form className="min-h-0 overflow-hidden">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
