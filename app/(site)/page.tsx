import { Contact } from '@/features/home/contact'
import { Experience } from '@/features/home/experience'
import { Hero } from '@/features/home/hero'
import { Statement } from '@/features/home/statement'
import { WritingTeaser } from '@/features/home/writing-teaser'
import { SelectedWork } from '@/features/home/selected-work'
import { UpClose } from '@/features/home/up-close'
import { SkillsMarquee } from '@/features/home/skills-marquee'
import { getBlogs, getProjects } from '@/lib/content-store'
import { Metadata } from 'next'
import { OG_IMAGE, profile, safeJsonLd, SITE_URL } from '@/lib/site'

const homeTitle = `${profile.name}, ${profile.jobTitle}`

export const metadata: Metadata = {
  // absolute: the root layout's template would otherwise append the name a second time.
  title: { absolute: homeTitle },
  description: `${profile.name} is a ${profile.jobTitle}. Web and mobile products built end to end, with 3+ years in production and international client work.`,
  keywords: [
    'Rafi Ferdos',
    'Full Stack AI Engineer',
    'AI engineer',
    'Next.js developer',
    'React developer',
    'React Native developer',
    'Full-stack developer',
    'Node.js',
    'Express',
    'MongoDB',
    'PostgreSQL',
    'GraphQL',
    'React Native',
    'Rafi Ferdos portfolio'
  ],
  authors: [{ name: 'Rafi Ferdos', url: SITE_URL }],
  creator: 'Rafi Ferdos',
  publisher: 'Rafi Ferdos',
  openGraph: {
    title: homeTitle,
    description: `${profile.jobTitle}. Web, mobile and real-time products built with Next.js, React Native, Node.js, GraphQL and Socket.IO.`,
    url: SITE_URL,
    siteName: 'Rafi Ferdos Portfolio',
    type: 'website',
    locale: 'en_US',
    images: [OG_IMAGE]
  },
  twitter: {
    card: 'summary_large_image',
    title: homeTitle,
    description: `Production web, mobile and real-time work from ${profile.jobTitle} ${profile.name}.`,
    images: [OG_IMAGE]
  },
  alternates: {
    canonical: SITE_URL
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1
    }
  }
}

export default async function Home() {
  const [projects, posts] = await Promise.all([getProjects(), getBlogs()])
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: SITE_URL,
    mainEntity: {
      '@type': 'Person',
      name: profile.name,
      url: SITE_URL,
      image: `${SITE_URL}/rafi.png`,
      jobTitle: profile.jobTitle,
      email: `mailto:${profile.email}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dhaka',
        addressCountry: 'BD'
      },
      sameAs: [profile.github, profile.linkedin, profile.x],
      knowsAbout: [
        'Next.js',
        'React',
        'React Native',
        'Node.js',
        'PostgreSQL',
        'Prisma ORM',
        'GraphQL',
        'Realtime systems',
        'Ecommerce development',
        'AI engineering',
        'RAG',
        'AWS',
        'Docker',
        'CI/CD'
      ]
    }
  }
  return (
    <>
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
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
