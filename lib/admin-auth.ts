import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'rafi_admin_session'

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
}

export function credentialsConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && secret())
}

export function validateCredentials(email: string, password: string) {
  if (!credentialsConfigured()) return false
  return safeEqual(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase()) && safeEqual(password, process.env.ADMIN_PASSWORD!)
}

export function createAdminToken(email: string) {
  const expires = Date.now() + 1000 * 60 * 60 * 12
  const payload = `${email.trim().toLowerCase()}|${expires}`
  const signature = createHmac('sha256', secret()).update(payload).digest('base64url')
  return Buffer.from(`${payload}|${signature}`).toString('base64url')
}

export function verifyAdminToken(token?: string) {
  if (!token || !credentialsConfigured()) return false
  try {
    const [email, expires, signature] = Buffer.from(token, 'base64url').toString().split('|')
    if (!email || !expires || !signature || Number(expires) < Date.now()) return false
    if (!safeEqual(email, process.env.ADMIN_EMAIL!.trim().toLowerCase())) return false
    const expected = createHmac('sha256', secret()).update(`${email}|${expires}`).digest('base64url')
    return safeEqual(signature, expected)
  } catch {
    return false
  }
}

export async function isAdmin() {
  const store = await cookies()
  return verifyAdminToken(store.get(ADMIN_COOKIE)?.value)
}
