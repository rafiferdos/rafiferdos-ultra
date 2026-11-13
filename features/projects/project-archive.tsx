'use client'

import { useMemo, useState } from 'react'
import type { Project } from '@/data/site-content'
import { ProjectRow } from '@/features/projects/project-row'
import { cn } from '@/lib/utils'

const ALL = 'All'

function Pills({ label, values, active, onPick }: { label: string; values: string[]; active: string; onPick: (value: string) => void }) {
  return (
    <div role="group" aria-label={label} className="t-label flex flex-wrap items-center gap-2">
      <span className="mr-2 text-site-muted">{label}</span>
      {values.map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={active === value}
          onClick={() => onPick(value)}
          className={cn(
            'rounded-full border px-3 py-1.5 transition-colors',
            active === value
              ? 'border-site-ink bg-site-ink text-site-bg'
              : 'border-site-line-strong text-site-muted hover:border-site-accent hover:text-site-accent'
          )}
        >
          {value}
        </button>
      ))}
    </div>
  )
}

const unique = (values: string[]) => [ALL, ...Array.from(new Set(values)).sort()]

export function ProjectArchive({ projects }: { projects: Project[] }) {
  const [discipline, setDiscipline] = useState(ALL)
  const [type, setType] = useState(ALL)
  const [tag, setTag] = useState(ALL)
  const [query, setQuery] = useState('')

  const disciplines = useMemo(() => unique(projects.map((project) => project.discipline)), [projects])
  const types = useMemo(() => unique(projects.map((project) => project.projectType)), [projects])
  const tags = useMemo(() => unique(projects.flatMap((project) => [...project.tags, ...project.techStack])), [projects])

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return projects.filter((project) => {
      const stack = [...project.tags, ...project.techStack]
      if (discipline !== ALL && project.discipline !== discipline) return false
      if (type !== ALL && project.projectType !== type) return false
      if (tag !== ALL && !stack.includes(tag)) return false
      if (!needle) return true
      const haystack = [project.title, project.description, project.subtitle, project.role, project.status, ...(project.outcomes ?? []), ...stack]
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [projects, discipline, type, tag, query])

  const filtered = discipline !== ALL || type !== ALL || tag !== ALL || query !== ''
  const reset = () => {
    setDiscipline(ALL)
    setType(ALL)
    setTag(ALL)
    setQuery('')
  }

  return (
    <div className="archive">
      {projects.length > 1 && (
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
          {disciplines.length > 2 && <Pills label="Role" values={disciplines} active={discipline} onPick={setDiscipline} />}
          {types.length > 2 && <Pills label="Type" values={types} active={type} onPick={setType} />}
          <div className="t-label flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-3 text-site-muted">
              Stack
              <select
                value={tag}
                onChange={(event) => setTag(event.target.value)}
                className="border-b border-site-line-strong bg-site-bg py-1 text-site-ink"
              >
                {tags.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <span role="status" aria-live="polite" className="text-site-muted">
              ({shown.length} / {projects.length})
            </span>
            {filtered && (
              <button type="button" onClick={reset} className="hover:text-site-accent">
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {shown.length === 0 ? (
        <p className="t-label border-t border-site-line py-12 text-site-muted">
          {projects.length === 0 ? '(No projects yet)' : '(No matches)'}
        </p>
      ) : (
        <ul className="border-b border-site-line">
          {shown.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} priority={index === 0} />
          ))}
        </ul>
      )}
    </div>
  )
}
