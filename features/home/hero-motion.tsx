'use client'

import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { INTRO_HANDOFF } from '@/components/site/intro'
import { createKinetic } from '@/features/motion/kinetic-letters'
import { duration, gsap, SplitText, stagger, useGSAP } from '@/lib/gsap'

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

      // While the intro bars are up, the hero waits for them to start leaving.
      const wait = document.documentElement.classList.contains('js-intro') ? INTRO_HANDOFF : 0

      const mm = gsap.matchMedia()
      // The always-true query keeps the callback running on coarse pointers too.
      mm.add({ always: '(min-width: 0px)', fine: '(pointer: fine)' }, (context) => {
        const fine = Boolean(context.conditions?.fine)
        const scrub = { k: 1 }
        const kinetic = createKinetic(el, scrub)

        SplitText.create(name, {
          type: 'chars',
          mask: 'chars',
          aria: 'none',
          autoSplit: true,
          onSplit(self) {
            const chars = self.chars as HTMLElement[]
            if (fine) {
              kinetic.setLetters(
                chars.map((char) => char.parentElement ?? char),
                (mask) => lines.indexOf(mask.closest<HTMLElement>('[data-hero-line]') as HTMLElement)
              )
            }
            gsap.set(name, { visibility: 'visible' })
            return gsap.from(chars, {
              yPercent: 110,
              duration: duration.display,
              ease: 'out',
              stagger: stagger.chars,
              delay: wait
            })
          }
        })

        SplitText.create(intro, {
          type: 'lines',
          mask: 'lines',
          aria: 'none',
          autoSplit: true,
          onSplit(self) {
            gsap.set(intro, { visibility: 'visible' })
            return gsap.from(self.lines, {
              yPercent: 100,
              duration: duration.ui,
              ease: 'out',
              stagger: stagger.lines,
              delay: 0.5 + wait
            })
          }
        })

        // fromTo, because the CSS already hides these and from() would read that 0 as the end value.
        gsap.fromTo(
          fades,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: duration.ui, ease: 'out', stagger: 0.08, delay: 0.5 + wait }
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
        leave.to(scrub, { k: 0, onUpdate: kinetic.markDirty }, 0)
        return kinetic.start()
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
