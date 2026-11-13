# rafiferdos-ultra
 
Portfolio of Rafi Ferdos (Full Stack AI Engineer). Being redesigned from scratch as a scroll-driven, typography-first site with GSAP. No WebGL. The full plan is in `docs/plan.md`. Goal: award-level motion that stays fast.
 
## Stack (already installed, do not add alternatives)
 
- Next.js 15 App Router, React 19, TypeScript, Tailwind 4, pnpm, Turbopack
- Motion: gsap + @gsap/react (useGSAP), with the ScrollTrigger, SplitText, Draggable, InertiaPlugin and CustomEase plugins. Lenis for smooth scroll.
- Type: Mona Sans (variable, wdth + wght + italic) and JetBrains Mono, both OFL, through `next/font`. They load in the `(site)` layout only.
- Theme: next-themes, light and dark, one accent (vermilion, a value per theme, see `docs/plan.md` §4).
- Data: Prisma 7 + Postgres, Cloudinary for media, Resend for email
- Dashboard (/dashboard/rafi): PlateJS, TanStack Query, shadcn, Zod. It keeps Geist and its own layout and is not redesigned.
- No WebGL: three, @react-three/*, maath, leva and r3f-perf are removed. ogl is removed in phase 5 (plan §8). Do not add them back. Any WebGL exception needs a written justification and Rafi's approval.
Rule: GSAP drives all animation on public pages. Do not use framer-motion or motion there. They are removed once nothing imports them (plan §8).
 
## Source of truth
 
- Personal and career content comes from `docs/resume.md` (v5 Full Stack Developer resume). It wins over the database, `data/site-content.ts` and the README.
- Position Rafi as Full Stack AI Engineer (his choice, 2026-11-13; `profile.jobTitle` in `lib/site.ts`). The resume still says Full Stack Developer, and roles named in it keep their own titles. Never as a beginner. Do not claim shipped AI work the resume does not list.
- Never invent or inflate experience, metrics, dates or employers. If something is missing, leave a TODO and ask.
- Projects and articles live in Postgres and are managed from the dashboard.
- Design direction lives in `docs/design-brief.md`. Follow it. Do not drift to generic layouts.
## Commands
 
```
pnpm dev
pnpm build
pnpm lint
pnpm exec tsc --noEmit
pnpm db:generate | db:migrate | db:deploy | db:studio
```
 
Before calling a task done: lint, tsc and build must pass.
 
## Structure
 
`app/` routes, `components/` shared UI, `features/` feature code, `hooks/`, `lib/`. Public pages are server components. Only the scene and animation leaves are client components. Dashboard code (Plate, etc.) must never be imported by a public route.
 
## Motion architecture
 
- One Lenis instance in a single provider, synced with GSAP:
  `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add((t) => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`.
- Lenis runs with `autoRaf: false` and `anchors: true`. It is destroyed when motion is not allowed, which falls back to native scroll. No `scroll-behavior: smooth` in CSS.
- ScrollTrigger on Lenis is the single shared scroll progress. There is no separate progress store. Per-frame values go through `gsap.quickTo` or the ticker, never React state.
- Build the page as scrubbed timelines, not independent fade-ins. Large type scrubs; small UI text (labels, list rows) may play once on enter. Never both on one element.
- Typography: GSAP SplitText with mask reveals (`mask`, `autoSplit`, `onSplit` returning the tween). Animate only transform and opacity. Never width, height, top, margin, filter, clip-path or box-shadow. Mask wipes use nested transforms instead of clip-path.
- Exception: `font-variation-settings` (wdth, wght) may animate on the hero name and the footer CTA letters only, on fine pointers only, inside `contain: layout paint` boxes with width reserved. If a trace shows layout work every frame from it, switch to the scaleX fallback.
- Eases: `out` = `cubic-bezier(.16,1,.3,1)` and `inOut` = `cubic-bezier(.76,0,.24,1)`, registered with CustomEase. Durations: 0.25 micro, 0.45 hover, 0.7 ui, 1.1 display.
- Register GSAP plugins once in `lib/gsap.ts`. One exception: `Draggable` and `InertiaPlugin` are registered in `lib/gsap-drag.ts`, so they only load with the home gallery and stay off every other route. Import `Draggable` from there. Use `useGSAP` with a scope, never a raw `useEffect`. Call `ScrollTrigger.refresh()` after fonts and images load.
- Motion gate: `motionAllowed = !prefersReducedMotion` (there is no visible pause control). Every animated leaf uses `gsap.matchMedia()` with `dependencies: [motionAllowed]` and `revertOnUpdate: true`. When motion is off, everything renders in its final state with no scrub, pin, cursor or kinetic type.
- The custom cursor and cursor-driven effects run on `(pointer: fine)` only.
- Keep native behavior working: keyboard scroll, anchor links, back button, text selection.
## Performance budget
 
- Lighthouse performance: 95+ desktop, 85+ mobile. CLS 0. INP under 200 ms. Scroll holds 60 fps on desktop.
- All text must be in the server-rendered HTML and readable before any JavaScript animation runs. Initial hidden states apply only when motion is allowed.
- Mobile and coarse pointers get a lighter version of the same design: no cursor, no kinetic axes, native horizontal scroll with snap in the gallery. `prefers-reduced-motion` and the pause control disable scrub, pinning and heavy effects. Use `gsap.matchMedia()` for this.
- Fonts through `next/font`, subset, at most 2 families. Images through `next/image` with explicit width and height.
## Backend
 
- Keep the Prisma schema and Zod validation at API boundaries.
- Public reads go through `unstable_cache` with tags (`projects`, `articles`). Dashboard mutations call `revalidateTag`. Public pages must not hit the database on every request.
- Project records carry what the animation needs: cover width and height, blur placeholder, accent color, optional video URL, sort order. Add them with a migration and backfill existing rows.
- The layout must not break or shift with 0, 1 or 30 projects.
- Never read `.env` or print secret values.
## Workflow
 
- Plan first, one section at a time.
- After each section: use Playwright MCP to screenshot scroll positions 0, 10, 25, 40, 55, 70, 85, 100 percent at 1440 px and 390 px wide, into `docs/qa/<phase>/` (gitignored). Then run a Chrome DevTools MCP performance trace and Lighthouse. Fix problems before starting the next section.
- Use Context7 for current GSAP, Lenis and Next docs. Do not rely on memory for API details.
- Work on branch `redesign`. Commit after each finished phase of `docs/plan.md`, then stop and wait for Rafi.
## Code and copy style
 
- Strict TypeScript, no `any`, small components, clear names.
- Write code like a person would. Comment only the why, or non-obvious math. No boilerplate, no placeholder lorem, no fake data.
- Site copy: simple natural English. No buzzwords (leveraged, robust, passionate), no press-release tone, no em dashes.
