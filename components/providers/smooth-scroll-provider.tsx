'use client'

import Lenis from 'lenis'
import { ReactNode, useEffect } from 'react'

export const SmoothScrollProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.35, easing: (time) => 1 - Math.pow(1 - time, 4) })
    let frame = 0
    const update = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(update) }
    frame = requestAnimationFrame(update)
    return () => { cancelAnimationFrame(frame); lenis.destroy() }
  }, [])
  return children
}
