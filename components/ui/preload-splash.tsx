'use client'

import { usePreload } from '@/components/providers/preload-provider'
import { cn } from '@/lib/utils'
import { DotLottiePlayer } from '@dotlottie/react-player'
import { useEffect, useRef, useState } from 'react'

interface PreloadSplashProps {
  src?: string // path to .lottie file in public/
  speed?: number // playback speed multiplier
  className?: string
  onFinish?: () => void
}

export function PreloadSplash({
  src = '/preload.lottie',
  speed = 1,
  className,
  onFinish
}: PreloadSplashProps) {
  const [done, setDone] = useState(false)
  const [fading, setFading] = useState(false)
  const timeoutRef = useRef<number | undefined>(undefined)
  const fadeRef = useRef<number | undefined>(undefined)
  const { markReady } = usePreload()

  useEffect(() => {
    if (done) return

    // prevent background scrolling while splash is visible
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    // Keep the preloader visible for a fixed 4 seconds, then fade out
    timeoutRef.current = window.setTimeout(() => {
      // start fade-out animation
      setFading(true)
      // allow CSS transition to complete before unmounting
      fadeRef.current = window.setTimeout(() => {
        if (!done) {
          setDone(true)
          onFinish?.()
          // Signal that the site can start its own animations
          try {
            // CRITICAL: Reset scroll to top before revealing content
            window.scrollTo(0, 0)
            markReady()
            // Restore scrolling
            document.documentElement.style.overflow = ''
          } catch { }
        }
      }, 500) // match CSS duration below
    }, 4000)

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      if (fadeRef.current) window.clearTimeout(fadeRef.current)
      // Ensure overflow is restored if component unmounts
      document.documentElement.style.overflow = ''
    }
  }, [onFinish, done])

  const finish = () => {
    if (!done) {
      setDone(true)
      onFinish?.()
    }
  }

  if (done) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center bg-background/60 backdrop-blur-lg transition-opacity duration-500 ease-out',
        fading ? 'opacity-0' : 'opacity-100',
        className
      )}
      style={{ WebkitBackdropFilter: 'blur(16px)' }}
    >
      <DotLottiePlayer
        src={src}
        autoplay
        loop
        speed={speed}
        // We intentionally ignore 'complete' to keep the overlay for 4s
        // size to fit without overwhelming the viewport
        style={{ width: 'min(90vw, 560px)', height: 'auto' }}
        className={cn(
          'bg-transparent transition-transform duration-500 ease-out',
          fading ? 'scale-95' : 'scale-100'
        )}
      />
    </div>
  )
}
