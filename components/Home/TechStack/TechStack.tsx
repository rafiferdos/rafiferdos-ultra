'use client'

import { BlurFade } from '@/components/ui/blur-fade'
import { OrbitingCircles } from '@/components/ui/orbiting-circles'
import { cn } from '@/lib/utils'

const TechStack = () => {
  return (
    <section className="relative flex min-h-[800px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background py-20 md:shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>

      <div className="mb-12 flex w-full flex-col items-center text-center">
        <BlurFade delay={0.2}>
          <h2 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-5xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
            Technological Arsenal
          </h2>
        </BlurFade>
        <BlurFade delay={0.3}>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            A curated collection of modern tools and frameworks I use to craft
            exceptional digital experiences.
          </p>
        </BlurFade>
      </div>

      <div className="z-10 flex w-full flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
        {/* Text Content */}
        <div className="flex flex-1 flex-col gap-8 px-8 md:px-16">
          <div className="space-y-6 text-lg text-muted-foreground">
            <BlurFade delay={0.4} inView>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Frontend Mastery
                </h3>
                <p>
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
            </BlurFade>

            <BlurFade delay={0.5} inView>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Backend & Architecture
                </h3>
                <p>
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
            </BlurFade>

            <BlurFade delay={0.6} inView>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Mobile & Beyond
                </h3>
                <p>
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
            </BlurFade>
          </div>
        </div>

        {/* Orbiting Visualization */}
        <div className="relative flex h-[600px] w-full flex-1 flex-col items-center justify-center overflow-hidden md:h-[600px]">
          {/* Central Core */}
          <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-xl"></div>
          <div className="absolute left-1/2 top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-xl ring-1 ring-border">
            <span className="text-xl font-bold text-foreground">RF</span>
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
            <Icon slug="amazonaws" color="232F3E" darkInvert tooltip="AWS" />
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
            <Icon slug="css3" color="1572B6" tooltip="CSS3" />
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
  return (
    <div className="group relative flex items-center justify-center">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border transition-all duration-300 hover:scale-110 hover:ring-primary">
        <img
          src={`https://cdn.simpleicons.org/${slug}/${color}`}
          alt={tooltip}
          className={cn(
            'size-6 transition-all duration-300',
            darkInvert && 'dark:invert'
          )}
        />
      </div>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-background px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        {tooltip}
      </span>
    </div>
  )
}

export default TechStack
