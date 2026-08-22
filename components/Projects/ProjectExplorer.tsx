'use client'

import { Project } from '@/data/site-content'
import { Reveal } from '@/components/ui/reveal'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ArrowUpRight, Github, Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'

const disciplines = [
  'All',
  'Full stack',
  'Frontend',
  'Backend',
  'Mobile'
] as const
const projectTypes = [
  'All',
  'Client project',
  'Professional work',
  'Personal project',
  'Community project'
] as const

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [discipline, setDiscipline] =
    useState<(typeof disciplines)[number]>('All')
  const [projectType, setProjectType] =
    useState<(typeof projectTypes)[number]>('All')
  const [tag, setTag] = useState('All')
  const [query, setQuery] = useState('')
  const tags = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(
          projects.flatMap((project) => [...project.tags, ...project.techStack])
        )
      ).sort()
    ],
    [projects]
  )
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesDiscipline =
        discipline === 'All' || project.discipline === discipline
      const matchesType =
        projectType === 'All' || project.projectType === projectType
      const matchesTag =
        tag === 'All' || [...project.tags, ...project.techStack].includes(tag)
      const haystack = [
        project.title,
        project.description,
        project.subtitle || '',
        project.role || '',
        project.status || '',
        ...(project.outcomes || []),
        project.discipline,
        project.projectType,
        ...project.tags,
        ...project.techStack
      ]
        .join(' ')
        .toLowerCase()
      return (
        matchesDiscipline &&
        matchesType &&
        matchesTag &&
        (!needle || haystack.includes(needle))
      )
    })
  }, [discipline, projectType, projects, query, tag])

  function reset() {
    setDiscipline('All')
    setProjectType('All')
    setTag('All')
    setQuery('')
  }

  return (
    <div className="mt-14">
      <Reveal className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-xl shadow-black/5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full lg:max-w-sm">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <span className="sr-only">Search projects</span>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects, stacks or outcomes"
              className="h-12 w-full rounded-full bg-background pl-11 pr-4"
            />
          </label>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            {filtered.length} of {projects.length} projects
          </div>
        </div>
        <FilterRow
          label="Discipline"
          values={disciplines}
          active={discipline}
          onChange={setDiscipline}
        />
        <FilterRow
          label="Work type"
          values={projectTypes}
          active={projectType}
          onChange={setProjectType}
        />
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
          <span className="mr-1 text-xs font-semibold">Stack or tag</span>
          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger className="h-9 w-auto max-w-full rounded-full bg-background text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tags.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(discipline !== 'All' ||
            projectType !== 'All' ||
            tag !== 'All' ||
            query) && (
            <button
              onClick={reset}
              className="ml-auto text-xs font-semibold text-primary hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </Reveal>

      <div
        aria-live="polite"
        className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((project, index) => (
          <Reveal
            key={project.id}
            delay={Math.min(index * 0.07, 0.28)}
            className="h-full"
          >
            <ProjectCard project={project} index={index} />
          </Reveal>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-border p-14 text-center">
          <p className="font-semibold">No projects match that combination.</p>
          <button
            onClick={reset}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Clear the filters
          </button>
        </div>
      )}
    </div>
  )
}

function FilterRow<T extends string>({
  label,
  values,
  active,
  onChange
}: {
  label: string
  values: readonly T[]
  active: T
  onChange: (value: T) => void
}) {
  return (
    <div className="mt-4 flex gap-2 overflow-x-auto border-t border-border/70 pt-4 [scrollbar-width:none]">
      <span className="mr-1 text-xs font-semibold">{label}</span>
      {values.map((value) => (
        <button
          key={value}
          aria-pressed={active === value}
          onClick={() => onChange(value)}
          className={cn(
            'shrink-0 rounded-full border px-3 py-1.5 text-xs transition',
            active === value
              ? 'border-foreground bg-foreground text-background'
              : 'border-border bg-background text-muted-foreground hover:text-foreground'
          )}
        >
          {value}
        </button>
      ))}
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="group flex min-h-[390px] flex-col overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-xl shadow-black/5 transition hover:-translate-y-1 hover:border-primary/25 sm:min-h-[420px] sm:rounded-[1.75rem]">
      <div
        className="relative aspect-[16/10] overflow-hidden border-b border-border/60"
        style={{
          background: `radial-gradient(circle at ${index % 2 ? '78% 24%' : '24% 24%'}, ${project.accent}66, transparent 38%), linear-gradient(145deg, #09090b, #18181b)`
        }}
      >
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={`${project.title} preview`}
            className="size-full object-cover transition duration-700 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="absolute inset-7 rounded-2xl border border-white/10 bg-white/[.035] p-5 backdrop-blur-xl">
            <div className="flex gap-1.5">
              <span className="size-2 rounded-full bg-rose-400" />
              <span className="size-2 rounded-full bg-amber-300" />
              <span className="size-2 rounded-full bg-emerald-400" />
            </div>
            <div className="mt-10 h-3 w-2/3 rounded-full bg-white/15" />
            <div className="mt-3 h-2 w-5/6 rounded-full bg-white/8" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <Badge primary>{project.discipline}</Badge>
          <Badge>{project.projectType}</Badge>
          {project.status && <Badge>{project.status}</Badge>}
          {project.tags.slice(0, 2).map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-[-.035em]">
          {project.title}
        </h2>
        {(project.role || project.year) && (
          <p className="mt-2 text-xs font-medium text-primary">
            {[project.role, project.year].filter(Boolean).join(' · ')}
          </p>
        )}
        {project.subtitle && (
          <p className="mt-2 text-sm font-medium text-foreground/80">
            {project.subtitle}
          </p>
        )}
        <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
          {project.description}
        </p>
        {project.outcomes?.length ? (
          <ul className="mt-4 space-y-1.5 text-xs leading-5 text-muted-foreground">
            {project.outcomes.slice(0, 2).map((outcome) => (
              <li key={outcome}>↗ {outcome}</li>
            ))}
          </ul>
        ) : null}
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-5">
          <p className="truncate font-mono text-[10px] text-muted-foreground">
            {project.techStack.join(' · ')}
          </p>
          <div className="flex gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} source`}
                className="rounded-full border border-border p-2.5 hover:text-primary"
              >
                <Github className="size-4" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target={
                  project.liveUrl.startsWith('http') ? '_blank' : undefined
                }
                rel="noreferrer"
                aria-label={`Open ${project.title}`}
                className="rounded-full border border-border p-2.5 hover:text-primary"
              >
                <ArrowUpRight className="size-4" />
              </a>
            )}
            {project.caseStudyUrl && (
              <a
                href={project.caseStudyUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Read ${project.title} case study`}
                className="rounded-full border border-border p-2.5 hover:text-primary"
              >
                <ArrowUpRight className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function Badge({
  children,
  primary = false
}: {
  children: React.ReactNode
  primary?: boolean
}) {
  return (
    <span
      className={cn(
        'rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.08em]',
        primary
          ? 'border-primary/30 bg-primary/10 text-foreground'
          : 'border-border bg-muted/50 text-muted-foreground'
      )}
    >
      {children}
    </span>
  )
}
