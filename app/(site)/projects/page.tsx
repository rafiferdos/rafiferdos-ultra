import { JsonLd } from '@/components/seo/json-ld'
import { ProjectArchive } from '@/features/projects/project-archive'
import { collectionNode, graph, pageMetadata } from '@/lib/seo'
import { getProjects } from '@/lib/content-store'
import { projectKey } from '@/lib/slug'
import type { Metadata } from 'next'

const title = 'Projects: web, mobile and backend work'
const description = 'Web, backend and mobile projects by Rafi Ferdos: what each one is, what I built, and the stack.'

export const metadata: Metadata = pageMetadata({ title, description, path: '/projects' })

export default async function ProjectsPage() {
  const projects = await getProjects()
  const jsonLd = graph(
    collectionNode(
      { name: title, description, path: '/projects' },
      projects.map((project) => ({ name: project.title, path: `/projects/${projectKey(project)}` }))
    )
  )
  return (
    <main id="main" className="min-h-svh px-gutter pb-section pt-28">
      <JsonLd data={jsonLd} />
      <header className="pb-12">
        <p className="t-label text-site-muted">(Projects{projects.length ? ` ${String(projects.length).padStart(2, '0')}` : ''})</p>
        <h1 className="t-h1 mt-4 max-w-[18ch]">What I built, and my part in it.</h1>
      </header>
      <ProjectArchive projects={projects} />
    </main>
  )
}
