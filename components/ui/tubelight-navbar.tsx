'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AnimatedThemeToggler } from './animated-theme-toggler'
import GlassSurface from './GlassSurface'

// Icons
import IconHouse from '@/components/icons/House'
import IconUser from '@/components/icons/User'
import IconStackPerspective from '@/components/icons/Stack'
import IconFeather from '@/components/icons/Feather'

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
    { name: 'Home', url: '#hero', Icon: IconHouse },
    { name: 'About', url: '#whyme', Icon: IconUser },
    { name: 'Tech', url: '#techstack', Icon: IconFeather },
    { name: 'Projects', url: '#projects', Icon: IconStackPerspective },
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
                  'relative cursor-pointer text-sm font-semibold px-6 py-1 rounded-full transition-colors',
                  'text-foreground/80 hover:text-[#FFCC00]',
                  isActive && 'text-[#FFCC00] drop-shadow-[0_0_12px_rgba(255,204,0,0.8)]'
                )}
                aria-label={item.name}
              >
                <span className="relative z-10 block">
                  <Icon
                    size={34}
                    style={isActive ? {
                      filter: 'sepia(100%) hue-rotate(20deg) saturate(800%) drop-shadow(0 0 8px rgba(255, 204, 0, 0.8))'
                    } : {}}
                  />
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
