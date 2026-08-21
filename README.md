# Rafi Ferdos — portfolio studio

A Next.js portfolio with one-time viewport reveals, filterable project and writing archives, Markdown-style code articles, PostgreSQL content, Cloudinary media uploads, contact enquiries and a private dashboard at `/dashboard/rafi`.

## Local setup

1. Copy `.env.example` to `.env.local` and replace every required placeholder.
2. Install dependencies with `pnpm install`.
3. Generate the client with `pnpm db:generate`.
4. Create/update the PostgreSQL tables with `pnpm db:push` (quick setup) or `pnpm db:migrate` (versioned migrations).
5. Start the site with `pnpm dev`.

The first successful dashboard login uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` to create one bcrypt-hashed `Admin` row. After that, authentication reads the database account. Keep the bootstrap password and `ADMIN_SESSION_SECRET` private and rotate them if they are ever exposed.

## Environment responsibilities

- `DATABASE_URL`: pooled PostgreSQL runtime connection. Required for content, enquiries and DB login.
- `DIRECT_URL`: direct PostgreSQL connection used by Prisma CLI. Recommended for Neon, Supabase Postgres and other poolers.
- `ADMIN_*`: dashboard bootstrap identity and signed-session secret.
- `CLOUDINARY_*`: required only for dashboard image uploads. The database stores returned image URLs, not image binaries.
- `NEXT_PUBLIC_SITE_URL`: production canonical origin used by metadata, robots and sitemap.
- Search verification tokens: optional, but useful when connecting Google Search Console and Bing Webmaster Tools.

Without `DATABASE_URL`, the public portfolio intentionally falls back to the checked-in sample projects and articles. Dashboard writes and contact persistence remain disabled.

## Publishing articles

The dashboard editor supports paragraphs separated by blank lines, `##`/`###` headings and fenced code blocks such as:

````md
```ts
const product = await ship({ quality: 'production' })
```
````

Code is rendered as escaped text, so article content cannot inject executable HTML.

## Search launch checklist

After deployment, submit `/sitemap.xml` in Google Search Console, request indexing for the homepage, project archive and strongest articles, and validate JSON-LD with Google Rich Results Test. Technical SEO makes the pages understandable and indexable; ranking still depends on useful content, competition, reputation and relevant links.
