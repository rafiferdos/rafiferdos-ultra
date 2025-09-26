'use client'

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
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // prevent background scrolling while splash is visible
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    // Keep the preloader visible for a fixed 4 seconds
    timeoutRef.current = window.setTimeout(() => {
      if (!done) {
        setDone(true)
        onFinish?.()
      }
    }, 4000)

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      document.documentElement.style.overflow = prevOverflow
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
        'fixed inset-0 z-[9999] flex items-center justify-center bg-background/60 backdrop-blur-[1px]',
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
        className="bg-transparent"
      />
    </div>
  )
}
