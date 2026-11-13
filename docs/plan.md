# rafiferdos-ultra redesign plan

## Context
The current site is a set of separate `motion/react` fade-ins, ogl/WebGL backgrounds and shadcn-style cards. GSAP is installed but unused, and Lenis runs its own loop without GSAP. Public pages are `force-dynamic` and hit Prisma on every request. The goal is a typography-first, scroll-choreographed portfolio that feels very close to mikewilcockdesign.com in structure, pacing and motion, built from scratch with Rafi's content, one non-blue accent, light and dark themes, and no WebGL.

After approval, Phase 0 saves this plan to `docs/plan.md`, copies the reference screenshots to `docs/reference/mikewilcock/`, and updates the Stack and Motion sections of `CLAUDE.md`.

---

## 1. Reference analysis summary

**How it was measured:** Playwright at 1440×900 and 390×844 (8 scroll steps each, saved in `docs/reference/mikewilcock/`, notes in `notes.md` there), JS evaluation of computed styles, scripts and CSS, and a Chrome DevTools network list and performance trace.

**Stack:**
- Next.js (Turbopack) on Vercel, Lenis, hand-written rAF loops, IntersectionObserver and CSS transitions.
- **No GSAP, no framer, no canvas or WebGL.** About 690 KB of raw JS across 11 chunks.
- Eases: `cubic-bezier(.16,1,.3,1)` (expo-out) and `cubic-bezier(.76,0,.24,1)` (in-out).
- Durations: 0.25s micro, 0.45 to 0.5s hover, 0.7s clip, 0.9 to 1.2s large transforms.
- Trace: LCP 233 ms lab / 959 ms field, CLS 0 lab / 0.05 field, INP 68 ms field. One forced-reflow insight.

**Type:**
- Archivo variable (wdth 62 to 125, wght 100 to 900, italic) plus Geist Mono 400/500.
- The signature is **axis play**: the same family runs condensed and heavy (`wdth 70 / wght 800`) for display type, and wide, light and italic (`wdth 115 to 120 / wght 250 to 300`) for emphasis.
- Sizes at 1440: hero name 259 px (18vw) uppercase, line-height 0.86; statement 75 px; work title 69 px; big number 86 px; tile title 37 px; intro 22/30.8; body 16/24; small 13; mono labels 11 to 14 px uppercase, tracking 0.06em.

**Layout:**
- Gutter 56 px desktop and 20 px mobile. Section padding-block about 126 px.
- Header is a 3-column grid. The work grid is `~823px + 432px` with a 57.6 px gap. Rows are `48px | 1fr | auto`.
- Colors: bg `#111010`, ink `#EDEAE4`, greys `#8F8A82` / `#5F5A54` / `#A8A39B`, lines at ink 12% and 25%, a light-blue accent.

**Per section (desktop):**

| Section | Reveal | Scroll / pacing | Hover / drag | Ease feel |
|---|---|---|---|---|
| Intro loader | Name lockup, counter 0→100, then a wipe | About 1 to 1.5 s, once | none | in-out |
| Page transition | Vertical bars cover, then uncover | On route change | none | in-out |
| Hero (100vh) | Per-letter rise | No pin | **Letters change wdth/wght by cursor distance** (70/800 near the edge, 120/310 at the cursor) | expo-out, smooth lerp |
| Marquee | Always moving | Autoplay about 40 px/s. Scroll velocity speeds it up and skews it (up to about 5°) | none | lerped |
| Selected work (about 1.9 viewports for 4 rows) | Rows reveal on enter | The active row is the one crossing the viewport middle. It turns accent and wide (`wdth 118/wght 400`); the others stay condensed (`88/700`). A sticky dock (`top:180px`) shows the active cover, a big number, `(0n / 0N)` and a progress bar | A cursor ring grows into a "VIEW" disc. A preview card follows the cursor with lerp and slight rotation. "(Pause motion)" sits in the section header | font-variation transition 0.5s, transform 0.9s expo-out |
| Up close (drag or scroll) | none | **No pin**: the track's translateX follows vertical scroll about 1:1 while the section is in view (about 2000 px of travel). Velocity skewX is about ±3° | Drag adds an offset with inertia | lerped |
| Statement (1350 px, sticky 900) | Words go from opacity 0.14 to 1 in sequence | About 450 px sticky scrub | none | linear scrub |
| Service tiles | 4-column bordered grid, rise on enter | none | Arrow nudge | expo-out |
| Footer | Giant kinetic "LET'S TALK" in accent | none | Same kinetic letters, and the cursor shows "LET'S GO" | expo-out |
| Global | Fixed header, Awwwards ribbon, cookie card, dot and ring cursor | Lenis | Nav links with text roll | |

**Mobile:**
- Same design, lighter.
- The name is stacked and condensed (167 px).
- The menu button opens a full-screen menu with 96 px condensed labels.
- The dock card sits inline under the list.
- The up-close gallery is kept. The cursor-follow card is hidden.

**What we match:** section order and pacing; axis-driven type language; kinetic name and footer letters; active-row work list with sticky dock and cursor preview; scroll-driven horizontal gallery with velocity skew; word-scrub statement; velocity marquee; parenthetical mono labels, numbering and arrows; cursor ring with labels; pause-motion control; page-transition bars; header with local time.

**What we change:**
- One vermilion accent with a value per theme.
- Light and dark themes.
- A different font pair (Mona Sans and JetBrains Mono).
- Our own wordmark (`RAFI`, set condensed and heavy, plus `ferdos`, set wide and light italic) and all copy from resume.md.
- The Experience section replaces "What I do".
- A writing teaser from the DB.
- A contact form instead of a mailto-only footer.
- Text reveals through GSAP SplitText masks.
- No cookie banner and no Awwwards ribbon.
- Velocity-reactive kinetic type: **the name also compresses as you scroll away**, which is our signature twist (see §2).
- Every effect is re-implemented in GSAP. No code, assets or copy are taken.

## 2. Sections and scroll timeline

Values are for 1440×900; vh-based values scale. "Scrub" means `scrub: true` tied to ScrollTrigger, smoothed by Lenis. Every section reads from the single Lenis/ScrollTrigger scroll.

0. **Intro (first visit per session only, ≤ 1.1 s, skipped under reduced motion or pause).**
   - The real hero HTML renders underneath and is never hidden from SSR. The overlay shows `RAFI ferdos` and a 00→100 counter driven by `document.fonts.ready`.
   - It exits with a bar wipe (5 bars, scaleY 1→0, stagger 0.06, inOut 0.7s). Then it hands off to the hero letter rise.
1. **Hero (100vh, no pin).**
   - Meta row: `(Portfolio / ©2026)` · `Full Stack Developer` · `Dhaka, BD`.
   - Name: `RAFI` on line 1, `FERDOS` on line 2 offset right.
   - Intro line (approved): "I build web and mobile apps end to end, from the database to the interface. 3+ years of shipping with React, Next.js, Node.js and React Native."
   - Links: `See the work →` and a `(Scroll, gently)` cue.
   - On load: letters rise yPercent 110→0 with a 0.035 stagger over 1.1s, expo-out.
   - Kinetic on fine pointers: each letter's wdth/wght comes from cursor distance (radius 30vw, 75/800 to 125/300), using `gsap.quickTo` with a 0.5s settle.
   - Scrub, `top top` → `bottom top`:
     - line 1 y 0→-12vh, line 2 y 0→-4vh;
     - **all letters wdth to 75 and wght to 900** (the name tightens as it leaves; fine pointer only, coarse pointers get no axis animation);
     - intro opacity 1→0 over the first 40%.
2. **Skills marquee (about 12vh band).**
   - Resume skills in italic wide light weight, separated by accent `◆`.
   - Base 40 px/s. Scroll velocity adds `|v|*0.15` px/frame and matches the scroll direction. skewX is clamped to ±6° and eases back over 0.6s.
   - Hovering does nothing. When paused it is static.
3. **Selected work (DB, featured, max 6 rows of 40vh, so about 2.4 viewports for 6).**
   - Header: `Selected work (0N)` · `(Pause motion)` · `YYYY to YYYY` (from project years).
   - Each row: index `01`, title, `role & type` in mono, `(Live)` link when liveUrl exists, year.
   - Active row: a ScrollTrigger per row with `start: 'top center', end: 'bottom center'`, using `onToggle` (not scrub). Active means ink→accent, opacity 1 and x 0→1.5rem over 0.5s; inactive rows go to muted. Titles are fixed at wdth 88 / wght 700, with no axis animation.
   - Dock: `position: sticky; top: 20vh`. The cover is a 4:5 box. On index change the new cover does a transform mask wipe (outer yPercent 100→0, inner -100→0, 0.9s expo-out).
   - The big index digits roll (yPercent). `(0n / 0N)` and a progress bar (scaleX = index/N, transform-origin left) update with it.
   - Cursor preview: on fine pointers, hovering a row shows a 320×400 card that follows the cursor through `quickTo` (0.6s) with rotation from x velocity, clamped to ±4°. The ring becomes `View`.
4. **Up close (about 85vh tall, no pin).**
   - Label `(Up close)` · `Drag or scroll`.
   - Track x is scrubbed from 0 to -(trackW - vw + gutter) with `start: 'top bottom', end: 'bottom top'`.
   - Velocity skewX is clamped to ±3°.
   - Desktop: Draggable (type x, with inertia) adds a drag offset on a wrapper, so scroll and drag add up. The cursor ring shows `Drag`.
   - Mobile: native `overflow-x: auto` with `scroll-snap-type: x mandatory`, and no scrub.
   - Hidden when there are fewer than 3 media items.
5. **About / statement (section 160vh, sticky inner 100vh, so 60vh of scrub).**
   - `(Hello)` plus the statement (draft): "I'm Rafi. I build the whole thing: the API, the database, the interface and the motion. Lately that means real-time chat with Socket.IO, moving clients from REST to GraphQL, and two ecommerce apps in React Native."
   - Words go opacity 0.15→1 in order with `scrub: true` over the pin. Emphasis words (`whole thing`, `motion`) are set in wide light italic, and the last phrase ends in accent.
6. **Experience (3 tiles from resume.md, bordered 3-column grid, 1 column on mobile).**
   - Each tile: `01`, company, title, dates in mono, 2 short bullets taken word for word from the resume, and a `↗` link when a URL exists (ZenDevz).
   - Scrub from `top 85%` to `top 45%`: tiles y 60→0 and opacity 0→1, stagger 0.15 across the scrub. Bullet lines use a mask reveal.
   - Hover: the arrow moves (x 4, y -4) over 0.45s, and the top border goes accent through a scaleX pseudo-element.
   - TODO: the current role at Webbly Media is excluded until Rafi gives the title and dates.
7. **Writing (DB, latest 3 published, list rows, hidden at 0).**
   - Row: `(Category)` · title · read time · date. The title rolls on hover. Ends with `All writing (N) →`.
   - Rows reveal with a line mask on enter. They play once rather than scrub, because they are small text.
8. **Contact / footer.**
   - `Got something in mind?` above a giant kinetic `SAY HELLO` in accent (18vw). It uses the same kinetic letters as the hero, and the cursor ring shows `Write`.
   - Letters rise on enter with a scrub from `top 90%` to `top 40%`.
   - Clicking it opens the form under it, height-free through a grid-rows trick: the content is pre-rendered and only transform and opacity animate, so it is in the DOM with no CLS.
   - Fields: name, email, message. It posts to the existing `/api/contact` through Resend, with a Zod check on the client as well.
   - Footer row: email, GitHub, LinkedIn, `Dhaka hh:mm`, `Back to top ↑`.

**Global:**
- Fixed header: wordmark · `Dhaka, BD / hh:mm` · nav `01 Work 02 About 03 Experience 04 Writing 05 Contact` · `(Dark)` theme toggle · `Get in touch` pill.
- Mobile: `Menu` opens a full-screen overlay with 15vw condensed labels that mask-reveal with a 0.06 stagger.
- Dot and ring cursor on fine pointers only.
- Page transition: 5 bars on internal route changes. The back button uses native navigation with no bars.

## 3. Text animation spec

Eases are registered once in `lib/gsap.ts` with CustomEase: `out = (.16,1,.3,1)` and `inOut = (.76,0,.24,1)`. Durations: micro 0.25, hover 0.45, ui 0.7, display 1.1. Staggers: chars 0.035, words 0.05, lines 0.08.

| Element | Effect | Trigger | Props |
|---|---|---|---|
| Display name / CTA letters | Char mask rise, then kinetic axes | Load or enter scrub | yPercent 110→0, display/out; wdth/wght via quickTo |
| Section headings (statement-size) | Line mask rise | Scrub `top 85%`→`top 55%` | yPercent 100→0 |
| Statement | Word opacity scrub | Sticky scrub | opacity 0.15→1, linear |
| Work titles | Color, opacity and x-shift state change | onToggle active | color/opacity/x, 0.5s out |
| Paragraphs / intro | SplitText lines, masked | Once on `top 85%` | yPercent 100→0, ui/out, lines stagger |
| Mono labels `(Hello)` | Char fade-in in sequence | Once on enter | opacity 0→1, chars 0.02 stagger, 0.25 |
| Nav / links / buttons | Text roll (2 stacked copies) | Hover and focus-visible | yPercent 0→-100, hover/inOut |
| Inline links in prose | Underline draw | Hover and focus | scaleX 0→1, origin left/right swap on leave |
| Counters `(01 / 06)`, big index | Digit roll | Index change | yPercent, 0.6 out |
| Marquee | Velocity speed and skew | Ticker | x, skewX |

**Rules:**
- Animate only transform and opacity, plus `font-variation-settings` on the hero name and footer CTA letters, fine pointer only (the scoped exception, see §10).
- SplitText uses `mask: 'lines'|'chars'` and `autoSplit: true` with `onSplit` returning the tween, so splits redo themselves on resize or font load, and `aria` is kept.
- Text is SSR-visible. A `.js-motion` class added before paint sets the initial hidden state, only when motion is allowed, so text is never hidden without JS.

## 4. Accent color and tokens

WCAG contrast, computed:
- `#FF4A1C` on the dark bg `#0F0E0D` is **5.74**, which passes AA.
- On the light bg `#F3F1EC` it is **2.98**, which fails.
- So the accent has one value per theme. Light uses **`#C7340E`**: 4.74 on the bg, and 5.35 for white text on it.

| Token | Dark (default: system) | Light |
|---|---|---|
| `--bg` | `#0F0E0D` | `#F3F1EC` |
| `--surface` | `#1A1918` | `#E9E6DF` |
| `--ink` | `#EDEBE6` (16.2) | `#141312` (16.4) |
| `--muted` (small text OK) | `#8C8780` (5.41) | `#6E6A64` (4.76) |
| `--faint` (≥24 px or decoration only) | `#6E6A64` (3.59) | `#8C8780` (3.16) |
| `--line` / `--line-strong` | ink 12% / 25% | ink 12% / 25% |
| `--accent` | `#FF4A1C` (5.74) | `#C7340E` (4.74) |
| `--accent-ink` (text on accent fill) | `#0F0E0D` (5.74) | `#FFFFFF` (5.35) |

**Rules:**
- Accent is for hover, links, the active row, small markers, the CTA headline and the progress bar. It is never used for body text or large fills.
- Small accent text sits only on `--bg`. Phase 1 runs a contrast check script for `--surface` too.

**Theme handling:**
- Tokens go in `globals.css` under `:root` / `.dark` as new names, so the dashboard's shadcn vars stay untouched.
- next-themes runs with `attribute="class"`, `defaultTheme="system"` and `disableTransitionOnChange`. Its inline script means there is no flash on load.
- Toggle: a mono `(Dark)` / `(Light)` button with `aria-label="Switch to light theme"` and fixed width. It renders a same-size placeholder until mounted, so there is no CLS.

## 5. Fonts and type scale

**Fonts:**
- **Mona Sans** (variable wdth 75 to 125, wght 200 to 900, italic) and **JetBrains Mono** (wght 100 to 800). Both are SIL OFL 1.1, served from Google Fonts and self-hosted by `next/font/google`, with `subsets: ['latin']`, `axes: ['wdth']` and `display: 'swap'`. Only Mona normal is preloaded.
- Mona Sans keeps the width-axis mechanic without reusing the reference's Archivo. Alternative: Hubot Sans, same axes.
- Fonts load in the `(site)` layout only. The dashboard keeps Geist.

**Type scale:**

| Token | Size | Axes / leading |
|---|---|---|
| `display` | `clamp(6rem, 18vw, 17rem)` | uppercase, wdth 75 to 125 kinetic, wght 800, lh 0.86 |
| `h1` (statement) | `clamp(2.6rem, 5.2vw, 4.75rem)` | wdth 90, wght 600, lh 1.02, tracking -0.02em |
| `work` | `clamp(2.2rem, 4.8vw, 4.4rem)` | wdth 88, wght 700 (static) |
| `index` | `clamp(3rem, 6vw, 5.5rem)` | wdth 75, wght 800, in `--faint` |
| `h3` | `clamp(1.6rem, 2.6vw, 2.4rem)` | wdth 88, wght 700 |
| `lead` | `1.375rem/1.4` | |
| `body` | `1rem/1.5` | |
| `small` | `.8125rem/1.45` | |
| `label` | JetBrains Mono `.75rem` | uppercase, tracking .06em |
| `label-s` | `.6875rem` | |
| `marquee` | `clamp(2.5rem, 5vw, 4.5rem)` | italic, wdth 125, wght 250 |

**Spacing and grid:**
- `--gutter: clamp(1.25rem, 3.9vw, 3.5rem)`.
- `--section-y: clamp(5rem, 8.75vw, 8rem)`.
- 12-column grid with a `1.75rem` gap. The header is a 3-column grid.

## 6. Structure and shared architecture

**Route groups:**
- `app/layout.tsx` becomes minimal: html, body and ThemeProvider.
- `app/(site)/layout.tsx` holds the fonts, tokens, `MotionProvider`, `SmoothScrollProvider`, `Header`, `Cursor` and `PageTransition`. It contains `page.tsx`, `projects/`, `blogs/` and `blogs/[slug]/`. URLs do not change.
- `app/dashboard/layout.tsx` keeps Geist, QueryProvider, Tooltip and Toaster. Lenis, the cursor and the old navbar stop loading on the dashboard.

**Folders:**

```
lib/gsap.ts                       register ScrollTrigger, SplitText, Draggable, InertiaPlugin, CustomEase; eases; export gsap
components/providers/
  smooth-scroll-provider.tsx      rewrite (see below)
  motion-provider.tsx             paused + reducedMotion → context, sets html[data-motion]
components/site/                  Header, MobileMenu, Wordmark, LocalTime, ThemeToggle, PauseMotion, Cursor, PageTransition, TransitionLink, RollLink, Footer
features/motion/                  useMotionAllowed, useSplitReveal, useKineticLetters, useVelocity (ScrollTrigger.getVelocity, smoothed), Marquee, MaskImage
features/home/                    Hero (server) + HeroName (client leaf), SkillsMarquee, SelectedWork (server) + WorkList/WorkDock/CursorPreview (client), UpClose, Statement, Experience (server) + reveal leaf, WritingTeaser, Contact (+ ContactForm client)
features/projects/                ProjectRow (shared by home and archive), ProjectArchive (filters, from ProjectExplorer)
features/writing/                 ArticleRow, WritingArchive (slimmed from WritingExplorer), article page styles
```

**Smooth scroll:**
- `new Lenis({ autoRaf: false, anchors: true })`, then `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))` and `gsap.ticker.lagSmoothing(0)`.
- It is destroyed when motion is not allowed, which falls back to native scroll.
- Remove `scroll-behavior: smooth` from globals.css.
- On `document.fonts.ready` and the `load` event, call `ScrollTrigger.refresh()`.

**Motion gating:**
- Each animated leaf calls `useGSAP(() => { const mm = gsap.matchMedia(); mm.add({ fine: '(pointer: fine)', desktop: '(min-width: 768px)' }, ctx => …) }, { scope, dependencies: [motionAllowed], revertOnUpdate: true })`.
- `motionAllowed = !prefersReducedMotion` (the visible pause control was removed in the polish pass). When it is false, the hook bails out and everything shows in its final state.
- The pause flag is persisted in localStorage.

**One scroll source:** ScrollTrigger on Lenis is the shared progress. With no WebGL, there is no separate progress store. Per-frame values never go into React state; `quickTo` and the ticker handle them.

**Component boundaries:** public pages stay server components. Client components are only the leaves: name, work list, gallery, marquee, cursor, header controls and form.

## 7. DB projects

**Schema additions to `Project`** (one migration):
- `coverWidth Int?`, `coverHeight Int?`, `coverBlur String?` (base64 webp, about 300 B), `videoUrl String?`, `gallery Json @default("[]")`.
- `gallery` is an array of `{ url, width, height, alt, label }` and feeds Up close.
- `accent` and `sortOrder` already exist. Per the single-accent rule, `accent` is used only as the media placeholder background, never for text.

**Backfill:** `prisma/scripts/backfill-media.ts`, run with `node prisma/scripts/backfill-media.ts` (Node 26 strips TypeScript natively).
- For each `imageUrl` on Cloudinary, it reads the size from the URL with `fl_getinfo` and builds the blur from a `w_16,e_blur:1000,f_webp` fetch.
- It is idempotent and logs skipped rows.

**Upload and validation:**
- The upload route also returns `width` and `height` from the Cloudinary response.
- The dashboard project panel stores them. That is a minimal field addition, not a redesign.
- The Zod schemas in `lib/validation` get the new fields.

**Caching:**
- `lib/content-store.ts`: `getProjects`, `getBlogs` and a new `getBlogBySlug` are wrapped in `unstable_cache` with tags `['projects']` and `['articles']`.
- Remove `force-dynamic` from public pages.
- `/blogs/[slug]` gets `generateStaticParams`.
- `app/api/admin/content` calls `revalidateTag('projects'|'articles')` on mutation and keeps `revalidatePath('/sitemap.xml')`.
- `next.config.ts` gets `images.remotePatterns` for `res.cloudinary.com` and `avatars.githubusercontent.com`. All media moves to `next/image` with real width and height plus `placeholder="blur"`.

**Behavior by number of projects:**
- **0:**
  - The section shows its header, the line "Case studies are being written up. Meanwhile, the code is on GitHub →", and no dock.
  - Up close and the `Work` nav item point to the archive's empty state.
  - Layout height is fixed (min 60vh), so nothing shifts.
- **1:** one row, the dock without a progress bar or counter, and Up close only if `gallery` plus the cover reach 3 or more items.
- **Many (30):**
  - Home shows `featured` sorted by `sortOrder`, capped at 6, plus `All projects (30) →`.
  - `/projects` lists all of them with the same `ProjectRow`, filters kept, and no pin or dock; on desktop the row hover shows the cursor preview.
  - The dock box is a fixed 4:5 aspect ratio and rows are a fixed 40vh, so CLS stays 0 whatever the count.

## 8. Dependency removal

Usage was checked with grep. `features/dashboard`, `components/Dashboard`, `components/dashboard` and `components/editor` import none of the packages below.

| Remove | Why | Phase |
|---|---|---|
| `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `maath` | Only in the dead `components/FluidGlass.tsx` | 1 |
| `leva`, `r3f-perf` | Not imported anywhere, and only just added (uncommitted) | 1 |
| `ogl` | `soft-aurora` (Home Projects) and the dead `GradientWaves` | 5 |
| `framer-motion` | Only the dead `ui/smooth-cursor.tsx` | 1 |
| `motion` | 17 `components/ui/*` files used by Home sections, the archives and the navbar | 11 (after every section is replaced) |
| `@dotlottie/react-player`, `lottie-react` | `animated-theme-toggler` (replaced) and the dead `preload-splash`. Also delete `public/*.lottie` | 2 / 11 |
| `rough-notation` | Only the dead `ui/highlighter.tsx` | 1 |

**Keep:**
- `react-player` and `react-lite-youtube-embed` (Plate media nodes), `html2canvas-pro`, `pdf-lib` and `lodash` (editor), `axios` (`lib/http/client`, used by the dashboard), `tailwindcss-animate` (shadcn), `sonner`, `cmdk`, `@ariakit`.
- Also keep `@tanstack/react-query`, but in the dashboard layout only. The public contact form uses plain `fetch`.

**Dead files to delete when their importer goes:** `FluidGlass`, `GradientWaves*`, `BorderGlow`, `ui/smooth-cursor`, `ui/highlighter`, `ui/gsap-reveal`, `ui/gsap-text`, `ui/preload-splash`, `providers/preload-*`, and after Phase 11 the remaining motion/ogl ui files, `tubelight-navbar`, `strands`, `pixel-image`, `glass-surface`, `ripple`, `aurora-text` and `rainbow-button`.

**Rule:** grep for importers before each deletion. Never delete a `components/ui` file that the editor or dashboard imports.

## 9. Phases (for Sonnet)

All work happens on branch `redesign`. Each phase ends in one commit that stages only that phase's files; the untracked `.agent*/` and `.cursor/` folders are left alone.

**Standard acceptance (SA) for every phase:**
- `pnpm lint`, `pnpm exec tsc --noEmit` and `pnpm build` all pass.
- Playwright screenshots at 0/10/25/40/55/70/85/100% at 1440 and 390, saved to `docs/qa/<phase>/` (gitignored).
- A DevTools trace of load plus a scroll pass: CLS 0, no long task over 50 ms during scroll, no forced-reflow insight from our code.
- A check with `prefers-reduced-motion` emulated, plus the pause toggle on, confirming that all text is visible and nothing is pinned or scrubbed.

**Phases:**
0. **Docs.**
   - Save `docs/plan.md`, copy the reference shots to `docs/reference/mikewilcock/` and write `notes.md` with the §1 data.
   - Update CLAUDE.md Stack and Motion: remove the Canvas/Three/models lines, add the font-variation exception and the "ScrollTrigger is the shared progress" rule.
   - Add `.playwright-mcp/` and `docs/qa/` to `.gitignore`.
   - Acceptance: docs only.
1. **Foundation.**
   - Route groups, tokens for both themes, fonts and the type scale as Tailwind 4 `@theme` utilities.
   - `lib/gsap.ts`, the Lenis rewrite, `MotionProvider`.
   - Remove the three/R3F/maath/leva/r3f-perf/framer-motion/rough-notation deps and their dead files.
   - Acceptance: SA, plus the contrast script passes, there is no theme flash on a hard reload in both themes, and the dashboard looks unchanged (screenshot diff).
2. **Shell.**
   - Header (wordmark, local time, nav, theme toggle, pause, CTA), mobile menu, cursor, RollLink, footer row.
   - Acceptance: SA, keyboard-only nav works, focus is visible, the menu traps focus and Esc closes it.
3. **Hero + marquee.**
   - Acceptance: SA, the hero text is in the view-source HTML, LCP under 1.2 s in the trace, and the kinetic letters hold 60 fps while the mouse sweeps (trace frames).
4. **Data.**
   - Migration, backfill script, upload width and height, Zod, `unstable_cache` with tags, `revalidateTag`, `remotePatterns`, removal of `force-dynamic`.
   - Acceptance: SA, `pnpm db:migrate` and the backfill run cleanly, a dashboard edit shows on the public page after revalidation, and the build marks `/`, `/projects` and `/blogs/*` static or ISR.
5. **Selected work.**
   - List, dock, cursor preview, and the 0/1/many states. Remove ogl and soft-aurora.
   - Acceptance: SA, screenshots with 0, 1 and 30 projects (seeded on a local DB) with no shift.
6. **Up close gallery.**
   - Acceptance: SA, drag works with mouse and touch, the keyboard can scroll the track (it is focusable with `tabindex=0`), and native snap works on mobile.
7. **Statement + Experience.**
   - Acceptance: SA, and the copy matches resume.md word for word on facts.
8. **Writing teaser + Contact.**
   - Acceptance: SA, and the form sends through `/api/contact` in dev, with validation errors announced (`aria-live`).
9. **Archive routes.**
   - `/projects`, `/blogs`, `/blogs/[slug]` in the new design. Fix the hardcoded domains in the home metadata and JSON-LD to use `SITE_URL`. Check the sitemap.
   - Acceptance: SA on each route, the JSON-LD validates, and `/blogs/[slug]` bundle size is measured.
10. **Intro + page transitions.**
    - Acceptance: SA, the back and forward buttons work with no bars, anchors work, and LCP does not regress by more than 100 ms.
11. **Cleanup + budget.**
    - Remove `motion` and lottie, delete the dead ui files and `public/*.lottie`.
    - Acceptance: SA, grep for `three|leva|r3f-perf|motion/react` in `.next/static` returns nothing, and Lighthouse scores 95 or more on desktop and 85 or more on mobile on `/`, `/projects`, `/blogs` and one article.

## 10. Risks and open questions

**Risks:**
1. **Animating `font-variation-settings` re-lays out text.**
   - It is limited to the hero name (10 letters) and the footer CTA (8 letters), on fine pointers only.
   - Each line goes in a `contain: layout paint` box with `white-space: nowrap`, and the box width is reserved at max wdth so the outer layout never moves.
   - If the trace shows per-frame layout from it, switch to the scaleX fallback without asking.
   - The exception is recorded in CLAUDE.md.
2. **The intro overlay and LCP.** The text paints underneath, and the overlay lasts at most 1.1 s, first visit only. If LCP regresses, the overlay is dropped.
3. **How close we stay to the reference.** The structure is very close on purpose. Font, wordmark, colors, copy and sections differ, and the code is ours. Being called derivative is still a reputational risk; the "SAY HELLO" CTA and the scroll-compress name are our own signatures.
4. **Media quality.** The dock and Up close depend on good 4:5 covers and gallery images in the DB. Today projects have a single `imageUrl`.
5. **Plate static rendering on `/blogs/[slug]`** may ship heavy JS. It is measured in Phase 9 and may need a lighter static renderer.
6. **Uncommitted changes.** `package.json` and `pnpm-workspace.yaml` have uncommitted changes that this plan reverses. Playwright MCP has already written `.playwright-mcp/` logs into the repo, which get gitignored in Phase 0.

**Open questions:** all resolved. See Approved decisions below. Still open: the statement copy in §2.5 is a draft that needs Rafi's approval in Phase 7.

## Approved decisions (these override anything above)
1. **Open questions resolved.**
   - a. Webbly Media is hidden for now.
   - b. Mona Sans + JetBrains Mono. In Phase 1, confirm that `next/font/google` serves the `wdth` axis: check that `font-variation-settings: "wdth" 75` versus `125` changes the rendered width. If it doesn't, self-host the OFL woff2 files through `next/font/local`.
   - c. Keep the intro: first visit only, behind the LCP guard.
   - d. Writing teaser: yes.
   - e. Hero copy is approved with the exact resume wording: "I build web and mobile apps end to end, from the database to the interface. 3+ years of shipping with React, Next.js, Node.js and React Native."
   - f. Rafi sets featured projects and gallery images in the dashboard before Phase 5. Until then the dock and gallery use neutral labelled placeholder frames: an empty 4:5 box in `--surface` with a mono `(Cover pending)`. There are no fake projects or fake images.
2. **Database safety (Phase 4).**
   - Before Phase 4, read only the host and database name from `DATABASE_URL` in `.env` to tell Rafi whether it is a dev or production DB. Never print the credentials or the full URL.
   - Run `prisma migrate dev --create-only`, show the SQL, and wait for approval before applying it.
   - The backfill script takes a `--dry-run` flag (the default) that logs planned updates. Run that first; it writes only with `--apply`, after approval.
   - Never run `db:push` or `migrate reset`.
3. **Kinetic axes are limited to the hero name and the footer CTA, on fine pointers only.**
   - Work titles signal the active row with color, opacity and an x-shift only; no wdth/wght change.
   - On coarse pointers there is no axis animation at all, including the scroll compress on the name.
   - If the DevTools trace shows per-frame layout from the kinetic letters, switch to the scaleX fallback without asking.
   - **Done in Phase 3:** the trace showed 362 layout passes and CLS 0.097 during a mouse sweep, so the hero uses the scaleX fallback. Each letter mask scales on X (max 1.55) and its neighbours are shifted by transform. The wght axis is not animated, so the name stays at wght 800 on scroll instead of going to 900. The footer CTA in Phase 8 should reuse this approach.
4. **Stop after each phase commit** and wait for Rafi before starting the next one.

## Verification
Every phase is checked against the SA list in §9. The final gate is Phase 11: Lighthouse and the bundle grep, plus a manual pass for keyboard scrolling, anchors, back button, text selection, reduced motion and pause in both themes at 1440 and 390.
