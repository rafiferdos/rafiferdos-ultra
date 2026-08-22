'use client'

import { Reveal } from '@/components/ui/reveal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { BlogPost } from '@/data/site-content'
import { cn } from '@/lib/utils'
import {
  ArrowUpRight,
  Clock3,
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

type ViewMode = 'grid' | 'list'
type SortMode = 'newest' | 'oldest' | 'title' | 'quickest'

function minutes(readTime: string) {
  return Number.parseInt(readTime, 10) || 0
}

function tagsFor(post: BlogPost) {
  return post.tags?.length ? post.tags : [post.category]
}

export function WritingExplorer({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [format, setFormat] = useState('All')
  const [tag, setTag] = useState('All')
  const [year, setYear] = useState('All')
  const [length, setLength] = useState('Any length')
  const [difficulty, setDifficulty] = useState('All')
  const [language, setLanguage] = useState('All')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [sort, setSort] = useState<SortMode>('newest')
  const [view, setView] = useState<ViewMode>('grid')

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(posts.map((post) => post.category)))],
    [posts]
  )
  const formats = useMemo(
    () => [
      'All',
      ...Array.from(new Set(posts.map((post) => post.format || 'Article')))
    ],
    [posts]
  )
  const tags = useMemo(
    () => [
      'All',
      ...Array.from(new Set(posts.flatMap(tagsFor))).sort((a, b) =>
        a.localeCompare(b)
      )
    ],
    [posts]
  )
  const years = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(posts.map((post) => post.publishedAt.slice(0, 4)))
      ).sort((a, b) => b.localeCompare(a))
    ],
    [posts]
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return posts
      .filter((post) => {
        const searchable = [
          post.title,
          post.excerpt,
          post.category,
          post.format || 'Article',
          post.difficulty || 'Intermediate',
          post.language || 'English',
          ...tagsFor(post)
        ]
          .join(' ')
          .toLowerCase()
        const mins = minutes(post.readTime)
        const matchesLength =
          length === 'Any length' ||
          (length === 'Quick reads' && mins <= 5) ||
          (length === 'Deep dives' && mins > 5)
        return (
          (!needle || searchable.includes(needle)) &&
          (category === 'All' || post.category === category) &&
          (format === 'All' || (post.format || 'Article') === format) &&
          (tag === 'All' || tagsFor(post).includes(tag)) &&
          (year === 'All' || post.publishedAt.startsWith(year)) &&
          (difficulty === 'All' ||
            (post.difficulty || 'Intermediate') === difficulty) &&
          (language === 'All' || (post.language || 'English') === language) &&
          matchesLength &&
          (!featuredOnly || post.featured)
        )
      })
      .sort((a, b) => {
        if (sort === 'oldest') return a.publishedAt.localeCompare(b.publishedAt)
        if (sort === 'title') return a.title.localeCompare(b.title)
        if (sort === 'quickest')
          return minutes(a.readTime) - minutes(b.readTime)
        return b.publishedAt.localeCompare(a.publishedAt)
      })
  }, [
    category,
    difficulty,
    featuredOnly,
    format,
    language,
    length,
    posts,
    query,
    sort,
    tag,
    year
  ])

  const hasFilters =
    query ||
    category !== 'All' ||
    format !== 'All' ||
    tag !== 'All' ||
    year !== 'All' ||
    length !== 'Any length' ||
    difficulty !== 'All' ||
    language !== 'All' ||
    featuredOnly

  function reset() {
    setQuery('')
    setCategory('All')
    setFormat('All')
    setTag('All')
    setYear('All')
    setLength('Any length')
    setDifficulty('All')
    setLanguage('All')
    setFeaturedOnly(false)
  }

  return (
    <main className="min-h-svh pb-20 sm:pb-24">
      <section className="relative min-h-[600px] overflow-hidden border-b border-border/70 sm:min-h-[660px]">
        {/* <GradientWaves
          className="pointer-events-none absolute inset-0 z-0 opacity-95 saturate-125"
          horizonColor="#16082f"
          waveColor="#8b5cf6"
          crestColor="#fbbf24"
          speed={0.16}
          amplitude={1.9}
          detail="high"
          // brightness={0.9}
          // opacity={0.76}
          parallaxStrength={0.18}
        /> */}
        {/* <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/5 via-background/20 to-background" /> */}
        <div className="relative z-10 mx-auto flex min-h-[600px] max-w-7xl items-center px-4 pb-20 pt-28 sm:min-h-[660px] sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
          <Reveal className="max-w-5xl rounded-[2rem] p-5 backdrop-blur-md sm:p-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[.28em] text-primary">
              Field notes
            </p>
            <h1 className="mt-5 max-w-5xl text-balance text-[clamp(3rem,8vw,6.6rem)] font-semibold leading-[.92] tracking-[-.065em]">
              Clear thinking behind{' '}
              <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500 bg-clip-text text-transparent">
                the finished product.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-foreground/75 sm:text-lg sm:leading-8">
              Practical notes on frontend, backend, mobile, realtime systems and
              production AI.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="rounded-[1.6rem] border border-border/70 bg-card/90 p-4 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <span className="sr-only">Search articles</span>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search topics, tags or titles"
                className="h-11 w-full rounded-full bg-background pl-11 pr-4"
              />
            </label>
            <Select
              value={sort}
              onValueChange={(value) => setSort(value as SortMode)}
            >
              <SelectTrigger className="h-11 w-full rounded-full bg-background md:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="title">Title A–Z</SelectItem>
                <SelectItem value="quickest">Quickest reads</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex rounded-full border border-border bg-background p-1">
              <ViewButton
                active={view === 'grid'}
                onClick={() => setView('grid')}
                label="Grid view"
              >
                <Grid2X2 className="size-4" />
              </ViewButton>
              <ViewButton
                active={view === 'list'}
                onClick={() => setView('list')}
                label="List view"
              >
                <List className="size-4" />
              </ViewButton>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto border-t border-border/70 pt-4 [scrollbar-width:none]">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={cn(
                  'shrink-0 rounded-full border px-3 py-1.5 text-xs transition',
                  category === item
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 border-t border-border/70 pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <FilterSelect
              label="Format"
              value={format}
              values={formats}
              onChange={setFormat}
            />
            <FilterSelect
              label="Tag"
              value={tag}
              values={tags}
              onChange={setTag}
            />
            <FilterSelect
              label="Year"
              value={year}
              values={years}
              onChange={setYear}
            />
            <FilterSelect
              label="Length"
              value={length}
              values={['Any length', 'Quick reads', 'Deep dives']}
              onChange={setLength}
            />
            <FilterSelect
              label="Difficulty"
              value={difficulty}
              values={['All', 'Beginner', 'Intermediate', 'Advanced']}
              onChange={setDifficulty}
            />
            <FilterSelect
              label="Language"
              value={language}
              values={['All', 'English', 'Bangla']}
              onChange={setLanguage}
            />
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="size-4" />
            Showing {filtered.length} of {posts.length} articles
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFeaturedOnly((value) => !value)}
              aria-pressed={featuredOnly}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                featuredOnly
                  ? 'border-primary/40 bg-primary/10 text-foreground'
                  : 'border-border bg-background hover:text-foreground'
              )}
            >
              <Sparkles className="size-3.5 text-primary" />
              Featured only
            </button>
            {hasFilters && (
              <button
                onClick={reset}
                className="font-semibold text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div
          aria-live="polite"
          className={cn(
            'mt-7 grid gap-5',
            view === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
          )}
        >
          {filtered.map((post, index) => (
            <ArticleCard key={post.id} post={post} index={index} view={view} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mt-7 rounded-[1.6rem] border border-dashed border-border p-12 text-center sm:p-16">
            <Sparkles className="mx-auto size-5 text-primary" />
            <p className="mt-4 font-semibold">
              No article matches every filter.
            </p>
            <button
              onClick={reset}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Start again
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

function ArticleCard({
  post,
  index,
  view
}: {
  post: BlogPost
  index: number
  view: ViewMode
}) {
  return (
    <Reveal delay={Math.min(index * 0.04, 0.2)} className="h-full">
      <Link
        href={`/blogs/${post.slug}`}
        className={cn(
          'group flex h-full overflow-hidden rounded-[1.6rem] border border-border/70 bg-card shadow-lg shadow-black/5 transition hover:-translate-y-1 hover:border-primary/30',
          view === 'grid'
            ? 'min-h-[340px] flex-col justify-between p-6 sm:p-7'
            : 'flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6'
        )}
      >
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.coverAlt || ''}
            className={cn(
              'shrink-0 rounded-2xl object-cover',
              view === 'grid'
                ? 'mb-5 aspect-[16/9] w-full'
                : 'aspect-[16/10] w-full sm:w-52'
            )}
            loading="lazy"
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-primary/25 bg-primary/8 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-foreground">
                {post.category}
              </span>
              <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
                {post.format || 'Article'}
              </span>
              {post.featured && (
                <span className="rounded-full bg-foreground px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-background">
                  Featured
                </span>
              )}
              <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
                {post.difficulty || 'Intermediate'}
              </span>
              <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
                {post.language || 'English'}
              </span>
            </div>
            <h2
              className={cn(
                'mt-5 font-semibold tracking-[-.04em]',
                view === 'grid' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
              )}
            >
              {post.title}
            </h2>
            <p
              className={cn(
                'mt-3 text-sm leading-7 text-muted-foreground',
                view === 'list' && 'max-w-3xl'
              )}
            >
              {post.excerpt}
            </p>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-3">
              <time dateTime={post.publishedAt}>
                {new Intl.DateTimeFormat('en', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }).format(new Date(post.publishedAt))}
              </time>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5" />
                {post.readTime}
              </span>
            </span>
            <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

function ViewButton({
  active,
  onClick,
  label,
  children
}: {
  active: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'flex size-9 items-center justify-center rounded-full transition',
        active
          ? 'bg-foreground text-background'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
    </button>
  )
}

function FilterSelect({
  label,
  value,
  values,
  onChange
}: {
  label: string
  value: string
  values: string[]
  onChange: (value: string) => void
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 min-w-0 w-full rounded-xl bg-background text-xs font-normal normal-case tracking-normal">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {values.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
