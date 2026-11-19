import { JsonLd } from '@/components/seo/json-ld'
import { Contact } from '@/features/home/contact'
import { Experience } from '@/features/home/experience'
import { Hero } from '@/features/home/hero'
import { Statement } from '@/features/home/statement'
import { WritingTeaser } from '@/features/home/writing-teaser'
import { SelectedWork } from '@/features/home/selected-work'
import { UpClose } from '@/features/home/up-close'
import { SkillsMarquee } from '@/features/home/skills-marquee'
import { getBlogs, getProjects } from '@/lib/content-store'
import { graph, pageMetadata, personNode, websiteNode } from '@/lib/seo'
import { profile, SITE_URL } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = pageMetadata({
  title: `${profile.name}, ${profile.jobTitle} in Dhaka, Bangladesh`,
  // absolute: the root layout's template would otherwise append the name a second time.
  absoluteTitle: true,
  description:
    'Full Stack AI Engineer in Dhaka, Bangladesh. Web and mobile products built end to end with Next.js, React Native and Node.js, 3+ years in production.',
  path: '/'
})

const jsonLd = graph(websiteNode(), personNode(), {
  '@type': 'ProfilePage',
  '@id': `${SITE_URL}/#profile`,
  url: SITE_URL,
  name: `${profile.name}, ${profile.jobTitle}`,
  isPartOf: { '@id': `${SITE_URL}/#website` },
  mainEntity: { '@id': `${SITE_URL}/#person` }
})

export default async function Home() {
  const [projects, posts] = await Promise.all([getProjects(), getBlogs()])
  return (
    <>
      <main id="main">
        <JsonLd data={jsonLd} />
        <Hero />
        <SkillsMarquee />
        <SelectedWork projects={projects} />
        <UpClose projects={projects} />
        <Statement />
        <Experience />
        <WritingTeaser posts={posts} />
        <Contact />
      </main>
    </>
  )
}
