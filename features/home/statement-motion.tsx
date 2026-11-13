'use client'

import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { gsap, useGSAP } from '@/lib/gsap'

type Props = { id: string; className?: string; children: React.ReactNode }

// The section is 160svh with a sticky inner, so the scrub below runs while the text stays in view.
export function StatementMotion({ id, className, children }: Props) {
  const root = useRef<HTMLElement>(null)
  const { motionAllowed } = useMotion()

  useGSAP(
    () => {
      const el = root.current
      if (!motionAllowed || !el) return
      // fromTo, because the CSS already sets the 0.15 start and from() would read it as the end value.
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>('[data-word]', el),
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: 'none',
          duration: 1,
          stagger: 0.5,
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true }
        }
      )
    },
    { scope: root, dependencies: [motionAllowed], revertOnUpdate: true }
  )

  return (
    <section ref={root} id={id} aria-label="About" className={className}>
      {children}
    </section>
  )
}
