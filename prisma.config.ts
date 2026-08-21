import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

const databaseUrl = env('DATABASE_URL')
const configuredDirectUrl = process.env.DIRECT_URL?.trim()
const directUrlIsUsable =
  configuredDirectUrl &&
  !/(?:USER|PASSWORD|HOST|DATABASE)/i.test(configuredDirectUrl)

// Prisma Postgres uses identical credentials for its pooled and direct hosts.
// This keeps DATABASE_URL sufficient for local setup while still allowing an
// explicit DIRECT_URL for other pooled PostgreSQL providers.
const cliUrl = directUrlIsUsable
  ? configuredDirectUrl
  : databaseUrl.replace('@pooled.db.prisma.io', '@db.prisma.io')

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    url: cliUrl
  }
})
