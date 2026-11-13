import { ProjectArchive } from '@/features/projects/project-archive'
import { OG_IMAGE } from '@/lib/site'
import { getProjects } from '@/lib/content-store'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Projects by Rafi Ferdos: what each one is, what I did on it, and the stack.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects by Rafi Ferdos',
    description: 'Web, backend and mobile projects, and my part in each.',
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
