'use client'

import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { duration, gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

const PREVIEW_TILT = 4
const ACTIVE_SHIFT = 24

type Props = { id: string; className?: string; children: React.ReactNode }

// Drives the server-rendered work list through data attributes: active row, dock wipe, index roll and the cursor card.
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

      mm.add('(min-width: 768px)', () => {
        const frames = gsap.utils.toArray<HTMLElement>('[data-work-frame]', el)
        const rolls = gsap.utils.toArray<HTMLElement>('[data-work-roll]', el)
        const bar = el.querySelector<HTMLElement>('[data-work-bar]')
        const titles = rows.map((row) => row.querySelector<HTMLElement>('[data-work-title]'))
        const count = rows.length
        let current = 0
        let layer = 1

        // --w drives color-mix() in CSS, so the active color follows the theme without any inline color.
        const setActive = (index: number) => {
          rows.forEach((row, i) => {
            const on = i === index
            gsap.to(row, { opacity: on ? 1 : 0.4, duration: 0.5, ease: 'out', overwrite: 'auto' })
            gsap.to(titles[i], {
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
          if (frame) {
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
                    if (i !== current) gsap.set(other, { visibility: 'hidden' })
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
      })

      // The card needs a hover device, so touch laptops and phones skip it.
      mm.add('(min-width: 768px) and (pointer: fine)', () => {
        const card = el.querySelector<HTMLElement>('[data-work-preview]')
        const list = el.querySelector<HTMLElement>('.work-list')
        if (!card || !list) return

        gsap.set(card, { xPercent: -50, yPercent: -50, scale: 0.9, opacity: 0 })
        const moveX = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'out' })
        const moveY = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'out' })
        const tilt = gsap.quickTo(card, 'rotation', { duration: 0.6, ease: 'out' })
        const settle = gsap.delayedCall(0.08, () => tilt(0)).pause()
        let lastX = 0
        let hovered: Element | null = null

        const toggle = (on: boolean) =>
          gsap.to(card, {
            opacity: on ? 1 : 0,
            scale: on ? 1 : 0.9,
            duration: duration.hover,
            ease: 'out',
            overwrite: 'auto'
          })

        const onMove = (event: PointerEvent) => {
          const row = (event.target as Element).closest('[data-work-row]')
          if (row !== hovered) {
            hovered = row
            lastX = event.clientX
            const url = row?.getAttribute('data-preview')
            if (url) card.style.backgroundImage = `url("${url}")`
            toggle(Boolean(url))
          }
          moveX(event.clientX)
          moveY(event.clientY)
          tilt(gsap.utils.clamp(-PREVIEW_TILT, PREVIEW_TILT, (event.clientX - lastX) * 0.25))
          lastX = event.clientX
          settle.restart(true)
        }

        const onLeave = () => {
          hovered = null
          toggle(false)
        }

        list.addEventListener('pointermove', onMove)
        list.addEventListener('pointerleave', onLeave)
        return () => {
          list.removeEventListener('pointermove', onMove)
          list.removeEventListener('pointerleave', onLeave)
          settle.kill()
          card.style.backgroundImage = ''
        }
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
