import { gsap, ScrollTrigger } from '@/lib/gsap'

const FLOAT_WIDTH = 320
const TILT = 4
const SCROLL_CHECK_MS = 100

type Point = Pick<PointerEvent, 'clientX' | 'clientY' | 'pointerType'>

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
  let pointerX = 0
  let pointerY = 0
  let checkedAt = 0
  // Page-space row bands and the list's x range, measured on init and refresh only, so the scroll check reads no layout.
  let bands: { top: number; bottom: number }[] = []
  let listLeft = 0
  let listRight = 0
  let flight: gsap.core.Tween | undefined
  let moveX: (value: number) => void = () => {}
  let moveY: (value: number) => void = () => {}
  let tilt: (value: number) => void = () => {}
  const settle = gsap.delayedCall(0.08, () => tilt(0)).pause()

  const center = () => {
    const rect = box.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height }
  }

  const measure = () => {
    const offset = window.scrollY
    bands = rows.map((row) => {
      const rect = row.getBoundingClientRect()
      return { top: rect.top + offset, bottom: rect.bottom + offset }
    })
    const rect = list.getBoundingClientRect()
    listLeft = rect.left
    listRight = rect.right
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

  const grab = (index: number, event: Point) => {
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
    pointerX = event.clientX
    pointerY = event.clientY
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
    pointerX = event.clientX
    pointerY = event.clientY
    if (held < 0) return
    moveX(event.clientX)
    moveY(event.clientY)
    tilt(gsap.utils.clamp(-TILT, TILT, (event.clientX - lastX) * 0.25))
    lastX = event.clientX
    settle.restart(true)
  }

  // A still pointer gets no events while the page scrolls under it, so the held row is re-checked from the last pointer position.
  const checkUnderPointer = (scroll: number) => {
    const now = performance.now()
    if (held < 0 || now - checkedAt < SCROLL_CHECK_MS) return
    checkedAt = now
    const y = pointerY + scroll
    const under = pointerX < listLeft || pointerX > listRight ? -1 : bands.findIndex((b) => y >= b.top && y < b.bottom)
    if (under < 0) release()
    else if (under !== held) grab(under, { clientX: pointerX, clientY: pointerY, pointerType: 'mouse' })
  }

  measure()
  ScrollTrigger.addEventListener('refresh', measure)
  const watch = ScrollTrigger.create({
    trigger: list,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => checkUnderPointer(self.scroll())
  })
  const onBlur = () => release()
  const onHidden = () => document.hidden && release()
  window.addEventListener('blur', onBlur)
  document.addEventListener('visibilitychange', onHidden)

  const enters = rows.map((row, index) => {
    const onEnter = (event: PointerEvent) => grab(index, event)
    row.addEventListener('pointerenter', onEnter)
    return () => row.removeEventListener('pointerenter', onEnter)
  })
  list.addEventListener('pointermove', onMove)
  list.addEventListener('pointerleave', release)

  return () => {
    ScrollTrigger.removeEventListener('refresh', measure)
    watch.kill()
    window.removeEventListener('blur', onBlur)
    document.removeEventListener('visibilitychange', onHidden)
    enters.forEach((off) => off())
    list.removeEventListener('pointermove', onMove)
    list.removeEventListener('pointerleave', release)
    settle.kill()
    gsap.killTweensOf(frames)
    frames.forEach((frame, index) => frame.classList.contains('is-held') && land(index))
    box.classList.remove('is-away')
  }
}
