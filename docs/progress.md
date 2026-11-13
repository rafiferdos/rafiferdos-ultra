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
