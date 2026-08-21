import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/app/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createClient() {
  const configuredUrl = process.env.DATABASE_URL
  if (!configuredUrl) throw new Error('DATABASE_URL is not configured')
  const connectionString = configuredUrl.replace(
    /([?&])sslmode=(?:prefer|require|verify-ca)(?=&|$)/,
    '$1sslmode=verify-full'
  )
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) })
}

export function getPrisma() {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = createClient()
  return globalForPrisma.prisma
}
