import { FitText } from '@/components/site/fit-text'
import { RollLink } from '@/components/site/roll-link'
import { UpCloseView, type Media } from '@/features/home/up-close'
import { ProjectCover } from '@/features/projects/project-cover'
import { fitFallback, titleClass } from '@/features/projects/title-style'
import { PageMotion } from '@/features/motion/page-motion'
import { getProjectByKey, getProjects } from '@/lib/content-store'
import { OG_IMAGE, SITE_URL } from '@/lib/site'
import { projectKey } from '@/lib/slug'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

type Params = { params: Promise<{ slug: string }> }

const pad = (value: number) => String(value).padStart(2, '0')
// The title box is fixed-height, so this only has to be close: the em width of an uppercase condensed title.

export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: projectKey(project) }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectByKey(slug)
  if (!project) return { title: 'Project not found' }
  const url = `/projects/${projectKey(project)}`
  const description = project.subtitle || project.description
  const images = [project.imageUrl?.startsWith('http') ? project.imageUrl : OG_IMAGE]
  return {
    title: project.title,
    description,
    alternates: { canonical: `${SITE_URL}${url}` },
    openGraph: { title: project.title, description, url, type: 'website', images },
    twitter: { card: 'summary_large_image', title: project.title, description, images }
  }
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section
      data-reveal
      className="grid gap-4 border-t border-site-line px-gutter py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8"
    >
      <h2 className="t-label text-site-muted">[{label}]</h2>
      <div>{children}</div>
    </section>
  )
}

const Prose = ({ children }: { children: string }) => (
  <p className="max-w-[60ch] whitespace-pre-line text-lead">{children}</p>
)

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const project = await getProjectByKey(slug)
  if (!project) notFound()
  // Old links used the id; send them to the slug.
  if (project.slug && project.slug !== slug) permanentRedirect(`/projects/${project.slug}`)

  const all = await getProjects()
  const index = all.findIndex(({ id }) => id === project.id)
  const next = all.length > 1 ? all[(index + 1) % all.length] : null
  const meta = [
    project.role && { label: 'Role', value: project.role },
    project.year && { label: 'Year', value: String(project.year) },
    project.client && { label: 'Client', value: project.client },
    project.techStack.length > 0 && { label: 'Stack', value: project.techStack.join(', ') }
  ].filter((item): item is { label: string; value: string } => Boolean(item))
  const links = [
    project.liveUrl && { label: 'Live', href: project.liveUrl },
    project.githubUrl && { label: 'Source', href: project.githubUrl },
    project.caseStudyUrl && { label: 'Case study', href: project.caseStudyUrl }
  ].filter((link): link is { label: string; href: string } => Boolean(link))
  const gallery: Media[] = (project.gallery ?? []).map((item) => ({ ...item, label: item.label || project.title }))
  const ratio = Math.min(2.2, Math.max(1.2, (project.coverWidth ?? 16) / (project.coverHeight ?? 10)))

  return (
    <main id="main" className="min-h-svh pt-28">
      <PageMotion>
        <header className="px-gutter pb-10">
          <div className="t-label flex items-baseline justify-between gap-6 text-site-muted">
            <RollLink href="/projects">← All projects</RollLink>
            {index >= 0 && (
              <span>
                ({pad(index + 1)} / {pad(all.length)})
              </span>
            )}
          </div>
          <h1 data-page-title className="project-title mt-8">
            <FitText fallback={fitFallback(project.title)} className={titleClass}>
              {project.title}
            </FitText>
          </h1>
          {project.subtitle && (
            <p data-reveal className="t-h3 mt-8 max-w-[28ch]">
              {project.subtitle}
            </p>
          )}
          <p data-reveal className="mt-6 max-w-[60ch] text-lead text-site-muted">
            {project.description}
          </p>
        </header>

        {(meta.length > 0 || links.length > 0) && (
          <dl
            data-reveal
            className="t-label grid grid-cols-2 gap-x-6 gap-y-6 border-t border-site-line px-gutter py-8 md:grid-cols-4"
          >
            {meta.map(({ label, value }) => (
              <div key={label} className="min-w-0">
                <dt className="text-site-muted">[{label}]</dt>
                <dd className="mt-2 normal-case">{value}</dd>
              </div>
            ))}
            {links.length > 0 && (
              <div className="min-w-0">
                <dt className="text-site-muted">[Links]</dt>
                <dd className="mt-2 flex flex-col items-start gap-1">
                  {links.map(({ label, href }) => (
                    <RollLink key={label} href={href} target="_blank" rel="noreferrer">
                      {`${label} ↗`}
                    </RollLink>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        )}

        {project.imageUrl && (
          <div className="px-gutter pb-section">
            <div data-parallax className="relative overflow-hidden" style={{ aspectRatio: ratio }}>
              <div data-parallax-inner className="size-full">
                <ProjectCover project={project} sizes="100vw" priority />
              </div>
            </div>
          </div>
        )}

        {project.videoUrl && (
          <div data-reveal className="px-gutter pb-section">
            <video
              src={project.videoUrl}
              poster={project.imageUrl}
              controls
              playsInline
              preload="none"
              aria-label={`${project.title} walkthrough`}
              className="aspect-video w-full bg-site-surface"
            />
          </div>
        )}

        {project.overview && (
          <Block label="Overview">
            <Prose>{project.overview}</Prose>
          </Block>
        )}
        {project.challenge && (
          <Block label="Challenge">
            <Prose>{project.challenge}</Prose>
          </Block>
        )}
        {project.solution && (
          <Block label="Solution">
            <Prose>{project.solution}</Prose>
          </Block>
        )}
        {project.outcomes && project.outcomes.length > 0 && (
          <Block label="Results">
            <ol className="max-w-[60ch] divide-y divide-site-line text-lead">
              {project.outcomes.map((outcome, i) => (
                <li key={`${i}-${outcome}`} className="flex gap-4 py-3 first:pt-0">
                  <span className="t-label pt-2 text-site-muted">{pad(i + 1)}</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ol>
          </Block>
        )}

        {gallery.length > 0 && <UpCloseView media={gallery} title="(Gallery)" />}

        {next && (
          <Link href={`/projects/${projectKey(next)}`} data-transition-title={next.title} data-next data-cursor="Open" className="next-project">
            <div className="mb-10 flex items-start justify-between gap-6">
              <p className="t-label">[Next project]</p>
              {next.imageUrl && (
                <div className="next-project-cover" aria-hidden>
                  <ProjectCover project={next} decorative sizes="14vw" />
                </div>
              )}
            </div>
            <FitText fallback={fitFallback(next.title)} className={titleClass}>
              {next.title}
            </FitText>
            <p className="t-label mt-6">{[next.role, next.year].filter(Boolean).join(' · ')}</p>
          </Link>
        )}
      </PageMotion>
    </main>
  )
}
