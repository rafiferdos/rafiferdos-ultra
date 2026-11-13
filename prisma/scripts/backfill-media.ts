// Fills Project.coverWidth, coverHeight and coverBlur from each Cloudinary imageUrl.
// Dry run by default (reads only). Pass --apply to write; it only fills columns that are still null.
//   node prisma/scripts/backfill-media.ts
//   node prisma/scripts/backfill-media.ts --apply
import 'dotenv/config'
import pg from 'pg'

const apply = process.argv.includes('--apply')
const connectionString = (process.env.DATABASE_URL ?? '').replace(
  /([?&])sslmode=(?:prefer|require|verify-ca)(?=&|$)/,
  '$1sslmode=verify-full'
)
if (!connectionString) throw new Error('DATABASE_URL is not configured')

type Row = {
  id: string
  title: string
  imageUrl: string
  coverWidth: number | null
  coverHeight: number | null
  coverBlur: string | null
}

// Splits ".../image/upload/<anything>/v123/folder/a.jpg" into the prefix and the version path.
function parseCloudinary(url: string) {
  const match = url.match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?:[^/]+\/)*?(v\d+\/.+)$/
  )
  if (match) return { base: match[1], path: match[2] }
  const plain = url.match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/
  )
  return plain ? { base: plain[1], path: plain[2] } : null
}

async function readSize(base: string, path: string) {
  const response = await fetch(`${base}fl_getinfo/${path}`, {
    signal: AbortSignal.timeout(15_000)
  })
  if (!response.ok) throw new Error(`fl_getinfo returned ${response.status}`)
  const { input } = (await response.json()) as {
    input?: { width?: number; height?: number }
  }
  if (!input?.width || !input?.height) throw new Error('fl_getinfo had no size')
  return { width: input.width, height: input.height }
}

async function readBlur(base: string, path: string) {
  const response = await fetch(`${base}w_16,e_blur:1000,f_webp/${path}`, {
    signal: AbortSignal.timeout(15_000)
  })
  if (!response.ok) throw new Error(`blur fetch returned ${response.status}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  return `data:image/webp;base64,${bytes.toString('base64')}`
}

const client = new pg.Client({ connectionString })
await client.connect()
console.log(
  apply
    ? 'APPLY: writing to coverWidth, coverHeight, coverBlur only'
    : 'DRY RUN: no writes (pass --apply to write)'
)

try {
  const { rows } = await client.query<Row>(
    `SELECT id, title, "imageUrl", "coverWidth", "coverHeight", "coverBlur"
     FROM "Project" WHERE "imageUrl" IS NOT NULL ORDER BY "sortOrder", "createdAt"`
  )
  console.log(`${rows.length} project(s) with an imageUrl`)
  let planned = 0
  let skipped = 0
  for (const row of rows) {
    if (row.coverWidth && row.coverHeight && row.coverBlur) {
      console.log(`skip   ${row.title}: already filled`)
      skipped++
      continue
    }
    const parsed = parseCloudinary(row.imageUrl)
    if (!parsed) {
      console.log(`skip   ${row.title}: not a Cloudinary image URL`)
      skipped++
      continue
    }
    try {
      const size =
        row.coverWidth && row.coverHeight
          ? { width: row.coverWidth, height: row.coverHeight }
          : await readSize(parsed.base, parsed.path)
      const blur = row.coverBlur ?? (await readBlur(parsed.base, parsed.path))
      planned++
      console.log(
        `${apply ? 'update' : 'plan  '} ${row.title}: ${size.width}x${size.height}, blur ${blur.length} chars`
      )
      if (apply)
        await client.query(
          `UPDATE "Project" SET "coverWidth" = COALESCE("coverWidth", $1), "coverHeight" = COALESCE("coverHeight", $2), "coverBlur" = COALESCE("coverBlur", $3) WHERE id = $4`,
          [size.width, size.height, blur, row.id]
        )
    } catch (error) {
      console.log(
        `skip   ${row.title}: ${error instanceof Error ? error.message : error}`
      )
      skipped++
    }
  }
  console.log(
    `${apply ? 'updated' : 'would update'} ${planned}, skipped ${skipped}`
  )
} finally {
  await client.end()
}
