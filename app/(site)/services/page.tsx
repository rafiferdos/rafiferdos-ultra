import { FitText } from '@/components/site/fit-text'
import { services } from '@/data/services'
import { Contact } from '@/features/home/contact'
import { PageMotion } from '@/features/motion/page-motion'
import { fitFallback, titleClass } from '@/features/projects/title-style'
import { Process } from '@/features/services/process'
import { ServicesGrid } from '@/features/services/services-grid'
import { OG_IMAGE, profile, safeJsonLd, SITE_URL } from '@/lib/site'
import type { Metadata } from 'next'

const description = 'Web apps, backends, mobile apps, ecommerce and AI features, built end to end by one person.'

export const metadata: Metadata = {
  title: 'Services',
  description,
  alternates: { canonical: '/services' },
  openGraph: { title: `Services, ${profile.name}`, description, url: '/services', type: 'website', images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: `Services, ${profile.name}`, description, images: [OG_IMAGE] }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: services.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: service.title,
      description: service.summary,
      provider: { '@type': 'Person', name: profile.name, url: SITE_URL }
    }
  }))
}

export default function ServicesPage() {
  return (
    <main id="main" className="min-h-svh pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
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
