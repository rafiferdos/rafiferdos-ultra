'use client'

import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { gsap, ScrollTrigger } from '@/lib/gsap'

// How far a section top may be from where it should be before the landing is corrected.
const TOLERANCE = 2
// After landing on an anchor, layout changes within this time (a scrollbar coming back, fonts, images) move the scroll with the section.
const HOLD_MS = 1500

const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight

// Where the page has to be scrolled so the element sits at its own scroll-margin, as far as the page can scroll.
const placeOf = (el: HTMLElement) => {
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  return gsap.utils.clamp(0, maxScroll(), el.getBoundingClientRect().top + window.scrollY - margin)
}

// Calls back once the page height has held still for a few frames (or after 1.5 s), so a layout that is still settling is not measured.
const whenStable = (done: () => void) => {
  const start = performance.now()
  let height = -1
  let still = 0
  let frame = requestAnimationFrame(function step() {
    const next = document.documentElement.scrollHeight
    still = next === height ? still + 1 : 0
    height = next
    if (still >= 6 || performance.now() - start > 1500) done()
    else frame = requestAnimationFrame(step)
  })
  return () => cancelAnimationFrame(frame)
}

const hashTarget = (hash: string) => (hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const { motionAllowed } = useMotion()
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)
  const held = useRef<{ el: HTMLElement; until: number } | null>(null)

  useEffect(() => {
    if (!motionAllowed) return

    // No `anchors`: the click handler below owns same-page hash links, so Lenis and Next's own hash scroll cannot race.
    const lenis = new Lenis({ autoRaf: false })
    lenisRef.current = lenis
    if (window.sessionStorage?.getItem('st-debug')) Object.assign(window, { __lenis: lenis })
    const tick = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Lenis caches the page height and clamps every scroll to it, so it has to be told whenever the layout moves.
    const relayout = () => {
      lenis.resize()
      ScrollTrigger.refresh()
      const hold = held.current
      if (!hold || !hold.el.isConnected || performance.now() > hold.until) return
      const want = placeOf(hold.el)
      if (Math.abs(window.scrollY - want) > TOLERANCE) lenis.scrollTo(want, { immediate: true })
    }
    // Anyone scrolling by hand takes over from the held anchor.
    const release = () => {
      held.current = null
    }
    window.addEventListener('wheel', release, { passive: true })
    window.addEventListener('touchstart', release, { passive: true })
    window.addEventListener('keydown', release)
    document.fonts.ready.then(relayout)
    window.addEventListener('load', relayout)

    // Not Lenis' own observer: that one is a trailing debounce, which never fires while the height keeps changing.
    let height = document.documentElement.scrollHeight
    let pending: number | undefined
    const observer = new ResizeObserver(() => {
      if (pending !== undefined || Math.abs(document.documentElement.scrollHeight - height) < 1) return
      pending = window.setTimeout(() => {
        pending = undefined
        height = document.documentElement.scrollHeight
        relayout()
      }, 150)
    })
    observer.observe(document.documentElement)

    // Scrolls to the element and, once it has arrived, checks the real position once more: images and fonts can move it on the way.
    const goTo = (el: HTMLElement) => {
      lenis.resize()
      lenis.scrollTo(placeOf(el), {
        onComplete: () => {
          lenis.resize()
          const want = placeOf(el)
          if (Math.abs(window.scrollY - want) > TOLERANCE) lenis.scrollTo(want, { immediate: true })
          held.current = { el, until: performance.now() + HOLD_MS }
        }
      })
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element).closest('a')
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return
      const url = new URL(link.href, location.href)
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return
      const el = hashTarget(url.hash)
      if (!el) return

      // Capture phase, so Next's Link (which would scrollIntoView on its own) sees a handled click.
      event.preventDefault()
      if (url.hash !== location.hash) history.pushState(null, '', url.pathname + url.search + url.hash)
      if (!el.hasAttribute('tabindex')) el.tabIndex = -1
      el.focus({ preventScroll: true })
      goTo(el)
    }
    document.addEventListener('click', onClick, true)

    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('load', relayout)
      window.removeEventListener('wheel', release)
      window.removeEventListener('touchstart', release)
      window.removeEventListener('keydown', release)
      observer.disconnect()
      window.clearTimeout(pending)
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [motionAllowed])

  // After a route change the new page has mounted its triggers and the layout is final: re-measure, and put a #hash target where it belongs.
  // Next has already scrolled to the hash by now, from the layout it had at that moment.
  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    let cancel = () => {}
    let alive = true
    document.fonts.ready.then(() => {
      if (!alive) return
      cancel = whenStable(() => {
        lenis.resize()
        ScrollTrigger.refresh()
        const el = hashTarget(location.hash)
        if (!el) return
        lenis.scrollTo(placeOf(el), { immediate: true })
        held.current = { el, until: performance.now() + HOLD_MS }
      })
    })
    return () => {
      alive = false
      cancel()
    }
  }, [pathname, motionAllowed])

  return children
}
