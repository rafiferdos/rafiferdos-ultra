'use client'

import { useEffect, useState } from 'react'

type ClientResolverProps = {
  children: React.ReactNode | (() => React.ReactNode)
  fallback?: React.ReactNode
}

/**
 * Renders children only on the client after hydration completes.
 * Useful to avoid adding 'use client' to parent/server files.
 */
export function ClientResolver({
  children,
  fallback = null
}: ClientResolverProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <>{fallback}</>
  if (typeof children === 'function') {
    return <>{(children as () => React.ReactNode)()}</>
  }
  return <>{children}</>
}

export default ClientResolver
