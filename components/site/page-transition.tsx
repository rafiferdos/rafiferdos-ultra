'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { gsap, useGSAP } from '@/lib/gsap'

const BARS = 5
const COVER = { scaleY: 1, transformOrigin: 'bottom', duration: 0.4, ease: 'inOut', stagger: 0.04, overwrite: true } as const
const REVEAL = { scaleY: 0, transformOrigin: 'top', duration: 0.5, ease: 'inOut', stagger: 0.04, overwrite: true } as const

// Bars cover the page on internal route changes. Back and forward are native navigations, so they never show the bars.
export function PageTransition() {
  const root = useRef<HTMLDivElement>(null)
  const covered = useRef(false)
  const router = useRouter()
  const pathname = usePathname()
  const { motionAllowed } = useMotion()

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
        const bars = gsap.utils.toArray('[data-bar]', root.current)
        gsap.to(bars, { ...COVER, onComplete: () => router.push(url.pathname + url.search + url.hash) })
        // If the route never changes, do not leave the page covered.
        window.setTimeout(() => {
          if (!covered.current) return
          covered.current = false
          gsap.to(bars, REVEAL)
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
      if (!covered.current) return
      covered.current = false
      gsap.to(gsap.utils.toArray('[data-bar]', root.current), REVEAL)
    },
    { scope: root, dependencies: [pathname] }
  )

  return (
    <div ref={root} aria-hidden className="page-transition">
      {Array.from({ length: BARS }, (_, index) => (
        <span key={index} data-bar className="page-bar" style={{ left: `${index * 20}%` }} />
      ))}
    </div>
  )
}
