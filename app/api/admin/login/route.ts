import { ADMIN_COOKIE, createAdminToken, validateCredentials } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  if (!validateCredentials(String(email || ''), String(password || ''))) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, createAdminToken(email), { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 12, path: '/' })
  return response
}
