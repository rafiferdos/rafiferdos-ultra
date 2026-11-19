import { JsonLd } from '@/components/seo/json-ld'
import { WritingArchive } from '@/features/writing/writing-archive'
import { collectionNode, graph, pageMetadata } from '@/lib/seo'
import { getBlogs } from '@/lib/content-store'
import type { Metadata } from 'next'

const title = 'Writing on AI engineering and architecture'
const description = 'Essays on AI agents, RAG and API design, from building web, mobile and real-time products. By Rafi Ferdos.'

export const metadata: Metadata = pageMetadata({ title, description, path: '/blogs' })

export default async function BlogsPage() {
  const posts = await getBlogs()
  const jsonLd = graph(
    collectionNode(
      { name: title, description, path: '/blogs' },
      posts.map((post) => ({ name: post.title, path: `/blogs/${post.slug}` }))
    )
  )
  return (
    <main id="main" className="min-h-svh px-gutter pb-section pt-28">
      <JsonLd data={jsonLd} />
      <header className="pb-12">
        <p className="t-label text-site-muted">(Writing{posts.length ? ` ${String(posts.length).padStart(2, '0')}` : ''})</p>
        <h1 className="t-h1 mt-4 max-w-[18ch]">Notes from building real products.</h1>
      </header>
      <WritingArchive posts={posts} />
    </main>
  )
}
