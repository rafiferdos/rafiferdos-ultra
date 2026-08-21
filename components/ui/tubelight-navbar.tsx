'use client'

import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import GlassSurface from '@/components/ui/GlassSurface'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { BookOpen, BriefcaseBusiness, Home, Mail, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const items = [
  { name: 'Home', href: '/#hero', id: 'hero', icon: Home },
  { name: 'Why me', href: '/#whyme', id: 'whyme', icon: Sparkles },
  {
    name: 'Experience',
    href: '/#experience',
    id: 'experience',
    icon: BriefcaseBusiness
  },
  { name: 'Contact', href: '/#contact', id: 'contact', icon: Mail },
  { name: 'Writing', href: '/blogs', id: 'blogs', icon: BookOpen }
]

export function TubelightNavBar({ className }: { className?: string }) {
  const pathname = usePathname()
  const [active, setActive] = useState(
    pathname.startsWith('/blogs') ? 'blogs' : 'hero'
  )

  useEffect(() => {
    if (pathname !== '/') {
      setActive(pathname.startsWith('/blogs') ? 'blogs' : 'hero')
      return
    }
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-38% 0px -48% 0px', threshold: [0, 0.15, 0.5] }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [pathname])

  return (
    <nav
      aria-label="Primary navigation"
      className={cn('fixed inset-x-0 top-4 z-50 px-3', className)}
    >
      <GlassSurface
        width="auto"
        height="auto"
        borderRadius={999}
        blur={16}
        backgroundOpacity={0.08}
        saturation={1.65}
        distortionScale={-105}
        displace={0.5}
        className="mx-auto w-fit max-w-full shadow-[0_18px_60px_-24px_rgba(0,0,0,.5)]"
      >
        <div className="flex max-w-full items-center">
          <Link
            href="/"
            aria-label="Rafi Ferdos home"
            className="ml-1 mr-1 hidden size-9 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background sm:flex"
          >
            R
          </Link>
          {items.map((item) => {
            const Icon = item.icon
            const isActive = active === item.id
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActive(item.id)}
                className={cn(
                  'relative flex h-9 items-center justify-center gap-2 rounded-full px-2.5 text-xs font-medium transition sm:px-3',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full border border-border bg-muted shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  />
                )}
                <Icon className="size-4" />
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="hidden overflow-hidden whitespace-nowrap sm:inline-block"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
          <div className="ml-1 border-l border-border pl-1">
            <AnimatedThemeToggler className="size-9 rounded-full" />
          </div>
        </div>
      </GlassSurface>
    </nav>
  )
}
