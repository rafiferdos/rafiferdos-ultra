import { RollLink } from '@/components/site/roll-link'
import { HeroMotion } from '@/features/home/hero-motion'

export function Hero() {
  return (
    <HeroMotion id="top" className="relative flex min-h-svh flex-col px-gutter pt-16">
      <div
        data-hero-fade
        className="t-label flex flex-wrap justify-between gap-x-8 gap-y-1 py-6 text-site-muted"
      >
        <span>(Portfolio / ©{new Date().getFullYear()})</span>
        <span>Full Stack Developer</span>
        <span>Dhaka, BD</span>
      </div>

      <h1 className="flex flex-1 flex-col justify-center">
        <span className="sr-only">Rafi Ferdos</span>
        <span aria-hidden data-hero-name className="t-display block">
          <span data-hero-line className="hero-line">
            Rafi
          </span>
          <span data-hero-line className="hero-line md:pl-[12vw]">
            Ferdos
          </span>
        </span>
      </h1>

      <div className="flex flex-col justify-between gap-8 pb-10 pt-8 md:flex-row md:items-end">
        <p data-hero-intro className="text-lead max-w-[34rem]">
          I build web and mobile apps end to end, from the database to the interface. 3+ years of
          shipping with React, Next.js, Node.js and React Native.
        </p>
        <div data-hero-fade className="t-label flex flex-col items-start gap-3 md:items-end">
          <RollLink href="#work">See the work →</RollLink>
          <span className="text-site-muted">(Scroll, gently)</span>
        </div>
      </div>
    </HeroMotion>
  )
}
