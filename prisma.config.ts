import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    url: env(process.env.DIRECT_URL ? 'DIRECT_URL' : 'DATABASE_URL')
  }
})
