import { RollLink } from '@/components/site/roll-link'
import type { Project } from '@/data/site-content'
import { ProjectCover } from '@/features/projects/project-cover'
import { cloudinaryFill } from '@/lib/cloudinary'

type Props = { project: Project; index: number }

const pad = (value: number) => String(value + 1).padStart(2, '0')

// One list row, shared by the home work list and the archive. Motion hooks in through data attributes.
export function ProjectRow({ project, index }: Props) {
  const href = project.caseStudyUrl || project.githubUrl
  const meta = [project.role, project.projectType].filter(Boolean).join(' & ')
  const title = <h3 className="t-work">{project.title}</h3>

  return (
    <li
      data-work-row
      data-preview={project.imageUrl ? cloudinaryFill(project.imageUrl, 640, 800) : undefined}
      data-cursor={href && project.imageUrl ? 'View' : undefined}
      className="work-row border-t border-site-line"
    >
      <div className="work-row-grid">
        <span className="t-label text-site-faint">{pad(index)}</span>
        <div data-work-title className="work-title min-w-0">
          {href ? (
            <a href={href} target="_blank" rel="noreferrer" className="work-title-link">
              {title}
            </a>
          ) : (
            title
          )}
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
          <ProjectCover project={project} sizes="(min-width: 768px) 20rem, 70vw" />
        </div>
      </div>
    </li>
  )
}
