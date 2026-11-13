import { ExperienceMotion } from '@/features/home/experience-motion'

// Facts and bullets are word for word from docs/resume.md (v5). The Webbly Media role is left out until Rafi gives the title and dates.
const roles = [
  {
    company: 'Sparktech Agency - BDCallingIT',
    title: 'Software Developer',
    dates: 'July 2025 - June 2026',
    href: undefined,
    bullets: [
      'Expanded from frontend to full-stack within 3 months and React Native within 7, delivering 2 production ecommerce mobile applications end to end.',
      'Migrated client data integrations from REST to GraphQL, reducing unnecessary data fetching and simplifying frontend state management across multiple products.'
    ]
  },
  {
    company: 'ZenDevz',
    title: 'Full Stack Developer',
    dates: 'Nov 2024 - Feb 2025',
    href: 'https://zendevz.com',
    bullets: [
      "Built and deployed the agency's official portfolio with Next.js, Prisma, and PostgreSQL to support client acquisition.",
      "Conducted 35+ code reviews as the team's technical lead, maintaining standards across a small team and preventing regressions before production."
    ]
  },
  {
    company: 'DIU Robotics Club',
    title: 'Web Developer Executive',
    dates: 'Jan 2023 - Dec 2024',
    href: undefined,
    bullets: [
      'Owned the club website after promotion, shipping new features, resolving bugs, and maintaining the site with a dedicated web team.',
      'Built a custom event registration system that replaced manual coordination and streamlined attendee registration for club events.'
    ]
  }
]

const pad = (value: number) => String(value).padStart(2, '0')

export function Experience() {
  return (
    <ExperienceMotion id="experience" className="scroll-mt-16 px-gutter py-section">
      <header className="t-label flex items-baseline justify-between gap-6 pb-6">
        <h2 id="experience-title" className="t-label">
          (Experience)
        </h2>
        <span className="text-site-muted">Dhaka, BD</span>
      </header>

      <ul className="grid border-l border-site-line md:grid-cols-3">
        {roles.map((role, index) => (
          <li key={role.company} data-exp-tile className="exp-tile border-b border-r border-t border-site-line">
            <div className="flex h-full flex-col gap-8 p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="t-label text-site-muted">{pad(index + 1)}</span>
                {role.href ? (
                  <a
                    href={role.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${role.company} website`}
                    className="exp-arrow t-label"
                  >
                    <span aria-hidden>↗</span>
                  </a>
                ) : null}
              </div>
              <div>
                <h3 className="t-h3">{role.company}</h3>
                <p className="text-lead mt-2">{role.title}</p>
                <p className="t-label mt-3 text-site-muted">{role.dates}</p>
              </div>
              <ul className="text-small mt-auto flex flex-col gap-3 text-site-muted">
                {role.bullets.map((bullet) => (
                  <li key={bullet} data-exp-bullet>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </ExperienceMotion>
  )
}
