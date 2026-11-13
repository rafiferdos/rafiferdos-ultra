// Fills Project.slug from each title. Dry run by default (reads only). Pass --apply to write.
// It only touches rows whose slug is still null and never changes an existing slug.
//   node prisma/scripts/backfill-slugs.ts
//   node prisma/scripts/backfill-slugs.ts --apply
import 'dotenv/config'
import pg from 'pg'

const apply = process.argv.includes('--apply')
const connectionString = (process.env.DATABASE_URL ?? '').replace(
  /([?&])sslmode=(?:prefer|require|verify-ca)(?=&|$)/,
  '$1sslmode=verify-full'
)
if (!connectionString) throw new Error('DATABASE_URL is not configured')

// Keep in step with lib/slug.ts (a script run by plain node cannot use the @/ alias).
const slugify = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '')

const client = new pg.Client({ connectionString })
await client.connect()
console.log(
  apply
    ? 'APPLY: writing to slug only, where it is null'
    : 'DRY RUN: no writes (pass --apply to write)'
)

try {
  const { rows } = await client.query<{ id: string; title: string; slug: string | null }>(
    `SELECT id, title, slug FROM "Project" ORDER BY "sortOrder", "createdAt"`
  )
  const taken = new Set(rows.flatMap((row) => (row.slug ? [row.slug] : [])))
  let planned = 0
  for (const row of rows) {
    if (row.slug) {
      console.log(`skip   ${row.title}: already ${row.slug}`)
      continue
    }
    const base = slugify(row.title) || 'project'
    let slug = base
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`
    taken.add(slug)
    planned++
    console.log(`${apply ? 'update' : 'plan  '} ${row.title}: ${slug}`)
    if (apply)
      await client.query(`UPDATE "Project" SET slug = $1 WHERE id = $2 AND slug IS NULL`, [slug, row.id])
  }
  console.log(`${apply ? 'updated' : 'would update'} ${planned} of ${rows.length}`)
  // This script bypasses revalidateTag, so a running site keeps serving the cached project list.
  if (apply && planned) console.log('Now save any project in the dashboard (or redeploy) so the cache refreshes.')
} finally {
  await client.end()
}
