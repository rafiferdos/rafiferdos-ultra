'use client'

import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { duration, gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

// Detail pages and /services are server-rendered; this leaf only adds motion. CSS hides the targets under js-motion, GSAP shows them.
export function PageMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const { motionAllowed } = useMotion()

  useGSAP(
    () => {
      const el = root.current
      if (!motionAllowed || !el) return
      const pick = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, el)

      // Title: the .fit box clips, so the text slides up inside it.
      // The click-through overlay (page-transition) already put the same title in place, so it does not slide again.
      gsap.set(pick('[data-page-title] .fit-text'), { visibility: 'visible' })
      if (document.documentElement.dataset.arrival !== 'title') {
        gsap.from('[data-page-title] .fit-text', { yPercent: 105, duration: duration.display, ease: 'out', delay: 0.15 })
      }

      // Small text plays once on enter.
      pick('[data-reveal]').forEach((item) => {
        gsap.set(item, { visibility: 'visible' })
        gsap.from(item, {
          y: 32,
          opacity: 0,
          duration: duration.ui,
          ease: 'out',
          scrollTrigger: { trigger: item, start: 'top 90%', once: true }
        })
      })

      // Cover drifts slower than the page inside its own clipped frame.
      pick('[data-parallax]').forEach((frame) => {
        const inner = frame.querySelector('[data-parallax-inner]')
        if (!inner) return
        gsap.fromTo(
          inner,
          { yPercent: -7, scale: 1.15 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true }
          }
        )
      })

      // Next project: the large title rises into place as the block arrives.
      const next = pick('[data-next]')[0]
      if (next) {
        gsap.set('[data-next] .fit-text', { visibility: 'visible' })
        gsap.fromTo(
          '[data-next] .fit-text',
          { yPercent: 70 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'center center', scrub: true }
          }
        )
      }

      document.fonts.ready.then(() => ScrollTrigger.refresh())
    },
    { scope: root, dependencies: [motionAllowed], revertOnUpdate: true }
  )

  return <div ref={root}>{children}</div>
}
