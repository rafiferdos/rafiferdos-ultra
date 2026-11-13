'use client'

import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { duration, gsap, useGSAP } from '@/lib/gsap'

// Any element can opt in to a label with data-cursor="View"; links and buttons just grow the ring.
export function Cursor() {
  const { motionAllowed } = useMotion()
  const root = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const disc = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (!motionAllowed) return
      const mm = gsap.matchMedia()
      mm.add('(pointer: fine)', () => {
        const html = document.documentElement
        const dotX = gsap.quickTo(dot.current, 'x', { duration: 0.1, ease: 'out' })
        const dotY = gsap.quickTo(dot.current, 'y', { duration: 0.1, ease: 'out' })
        const ringX = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'out' })
        const ringY = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'out' })
        let visible = false

        const show = (on: boolean) => {
          visible = on
          gsap.to(root.current, { opacity: on ? 1 : 0, duration: duration.micro, overwrite: true })
        }

        const onMove = (event: PointerEvent) => {
          if (!visible) {
            gsap.set([dot.current, ring.current], { x: event.clientX, y: event.clientY })
            show(true)
          }
          dotX(event.clientX)
          dotY(event.clientY)
          ringX(event.clientX)
          ringY(event.clientY)
        }

        const onOver = (event: PointerEvent) => {
          if (!(event.target instanceof Element)) return
          const target = event.target.closest('a, button, [data-cursor]')
          const text = target?.getAttribute('data-cursor') ?? ''
          if (label.current) label.current.textContent = text
          const options = { duration: duration.hover, ease: 'out', overwrite: true }
          gsap.to(disc.current, { scale: text ? 2.6 : target ? 1.7 : 1, ...options })
          gsap.to([fill.current, label.current], { opacity: text ? 1 : 0, ...options })
        }

        const onLeave = () => show(false)

        html.classList.add('site-cursor')
        window.addEventListener('pointermove', onMove)
        document.addEventListener('pointerover', onOver)
        html.addEventListener('mouseleave', onLeave)
        return () => {
          html.classList.remove('site-cursor')
          window.removeEventListener('pointermove', onMove)
          document.removeEventListener('pointerover', onOver)
          html.removeEventListener('mouseleave', onLeave)
        }
      })
    },
    { scope: root, dependencies: [motionAllowed], revertOnUpdate: true }
  )

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[100] opacity-0">
      <div ref={dot} className="absolute left-0 top-0 -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-site-accent" />
      <div ref={ring} className="absolute left-0 top-0">
        <div ref={disc} className="relative -ml-5 -mt-5 size-10 rounded-full border border-site-ink/60">
          <div ref={fill} className="absolute inset-0 rounded-full bg-site-accent opacity-0" />
        </div>
        <span
          ref={label}
          className="t-label-s absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-site-accent-ink opacity-0"
        />
      </div>
    </div>
  )
}
