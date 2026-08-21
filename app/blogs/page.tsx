import { Footer } from '@/components/Footer/Footer'
import { Reveal } from '@/components/ui/reveal'
import { getBlogs } from '@/lib/content-store'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Writing', description: 'Practical notes that show how Rafi Ferdos approaches full-stack, mobile, realtime and AI product engineering.' }

export default async function BlogsPage() {
  const posts = await getBlogs()
  return <><main className="mx-auto min-h-svh max-w-7xl px-4 pb-24 pt-28"><Reveal><p className="font-mono text-xs font-semibold uppercase tracking-[.28em] text-primary">Field notes</p><h1 className="mt-5 max-w-4xl text-balance text-5xl font-semibold tracking-[-.065em] sm:text-7xl lg:text-8xl">Lessons from building the <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500 bg-clip-text text-transparent">whole product.</span></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Practical writing for the engineers, hiring teams and product owners who want to understand the decisions behind my work.</p></Reveal><div className="mt-16 grid gap-5 lg:grid-cols-2">{posts.map((post, index) => <Reveal key={post.id} delay={index * .08} className="h-full"><Link href={`/blogs/${post.slug}`} className="group flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-[1.8rem] border border-border/70 bg-card p-7 shadow-xl shadow-black/5 transition hover:-translate-y-1 hover:border-primary/30 sm:p-8"><div><div className="flex items-center justify-between"><span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">{post.category}</span><ArrowUpRight className="size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" /></div><h2 className="mt-9 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">{post.title}</h2><p className="mt-4 leading-7 text-muted-foreground">{post.excerpt}</p></div><div className="mt-10 flex items-center gap-4 text-xs text-muted-foreground"><time dateTime={post.publishedAt}>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt))}</time><span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" />{post.readTime}</span></div></Link></Reveal>)}</div></main><Footer /></>
}
