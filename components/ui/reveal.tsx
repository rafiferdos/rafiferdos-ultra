'use client'

import { cn } from '@/lib/utils'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ReactNode, useRef } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  blur?: number
  amount?: number
}

const offsets = {
  up: { x: 0, y: 34 },
  down: { x: 0, y: -34 },
  left: { x: 34, y: 0 },
  right: { x: -34, y: 0 },
  none: { x: 0, y: 0 }
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.72,
  direction = 'up',
  blur = 10,
  amount = 0.18
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount })
  const reduceMotion = useReducedMotion()
  const visible = isInView || reduceMotion

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={
        visible
          ? { opacity: 1, x: 0, y: 0, filter: 'blur(0px)', scale: 1 }
          : {
              opacity: 0,
              ...offsets[direction],
              filter: `blur(${blur}px)`,
              scale: 0.985
            }
      }
      transition={{
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={cn('will-change-[transform,opacity,filter]', className)}
    >
      {children}
    </motion.div>
  )
}

export function RevealGroup({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={className}>{children}</div>
}
