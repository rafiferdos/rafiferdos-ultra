import { FitText } from '@/components/site/fit-text'
import { RollLink } from '@/components/site/roll-link'
import { HeroMotion } from '@/features/home/hero-motion'
import { profile } from '@/lib/site'

export function Hero() {
  return (
    <HeroMotion id="top" className="relative flex min-h-svh flex-col px-gutter pt-16">
      <div
        data-hero-fade
        className="t-label flex flex-wrap justify-between gap-x-8 gap-y-1 py-6 text-site-muted"
      >
        <span>(Portfolio / ©{new Date().getFullYear()})</span>
        <span>{profile.jobTitle}</span>
        <span>Dhaka, BD</span>
      </div>

      <h1 className="flex flex-1 flex-col justify-center">
        <span className="sr-only">Rafi Ferdos</span>
        {/* Two renderings, one per breakpoint, and HeroMotion animates the visible one.
            Wide: a staircase, FERDOS starting under the end of RAFI, both lines at one size so the name spans the container.
            Narrow: two stacked lines, each fitted on its own, because a staircase would shrink the type to about 80px at 390. */}
        <span aria-hidden data-hero-name="wide" className="hidden md:block">
          <FitText lines={['Rafi', 'Ferdos']} fallback={[1.54, 2.6]} data-hero-line className="t-display hero-line" />
        </span>
        <span aria-hidden data-hero-name="narrow" className="block md:hidden">
          <FitText fallback={1.54} data-hero-line className="t-display hero-line">
            Rafi
          </FitText>
          <FitText fallback={2.6} data-hero-line className="t-display hero-line">
            Ferdos
          </FitText>
        </span>
      </h1>

      <div className="flex flex-col justify-between gap-8 pb-10 pt-8 md:flex-row md:items-end">
        <p data-hero-intro className="text-lead max-w-[34rem]">
          I build web and mobile products from the database to the last pixel. 3+ years of shipping,
          for product teams and clients abroad.
        </p>
        <div data-hero-fade className="t-label flex flex-col items-start gap-3 md:items-end">
          <RollLink href="#work">See the work →</RollLink>
          <span className="text-site-muted">(Scroll, gently)</span>
        </div>
      </div>
    </HeroMotion>
  )
}
