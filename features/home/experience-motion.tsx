'use client'

import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { duration, gsap, SplitText, stagger, useGSAP } from '@/lib/gsap'

type Props = { id: string; labelledBy: string; className?: string; children: React.ReactNode }

export function ExperienceMotion({ id, labelledBy, className, children }: Props) {
  const root = useRef<HTMLElement>(null)
  const { motionAllowed } = useMotion()

  useGSAP(
    () => {
      const el = root.current
      if (!motionAllowed || !el) return
      const tiles = gsap.utils.toArray<HTMLElement>('[data-exp-tile]', el)
      const from = { y: 60, opacity: 0 }
      const to = { y: 0, opacity: 1, ease: 'none' }

      const mm = gsap.matchMedia()
      // Three columns, any number of rows: each tile scrubs on its own, and the later columns start a little further up.
      mm.add('(min-width: 768px)', () => {
        tiles.forEach((tile, index) => {
          const start = 92 - (index % 3) * 8
          gsap.fromTo(tile, from, {
            ...to,
            scrollTrigger: { trigger: tile, start: `top ${start}%`, end: `top ${start - 35}%`, scrub: true }
          })
        })
      })
      // Stacked tiles sit far apart, so each one scrubs on its own.
      mm.add('(max-width: 767px)', () => {
        tiles.forEach((tile) =>
          gsap.fromTo(tile, from, {
            ...to,
            scrollTrigger: { trigger: tile, start: 'top 90%', end: 'top 60%', scrub: true }
          })
        )
      })

      // Small text plays once instead of scrubbing.
      tiles.forEach((tile) => {
        gsap.utils.toArray<HTMLElement>('[data-exp-bullet]', tile).forEach((bullet) =>
          SplitText.create(bullet, {
            type: 'lines',
            mask: 'lines',
            aria: 'none',
            autoSplit: true,
            onSplit(self) {
              gsap.set(bullet, { visibility: 'visible' })
              return gsap.from(self.lines, {
                yPercent: 100,
                duration: duration.ui,
                ease: 'out',
                stagger: stagger.lines,
                scrollTrigger: { trigger: tile, start: 'top 70%' }
              })
            }
          })
        )
      })
    },
    { scope: root, dependencies: [motionAllowed], revertOnUpdate: true }
  )

  return (
    <section ref={root} id={id} aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  )
}
