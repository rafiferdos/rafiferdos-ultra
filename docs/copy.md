# Copy rewrite (fixing phase, item 8)

Voice: short sentences, concrete facts, a point of view. Every fact comes from `docs/resume.md`. The confirmed skills AI and RAG, AWS, Jest and Playwright are named as skills and as a service Rafi offers, never as shipped work. No durations, counts or claims outside the resume. Webbly Media is not named anywhere. No em dashes.

## Hero (`features/home/hero.tsx`)

| Old | New |
|---|---|
| I build web and mobile apps end to end, from the database to the interface. 3+ years of shipping with React, Next.js, Node.js and React Native. | I build web and mobile products from the database to the last pixel. 3+ years of shipping, for product teams and clients abroad. |

Kept: "See the work →", "(Scroll, gently)", the label row (title from `profile.jobTitle`).

## Statement (`features/home/statement.tsx`)

| Old | New |
|---|---|
| I'm Rafi. I build the *whole thing*: the API, the database, the interface and the *mobile app*. Lately that means real-time chat with Socket.IO, moving clients from REST to GraphQL, and **two ecommerce apps in React Native.** | Most products are built in pieces, by people who never meet. I build *all of it*: the database, the API, the screen in your hand. One person. One standard. **End to end.** |

The real-time, GraphQL and ecommerce facts moved to Experience, where they have dates.

## Experience (`features/home/experience.tsx`)

| Role | Old | New |
|---|---|---|
| Sparktech | Expanded from frontend to full-stack within 3 months and React Native within 7, delivering 2 production ecommerce mobile applications end to end. | Joined on the frontend. Full stack within 3 months, React Native within 7. Two ecommerce apps, shipped start to finish. |
| Sparktech | Migrated client data integrations from REST to GraphQL, reducing unnecessary data fetching and simplifying frontend state management across multiple products. | Moved client data from REST to GraphQL, so the apps fetch less and the frontend state is simpler. |
| Sparktech | (not shown) | Built real-time chat and notifications with Socket.IO. |
| ZenDevz | Built and deployed the agency's official portfolio with Next.js, Prisma, and PostgreSQL to support client acquisition. | Built and deployed the agency's own portfolio on Next.js, Prisma and PostgreSQL. |
| ZenDevz | Conducted 35+ code reviews as the team's technical lead, maintaining standards across a small team and preventing regressions before production. | Led international client projects end to end, and did 35+ code reviews as technical lead. |
| DIU Robotics Club | Owned the club website after promotion, shipping new features, resolving bugs, and maintaining the site with a dedicated web team. | Promoted within 8 months, then owned the club website with a dedicated web team. |
| DIU Robotics Club | Built a custom event registration system that replaced manual coordination and streamlined attendee registration for club events. | Built the event registration system that replaced manual coordination. |

The code comment in the file now says "reworded shorter" instead of "word for word".

## Contact (`features/home/contact.tsx`, `contact-form.tsx`)

| Where | Old | New |
|---|---|---|
| Heading | Got something in mind? | Have something to build? |
| Name error | Enter your name, 2 characters or more. | Your name, please. 2 characters or more. |
| Message error | Write at least 10 characters. | A few more words, please. 10 characters or more. |
| Button, sending | Sending... | Sending |
| Sent | Message received. I will get back to you soon. | Got it. I will reply by email. |
| Form error summary | Please fix the highlighted fields. | Check the highlighted fields. |
| Topic select | (new) | Topic: the six services and "Something else" |

Kept: "(Click to write)", "Say hello", the labels Name, Email, Message, and the failure line "You can also email me directly."

## Archives and metadata

| Where | Old | New |
|---|---|---|
| `project-archive.tsx` empty | (No projects yet) / (No matches) | (Case studies are on the way) / (Nothing matches that) |
| `writing-archive.tsx` empty | (No articles yet) / (No matches) | (Nothing published yet) / (Nothing matches that) |
| `app/(site)/page.tsx` description | Rafi Ferdos is a Full Stack AI Engineer with 3+ years building production web and mobile applications, including international client work. | Rafi Ferdos is a Full Stack AI Engineer. Web and mobile products built end to end, with 3+ years in production and international client work. |
| `app/(site)/blogs/page.tsx` description | Practical notes that show how Rafi Ferdos approaches full-stack, mobile, realtime and AI product engineering. | Notes from building web, mobile and real-time products, by Rafi Ferdos. |
| `app/(site)/blogs/page.tsx` Open Graph | Practical notes on Next.js, backend systems, mobile, realtime and production AI. | Notes on Next.js, backend systems, mobile apps and real-time features. |
| `app/(site)/projects/page.tsx` description | Explore Rafi Ferdos’s frontend, backend, full-stack and mobile work by discipline, context and technology. | Projects by Rafi Ferdos: what each one is, what I did on it, and the stack. |
| `app/(site)/projects/page.tsx` Open Graph | Full-stack, frontend, backend and mobile product engineering work. | Web, backend and mobile projects, and my part in each. |

"Production AI" was removed from the writing Open Graph text: it read as shipped AI work.

## `/services` (all new)

Title "Services". Statement: "One person builds all of it: the database, the API, the app in your hand." Cards, deliverables and stacks are in `data/services.ts`. Process: Talk ("We agree what you need and who it is for."), Plan ("I own the requirements and the architecture decisions."), Build ("Frontend, backend and mobile from one person, with code review before it ships."), Launch ("I deploy it and own the release."). Labels: "(What I build)", "(How it goes)", "Deliverables", "Start a project like this →".

## Not changed on purpose

"Selected work", "(Experience)", "(Writing)", "All writing", "All projects", "(Up close)", "(Gallery)", "(Hello)", "Case studies are being written up." (honest empty state), the footer link row, and the project page labels. They are short labels, already plain.

## Left alone, not on the site

`data/site-content.ts` holds old seed projects and articles with em dashes. Nothing imports them, so no public route shows them.
