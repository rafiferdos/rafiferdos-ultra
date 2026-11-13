import { Footer } from '@/components/Footer/Footer'
import { ArticleBody } from '@/components/Blogs/ArticleBody'
import { RichArticleBody } from '@/components/Blogs/RichArticleBody'
import { Reveal } from '@/components/ui/reveal'
import { SITE_URL, profile, safeJsonLd } from '@/lib/site'
import { getBlogs } from '@/lib/content-store'
import { ArrowLeft, Clock3 } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = (await getBlogs()).find((item) => item.slug === slug)
  if (!post) return { title: 'Article not found' }
  const image = post.imageUrl?.startsWith('http') ? post.imageUrl : undefined
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: {
      canonical: post.canonicalUrl || `${SITE_URL}/blogs/${post.slug}`
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      images: image ? [image] : []
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: image ? [image] : []
    }
  }
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = (await getBlogs()).find((item) => item.slug === slug)
  if (!post) notFound()
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    mainEntityOfPage: `${SITE_URL}/blogs/${post.slug}`,
    author: { '@type': 'Person', name: profile.name, url: SITE_URL },
    image: post.imageUrl || `${SITE_URL}/og.png`,
    keywords: post.tags?.join(', ')
  }
  return (
    <>
      <main className="mx-auto min-h-svh max-w-4xl px-4 pb-20 pt-28 sm:px-6 sm:pb-24 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
        />
        <Reveal>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All articles
          </Link>
          <header className="mt-10 sm:mt-12">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground sm:gap-4 sm:text-[11px] sm:tracking-[.16em]">
              <span className="rounded-full border border-border px-3 py-1 text-primary">
                {post.category}
              </span>
              <span className="rounded-full border border-border px-3 py-1">
                {post.format || 'Article'}
              </span>
              <time dateTime={post.publishedAt}>
                {new Intl.DateTimeFormat('en', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }).format(new Date(post.publishedAt))}
              </time>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5" />
                {post.readTime}
              </span>
            </div>
            <h1 className="mt-7 text-balance text-[clamp(2.65rem,8vw,4.7rem)] font-semibold leading-[.98] tracking-[-.06em]">
              {post.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:mt-7 sm:text-xl sm:leading-9">
              {post.excerpt}
            </p>
          </header>
        </Reveal>
        {post.imageUrl && (
          <Reveal>
            <img
              src={post.imageUrl}
              alt={post.coverAlt || `${post.title} cover`}
              className="mt-10 aspect-[16/8] w-full rounded-[1.5rem] object-cover sm:mt-14"
            />
          </Reveal>
        )}
        <article className="mt-12 border-t border-border pt-10 sm:mt-16 sm:pt-12">
          {post.contentJson ? (
            <RichArticleBody value={post.contentJson} fallback={post.content} />
          ) : (
            <ArticleBody content={post.content} />
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
