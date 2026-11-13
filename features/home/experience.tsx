import { ExperienceMotion } from '@/features/home/experience-motion'

// Every fact here is from docs/resume.md (v5), reworded shorter. The Webbly Media role is left out until Rafi gives the title and dates.
const roles = [
  {
    company: 'Sparktech Agency - BDCallingIT',
    title: 'Software Developer',
    dates: 'July 2025 - June 2026',
    href: undefined,
    bullets: [
      'Joined on the frontend. Full stack within 3 months, React Native within 7. Two ecommerce apps, shipped start to finish.',
      'Moved client data from REST to GraphQL, so the apps fetch less and the frontend state is simpler.',
      'Built real-time chat and notifications with Socket.IO.'
    ]
  },
  {
    company: 'ZenDevz',
    title: 'Full Stack Developer',
    dates: 'Nov 2024 - Feb 2025',
    href: 'https://zendevz.com',
    bullets: [
      "Built and deployed the agency's own portfolio on Next.js, Prisma and PostgreSQL.",
      'Led international client projects end to end, and did 35+ code reviews as technical lead.'
    ]
  },
  {
    company: 'DIU Robotics Club',
    title: 'Web Developer Executive',
    dates: 'Jan 2023 - Dec 2024',
    href: undefined,
    bullets: [
      'Promoted within 8 months, then owned the club website with a dedicated web team.',
      'Built the event registration system that replaced manual coordination.'
    ]
  }
]

const pad = (value: number) => String(value).padStart(2, '0')

export function Experience() {
  return (
    <ExperienceMotion id="experience" labelledBy="experience-title" className="scroll-mt-16 px-gutter py-section">
      <header className="t-label flex items-baseline justify-between gap-6 pb-6">
        <h2 id="experience-title" className="t-label">
          (Experience)
        </h2>
        <span className="text-site-muted">Dhaka, BD</span>
      </header>

      <ul className="exp-list grid border-l border-site-line md:grid-cols-3">
        {roles.map((role, index) => (
          <li key={role.company} data-exp-tile className="exp-tile border-b border-r border-t border-site-line">
            <div className="exp-body flex h-full flex-col gap-8 p-6 md:p-8">
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
