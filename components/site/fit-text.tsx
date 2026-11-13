'use client'

import { useEffect, useRef } from 'react'

// fallback: the text's width in em, used until it is measured. Measure it once in the browser and pass it, so the reserved height is right.
type Props = React.ComponentProps<'span'> & { children: React.ReactNode; fallback: number }

// Scales one line of text to exactly the width of its container. The only JS value is --fit-w, the text's width in em,
// measured once the fonts are ready; the size itself is CSS (100cqw / --fit-w), so a resize needs no layout work in script.
// Until it is measured the fallback in .fit-text keeps roughly the right height, so the line does not jump.
export function FitText({ children, fallback, className = '', ...rest }: Props) {
  const outer = useRef<HTMLSpanElement>(null)
  const inner = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const box = outer.current
    const text = inner.current
    if (!box || !text) return
    let alive = true

    const measure = () => {
      const size = parseFloat(getComputedStyle(text).fontSize)
      const width = text.getBoundingClientRect().width
      if (size > 0 && width > 0) box.style.setProperty('--fit-w', String(width / size))
    }
    document.fonts.ready.then(() => alive && measure())
    // The container width never changes the em width, but a font swap or a wrapped re-split can, so measure again on resize.
    const observer = new ResizeObserver(measure)
    observer.observe(box)
    // SplitText drops kerning between letters, so the text's own width can change after the first measure.
    observer.observe(text)
    return () => {
      alive = false
      observer.disconnect()
    }
  }, [])

  return (
    <span ref={outer} className="fit" style={{ '--fit-w': fallback } as React.CSSProperties}>
      <span ref={inner} className={`fit-text ${className}`} {...rest}>
        {children}
      </span>
    </span>
  )
}
