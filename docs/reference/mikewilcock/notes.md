# Reference notes: mikewilcockdesign.com

Captured 2026-11-13 with Playwright (1440x900 and 390x844) and Chrome DevTools. These notes describe mechanics only. Do not copy the site's code, assets, copy or branding.

Screenshots: `desktop-1440-<pct>.jpg` and `mobile-390-<pct>.jpg` at 0, 10, 25, 40, 55, 70, 85 and 100 percent of the scroll height. On desktop the page height grows from 5912 to 6084 px after load.

## Stack

- Next.js with Turbopack on Vercel, plus Lenis (the `html.lenis` class).
- Hand-written rAF loops, IntersectionObserver and CSS transitions. There is no GSAP and no framer.
- No canvas, so no WebGL.
- 11 JS chunks, about 690 KB raw. 3 woff2 fonts. Images go through `next/image` and are stored on Vercel Blob.

## Trace (DevTools, no throttling)

- Lab: LCP 233 ms (TTFB 46 ms, render delay 187 ms), CLS 0.00.
- Field (CrUX p75): LCP 959 ms, INP 68 ms, CLS 0.05.
- Insights: forced reflow, render-blocking CSS, 14 KB of legacy JS.

## Type

- **Families:** Archivo variable (wdth 62 to 125, wght 100 to 900, italic) and Geist Mono 400/500.
- **Axis pairs:**
  - Display: wdth 70 / wght 800.
  - Emphasis and marquee: wdth 115 to 120 / wght 250 to 300, italic.
  - Work title: wdth 88/700 when idle, 118/400 when active.
  - Statement: wdth 90/600.
- **Sizes at 1440:**
  - Hero name 259.2 px (18vw), uppercase, line-height 0.86.
  - Statement 74.88 px, line-height 1.02.
  - Work title 69 px.
  - Big index 86 px.
  - Tile title 37 px.
  - Intro 22/30.8.
  - Body 16/24, small 13.
  - Mono 11 to 14 px, uppercase, tracking 0.06em.
- **Sizes at 390:** hero name 167 px, work title 35 px, statement 45 px.

## Layout and color

- Gutter: 56 px desktop, 20 px mobile. Section padding-block: 90 to 135 px.
- Grids:
  - Header: 3 columns.
  - Work: `823px 432px`, gap 57.6 px.
  - Row: `48px 1fr auto`, gap 28 px.
  - Tiles: 4 x 328 px.
- Colors:
  - bg `#111010`, surface `#1A1918`.
  - ink `#EDEAE4`, greys `#8F8A82` / `#A8A39B` / `#B9B4AC` / `#5F5A54`.
  - Lines at ink 12%, 20% and 25%.
  - Accent is light blue. We do not use blue.

## Motion

- **Eases:** `cubic-bezier(.16,1,.3,1)`, `cubic-bezier(.76,0,.24,1)`, `cubic-bezier(.4,0,.2,1)`.
- **Transitions:**
  - transform 0.45 to 1.2s.
  - font-variation-settings 0.5s.
  - clip-path 0.7s with a 0.1s delay.
  - opacity 0.25 to 0.6s.
- **Hero:** per-letter wdth/wght driven by cursor distance. Letters near the cursor go wide and light (about 120/310); far letters stay condensed and heavy (70/800). It is lerped.
- **Marquee:** autoplays at about 40 px/s. Scroll velocity adds speed and skewX of up to about 5°.
- **Selected work:**
  - A sticky dock (`top: 180px`) shows the active cover, a big index, `(0n / 0N)` and a progress bar.
  - The active row is the one at the viewport center. It turns accent and wide.
  - A fixed preview card follows the cursor with lerp and slight rotation.
  - The cursor ring turns into a "VIEW" disc.
- **Up close:**
  - No pin. The track's translateX follows vertical scroll about 1:1 while the section is in view: about 2000 px of travel on a 3537 px track.
  - Velocity skewX is about ±3°.
  - Drag is also supported.
- **Statement:** the section is 1350 px with a sticky 900 px inner, so about 450 px of scrub. Each word goes from opacity 0.14 to 1.
- **Footer:** giant kinetic CTA in accent. The cursor ring shows a label.
- **Global:**
  - Intro loader: name lockup, a counter to 100, then a wipe.
  - Route transitions with vertical bars.
  - Dot and ring cursor.
  - "(Pause motion)" control.
  - Fixed header with local time.

## Mobile

- Same design, lighter.
- The name is stacked and condensed.
- A menu button opens a full-screen overlay.
- The dock sits inline under the list, and the cursor preview card is hidden.
- The gallery is kept.
