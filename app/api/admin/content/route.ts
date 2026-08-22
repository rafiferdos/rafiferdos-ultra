import { isAdmin } from '@/lib/admin-auth'
import {
  contentBackendConfigured,
  deleteRecord,
  getBlogs,
  getMessages,
  getProjects,
  insertRecord,
  updateRecord
} from '@/lib/content-store'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import {
  blogRecordSchema,
  messagePatchSchema,
  projectRecordSchema
} from '@/lib/validation/content'

const entities = new Set(['projects', 'blogs', 'messages'])
function validEntity(
  value: unknown
): value is 'projects' | 'blogs' | 'messages' {
  return typeof value === 'string' && entities.has(value)
}
async function authorized() {
  return (await isAdmin()) || null
}

async function body(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>
  } catch {
    return null
  }
}
function invalid(details?: unknown) {
  return NextResponse.json(
    { error: 'The submitted content is invalid.', details },
    { status: 400 }
  )
}
function refreshPublicContent(entity: 'projects' | 'blogs' | 'messages') {
  if (entity === 'projects') {
    revalidatePath('/')
    revalidatePath('/projects')
    revalidatePath('/sitemap.xml')
  }
  if (entity === 'blogs') {
    revalidatePath('/')
    revalidatePath('/blogs')
    revalidatePath('/blogs/[slug]', 'page')
    revalidatePath('/sitemap.xml')
  }
}

export async function GET() {
  if (!(await authorized()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [projects, blogs, messages] = await Promise.all([
    getProjects(),
    getBlogs(false),
    getMessages()
  ])
  return NextResponse.json({
    projects,
    blogs,
    messages,
    backendConfigured: contentBackendConfigured()
  })
}

export async function POST(request: Request) {
  if (!(await authorized()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!contentBackendConfigured())
    return NextResponse.json(
      { error: 'Connect PostgreSQL before publishing changes.' },
      { status: 503 }
    )
  const payload = await body(request)
  if (!payload) return invalid()
  const { entity, record } = payload
  if (!validEntity(entity) || !record) return invalid()
  if (entity === 'messages') return invalid()
  const parsed = (
    entity === 'projects' ? projectRecordSchema : blogRecordSchema
  ).safeParse(record)
  if (!parsed.success) return invalid(parsed.error.flatten())
  try {
    const data = await insertRecord(entity, parsed.data)
    refreshPublicContent(entity)
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Content create failed', error)
    return NextResponse.json(
      {
        error:
          'The content could not be saved. Check database connectivity and unique fields.'
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  if (!(await authorized()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!contentBackendConfigured())
    return NextResponse.json(
      { error: 'Connect PostgreSQL before publishing changes.' },
      { status: 503 }
    )
  const payload = await body(request)
  if (!payload) return invalid()
  const { entity, id, record } = payload
  if (!validEntity(entity) || !id || !record) return invalid()
  const parsed = (
    entity === 'projects'
      ? projectRecordSchema
      : entity === 'blogs'
        ? blogRecordSchema
        : messagePatchSchema
  ).safeParse(record)
  if (!parsed.success) return invalid(parsed.error.flatten())
  try {
    const data = await updateRecord(entity, String(id), parsed.data)
    refreshPublicContent(entity)
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Content update failed', error)
    return NextResponse.json(
      { error: 'The content could not be updated.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  if (!(await authorized()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!contentBackendConfigured())
    return NextResponse.json(
      { error: 'Connect PostgreSQL before publishing changes.' },
      { status: 503 }
    )
  const payload = await body(request)
  if (!payload) return invalid()
  const { entity, id } = payload
  if (!validEntity(entity) || !id) return invalid()
  try {
    await deleteRecord(entity, String(id))
    refreshPublicContent(entity)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Content delete failed', error)
    return NextResponse.json(
      { error: 'The item could not be deleted.' },
      { status: 500 }
    )
  }
}
