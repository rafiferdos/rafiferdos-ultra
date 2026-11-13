import { PauseMotion } from '@/components/site/pause-motion'
import { RollLink } from '@/components/site/roll-link'
import type { Project } from '@/data/site-content'
import { WorkMotion } from '@/features/home/work-motion'
import { pickFeatured } from '@/features/projects/featured'
import { ProjectCover } from '@/features/projects/project-cover'
import { ProjectRow } from '@/features/projects/project-row'
import { profile } from '@/lib/site'

const pad = (value: number) => String(value).padStart(2, '0')

function yearRange(projects: Project[]) {
  const years = projects.map(({ year }) => year).filter((year): year is number => Boolean(year))
  if (!years.length) return null
  const [first, last] = [Math.min(...years), Math.max(...years)]
  return first === last ? String(first) : `${first} to ${last}`
}

export function SelectedWork({ projects }: { projects: Project[] }) {
  const rows = pickFeatured(projects)
  const count = rows.length
  const years = yearRange(rows)

  return (
    <WorkMotion id="work" className="work scroll-mt-16 px-gutter py-section">
      <header className="t-label flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pb-6">
        <h2 id="work-title" className="t-label">
          Selected work ({pad(count)})
        </h2>
        <PauseMotion />
        <span className="text-site-muted">{years ?? ' '}</span>
      </header>

      {count === 0 ? (
        <div className="work-empty flex min-h-[60vh] flex-col justify-center border-t border-site-line">
          <p className="t-h3 max-w-[22ch]">Case studies are being written up.</p>
          <p className="text-lead mt-4 text-site-muted">
            Meanwhile, the code is on GitHub{' '}
            <RollLink
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="text-site-ink"
            >
              →
            </RollLink>
          </p>
        </div>
      ) : (
        <div className="work-body">
          <ol aria-labelledby="work-title" className="work-list">
            {rows.map((project, index) => (
              <ProjectRow key={project.id} project={project} index={index} />
            ))}
          </ol>

          <aside aria-hidden className="work-dock">
            <div className="work-dock-sticky">
              <div className="work-dock-box">
                {rows.map((project) => (
                  <div key={project.id} data-work-frame className="work-frame">
                    <div data-frame-outer className="absolute inset-0 overflow-hidden">
                      <div data-frame-inner className="absolute inset-0">
                        <ProjectCover project={project} decorative sizes="(min-width: 768px) 40vw, 0px" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="work-dock-meta">
                <div className="work-roll t-index">
                  <div data-work-roll>
                    {rows.map((project, index) => (
                      <span key={project.id}>{pad(index + 1)}</span>
                    ))}
                  </div>
                </div>
                {count > 1 && (
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="work-roll t-label text-site-muted">
                      <div data-work-roll>
                        {rows.map((project, index) => (
                          <span key={project.id}>
                            ({pad(index + 1)} / {pad(count)})
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="h-px bg-site-line">
                      <div
                        data-work-bar
                        className="h-full origin-left bg-site-accent"
                        style={{ transform: `scaleX(${1 / count})` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      {projects.length > 0 && (
        <div className="t-label mt-10 flex justify-end">
          <RollLink href="/projects">{`All projects (${projects.length}) →`}</RollLink>
        </div>
      )}

      <div data-work-preview aria-hidden className="work-preview" />
    </WorkMotion>
  )
}
