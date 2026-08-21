import { WritingExplorer } from '@/components/Blogs/WritingExplorer'
import { Footer } from '@/components/Footer/Footer'
import { getBlogs } from '@/lib/content-store'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Practical notes that show how Rafi Ferdos approaches full-stack, mobile, realtime and AI product engineering.',
  alternates: { canonical: '/blogs' },
  openGraph: {
    title: 'Engineering Writing by Rafi Ferdos',
    description:
      'Practical notes on Next.js, backend systems, mobile, realtime and production AI.',
    url: '/blogs',
    images: ['/og.png']
  }
}

export default async function BlogsPage() {
  const posts = await getBlogs()
  return (
    <>
      <WritingExplorer posts={posts} />
      <Footer />
    </>
  )
}
