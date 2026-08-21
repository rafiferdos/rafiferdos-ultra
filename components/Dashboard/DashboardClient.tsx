'use client'

import { BlogPost, Project } from '@/data/site-content'
import {
  BookOpen,
  Cloud,
  FolderKanban,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Upload
} from 'lucide-react'
import { FormEvent, useCallback, useEffect, useState } from 'react'

type DashboardData = {
  projects: Project[]
  blogs: BlogPost[]
  backendConfigured: boolean
}

async function jsonRequest(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: { 'content-type': 'application/json', ...init?.headers }
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Request failed')
  return data
}

export function DashboardClient({
  authenticated,
  credentialsReady
}: {
  authenticated: boolean
  credentialsReady: boolean
}) {
  const [ready, setReady] = useState(authenticated)
  const [loginError, setLoginError] = useState('')

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoginError('')
    const values = Object.fromEntries(new FormData(event.currentTarget))
    try {
      await jsonRequest('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(values)
      })
      setReady(true)
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : 'Unable to sign in'
      )
    }
  }

  if (!ready)
    return (
      <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-16">
        <div className="absolute left-1/4 top-1/4 size-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 size-72 rounded-full bg-violet-500/10 blur-3xl" />
        <form
          onSubmit={login}
          className="relative w-full max-w-md rounded-[2rem] border border-border/70 bg-card/80 p-7 shadow-2xl backdrop-blur-2xl sm:p-9"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="mt-7 text-3xl font-semibold tracking-[-.045em]">
            Portfolio Studio
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Secure access to projects, articles and media.
          </p>
          {!credentialsReady && (
            <p className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/8 p-3 text-xs leading-5 text-amber-700 dark:text-amber-300">
              Admin environment variables are not configured yet. Use the
              included environment template.
            </p>
          )}
          <div className="mt-7 grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
                className="h-12 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Password
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="h-12 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
              />
            </label>
          </div>
          <button className="mt-6 h-12 w-full rounded-xl bg-foreground text-sm font-semibold text-background transition hover:opacity-90">
            Enter studio
          </button>
          <p aria-live="polite" className="mt-3 min-h-5 text-sm text-rose-500">
            {loginError}
          </p>
        </form>
      </main>
    )
  return <Studio onLogout={() => setReady(false)} />
}

function Studio({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<'projects' | 'blogs'>('projects')
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      setData(await jsonRequest('/api/admin/content'))
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Unable to load')
    } finally {
      setBusy(false)
    }
  }, [])
  useEffect(() => {
    load()
  }, [load])

  async function remove(entity: 'projects' | 'blogs', id: string) {
    if (!confirm('Delete this item permanently?')) return
    try {
      await jsonRequest('/api/admin/content', {
        method: 'DELETE',
        body: JSON.stringify({ entity, id })
      })
      await load()
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Delete failed')
    }
  }
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    onLogout()
  }

  return (
    <main className="min-h-svh bg-muted/20">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-base font-semibold tracking-tight">
              Rafi · Studio
            </p>
            <p className="hidden text-[10px] uppercase tracking-[.2em] text-muted-foreground sm:block">
              Portfolio control plane
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              aria-label="Refresh"
              className="rounded-full border border-border p-2.5"
            >
              <RefreshCw className={`size-4 ${busy ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-medium sm:px-4"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat
            icon={FolderKanban}
            value={data?.projects.length ?? '—'}
            label="Projects"
          />
          <Stat
            icon={BookOpen}
            value={data?.blogs.length ?? '—'}
            label="Articles"
          />
          <Stat
            icon={Cloud}
            value={data?.backendConfigured ? 'Live' : 'Preview'}
            label="Content backend"
          />
        </div>
        {!data?.backendConfigured && (
          <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-4 text-sm text-amber-800 dark:text-amber-200">
            Supabase is not connected. You can preview the dashboard and
            fallback content; connect the environment keys to publish edits.
          </div>
        )}
        <div className="mt-8 flex gap-2 rounded-full border border-border bg-background p-1.5 w-fit">
          {(['projects', 'blogs'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition ${tab === item ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="mt-4 min-h-5 text-sm text-rose-500">{error}</p>
        {tab === 'projects' ? (
          <ProjectPanel
            items={data?.projects || []}
            onSaved={load}
            onDelete={(id) => remove('projects', id)}
            setError={setError}
          />
        ) : (
          <BlogPanel
            items={data?.blogs || []}
            onSaved={load}
            onDelete={(id) => remove('blogs', id)}
            setError={setError}
          />
        )}
      </div>
    </main>
  )
}

function Stat({
  icon: Icon,
  value,
  label
}: {
  icon: typeof FolderKanban
  value: string | number
  label: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  )
}

const input =
  'h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10'
const textarea =
  'rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10'

function ProjectPanel({
  items,
  onSaved,
  onDelete,
  setError
}: {
  items: Project[]
  onSaved: () => Promise<void>
  onDelete: (id: string) => void
  setError: (value: string) => void
}) {
  const [imageUrl, setImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    setSaving(true)
    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setImageUrl(result.url)
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Upload failed')
    } finally {
      setSaving(false)
    }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const record = {
      id: crypto.randomUUID(),
      title: values.title,
      description: values.description,
      imageUrl,
      liveUrl: values.liveUrl || null,
      githubUrl: values.githubUrl || null,
      techStack: String(values.techStack)
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      discipline: values.discipline,
      projectType: values.projectType,
      tags: String(values.tags)
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      accent: values.accent,
      featured: true,
      sort_order: items.length
    }
    try {
      await jsonRequest('/api/admin/content', {
        method: 'POST',
        body: JSON.stringify({ entity: 'projects', record })
      })
      event.currentTarget.reset()
      setImageUrl('')
      await onSaved()
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <form
        onSubmit={save}
        className="h-fit rounded-2xl border border-border bg-background p-5"
      >
        <div className="flex items-center gap-2">
          <Plus className="size-4 text-primary" />
          <h2 className="font-semibold">Add project</h2>
        </div>
        <div className="mt-5 grid gap-3">
          <input
            name="title"
            required
            placeholder="Project title"
            className={input}
          />
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Outcome-focused description"
            className={textarea}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              name="discipline"
              className={input}
              defaultValue="Full stack"
            >
              <option>Full stack</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Mobile</option>
            </select>
            <select
              name="projectType"
              className={input}
              defaultValue="Personal project"
            >
              <option>Client project</option>
              <option>Professional work</option>
              <option>Personal project</option>
              <option>Community project</option>
            </select>
          </div>
          <input
            name="techStack"
            required
            placeholder="Stack: Next.js, TypeScript, PostgreSQL"
            className={input}
          />
          <input
            name="tags"
            required
            placeholder="Tags: Ecommerce, Realtime, Dashboard"
            className={input}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="liveUrl"
              type="url"
              placeholder="Live URL"
              className={input}
            />
            <input
              name="githubUrl"
              type="url"
              placeholder="GitHub URL"
              className={input}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="Cloudinary image URL"
              className={input}
            />
            <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-3 text-xs font-medium">
              <Upload className="size-4" /> Upload
              <input
                type="file"
                accept="image/*"
                onChange={upload}
                className="hidden"
              />
            </label>
          </div>
          <label className="flex items-center justify-between text-xs text-muted-foreground">
            Accent color
            <input
              name="accent"
              type="color"
              defaultValue="#f59e0b"
              className="size-9 rounded border-0 bg-transparent"
            />
          </label>
          <button
            disabled={saving}
            className="h-11 rounded-xl bg-foreground text-sm font-semibold text-background"
          >
            {saving ? 'Saving…' : 'Publish project'}
          </button>
        </div>
      </form>
      <ItemList
        items={items.map((item) => ({
          id: item.id,
          title: item.title,
          meta: `${item.discipline} · ${item.projectType} · ${item.techStack.join(' · ')}`,
          imageUrl: item.imageUrl
        }))}
        onDelete={onDelete}
      />
    </div>
  )
}

function BlogPanel({
  items,
  onSaved,
  onDelete,
  setError
}: {
  items: BlogPost[]
  onSaved: () => Promise<void>
  onDelete: (id: string) => void
  setError: (value: string) => void
}) {
  const [saving, setSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    setSaving(true)
    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setImageUrl(result.url)
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Upload failed')
    } finally {
      setSaving(false)
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    const slugSource = String(values.slug || values.title)
    const slug = slugSource
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const record = {
      id: crypto.randomUUID(),
      slug,
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
      category: values.category,
      format: values.format,
      tags: String(values.tags)
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      publishedAt: values.publishedAt || new Date().toISOString().slice(0, 10),
      readTime:
        values.readTime ||
        `${Math.max(1, Math.ceil(String(values.content).split(/\s+/).length / 220))} min read`,
      imageUrl: imageUrl || null,
      featured: values.featured === 'on',
      seoTitle: values.seoTitle || null,
      seoDescription: values.seoDescription || null,
      canonicalUrl: values.canonicalUrl || null,
      published: values.published === 'on'
    }
    try {
      await jsonRequest('/api/admin/content', {
        method: 'POST',
        body: JSON.stringify({ entity: 'blogs', record })
      })
      form.reset()
      setImageUrl('')
      await onSaved()
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
      <form
        onSubmit={save}
        className="h-fit rounded-2xl border border-border bg-background p-5"
      >
        <div className="flex items-center gap-2">
          <Plus className="size-4 text-primary" />
          <h2 className="font-semibold">Write article</h2>
        </div>
        <div className="mt-5 grid gap-3">
          <input
            name="title"
            required
            placeholder="Article title"
            className={input}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="slug"
              placeholder="Custom slug (optional)"
              className={input}
            />
            <input
              name="category"
              required
              placeholder="Category: Engineering"
              className={input}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <select name="format" defaultValue="Article" className={input}>
              <option>Article</option>
              <option>Guide</option>
              <option>Case study</option>
              <option>Note</option>
            </select>
            <input
              name="tags"
              required
              placeholder="Tags: Next.js, AI, API"
              className={input}
            />
          </div>
          <textarea
            name="excerpt"
            required
            rows={3}
            placeholder="Short introduction"
            className={textarea}
          />
          <textarea
            name="content"
            required
            rows={10}
            placeholder="Article body. Separate paragraphs with a blank line."
            className={textarea}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs text-muted-foreground">
              Publish date
              <input
                name="publishedAt"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                className={input}
              />
            </label>
            <label className="grid gap-1.5 text-xs text-muted-foreground">
              Read time override
              <input
                name="readTime"
                placeholder="Auto calculated"
                className={input}
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="Cloudinary cover image URL"
              className={input}
            />
            <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-4 text-xs font-medium">
              <Upload className="size-4" />
              Upload cover
              <input
                type="file"
                accept="image/*"
                onChange={upload}
                className="hidden"
              />
            </label>
          </div>
          <details className="rounded-xl border border-border bg-muted/20 p-4">
            <summary className="cursor-pointer text-sm font-semibold">
              Search and sharing options
            </summary>
            <div className="mt-4 grid gap-3">
              <input
                name="seoTitle"
                placeholder="SEO title (optional)"
                className={input}
              />
              <textarea
                name="seoDescription"
                rows={2}
                placeholder="SEO description (optional)"
                className={textarea}
              />
              <input
                name="canonicalUrl"
                type="url"
                placeholder="Canonical URL (optional)"
                className={input}
              />
            </div>
          </details>
          <div className="flex flex-wrap gap-x-5 gap-y-3 rounded-xl border border-border bg-muted/20 p-4">
            <label className="flex items-center gap-2 text-sm">
              <input name="published" type="checkbox" defaultChecked />
              Publish immediately
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input name="featured" type="checkbox" />
              Feature this article
            </label>
          </div>
          <button
            disabled={saving}
            className="h-11 rounded-xl bg-foreground text-sm font-semibold text-background"
          >
            {saving ? 'Saving…' : 'Publish article'}
          </button>
        </div>
      </form>
      <ItemList
        items={items.map((item) => ({
          id: item.id,
          title: item.title,
          meta: `${item.category} · ${item.format || 'Article'} · ${item.published ? 'Published' : 'Draft'}`,
          imageUrl: item.imageUrl
        }))}
        onDelete={onDelete}
      />
    </div>
  )
}

function ItemList({
  items,
  onDelete
}: {
  items: { id: string; title: string; meta: string; imageUrl?: string }[]
  onDelete: (id: string) => void
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4"
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt=""
              className="size-14 rounded-xl object-cover"
            />
          ) : (
            <div className="flex size-14 items-center justify-center rounded-xl bg-muted">
              <FolderKanban className="size-5 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{item.title}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {item.meta}
            </p>
          </div>
          <button
            onClick={() => onDelete(item.id)}
            aria-label={`Delete ${item.title}`}
            className="rounded-full border border-border p-2.5 text-muted-foreground transition hover:border-rose-500/30 hover:text-rose-500"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nothing here yet.
        </div>
      )}
    </div>
  )
}
