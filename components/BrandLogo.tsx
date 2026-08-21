import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export function BrandLogo({
  className,
  withName = false
}: {
  className?: string
  withName?: boolean
}) {
  return (
    <Link
      href="/"
      aria-label="Rafi Ferdos home"
      className={cn('inline-flex items-center gap-2.5', className)}
    >
      <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[radial-gradient(circle_at_30%_15%,#7c3aed,#111827_52%,#030712)] shadow-[0_8px_28px_-12px_rgba(124,58,237,.9)]">
        <Image
          src="/rafi.png"
          alt=""
          width={72}
          height={72}
          className="size-8 object-contain p-0.5"
          priority
        />
      </span>
      {withName && (
        <span className="text-sm font-semibold tracking-[-.03em]">
          Rafi Ferdos
        </span>
      )}
    </Link>
  )
}
