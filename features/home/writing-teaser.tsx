import { RollLink } from '@/components/site/roll-link'
import type { BlogPost } from '@/data/site-content'
import { WritingMotion } from '@/features/home/writing-motion'
import { ArticleRow } from '@/features/writing/article-row'

const LATEST = 3

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
                <ArticleRow post={post} />
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
