'use client'

import { useEffect, useRef } from 'react'

// fallback: the text's width in em, used until it is measured (one number per line). Measure it once in the browser and pass it, so the reserved height is right.
// lines: a staircase. Every line gets the same font size, each starts where the one above ends, and together they span the container.
type Props = Omit<React.ComponentProps<'span'>, 'children'> & {
  children?: React.ReactNode
  lines?: string[]
  fallback: number | number[]
}

// Scales text to exactly the width of its container. The only JS values are --fit-w1..n (each line's width in em) and --fit-w (their sum),
// measured once the fonts are ready; the size itself is CSS (100cqw / --fit-w), so a resize needs no layout work in script.
// Until it is measured the fallback keeps roughly the right height, so the line does not jump.
export function FitText({ children, lines, fallback, className = '', style, ...rest }: Props) {
  const outer = useRef<HTMLSpanElement>(null)
  const parts: React.ReactNode[] = lines ?? [children]
  const widths = Array.isArray(fallback) ? fallback : [fallback]

  useEffect(() => {
    const box = outer.current
    if (!box) return
    const texts = Array.from(box.querySelectorAll<HTMLElement>(':scope > .fit-text'))
    let alive = true

    const measure = () => {
      const em = texts.map((text) => {
        const size = parseFloat(getComputedStyle(text).fontSize)
        const width = text.getBoundingClientRect().width
        return size > 0 && width > 0 ? width / size : 0
      })
      if (em.some((value) => !value)) return
      em.forEach((value, index) => box.style.setProperty(`--fit-w${index + 1}`, String(value)))
      box.style.setProperty('--fit-w', String(em.reduce((sum, value) => sum + value, 0)))
    }
    document.fonts.ready.then(() => alive && measure())
    // The container width never changes the em width, but a font swap or a wrapped re-split can, so measure again on resize.
    const observer = new ResizeObserver(measure)
    observer.observe(box)
    // SplitText drops kerning between letters, so a line's own width can change after the first measure.
    texts.forEach((text) => observer.observe(text))
    return () => {
      alive = false
      observer.disconnect()
    }
  }, [])

  const vars: Record<string, number> = { '--fit-w': widths.reduce((sum, value) => sum + value, 0) }
  widths.forEach((value, index) => (vars[`--fit-w${index + 1}`] = value))

  return (
    <span ref={outer} className="fit" style={vars as React.CSSProperties}>
      {parts.map((part, index) => (
        <span
          key={index}
          className={`fit-text ${className}`}
          // A line starts where the lines above it end.
          style={{
            ...style,
            marginLeft: index
              ? `calc((${Array.from({ length: index }, (_, above) => `var(--fit-w${above + 1})`).join(' + ')}) * 1em)`
              : undefined
          }}
          {...rest}
        >
          {part}
        </span>
      ))}
    </span>
  )
}
