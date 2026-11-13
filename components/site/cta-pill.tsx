'use client'

import { usePathname } from 'next/navigation'
import { RollLink } from '@/components/site/roll-link'
import { cn } from '@/lib/utils'

// The pill is a wrapper so the roll mask clips the label, not the padding; the after layer keeps the whole pill clickable.
// Home and /services both have a contact section, so there the pill scrolls to it instead of leaving the page.
export function CtaPill({ className }: { className?: string }) {
  const pathname = usePathname()
  const local = pathname === '/' || pathname === '/services'
  return (
    <div className={cn('relative inline-flex items-center rounded-full border border-site-line-strong px-4 py-2 hover:border-site-accent', className)}>
      <RollLink href={local ? '#contact' : '/#contact'} className="nav-trim t-label block after:absolute after:inset-0 after:rounded-full">
        Get in touch
      </RollLink>
    </div>
  )
}
