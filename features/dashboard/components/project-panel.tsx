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
import type { Project } from '@/data/site-content'
import { technologyCatalog } from '@/data/technology-catalog'
import { getApiError } from '@/lib/http/client'
import { Plus, Upload } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { useSaveContent, useUploadMedia } from '../hooks/use-dashboard-content'
import { ContentList } from './content-list'

const projectTags = [
  'AI',
  'API design',
  'Authentication',
  'CMS',
  'Commerce',
  'Conversion',
  'Dashboard',
  'Data',
  'Ecommerce',
  'Infrastructure',
  'Mobile',
  'Notifications',
  'Open source',
  'Performance',
  'Production',
  'Realtime',
  'SaaS',
  'SEO'
]

type ProjectDraft = {
  id?: string
  title: string
  subtitle: string
  description: string
  role: string
  year: string
  status: string
  discipline: Project['discipline']
  projectType: Project['projectType']
  techStack: string[]
  tags: string[]
  outcomes: string
  liveUrl: string
  githubUrl: string
  caseStudyUrl: string
  imageUrl: string
  accent: string
  featured: boolean
  sortOrder: string
}

const emptyProject = (): ProjectDraft => ({
  title: '',
  subtitle: '',
  description: '',
  role: '',
  year: String(new Date().getFullYear()),
  status: 'Published',
  discipline: 'Full stack',
  projectType: 'Personal project',
  techStack: [],
  tags: [],
  outcomes: '',
  liveUrl: '',
  githubUrl: '',
  caseStudyUrl: '',
  imageUrl: '',
  accent: '#f59e0b',
  featured: true,
  sortOrder: '0'
})

export function ProjectPanel({
  items,
  onDelete
}: {
  items: Project[]
  onDelete: (id: string, label: string) => void
}) {
  const [draft, setDraft] = useState<ProjectDraft>(() => ({
    ...emptyProject(),
    sortOrder: String(items.length)
  }))
  const save = useSaveContent()
  const upload = useUploadMedia()
  const patch = <K extends keyof ProjectDraft>(
    key: K,
    value: ProjectDraft[K]
  ) => setDraft((current) => ({ ...current, [key]: value }))

  function edit(item: Project) {
    setDraft({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle || '',
      description: item.description,
      role: item.role || '',
      year: String(item.year || new Date().getFullYear()),
      status: item.status || 'Published',
      discipline: item.discipline,
      projectType: item.projectType,
      techStack: item.techStack,
      tags: item.tags,
      outcomes: item.outcomes?.join('\n') || '',
      liveUrl: item.liveUrl || '',
      githubUrl: item.githubUrl || '',
      caseStudyUrl: item.caseStudyUrl || '',
      imageUrl: item.imageUrl || '',
      accent: item.accent,
      featured: item.featured,
      sortOrder: String(
        Math.max(
          0,
          items.findIndex(({ id }) => id === item.id)
        )
      )
    })
    window.scrollTo({ top: 160, behavior: 'smooth' })
  }
  function reset() {
    setDraft({ ...emptyProject(), sortOrder: String(items.length) })
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    save.mutate(
      {
        entity: 'projects',
        id: draft.id,
        record: {
          title: draft.title.trim(),
          subtitle: draft.subtitle.trim() || null,
          description: draft.description.trim(),
          role: draft.role.trim() || null,
          year: draft.year ? Number(draft.year) : null,
          status: draft.status,
          discipline: draft.discipline,
          projectType: draft.projectType,
          techStack: draft.techStack,
          tags: draft.tags,
          outcomes: draft.outcomes
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean),
          liveUrl: draft.liveUrl || null,
          githubUrl: draft.githubUrl || null,
          caseStudyUrl: draft.caseStudyUrl || null,
          imageUrl: draft.imageUrl || null,
          accent: draft.accent,
          featured: draft.featured,
          sortOrder: Number(draft.sortOrder || 0)
        }
      },
      {
        onSuccess: () => {
          toast.success(draft.id ? 'Project updated' : 'Project published')
          reset()
        },
        onError: (error) =>
          toast.error(getApiError(error, 'Project could not be saved'))
      }
    )
  }
  function uploadImage(file?: File) {
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
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
      <Card className="h-fit rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="size-4 text-primary" />
            {draft.id ? 'Edit project' : 'Add project'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-5">
            <Field label="Project title">
              <Input
                required
                value={draft.title}
                onChange={(e) => patch('title', e.target.value)}
                placeholder="A clear product name"
              />
            </Field>
            <Field label="Short supporting line">
              <Input
                value={draft.subtitle}
                onChange={(e) => patch('subtitle', e.target.value)}
                placeholder="What makes it useful"
              />
            </Field>
            <Field label="Outcome-focused description">
              <Textarea
                required
                rows={4}
                value={draft.description}
                onChange={(e) => patch('description', e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your role">
                <Input
                  value={draft.role}
                  onChange={(e) => patch('role', e.target.value)}
                  placeholder="Lead full-stack engineer"
                />
              </Field>
              <Field label="Year">
                <Input
                  type="number"
                  min="2000"
                  max="2100"
                  value={draft.year}
                  onChange={(e) => patch('year', e.target.value)}
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Discipline">
                <Select
                  value={draft.discipline}
                  onValueChange={(v) =>
                    patch('discipline', v as Project['discipline'])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Full stack', 'Frontend', 'Backend', 'Mobile'].map(
                      (v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Project type">
                <Select
                  value={draft.projectType}
                  onValueChange={(v) =>
                    patch('projectType', v as Project['projectType'])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'Client project',
                      'Professional work',
                      'Personal project',
                      'Community project'
                    ].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Status">
                <Select
                  value={draft.status}
                  onValueChange={(v) => patch('status', v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'Published',
                      'In development',
                      'Maintained',
                      'Archived'
                    ].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field
              label={`Technology stack · ${technologyCatalog.length}+ suggestions`}
            >
              <CreatableMultiSelect
                value={draft.techStack}
                onChange={(v) => patch('techStack', v)}
                options={technologyCatalog}
                placeholder="Search Next.js, PostgreSQL, AWS…"
              />
            </Field>
            <Field label="Project tags">
              <CreatableMultiSelect
                value={draft.tags}
                onChange={(v) => patch('tags', v)}
                options={projectTags}
                placeholder="Search or create a project tag…"
              />
            </Field>
            <Field label="Key outcomes · one per line">
              <Textarea
                rows={4}
                value={draft.outcomes}
                onChange={(e) => patch('outcomes', e.target.value)}
                placeholder={
                  'Reduced checkout time by 28%\nShipped across iOS and Android'
                }
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Live URL">
                <Input
                  type="url"
                  value={draft.liveUrl}
                  onChange={(e) => patch('liveUrl', e.target.value)}
                />
              </Field>
              <Field label="GitHub URL">
                <Input
                  type="url"
                  value={draft.githubUrl}
                  onChange={(e) => patch('githubUrl', e.target.value)}
                />
              </Field>
            </div>
            <Field label="Case study URL">
              <Input
                type="url"
                value={draft.caseStudyUrl}
                onChange={(e) => patch('caseStudyUrl', e.target.value)}
              />
            </Field>
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
                    onChange={(e) => uploadImage(e.target.files?.[0])}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </Button>
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Accent">
                <Input
                  type="color"
                  value={draft.accent}
                  onChange={(e) => patch('accent', e.target.value)}
                  className="p-1"
                />
              </Field>
              <Field label="Sort order">
                <Input
                  type="number"
                  value={draft.sortOrder}
                  onChange={(e) => patch('sortOrder', e.target.value)}
                />
              </Field>
              <div className="flex items-end">
                <div className="flex h-9 w-full items-center justify-between rounded-md border px-3">
                  <Label htmlFor="project-featured">Featured</Label>
                  <Switch
                    id="project-featured"
                    checked={draft.featured}
                    onCheckedChange={(v) => patch('featured', v)}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button disabled={save.isPending || !draft.techStack.length}>
                {save.isPending
                  ? 'Saving…'
                  : draft.id
                    ? 'Save changes'
                    : 'Publish project'}
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
          meta: `${item.discipline} · ${item.projectType} · ${item.status || 'Published'} · ${item.techStack.join(' · ')}`,
          imageUrl: item.imageUrl
        }))}
        onEdit={(id) => {
          const item = items.find((value) => value.id === id)
          if (item) edit(item)
        }}
        onDelete={(id) =>
          onDelete(id, items.find((item) => item.id === id)?.title || 'Project')
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
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
