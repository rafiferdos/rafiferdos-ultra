import { CtaPill } from '@/components/site/cta-pill'
import { LocalTime } from '@/components/site/local-time'
import { MobileMenu } from '@/components/site/mobile-menu'
import { navItems } from '@/components/site/nav'
import { RollLink } from '@/components/site/roll-link'
import { ThemeToggle } from '@/components/site/theme-toggle'
import { Wordmark } from '@/components/site/wordmark'

// No backdrop-filter here: it would become the containing block for the mobile menu overlay.
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-site-line bg-site-bg">
      <div className="grid h-16 grid-cols-[1fr_auto] items-center px-gutter xl:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-8">
          <Wordmark />
          <LocalTime label="Dhaka, BD" className="t-label-s hidden text-site-muted xl:inline" />
        </div>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex gap-8">
            {navItems.map((item, index) => (
              <li key={item.href}>
                <RollLink href={item.href} className="t-label">
                  {`${String(index + 1).padStart(2, '0')} ${item.label}`}
                </RollLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center justify-end gap-6 xl:flex">
          <ThemeToggle />
          <CtaPill />
        </div>
        <MobileMenu />
      </div>
    </header>
  )
}
