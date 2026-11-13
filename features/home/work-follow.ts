import { gsap } from '@/lib/gsap'

const FLOAT_WIDTH = 320
const TILT = 4

// The hovered row's dock frame leaves the dock, follows the cursor and flies back on leave. It is one element,
// so the dock shows an empty slot while it is away. The box rect is read on enter and leave only, never on move.
export function followCursor(
  list: HTMLElement,
  box: HTMLElement,
  rows: HTMLElement[],
  frames: HTMLElement[],
  isCurrent: (index: number) => boolean
) {
  let held = -1
  let returning = -1
  let baseWidth = 1
  let lastX = 0
  let flight: gsap.core.Tween | undefined
  let moveX: (value: number) => void = () => {}
  let moveY: (value: number) => void = () => {}
  let tilt: (value: number) => void = () => {}
  const settle = gsap.delayedCall(0.08, () => tilt(0)).pause()

  const center = () => {
    const rect = box.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height }
  }

  const land = (index: number) => {
    const frame = frames[index]
    frame.classList.remove('is-held')
    gsap.set(frame, { clearProps: 'width,height,transform,opacity' })
    gsap.set(frame, { visibility: isCurrent(index) ? 'visible' : 'hidden' })
    if (returning === index) returning = -1
    if (!box.querySelector('.is-held')) box.classList.remove('is-away')
  }

  const fadeOut = (index: number) => {
    gsap.to(frames[index], { opacity: 0, duration: 0.25, ease: 'out', overwrite: true, onComplete: () => land(index) })
  }

  const grab = (index: number, event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    const frame = frames[index]
    if (!frame || !rows[index].hasAttribute('data-has-cover')) return release()

    if (returning === index) {
      flight?.kill()
      returning = -1
    } else {
      if (held >= 0) fadeOut(held)
      const start = center()
      baseWidth = start.width
      frame.classList.add('is-held')
      box.classList.add('is-away')
      gsap.set(frame, {
        width: start.width,
        height: start.height,
        xPercent: -50,
        yPercent: -50,
        x: start.x,
        y: start.y,
        scale: 1,
        rotation: 0,
        opacity: 1
      })
    }

    held = index
    lastX = event.clientX
    gsap.killTweensOf(frame)
    moveX = gsap.quickTo(frame, 'x', { duration: 0.6, ease: 'out' })
    moveY = gsap.quickTo(frame, 'y', { duration: 0.6, ease: 'out' })
    tilt = gsap.quickTo(frame, 'rotation', { duration: 0.6, ease: 'out' })
    gsap.to(frame, { scale: FLOAT_WIDTH / baseWidth, duration: 0.6, ease: 'out' })
    moveX(event.clientX)
    moveY(event.clientY)
  }

  const release = () => {
    if (held < 0) return
    const index = held
    held = -1
    returning = index
    settle.pause()
    const home = center()
    flight = gsap.to(frames[index], {
      x: home.x,
      y: home.y,
      scale: 1,
      rotation: 0,
      duration: 0.7,
      ease: 'out',
      overwrite: true,
      onComplete: () => land(index)
    })
  }

  const onMove = (event: PointerEvent) => {
    if (held < 0) return
    moveX(event.clientX)
    moveY(event.clientY)
    tilt(gsap.utils.clamp(-TILT, TILT, (event.clientX - lastX) * 0.25))
    lastX = event.clientX
    settle.restart(true)
  }

  const enters = rows.map((row, index) => {
    const onEnter = (event: PointerEvent) => grab(index, event)
    row.addEventListener('pointerenter', onEnter)
    return () => row.removeEventListener('pointerenter', onEnter)
  })
  list.addEventListener('pointermove', onMove)
  list.addEventListener('pointerleave', release)

  return () => {
    enters.forEach((off) => off())
    list.removeEventListener('pointermove', onMove)
    list.removeEventListener('pointerleave', release)
    settle.kill()
    gsap.killTweensOf(frames)
    frames.forEach((frame, index) => frame.classList.contains('is-held') && land(index))
    box.classList.remove('is-away')
  }
}
