import { ProjectArchive } from '@/features/projects/project-archive'
import { OG_IMAGE } from '@/lib/site'
import { getProjects } from '@/lib/content-store'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore Rafi Ferdos’s frontend, backend, full-stack and mobile work by discipline, context and technology.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects by Rafi Ferdos',
    description: 'Full-stack, frontend, backend and mobile product engineering work.',
    url: '/projects',
    images: [OG_IMAGE]
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <main id="main" className="min-h-svh px-gutter pb-section pt-28">
      <header className="pb-12">
        <p className="t-label text-site-muted">(Projects{projects.length ? ` ${String(projects.length).padStart(2, '0')}` : ''})</p>
        <h1 className="t-h1 mt-4 max-w-[18ch]">What I built, and my part in it.</h1>
      </header>
      <ProjectArchive projects={projects} />
    </main>
  )
}
