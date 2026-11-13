'use client'

import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { duration, gsap, ScrollTrigger, SplitText, stagger, useGSAP } from '@/lib/gsap'

const RADIUS_VW = 0.3
// Width ratio of wdth 125 to wdth 75 in Mona Sans; the letters stretch with scaleX instead of animating the axis.
const MAX_SCALE = 1.55
// Time constant of the follow, so the letters settle in about 0.5s.
const SETTLE = 0.17

type Props = { id: string; className?: string; children: React.ReactNode }

// Animates server-rendered hero markup through data attributes, so all the text stays in the HTML.
export function HeroMotion({ id, className, children }: Props) {
  const root = useRef<HTMLElement>(null)
  const { motionAllowed } = useMotion()

  useGSAP(
    () => {
      const el = root.current
      if (!motionAllowed || !el) return
      const name = el.querySelector<HTMLElement>('[data-hero-name]')
      const intro = el.querySelector<HTMLElement>('[data-hero-intro]')
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]', el)
      const fades = gsap.utils.toArray<HTMLElement>('[data-hero-fade]', el)
      if (!name || !intro) return

      const mm = gsap.matchMedia()
      // The always-true query keeps the callback running on coarse pointers too.
      mm.add({ always: '(min-width: 0px)', fine: '(pointer: fine)' }, (context) => {
        const fine = Boolean(context.conditions?.fine)
        const scrub = { k: 1 }
        const pointer = { x: -1e4, y: -1e4 }
        let masks: HTMLElement[] = []
        let base: { x: number; y: number; w: number; line: number }[] = []
        let scale: number[] = []
        let target: number[] = []
        let setters: { x: (value: number) => void; scale: (value: number) => void }[] = []
        let dirty = false
        let settling = false
        let active = true

        // offset* ignores transforms, so this stays correct while the letters are scaled or the name is scrubbed.
        const measure = () => {
          base = masks.map((mask) => {
            let x = 0
            let y = 0
            for (let node: HTMLElement | null = mask; node; node = node.offsetParent as HTMLElement | null) {
              x += node.offsetLeft
              y += node.offsetTop
            }
            const line = lines.indexOf(mask.closest<HTMLElement>('[data-hero-line]') as HTMLElement)
            return { x: x + mask.offsetWidth / 2, y: y + mask.offsetHeight / 2, w: mask.offsetWidth, line }
          })
        }

        const retarget = () => {
          dirty = false
          settling = true
          const radius = window.innerWidth * RADIUS_VW
          const pointerY = pointer.y + window.scrollY
          target = base.map((box) => {
            const near = gsap.utils.clamp(0, 1, 1 - Math.hypot(pointer.x - box.x, pointerY - box.y) / radius)
            return 1 + (MAX_SCALE - 1) * near * scrub.k
          })
        }

        const follow = (deltaMs: number) => {
          const ease = 1 - Math.exp(-Math.min(deltaMs, 100) / 1000 / SETTLE)
          let moving = false
          let line = -1
          let shift = 0
          scale = scale.map((current, index) => {
            const gap = target[index] - current
            const next = Math.abs(gap) > 0.0005 ? current + gap * ease : target[index]
            if (next !== target[index]) moving = true
            if (base[index].line !== line) {
              line = base[index].line
              shift = 0
            }
            setters[index].x(shift)
            setters[index].scale(next)
            shift += base[index].w * (next - 1)
            return next
          })
          settling = moving
        }

        SplitText.create(name, {
          type: 'chars',
          mask: 'chars',
          aria: 'none',
          autoSplit: true,
          onSplit(self) {
            const chars = self.chars as HTMLElement[]
            if (fine) {
              masks = chars.map((char) => char.parentElement ?? char)
              gsap.set(masks, { transformOrigin: '0% 50%', x: 0, scaleX: 1 })
              setters = masks.map((mask) => ({
                x: gsap.quickSetter(mask, 'x', 'px') as (value: number) => void,
                scale: gsap.quickSetter(mask, 'scaleX') as (value: number) => void
              }))
              scale = masks.map(() => 1)
              target = masks.map(() => 1)
              measure()
              dirty = true
            }
            gsap.set(name, { visibility: 'visible' })
            return gsap.from(chars, {
              yPercent: 110,
              duration: duration.display,
              ease: 'out',
              stagger: stagger.chars
            })
          }
        })

        SplitText.create(intro, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit(self) {
            gsap.set(intro, { visibility: 'visible' })
            return gsap.from(self.lines, {
              yPercent: 100,
              duration: duration.ui,
              ease: 'out',
              stagger: stagger.lines,
              delay: 0.5
            })
          }
        })

        // fromTo, because the CSS already hides these and from() would read that 0 as the end value.
        gsap.fromTo(
          fades,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: duration.ui, ease: 'out', stagger: 0.08, delay: 0.5 }
        )

        const leave = gsap.timeline({
          defaults: { ease: 'none', duration: 1 },
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true }
        })
        leave
          .to(lines[0], { y: '-12vh' }, 0)
          .to(lines[1], { y: '-4vh' }, 0)
          .to(intro, { opacity: 0, duration: 0.4 }, 0)

        if (!fine) return
        leave.to(scrub, { k: 0, onUpdate: () => (dirty = true) }, 0)

        const tick = (_time: number, deltaMs: number) => {
          if (!active) return
          if (dirty) retarget()
          if (settling) follow(deltaMs)
        }
        const onMove = (event: PointerEvent) => {
          pointer.x = event.clientX
          pointer.y = event.clientY
          dirty = true
        }
        const onLeave = () => {
          pointer.x = pointer.y = -1e4
          dirty = true
        }
        const onRefresh = () => {
          measure()
          dirty = true
        }
        const view = ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (active = self.isActive)
        })

        gsap.ticker.add(tick)
        ScrollTrigger.addEventListener('refresh', onRefresh)
        window.addEventListener('pointermove', onMove)
        document.documentElement.addEventListener('mouseleave', onLeave)
        return () => {
          gsap.ticker.remove(tick)
          ScrollTrigger.removeEventListener('refresh', onRefresh)
          window.removeEventListener('pointermove', onMove)
          document.documentElement.removeEventListener('mouseleave', onLeave)
          view.kill()
        }
      })
    },
    { scope: root, dependencies: [motionAllowed], revertOnUpdate: true }
  )

  return (
    <section ref={root} id={id} className={className}>
      {children}
    </section>
  )
}
