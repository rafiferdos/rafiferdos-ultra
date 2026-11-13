'use client'

import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { Draggable } from '@/lib/gsap-drag'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

const MAX_SKEW = 3
const SKEW_PER_VELOCITY = 0.0015
const KEY_STEP = 0.4

type Props = { id: string; className?: string; children: React.ReactNode }

// Desktop: the track is scrubbed by page scroll and a Draggable offset adds to it. Under 768px it stays a native snap scroller.
export function UpCloseMotion({ id, className, children }: Props) {
  const root = useRef<HTMLElement>(null)
  const { motionAllowed } = useMotion()

  useGSAP(
    () => {
      const el = root.current
      if (!motionAllowed || !el) return
      const viewport = el.querySelector<HTMLElement>('[data-upclose-viewport]')
      const drag = el.querySelector<HTMLElement>('[data-upclose-drag]')
      const track = el.querySelector<HTMLElement>('[data-upclose-track]')
      if (!viewport || !drag || !track) return

      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        let distance = 0
        const measure = () => {
          distance = Math.max(0, track.scrollWidth - viewport.clientWidth)
        }
        measure()

        // The drag offset may only move the track inside [-distance, 0] on top of the current scrub position.
        const range = () => {
          const scrubbed = Number(gsap.getProperty(track, 'x'))
          return { minX: -distance - scrubbed, maxX: -scrubbed }
        }

        const [dragger] = Draggable.create(drag, {
          type: 'x',
          inertia: true,
          onPress: () => dragger.applyBounds(range())
        })

        gsap.fromTo(
          track,
          { x: 0 },
          {
            x: () => {
              measure()
              return -distance
            },
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: () => dragger.applyBounds(range())
            }
          }
        )

        const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.6, ease: 'out' })
        const view = ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top' })
        let smooth = 0
        const tick = (_time: number, deltaMs: number) => {
          if (!view.isActive) return
          const dt = Math.min(deltaMs, 100) / 1000
          smooth += (view.getVelocity() - smooth) * Math.min(1, dt * 8)
          skewTo(gsap.utils.clamp(-MAX_SKEW, MAX_SKEW, smooth * -SKEW_PER_VELOCITY))
        }
        gsap.ticker.add(tick)

        // The region is focusable, so the arrow keys move the drag offset like they would scroll a native one.
        const onKey = (event: KeyboardEvent) => {
          const { minX, maxX } = range()
          const current = Number(gsap.getProperty(drag, 'x'))
          const step = window.innerWidth * KEY_STEP
          const next =
            event.key === 'ArrowRight'
              ? current - step
              : event.key === 'ArrowLeft'
                ? current + step
                : event.key === 'End'
                  ? minX
                  : event.key === 'Home'
                    ? maxX
                    : null
          if (next === null) return
          event.preventDefault()
          gsap.to(drag, {
            x: gsap.utils.clamp(minX, maxX, next),
            duration: 0.5,
            ease: 'out',
            overwrite: true,
            onUpdate: () => dragger.update()
          })
        }
        viewport.addEventListener('keydown', onKey)
        viewport.setAttribute('data-cursor', 'Drag')

        return () => {
          gsap.ticker.remove(tick)
          viewport.removeEventListener('keydown', onKey)
          viewport.removeAttribute('data-cursor')
          dragger.kill()
        }
      })
    },
    { scope: root, dependencies: [motionAllowed], revertOnUpdate: true }
  )

  return (
    <section ref={root} id={id} aria-labelledby="upclose-title" className={className}>
      {children}
    </section>
  )
}
