import { ExperienceMotion } from '@/features/home/experience-motion'
import { services } from '@/data/services'

const pad = (value: number) => String(value).padStart(2, '0')

// Same tile markup and hover fill as Experience (the exp-* classes), so one row of three or two rows of three both work.
export function ServicesGrid() {
  return (
    <ExperienceMotion id="services-list" labelledBy="services-title" className="px-gutter pb-section">
      <h2 id="services-title" className="t-label pb-6">
        (What I build)
      </h2>
      <ul className="exp-list grid border-l border-site-line md:grid-cols-3">
        {services.map((service, index) => (
          <li key={service.id} data-exp-tile className="exp-tile border-b border-r border-t border-site-line">
            <div className="exp-body flex h-full flex-col gap-8 p-6 md:p-8">
              <span className="t-label text-site-muted">{pad(index + 1)}</span>
              <div>
                <h3 className="t-h3">{service.title}</h3>
                <p className="text-lead mt-2">{service.summary}</p>
              </div>
              <div className="mt-auto flex flex-col gap-6">
                <div>
                  <p className="t-label text-site-muted">Deliverables</p>
                  <ul className="text-small mt-3 flex flex-col gap-3 text-site-muted">
                    {service.deliverables.map((item) => (
                      <li key={item} data-exp-bullet>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="t-label-s text-site-muted">{service.stack}</p>
                <a href="#contact" data-service={service.id} className="t-label self-start underline underline-offset-4">
                  Start a project like this →
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ExperienceMotion>
  )
}
