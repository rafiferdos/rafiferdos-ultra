'use client'
import { AnimatedBeam } from '@/components/ui/animated-beam'
import { AnimatedList } from '@/components/ui/animated-list'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { OrbitingCircles } from '@/components/ui/orbiting-circles'
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation
} from '@/components/ui/terminal'
import { cn } from '@/lib/utils'
import {
  Code,
  Database,
  FileJson,
  Globe,
  Layers,
  Layout,
  MonitorSmartphone,
  Server,
  Smartphone,
  Zap
} from 'lucide-react'
import { useRef, useState } from 'react'

// --- Background Components ---

const CrossPlatformBackground = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_bottom,white,transparent)]">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        React
      </span>
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={80}
      >
        <Smartphone className="text-blue-500" size={24} />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={10}
        radius={80}
      >
        <Globe className="text-green-500" size={24} />
      </OrbitingCircles>

      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={140}
        duration={20}
        reverse
      >
        <MonitorSmartphone className="text-purple-500" size={32} />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={140}
        duration={20}
        delay={20}
        reverse
      >
        <Layout className="text-orange-500" size={32} />
      </OrbitingCircles>
    </div>
  )
}

const PerformanceList = () => {
  interface Item {
    name: string
    description: string
    icon: string
    color: string
    time: string
  }

  let notifications = [
    {
      name: 'Build Complete',
      description: 'Next.js app built in 2s',
      time: '15m ago',
      icon: '🚀',
      color: '#00C9A7'
    },
    {
      name: 'Optimization',
      description: 'Image size reduced by 80%',
      time: '10m ago',
      icon: '📉',
      color: '#FFB800'
    },
    {
      name: 'Performance',
      description: 'Lighthouse score: 100',
      time: '5m ago',
      icon: '💯',
      color: '#FF3D71'
    },
    {
      name: 'Deployment',
      description: 'Deployed to Vercel edge',
      time: '2m ago',
      icon: '🌍',
      color: '#1E86FF'
    }
  ]

  notifications = Array.from({ length: 10 }, () => notifications).flat()

  const Notification = ({ name, description, icon, color, time }: Item) => {
    return (
      <figure
        className={cn(
          'relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4',
          // animation styles
          'transition-all duration-200 ease-in-out hover:scale-[103%]',
          // light styles
          'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
          // dark styles
          'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]'
        )}
      >
        <div className="flex flex-row items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: color
            }}
          >
            <span className="text-lg">{icon}</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
              <span className="text-sm sm:text-lg">{name}</span>
              <span className="mx-1">·</span>
              <span className="text-xs text-gray-500">{time}</span>
            </figcaption>
            <p className="text-sm font-normal dark:text-white/60">
              {description}
            </p>
          </div>
        </div>
      </figure>
    )
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_bottom,white,transparent)]">
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  )
}

const ArchitectureBeam = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_bottom,white,transparent)]"
      ref={containerRef}
    >
      <div className="flex size-full flex-col items-stretch justify-between gap-10 p-10">
        <div className="flex flex-row items-center justify-between">
          <div
            ref={div1Ref}
            className="z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:text-black"
          >
            <Database />
          </div>
          <div
            ref={div5Ref}
            className="z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:text-black"
          >
            <Server />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div
            ref={div2Ref}
            className="z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:text-black"
          >
            <FileJson />
          </div>
          <div
            ref={div4Ref}
            className="z-10 flex size-16 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:text-black"
          >
            <Globe className="size-6" />
          </div>
          <div
            ref={div6Ref}
            className="z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:text-black"
          >
            <Layout />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div
            ref={div3Ref}
            className="z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:text-black"
          >
            <Code />
          </div>
          <div
            ref={div7Ref}
            className="z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:text-black"
          >
            <Smartphone />
          </div>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        reverse
      />
    </div>
  )
}

const FullCycleTerminal = () => {
  const [terminalKey, setTerminalKey] = useState(0)

  return (
    <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-end p-4 lg:p-10">
      <Terminal
        key={terminalKey}
        onTerminalComplete={() => {
          setTimeout(() => {
            setTerminalKey((prev) => prev + 1)
          }, 2000)
        }}
        className="h-full max-h-[250px] w-full max-w-[350px] border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950"
      >
        <TypingAnimation>
          &gt; git checkout -b feature/full-stack
        </TypingAnimation>
        <AnimatedSpan delay={1500} className="text-green-500">
          <span>✔ Switched to a new branch</span>
        </AnimatedSpan>
        <TypingAnimation delay={2000}>
          &gt; npm install react-native
        </TypingAnimation>
        <AnimatedSpan delay={3500} className="text-blue-500">
          <span>ℹ added 58 packages in 3s</span>
        </AnimatedSpan>
        <TypingAnimation delay={4000}>&gt; npx prisma generate</TypingAnimation>
        <AnimatedSpan delay={5500} className="text-green-500">
          <span>✔ Prisma Client just became smarter</span>
        </AnimatedSpan>
        <TypingAnimation delay={6000}>
          &gt; docker build -t app .
        </TypingAnimation>
        <AnimatedSpan delay={7500} className="text-blue-500">
          <span>ℹ Building image: [=&gt;] 100%</span>
        </AnimatedSpan>
      </Terminal>
    </div>
  )
}

// --- Main Component ---

const features = [
  {
    Icon: MonitorSmartphone,
    name: 'Cross-Platform Mastery',
    description:
      'Why fragment your team? I deliver unified experiences across Web (Next.js) and Mobile (React Native). One codebase mindset, native performance, and consistent branding on iOS, Android, and the Web.',
    href: '#contact',
    cta: 'See cross-platform work',
    className: 'col-span-3 lg:col-span-2',
    background: <CrossPlatformBackground />
  },
  {
    Icon: Zap,
    name: 'High-Performance Engineering',
    description:
      'I build apps that fly. By optimizing rendering cycles, managing state efficiently, and leveraging server-side capabilities, I ensure your application feels instant and responsive.',
    href: '#contact',
    cta: 'Check performance',
    className: 'col-span-3 lg:col-span-1',
    background: <PerformanceList />
  },
  {
    Icon: Layers,
    name: 'Scalable Architecture',
    description:
      'Future-proof your product. I design clean, modular, and type-safe (TypeScript) architectures that make scaling up and adding new features painless and bug-free.',
    href: '#contact',
    cta: 'View architecture',
    className: 'col-span-3 lg:col-span-1',
    background: <ArchitectureBeam />
  },
  {
    Icon: Code,
    name: 'Full-Cycle Development',
    description:
      'From database schema design in MongoDB to pixel-perfect UI implementation. I handle the entire lifecycle, ensuring that the backend logic perfectly supports the frontend user experience.',
    href: '#contact',
    cta: 'Hire a pro',
    className: 'col-span-3 lg:col-span-2',
    background: <FullCycleTerminal />
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
