'use client'

import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { followCursor } from '@/features/home/work-follow'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

const ACTIVE_SHIFT = 24

type Props = { id: string; className?: string; children: React.ReactNode }

// Drives the server-rendered work list through data attributes: active row, dock wipe, index roll and the hover image that leaves the dock.
export function WorkMotion({ id, className, children }: Props) {
  const root = useRef<HTMLElement>(null)
  const { motionAllowed } = useMotion()

  useGSAP(
    () => {
      const el = root.current
      if (!motionAllowed || !el) return
      const rows = gsap.utils.toArray<HTMLElement>('[data-work-row]', el)
      if (!rows.length) return

      const mm = gsap.matchMedia()

      mm.add({ wide: '(min-width: 768px)', fine: '(pointer: fine)' }, (context) => {
        if (!context.conditions?.wide) return
        const frames = gsap.utils.toArray<HTMLElement>('[data-work-frame]', el)
        const rolls = gsap.utils.toArray<HTMLElement>('[data-work-roll]', el)
        const bar = el.querySelector<HTMLElement>('[data-work-bar]')
        const titles = rows.map((row) => row.querySelector<HTMLElement>('[data-work-title]'))
        const box = el.querySelector<HTMLElement>('[data-work-box]')
        const list = el.querySelector<HTMLElement>('.work-list')
        const count = rows.length
        let current = 0
        let layer = 1

        // --w drives color-mix() in CSS, so the active color follows the theme without any inline color.
        const setActive = (index: number) => {
          titles.forEach((title, i) => {
            const on = i === index
            gsap.to(title, {
              '--w': on ? 100 : 0,
              x: on ? ACTIVE_SHIFT : 0,
              duration: 0.5,
              ease: 'out',
              overwrite: 'auto'
            })
          })
        }

        const show = (index: number) => {
          if (index === current) return
          current = index
          layer += 1
          const frame = frames[index]
          // A frame that is out following the cursor lands already shown, so it skips the wipe.
          if (frame && !frame.classList.contains('is-held')) {
            gsap.set(frame, { zIndex: layer, visibility: 'visible' })
            gsap.fromTo(
              frame.querySelector('[data-frame-outer]'),
              { yPercent: 100 },
              {
                yPercent: 0,
                duration: 0.9,
                ease: 'out',
                overwrite: true,
                onComplete: () =>
                  frames.forEach((other, i) => {
                    if (i !== current && !other.classList.contains('is-held')) gsap.set(other, { visibility: 'hidden' })
                  })
              }
            )
            gsap.fromTo(
              frame.querySelector('[data-frame-inner]'),
              { yPercent: -100 },
              { yPercent: 0, duration: 0.9, ease: 'out', overwrite: true }
            )
          }
          gsap.to(rolls, { yPercent: (-100 * index) / count, duration: 0.6, ease: 'out', overwrite: true })
          if (bar) gsap.to(bar, { scaleX: (index + 1) / count, duration: 0.6, ease: 'out', overwrite: true })
        }

        // matchMedia kills these triggers and reverts every tween below when the query stops matching.
        rows.forEach((row, index) =>
          ScrollTrigger.create({
            trigger: row,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self) => {
              if (!self.isActive) return
              setActive(index)
              show(index)
            }
          })
        )

        // The hover image needs a hover device, so touch laptops and phones keep the static dock.
        if (context.conditions.fine && box && list) return followCursor(list, box, rows, frames, (index) => index === current)
      })
    },
    { scope: root, dependencies: [motionAllowed], revertOnUpdate: true }
  )

  return (
    <section ref={root} id={id} aria-labelledby="work-title" className={className}>
      {children}
    </section>
  )
}
