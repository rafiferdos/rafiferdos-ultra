import { LocalTime } from '@/components/site/local-time'
import { RollLink } from '@/components/site/roll-link'
import { profile } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-site-line px-gutter py-8">
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
