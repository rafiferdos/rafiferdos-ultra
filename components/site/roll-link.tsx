'use client'

import Link from 'next/link'
import { useRef, type ComponentProps } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { duration, gsap, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

type RollLinkProps = Omit<ComponentProps<typeof Link>, 'children'> & { children: string }

// Two stacked copies of the label; hover slides the first out and the second in.
export function RollLink({ children, className, ...props }: RollLinkProps) {
  const root = useRef<HTMLAnchorElement>(null)
  const { motionAllowed } = useMotion()
  const { contextSafe } = useGSAP({ scope: root })

  const roll = contextSafe((yPercent: number) => {
    if (!motionAllowed) return
    gsap.to('[data-roll]', { yPercent, duration: duration.hover, ease: 'inOut', overwrite: true })
  })

  return (
    <Link
      ref={root}
      className={cn('relative inline-block overflow-hidden align-top hover:text-site-accent focus-visible:text-site-accent', className)}
      onMouseEnter={() => roll(-100)}
      onMouseLeave={() => roll(0)}
      onFocus={() => roll(-100)}
      onBlur={() => roll(0)}
      {...props}
    >
      <span data-roll className="block">
        {children}
      </span>
      <span data-roll aria-hidden className="absolute left-0 top-full block whitespace-nowrap">
        {children}
      </span>
    </Link>
  )
}
