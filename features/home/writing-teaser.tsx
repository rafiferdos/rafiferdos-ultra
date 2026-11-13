import Link from 'next/link'
import { RollLink } from '@/components/site/roll-link'
import type { BlogPost } from '@/data/site-content'
import { WritingMotion } from '@/features/home/writing-motion'

const LATEST = 3

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })

// Hidden with no published posts. getBlogs already returns newest first.
export function WritingTeaser({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null

  return (
    <WritingMotion id="writing" className="scroll-mt-16 px-gutter py-section">
      <header className="t-label flex items-baseline justify-between gap-6 pb-6">
        <h2 id="writing-title" className="t-label">
          (Writing)
        </h2>
        <span className="text-site-muted">Latest {Math.min(LATEST, posts.length)}</span>
      </header>

      <ul>
        {posts.slice(0, LATEST).map((post) => (
          <li key={post.id} className="border-t border-site-line">
            <div className="overflow-hidden">
              <div data-writing-row>
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
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="t-label border-t border-site-line pt-6">
        <RollLink href="/blogs">{`All writing (${posts.length}) →`}</RollLink>
      </div>
    </WritingMotion>
  )
}
