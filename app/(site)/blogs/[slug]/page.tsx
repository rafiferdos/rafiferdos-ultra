import { ArticleBody } from '@/components/Blogs/ArticleBody'
import { RichArticleBody } from '@/components/Blogs/RichArticleBody'
import { JsonLd } from '@/components/seo/json-ld'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { articleNode, breadcrumbNode, graph, pageMetadata } from '@/lib/seo'
import { getBlogBySlug, getBlogs } from '@/lib/content-store'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return (await getBlogs()).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogBySlug(slug)
  if (!post) return { title: 'Article not found' }
  return pageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blogs/${post.slug}`,
    canonical: post.canonicalUrl || undefined,
    // The generated card in this folder (opengraph-image.tsx) is the share image.
    hasOwnImage: true,
    article: {
      publishedTime: post.publishedAt,
      section: post.category,
      tags: post.tags
    }
  })
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogBySlug(slug)
  if (!post) notFound()
  const path = `/blogs/${post.slug}`
  const jsonLd = graph(
    articleNode(post, path),
    breadcrumbNode([
      { name: 'Home', path: '/' },
      { name: 'Writing', path: '/blogs' },
      { name: post.title, path }
    ])
  )
  return (
    <main id="main" className="min-h-svh px-gutter pb-section pt-28">
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Writing', href: '/blogs' }, { name: post.title }]} />

      <header className="mx-auto mt-12 max-w-3xl">
        <p className="t-label flex flex-wrap gap-x-6 gap-y-1 text-site-muted">
          <span>({post.category})</span>
          <time dateTime={post.publishedAt}>
            {new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(
              new Date(post.publishedAt)
            )}
          </time>
          <span>{post.readTime}</span>
        </p>
        <h1 className="t-h1 mt-6 text-balance">{post.title}</h1>
        <p className="text-lead mt-6 text-site-muted">{post.excerpt}</p>
      </header>

      {post.imageUrl && (
        <div className="relative mx-auto mt-12 aspect-[16/8] max-w-5xl overflow-hidden bg-site-surface">
          <Image
            src={post.imageUrl}
            alt={post.coverAlt || `${post.title} cover`}
            fill
            priority
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="object-cover"
            // Only Cloudinary is in remotePatterns; any other cover host would throw.
            unoptimized={!post.imageUrl.includes('res.cloudinary.com')}
          />
        </div>
      )}

      <article className="mx-auto mt-12 max-w-3xl border-t border-site-line pt-10">
        {post.contentJson ? (
          <RichArticleBody value={post.contentJson} fallback={post.content} />
        ) : (
          <ArticleBody content={post.content} />
        )}
      </article>
    </main>
  )
}
