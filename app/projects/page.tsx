import { Footer } from '@/components/Footer/Footer'
import { ProjectExplorer } from '@/components/Projects/ProjectExplorer'
import { Reveal } from '@/components/ui/reveal'
import { getProjects } from '@/lib/content-store'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore Rafi Ferdos’s frontend, backend, full-stack and mobile work by discipline, context and technology.'
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <>
      <main className="mx-auto min-h-svh max-w-7xl px-4 pb-24 pt-28">
        <Reveal>
          <p className="font-mono text-xs font-semibold uppercase tracking-[.28em] text-primary">
            Project archive
          </p>
          <h1 className="mt-5 max-w-5xl text-balance text-5xl font-semibold tracking-[-.065em] sm:text-7xl lg:text-8xl">
            Work, organized around{' '}
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500 bg-clip-text text-transparent">
              what you need to evaluate.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
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
