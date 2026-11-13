'use client'

import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

const noopSubscribe = () => () => {}

export function ThemeToggle() {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false)
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={mounted ? `Switch to ${dark ? 'light' : 'dark'} theme` : 'Switch theme'}
      className="nav-trim t-label block w-[8ch] whitespace-nowrap text-left hover:text-site-accent"
    >
      {/* Same-width placeholder until mounted keeps the header from shifting. */}
      {mounted ? (dark ? '(Dark)' : '(Light)') : ' '}
    </button>
  )
}
