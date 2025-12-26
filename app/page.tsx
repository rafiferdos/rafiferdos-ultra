import Hero from '@/components/Home/Hero/Hero'
import Projects from '@/components/Home/Projects/Projects'
import TechStack from '@/components/Home/TechStack/TechStack'
import { WhyMe } from '@/components/Home/WhyMe/WhyMe'
import { SmoothCursor } from '@/components/ui/smooth-cursor'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Rafi Ferdos — Software Developer',
    template: '%s | Rafi Ferdos'
  },
  description:
    'Rafi Ferdos — MERN Stack Developer building fast, accessible, SEO-friendly web & mobile apps with Next.js, React, React Native, Node.js, Express, MongoDB, PostgreSQL and GraphQL. Browse projects, case studies and contact info.',
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
    title: 'Rafi Ferdos — Software Developer',
    description:
      'Production-ready web & mobile apps built with Next.js, React and Node.js. Explore projects, tech stack and contact details.',
    url: 'https://rafiferdos.com',
    siteName: 'Rafi Ferdos Portfolio',
    images: [
      {
        url: 'https://rafiferdos.com/og-image.png',
        width: 1200,
        height: 627,
        alt: 'Rafi Ferdos — MERN Stack Developer'
      }
    ],
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rafi Ferdos — MERN Stack Developer',
    description:
      'Portfolio showcasing production-ready apps and projects using Next.js, React and Node.js.',
    images: ['https://rafiferdos.com/og-image.png']
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

export default function Home() {
  return (
    <div className="max-w-8xl mx-auto w-11/12">
      <Hero />
      <WhyMe />
      <TechStack />
      <Projects />
      <SmoothCursor />
    </div>
  )
}
