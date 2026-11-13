import { RollLink } from '@/components/site/roll-link'
import type { Project } from '@/data/site-content'
import { projectKey } from '@/lib/slug'
import Link from 'next/link'
import { ProjectCover } from '@/features/projects/project-cover'

type Props = { project: Project; index: number; priority?: boolean }

const pad = (value: number) => String(value + 1).padStart(2, '0')

// One list row, shared by the home work list and the archive. Motion hooks in through data attributes.
export function ProjectRow({ project, index, priority }: Props) {
  const href = `/projects/${projectKey(project)}`
  const meta = [project.role, project.projectType].filter(Boolean).join(' & ')
  const title = <h3 className="t-work">{project.title}</h3>

  return (
    <li
      data-work-row
      data-has-cover={project.imageUrl ? '' : undefined}
      data-cursor={project.imageUrl ? 'View' : undefined}
      className="work-row border-t border-site-line"
    >
      <div className="work-row-grid">
        <span className="t-label text-site-muted">{pad(index)}</span>
        <div data-work-title className="work-title min-w-0">
          <Link href={href} className="work-title-link">
            {title}
          </Link>
          {meta && <p className="t-label mt-2 text-site-muted">{meta}</p>}
        </div>
        <div className="t-label flex flex-col items-start gap-1 text-site-muted md:items-end">
          {project.liveUrl && (
            <RollLink
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="text-site-ink"
            >
              (Live)
            </RollLink>
          )}
          {project.year && <span>{project.year}</span>}
        </div>
        <div className="work-inline-cover">
          <ProjectCover project={project} priority={priority} sizes="(min-width: 768px) 20rem, 70vw" />
        </div>
      </div>
    </li>
  )
}
