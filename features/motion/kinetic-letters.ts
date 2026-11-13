import { gsap, ScrollTrigger } from '@/lib/gsap'

const RADIUS_VW = 0.3
// Peak scaleX of the letter under the pointer, before the line is normalised. The normalisation gives some of it back
// (the nearest letter ends up near 1.4 and the far ones near 0.85), so this sits above the 1.55 wdth 125 to 75 ratio of Mona Sans.
const MAX_SCALE = 1.8
// Time constant of the follow, so the letters settle in about 0.5s.
const SETTLE = 0.17

type Box = { x: number; y: number; w: number; line: number }
type Setters = { x: (value: number) => void; scale: (value: number) => void }

// Letters near the pointer stretch on X and push their neighbours along the same line. Fine pointers only; the caller decides that.
// The stretch is normalised per line, so the line keeps its width: the other letters give way, and the first and last edges never move.
// `scrub.k` (0 to 1) lets a scroll timeline fade the effect out; call markDirty after changing it.
export function createKinetic(trigger: HTMLElement, scrub = { k: 1 }) {
  const pointer = { x: -1e4, y: -1e4 }
  let masks: HTMLElement[] = []
  let lineOf: (mask: HTMLElement) => number = () => 0
  let base: Box[] = []
  let lineWidth = new Map<number, number>()
  let scale: number[] = []
  // The scale actually on each letter (eased scale times its line's normaliser), to read untransformed widths back.
  let applied: number[] = []
  let target: number[] = []
  let setters: Setters[] = []
  let dirty = false
  let settling = false
  let active = true

  // Positions use offset*, which ignores transforms, so they stay correct while the letters are scaled or the text is scrubbed.
  // Widths need the sub-pixel part (offsetWidth rounds, and six rounding errors would push the last edge out), so they come from
  // the rect with the current scale divided out.
  const measure = () => {
    lineWidth = new Map()
    base = masks.map((mask, index) => {
      let x = 0
      let y = 0
      for (let node: HTMLElement | null = mask; node; node = node.offsetParent as HTMLElement | null) {
        x += node.offsetLeft
        y += node.offsetTop
      }
      const w = mask.getBoundingClientRect().width / (applied[index] || 1)
      const line = lineOf(mask)
      lineWidth.set(line, (lineWidth.get(line) ?? 0) + w)
      return { x: x + mask.offsetWidth / 2, y: y + mask.offsetHeight / 2, w, line }
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
    const stretched = new Map<number, number>()
    scale = scale.map((current, index) => {
      const gap = target[index] - current
      const next = Math.abs(gap) > 0.0005 ? current + gap * ease : target[index]
      if (next !== target[index]) moving = true
      const { line, w } = base[index]
      stretched.set(line, (stretched.get(line) ?? 0) + w * next)
      return next
    })

    // Per line: k shrinks every letter just enough that the stretched widths add up to the original width again.
    // It is 1 when nothing is stretched, so a settled line is back to its normal layout.
    let line = NaN
    let shift = 0
    let k = 1
    scale.forEach((eased, index) => {
      if (base[index].line !== line) {
        line = base[index].line
        shift = 0
        k = (lineWidth.get(line) ?? 1) / (stretched.get(line) || 1)
      }
      const next = eased * k
      applied[index] = next
      setters[index].x(shift)
      setters[index].scale(next)
      shift += base[index].w * (next - 1)
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
    applied = masks.map(() => 1)
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
      onToggle: (self) => (active = self.isActive),
      // The page moves under a still pointer, so the letters' distance to it changes without a pointermove.
      onUpdate: markDirty
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
