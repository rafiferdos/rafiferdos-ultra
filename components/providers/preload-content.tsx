'use client'

import { usePreload } from '@/components/providers/preload-provider'

export function PreloadContent({ children }: { children: React.ReactNode }) {
  const { ready } = usePreload()

  if (!ready) return null

  return <>{children}</>
}
