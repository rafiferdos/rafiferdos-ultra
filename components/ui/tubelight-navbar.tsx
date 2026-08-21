'use client'

import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { BrandLogo } from '@/components/BrandLogo'
import GlassSurface from '@/components/ui/GlassSurface'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import {
  BookOpen,
  BriefcaseBusiness,
  FolderKanban,
  Home,
  Mail,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MouseEvent, useEffect, useState } from 'react'

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
  {
    name: 'Projects',
    href: '/projects',
    id: 'projects-page',
    icon: FolderKanban
  },
  { name: 'Writing', href: '/blogs', id: 'blogs', icon: BookOpen }
]

export function TubelightNavBar({ className }: { className?: string }) {
  const pathname = usePathname()
  const [active, setActive] = useState(
    pathname.startsWith('/blogs')
      ? 'blogs'
      : pathname.startsWith('/projects')
        ? 'projects-page'
        : 'hero'
  )

  useEffect(() => {
    if (pathname !== '/') {
      setActive(
        pathname.startsWith('/blogs')
          ? 'blogs'
          : pathname.startsWith('/projects')
            ? 'projects-page'
            : 'hero'
      )
      return
    }
    let frame = 0
    const updateActiveSection = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (window.scrollY < 96) {
          setActive('hero')
          return
        }
        const anchorLine = 112
        const sections = items
          .filter((item) => item.href.startsWith('/#'))
          .map((item) => document.getElementById(item.id))
          .filter(Boolean) as HTMLElement[]
        const current = sections.reduce<HTMLElement | null>(
          (match, section) => {
            return section.getBoundingClientRect().top <= anchorLine
              ? section
              : match
          },
          null
        )
        setActive(current?.id || 'hero')
      })
    }
    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [pathname])

  function handleNavClick(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string
  ) {
    if (pathname !== '/' || !href.startsWith('/#')) {
      setActive(id)
      return
    }
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()
    const top = target.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    window.history.replaceState(null, '', id === 'hero' ? '/' : `/#${id}`)
    setActive(id)
  }

  return (
    <nav
      aria-label="Primary navigation"
      className={cn('fixed inset-x-0 top-4 z-50 px-3', className)}
    >
      <GlassSurface
        width="fit-content"
        height="fit-content"
        borderRadius={999}
        borderWidth={0.08}
        brightness={54}
        opacity={0.9}
        blur={16}
        backgroundOpacity={0.1}
        saturation={1.55}
        distortionScale={-95}
        displace={0.5}
        className="mx-auto shadow-[0_18px_60px_-24px_rgba(0,0,0,.5)] dark:border"
        style={{ maxWidth: 'calc(100vw - 1.5rem)' }}
      >
        <div className="flex max-w-full items-center">
          <BrandLogo className="ml-0.5 mr-1 hidden sm:inline-flex [&_span]:size-9 [&_img]:size-7" />
          {items.map((item) => {
            const Icon = item.icon
            const isActive = active === item.id
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(event) => handleNavClick(event, item.href, item.id)}
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
                    // className="absolute inset-0 -z-10 rounded-full bg-linear-30 from-yellow-500/30 to-violet-700/30 dark:from-fuchsia-500/20 dark:via-amber-500/20 dark:to-fuchsia-500/20"
                    className="absolute inset-0 -z-10 rounded-full bg-muted/40 dark:bg-muted/20"
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
