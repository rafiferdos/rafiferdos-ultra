'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Briefcase, FileText, Home, LucideIcon, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnimatedThemeToggler } from './animated-theme-toggler'

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface TubelightNavBarProps {
  items?: NavItem[]
  className?: string
  defaultActive?: string
}

export function TubelightNavBar({
  items = [
    { name: 'Home', url: '#', icon: Home },
    { name: 'About', url: '#', icon: User },
    { name: 'Projects', url: '#', icon: Briefcase },
    { name: 'Resume', url: '#', icon: FileText }
  ],
  className,
  defaultActive = 'Home'
}: TubelightNavBarProps) {
  const [activeTab, setActiveTab] = useState(defaultActive)

  useEffect(() => {
    const handleResize = () => {
      // setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className={cn(
        'fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6',
        className
      )}
    >
      <div
        className="flex items-center gap-3 px-1 py-1 rounded-full border shadow-[0_10px_40px_rgba(15,23,42,0.25)] bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm backdrop-saturate-200 backdrop-brightness-300 border-white dark:border-white/5"
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                'relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors',
                'text-foreground/80 hover:text-primary',
                isActive && 'text-primary'
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/30 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/30 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/30 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </button>
          )
        })}
        <AnimatedThemeToggler className="pr-2" />
      </div>
    </div>
  )
}

export default function TubelightNavBarDemo() {
  const navItems = [
    { name: 'Home', url: '#', icon: Home },
    { name: 'About', url: '#', icon: User },
    { name: 'Projects', url: '#', icon: Briefcase },
    { name: 'Resume', url: '#', icon: FileText }
  ]

  return <TubelightNavBar items={navItems} />
}
