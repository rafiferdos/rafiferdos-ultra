'use client'

import { AuroraText } from '@/components/ui/aurora-text'
import { BlurFade } from '@/components/ui/blur-fade'
import { MagicCard } from '@/components/ui/magic-card'
import { NumberTicker } from '@/components/ui/number-ticker'
import { cn } from '@/lib/utils'
import { ExternalLink, Github } from 'lucide-react'

// Project data - replace screenshots with your actual images
const projects = [
    {
        id: '1',
        title: 'Project Name 1',
        description: 'A brief description of this amazing project and what makes it special.',
        screenshot: '/projects/project1.png', // Replace with your screenshot
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com/rafiferdos/project1',
        techStack: ['Next.js', 'TypeScript', 'Tailwind', 'MongoDB']
    },
    {
        id: '2',
        title: 'Project Name 2',
        description: 'Another incredible project showcasing full-stack development.',
        screenshot: '/projects/project2.png',
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com/rafiferdos/project2',
        techStack: ['React', 'Node.js', 'Express', 'PostgreSQL']
    },
    {
        id: '3',
        title: 'Project Name 3',
        description: 'Mobile-first application with stunning animations.',
        screenshot: '/projects/project3.png',
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com/rafiferdos/project3',
        techStack: ['React Native', 'Expo', 'Firebase']
    },
    {
        id: '4',
        title: 'Project Name 4',
        description: 'E-commerce platform with real-time features.',
        screenshot: '/projects/project4.png',
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com/rafiferdos/project4',
        techStack: ['Next.js', 'Prisma', 'Stripe', 'Redis']
    },
    {
        id: '5',
        title: 'Project Name 5',
        description: 'Dashboard with advanced data visualization.',
        screenshot: '/projects/project5.png',
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com/rafiferdos/project5',
        techStack: ['React', 'D3.js', 'GraphQL', 'AWS']
    }
]

interface ProjectCardProps {
    project: (typeof projects)[0]
    index: number
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
    return (
        <BlurFade delay={0.2 + index * 0.1} inView>
            <MagicCard
                className="group relative h-[420px] w-full overflow-hidden rounded-2xl"
                gradientSize={250}
                gradientFrom="#9E7AFF"
                gradientTo="#FE8BBB"
                gradientOpacity={0.9}
            >
                {/* Screenshot Container with Scroll Effect */}
                <div className="relative h-[280px] w-full overflow-hidden">
                    {/* 
            SCROLL-ON-HOVER EFFECT
            -----------------------
            The image is taller than the container.
            On hover, it translates up to reveal more content.
            Adjust the translateY percentage based on your screenshot height.
          */}
                    <img
                        src={project.screenshot}
                        alt={project.title}
                        className={cn(
                            'absolute left-0 top-0 w-full object-cover object-top',
                            'transition-transform duration-[3s] ease-in-out',
                            'group-hover:-translate-y-[60%]'
                        )}
                        style={{ height: 'auto', minHeight: '250%' }}
                    />

                    {/* Gradient Overlay at bottom of image */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
                </div>

                {/* Project Info */}
                <div className="relative z-10 flex flex-col gap-3 p-5">
                    <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                        {project.description}
                    </p>

                    {/* Tech Stack Tags - subtle styling */}
                    <div className="flex flex-wrap gap-2">
                        {project.techStack.slice(0, 4).map((tech) => (
                            <span
                                key={tech}
                                className="rounded-full bg-foreground/5 px-2.5 py-0.5 text-xs font-medium text-foreground/70"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Action Links */}
                    <div className="mt-auto flex items-center gap-3">
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                        >
                            <ExternalLink size={16} />
                            Live Demo
                        </a>
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                            >
                                <Github size={16} />
                                Code
                            </a>
                        )}
                    </div>
                </div>
            </MagicCard>
        </BlurFade>
    )
}

const Projects = () => {
    return (
        <section className="relative min-h-screen w-full py-20">
            {/* Background Pattern (matching TechStack) */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />

            {/* Section Header */}
            <div className="mb-16 flex flex-col items-center text-center">
                <BlurFade delay={0.1} inView>
                    <h2 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-5xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
                        Selected{' '}
                        <AuroraText
                            colors={['#FF6B6B', '#FF8E53', '#FFC107']}
                            speed={2}
                        >
                            Works
                        </AuroraText>
                    </h2>
                </BlurFade>

                <BlurFade delay={0.2} inView>
                    <p className="mt-4 max-w-xl text-base text-muted-foreground">
                        Handpicked projects showcasing full-stack expertise and attention to detail.
                    </p>
                </BlurFade>

                {/* Stats with NumberTicker - cleaner layout */}
                <BlurFade delay={0.3} inView>
                    <div className="mt-6 flex items-center gap-6">
                        <span className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">
                                <NumberTicker value={47} delay={0.5} />+
                            </span>{' '}
                            projects completed
                        </span>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="text-sm text-muted-foreground">
                            Showcasing{' '}
                            <span className="font-semibold text-foreground">
                                <NumberTicker value={5} delay={0.7} />
                            </span>{' '}
                            best works
                        </span>
                    </div>
                </BlurFade>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                ))}
            </div>
        </section>
    )
}

export default Projects
