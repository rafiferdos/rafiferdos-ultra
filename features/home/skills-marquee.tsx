'use client'

import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

// The Skills list of docs/resume.md, split by area, plus what Rafi named that the resume does not list yet:
// AI and RAG, AWS, Jest, Playwright (see "Needs Rafi: confirm" in progress.md). Two rows, so each can run its own way.
// Both tracks start at x = 0, so the first items of each row are the ones on screen before it moves: the advanced skills go first.
const rows = [
  {
    label: 'Frontend, mobile and AI',
    direction: -1,
    skills: [
      'AI and RAG',
      'Next.js',
      'TypeScript',
      'React Native',
      'React',
      'Expo',
      'Redux',
      'Tailwind CSS',
      'JavaScript (ES6+)',
      'Code review'
    ]
  },
  {
    label: 'Backend, cloud and testing',
    direction: 1,
    skills: [
      'AWS',
      'Docker',
      'CI/CD',
      'GraphQL',
      'Node.js',
      'PostgreSQL',
      'Playwright',
      'Jest',
      'Socket.IO',
      'Real-time systems',
      'Prisma ORM',
      'Express.js',
      'REST APIs',
      'MongoDB',
      'Mongoose',
      'Firebase',
      'Git'
    ]
  }
]

const BASE_SPEED = 40
const SCROLL_BOOST = 0.15
const SKEW_PER_VELOCITY = 0.004
const MAX_SKEW = 6
const PAUSE_EASE = 6

const items = (skills: string[]) =>
  skills.map((skill) => (
    <li key={skill} className="marquee-item">
      {skill}
      <span aria-hidden className="marquee-mark">
        ◆
      </span>
    </li>
  ))

export function SkillsMarquee() {
  const root = useRef<HTMLElement>(null)
  const { motionAllowed } = useMotion()

  useGSAP(
    () => {
      const section = root.current
      if (!motionAllowed || !section) return
      const view = ScrollTrigger.create({ trigger: section, start: 'top bottom', end: 'bottom top' })
      const cleanups: Array<() => void> = []

      section.querySelectorAll<HTMLElement>('[data-marquee-row]').forEach((row) => {
        const track = row.querySelector<HTMLElement>('.marquee-track')
        const group = track?.firstElementChild
        if (!track || !group) return

        const dir = Number(row.dataset.direction) || -1
        let width = 0
        let x = 0
        let smooth = 0
        let rate = 1
        let hold = false
        const observer = new ResizeObserver(([entry]) => {
          width = entry.borderBoxSize[0].inlineSize
        })
        observer.observe(group)

        const setX = gsap.quickSetter(track, 'x', 'px')
        const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.6, ease: 'out' })
        const toggle = (on: boolean) => () => (hold = on)
        const [pause, resume] = [toggle(true), toggle(false)]
        row.tabIndex = 0
        row.addEventListener('pointerenter', pause)
        row.addEventListener('pointerleave', resume)
        row.addEventListener('focus', pause)
        row.addEventListener('blur', resume)

        const tick = (_time: number, deltaMs: number) => {
          if (!view.isActive || !width) return
          const dt = Math.min(deltaMs, 100) / 1000
          smooth += (view.getVelocity() - smooth) * Math.min(1, dt * 8)
          rate += ((hold ? 0 : 1) - rate) * Math.min(1, dt * PAUSE_EASE)
          x = gsap.utils.wrap(-width, 0, x + dir * (BASE_SPEED + Math.abs(smooth) * SCROLL_BOOST) * rate * dt)
          setX(x)
          skewTo(gsap.utils.clamp(-MAX_SKEW, MAX_SKEW, smooth * SKEW_PER_VELOCITY * rate))
        }
        gsap.ticker.add(tick)

        cleanups.push(() => {
          gsap.ticker.remove(tick)
          observer.disconnect()
          row.removeAttribute('tabindex')
          row.removeEventListener('pointerenter', pause)
          row.removeEventListener('pointerleave', resume)
          row.removeEventListener('focus', pause)
          row.removeEventListener('blur', resume)
          gsap.set(track, { clearProps: 'transform' })
        })
      })

      return () => {
        view.kill()
        cleanups.forEach((cleanup) => cleanup())
      }
    },
    { scope: root, dependencies: [motionAllowed], revertOnUpdate: true }
  )

  return (
    <section ref={root} aria-label="Skills" className="marquee border-y border-site-line">
      {rows.map(({ label, direction, skills }) => (
        <div
          key={label}
          data-marquee-row
          data-direction={direction}
          role="group"
          aria-label={label}
          className="marquee-row"
        >
          <div className="marquee-track">
            <ul className="marquee-group">{items(skills)}</ul>
            <ul aria-hidden className="marquee-group marquee-dup">
              {items(skills)}
            </ul>
          </div>
        </div>
      ))}
    </section>
  )
}
