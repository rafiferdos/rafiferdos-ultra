import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { Code, Layers, Smartphone, Zap } from 'lucide-react'

const features = [
  {
    Icon: Layers,
    name: 'Full Stack Expertise',
    description:
      'Seamlessly bridging frontend and backend with the MERN stack. From database design to responsive UIs, I handle it all.',
    href: '#contact',
    cta: 'Hire Me',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <div className="absolute right-0 top-0 h-[300px] w-[600px] opacity-10 [mask-image:linear-gradient(to_bottom,white,transparent)]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <pattern
            id="grid-pattern"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid-pattern)" />
        </svg>
      </div>
    )
  },
  {
    Icon: Zap,
    name: 'Performance First',
    description:
      'Building lightning-fast applications with Next.js and Turbopack. Optimization is not an afterthought, it is a priority.',
    href: '#contact',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-yellow-500/20 blur-3xl" />
    )
  },
  {
    Icon: Smartphone,
    name: 'Responsive Design',
    description:
      'Pixel-perfect experiences on any device. Mobile-first approach ensures your site looks great everywhere.',
    href: '#contact',
    cta: 'See projects',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-3xl" />
    )
  },
  {
    Icon: Code,
    name: 'Modern Architecture',
    description:
      'Scalable, maintainable, and robust codebases using the latest tech like Tailwind v4, Framer Motion, and TypeScript.',
    href: '#contact',
    cta: 'View code',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <div className="absolute right-0 top-0 h-[300px] w-[600px] opacity-10 [mask-image:linear-gradient(to_bottom,white,transparent)]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <pattern
            id="dot-pattern"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
          <rect width="100" height="100" fill="url(#dot-pattern)" />
        </svg>
      </div>
    )
  }
]

export function WhyMe() {
  return (
    <section className="py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Why Me?
        </h2>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground">
          I bring a unique blend of technical skills and creative
          problem-solving to every project.
        </p>
      </div>
      <BentoGrid>
        {features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    </section>
  )
}
