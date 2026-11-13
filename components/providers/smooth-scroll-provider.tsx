'use client'

import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const { motionAllowed } = useMotion()

  useEffect(() => {
    if (!motionAllowed) return

    const lenis = new Lenis({ autoRaf: false, anchors: true })
    const tick = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const refresh = () => ScrollTrigger.refresh()
    document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [motionAllowed])

  return children
}
