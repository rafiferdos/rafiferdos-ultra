'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'

type PreloadContextValue = {
  ready: boolean
  markReady: () => void
}

const PreloadContext = createContext<PreloadContextValue>({
  ready: false,
  markReady: () => {}
})

export function PreloadProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  const markReady = useCallback(() => {
    setReady((prev) => {
      if (!prev) {
        // Broadcast a DOM event for non-React listeners
        try {
          window.dispatchEvent(new Event('preload:done'))
        } catch {}
      }
      return true
    })
  }, [])

  const value = useMemo(() => ({ ready, markReady }), [ready, markReady])

  return (
    <PreloadContext.Provider value={value}>{children}</PreloadContext.Provider>
  )
}

export function usePreload() {
  return useContext(PreloadContext)
}
