import Contact from '@/components/Home/Contact/Contact'
import { BlogGateway } from '@/components/Home/BlogGateway/BlogGateway'
import TechStack from '@/components/Home/TechStack/TechStack'
import { Experience } from '@/features/home/experience'
import { Hero } from '@/features/home/hero'
import { Statement } from '@/features/home/statement'
import { SelectedWork } from '@/features/home/selected-work'
import { UpClose } from '@/features/home/up-close'
import { SkillsMarquee } from '@/features/home/skills-marquee'
import { getBlogs, getProjects } from '@/lib/content-store'
import { Metadata } from 'next'
import { profile, safeJsonLd, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: {
    default: 'Rafi Ferdos — Full Stack Product Engineer',
    template: '%s | Rafi Ferdos'
  },
  description:
    'Rafi Ferdos is a full-stack developer with 3+ years building production web and mobile products for product teams and international clients.',
  keywords: [
    'Rafi Ferdos',
    'MERN developer',
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
  authors: [{ name: 'Rafi Ferdos', url: 'https://rafiferdos.vercel.app' }],
  creator: 'Rafi Ferdos',
  publisher: 'Rafi Ferdos',
  openGraph: {
    title: 'Rafi Ferdos — Full Stack Product Engineer',
    description:
      'Full-stack web, mobile and realtime products built with Next.js, React Native, Node.js, GraphQL and Socket.io.',
    url: 'https://rafiferdos.com',
    siteName: 'Rafi Ferdos Portfolio',
    images: [
      {
        url: '/og.png',
        width: 1729,
        height: 910,
        alt: 'Rafi Ferdos — Full Stack Product Engineer'
      }
    ],
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rafi Ferdos — Full Stack Product Engineer',
    description:
      'Production web, mobile and realtime work from full-stack developer Rafi Ferdos.',
    images: ['/og.png']
  },
  alternates: {
    canonical: 'https://rafiferdos.com'
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
      telephone: profile.phone,
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
        'Ecommerce development'
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
        <div className="mx-auto w-[min(92%,80rem)]">
          <TechStack />
          <BlogGateway posts={posts} />
          <Contact />
        </div>
      </main>
    </>
  )
}
