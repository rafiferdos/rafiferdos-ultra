import { BlogPost, Project } from '@/data/site-content'
import { getPrisma } from '@/lib/prisma'

export type ContentEntity = 'projects' | 'blogs' | 'messages'
export type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  createdAt: string
}

export function contentBackendConfigured() {
  return Boolean(process.env.DATABASE_URL)
}
const clean = (value: unknown) =>
  Object.fromEntries(
    Object.entries((value || {}) as Record<string, unknown>).filter(
      ([, item]) => item !== undefined
    )
  )

function projectRow(row: {
  id: string
  title: string
  description: string
  imageUrl: string | null
  liveUrl: string | null
  githubUrl: string | null
  techStack: string[]
  discipline: string
  projectType: string
  tags: string[]
  accent: string
  featured: boolean
}): Project {
  return {
    ...row,
    imageUrl: row.imageUrl || undefined,
    liveUrl: row.liveUrl || undefined,
    githubUrl: row.githubUrl || undefined,
    discipline: row.discipline as Project['discipline'],
    projectType: row.projectType as Project['projectType']
  }
}

function blogRow(row: {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  format: string
  tags: string[]
  publishedAt: Date
  readTime: string
  imageUrl: string | null
  featured: boolean
  seoTitle: string | null
  seoDescription: string | null
  canonicalUrl: string | null
  published: boolean
}): BlogPost {
  return {
    ...row,
    format: row.format as BlogPost['format'],
    publishedAt: row.publishedAt.toISOString(),
    imageUrl: row.imageUrl || undefined,
    seoTitle: row.seoTitle || undefined,
    seoDescription: row.seoDescription || undefined,
    canonicalUrl: row.canonicalUrl || undefined
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!contentBackendConfigured()) return []
  try {
    const rows = await getPrisma().project.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    })
    return rows.map(projectRow)
  } catch {
    return []
  }
}

export async function getBlogs(publishedOnly = true): Promise<BlogPost[]> {
  if (!contentBackendConfigured()) return []
  try {
    const rows = await getPrisma().blogPost.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { publishedAt: 'desc' }
    })
    return rows.map(blogRow)
  } catch {
    return []
  }
}

export async function getMessages(): Promise<ContactMessage[]> {
  if (!contentBackendConfigured()) return []
  const rows = await getPrisma().message.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }))
}

export async function insertRecord(
  entity: ContentEntity,
  record: Record<string, unknown>
) {
  const data = clean(record)
  if (entity === 'projects') {
    const { sort_order, sortOrder, ...rest } = data
    return getPrisma().project.create({
      data: {
        ...rest,
        sortOrder: Number(sort_order ?? sortOrder ?? 0)
      } as never
    })
  }
  if (entity === 'blogs')
    return getPrisma().blogPost.create({
      data: {
        ...data,
        publishedAt: new Date(String(data.publishedAt || Date.now()))
      } as never
    })
  return getPrisma().message.create({ data: data as never })
}

export async function updateRecord(
  entity: ContentEntity,
  id: string,
  record: Record<string, unknown>
) {
  const data = clean(record)
  if (entity === 'projects') {
    const { sort_order, ...rest } = data
    return getPrisma().project.update({
      where: { id },
      data: {
        ...rest,
        ...(sort_order === undefined ? {} : { sortOrder: Number(sort_order) })
      } as never
    })
  }
  if (entity === 'blogs')
    return getPrisma().blogPost.update({
      where: { id },
      data: {
        ...data,
        ...(data.publishedAt
          ? { publishedAt: new Date(String(data.publishedAt)) }
          : {})
      } as never
    })
  return getPrisma().message.update({ where: { id }, data: data as never })
}

export async function deleteRecord(entity: ContentEntity, id: string) {
  if (entity === 'projects')
    return getPrisma().project.delete({ where: { id } })
  if (entity === 'blogs') return getPrisma().blogPost.delete({ where: { id } })
  return getPrisma().message.delete({ where: { id } })
}
