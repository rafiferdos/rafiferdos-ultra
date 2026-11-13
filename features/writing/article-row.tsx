import Link from 'next/link'
import type { BlogPost } from '@/data/site-content'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })

// One row, shared by the home teaser and the archive. The title roll is CSS (see .roll-title in site.css).
export function ArticleRow({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="writing-row grid items-baseline gap-x-8 gap-y-2 py-6 md:grid-cols-[12rem_1fr_6rem_6rem]"
    >
      <span className="t-label text-site-muted">({post.category})</span>
      <span className="roll-title">
        <span data-text={post.title} className="roll-title-inner t-h3">
          {post.title}
        </span>
      </span>
      <span className="t-label text-site-muted md:text-right">{post.readTime}</span>
      <span className="t-label text-site-muted md:text-right">{formatDate(post.publishedAt)}</span>
    </Link>
  )
}
