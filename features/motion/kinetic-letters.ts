import { gsap, ScrollTrigger } from '@/lib/gsap'

const RADIUS_VW = 0.3
// Width ratio of wdth 125 to wdth 75 in Mona Sans; the letters stretch with scaleX instead of animating the axis.
const MAX_SCALE = 1.55
// Time constant of the follow, so the letters settle in about 0.5s.
const SETTLE = 0.17

type Box = { x: number; y: number; w: number; line: number }
type Setters = { x: (value: number) => void; scale: (value: number) => void }

// Letters near the pointer stretch on X and push their neighbours along the same line. Fine pointers only; the caller decides that.
// `scrub.k` (0 to 1) lets a scroll timeline fade the effect out; call markDirty after changing it.
export function createKinetic(trigger: HTMLElement, scrub = { k: 1 }) {
  const pointer = { x: -1e4, y: -1e4 }
  let masks: HTMLElement[] = []
  let lineOf: (mask: HTMLElement) => number = () => 0
  let base: Box[] = []
  let scale: number[] = []
  let target: number[] = []
  let setters: Setters[] = []
  let dirty = false
  let settling = false
  let active = true

  // offset* ignores transforms, so this stays correct while the letters are scaled or the text is scrubbed.
  const measure = () => {
    base = masks.map((mask) => {
      let x = 0
      let y = 0
      for (let node: HTMLElement | null = mask; node; node = node.offsetParent as HTMLElement | null) {
        x += node.offsetLeft
        y += node.offsetTop
      }
      return { x: x + mask.offsetWidth / 2, y: y + mask.offsetHeight / 2, w: mask.offsetWidth, line: lineOf(mask) }
    })
  }

  const retarget = () => {
    dirty = false
    settling = true
    const radius = window.innerWidth * RADIUS_VW
    const pointerY = pointer.y + window.scrollY
    target = base.map((box) => {
      const near = gsap.utils.clamp(0, 1, 1 - Math.hypot(pointer.x - box.x, pointerY - box.y) / radius)
      return 1 + (MAX_SCALE - 1) * near * scrub.k
    })
  }

  const follow = (deltaMs: number) => {
    const ease = 1 - Math.exp(-Math.min(deltaMs, 100) / 1000 / SETTLE)
    let moving = false
    let line = -1
    let shift = 0
    scale = scale.map((current, index) => {
      const gap = target[index] - current
      const next = Math.abs(gap) > 0.0005 ? current + gap * ease : target[index]
      if (next !== target[index]) moving = true
      if (base[index].line !== line) {
        line = base[index].line
        shift = 0
      }
      setters[index].x(shift)
      setters[index].scale(next)
      shift += base[index].w * (next - 1)
      return next
    })
    settling = moving
  }

  // Call again after every re-split.
  const setLetters = (next: HTMLElement[], lineIndex: (mask: HTMLElement) => number) => {
    masks = next
    lineOf = lineIndex
    gsap.set(masks, { transformOrigin: '0% 50%', x: 0, scaleX: 1 })
    setters = masks.map((mask) => ({
      x: gsap.quickSetter(mask, 'x', 'px') as (value: number) => void,
      scale: gsap.quickSetter(mask, 'scaleX') as (value: number) => void
    }))
    scale = masks.map(() => 1)
    target = masks.map(() => 1)
    measure()
    dirty = true
  }

  const markDirty = () => {
    dirty = true
  }

  // Returns the cleanup.
  const start = () => {
    const tick = (_time: number, deltaMs: number) => {
      if (!active) return
      if (dirty) retarget()
      if (settling) follow(deltaMs)
    }
    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      dirty = true
    }
    const onLeave = () => {
      pointer.x = pointer.y = -1e4
      dirty = true
    }
    const onRefresh = () => {
      measure()
      dirty = true
    }
    const view = ScrollTrigger.create({
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (active = self.isActive)
    })

    gsap.ticker.add(tick)
    ScrollTrigger.addEventListener('refresh', onRefresh)
    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      gsap.ticker.remove(tick)
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      view.kill()
    }
  }

  return { setLetters, markDirty, start }
}
