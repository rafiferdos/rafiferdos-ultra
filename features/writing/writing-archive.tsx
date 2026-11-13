'use client'

import { useMemo, useState } from 'react'
import type { BlogPost } from '@/data/site-content'
import { ArticleRow } from '@/features/writing/article-row'
import { cn } from '@/lib/utils'

const ALL = 'All'

export function WritingArchive({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState(ALL)
  const [query, setQuery] = useState('')

  const categories = useMemo(() => [ALL, ...Array.from(new Set(posts.map((post) => post.category))).sort()], [posts])
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return posts.filter((post) => {
      if (category !== ALL && post.category !== category) return false
      if (!needle) return true
      return [post.title, post.excerpt, post.category, ...(post.tags ?? [])].join(' ').toLowerCase().includes(needle)
    })
  }, [posts, category, query])

  return (
    <div>
      {posts.length > 1 && (
        <div className="flex flex-col gap-5 pb-10">
          <label className="block">
            <span className="t-label text-site-muted">Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full border-b border-site-line-strong bg-transparent py-3 text-lead outline-none transition-colors focus:border-site-accent"
            />
          </label>
          {categories.length > 2 && (
            <div role="group" aria-label="Category" className="t-label flex flex-wrap items-center gap-2">
              {categories.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={category === value}
                  onClick={() => setCategory(value)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 transition-colors',
                    category === value
                      ? 'border-site-ink bg-site-ink text-site-bg'
                      : 'border-site-line-strong text-site-muted hover:border-site-accent hover:text-site-accent'
                  )}
                >
                  {value}
                </button>
              ))}
              <span role="status" aria-live="polite" className="ml-2 text-site-muted">
                ({shown.length} / {posts.length})
              </span>
            </div>
          )}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="t-label border-t border-site-line py-12 text-site-muted">
          {posts.length === 0 ? '(No articles yet)' : '(No matches)'}
        </p>
      ) : (
        <ul className="border-b border-site-line">
          {shown.map((post) => (
            <li key={post.id} className="border-t border-site-line">
              <ArticleRow post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
