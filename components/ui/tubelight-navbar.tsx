'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AnimatedThemeToggler } from './animated-theme-toggler'
import GlassSurface from './GlassSurface'

// Icons
import { Home, User, Cpu, Briefcase } from 'lucide-react'

// GSAP
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

interface NavItem {
  name: string
  url: string
  Icon: React.ElementType
}

interface TubelightNavBarProps {
  className?: string
  defaultActive?: string
}

export function TubelightNavBar({
  className,
  defaultActive = 'Home'
}: TubelightNavBarProps) {
  const [activeTab, setActiveTab] = useState(defaultActive)

  const items: NavItem[] = [
    { name: 'Home', url: '#hero', Icon: Home },
    { name: 'About', url: '#whyme', Icon: User },
    { name: 'Tech', url: '#techstack', Icon: Cpu },
    { name: 'Projects', url: '#projects', Icon: Briefcase },
  ]

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeItem = items.find((item) => item.url === `#${entry.target.id}`)
          if (activeItem) {
            setActiveTab(activeItem.name)
          }
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0,
    })

    items.forEach((item) => {
      const element = document.querySelector(item.url)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY < 100) {
        setActiveTab('Home')
      }
    }

    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  const handleNavClick = (name: string, url: string) => {
    setActiveTab(name)
    const target = document.querySelector(url)
    if (target) {
      gsap.to(window, {
        scrollTo: { y: target as Element, offsetY: 0 },
        duration: 1.2,
        ease: 'power4.inOut'
      })
    }
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-1/2 -translate-x-1/2 z-50 mb-6',
        className
      )}
    >
      <GlassSurface
        height="auto"
        width="auto"
        borderRadius={50}
        opacity={0.9}
        backgroundOpacity={0}
        blur={10}
        distortionScale={-110}
        displace={1}
        mixBlendMode='difference'
      >
        <div className="flex items-center px-2"> {/* Wrapper for flex alignment if needed, though map returns elements */}
          {items.map((item) => {
            const Icon = item.Icon
            const isActive = activeTab === item.name

            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.name, item.url)}
                className={cn(
                  'relative cursor-pointer flex items-center justify-center gap-2 rounded-full transition-all duration-300',
                  isActive ? 'px-5 py-2 text-[#FFCC00] drop-shadow-[0_0_8px_rgba(255,204,0,0.5)]' : 'px-3 py-2 text-foreground/60 hover:text-foreground/80'
                )}
                aria-label={item.name}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="overflow-hidden whitespace-nowrap text-sm font-semibold"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>

                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full bg-[#FFCC00]/5 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#FFCC00] rounded-t-full">
                      <div className="absolute w-12 h-6 bg-[#FFCC00]/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-[#FFCC00]/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-[#FFCC00]/20 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
                )}
              </button>
            )
          })}
          <AnimatedThemeToggler className="pr-2 ml-2" />
        </div>
      </GlassSurface>
    </div>
  )
}
