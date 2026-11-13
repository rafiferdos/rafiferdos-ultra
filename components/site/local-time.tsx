'use client'

import { useSyncExternalStore } from 'react'

const clock = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'Asia/Dhaka'
})

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 10_000)
  return () => clearInterval(id)
}

// The server snapshot is a fixed placeholder, so the hydrated markup always matches.
export function LocalTime({ label, className }: { label: string; className?: string }) {
  const time = useSyncExternalStore(subscribe, () => clock.format(new Date()), () => '--:--')
  return (
    <span className={className}>
      {label} <span className="tabular-nums">{time}</span>
    </span>
  )
}
