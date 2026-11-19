import { getBlogBySlug } from '@/lib/content-store'
import { ogCard, ogSize } from '@/lib/og'

export const alt = 'Article by Rafi Ferdos'
export const size = ogSize
export const contentType = 'image/png'

const date = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' })

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogBySlug(slug)
  if (!post) return new Response('Not found', { status: 404 })
  return ogCard({
    eyebrow: post.category,
    title: post.title,
    detail: `${date.format(new Date(post.publishedAt))} · ${post.readTime}`
  })
}
