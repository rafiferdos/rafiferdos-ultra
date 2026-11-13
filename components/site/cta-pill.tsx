import { RollLink } from '@/components/site/roll-link'
import { cn } from '@/lib/utils'

// The pill is a wrapper so the roll mask clips the label, not the padding; the after layer keeps the whole pill clickable.
export function CtaPill({ className }: { className?: string }) {
  return (
    <div className={cn('relative rounded-full border border-site-line-strong px-4 py-2 hover:border-site-accent', className)}>
      <RollLink href="/#contact" className="t-label after:absolute after:inset-0 after:rounded-full">
        Get in touch
      </RollLink>
    </div>
  )
}
