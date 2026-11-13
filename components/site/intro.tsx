'use client'

import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { gsap, useGSAP } from '@/lib/gsap'

// Seconds from the intro start to the bars leaving; the hero letters wait this long (see hero-motion).
export const INTRO_HANDOFF = 0.3

const BARS = 5

// First visit of a session, home only. The pre-paint script in the (site) layout adds js-intro; the CSS shows the overlay only then.
export function Intro() {
  const root = useRef<HTMLDivElement>(null)
  const { motionAllowed } = useMotion()

  useGSAP(
    () => {
      const html = document.documentElement
      const el = root.current
      if (!el || !html.classList.contains('js-intro')) return
      if (!motionAllowed) {
        html.classList.remove('js-intro')
        return
      }
      try {
        sessionStorage.setItem('intro-seen', '1')
      } catch {}

      const counter = el.querySelector<HTMLElement>('[data-intro-count]')
      const value = { n: 0 }
      const tl = gsap.timeline({ paused: true, onComplete: () => html.classList.remove('js-intro') })
      tl.to(value, {
        n: 100,
        duration: INTRO_HANDOFF,
        ease: 'none',
        onUpdate: () => {
          if (counter) counter.textContent = String(Math.round(value.n)).padStart(2, '0')
        }
      })
        .to('[data-intro-text]', { opacity: 0, duration: 0.2, ease: 'out' }, '>')
        .to('[data-intro-bar]', { scaleY: 0, duration: 0.5, ease: 'inOut', stagger: 0.05 }, '<')

      // The counter waits for the fonts, but never longer than a second.
      const start = () => tl.play()
      document.fonts.ready.then(start)
      const cap = window.setTimeout(start, 1000)
      return () => window.clearTimeout(cap)
    },
    { scope: root, dependencies: [motionAllowed] }
  )

  return (
    <div ref={root} aria-hidden className="intro">
      {Array.from({ length: BARS }, (_, index) => (
        <span key={index} data-intro-bar className="intro-bar" style={{ left: `${index * 20}%` }} />
      ))}
      <div data-intro-text className="t-label relative flex h-full items-end justify-between px-gutter pb-10">
        <span className="t-h1">
          RAFI <span className="font-light italic">ferdos</span>
        </span>
        <span data-intro-count className="t-index min-w-[3ch] text-right tabular-nums">
          00
        </span>
      </div>
    </div>
  )
}
