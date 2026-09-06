'use client'

import { SectionHeading } from '@/components/Home/SectionHeading'
import { BorderBeam } from '@/components/ui/border-beam'
import { Reveal } from '@/components/ui/reveal'
import { SoftAurora } from '@/components/ui/soft-aurora'
import { Project } from '@/data/site-content'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

function ProjectVisual({
  project,
  index
}: {
  project: Project
  index: number
}) {
  if (project.imageUrl)
    return (
      <img
        src={project.imageUrl}
        alt={`${project.title} project preview`}
        className="size-full object-cover transition duration-700 group-hover:scale-[1.035]"
        loading="lazy"
      />
    )
  return (
    <div
      className="relative flex size-full items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(circle at ${index % 2 ? '75% 25%' : '25% 25%'}, ${project.accent}55, transparent 36%), linear-gradient(145deg, #09090b, #18181b)`
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      <div className="relative w-[76%] rounded-2xl border border-white/10 bg-black/45 p-3 shadow-2xl backdrop-blur-xl transition duration-700 group-hover:-translate-y-2 group-hover:rotate-[-1deg]">
        <div className="mb-3 flex gap-1.5">
          <span className="size-2 rounded-full bg-rose-400" />
          <span className="size-2 rounded-full bg-amber-300" />
          <span className="size-2 rounded-full bg-emerald-400" />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-2/3 rounded-full bg-white/16" />
          <div className="h-2 w-5/6 rounded-full bg-white/8" />
          <div className="grid grid-cols-3 gap-2 pt-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="aspect-[.9] rounded-lg border border-white/8 bg-white/[.035]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects({ projects }: { projects: Project[] }) {
  const visibleProjects = projects
    .filter((project) => project.featured)
    .slice(0, 3)
  return (
    <section id="projects" className="scroll-mt-24 py-24 sm:py-32">
      <SectionHeading
        eyebrow="04 · Selected work"
        title="Selected projects and"
        accent="what I built."
        description="A few examples of my work across Next.js, backend systems and React Native."
      />
      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {visibleProjects.map((project, index) => (
          <Reveal key={project.id} delay={index * 0.08} className="h-full">
            <article className="group relative h-full overflow-hidden rounded-[1.8rem] border border-border/70 bg-card shadow-xl shadow-black/5">
              <BorderBeam
                size={120}
                duration={10 + index}
                delay={index * 2.2}
                colorFrom={project.accent}
                colorTo="#8b5cf6"
              />
              <div className="aspect-[4/3] overflow-hidden border-b border-border/60">
                <ProjectVisual project={project} index={index} />
              </div>
              <div className="p-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">
                    {[project.role, project.projectType]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-.04em]">
                    {project.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {project.description}
                </p>
                {project.outcomes?.length ? (
                  <ul className="mt-4 space-y-2 text-xs leading-5 text-foreground/75">
                    {project.outcomes.slice(0, 3).map((outcome) => (
                      <li key={outcome} className="flex gap-2">
                        <span className="text-primary" aria-hidden="true">
                          ↗
                        </span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.techStack.slice(0, 4).map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-border/70 bg-muted/50 px-2.5 py-1 font-mono text-[10px] text-foreground/70"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-4 border-t border-border/60 pt-5 text-xs font-semibold">
                  {project.liveUrl && (
                    <ProjectLink href={project.liveUrl} label="Live" />
                  )}
                  {project.caseStudyUrl && (
                    <ProjectLink
                      href={project.caseStudyUrl}
                      label="Case study"
                    />
                  )}
                  {project.githubUrl && (
                    <ProjectLink href={project.githubUrl} label="Source" />
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-6">
        <div className="relative min-h-[250px] overflow-hidden rounded-[2rem] border border-border/70 bg-card text-foreground shadow-2xl shadow-black/10 dark:bg-zinc-950 dark:text-white">
          <SoftAurora
            className="absolute inset-0 opacity-35 dark:opacity-90"
            color1="#f59e0b"
            color2="#8b5cf6"
            brightness={1.15}
            speed={1.3}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/40 dark:from-zinc-950 dark:via-zinc-950/78 dark:to-zinc-950/25" />
          <div className="relative flex min-h-[250px] flex-col items-start justify-center p-7 sm:p-10">
            <p className="font-mono text-xs uppercase tracking-[.22em] text-amber-700 dark:text-amber-300">
              Project archive
            </p>
            <h3 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-.045em] sm:text-4xl">
              Browse the full project archive.
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground dark:text-white/65">
              Filter projects by discipline, work type or technology.
            </p>
            <Link
              href="/projects"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:scale-[1.02] dark:bg-white dark:text-zinc-950"
            >
              Explore every project <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function ProjectLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className="inline-flex items-center gap-1.5 text-foreground transition hover:text-primary"
    >
      {label} <ArrowUpRight className="size-3.5" />
    </a>
  )
}
