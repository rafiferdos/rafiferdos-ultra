# Rafi Ferdos — portfolio studio

A Next.js portfolio with one-time viewport reveals, filterable project and writing archives, PlateJS rich articles, PostgreSQL content, Cloudinary media uploads, contact enquiries and a private dashboard at `/dashboard/rafi`.

The public pages stay server-rendered for SEO. Client-side dashboard reads and mutations use TanStack Query over a typed Axios client, with Zod validation at the API boundary. shadcn/ui provides the accessible form, filter, dialog, command and feedback primitives without replacing the portfolio theme.

## Local setup

1. Copy `.env.example` to `.env` and replace every required placeholder. Next.js also supports `.env.local`, but Prisma CLI reliably loads `.env` through `prisma.config.ts`.
2. Install dependencies with `pnpm install`.
3. Generate the client with `pnpm db:generate`.
4. Apply the checked-in PostgreSQL migrations with `pnpm db:deploy`. Use `pnpm db:migrate` only while authoring a new migration; for a disposable local database, `pnpm db:push` is also available.
5. Start the site with `pnpm dev`.

The first successful dashboard login uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` to create one bcrypt-hashed `Admin` row. After that, authentication reads the database account. Keep the bootstrap password and `ADMIN_SESSION_SECRET` private and rotate them if they are ever exposed.

## Environment responsibilities

- `DATABASE_URL`: pooled PostgreSQL runtime connection. Required for content, enquiries and DB login.
- `DIRECT_URL`: optional for Prisma Postgres—the config derives `db.prisma.io` from its pooled hostname. Add the real direct URL for Neon, Supabase or another pooler.
- `ADMIN_*`: dashboard bootstrap identity and signed-session secret.
- `CLOUDINARY_*`: required only for dashboard image uploads. The database stores returned image URLs, not image binaries.
- `RESEND_API_KEY`: sends a copy of every stored contact enquiry to email.
- `CONTACT_FROM_EMAIL`: a sender on a domain verified in Resend.
- `CONTACT_NOTIFICATION_TO`: notification recipient; defaults to `rafiferdos@gmail.com`.
- `NEXT_PUBLIC_SITE_URL`: production canonical origin used by metadata, robots and sitemap.
- Search verification tokens: optional, but useful when connecting Google Search Console and Bing Webmaster Tools.

Without `DATABASE_URL`, project and article collections remain empty. Dashboard writes and contact persistence are disabled.

The legacy copy remains in `data/site-content.ts` only as a manual import backup; public pages never render it. Empty or unavailable databases therefore show no project/article records.

## Publishing articles and projects

The article studio uses PlateJS structured JSON. It supports headings, inline marks, highlights, links, ordered/bulleted/task lists, tables and syntax-highlighted code blocks. A plain-text projection is stored alongside the structured document for excerpts, search and backward compatibility.

Project and article technology fields use a searchable, creatable catalog with 500+ curated technologies. New custom values can be added directly from the command menu.

The home page still limits featured projects and articles to three. Use the `Featured` control in Studio to choose the candidates; public archives expose the complete published collection and richer filters.

Contact submissions are stored before email delivery is attempted. Delivery state and any Resend error are visible beside the message in Studio, so an email-provider failure never loses the enquiry.

## Search launch checklist

After deployment, submit `/sitemap.xml` in Google Search Console, request indexing for the homepage, project archive and strongest articles, and validate JSON-LD with Google Rich Results Test. Technical SEO makes the pages understandable and indexable; ranking still depends on useful content, competition, reputation and relevant links.
