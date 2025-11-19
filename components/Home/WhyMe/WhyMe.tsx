import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { Code, Layers, MonitorSmartphone, Zap } from 'lucide-react'

const features = [
  {
    Icon: MonitorSmartphone,
    name: 'Cross-Platform Mastery',
    description:
      'Why fragment your team? I deliver unified experiences across Web (Next.js) and Mobile (React Native). One codebase mindset, native performance, and consistent branding on iOS, Android, and the Web.',
    href: '#contact',
    cta: 'See cross-platform work',
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
    name: 'High-Performance Engineering',
    description:
      'I build apps that fly. By optimizing rendering cycles, managing state efficiently, and leveraging server-side capabilities, I ensure your application feels instant and responsive.',
    href: '#contact',
    cta: 'Check performance',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-yellow-500/20 blur-3xl" />
    )
  },
  {
    Icon: Layers,
    name: 'Scalable Architecture',
    description:
      'Future-proof your product. I design clean, modular, and type-safe (TypeScript) architectures that make scaling up and adding new features painless and bug-free.',
    href: '#contact',
    cta: 'View architecture',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-3xl" />
    )
  },
  {
    Icon: Code,
    name: 'Full-Cycle Development',
    description:
      'From database schema design in MongoDB to pixel-perfect UI implementation. I handle the entire lifecycle, ensuring that the backend logic perfectly supports the frontend user experience.',
    href: '#contact',
    cta: 'Hire a pro',
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
