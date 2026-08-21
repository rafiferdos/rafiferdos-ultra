import {
  BlogPost,
  defaultBlogs,
  defaultProjects,
  Project
} from '@/data/site-content'

type Entity = 'projects' | 'blogs' | 'messages'

export function contentBackendConfigured() {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

async function supabase<T>(
  table: Entity,
  init: RequestInit = {},
  query = ''
): Promise<T> {
  if (!contentBackendConfigured())
    throw new Error('Content backend is not configured')
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/${table}${query}`,
    {
      ...init,
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'content-type': 'application/json',
        prefer: 'return=representation',
        ...init.headers
      },
      cache: 'no-store'
    }
  )
  if (!response.ok)
    throw new Error(`Content request failed: ${response.status}`)
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export async function getProjects(): Promise<Project[]> {
  if (!contentBackendConfigured()) return defaultProjects
  try {
    const rows = await supabase<Project[]>(
      'projects',
      {},
      '?select=*&order=sort_order.asc'
    )
    return rows.length
      ? rows.map((row) => ({
          ...row,
          techStack: row.techStack || [],
          discipline: row.discipline || 'Full stack',
          projectType: row.projectType || 'Personal project',
          tags: row.tags || []
        }))
      : defaultProjects
  } catch {
    return defaultProjects
  }
}

export async function getBlogs(publishedOnly = true): Promise<BlogPost[]> {
  const fallback = defaultBlogs
    .filter((post) => !publishedOnly || post.published)
    .map((post) => ({
      ...post,
      format: post.format || 'Article',
      tags: post.tags?.length ? post.tags : [post.category],
      featured: post.featured ?? false
    }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  if (!contentBackendConfigured()) return fallback
  try {
    const filter = publishedOnly ? '&published=eq.true' : ''
    const rows = await supabase<BlogPost[]>(
      'blogs',
      {},
      `?select=*&order=publishedAt.desc${filter}`
    )
    return rows.length
      ? rows.map((post) => ({
          ...post,
          format: post.format || 'Article',
          tags: post.tags || [],
          featured: post.featured || false
        }))
      : fallback
  } catch {
    return fallback
  }
}

export async function insertRecord(
  entity: Entity,
  record: Record<string, unknown>
) {
  return supabase<Record<string, unknown>[]>(entity, {
    method: 'POST',
    body: JSON.stringify(record)
  })
}

export async function updateRecord(
  entity: Entity,
  id: string,
  record: Record<string, unknown>
) {
  return supabase<Record<string, unknown>[]>(
    entity,
    { method: 'PATCH', body: JSON.stringify(record) },
    `?id=eq.${encodeURIComponent(id)}`
  )
}

export async function deleteRecord(entity: Entity, id: string) {
  return supabase<void>(
    entity,
    { method: 'DELETE' },
    `?id=eq.${encodeURIComponent(id)}`
  )
}
