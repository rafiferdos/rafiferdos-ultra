import {
  ADMIN_COOKIE,
  createAdminToken,
  validateCredentials
} from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (
      !(await validateCredentials(String(email || ''), String(password || '')))
    )
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    const response = NextResponse.json({ ok: true })
    response.cookies.set(ADMIN_COOKIE, createAdminToken(email), {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 12,
      path: '/'
    })
    return response
  } catch (error) {
    const code =
      typeof error === 'object' && error && 'code' in error
        ? String(error.code)
        : ''
    console.error('Admin login failed', { code })
    return NextResponse.json(
      {
        error:
          code === 'P2021'
            ? 'Database tables are missing. Run pnpm db:push, then try again.'
            : 'The database is unavailable. Check its connection and try again.'
      },
      { status: 503 }
    )
  }
}
