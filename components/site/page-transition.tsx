'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { titleClass } from '@/features/projects/title-style'
import { gsap, useGSAP } from '@/lib/gsap'

const BARS = 5
const COVER = { scaleY: 1, transformOrigin: 'bottom', duration: 0.4, ease: 'inOut', stagger: 0.04, overwrite: true } as const
const REVEAL = { scaleY: 0, transformOrigin: 'top', duration: 0.5, ease: 'inOut', stagger: 0.04, overwrite: true } as const

// Bars cover the page on internal route changes. A link with data-transition-title (a project) wipes a page-colored panel and raises the
// destination's title instead, at the exact spot the project page puts it. Back and forward are native navigations, so they never show either.
export function PageTransition() {
  const root = useRef<HTMLDivElement>(null)
  const covered = useRef(false)
  const mode = useRef<'bars' | 'title'>('bars')
  const router = useRouter()
  const pathname = usePathname()
  const { motionAllowed } = useMotion()

  // Opens the cover. The title layer stays up until the panel is gone: the page title is under it at the same spot.
  const reveal = (immediate = false) => {
    covered.current = false
    const el = root.current
    if (mode.current === 'bars') {
      gsap.to(gsap.utils.toArray('[data-bar]', el), REVEAL)
      return
    }
    const done = () => {
      gsap.set(el?.querySelector('[data-title-layer]') ?? null, { visibility: 'hidden' })
      delete document.documentElement.dataset.arrival
    }
    const open = () =>
      gsap.to(el?.querySelector('[data-panel]') ?? null, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.4,
        ease: 'inOut',
        overwrite: true,
        onComplete: done
      })
    // Two frames, so the page's own title has been measured before the overlay one goes.
    if (immediate) open()
    else requestAnimationFrame(() => requestAnimationFrame(open))
  }

  useGSAP(
    (_context, contextSafe) => {
      if (!motionAllowed || !contextSafe) return

      const onClick = contextSafe((event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const link = (event.target as Element).closest('a')
        if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return
        const url = new URL(link.href, location.href)
        // Same page (hash jumps, Lenis anchors) and other origins keep their default behavior.
        if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return

        // Capture phase, so this runs before Next's Link and its own navigation.
        event.preventDefault()
        event.stopPropagation()
        if (covered.current) return
        covered.current = true
        const go = () => router.push(url.pathname + url.search + url.hash)
        const title = link.dataset.transitionTitle
        const el = root.current
        const panel = el?.querySelector<HTMLElement>('[data-panel]')
        const layer = el?.querySelector<HTMLElement>('[data-title-layer]')
        const text = layer?.querySelector<HTMLElement>('.fit-text')
        if (title && panel && layer && text) {
          mode.current = 'title'
          text.textContent = title
          gsap.set(layer, { visibility: 'visible' })
          // One read on click: the title's width in em, so the overlay type has the destination's exact size.
          text.style.setProperty('--fit-w', '1')
          const size = parseFloat(getComputedStyle(text).fontSize)
          const em = text.getBoundingClientRect().width / size
          text.closest<HTMLElement>('.fit')?.style.setProperty('--fit-w', String(em))
          gsap.set(text, { yPercent: 105 })
          document.documentElement.dataset.arrival = 'title'
          gsap
            .timeline({ onComplete: go })
            .to(panel, { scaleY: 1, transformOrigin: 'bottom', duration: 0.4, ease: 'inOut' })
            .to(text, { yPercent: 0, duration: 0.5, ease: 'out' }, 0.1)
        } else {
          mode.current = 'bars'
          gsap.to(gsap.utils.toArray('[data-bar]', el), { ...COVER, onComplete: go })
        }
        // If the route never changes, do not leave the page covered.
        window.setTimeout(() => {
          if (!covered.current) return
          reveal(true)
        }, 4000)
      })

      document.addEventListener('click', onClick, true)
      return () => document.removeEventListener('click', onClick, true)
    },
    { scope: root, dependencies: [motionAllowed, router], revertOnUpdate: true }
  )

  // The new route is in: open the bars.
  useGSAP(
    () => {
      if (covered.current) reveal()
    },
    { scope: root, dependencies: [pathname] }
  )

  return (
    <div ref={root} aria-hidden className="page-transition">
      {Array.from({ length: BARS }, (_, index) => (
        <span key={index} data-bar className="page-bar" style={{ left: `${index * 20}%` }} />
      ))}
      <div data-panel className="page-panel" />
      {/* Same box model as the project page: pt-28, one label line, mt-8, then the fitted title. */}
      <div data-title-layer className="page-title-layer px-gutter pt-28">
        <div className="t-label">&nbsp;</div>
        <div className="project-title mt-8">
          <span className="fit">
            <span className={`fit-text ${titleClass}`} />
          </span>
        </div>
      </div>
    </div>
  )
}
