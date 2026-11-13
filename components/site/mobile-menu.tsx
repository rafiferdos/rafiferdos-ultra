'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotion } from '@/components/providers/motion-provider'
import { CtaPill } from '@/components/site/cta-pill'
import { LocalTime } from '@/components/site/local-time'
import { navItems } from '@/components/site/nav'
import { ThemeToggle } from '@/components/site/theme-toggle'
import { duration, gsap, useGSAP } from '@/lib/gsap'

const FOCUSABLE = 'a[href], button:not([disabled])'

export function MobileMenu() {
  // Open state is tied to the path it was opened on, so any route change closes the menu.
  const pathname = usePathname()
  const [openAt, setOpenAt] = useState<string | null>(null)
  const open = openAt === pathname
  const setOpen = useCallback(
    (next: boolean | ((value: boolean) => boolean)) =>
      setOpenAt((current) => {
        const value = typeof next === 'function' ? next(current === pathname) : next
        return value ? pathname : null
      }),
    [pathname]
  )
  const { motionAllowed } = useMotion()
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [setOpen])

  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const desktop = window.matchMedia('(min-width: 80rem)')
    const onDesktop = () => desktop.matches && setOpen(false)

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
        return
      }
      if (event.key !== 'Tab') return
      const stops = [button.current, ...(overlay.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])]
      const first = stops[0]
      const last = stops[stops.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    html.style.overflow = 'hidden'
    overlay.current?.querySelector<HTMLElement>('a[href]')?.focus()
    document.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onDesktop)
    return () => {
      html.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onDesktop)
    }
  }, [open])

  useGSAP(
    () => {
      if (!open || !motionAllowed) return
      const mm = gsap.matchMedia()
      mm.add('(max-width: 79.99rem)', () => {
        gsap.from('[data-menu-label]', { yPercent: 110, duration: duration.ui, ease: 'out', stagger: 0.06 })
        gsap.from('[data-menu-foot]', { opacity: 0, duration: duration.ui, ease: 'out', delay: 0.3 })
      })
    },
    { scope: root, dependencies: [open, motionAllowed], revertOnUpdate: true }
  )

  return (
    <div ref={root} className="xl:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
        className="t-label hover:text-site-accent"
      >
        {open ? '(Close)' : '(Menu)'}
      </button>

      {/* -z-10 keeps the overlay under the header row (wordmark, button) but above the page. */}
      <div
        ref={overlay}
        id="mobile-menu"
        data-lenis-prevent
        className={`fixed inset-0 -z-10 flex flex-col justify-between overflow-y-auto overscroll-contain bg-site-bg px-gutter pb-8 pt-24 ${open ? '' : 'invisible'}`}
      >
        <nav aria-label="Mobile">
          <ul>
            {navItems.map((item, index) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="block overflow-hidden py-[0.04em] text-[15vw] font-bold uppercase leading-[0.95] font-stretch-[75%] hover:text-site-accent"
                >
                  <span data-menu-label className="block">
                    <span className="t-label-s mr-3 align-top font-normal text-site-muted">{String(index + 1).padStart(2, '0')}</span>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div data-menu-foot className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ThemeToggle />
          <LocalTime label="Dhaka, BD" className="t-label-s text-site-muted" />
          <CtaPill />
        </div>
      </div>
    </div>
  )
}
