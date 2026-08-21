import { isAdmin } from '@/lib/admin-auth'
import { contentBackendConfigured, deleteRecord, getBlogs, getProjects, insertRecord, updateRecord } from '@/lib/content-store'
import { NextResponse } from 'next/server'

const entities = new Set(['projects', 'blogs'])
function validEntity(value: unknown): value is 'projects' | 'blogs' { return typeof value === 'string' && entities.has(value) }
async function authorized() { return (await isAdmin()) || null }

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ projects: await getProjects(), blogs: await getBlogs(false), backendConfigured: contentBackendConfigured() })
}

export async function POST(request: Request) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!contentBackendConfigured()) return NextResponse.json({ error: 'Connect Supabase before publishing changes.' }, { status: 503 })
  const { entity, record } = await request.json()
  if (!validEntity(entity) || !record) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  return NextResponse.json({ data: await insertRecord(entity, record) })
}

export async function PATCH(request: Request) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!contentBackendConfigured()) return NextResponse.json({ error: 'Connect Supabase before publishing changes.' }, { status: 503 })
  const { entity, id, record } = await request.json()
  if (!validEntity(entity) || !id || !record) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  return NextResponse.json({ data: await updateRecord(entity, id, record) })
}

export async function DELETE(request: Request) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!contentBackendConfigured()) return NextResponse.json({ error: 'Connect Supabase before publishing changes.' }, { status: 503 })
  const { entity, id } = await request.json()
  if (!validEntity(entity) || !id) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  await deleteRecord(entity, id)
  return NextResponse.json({ ok: true })
}
