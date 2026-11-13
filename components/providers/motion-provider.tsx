'use client'

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from 'react'

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

type MotionState = {
  reducedMotion: boolean
  motionAllowed: boolean
}

const MotionContext = createContext<MotionState | null>(null)

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const readReduced = () => window.matchMedia(REDUCED_QUERY).matches

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useSyncExternalStore(subscribe, readReduced, () => false)
  const motionAllowed = !reducedMotion

  // Keeps the class the pre-paint script set in sync if the OS setting changes later.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('js-motion', motionAllowed)
    root.dataset.motion = motionAllowed ? 'on' : 'off'
  }, [motionAllowed])

  const value = useMemo(() => ({ reducedMotion, motionAllowed }), [reducedMotion, motionAllowed])

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export function useMotion() {
  const context = useContext(MotionContext)
  if (!context) throw new Error('useMotion must be used inside MotionProvider')
  return context
}
