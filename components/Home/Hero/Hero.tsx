import { LightRays } from '@/components/ui/light-rays'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { profile } from '@/lib/site'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import HeroClient from './HeroClient'

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      <section
        id="hero"
        className="relative min-h-svh scroll-mt-28 overflow-hidden bg-gradient-to-b from-primary/[.07] via-background to-background"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(245,158,11,.10),transparent_30%),radial-gradient(circle_at_84%_34%,rgba(139,92,246,.09),transparent_32%)]" />
        <div className="relative mx-auto grid min-h-svh max-w-7xl grid-cols-1 place-content-center gap-6 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div className="order-2 flex h-full max-w-2xl flex-col justify-center lg:order-1">
            <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-primary/20 px-3 py-1.5 text-xs backdrop-blur-xl dark:border-primary/20">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Open to remote Frontend &amp; Full-Stack roles
            </div>

            <h1 className="text-balance text-4xl leading-[0.95] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block font-agale italic text-primary">
                Rafi Ferdos
              </span>
              <span className="mt-2 block text-[0.72em] tracking-[-0.04em]">
                Full-Stack Developer
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Building web and mobile products with React, Next.js, TypeScript
              and Node.js.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-foreground/70">
              {['3+ years in production', 'Dhaka, Bangladesh · Remote'].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" />
                    {item}
                  </span>
                )
              )}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <RainbowButton asChild size="lg" className="rounded-full px-7">
                <Link href="#projects">View selected work</Link>
              </RainbowButton>
              <RainbowButton
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-7"
              >
                <a href={profile.resume} target="_blank" rel="noreferrer">
                  Resume <ArrowUpRight className="size-4" />
                </a>
              </RainbowButton>
              <Link
                href="#contact"
                className="px-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Contact
              </Link>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Selected client work available.
            </p>
          </div>

          <HeroClient />
        </div>
      </section>
      <LightRays className="-z-0 opacity-70" count={5} speed={18} />
    </div>
  )
}

export default Hero
