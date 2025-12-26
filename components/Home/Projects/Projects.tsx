'use client'

// ... (imports)
import { AuroraText } from '@/components/ui/aurora-text'
import { GsapReveal } from '@/components/ui/gsap-reveal'
import { GsapText } from '@/components/ui/gsap-text'
import { MagicCard } from '@/components/ui/magic-card'
import { NumberTicker } from '@/components/ui/number-ticker'
import { cn } from '@/lib/utils'
import { useGSAP } from '@gsap/react' // Added useGSAP
import gsap from 'gsap' // Added gsap
import { ScrollTrigger } from 'gsap/ScrollTrigger' // Added ScrollTrigger
import { ExternalLink, Github } from 'lucide-react'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

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
        <div className="project-card-reveal invisible h-full"> {/* Wrapped in div for clean GSAP targeting */}
            <MagicCard
                className="group relative h-[420px] w-full overflow-hidden rounded-2xl"
                gradientSize={250}
                gradientFrom="#9E7AFF"
                gradientTo="#FE8BBB"
                gradientOpacity={0.9}
            >
                {/* Screenshot Container with Scroll Effect */}
                <div className="relative h-[280px] w-full overflow-hidden">
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
                                code
                            </a>
                        )}
                    </div>
                </div>
            </MagicCard>
        </div>
    )
}

const Projects = () => {
    const containerRef = useRef<HTMLElement>(null)

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%', // Start animation when section enters view
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        })

        // Animate subtitle
        tl.fromTo('.project-desc-reveal',
            { y: 30, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }
        )
            // Animate stats
            .fromTo('.project-stats-reveal',
                { scale: 0.9, autoAlpha: 0 },
                { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.7)' },
                '-=0.4'
            )
            // Animate Cards Staggered
            .fromTo('.project-card-reveal',
                { y: 50, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
                '-=0.2'
            )

    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="relative min-h-screen w-full py-20">
            {/* Background Pattern (matching TechStack) */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />

            {/* Section Header */}
            <div className="mb-24 flex flex-col items-center text-center">
                {/* Title - Keeping GsapText for specialized animation */}
                <div className="p-2">
                    <h2 className="text-5xl font-bold leading-[0.9] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
                        <GsapText
                            className="inline-block text-foreground"
                            delay={0.2}
                            stagger={0.06}
                        >
                            Selected
                        </GsapText>
                        <span className="block md:inline-block md:ml-6">
                            <GsapReveal delay={0.4}>
                                <AuroraText
                                    colors={['#FF6B6B', '#FF8E53', '#FFC107']}
                                    speed={2.5}
                                    className="font-bold"
                                >
                                    Works
                                </AuroraText>
                            </GsapReveal>
                        </span>
                    </h2>
                </div>

                <p className="project-desc-reveal invisible mt-8 max-w-2xl text-xl text-muted-foreground md:text-2xl">
                    Handpicked projects showcasing full-stack expertise, <br className="hidden md:block" />
                    attention to detail, and performant code.
                </p>

                {/* Stats with NumberTicker - Bigger & Bolder */}
                <div className="project-stats-reveal invisible mt-12 flex items-center gap-12 rounded-full border border-border/50 bg-background/50 px-8 py-4 backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-foreground md:text-5xl">
                            <NumberTicker value={47} delay={0.8} />+
                        </span>
                        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            Projects
                        </span>
                    </div>
                    <div className="h-12 w-px bg-border/50" />
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-foreground md:text-5xl">
                            <NumberTicker value={5} delay={1.0} />
                        </span>
                        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            Featured
                        </span>
                    </div>
                </div>
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
