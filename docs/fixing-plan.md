# Fixing phase: hero staircase, kinetic bounds, skills, work preview, navbar, title, copy, /services

## Context

The redesign on branch `redesign` is feature-complete, but Rafi listed 9 problems after review. The hero name was changed to one fitted line by mistake. The kinetic stretch spills past its container. The dock preview has drifted inward and gets stuck on scroll. The navbar is slightly off-centre. The title and copy read as generic. There is no client-facing services page. This plan fixes all 9 and keeps the CLAUDE.md rules: motion gating, CLS 0, transform/opacity only, and Lighthouse no worse than the last numbers in `docs/progress.md` (desktop 99 to 100, mobile home 99, `/projects` 85, project page 86).

Facts checked before planning:
- **There is no hero portrait.** `progress.md` says the hero is text only, and `components/ui/pixel-image.tsx` is not used. So there is no portrait or scroll handoff to keep. I will not add one (there is no approved asset).
- **The reference** (checked live at 1440): two lines, the second pushed right. The wordmark is "MICHAEL" plus an accent chip on the italic first letter of the surname. Services is one page with "ways to work together" and "how it usually goes" blocks. These are mechanics only. No code, copy or assets are taken from it.
- **Item 6 (your answer):** the only "Rafi Ferdos" under Say hello is the footer wordmark. It is removed on every page. That leaves item 2 covering every real use of `createKinetic`: the hero name and Say hello.
- **The pause control was removed earlier.** `motionAllowed = !prefers-reduced-motion` is the only motion switch, so "skip when paused" means "skip when reduced motion".

## Order and commits

The items are done in the order 6, 7, 1, 2, 3, 4, 5, 9, 8, with one commit per item (`fix(hero): …`, `feat(services): …` and so on). The copy pass (8) runs last so it also covers the new services page. Each commit needs `pnpm lint`, `pnpm exec tsc --noEmit` and `pnpm build` to pass. Each item gets a Playwright check at 1440, 1024 and 390 (screenshots in `docs/qa/fixing/<item>/`, which is gitignored) and a log entry in `docs/progress.md` under a new "## Fixing phase" heading.

---

## Step 1 (item 6): remove the footer wordmark
- `components/site/footer.tsx`: delete the `FitText` "RAFI ferdos" block and its import. Add a small muted label to the link row: `© {year} Rafi Ferdos, Full Stack AI Engineer`. This keeps the name and title in the footer (item 7) without a big wordmark.
- Verify: no `.fit` in `footer`, and the footer height drops. No horizontal overflow at the 3 widths.

## Step 2 (item 7): title "Full Stack AI Engineer" everywhere
- One constant: `lib/site.ts` `profile.jobTitle = 'Full Stack AI Engineer'`. Every other place reads it:
  - the hero label row (`features/home/hero.tsx`)
  - the footer label (step 1)
  - JSON-LD `jobTitle` (home), plus `knowsAbout` gains AI and RAG, AWS, Docker, CI/CD
  - `app/layout.tsx` default title, template, description, OG title and alt, Twitter. The alt also loses its em dash.
  - `app/(site)/page.tsx` title, description, OG and Twitter. "MERN developer" is dropped from the keywords.
  - `app/manifest.ts` name
  - the `/services` metadata (step 8)
- Also update the positioning line in CLAUDE.md and `docs/design-brief.md` ("Full Stack Developer / Software Engineer" becomes "Full Stack AI Engineer"). Otherwise the next session would revert it.
- **Honesty note, logged under "Needs Rafi: confirm":** resume v5 says "Full Stack Developer" and has no AI line. I'm using your title because you set it and named AI and RAG as skills yourself, and your RAG article backs the interest. Copy will claim AI *capability*, not shipped AI projects. If you have a shipped AI feature, add it to `docs/resume.md` and I'll name it. I did not find a more honest title that keeps AI in it. "Full Stack Engineer" is the honest fallback if you'd rather wait.
- `public/og.png` may have the old title in the image. I can't regenerate it well, so it goes on the confirm list.
- Verify: grep shows no "Full Stack Developer" or "Product Engineer" left in public routes. `curl` the home and `/services` HTML and check `<title>`, `og:title`, `description` and JSON-LD.

## Step 3 (item 1): hero name as a fitted staircase
- **Shared FitText, extended rather than duplicated** (`components/site/fit-text.tsx`). It gains an optional `lines?: string[]` prop with a matching `fallback: number | number[]`.
  - It renders one `.fit-text` span per line and passes `...rest` (for example `data-hero-line`) to each.
  - The measure loop goes over every line. It sets `--fit-w1…n` (each line's em width) and `--fit-w` (their sum) on the box.
  - A single line works as it does today, so Say hello and the project titles don't change.
- **CSS** (`app/site.css`): `.fit-text` keeps `font-size: calc(100cqw / var(--fit-w))`, so both lines get the same size and together fill 100% of the container. A new `.fit-stair .fit-text + .fit-text { margin-left: calc(var(--fit-w1) * 1em) }` starts FERDOS exactly under the end of RAFI. RAFI is about 37% and FERDOS about 63%. The JS writes only the em widths, never a pixel size, so a resize needs no script layout work.
- **Hero** (`features/home/hero.tsx`):
  - At 768 px and up (`data-hero-name="wide"`): `<FitText lines={['Rafi','Ferdos']} fallback={[1.54, 2.6]}>`. I'll re-measure the real values after the build.
  - Below 768 px (`narrow`): keep the two stacked lines, each fitted on its own. At 390 a staircase would set the type at about 81 px. Stacked lines give RAFI about 217 px and FERDOS about 129 px, which looks much stronger on a phone.
- **HeroMotion:** no change needed. It already finds `[data-hero-line]` per line. The leave scrub (line 1 −12vh, line 2 −4vh) now gives the staircase its own parallax, and the kinetic letters use the line index.
- **Fit check:** at 1440×900 the name is about 317 px type and about 545 px tall, so the whole hero is about 840 px. At 1024×768 it is about 224 px type and the hero about 680 px. Both fit in one viewport.
- Verify (Playwright eval):
  - RAFI's left edge equals the container's left edge.
  - |FERDOS left − RAFI right| ≤ 1 px.
  - FERDOS's right edge equals the container's right edge, at 1440, 1024 and 768. At 390, each line's width equals the container width.
  - No horizontal overflow, and CLS 0 in a DevTools trace.

## Step 4 (item 2): bounded kinetic stretch
Today, letters on each line scale from their left edge and push the rest right. So the line grows by Σw·(s−1) and gets clipped. The fix is in `features/motion/kinetic-letters.ts`, the only kinetic code, used by the hero and Say hello:
- **Normalise per line inside `follow()`:**
  - Ease every letter toward its target scale as now.
  - Per line, compute `k = Σw / Σ(w·s)` and use `s' = s·k`.
  - Accumulate `x` from the line start with `s'`.
  - The line's total width then stays exactly Σw. The first letter's left edge (origin 0%, x 0) and the last letter's right edge never move. Letters near the pointer widen, the rest narrow to make room, and hovering on the left pushes letters right without anything crossing either edge.
  - Spaces (Say hello) are unscaled text nodes and keep their width, so the sum still holds.
- **No layout reads in the pointer handler.** `onMove` keeps storing two numbers. The widths come from the cached `measure()`, which only runs on refresh.
- **Scroll fix found on the way:** add `onUpdate: markDirty` to the existing in-view ScrollTrigger. Otherwise letters stay stretched when the page scrolls under a still pointer.
- If the effect looks weak after normalising, I'll raise `MAX_SCALE` slightly. That is a visual call I'll make on screen.
- Verify: Chrome DevTools MCP, because headless Playwright throttles rAF to about 1 fps.
  - Move the pointer over the first letter, the middle and the last letter of each line, wait 1 s, and read the letter rects.
  - min(left) ≥ box left − 0.5 and max(right) ≤ box right + 0.5.
  - `scrollWidth === clientWidth` on the document at every step.

## Step 5 (item 3): skills marquee
- `features/home/skills-marquee.tsx`. The two rows stay different, run in opposite directions and keep pause on hover and focus. High-value skills come first in each row, so they are on screen at load. In both directions the start of the list is visible first.
  - **Row 1, "Product, mobile and AI" (moves left):** AI and RAG, Next.js, TypeScript, React Native, React, Expo, Redux, Tailwind CSS, JavaScript (ES6+).
  - **Row 2, "Backend, cloud and quality" (moves right):** AWS, Docker, CI/CD, GraphQL, Node.js, PostgreSQL, Prisma ORM, Socket.IO, Playwright, Jest, Express.js, REST APIs, MongoDB, Mongoose, Firebase, Git.
- Extras I'm adding that you didn't name: only "Real-time systems" and "Code review". Both are in the resume summary. AWS, Jest, Playwright and "AI and RAG" are yours but not in resume v5. All six go under "Needs Rafi: confirm".
- Verify: at 1440, 1024 and 390, the first 3 items of each row are inside the viewport at load. The rows move in opposite directions, and only the hovered row stops.

## Step 6 (item 4): Selected Work preview
**a. Dock alignment** (`app/site.css`)
- `.work-dock-sticky { width: min(100%, 48vh); margin-left: auto }` and `.work-dock-box { width: 100%; height: auto; aspect-ratio: 4/5 }`. At 60vh tall this is the same size as now, but the box now sits against the right edge of its grid column, which is the container edge (the same gutter as the header).
- The meta row is inside the sticky element, so it follows. `followCursor`'s `center()` reads the box rect, so the flights still land correctly.
- Verify: `box.right === innerWidth − gutter` (±1 px) at 1440 and 1024.

**b. Stuck image** (`features/home/work-follow.ts`)
- Keep the last pointer position on every `pointermove` over the list, not only while a frame is held.
- Cache each row's top and bottom in page coordinates, plus the list's left and right, using the offset chain already used in kinetic-letters. Measure on init and on `ScrollTrigger` refresh only.
- A ScrollTrigger on the list has an `onUpdate` that runs at most every 100 ms while a frame is held:
  - Compute `y = lastY + self.scroll()` and look up the row with no DOM reads.
  - Outside every row, or outside the list's x range: `release()`.
  - Over a different row: grab that row. `grab` takes `{clientX, clientY, pointerType}` instead of the event.
- Also release on `pointerleave` of the section, window `blur` and `visibilitychange` (hidden). All of this is removed in the existing cleanup.
- Verify (Playwright): hover row 1 so the frame is held, then scroll with `mouse.wheel` without moving the mouse until the next section is under the pointer. Expect `.is-held` to clear within about 1 s. Then the same check after `blur` and a hidden tab.

**c. Project click transition** (`components/site/page-transition.tsx`, plus small hooks)
- Links that open a project carry `data-transition-title={project.title}`. These are the `ProjectRow` link (home and `/projects`) and the Next project link.
- When such a link is clicked (the same guards as today: left click, no modifier keys, internal URL, motion allowed), the overlay plays instead of the bars:
  1. Inside the existing `PageTransition` root there is a page-colour panel and a title layer. The title layer copies the detail page's title box exactly: `px-gutter pt-28`, a spacer one label line tall, then `.project-title mt-8` with the same `.fit`/`.fit-text` classes. A shared `titleClass` export makes sure the page and the overlay can't drift apart.
  2. On click, set the title text and read its width once (a click, not a frame loop). Set `--fit-w`, so the overlay title has the destination's exact size and position.
  3. The panel wipes up (scaleY, 0.4 s, `inOut`). The title rises in its clip (yPercent 105 to 0, 0.5 s, `out`, 0.1 s delay). Then `router.push`.
  4. Set `<html data-arrival="title">` before the push. `ProjectMotion` sees it, skips its own title slide-up (the title is "already in place") and clears the flag.
  5. When the pathname changes, wait 2 rAF so the page's FitText has measured. Hide the overlay title (the page's own title is underneath it at the same spot), then wipe the panel off upward (0.4 s).
- Total: about 0.4 s + route + 0.4 s, so about 0.9 s on a prefetched route. If the route is slow, the title stays up as the loading state. The existing 4 s safety timeout also covers this.
- **Prefetch:** `next/link` already prefetches visible and hovered links in production. I'll check this in the network panel.
- **Cover:** not carried over. On the detail page the cover sits below the title and the meta row, often below the fold, so a moving image would not land anywhere visible. The title gives the continuity.
- **Reduced motion:** no listener, so a plain navigation. **Touch:** the overlay runs. It replaces the bars instead of adding to them and takes the same time, so it is not slower. **Back and forward:** native, with no overlay, as today. A pathname change during the overlay (for example pressing back) runs the reveal path, so the page is never left covered.
- Verify (Chrome DevTools MCP for timing): click a home row, then a `/projects` row, then Next project.
  - The overlay title's rect equals the page title's rect within 1 px when it hands off.
  - Total time is under 1 s.
  - Back returns home with no overlay.
  - With reduced motion emulated, the navigation is plain.

## Step 7 (item 5): navbar
**a. One vertical axis**
- The root cause is a strut. The nav `RollLink`s are `inline-block align-top` inside `li`s with a 16/24 body line box, so the 12 px labels sit at the top of a 24 px line. `CtaPill` has the same problem inside its `div`. The fixes:
  - nav `ul`: `flex items-center`
  - the `RollLink` className gets `block` (tailwind-merge drops `inline-block`)
  - the `CtaPill` wrapper becomes `inline-flex items-center`, so the label is a flex item with no strut, and the even padding then centres it.
- Font metrics: JetBrains Mono caps are close to centred in their line box (≈0.005 em off). Mona Sans in the wordmark is not.
  - I'll apply `text-box: trim-both cap alphabetic` (supported in Chrome and Safari) to the header items through one `.nav-trim` class. That way each item's box is its cap box and flex centres it exactly.
  - Firefox ignores it and keeps the strut-free (nearly centred) layout.
  - The roll mask on trimmed links is safe because the header labels have no glyphs outside cap height (no parentheses or descenders). `(Light)`/`(Dark)` is a button with no clip.
- **Measuring** (Playwright eval):
  - Each item's baseline comes from a 0×0 inline-block probe.
  - Its ink box comes from canvas `measureText(text)` with the computed font (`actualBoundingBoxAscent/Descent`).
  - Its ink centre is the baseline minus half the ink height.
  - Pass: every item's ink centre is within 0.5 px of the header bar's centre, and the "Get in touch" ink centre is within 0.5 px of the pill's centre. Checked at 1440 and 1280 (the full nav shows at `xl`), and at 390 for the wordmark and the menu button.
- Since `/services` also has a contact section, `CtaPill` becomes a tiny client component that links to `#contact` on `/` and `/services` and to `/#contact` everywhere else. Otherwise, on `/services` it would send you away from the form on that page.

**b. Wordmark chip** (`components/site/wordmark.tsx`)
- `RAFI` (800, 75% width, uppercase), then a chip `<span class="wordmark-chip">f</span>`, then `erdos` (light italic, 125% width). The chip is the italic f on `--site-accent` with `--site-accent-ink` text and a small inline padding, tuned on screen so the italic overhang sits inside the chip.
- I'm keeping the f lowercase to match the existing lockup and the reference's lowercase chip letter. The accessible name stays "Rafi Ferdos, home".
- Contrast: light theme white on #c7340e is 5.35:1, dark theme #0f0e0d on #ff4a1c is 5.74:1. Both pass AA. I'll re-check with the axe numbers in Lighthouse.

## Step 8 (item 9): `/services`
- New route `app/(site)/services/page.tsx`. It is a server component, uses only existing motion leaves, and has no database read, so it is fully static.
  1. **Opening:** a label row "(Services)" and "Available for new projects", then a big fitted title in the same fixed-height title box as the project pages. Under it, a short statement (`t-h1`, `data-reveal`).
  2. **Services grid:** numbered cards that use the Experience tile markup and CSS as they are (`exp-list`/`exp-tile`, full-card accent fill, siblings veiled). The grid is 3 columns at md and up, so 6 cards make 2 rows. Each card has:
     - its number and title
     - one sentence on what the client gets
     - a "Deliverables" list (`data-exp-bullet`, with the line reveal)
     - a stack line in mono
     - a link "Start a project like this →" to `#contact` with `data-service="<id>"`
  3. **Process:** 4 numbered steps (big `t-index` numbers): Talk, Plan, Build, Launch, built from the resume facts ("owning requirements, architecture decisions, and deployment", code review). It's a 4-column row on desktop and stacked on mobile, with `data-reveal` playing once on enter.
  4. **Closing call to action:** the existing `<Contact />` section (the kinetic Say hello that opens the form).
- **The services, each backed by the resume or named by you:**
  1. Web apps, including dashboards and admin panels: Next.js, React, TypeScript, Tailwind.
  2. Backends, APIs and real-time: Node.js, Express, REST, GraphQL, Socket.IO, Prisma, PostgreSQL, MongoDB.
  3. Mobile apps: React Native, Expo.
  4. Ecommerce, web and mobile (the 2 production apps).
  5. AI features (RAG chatbots over your own data). Flagged on the confirm list.
  6. Performance and SEO. The proof is this site, at Lighthouse 99 to 100 on desktop. That's a real, checkable claim.
- There are no prices.
- **Motion reuse, no new motion code:**
  - `ProjectMotion` moves to `features/motion/page-motion.tsx` as `PageMotion`. Its title selector `[data-project-title]` is renamed to `[data-page-title]` (one CSS rule and two pages), and it drives the title and the `data-reveal` blocks.
  - `ExperienceMotion` gets a `labelledBy` prop. Its desktop branch becomes a scrub per tile, with the start offset by column (`i % 3`), so one row of 3 looks the same as today and 2 rows work.
- **`?service=`:**
  - The ContactForm gains a "Topic" `<select>`: the 6 services plus "Something else". It feeds the API's required `subject` (`Project enquiry: <title>`), and "Something else" keeps today's subject. The services list lives in one `data/services.ts` that the page and the form share.
  - The preselect comes from `?service=` on mount, checked against the known ids. ContactCta also opens the form when the param is present.
  - Clicking an in-page card link (`a[data-service]`) opens the form with that topic through one delegated listener in ContactCta. Lenis `anchors` does the scroll.
- **Wiring:**
  - `navItems` gains "Services" (`/services`) in second place. There are now 6 numbered items, and I'll check the `xl` header fits at 1280.
  - The footer row gets a Services link.
  - `app/sitemap.ts` gets an entry.
  - The page has `metadata` (title "Services", description, OG, canonical) and JSON-LD (`ItemList` of `Service`, with the provider as the Person).
- Verify:
  - Screenshots at 0/10/25/40/55/70/85/100% at 1440 and 390, plus 1024.
  - The hover fill covers the card and the siblings dim.
  - `/services?service=ai#contact` opens the form with "AI features" selected.
  - A card click opens the form with its topic selected.
  - Reduced motion shows everything in its final state.
  - Lighthouse desktop and mobile for `/services`, plus a DevTools trace.

## Step 9 (item 8): copy rewrite, whole site
- Voice: short sentences with rhythm, concrete facts, people and outcomes, a point of view (caring about the details people touch). Only facts from `docs/resume.md`. No em dashes. Banned words: leveraged, robust, passionate, seamless, cutting-edge, innovative, plus agency filler ("solutions", "elevate").
- **Covered:**
  - hero label row and intro
  - Statement (the whole sentence and which words get emphasis)
  - Selected Work header and labels, and its empty state
  - "All projects" and "All writing" links
  - Experience: the bullets are rewritten from the resume facts, and the "word for word" code comment is updated
  - Writing teaser
  - Contact heading, the "(Click to write)" hint, form labels and status messages
  - footer
  - archive empty states ("(No projects yet)", "(No matches)") and archive page metadata
  - the "Up close" label
  - all `/services` text
  - the meta descriptions in `layout.tsx` and the page files
- **The direction, for example** (the full set goes in `docs/copy.md`):
  - Statement, old: "I'm Rafi. I build the whole thing: the API, the database…" New: "Most products are built in pieces, by people who never meet. I build *all of it*: the database, the API, the screen in your hand. One person. One standard. *End to end.*"
  - Experience (Sparktech), new: "Joined on the frontend. Full stack in three months, React Native in seven. Two ecommerce apps, shipped start to finish."
  - Hero intro, new: "I design and build web and mobile products, from the database to the last pixel. Three years of shipping, for product teams and clients abroad."
- `docs/copy.md`: one table per section with three columns: location (`file:line`), old line, new line. New `/services` lines are marked "(new)".
- Verify: a grep over the public routes shows none of the banned words and no em dashes (`—`). I'll spot-check screenshots so nothing overflows (for example, the new Statement still fits the sticky viewport at 390).

## Final pass (after all items)
- Full scroll screenshots for `/`, `/services`, `/projects` and one project page at 1440, 1024 and 390.
- A DevTools performance trace on `/` (60 fps on scroll, no layout every frame from kinetic).
- Lighthouse desktop and mobile on `/`, `/projects`, a project page and `/services`, compared with the last numbers.
- `progress.md` gets the summary, the "Needs Rafi: confirm" list and any decisions.

---

## Checklist: item to step

| Item | What | Step |
|---|---|---|
| 1 | Hero staircase, shared FitText with summed widths, 390 stacked, portrait (none exists) | Step 3 |
| 2 | Bounded, normalised kinetic stretch on every kinetic use (hero, Say hello); the footer wordmark is removed per item 6 | Step 4 |
| 3 | Advanced skills, high-value first in both rows, extras on the confirm list | Step 5 |
| 4a | Dock right edge on the container edge | Step 6a |
| 4b | Release on scroll, section leave, blur, visibilitychange | Step 6b |
| 4c | Project title transition, prefetch, reduced-motion skip, back handling | Step 6c |
| 5a | Navbar items on one axis, pill label centred, measured | Step 7a |
| 5b | Wordmark accent chip on the italic f | Step 7b |
| 6 | Remove "Rafi Ferdos" under Say hello (the footer wordmark) | Step 1 |
| 7 | "Full Stack AI Engineer" everywhere, with the honesty note | Step 2 |
| 8 | Whole-site copy rewrite plus `docs/copy.md` | Step 9 |
| 9 | `/services`: statement, numbered cards, process, call to action, nav, footer, sitemap, metadata, `?service=` | Step 8 |
| All | One commit per item, Playwright at 1440, 1024 and 390, log in progress.md | each step plus Final pass |

## Risks and what I chose not to do
- **Unsupported claims:** AI and RAG, AWS, Jest and Playwright, and the AI services card are your claims, not resume v5. They are on the confirm list, and copy will not describe a shipped AI project.
- **Mobile Lighthouse noise:** home mobile has swung between 80 and 99 on this machine. Each comparison will use 2 runs.
- **Overlay position:** the overlay and page titles must match to the pixel. They share the same classes and fonts, but a scrollbar-width difference could shift the gutter. The trace check in 6c measures this, and if it's off by more than 1 px the overlay fades out instead of cutting.
- **`text-box` in Firefox:** it's a progressive enhancement, so Firefox centres the line box, not the cap box. The offset there is under 1 px for the mono labels and about 1 to 2 px for the wordmark.
- **Normalised stretch:** far letters now compress below their rest width. That is the cost of a fixed total width, and it is how the reference's width axis reads too.
- **Not done:**
  - Carrying the cover in the project transition: it lands below the fold, so it adds nothing.
  - A hero portrait: none exists and there is no asset.
  - Regenerating `og.png`: no source file.
  - A staircase at 390: the type would be too small.
  - Pause control behaviour: the control no longer exists.
