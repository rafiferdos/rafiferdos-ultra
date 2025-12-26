'use client'

import IconSquareChartLine from '@/components/icons/Mobile'
import IconSparkle from '@/components/icons/Sparkle'
import IconStorage from '@/components/icons/Storage'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { OrbitingCircles } from '@/components/ui/orbiting-circles'
import { cn } from '@/lib/utils'
import { DotLottiePlayer } from '@dotlottie/react-player'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState } from 'react'

gsap.registerPlugin(ScrollTrigger)

const TechStack = () => {
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    tl.fromTo('.tech-title-reveal',
      { y: 50, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo('.tech-desc-reveal',
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo('.tech-card-reveal',
        { x: -50, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' },
        '-=0.4'
      )

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative flex min-h-[800px] w-full flex-col items-center justify-center rounded-lg bg-background py-20 md:shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>

      <div className="mb-12 flex w-full flex-col items-center text-center">
        <h2 className="tech-title-reveal invisible pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-5xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
          Technological Arsenal
        </h2>
        <p className="tech-desc-reveal invisible mt-4 max-w-2xl text-lg text-muted-foreground">
          A curated collection of modern tools and frameworks I use to craft
          exceptional digital experiences.
        </p>
      </div>

      <div className="z-10 flex w-full flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
        {/* Text Content with Animated Grid */}
        <div className="relative flex flex-1 flex-col gap-8 overflow-hidden px-8 md:ml-16 md:px-0">
          <AnimatedGridPattern
            numSquares={30}
            maxOpacity={0.1}
            duration={3}
            repeatDelay={1}
            className={cn(
              '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
              'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12'
            )}
          />

          <div className="z-10 space-y-8">
            <div className="tech-card-reveal invisible group rounded-xl border border-transparent bg-background/50 p-6 transition-all">
              <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold text-foreground">
                <IconSparkle size="48px" style={{ filter: 'sepia(100%) hue-rotate(190deg) saturate(500%)' }} />
                Frontend Mastery
              </h3>
              <p className="text-muted-foreground">
                I specialize in the{' '}
                <span className="font-semibold text-foreground">
                  JavaScript ecosystem
                </span>
                , leveraging the power of{' '}
                <span className="font-semibold text-foreground">Next.js</span>{' '}
                and{' '}
                <span className="font-semibold text-foreground">
                  TypeScript
                </span>{' '}
                to build robust, scalable, and interactive user interfaces.
              </p>
            </div>

            <div className="tech-card-reveal invisible group rounded-xl border border-transparent bg-background/50 p-6 transition-all">
              <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold text-foreground">
                <IconStorage size="48px" style={{ filter: 'sepia(100%) hue-rotate(90deg) saturate(500%)' }} />
                Backend & Architecture
              </h3>
              <p className="text-muted-foreground">
                On the server side, I architect solutions using{' '}
                <span className="font-semibold text-foreground">Node.js</span>
                ,{' '}
                <span className="font-semibold text-foreground">Express</span>
                , and modern databases like{' '}
                <span className="font-semibold text-foreground">
                  PostgreSQL
                </span>{' '}
                and{' '}
                <span className="font-semibold text-foreground">MongoDB</span>
                .
              </p>
            </div>

            <div className="tech-card-reveal invisible group rounded-xl border border-transparent bg-background/50 p-6 transition-all">
              <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold text-foreground">
                <IconSquareChartLine size="48px" style={{ filter: 'sepia(100%) hue-rotate(260deg) saturate(500%)' }} />
                Mobile & Beyond
              </h3>
              <p className="text-muted-foreground">
                Expanding into mobile with{' '}
                <span className="font-semibold text-foreground">
                  React Native
                </span>{' '}
                and{' '}
                <span className="font-semibold text-foreground">Expo</span>, I
                bring the same level of quality and performance to native
                applications.
              </p>
            </div>
          </div>
        </div>

        {/* Orbiting Visualization */}
        <div className="relative flex h-[600px] w-full flex-1 flex-col items-center justify-center overflow-hidden md:h-[600px]">
          {/* Central Core with Lightning Lottie */}
          <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2">
            {/* Blue Lightning (Default) - Hides on Hover */}
            <div
              className={cn(
                'absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300',
                isHovering ? 'opacity-0' : 'opacity-100'
              )}
            >
              <DotLottiePlayer
                src="/Lightning.lottie"
                loop
                autoplay
                className="h-full w-full scale-125"
              />
            </div>

            {/* Red Lightning Overlay - Shows on Hover (Outside image container for bigger effect) */}
            <div
              className={cn(
                'absolute inset-0 z-30 flex items-center justify-center pointer-events-none transition-all duration-300',
                isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              )}
            >
              <DotLottiePlayer
                src="/Red Lightning.lottie"
                loop
                autoplay
                className="h-[300%] w-[300%]"
              />
            </div>

            {/* Image Container */}
            <div
              className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background shadow-xl ring-1 ring-border transition-all duration-500"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span className="absolute text-xl font-bold text-foreground">
                RF
              </span>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ5QmE9bCXCz5zEiL2IT7mi-SZrdFshZ1uEA&s"
                alt="RF"
                className={cn(
                  'relative z-10 h-full w-full rounded-full object-cover transition-transform duration-500 ease-in-out',
                  isHovering ? 'scale-110' : 'scale-100'
                )}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          </div>

          {/* Inner Orbit - Core & Frontend */}
          <OrbitingCircles
            className="border-none bg-transparent"
            duration={20}
            delay={0}
            radius={80}
          >
            <Icon slug="react" color="61DAFB" tooltip="React" />
            <Icon
              slug="nextdotjs"
              color="000000"
              darkInvert
              tooltip="Next.js"
            />
            <Icon slug="typescript" color="3178C6" tooltip="TypeScript" />
            <Icon slug="tailwindcss" color="06B6D4" tooltip="Tailwind CSS" />
            <Icon slug="nodedotjs" color="339933" tooltip="Node.js" />
          </OrbitingCircles>

          {/* Middle Orbit - Backend & Data */}
          <OrbitingCircles
            className="border-none bg-transparent"
            duration={30}
            delay={0}
            radius={140}
            reverse
          >
            <Icon slug="express" color="000000" darkInvert tooltip="Express" />
            <Icon slug="mongodb" color="47A248" tooltip="MongoDB" />
            <Icon slug="postgresql" color="4169E1" tooltip="PostgreSQL" />
            <Icon slug="prisma" color="2D3748" darkInvert tooltip="Prisma" />
            <Icon slug="graphql" color="E10098" tooltip="GraphQL" />
            <Icon slug="firebase" color="FFCA28" tooltip="Firebase" />
            <Icon slug="amazon" color="232F3E" darkInvert tooltip="AWS" />
            <Icon slug="redux" color="764ABC" tooltip="Redux" />
          </OrbitingCircles>

          {/* Outer Orbit - Tools, Mobile, Basics */}
          <OrbitingCircles
            className="border-none bg-transparent"
            duration={40}
            delay={0}
            radius={210}
          >
            <Icon slug="javascript" color="F7DF1E" tooltip="JavaScript" />
            <Icon slug="html5" color="E34F26" tooltip="HTML5" />
            <Icon slug="css" color="1572B6" tooltip="CSS3" />
            <Icon slug="git" color="F05032" tooltip="Git" />
            <Icon slug="github" color="181717" darkInvert tooltip="GitHub" />
            <Icon slug="vercel" color="000000" darkInvert tooltip="Vercel" />
            <Icon slug="netlify" color="00C7B7" tooltip="Netlify" />
            <Icon slug="expo" color="000020" darkInvert tooltip="Expo" />
            <Icon slug="jest" color="C21325" tooltip="Jest" />
            <Icon slug="bootstrap" color="7952B3" tooltip="Bootstrap" />
          </OrbitingCircles>
        </div>
      </div>
    </section>
  )
}

const Icon = ({
  slug,
  color,
  darkInvert,
  tooltip
}: {
  slug: string
  color: string
  darkInvert?: boolean
  tooltip: string
}) => {
  const [error, setError] = useState(false)

  return (
    <div className="group relative flex items-center justify-center">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border transition-all duration-300 hover:scale-110 hover:ring-cyan-500 hover:shadow-cyan-400 dark:hover:shadow-cyan-600 dark:hover:ring-cyan-300 dark:shadow-xl">
        {!error ? (
          <img
            src={`https://cdn.simpleicons.org/${slug}/${color}`}
            alt={tooltip}
            className={cn(
              'size-6 transition-all duration-300',
              darkInvert && 'dark:invert'
            )}
            onError={() => setError(true)}
          />
        ) : (
          <span className="text-xs font-bold text-muted-foreground">
            {tooltip.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-background px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        {tooltip}
      </span>
    </div>
  )
}

export default TechStack
