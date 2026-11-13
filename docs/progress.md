# Progress

Branch `redesign`. Newest phase last. Decisions made without asking are marked **Decision**.

## Needs Rafi (placeholders in the site until these exist)

- Featured projects and their sort order (dashboard). Until then the home list shows the first 6 projects if none are marked featured.
- Cover images in a 4:5 ratio for each project. Today's covers are about 2:1 screenshots, so the dock crops them to the middle. A project without a cover shows a `(Cover pending)` frame.
- Gallery images for "Up close" (phase 6). Until a project has gallery items the section stays hidden.
- Webbly Media role title and dates (phase 7). Left out of Experience until then.
- Final statement copy for the About section (phase 7). The draft from plan §2.5 is used and marked.
- Cover blur for any project edited in the dashboard after 2026-11-13: new uploads clear the blur. Re-run `node prisma/scripts/backfill-media.ts` (dry run), then `--apply` after review.

## Needs Rafi: confirm (claims the resume does not support yet)

- **Skills marquee: two extras you did not name:** "Real-time systems" (resume summary and the Socket.IO bullet) and "Code review" (the 35+ code reviews bullet). Both are in the resume's own words. Say so if you want either one out.
- Title and the skills AI and RAG, AWS, Jest and Playwright are confirmed and now in `docs/resume.md` (2026-11-13). No shipped AI project is listed anywhere, so copy must not name one.

## Phase 4 (Data), done

- Migration `20261113000000_project_media` applied with `prisma migrate deploy` (additive: coverWidth, coverHeight, coverBlur, videoUrl, gallery).
- Backfill applied to 3 projects (cover size and blur from Cloudinary). Re-run is a no-op.
- `unstable_cache` with tags `projects` and `articles`, `revalidateTag` on dashboard mutations, `force-dynamic` removed from public pages, `/blogs/[slug]` static params, Cloudinary and GitHub `remotePatterns`.
- **Decision:** the loaders throw inside the cache and the public getters catch, so a database error is never cached as an empty list.
- **Decision:** project edits only write the media fields when the dashboard sends them, so a save cannot wipe backfilled values.
- Not checked: that a dashboard edit shows on the public page (needs a write to the production database).
- `pnpm db:migrate` runs `migrate dev`, which is not used on this database. Use `pnpm db:deploy`.

## Phase 5 (Selected work), done

- `features/home/selected-work.tsx` (server), `work-motion.tsx` (client leaf), `features/projects/project-row.tsx` and `project-cover.tsx` (shared with the archive in phase 9).
- Active row by `onToggle`, sticky 4:5 dock with a transform mask wipe, rolling index and counter, progress bar, 320x400 cursor card on fine pointers.
- Without motion, or under 768 px, there is no dock; each row carries its own cover.
- States checked with fixtures on a temporary route (not committed): 0 rows (min 60vh, GitHub line), 1 row (no counter or bar), many (capped at 6, `All projects (N)` link). CLS 0 in all, no long tasks over 50 ms in a full scroll pass at 1440.
- Reduced motion: no `js-motion`, dock hidden, all rows at opacity 1, no pin spacers.
- Removed `ogl`, `soft-aurora`, `GradientWaves` and the old home Projects section.
- **Decision:** the active color uses a CSS variable (`--w`) with `color-mix`, so the active row follows the theme without inline colors.
- **Decision:** the cursor card image is a plain background (Cloudinary crop URL) set on hover, so it adds no image requests until used.
- Not done here: DevTools trace and Lighthouse on a production build. Dev mode numbers are not meaningful, so these run in phase 11.

## Phase 6 (Up close), done

- `features/home/up-close.tsx` (server) and `up-close-motion.tsx` (client leaf). Media = each featured project's cover, then its gallery. Hidden under 3 items.
- Desktop with motion: the track is scrubbed by page scroll (`top bottom` to `bottom top`), a Draggable with inertia adds an offset, skewX is clamped to 3 degrees, the cursor ring shows `Drag`. Under 768 px, with reduced motion or paused, it is a native `overflow-x: auto` scroller with `scroll-snap-type: x mandatory`.
- The region is focusable (`tabindex=0`). Under motion the arrow, Home and End keys move the drag offset; natively the browser scrolls it.
- Checked: mouse drag, ArrowLeft, End and cursor label on desktop; snap to the second item at 390 px; rules for 0, 1, 2 and 3 items (1 project with a 4-frame gallery shows it); reduced motion gives a native scroller with no transforms.
- **Decision:** drag bounds are recomputed from the scrub position on every scroll update, so drag and scroll add up but the track can never leave its range.
- Not verified: touch drag on a real device (Playwright here has no touch context). Draggable handles touch natively; worth a check on a phone in landscape over 768 px.
- Right now it shows 3 images, the 3 project covers. Real gallery images are in the "Needs Rafi" list.

## Phase 7 (Statement + Experience), done

- `features/home/statement.tsx` + `statement-motion.tsx`, `experience.tsx` + `experience-motion.tsx`. Home order is now hero, marquee, work, up close, statement, experience, then the old Tech stack, Blog and Contact blocks until phase 8.
- Statement: one span per word, scrubbed opacity 0.15 to 1 with a 0.5 stagger over the section (160svh, CSS `position: sticky` inner, no ScrollTrigger pin). Emphasis `whole thing` and `motion` are wide light italic, the last phrase is accent.
- Experience: 3 bordered tiles from resume.md (Sparktech, ZenDevz, DIU), two bullets each, word for word. From 768 px one scrub with a 0.15 stagger; under 768 px each tile scrubs on its own. Bullets use a SplitText line mask and play once. The accent top rule is a `scaleX` pseudo-element, the `↗` on ZenDevz moves x 4, y -4.
- Checked at 1440 and 390 on a production build: CLS 0, no horizontal overflow, statement height is 160svh at both widths, dark theme reads. Reduced motion: no `js-motion`, statement is normal height, words and tiles at opacity 1, bullets visible, no pin spacers. Screenshots in `docs/qa/phase7/`.
- **Decision:** the dates and company line follow resume.md exactly ("Nov 2024 - Feb 2025", "Sparktech Agency - BDCallingIT"). The old `data/site-content.ts` had different ZenDevz dates; the resume wins.
- **Decision:** bullets chosen: Sparktech 1 and 2 (the chat bullet is already in the statement), ZenDevz 1 and 3, DIU 2 and 3.
- **Decision:** the `(Hello)` label is static, not a char fade (tiny, and the statement scrub is right below it).
- **Decision:** nav "About" now points to `/#about`. Removed the old `WhyMe` and `Experience` components.
- Statement copy is the plan draft. "the motion" is the one phrase the resume does not back, flagged with a TODO in `statement.tsx`.
- Not done here: DevTools trace and Lighthouse on a production build (phase 11, same as phases 5 and 6).

## Phase 8 (Writing teaser + Contact), done

- `features/home/writing-teaser.tsx` + `writing-motion.tsx`, `contact.tsx` + `contact-cta.tsx` + `contact-form.tsx`, and `features/motion/kinetic-letters.ts`.
- Writing: latest 3 published posts, hidden at 0. Rows are `(Category)`, title, read time, month and year. The title roll is CSS only (a `::after` copy from `data-text`, so long titles wrap). Each row plays once, a mask slide on enter. `All writing (N) →` links to `/blogs`.
- Contact: `Got something in mind?`, then the giant accent `SAY HELLO` button that opens the form under it. Letters rise on a scrub; on fine pointers they stretch with the cursor. The form is always in the DOM, `inert` while closed. It opens with an instant `0fr` to `1fr` switch and only its opacity and y animate. Focus moves to the name field.
- Form: Zod check on the client (the same `contactSchema` the API uses), per-field errors with `aria-invalid` and `aria-describedby`, one `role="status"` live region for errors, sending and success. Posts to `/api/contact`. The honeypot field stays.
- Checked on a production build at 1440 and 390: CLS 0, no horizontal overflow, CTA fits at 390, all rows and letters settled at the bottom of the page, form opens and focuses with reduced motion and with the pause toggle, empty submit shows 3 field errors plus the summary line, the payload sent is correct.
- **Not checked with a real send.** The route writes to the production database and sends an email, so I mocked `/api/contact` in the browser. A real submit needs your OK (or do one yourself); until then the live path is untested end to end.
- **Decision:** extracted the hero's kinetic letters into `features/motion/kinetic-letters.ts` (same scaleX fallback from phase 3) so the CTA reuses them. Verified the hero still stretches under a mouse sweep.
- **Decision:** the form has name, email and message as in the plan. The API requires a subject, so the client sends the fixed `Message from the portfolio`. No API change.
- **Decision:** removed the phone number: the old contact block showed it and the home JSON-LD had `telephone`. `docs/resume.md` says no phone on the site. `profile.phone` is still in `lib/site.ts`, unused.
- **Decision:** removed `QueryProvider` from the `(site)` layout (nothing public uses it now) and deleted the old `Contact`, `BlogGateway`, `TechStack` and `SectionHeading` components. The old Tech stack block is gone; the skills marquee covers it.
- **Decision:** the CTA scrub ends at `bottom 85%` and the Writing rows trigger from their static mask. The first version of each could not finish at the last scroll position (CTA) or at 390 px (third row) because the trigger sat on a transformed or too-low element.
- **Decision:** `ScrollTrigger.refresh()` after opening the form only runs when motion is on. With motion off there are no triggers, and the refresh sent the page back to the top on a real click.
- **Decision:** `.cta-form` has `transition-property: none` because the global reduced-motion rule in `globals.css` gives everything a 0.01ms transition, which delayed the `0fr` to `1fr` switch by about a second.
- Without JavaScript the form stays closed. The email is in the footer row.
- Not done here: DevTools trace and Lighthouse on a production build (phase 11).

## Phase 9 (Archive routes), done

- `/projects`: `features/projects/project-archive.tsx` (client filters) using the shared `ProjectRow`. `/blogs`: `features/writing/writing-archive.tsx` using the shared `ArticleRow` (the home teaser uses it too). `/blogs/[slug]`: new header, `next/image` cover, body styled with `.prose-site` (site tokens).
- Filters: search, role and type pills (shown only when there are 2 or more values), a native stack select, a live `(n / N)` count in a `role="status"` region, and a reset. 0 results shows `(No matches)`, 0 items shows `(No projects yet)`.
- Home metadata, canonical and JSON-LD now use `SITE_URL` (the old file hardcoded `rafiferdos.com` and `rafiferdos.vercel.app`). With the current env it resolves to `https://rafiferdos.vercel.app`, the portfolio URL in `docs/resume.md`. `lib/site.ts` still defaults to `rafiferdos.com` when the env var is missing.
- Checked on a production build at 1440 and 390: CLS 0 and no horizontal overflow on all three routes, JSON-LD parses on `/` and on an article, the sitemap lists the home, `/projects`, `/blogs` and every article on `SITE_URL`, reduced motion keeps archive rows at opacity 1 with covers visible.
- Bundle (First Load JS, shared 149 kB): `/projects` 210 kB (was 284), `/blogs` 204 kB (was 286), `/blogs/[slug]` 208 kB with 5.2 kB of its own (was 244 kB). The article body is rendered on the server by the Plate static renderer, so no Plate code ships to the client.
- **Decision:** `.js-motion .work-*` rules are now scoped to `.work .work-*`, so only the home list gets the dock layout and dimmed rows. Archive rows get `min-height: 0` through `.archive`.
- **Decision:** home title and job title say "Full Stack Developer" (were "Full Stack Product Engineer"), per CLAUDE.md. The title uses a comma, not an em dash.
- **Decision:** dropped the old per-project badges and discipline/type selects in favour of pills; dropped the writing format and tag filters. Say if you want either back.
- **Decision:** the article cover uses `fill` with `unoptimized` for any host that is not Cloudinary, since only Cloudinary is in `remotePatterns`.
- **Decision:** Plate static blocks (code, tables, callouts) still use shadcn tokens for their own colors; only prose, links, quotes and `pre` follow the site tokens. Looks fine on the 4 current articles, none of which use tables or callouts, so not checked there.
- Deleted `ProjectExplorer` and `WritingExplorer`. `components/ui/reveal` (framer/motion) is no longer used on any public page.
- Not done here: DevTools trace and Lighthouse (phase 11).

## Phase 10 (Intro + page transitions), done

- `components/site/intro.tsx`, `components/site/page-transition.tsx`, both mounted in the `(site)` layout. The pre-paint script adds `js-intro` on a full load of `/` when motion is allowed and `sessionStorage` has no `intro-seen`. It also removes the class after 4 s as a fail-safe. The overlay markup is in the server HTML and the CSS shows it only under `js-intro`.
- Intro: 5 bars and a `RAFI ferdos` + 00 to 100 counter. The counter runs 0.3 s once the fonts are ready (capped at 1 s), then the text fades and the bars wipe out over about 0.7 s. The hero letters wait 0.3 s (`INTRO_HANDOFF`) so they rise as the bars open. Measured in Chrome: class on at 36 ms, counter at 100 by 441 ms, overlay gone at 1141 ms.
- LCP guard passed. Trace on the production build, cold cache: LCP 330 ms without the intro (`intro-seen` set) and 115 ms with it, because the overlay text is the first large paint. CLS 0.00 in both. The counter had a 0.0005 shift from changing digit widths; fixed with `tabular-nums` and a reserved width.
- Page transition: one capture-phase click listener on the document. Internal links to a different path or query cover the page with 5 bars (0.4 s), then `router.push`, then the bars open (0.5 s) when the pathname changes. Same-page hash links, other origins, new-tab clicks, modifier keys and downloads are left alone. Back and forward are native and show no bars.
- Checked: a click from the bottom of `/` to `/blogs` covers at 0.4 s, is on `/blogs` at scroll 0 by 0.7 s and open by 1.2 s. Back returns to `/` with no bars. The mobile menu links from `/projects` to `/#work`, the menu closes and the bars clear. Hash links on `/` scroll with no bars. With reduced motion or the pause toggle there is no intro and no bars.
- **Decision:** the mobile menu's open state is now tied to the pathname, so a route change closes it. The transition's capture listener stops the click before the menu's own `onClick={close}` would run.
- **Decision:** the page bars use `--site-ink` and the intro bars `--site-bg`, so the transition reads as a dark wipe in light mode and a light one in dark mode.
- **Decision:** the bug found in testing: the click listener lived in a `useGSAP` without `revertOnUpdate`, so it stayed registered after reduced motion switched on at hydration. Fixed.
- Playwright's headless window throttles `requestAnimationFrame` to about 1 fps here, so animation timings above come from the Chrome DevTools page, not Playwright.
- Not done here: a Lighthouse run (phase 11).

## Phase 11 (Cleanup + budget), done with one gap

- Removed `motion` and `lottie-react` (package.json and lockfile only; `pnpm-workspace.yaml` untouched), 16 unused `components/ui` files (animated-*, blur-fade, border-beam, hyper-text, lens, light-rays, line-shadow-text, magic-card, number-ticker, preload-splash, reveal, terminal, text-animate, gsap-reveal), the two preload providers, and the 6 `public/*.lottie` files.
- Bundle grep in `.next/static` for `react-three`, `three/`, `leva`, `r3f-perf`, `motion/react`, `framer-motion`, `lottie`, `maath`, `ogl`: no hits. (A plain `leva` search matches "elevation" and "relevance", which is not the package.)
- Lighthouse performance on the production build (CLI, lab, saved in `docs/qa/phase11/`): desktop 99 `/`, 99 `/projects`, 100 `/blogs`, 100 article, CLS 0, TBT 0 to 10 ms. Mobile (slow 4G, 4x CPU): `/blogs` 89, article 88, `/projects` 85, **`/` 84, one point under the 85 target**. Two repeat runs gave the same numbers.
- **The home mobile gap:** the real, observed LCP is about 100 ms; the 4.4 s is Lighthouse's throttled model charging about 240 KB of preloaded fonts and about 200 KB of JS to the first paint. Next steps if you want the point: drop the Mona Sans italic file (about 100 KB) or make the italic a separate non-preloaded family, which would lose the wide italic emphasis or need a swap; or trim GSAP plugins off the shared chunk.
- What helped, kept: the contact form and zod load on first open (home first load JS 283 kB to 215 kB; the form is warmed on hover or focus of the CTA), `Draggable` and `InertiaPlugin` register in `lib/gsap-drag.ts` and ship only with the home gallery (`/blogs` 205 to 190 kB), and the first project cover on `/projects` is `priority` (it was the lazy LCP image).
- Tried and reverted: `experimental.inlineCss` (no gain), `font-display: optional` (no gain), `preload: false` on the fonts (home 93 but projects 80 and blogs 84, so not a clear win).
- **Decision:** `lib/gsap-drag.ts` is a second GSAP registration file. CLAUDE.md says to register plugins once in `lib/gsap.ts`; this is a budget exception so the two drag plugins stay off the other routes.
- Accessibility (DevTools Lighthouse on `/`): 92 to 96, best practices 100, SEO 100, agentic browsing 50 to 100. Fixed: SplitText put `aria-label` on a `p` (now `aria: 'none'` on the hero intro and the experience bullets), and the logo's accessible name did not contain its visible text.
- **Decision (contrast):** Selected work no longer dims inactive rows with `opacity: 0.4` (1.5 to 2.5:1 at rest). Inactive titles are now the muted color, the active one mixes to accent, rows stay at opacity 1, and the row index uses the muted color instead of faint.
- **Still flagged by axe:** the 35 Statement words, which start at opacity 0.15 until the scrub lights them. That is the intended scrub-start state and reaches full contrast; with reduced motion or the pause toggle the words are at full contrast. If you want the audit clean, raise the start to about 0.5 in `statement-motion.tsx` and `site.css`.
- Not done: the full manual pass from plan section 9 (keyboard-only scroll, text selection and every route in both themes at 1440 and 390). I checked pieces of it per phase (reduced motion, pause, anchors, back button, both viewports, dark theme on a few sections) but not every route and theme combination.

## Final pass

- Statement copy now says "the interface and the mobile app" (React Native is on the resume). The TODO flag is gone, so the "final statement copy" item in Needs Rafi is only about wording preferences.
- CLAUDE.md notes the `lib/gsap-drag.ts` exception.
- **Tried and reverted:** unpreloading the Mona Sans italic (as its own family) and JetBrains Mono, keeping `display: swap` and the upright Mona preloaded. On a fresh production build, mobile Lighthouse got worse: home 82 to 83 (was 84), `/projects` 83 (was 85), `/blogs` 86 (was 89), and FCP went from 1.4 s to 2.3 s, because the browser finds the fonts later without the preload hints. Reverted to the previous font setup.
- Final numbers on the committed build, mobile: home 85 and 86 on two runs (earlier runs read 84, so this page sits at the 85 line and moves by a point between runs).

## Polish pass, done

- **Work hover:** one element. The hovered row's dock frame goes `position: fixed` (class `is-held`), travels to the cursor with `gsap.quickTo` (0.6 s, tilt from x velocity, max 4 degrees) and flies back on leave. The dock box gets `is-away` and shows its empty surface meanwhile. Row to row: the old frame fades out, the new one detaches. The box rect is read on enter and leave only; `pointermove` just feeds `quickTo`. Fine pointers at 768 px and up; touch keeps the static dock. Code: `features/home/work-follow.ts`. The old cursor card, `data-preview` and `lib/cloudinary.ts` are deleted.
- **Skills marquee:** two rows from the resume list (frontend and mobile, 8 items, moves left; backend, data and tools, 13 items, moves right). Each row eases to a stop on hover and focus (rows get `tabindex=0` only while motion is on). Transform only.
- **Pause control removed** from the header, mobile menu and work header, with `PauseMotion`, `paused` state and the localStorage key. `motionAllowed` is now just `!prefers-reduced-motion`. CLAUDE.md and plan.md updated.
- **Experience hover:** the tile fills with the accent (scaleY pseudo-element) and its text flips to `--site-accent-ink`; other tiles get a page-color veil at 65% (reads as 35% opacity). Veil instead of real opacity because GSAP's scrub writes inline opacity on the tiles. Contrast: light 5.35:1, dark 5.74:1. Hover devices only.
- **FitText** (`components/site/fit-text.tsx`): sets `--fit-w` (text width in em) after `document.fonts.ready` and on ResizeObserver; the size is CSS, `100cqw / --fit-w`, so resizes cost no script layout. Used for Say hello and a new footer wordmark. Measured widths equal container width at 1440 (1313) and 390 (335). The `fallback` prop is the measured em width so the reserved height is right before JS.
- **Decision:** the footer had no wordmark; I added a large "RAFI ferdos" (decorative, `aria-hidden`) above the link row. Easy to drop.
- Checked on a production build at 1440 and 390: no horizontal overflow, all rows and letters settle, screenshots at 0/25/50/75/100% in `docs/qa/polish/`. Marquee rows move in opposite directions and only the hovered row stops. Hover returns the frame and clears `is-held` and `is-away`.
- Lighthouse: desktop 99, CLS 0.002. Mobile home is bimodal on this machine: this build 93, 82, 81, 80, 81; untouched HEAD 96 and 80 (FCP 1.4 s or 2.7 s). The same CLS 0.002 shows on HEAD, so it is not from this pass.
- Not done: `pnpm lint` (pnpm.exe is blocked by Device Guard here and ESLint cannot find `@next/eslint-plugin-next` when run directly). `tsc --noEmit` and `next build` pass.

## Project detail pages (`/projects/[slug]`)

- **Nothing existed before:** only the `/projects` list, and rows linked out to `caseStudyUrl` or GitHub. Rows now link to `/projects/<slug>`; the old external links are shown on the page as Live, Source and Case study.
- **Reused, not added:** `subtitle` (tagline), `role`, `year`, `liveUrl`, `githubUrl`, `caseStudyUrl`, `outcomes` (shown as Results), `gallery`, `videoUrl`, cover width, height and blur.
- **Added (migration `20261114000000_project_slug`, additive only):** `slug` (nullable, unique), `client`, `overview`, `challenge`, `solution`. `slug` is nullable because the table already has rows; until the backfill runs, links and the page key fall back to the id.
- **Slugs:** made from the title in `insertRecord`/`updateRecord` (`-2`, `-3` on a clash). An explicit slug that is taken returns 409. An update with no slug keeps the current one, so a title edit never changes a URL. `prisma/scripts/backfill-slugs.ts` fills existing rows (dry run by default, `--apply` to write, only where slug is null).
- **Old id URLs:** `/projects/<id>` resolves by id and does a `permanentRedirect` to the slug.
- **Caching:** `getProjectByKey` checks the key against the cached list first (so 404 URLs cannot grow the cache), then reads through `unstable_cache` with tags `projects` and `project:<key>`. Dashboard saves call `revalidateTag('projects')`, `revalidateTag('project:<slug>')` and `revalidatePath('/projects/[slug]', 'page')`. `generateStaticParams`, `generateMetadata` (OG image from the cover, else `/og.png`), sitemap entries and `notFound()` are in.
- **Sections render only with data:** title and description always; tagline, meta row items, cover, video, Overview, Challenge, Solution, Results, gallery and Next project each appear only when their data exists. Next project needs 2 or more projects and wraps to the first.
- **Motion:** hero title slides up in its FitText clip box on load; small text plays once on enter; the cover scrubs a parallax; the Next title scrubs up. The gallery reuses `UpCloseMotion` (now `UpCloseView`), so Draggable only ships when a project has a gallery. All gated by `motionAllowed`.
- **Decision:** the title box has a fixed height (`--cap`) with the text on its bottom edge, so a title measured after fonts load cannot move anything below it. Long titles sit smaller with space above.
- **Decision:** no shared-element image transition from the dock. It needs the dock frame, the cover and `PageTransition`'s bars to agree on one rect across a route change, which is not cheap and risks CLS. The existing bar transition covers the navigation.
- **Dashboard:** project form gains slug (live `/projects/<slug>` preview, taken-slug warning, submit disabled on a clash), client, overview, challenge, solution, video URL and a gallery editor (multi-upload, alt text, caption, remove), plus a "View page" link when editing. The rest of the dashboard is untouched.
- **Not invented:** no copy was written for any project. Empty fields stay empty.
- **Verified so far:** `tsc` and `next build` pass; production build checked in Playwright at 1440 and 390 on two existing projects (no horizontal overflow). Screenshots in `docs/qa/project-detail/`.
- **Not done yet:** the migration is not applied to the database, so slugs are not live, and a project with overview, challenge, solution, gallery and video has not been checked on screen. Lighthouse comparison also waits on that. `pnpm lint` cannot run here (see the polish pass note).

## Final verification (2026-11-13)

- `qa-work` is gone. `20261114000000_project_slug` is applied; `slug` is **nullable** (plain `ADD COLUMN "slug" TEXT` plus a unique index), as planned.
- Slug backfill `--apply`: 3 of 3 rows updated (spotfix, ensinor, trendora). All three ids now answer 308 to `/projects/<slug>`, the slugs answer 200, an unknown key 404s. The build lists the slug URLs in `generateStaticParams`.
- **Gotcha:** the script writes straight to the DB and does not call `revalidateTag`, so the first build after it still used the cached list (id URLs) until `.next/cache/fetch-cache` was cleared. The script now prints a reminder. On the live site, save a project in the dashboard or redeploy after running it.
- `pnpm lint` 0 errors (19 warnings, all in dashboard `components/ui`), `tsc --noEmit` and `pnpm build` pass.
- Lighthouse performance on the production build (saved in `docs/qa/final/`): desktop home 100, `/projects` 100, `/projects/spotfix` 100, CLS 0. Mobile home 99 (LCP 1.4 s), `/projects` 85, project page 86 (LCP 4.3 to 4.4 s, the same throttled font and JS charge as before). Earlier notes: home mobile 80 to 86, `/projects` 85, so nothing regressed; home read high this run because of the machine's bimodal FCP.
- Selected Work hover: one frame visible, the held one (`position: fixed`, `is-held`); the other two are hidden or at opacity 0.
- Experience hover: the accent fill covers the whole tile (436 x 420 of 437 x 422), text flips to the dark ink.
- **Open: hero name does not span the width.** The hero is two stacked lines sized by `clamp(6rem, 18vw, 17rem)`. Widest line vs container: 1440 px 674 of 1313 (indented), 1024 px 479 of 929, 390 px 250 of 335. Only Say hello and the footer wordmark use `FitText`. Fitting "FERDOS" to the width needs about 30vw type and two lines would not fit a 900 px viewport, so this is a layout choice, not a quick fix.

## Hero name fitted to the width

- At 768 px and up the name is one line, "RAFI FERDOS", in a `FitText`. Below 768 px it is two stacked lines, each in its own `FitText`. Both renderings are in the server HTML (`data-hero-name="wide"` / `"narrow"`, one hidden by CSS, both `aria-hidden`; the `h1` keeps its `sr-only` name). `HeroMotion` picks the visible one through a `(min-width: 768px)` condition in `gsap.matchMedia`, so crossing the breakpoint re-runs the reveal on the other one.
- Measured widest line vs container (production build): 1440 px 1313/1313, 1024 px 929/929, 768 px 693/693, 390 px 335/335 for both lines. All 100%, no horizontal overflow. Screenshots in `docs/qa/final/hero-fit-*.png`.
- `FitText` now also observes the text, because SplitText drops kerning between letters and changes its width after the first measure. Fallbacks (4.31, 1.54, 2.6 em) are the measured values, so the reserved height does not jump.
- Lighthouse home, two runs each: desktop 100 and 100, mobile 99 and 99. CLS 0, LCP 0.3 to 0.4 s desktop and 1.4 s mobile, unchanged.
- Kinetic stretch still works on the one line (6 letters up to 1.53x under the pointer). The line is clipped by its `FitText` box, so letters pushed past the right edge are cut instead of overflowing the page.
- **No portrait in the hero:** the hero is text only. `components/ui/pixel-image.tsx` is not used on any page, so there was nothing to hand off to or move.
- The `package.json` change in the working tree is only a `packageManager` field that pnpm 12.18.0 added; the `pnpm-lock.yaml` change is an extra document for pnpm's own self-management entry. No dependency changed, so neither is committed.

## Fixing phase (plan in `docs/fixing-plan.md`)

Part 1: items 6, 7, 1, 2, 3. Playwright screenshots in `docs/qa/fixing/<item>/` (gitignored). Layout checks ran on the dev server (`next dev`); animation timing needs the Chrome DevTools page, because headless Playwright throttles rAF.

### Item 6: footer wordmark removed
- The big "RAFI ferdos" in the footer is gone on every page. The footer is the link row plus a small "©{year}". No name, no title there (Rafi's call).
- Contact itself never had a name under "Say hello"; the footer wordmark was the text under it.

### Item 7: "Full Stack AI Engineer"
- One source: `profile.jobTitle` in `lib/site.ts`. Read by the hero label, JSON-LD, manifest, root layout (title, description, Open Graph, Twitter, image alt) and the home page metadata.
- Home `<title>` is now `Rafi Ferdos, Full Stack AI Engineer` (it used to get the site name appended twice; the page title is `absolute`).
- Left as is on purpose: ZenDevz "Full Stack Developer" in Experience (the resume's own wording for that role).
- CLAUDE.md and `docs/design-brief.md` positioning lines updated, so the next session does not revert it.
- Header has no title text, and the footer must not have one, so the title shows in the hero label row and in the metadata.

### Item 1: hero name as a staircase
- At 768 px and up the name is two lines in one `FitText` (`lines={['Rafi', 'Ferdos']}`). Both lines have the same font size, FERDOS starts where RAFI ends (an inline `margin-left` of the widths above it, in em), and the pair spans the container. RAFI is 37% and FERDOS 63% of the width. Below 768 px it is two stacked lines, each fitted on its own: RAFI 217 px and FERDOS 129 px at 390, where a staircase would have been about 80 px.
- `FitText` now measures every line and writes `--fit-w1..n` and their sum `--fit-w`; the size is still pure CSS (`100cqw / --fit-w`). Single-line uses (Say hello, project titles) are unchanged.
- Measured (dev server, boxes): 1440 px: RAFI 56 to 545, FERDOS 545 to 1369, container 56 to 1369, font 317 px. 1024 px: RAFI 40 to 386, FERDOS 386 to 969, container 40 to 969, font 224 px. 768 px: container 30 to 723, FERDOS ends 723.5 (0.4 px of kerning drift, clipped by the box). 390 px: both lines 20 to 355. Gaps between the lines and at the right edge are under 0.5 px. No horizontal overflow at any width. Hero height equals the viewport at 1440x900, 1024x768 and 390x844 and the intro text ends above the fold.
- Screenshots: `docs/qa/fixing/item-1/hero-{1440,1024,390}.png`.
- **No portrait exists:** the hero is text only and `rafi.png` appears only in the JSON-LD, so there was no portrait or scroll handoff to keep or move. The scroll "leave" scrub still moves line 1 up 12vh and line 2 up 4vh, which gives the staircase a small parallax.
- Not re-measured here: CLS and Lighthouse for this change (the final pass of part 2 does it on a production build).

### Item 2: kinetic stretch stays inside its box
- One file, `features/motion/kinetic-letters.ts`, used by the hero name and Say hello (the only two users; the footer wordmark is gone). Each frame, per line, the eased letter scales are multiplied by `k = (unstretched line width) / (stretched line width)`. The line keeps its width, the letters near the pointer grow, the others shrink, and the first and last edges cannot move. Hover on the left pushes letters right and nothing crosses the left edge; the right side mirrors it.
- Widths now come from sub-pixel rects with the applied scale divided out (offsetWidth rounds, and the rounding errors would add up to a pixel or two at the last edge). They are read in `measure()` only (on split and on ScrollTrigger refresh). The pointer handler still only stores two numbers.
- Also fixed: the stretch now retargets while the page scrolls under a still pointer (`onUpdate: markDirty` on the in-view trigger). Before, letters kept their old stretch until the mouse moved.
- `MAX_SCALE` 1.55 to 1.8, because the normalisation gives part of the stretch back. Result: the nearest letter grows 22 to 46%, the far ones shrink to about 0.85.
- Measured in Chrome DevTools (real 60 fps; headless Playwright throttles rAF), synthetic pointermoves, 1.3 s settle each. Edge movement of the first and last letter of every line, vs rest: **0.00 px** at 1440 (hero lines 1 and 2, Say hello: pointer on first letter, last letter, middle, and at x = 2 and x = innerWidth - 2 for the hero), 1024 (all four hero spots, Say hello: 0.00 and -0.03 px) and 500 (the narrowest this browser window gets; narrow layout, both lines and Say hello: 0.00). `scrollWidth === clientWidth` after every move. Screenshot: `docs/qa/fixing/item-2/hero-hover-right-1440.png`.
- Not measured: 390 px exactly (the DevTools window will not go under 500), and touch (kinetic is fine pointers only, so nothing runs there).

### Item 3: skills
- Two rows, different skills, opposite directions, pause on hover (all unchanged mechanics), reordered so the advanced skills open each row:
  - Row 1, "Frontend, mobile and AI" (moves left): AI and RAG, Next.js, TypeScript, React Native, React, Expo, Redux, Tailwind CSS, JavaScript (ES6+), Code review.
  - Row 2, "Backend, cloud and testing" (moves right): AWS, Docker, CI/CD, GraphQL, Node.js, PostgreSQL, Playwright, Jest, Socket.IO, Real-time systems, Prisma ORM, Express.js, REST APIs, MongoDB, Mongoose, Firebase, Git.
- Both tracks start at x = 0, so the first items are on screen before the marquee moves. Fully visible at rest (before the track moves): 1440 and 1024 px: row 1 AI and RAG, Next.js, TypeScript (React Native cut off); row 2 AWS, Docker, CI/CD, GraphQL (Node.js cut off). 390 px: row 1 AI and RAG (Next.js partly); row 2 AWS, Docker.
- Measured in Chrome DevTools: row 1 moves at -40 px/s, row 2 at +40 px/s; hovering row 1 stops it (0 px/s) while row 2 keeps going (40 px/s) and row 1 resumes at -40 px/s after the pointer leaves. No horizontal overflow.
- A gotcha while testing: after a hot reload the marquee effect was dead (no `tabindex` on the rows) until a full reload. Not a code bug; it did not happen after a clean load.
- Screenshots: `docs/qa/fixing/item-3/skills-{1440,390}.png` (the 1440 one is mid-scroll, so it shows later items).
- The extra skills are listed under "Needs Rafi: confirm" at the top of this file.

### Item 4: Selected Work preview
- Dock: the box is 4:5, `min(100%, 48vh)` wide and pinned to the right of its column. Its right edge equals the container edge: 1369 at 1440 and 969.06 at 1024 (the hero container's right edge, scrollbar included in the viewport).
- Stuck image: `work-follow.ts` keeps the last pointer position, caches row bands in page space (measured on init and on ScrollTrigger refresh), and re-checks the held row from a ScrollTrigger `onUpdate` at most every 100 ms. It releases when the pointer is no longer over a row, and on window blur and tab hidden. Check at 1440: hovered row 1 (held), scrolled with the wheel without moving the mouse, `.is-held` count 0 afterwards.
- Click-through: links with `data-transition-title` (project rows on `/` and `/projects`, Next project) wipe a page-colored panel and raise the destination title in the `.fit` clip, then push. `ProjectMotion` skips its own slide when `html[data-arrival="title"]` is set. `titleClass` and `fitFallback` moved to `features/projects/title-style.ts` so the overlay and the page share them. The overlay title stays up until the panel has left, so the page title under it is never hidden.
- Measured (Playwright, headed Chromium, production build): overlay title rect vs page title rect, 0 px difference in left, top, width and height at 1440 and 390. Click to new route 0.63 s, overlay gone about 1.1 s after the click (the plan said under 1 s; the extra 0.1 s is the two-frame wait plus the panel wipe). With reduced motion the click is a plain navigation (40 ms, no overlay). Back and forward are native and never show it.
- Tooling note: the Chrome DevTools and Playwright MCP browsers were locked by another process this run, so checks used a standalone Playwright script with the installed Chromium (headed, so rAF runs at full rate).

### Item 5: navbar, wordmark chip, generated OG image
- One axis: nav `ul` is `flex items-center`, the nav links are `block`, the pill wrapper is `inline-flex items-center`, and a `.nav-trim` class (`text-box: trim-both cap alphabetic`, also on the roll copies) makes each item's box its cap box. Measured (production build, headed Chromium) as cap-ink centre minus bar centre: every nav item, the theme toggle, "Get in touch", the wordmark and the mobile "(Menu)" are within 0.22 px at 1440, 1280 and 390. The pill label centre equals the pill centre (31.99 both). Screenshots: `docs/qa/fixing/item-5/header-*.png`. Firefox ignores `text-box`, so it keeps the strut-free layout (sub-pixel to 2 px off).
- Wordmark: `RAFI` plus an accent chip on the italic `f` plus `erdos`. The accessible name is "Rafi Ferdos, home".
- OG image: `public/og.png` is deleted. `app/opengraph-image.tsx` (ImageResponse, 1200x630) draws "RAFI", the accent chip on the f, "erdos", the title and the domain. Mona Sans is a variable width font that satori cannot load, so it uses Next's default font and the italic f is a skewed upright f. Every `og.png` reference is gone. Pages that set their own `openGraph` must list the image, so `OG_IMAGE` lives in `lib/site.ts`. Checked: `/`, `/projects` and `/blogs` emit `og:image` and `twitter:image` as `https://rafiferdos.vercel.app/opengraph-image`; a project with a cover keeps its cover.
- Kinetic stretch at exactly 390 px (the window's inner width, scrollbar included, so the layout width is 375): first and last letter edges move 0.00 to 0.03 px for both hero lines and Say hello with the pointer at 2%, 50% and 98% of each line, no horizontal overflow. The stretch itself runs (line 2 letter widths 47,48,60,62,62,56 at rest to 36,42,70,81,61,44 with the pointer in the middle). This closes the "not measured at 390" note under item 2.

### Item 9: /services
- New static route `app/(site)/services/page.tsx`: label row, fitted "Services" title in the project title box, one statement, six numbered cards (`features/services/services-grid.tsx`, the Experience tile markup and hover fill), four process steps (`process.tsx`), then the existing Say hello contact section. No prices, no database read. Metadata, canonical, Open Graph and an `ItemList` of `Service` JSON-LD (provider is the Person). Sitemap, header nav (second item, six items), footer link.
- Services (`data/services.ts`, shared by the page and the form): Web apps, Backends and APIs, Mobile apps, Ecommerce, AI features, Performance and SEO. Stacks are from the resume plus the confirmed AI and RAG and AWS. The AI card describes a service ("a RAG chatbot over your own data"), not a shipped project. The performance card says this site is the example and to run Lighthouse on it, with no numbers. The label row says "Dhaka, BD" instead of "Available for new projects", because availability is not in the resume.
- Motion reuse: `ProjectMotion` became `features/motion/page-motion.tsx` (`PageMotion`, `[data-page-title]`). `ExperienceMotion` takes `labelledBy` and scrubs each tile alone, starting a bit later per column, so one row (home) and two rows (services) both work.
- Contact: the form has a Topic select (the six services and "Something else") that sets the subject (`Project enquiry: <title>`; "Something else" keeps the old subject). `/services?service=ai` opens the form on that topic, and a card link (`a[data-service]`) does the same through one delegated listener in `ContactCta`. The header pill (`CtaPill`, now a client component) scrolls to `#contact` on `/` and `/services` and goes to `/#contact` elsewhere.
- Checked (production build, headed Chromium): screenshots at 0/10/25/40/55/70/85/100 percent at 1440, 1024 and 390 in `docs/qa/fixing/item-9/`; no horizontal overflow at any width; hover fills the card (`::before` scaleY 1) and the siblings get the 0.65 veil; `?service=ai#contact` opens the form with "AI features" selected; clicking the Mobile card opens it with "Mobile apps" and scrolls to the contact section; with reduced motion nothing is hidden (0 hidden items, no `js-motion`); the 1280 header has no overlap (time ends 298, nav 319 to 946, toggle from 1004).
- Lighthouse `/services` (saved in `docs/qa/final/`): desktop performance 98, accessibility 100, best practices 100, SEO 100, CLS 0, LCP 1.1 s. Mobile performance 81 (LCP 4.7 s, one run), accessibility 96, CLS 0. The mobile score is below the other pages because the large statement is a `data-reveal` text that waits for JS, the same cause as the project page (86). The accessibility 96 is contrast measured on scroll-scrubbed tiles that are still mid-fade; the home page shows the same effect on its Statement words (desktop accessibility 96). Fixed on the way: the wordmark's visible text now matches its accessible name.

### Item 8: copy rewrite
- Old and new lines are in `docs/copy.md` (hero intro, Statement, Experience bullets, contact heading and form messages, archive empty states, meta descriptions, and all `/services` text).
- Facts only from `docs/resume.md`. "Production AI" is gone from the writing Open Graph text because it read as shipped AI work. No Webbly Media in any copy.
- Grep over `app`, `features`, `components/site`, `data/services.ts` and `lib` for em dashes and the banned words (leveraged, robust, passionate, seamless, cutting-edge, innovative, solutions, elevate): no hits in site copy. The only mention of Webbly is the existing code comment in `experience.tsx`.
- The new Statement still fits its sticky viewport: text ends at 665 of 900 at 1440 and 659 of 844 at 390 (`docs/qa/fixing/item-8/statement-*.png`).
- `data/site-content.ts` still has old seed articles with em dashes. Nothing imports them, so no route shows them.

### Fixing phase: final pass
- Screenshots (0, 10, 25, 55, 85 and 100 percent) of `/`, `/projects` and `/projects/spotfix` at 1440, 1024 and 390 in `docs/qa/final/pass-*.png` (gitignored), `/services` in `docs/qa/fixing/item-9/`. No horizontal overflow on any of them.
- Scroll on home at 1440 (headed Chromium, wheel scroll through the whole page): 320 frames, median 10 ms, 95th percentile 10.7 ms, worst 19 ms, none over 33 ms, one 53 ms long task, CLS 0.
- Lighthouse (standalone Lighthouse 13.6 against the production build, `docs/qa/final/lh-f-*.json`; mobile run twice):

| Page | Desktop perf | Mobile perf (2 runs) | Previous (this file) |
|---|---|---|---|
| `/` | 100 | 98, 98 | desktop 99 to 100, mobile 99 |
| `/projects` | 100 | 83, 83 | desktop 100, mobile 85 |
| `/projects/spotfix` | 98 to 99 | 81, 81 | desktop 100, mobile 86 |
| `/services` (new) | 98 | 79, 78 | none |

  CLS 0 everywhere. Accessibility 96 to 100, best practices 100, SEO 100. The project page desktop LCP is 1.0 s (was 0.8 s) and the cover image is the LCP element, which this phase did not change; I could not rebuild the old commit to compare on the same run (Turbopack rejects a linked `node_modules`). Mobile scores here read lower than the earlier notes on three pages, and the earlier ones came from a different Lighthouse runner on the same machine, so treat the 3 to 5 point gap as unconfirmed until it is run the same way.
- Gate on the final tree: `pnpm lint` 0 errors (19 warnings in dashboard `components/ui`), `pnpm exec tsc --noEmit` clean, `pnpm build` passes.
- The Chrome DevTools performance trace was not possible this run (MCP browser locked), so smoothness is the frame-gap measure above.
