# Design brief: rafiferdos-ultra

Status: first draft written before the reference analysis. Opus fills the "To be filled after analysis" part and may challenge anything here.

## Goal

A portfolio that feels like a world-class developer site: typography does the talking, motion is the main feature, and it stays fast. The site is shown to clients and employers, so it must also be readable, accessible and quick on a mid-range phone.

## Direction

- Monochrome base: black, white, a few greys. No decorative imagery. Project media is the only picture content.
- One accent color, used sparingly for hover states, links, active states and small highlights. It is not for body text or large fills. The reference uses a light blue for this. We do not: no blue or cyan. Default candidate is a vermilion / orange-red (around #FF4A1C). Opus must check contrast in both themes and may adjust the exact value per theme or propose a better option with reasons.
- Light and dark themes both ship (next-themes is already in the project). The reference has no theme switch, so both themes are designed by us: tokens for each, an accessible toggle, no flash on load, accent checked for contrast in both.
- Typography-led. One strong type system (max 2 families), big scale contrast, tight and deliberate spacing.
- Text animation is the hero feature: line, word and character mask reveals, scroll-scrubbed scale and weight, marquees, hover effects on links and nav.
- Scroll choreography at page level, not independent fade-ins. As the user scrolls, one scene finishes and the next one takes over (pinned sections, clip-path wipes, parallax layers, a drag gallery for projects). Everything reads from the same scroll progress.
- Smooth scroll through Lenis, synced with GSAP ScrollTrigger.
- WebGL is optional. Default is none. Keep it only for one effect that CSS and GSAP cannot do, and justify it in the plan.

## Reference (mechanics only, not a layout to copy)

Reference: https://mikewilcockdesign.com/ (listed on Awwwards).
Observed from a static read of the page. Motion itself is not verified yet, so Playwright must scroll the real site.

- Small structural details: numbered menu (01 to 05), parenthetical labels like "(Hello)", arrows used as markers, bracketed numbers.
- Hero is name plus a short intro and a "See the work" link, with a "Scroll, gently" cue under it.
- Selected work is a numbered list; each item shows year and category.
- A gallery section labelled "Drag or scroll".
- A visible "Pause motion" control above the work section. Borrow this idea: it is good accessibility and good manners.
- Built with Next.js on Vercel. No sign of WebGL in the page content.

How close to follow it: Rafi wants the overall experience to feel very close to the reference. Match its structure, pacing, scroll choreography and motion feel closely.
Adapt to Rafi where the reference was built around its owner: his own content (docs/resume.md, projects and articles from the database), his sections, his hero concept.
What must differ: the accent color (see above), light and dark themes, copy, wordmark, type choices where the reference's font is licensed, and every asset.
Never copy their code, images, text or branding. Re-implement every effect from scratch in our stack.

## Content

All personal and career content comes from docs/resume.md. Projects and articles come from the database.
Planned sections (Opus may reorder): hero, selected work (from DB), experience, skills, about, contact.
Routes that already exist must keep working and get the same design language: project archive, article archive, article pages, contact form (Resend), metadata, sitemap, JSON-LD. The dashboard at /dashboard/rafi is not redesigned.
Positioning: Full Stack AI Engineer (set by Rafi, 2026-11-13). Never a beginner.

## Constraints

- Follow the performance budget and motion rules in CLAUDE.md.
- Text must be in the server-rendered HTML and readable before any JavaScript animation runs.
- `prefers-reduced-motion` and a visible pause control must disable scrub, pinning and heavy effects.
- Mobile gets a lighter version of the same design, not a different design.
- Copy: simple natural English, no buzzwords, no em dashes.

## To be filled after analysis

- Final accent color and the light and dark token sets
- Type choice and scale
- Section-by-section scroll timeline
- Signature moment (one idea that people remember), with or without WebGL
- Reveal and easing language (durations, eases, stagger rules)
- What exactly is borrowed from the reference, and what is replaced
