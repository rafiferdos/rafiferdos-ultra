'use client'

import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { duration, gsap, SplitText, stagger, useGSAP } from '@/lib/gsap'

type Props = { id: string; className?: string; children: React.ReactNode }

export function ExperienceMotion({ id, className, children }: Props) {
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
      // One row of tiles: a single scrub with a stagger across it.
      mm.add('(min-width: 768px)', () => {
        gsap.fromTo(tiles, from, {
          ...to,
          stagger: 0.15,
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 45%', scrub: true }
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
    <section ref={root} id={id} aria-labelledby="experience-title" className={className}>
      {children}
    </section>
  )
}
