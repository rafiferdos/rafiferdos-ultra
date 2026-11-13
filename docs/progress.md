# Progress

Branch `redesign`. Newest phase last. Decisions made without asking are marked **Decision**.

## Needs Rafi (placeholders in the site until these exist)

- Featured projects and their sort order (dashboard). Until then the home list shows the first 6 projects if none are marked featured.
- Cover images in a 4:5 ratio for each project. Today's covers are about 2:1 screenshots, so the dock crops them to the middle. A project without a cover shows a `(Cover pending)` frame.
- Gallery images for "Up close" (phase 6). Until a project has gallery items the section stays hidden.
- Webbly Media role title and dates (phase 7). Left out of Experience until then.
- Final statement copy for the About section (phase 7). The draft from plan §2.5 is used and marked.
- Cover blur for any project edited in the dashboard after 2026-11-13: new uploads clear the blur. Re-run `node prisma/scripts/backfill-media.ts` (dry run), then `--apply` after review.

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
