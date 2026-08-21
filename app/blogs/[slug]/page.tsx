import { Footer } from '@/components/Footer/Footer'
import { getBlogs } from '@/lib/content-store'
import { ArrowLeft, Clock3 } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = (await getBlogs()).find((item) => item.slug === slug)
  return post ? { title: post.title, description: post.excerpt } : { title: 'Article not found' }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = (await getBlogs()).find((item) => item.slug === slug)
  if (!post) notFound()
  return <><main className="mx-auto min-h-svh max-w-4xl px-4 pb-24 pt-28"><Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="size-4" />All articles</Link><header className="mt-12"><div className="flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[.16em] text-muted-foreground"><span className="rounded-full border border-border px-3 py-1 text-primary">{post.category}</span><time dateTime={post.publishedAt}>{new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt))}</time><span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" />{post.readTime}</span></div><h1 className="mt-7 text-balance text-5xl font-semibold tracking-[-.065em] sm:text-7xl">{post.title}</h1><p className="mt-7 text-xl leading-9 text-muted-foreground">{post.excerpt}</p></header><article className="mt-16 border-t border-border pt-12">{post.content.split(/\n\n+/).map((paragraph, index) => <p key={index} className="mb-7 text-[1.08rem] leading-9 text-foreground/80">{paragraph}</p>)}</article></main><Footer /></>
}
