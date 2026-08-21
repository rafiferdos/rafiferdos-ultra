import { Footer } from '@/components/Footer/Footer'
import { ProjectExplorer } from '@/components/Projects/ProjectExplorer'
import { Reveal } from '@/components/ui/reveal'
import { getProjects } from '@/lib/content-store'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore Rafi Ferdos’s frontend, backend, full-stack and mobile work by discipline, context and technology.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects by Rafi Ferdos',
    description:
      'Full-stack, frontend, backend and mobile product engineering work.',
    url: '/projects',
    images: ['/og.png']
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <>
      <main className="mx-auto min-h-svh max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pb-24 lg:px-8">
        <Reveal>
          <p className="font-mono text-xs font-semibold uppercase tracking-[.28em] text-primary">
            Project archive
          </p>
          <h1 className="mt-5 max-w-5xl text-balance text-[clamp(3rem,8vw,6rem)] font-semibold leading-[.94] tracking-[-.065em]">
            Work, organized around{' '}
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500 bg-clip-text text-transparent">
              what you need to evaluate.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Filter by engineering discipline, work context or stack—whether
            you’re hiring for a team or looking for someone to carry a product
            build.
          </p>
        </Reveal>
        <ProjectExplorer projects={projects} />
      </main>
      <Footer />
    </>
  )
}
