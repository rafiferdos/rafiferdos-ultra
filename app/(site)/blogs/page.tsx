import { WritingArchive } from '@/features/writing/writing-archive'
import { getBlogs } from '@/lib/content-store'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Practical notes that show how Rafi Ferdos approaches full-stack, mobile, realtime and AI product engineering.',
  alternates: { canonical: '/blogs' },
  openGraph: {
    title: 'Engineering Writing by Rafi Ferdos',
    description: 'Practical notes on Next.js, backend systems, mobile, realtime and production AI.',
    url: '/blogs',
    images: ['/og.png']
  }
}

export default async function BlogsPage() {
  const posts = await getBlogs()
  return (
    <main id="main" className="min-h-svh px-gutter pb-section pt-28">
      <header className="pb-12">
        <p className="t-label text-site-muted">(Writing{posts.length ? ` ${String(posts.length).padStart(2, '0')}` : ''})</p>
        <h1 className="t-h1 mt-4 max-w-[18ch]">Notes from building real products.</h1>
      </header>
      <WritingArchive posts={posts} />
    </main>
  )
}
