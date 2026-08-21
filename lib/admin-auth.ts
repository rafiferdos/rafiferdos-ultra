import { getPrisma } from '@/lib/prisma'
import { compare, hash } from 'bcryptjs'
import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'rafi_admin_session'
function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}
function secret() {
  return process.env.ADMIN_SESSION_SECRET || ''
}
export function credentialsConfigured() {
  return Boolean(
    secret() &&
    (process.env.DATABASE_URL ||
      (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD))
  )
}

export async function validateCredentials(email: string, password: string) {
  if (!credentialsConfigured() || !email || !password) return false
  const normalized = email.trim().toLowerCase()
  if (process.env.DATABASE_URL) {
    const prisma = getPrisma()
    const admin = await prisma.admin.findUnique({
      where: { email: normalized }
    })
    if (admin) return compare(password, admin.passwordHash)
    const bootstrapEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    if (
      !bootstrapEmail ||
      !process.env.ADMIN_PASSWORD ||
      !safeEqual(normalized, bootstrapEmail) ||
      !safeEqual(password, process.env.ADMIN_PASSWORD)
    )
      return false
    await prisma.admin.create({
      data: {
        email: normalized,
        name: process.env.ADMIN_NAME || 'Rafi Ferdos',
        passwordHash: await hash(password, 12)
      }
    })
    return true
  }
  return (
    safeEqual(normalized, process.env.ADMIN_EMAIL!.trim().toLowerCase()) &&
    safeEqual(password, process.env.ADMIN_PASSWORD!)
  )
}

export function createAdminToken(email: string) {
  const expires = Date.now() + 1000 * 60 * 60 * 12
  const payload = `${email.trim().toLowerCase()}|${expires}`
  const signature = createHmac('sha256', secret())
    .update(payload)
    .digest('base64url')
  return Buffer.from(`${payload}|${signature}`).toString('base64url')
}

export function verifyAdminToken(token?: string) {
  if (!token || !credentialsConfigured()) return false
  try {
    const [email, expires, signature] = Buffer.from(token, 'base64url')
      .toString()
      .split('|')
    if (!email || !expires || !signature || Number(expires) < Date.now())
      return false
    const expected = createHmac('sha256', secret())
      .update(`${email}|${expires}`)
      .digest('base64url')
    return safeEqual(signature, expected)
  } catch {
    return false
  }
}

export async function isAdmin() {
  const store = await cookies()
  return verifyAdminToken(store.get(ADMIN_COOKIE)?.value)
}
