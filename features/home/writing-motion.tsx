'use client'

import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { duration, gsap, useGSAP } from '@/lib/gsap'

type Props = { id: string; className?: string; children: React.ReactNode }

// Rows are small text, so each one plays once on enter instead of scrubbing.
export function WritingMotion({ id, className, children }: Props) {
  const root = useRef<HTMLElement>(null)
  const { motionAllowed } = useMotion()

  useGSAP(
    () => {
      if (!motionAllowed || !root.current) return
      gsap.utils.toArray<HTMLElement>('[data-writing-row]', root.current).forEach((row) => {
        // The CSS hides rows under js-motion. The trigger is the untransformed mask, since the row itself starts 100% lower.
        gsap.set(row, { visibility: 'visible' })
        gsap.from(row, {
          yPercent: 100,
          duration: duration.ui,
          ease: 'out',
          scrollTrigger: { trigger: row.parentElement, start: 'top 88%' }
        })
      })
    },
    { scope: root, dependencies: [motionAllowed], revertOnUpdate: true }
  )

  return (
    <section ref={root} id={id} aria-labelledby="writing-title" className={className}>
      {children}
    </section>
  )
}
