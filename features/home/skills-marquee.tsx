'use client'

import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

// Same list and order as the Skills section of docs/resume.md.
const skills = [
  'Next.js',
  'TypeScript',
  'React',
  'React Native',
  'Expo',
  'Socket.IO',
  'JavaScript (ES6+)',
  'MongoDB',
  'Mongoose',
  'Prisma ORM',
  'PostgreSQL',
  'Redux',
  'Docker',
  'CI/CD',
  'GraphQL',
  'Git',
  'REST APIs',
  'Node.js',
  'Express.js',
  'Tailwind CSS',
  'Firebase'
]

const BASE_SPEED = 40
const SCROLL_BOOST = 0.15
const SKEW_PER_VELOCITY = 0.004
const MAX_SKEW = 6

const items = skills.map((skill) => (
  <li key={skill} className="marquee-item">
    {skill}
    <span aria-hidden className="marquee-mark">
      ◆
    </span>
  </li>
))

export function SkillsMarquee() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const { motionAllowed } = useMotion()

  useGSAP(
    () => {
      const el = track.current
      if (!motionAllowed || !el || !root.current) return
      const group = el.firstElementChild
      if (!group) return

      let width = 0
      let x = 0
      let dir = -1
      let smooth = 0
      const observer = new ResizeObserver(([entry]) => {
        width = entry.borderBoxSize[0].inlineSize
      })
      observer.observe(group)

      const setX = gsap.quickSetter(el, 'x', 'px')
      const skewTo = gsap.quickTo(el, 'skewX', { duration: 0.6, ease: 'out' })
      const view = ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top' })

      const tick = (_time: number, deltaMs: number) => {
        if (!view.isActive || !width) return
        const dt = Math.min(deltaMs, 100) / 1000
        smooth += (view.getVelocity() - smooth) * Math.min(1, dt * 8)
        if (Math.abs(smooth) > 30) dir = smooth > 0 ? -1 : 1
        x = gsap.utils.wrap(-width, 0, x + dir * (BASE_SPEED + Math.abs(smooth) * SCROLL_BOOST) * dt)
        setX(x)
        skewTo(gsap.utils.clamp(-MAX_SKEW, MAX_SKEW, smooth * SKEW_PER_VELOCITY))
      }
      gsap.ticker.add(tick)

      return () => {
        gsap.ticker.remove(tick)
        observer.disconnect()
        gsap.set(el, { clearProps: 'transform' })
      }
    },
    { scope: root, dependencies: [motionAllowed], revertOnUpdate: true }
  )

  return (
    <section ref={root} aria-label="Skills" className="marquee border-y border-site-line">
      <div ref={track} className="marquee-track">
        <ul className="marquee-group">{items}</ul>
        <ul aria-hidden className="marquee-group marquee-dup">
          {items}
        </ul>
      </div>
    </section>
  )
}
