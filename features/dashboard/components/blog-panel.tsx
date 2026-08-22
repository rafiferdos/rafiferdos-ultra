'use client'

import { CreatableMultiSelect } from '@/components/dashboard/creatable-multi-select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { BlogPost } from '@/data/site-content'
import { technologyCatalog } from '@/data/technology-catalog'
import { getApiError } from '@/lib/http/client'
import {
  emptyRichTextValue,
  parseRichTextValue,
  richTextToPlainText,
  type RichTextValue
} from '@/lib/rich-text'
import { Plus, Upload } from 'lucide-react'
import dynamic from 'next/dynamic'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { useSaveContent, useUploadMedia } from '../hooks/use-dashboard-content'
import { ContentList } from './content-list'

const categories = [
  'AI Engineering',
  'Architecture',
  'Engineering',
  'Frontend',
  'Backend',
  'Mobile',
  'Product',
  'Performance',
  'Career'
]
const RichTextEditor = dynamic(
  () =>
    import('@/components/dashboard/rich-text-editor').then(
      (module) => module.RichTextEditor
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[420px] animate-pulse rounded-xl border bg-muted/40" />
    )
  }
)
const tagOptions = [
  ...technologyCatalog,
  ...[
    'Architecture',
    'Career',
    'Case study',
    'Performance',
    'Product thinking',
    'Tutorial',
    'UX'
  ].map((name) => ({ name, category: 'Editorial' }))
]

type BlogDraft = {
  id?: string
  title: string
  slug: string
  category: string
  format: NonNullable<BlogPost['format']>
  tags: string[]
  excerpt: string
  contentJson: RichTextValue
  publishedAt: string
  readTime: string
  imageUrl: string
  coverAlt: string
  series: string
  difficulty: string
  language: string
  seoTitle: string
  seoDescription: string
  canonicalUrl: string
  published: boolean
  featured: boolean
}

const emptyBlog = (): BlogDraft => ({
  title: '',
  slug: '',
  category: 'Engineering',
  format: 'Article',
  tags: [],
  excerpt: '',
  contentJson: emptyRichTextValue,
  publishedAt: new Date().toISOString().slice(0, 10),
  readTime: '',
  imageUrl: '',
  coverAlt: '',
  series: '',
  difficulty: 'Intermediate',
  language: 'English',
  seoTitle: '',
  seoDescription: '',
  canonicalUrl: '',
  published: true,
  featured: false
})

export function BlogPanel({
  items,
  onDelete
}: {
  items: BlogPost[]
  onDelete: (id: string, label: string) => void
}) {
  const [draft, setDraft] = useState<BlogDraft>(emptyBlog)
  const [editorVersion, setEditorVersion] = useState(0)
  const save = useSaveContent()
  const upload = useUploadMedia()
  const patch = <K extends keyof BlogDraft>(key: K, value: BlogDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  function reset() {
    setDraft(emptyBlog())
    setEditorVersion((value) => value + 1)
  }
  function edit(item: BlogPost) {
    setDraft({
      id: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category,
      format: item.format || 'Article',
      tags: item.tags || [],
      excerpt: item.excerpt,
      contentJson: parseRichTextValue(item.contentJson, item.content),
      publishedAt: item.publishedAt.slice(0, 10),
      readTime: item.readTime,
      imageUrl: item.imageUrl || '',
      coverAlt: item.coverAlt || '',
      series: item.series || '',
      difficulty: item.difficulty || 'Intermediate',
      language: item.language || 'English',
      seoTitle: item.seoTitle || '',
      seoDescription: item.seoDescription || '',
      canonicalUrl: item.canonicalUrl || '',
      published: item.published,
      featured: item.featured || false
    })
    setEditorVersion((value) => value + 1)
    window.scrollTo({ top: 160, behavior: 'smooth' })
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const content = richTextToPlainText(draft.contentJson)
    const slug = (draft.slug || draft.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const readTime =
      draft.readTime ||
      `${Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 220))} min read`
    save.mutate(
      {
        entity: 'blogs',
        id: draft.id,
        record: {
          slug,
          title: draft.title.trim(),
          excerpt: draft.excerpt.trim(),
          content,
          contentJson: draft.contentJson,
          category: draft.category,
          format: draft.format,
          tags: draft.tags,
          publishedAt: draft.publishedAt,
          readTime,
          imageUrl: draft.imageUrl || null,
          coverAlt: draft.coverAlt || null,
          series: draft.series || null,
          difficulty: draft.difficulty,
          language: draft.language,
          featured: draft.featured,
          seoTitle: draft.seoTitle || null,
          seoDescription: draft.seoDescription || null,
          canonicalUrl: draft.canonicalUrl || null,
          published: draft.published
        }
      },
      {
        onSuccess: () => {
          toast.success(draft.published ? 'Article published' : 'Draft saved')
          reset()
        },
        onError: (error) =>
          toast.error(getApiError(error, 'Article could not be saved'))
      }
    )
  }
  function uploadCover(file?: File) {
    if (!file) return
    upload.mutate(file, {
      onSuccess: ({ url }) => {
        patch('imageUrl', url)
        toast.success('Cover uploaded')
      },
      onError: (error) => toast.error(getApiError(error, 'Upload failed'))
    })
  }

  return (
    <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1.25fr)_minmax(22rem,.75fr)]">
      <Card className="min-w-0 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="size-4 text-primary" />
            {draft.id ? 'Edit article' : 'Write article'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-5">
            <Field label="Article title">
              <Input
                required
                value={draft.title}
                onChange={(e) => patch('title', e.target.value)}
                placeholder="A useful, specific headline"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Slug">
                <Input
                  value={draft.slug}
                  onChange={(e) => patch('slug', e.target.value)}
                  placeholder="Generated from title"
                />
              </Field>
              <Field label="Series">
                <Input
                  value={draft.series}
                  onChange={(e) => patch('series', e.target.value)}
                  placeholder="Optional article series"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Category">
                <Select
                  value={draft.category}
                  onValueChange={(v) => patch('category', v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Format">
                <Select
                  value={draft.format}
                  onValueChange={(v) =>
                    patch('format', v as BlogDraft['format'])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Article', 'Guide', 'Case study', 'Note'].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Difficulty">
                <Select
                  value={draft.difficulty}
                  onValueChange={(v) => patch('difficulty', v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Beginner', 'Intermediate', 'Advanced'].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Language">
                <Select
                  value={draft.language}
                  onValueChange={(v) => patch('language', v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['English', 'Bangla'].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Topics and technologies">
              <CreatableMultiSelect
                value={draft.tags}
                onChange={(v) => patch('tags', v)}
                options={tagOptions}
                placeholder="Search 500+ topics and technologies…"
                maxVisible={10}
              />
            </Field>
            <Field label="Short introduction">
              <Textarea
                required
                rows={3}
                value={draft.excerpt}
                onChange={(e) => patch('excerpt', e.target.value)}
                maxLength={320}
              />
              <span className="text-right text-xs text-muted-foreground">
                {draft.excerpt.length}/320
              </span>
            </Field>
            <Field label="Article body · rich content is saved as structured JSON">
              <RichTextEditor
                key={`${draft.id || 'new'}-${editorVersion}`}
                editorKey={`${draft.id || 'new'}-${editorVersion}`}
                value={draft.contentJson}
                onChange={(v) => patch('contentJson', v)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Publish date">
                <Input
                  type="date"
                  value={draft.publishedAt}
                  onChange={(e) => patch('publishedAt', e.target.value)}
                />
              </Field>
              <Field label="Read time override">
                <Input
                  value={draft.readTime}
                  onChange={(e) => patch('readTime', e.target.value)}
                  placeholder="Automatically calculated"
                />
              </Field>
            </div>
            <Field label="Cover image">
              <div className="flex gap-2">
                <Input
                  value={draft.imageUrl}
                  onChange={(e) => patch('imageUrl', e.target.value)}
                  placeholder="Cloudinary URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="relative shrink-0"
                >
                  <Upload />
                  {upload.isPending ? 'Uploading…' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={upload.isPending}
                    onChange={(e) => uploadCover(e.target.files?.[0])}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </Button>
              </div>
            </Field>
            <Field label="Cover image alternative text">
              <Input
                value={draft.coverAlt}
                onChange={(e) => patch('coverAlt', e.target.value)}
                placeholder="Describe the image for readers using screen readers"
              />
            </Field>
            <details className="rounded-xl border bg-muted/20 p-4">
              <summary className="cursor-pointer text-sm font-semibold">
                Search and sharing options
              </summary>
              <div className="mt-4 grid gap-4">
                <Field label="SEO title">
                  <Input
                    value={draft.seoTitle}
                    onChange={(e) => patch('seoTitle', e.target.value)}
                    maxLength={70}
                  />
                </Field>
                <Field label="SEO description">
                  <Textarea
                    rows={2}
                    value={draft.seoDescription}
                    onChange={(e) => patch('seoDescription', e.target.value)}
                    maxLength={170}
                  />
                </Field>
                <Field label="Canonical URL">
                  <Input
                    type="url"
                    value={draft.canonicalUrl}
                    onChange={(e) => patch('canonicalUrl', e.target.value)}
                  />
                </Field>
              </div>
            </details>
            <div className="flex flex-wrap gap-6 rounded-xl border bg-muted/20 p-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="blog-published"
                  checked={draft.published}
                  onCheckedChange={(v) => patch('published', v)}
                />
                <Label htmlFor="blog-published">Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="blog-featured"
                  checked={draft.featured}
                  onCheckedChange={(v) => patch('featured', v)}
                />
                <Label htmlFor="blog-featured">Featured on home</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                disabled={save.isPending || !draft.title || !draft.excerpt}
              >
                {save.isPending
                  ? 'Saving…'
                  : draft.published
                    ? 'Publish article'
                    : 'Save draft'}
              </Button>
              {draft.id && (
                <Button type="button" variant="outline" onClick={reset}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <ContentList
        items={items.map((item) => ({
          id: item.id,
          title: item.title,
          meta: `${item.category} · ${item.format || 'Article'} · ${item.difficulty || 'Intermediate'} · ${item.published ? 'Published' : 'Draft'}`,
          imageUrl: item.imageUrl
        }))}
        onEdit={(id) => {
          const item = items.find((value) => value.id === id)
          if (item) edit(item)
        }}
        onDelete={(id) =>
          onDelete(id, items.find((item) => item.id === id)?.title || 'Article')
        }
      />
    </div>
  )
}

function Field({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid min-w-0 gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
