'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from 'react'

const PAUSE_KEY = 'motion-paused'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
const listeners = new Set<() => void>()

type MotionState = {
  paused: boolean
  reducedMotion: boolean
  motionAllowed: boolean
  setPaused: (paused: boolean) => void
}

const MotionContext = createContext<MotionState | null>(null)

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY)
  listeners.add(onChange)
  query.addEventListener('change', onChange)
  window.addEventListener('storage', onChange)
  return () => {
    listeners.delete(onChange)
    query.removeEventListener('change', onChange)
    window.removeEventListener('storage', onChange)
  }
}

function readPaused() {
  try {
    return localStorage.getItem(PAUSE_KEY) === '1'
  } catch {
    return false
  }
}

const readReduced = () => window.matchMedia(REDUCED_QUERY).matches

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const paused = useSyncExternalStore(subscribe, readPaused, () => false)
  const reducedMotion = useSyncExternalStore(subscribe, readReduced, () => false)
  const motionAllowed = !reducedMotion && !paused

  const setPaused = useCallback((next: boolean) => {
    try {
      localStorage.setItem(PAUSE_KEY, next ? '1' : '0')
    } catch {}
    listeners.forEach((notify) => notify())
  }, [])

  // Keeps the class the pre-paint script set in sync when the user toggles later.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('js-motion', motionAllowed)
    root.dataset.motion = motionAllowed ? 'on' : 'off'
  }, [motionAllowed])

  const value = useMemo(
    () => ({ paused, reducedMotion, motionAllowed, setPaused }),
    [paused, reducedMotion, motionAllowed, setPaused]
  )

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export function useMotion() {
  const context = useContext(MotionContext)
  if (!context) throw new Error('useMotion must be used inside MotionProvider')
  return context
}
