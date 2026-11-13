import { BlogPost, GalleryItem, Project } from '@/data/site-content'
import { unstable_cache } from 'next/cache'
import { getPrisma } from '@/lib/prisma'
import { Prisma } from '@/app/generated/prisma/client'
import { slugify } from '@/lib/slug'

export type ContentEntity = 'projects' | 'blogs' | 'messages'
export type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  notificationSent: boolean
  notificationError?: string
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

const text = (value: unknown) => String(value ?? '').trim()
const optionalText = (value: unknown) => {
  const result = text(value)
  return result || null
}
const list = (value: unknown) =>
  Array.isArray(value) ? value.map(text).filter(Boolean) : []
const jsonValue = (
  value: unknown
): Prisma.InputJsonValue | typeof Prisma.JsonNull =>
  value === null || value === undefined
    ? Prisma.JsonNull
    : (value as Prisma.InputJsonValue)

function projectRow(row: {
  id: string
  slug: string | null
  updatedAt: Date
  title: string
  description: string
  subtitle: string | null
  role: string | null
  client: string | null
  overview: string | null
  challenge: string | null
  solution: string | null
  year: number | null
  status: string
  caseStudyUrl: string | null
  outcomes: string[]
  imageUrl: string | null
  coverWidth: number | null
  coverHeight: number | null
  coverBlur: string | null
  videoUrl: string | null
  gallery: unknown
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
    slug: row.slug || undefined,
    updatedAt: row.updatedAt.toISOString(),
    client: row.client || undefined,
    overview: row.overview || undefined,
    challenge: row.challenge || undefined,
    solution: row.solution || undefined,
    imageUrl: row.imageUrl || undefined,
    coverWidth: row.coverWidth ?? undefined,
    coverHeight: row.coverHeight ?? undefined,
    coverBlur: row.coverBlur || undefined,
    videoUrl: row.videoUrl || undefined,
    gallery: Array.isArray(row.gallery) ? (row.gallery as GalleryItem[]) : [],
    liveUrl: row.liveUrl || undefined,
    githubUrl: row.githubUrl || undefined,
    subtitle: row.subtitle || undefined,
    role: row.role || undefined,
    year: row.year || undefined,
    caseStudyUrl: row.caseStudyUrl || undefined,
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
  contentJson: unknown
  category: string
  format: string
  tags: string[]
  publishedAt: Date
  readTime: string
  imageUrl: string | null
  coverAlt: string | null
  series: string | null
  difficulty: string | null
  language: string
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
    contentJson: row.contentJson || undefined,
    coverAlt: row.coverAlt || undefined,
    series: row.series || undefined,
    difficulty: row.difficulty || undefined,
    language: row.language || undefined,
    seoTitle: row.seoTitle || undefined,
    seoDescription: row.seoDescription || undefined,
    canonicalUrl: row.canonicalUrl || undefined
  }
}

// The loaders throw on a database error so unstable_cache never stores a failure.
// The public wrappers turn that into an empty result, same as before.
const loadProjects = unstable_cache(
  async () => {
    const rows = await getPrisma().project.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    })
    return rows.map(projectRow)
  },
  ['projects'],
  { tags: ['projects'] }
)

const loadBlogs = unstable_cache(
  async (publishedOnly: boolean) => {
    const rows = await getPrisma().blogPost.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { publishedAt: 'desc' }
    })
    return rows.map(blogRow)
  },
  ['blogs'],
  { tags: ['articles'] }
)

const loadBlogBySlug = unstable_cache(
  async (slug: string) => {
    const row = await getPrisma().blogPost.findFirst({
      where: { slug, published: true }
    })
    return row ? blogRow(row) : null
  },
  ['blog-by-slug'],
  { tags: ['articles'] }
)

export async function getProjects(): Promise<Project[]> {
  if (!contentBackendConfigured()) return []
  try {
    return await loadProjects()
  } catch {
    return []
  }
}

// The cache key is only ever a slug or id that exists, so 404 URLs cannot grow the cache.
export async function getProjectByKey(key: string): Promise<Project | null> {
  const match = (project: Project) => project.slug === key || project.id === key
  const known = (await getProjects()).find(match)
  if (!known) return null
  try {
    return await unstable_cache(
      async () => {
        const row = await getPrisma().project.findFirst({
          where: { OR: [{ slug: key }, { id: key }] }
        })
        return row ? projectRow(row) : null
      },
      ['project', key],
      { tags: ['projects', `project:${key}`] }
    )()
  } catch {
    return known
  }
}

export async function getBlogs(publishedOnly = true): Promise<BlogPost[]> {
  if (!contentBackendConfigured()) return []
  try {
    return await loadBlogs(publishedOnly)
  } catch {
    return []
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  if (!contentBackendConfigured()) return null
  try {
    return await loadBlogBySlug(slug)
  } catch {
    return null
  }
}

export async function getMessages(): Promise<ContactMessage[]> {
  if (!contentBackendConfigured()) return []
  const rows = await getPrisma().message.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return rows.map((row) => ({
    ...row,
    notificationError: row.notificationError || undefined,
    createdAt: row.createdAt.toISOString()
  }))
}

export class SlugTakenError extends Error {}

// An explicit slug that is taken is an error; one made from the title gets -2, -3 until it is free.
async function resolveSlug(title: string, requested: string | null, excludeId?: string) {
  const taken = async (slug: string) =>
    Boolean(
      await getPrisma().project.findFirst({
        where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
        select: { id: true }
      })
    )
  if (requested) {
    if (await taken(requested)) throw new SlugTakenError(requested)
    return requested
  }
  const base = slugify(title) || 'project'
  let slug = base
  for (let n = 2; await taken(slug); n++) slug = `${base}-${n}`
  return slug
}

export async function insertRecord(
  entity: ContentEntity,
  record: Record<string, unknown>
) {
  const data = clean(record)
  if (entity === 'projects') {
    const { sort_order, sortOrder, ...rest } = data
    const slug = await resolveSlug(text(rest.title), optionalText(rest.slug))
    return getPrisma().project.create({
      data: {
        slug,
        title: text(rest.title),
        description: text(rest.description),
        subtitle: optionalText(rest.subtitle),
        role: optionalText(rest.role),
        client: optionalText(rest.client),
        overview: optionalText(rest.overview),
        challenge: optionalText(rest.challenge),
        solution: optionalText(rest.solution),
        year: rest.year ? Number(rest.year) : null,
        status: text(rest.status) || 'Published',
        caseStudyUrl: optionalText(rest.caseStudyUrl),
        outcomes: list(rest.outcomes),
        imageUrl: optionalText(rest.imageUrl),
        ...(rest.coverWidth === undefined
          ? {}
          : { coverWidth: rest.coverWidth ? Number(rest.coverWidth) : null }),
        ...(rest.coverHeight === undefined
          ? {}
          : { coverHeight: rest.coverHeight ? Number(rest.coverHeight) : null }),
        ...(rest.coverBlur === undefined
          ? {}
          : { coverBlur: optionalText(rest.coverBlur) }),
        ...(rest.videoUrl === undefined
          ? {}
          : { videoUrl: optionalText(rest.videoUrl) }),
        ...(rest.gallery === undefined
          ? {}
          : { gallery: rest.gallery as Prisma.InputJsonValue }),
        liveUrl: optionalText(rest.liveUrl),
        githubUrl: optionalText(rest.githubUrl),
        techStack: list(rest.techStack),
        discipline: text(rest.discipline),
        projectType: text(rest.projectType),
        tags: list(rest.tags),
        accent: text(rest.accent) || '#f59e0b',
        featured: Boolean(rest.featured),
        sortOrder: Number(sort_order ?? sortOrder ?? 0)
      }
    })
  }
  if (entity === 'blogs')
    return getPrisma().blogPost.create({
      data: {
        slug: text(data.slug),
        title: text(data.title),
        excerpt: text(data.excerpt),
        content: text(data.content),
        contentJson: jsonValue(data.contentJson),
        category: text(data.category),
        format: text(data.format) || 'Article',
        tags: list(data.tags),
        readTime: text(data.readTime),
        imageUrl: optionalText(data.imageUrl),
        coverAlt: optionalText(data.coverAlt),
        series: optionalText(data.series),
        difficulty: optionalText(data.difficulty),
        language: text(data.language) || 'English',
        featured: Boolean(data.featured),
        seoTitle: optionalText(data.seoTitle),
        seoDescription: optionalText(data.seoDescription),
        canonicalUrl: optionalText(data.canonicalUrl),
        published: Boolean(data.published),
        publishedAt: new Date(String(data.publishedAt || Date.now()))
      }
    })
  return getPrisma().message.create({
    data: {
      name: text(data.name),
      email: text(data.email),
      subject: text(data.subject),
      message: text(data.message),
      status: text(data.status) || 'new',
      notificationSent: Boolean(data.notificationSent),
      notificationError: optionalText(data.notificationError)
    }
  })
}

export async function updateRecord(
  entity: ContentEntity,
  id: string,
  record: Record<string, unknown>
) {
  const data = clean(record)
  if (entity === 'projects') {
    const { sort_order, sortOrder, ...rest } = data
    // No slug sent: keep the current one so URLs stay stable when the title changes; make one only if the row has none.
    const requested =
      optionalText(rest.slug) ??
      (await getPrisma().project.findUnique({ where: { id }, select: { slug: true } }))?.slug ??
      null
    const slug = await resolveSlug(text(rest.title), requested, id)
    return getPrisma().project.update({
      where: { id },
      data: {
        slug,
        title: text(rest.title),
        description: text(rest.description),
        subtitle: optionalText(rest.subtitle),
        role: optionalText(rest.role),
        client: optionalText(rest.client),
        overview: optionalText(rest.overview),
        challenge: optionalText(rest.challenge),
        solution: optionalText(rest.solution),
        year: rest.year ? Number(rest.year) : null,
        status: text(rest.status) || 'Published',
        caseStudyUrl: optionalText(rest.caseStudyUrl),
        outcomes: list(rest.outcomes),
        imageUrl: optionalText(rest.imageUrl),
        ...(rest.coverWidth === undefined
          ? {}
          : { coverWidth: rest.coverWidth ? Number(rest.coverWidth) : null }),
        ...(rest.coverHeight === undefined
          ? {}
          : { coverHeight: rest.coverHeight ? Number(rest.coverHeight) : null }),
        ...(rest.coverBlur === undefined
          ? {}
          : { coverBlur: optionalText(rest.coverBlur) }),
        ...(rest.videoUrl === undefined
          ? {}
          : { videoUrl: optionalText(rest.videoUrl) }),
        ...(rest.gallery === undefined
          ? {}
          : { gallery: rest.gallery as Prisma.InputJsonValue }),
        liveUrl: optionalText(rest.liveUrl),
        githubUrl: optionalText(rest.githubUrl),
        techStack: list(rest.techStack),
        discipline: text(rest.discipline),
        projectType: text(rest.projectType),
        tags: list(rest.tags),
        accent: text(rest.accent) || '#f59e0b',
        featured: Boolean(rest.featured),
        sortOrder: Number(sort_order ?? sortOrder ?? 0)
      }
    })
  }
  if (entity === 'blogs')
    return getPrisma().blogPost.update({
      where: { id },
      data: {
        slug: text(data.slug),
        title: text(data.title),
        excerpt: text(data.excerpt),
        content: text(data.content),
        contentJson: jsonValue(data.contentJson),
        category: text(data.category),
        format: text(data.format) || 'Article',
        tags: list(data.tags),
        readTime: text(data.readTime),
        imageUrl: optionalText(data.imageUrl),
        coverAlt: optionalText(data.coverAlt),
        series: optionalText(data.series),
        difficulty: optionalText(data.difficulty),
        language: text(data.language) || 'English',
        featured: Boolean(data.featured),
        seoTitle: optionalText(data.seoTitle),
        seoDescription: optionalText(data.seoDescription),
        canonicalUrl: optionalText(data.canonicalUrl),
        published: Boolean(data.published),
        ...(data.publishedAt
          ? { publishedAt: new Date(String(data.publishedAt)) }
          : {})
      }
    })
  return getPrisma().message.update({
    where: { id },
    data: {
      ...(data.status === undefined ? {} : { status: text(data.status) }),
      ...(data.notificationSent === undefined
        ? {}
        : { notificationSent: Boolean(data.notificationSent) }),
      ...(data.notificationError === undefined
        ? {}
        : { notificationError: optionalText(data.notificationError) })
    }
  })
}

export async function deleteRecord(entity: ContentEntity, id: string) {
  if (entity === 'projects')
    return getPrisma().project.delete({ where: { id } })
  if (entity === 'blogs') return getPrisma().blogPost.delete({ where: { id } })
  return getPrisma().message.delete({ where: { id } })
}
