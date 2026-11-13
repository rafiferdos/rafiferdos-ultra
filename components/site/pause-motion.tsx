'use client'

import { useMotion } from '@/components/providers/motion-provider'

export function PauseMotion() {
  const { paused, reducedMotion, setPaused } = useMotion()

  return (
    <button
      type="button"
      onClick={() => setPaused(!paused)}
      disabled={reducedMotion}
      aria-pressed={paused || reducedMotion}
      className="t-label inline-block w-[16ch] whitespace-nowrap text-left hover:text-site-accent disabled:cursor-default disabled:text-site-muted disabled:hover:text-site-muted"
    >
      {reducedMotion ? '(Motion off)' : paused ? '(Play motion)' : '(Pause motion)'}
    </button>
  )
}
