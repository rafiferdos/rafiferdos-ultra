// Reads the site tokens from app/site.css and checks WCAG contrast for both themes.
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../app/site.css', import.meta.url), 'utf8')
const themes = {}
for (const [, selector, body] of css.matchAll(/(:root|\.dark)\s*\{([^}]*)\}/g)) {
  const tokens = {}
  for (const [, name, value] of body.matchAll(/--site-([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)) tokens[name] = value
  themes[selector === ':root' ? 'light' : 'dark'] = tokens
}

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// [foreground, background, minimum ratio, note]
const checks = [
  ['ink', 'bg', 7, 'body text'],
  ['ink', 'surface', 7, 'body text on surface'],
  ['muted', 'bg', 4.5, 'small muted text'],
  ['muted', 'surface', 4.5, 'small muted text on surface'],
  ['faint', 'bg', 3, 'large text or decoration only'],
  ['faint', 'surface', 3, 'large text or decoration only on surface'],
  ['accent', 'bg', 4.5, 'small accent text'],
  ['accent', 'surface', 3, 'accent on surface: large text or UI only'],
  ['accent-ink', 'accent', 4.5, 'text on accent fill']
]

let failed = false
for (const [name, tokens] of Object.entries(themes)) {
  for (const [fg, bg, min, note] of checks) {
    const value = ratio(tokens[fg], tokens[bg])
    const ok = value >= min
    failed ||= !ok
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(5)} ${fg} on ${bg}: ${value.toFixed(2)} (min ${min}) ${note}`)
  }
}
process.exit(failed ? 1 : 0)
