import { FitText } from '@/components/site/fit-text'
import { LocalTime } from '@/components/site/local-time'
import { RollLink } from '@/components/site/roll-link'
import { profile } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-site-line px-gutter pb-8 pt-10">
      <FitText fallback={3.59} aria-hidden className="mb-10 leading-[0.9]">
        <span className="font-extrabold uppercase font-stretch-[75%]">Rafi</span>{' '}
        <span className="font-light italic font-stretch-[125%]">ferdos</span>
      </FitText>
      <div className="t-label flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <RollLink href={`mailto:${profile.email}`}>{profile.email}</RollLink>
        <RollLink href={profile.github} target="_blank" rel="noreferrer">
          GitHub ↗
        </RollLink>
        <RollLink href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn ↗
        </RollLink>
        <LocalTime label="Dhaka" className="text-site-muted" />
        <RollLink href="#top">Back to top ↑</RollLink>
      </div>
    </footer>
  )
}
