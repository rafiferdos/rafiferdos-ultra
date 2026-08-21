'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

export function Strands({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let active = true
    let width = 0
    let height = 0
    let dpr = 1

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height)
      const t = reduced ? 0 : time * 0.00028
      const strands = 34

      for (let index = 0; index < strands; index += 1) {
        const progress = index / (strands - 1)
        const baseY = height * (0.14 + progress * 0.72)
        const amplitude = 18 + Math.sin(progress * Math.PI) * 34
        const hue = 36 + progress * 22
        context.beginPath()

        for (let x = -20; x <= width + 20; x += 8) {
          const wave = Math.sin(x * 0.012 + t * 5 + index * 0.34) * amplitude
          const bend = Math.sin(x * 0.003 - t * 2 + index * 0.12) * 25
          const y = baseY + wave + bend
          if (x === -20) context.moveTo(x, y)
          else context.lineTo(x, y)
        }

        const alpha = 0.1 + Math.sin(progress * Math.PI) * 0.3
        context.strokeStyle = `hsla(${hue}, 96%, 62%, ${alpha})`
        context.lineWidth = index % 6 === 0 ? 1.4 : 0.7
        context.stroke()
      }

      if (active && !reduced) frame = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting
      if (active && !reduced) frame = requestAnimationFrame(draw)
    })
    const resizeObserver = new ResizeObserver(() => {
      resize()
      draw()
    })

    resizeObserver.observe(canvas)
    observer.observe(canvas)
    resize()
    draw()

    return () => {
      active = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cn('size-full', className)}
      aria-hidden="true"
    />
  )
}
