import { FitText } from '@/components/site/fit-text'
import { services } from '@/data/services'
import { Contact } from '@/features/home/contact'
import { PageMotion } from '@/features/motion/page-motion'
import { fitFallback, titleClass } from '@/features/projects/title-style'
import { Process } from '@/features/services/process'
import { ServicesGrid } from '@/features/services/services-grid'
import { JsonLd } from '@/components/seo/json-ld'
import { graph, pageMetadata } from '@/lib/seo'
import { PERSON_ID, profile, SITE_URL } from '@/lib/site'
import type { Metadata } from 'next'

const description = 'Web apps, backends, mobile apps, ecommerce and AI features, built end to end by one person.'

export const metadata: Metadata = pageMetadata({
  title: 'Services: web, mobile, backend and AI work',
  description,
  path: '/services'
})

const jsonLd = graph({
  '@type': 'ItemList',
  '@id': `${SITE_URL}/services#services`,
  itemListElement: services.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: service.title,
      description: service.summary,
      provider: { '@type': 'Person', '@id': PERSON_ID, name: profile.name, url: SITE_URL }
    }
  }))
})

export default function ServicesPage() {
  return (
    <main id="main" className="min-h-svh pt-28">
      <JsonLd data={jsonLd} />
      <PageMotion>
        <header className="px-gutter pb-16">
          <div className="t-label flex items-baseline justify-between gap-6 text-site-muted">
            <span>(Services)</span>
            <span>Dhaka, BD</span>
          </div>
          <h1 data-page-title className="project-title mt-8">
            <FitText fallback={fitFallback('Services')} className={titleClass}>
              Services
            </FitText>
          </h1>
          <p data-reveal className="t-h1 mt-10 max-w-[22ch]">
            One person builds all of it: the database, the API, the app in your hand.
          </p>
        </header>
        <ServicesGrid />
        <Process />
        <Contact />
      </PageMotion>
    </main>
  )
}
