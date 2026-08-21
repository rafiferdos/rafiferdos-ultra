import Contact from '@/components/Home/Contact/Contact'
import { BlogGateway } from '@/components/Home/BlogGateway/BlogGateway'
import Experience from '@/components/Home/Experience/Experience'
import Hero from '@/components/Home/Hero/Hero'
import Projects from '@/components/Home/Projects/Projects'
import TechStack from '@/components/Home/TechStack/TechStack'
import { WhyMe } from '@/components/Home/WhyMe/WhyMe'
import { Footer } from '@/components/Footer/Footer'
import { ScrollToTop } from '@/components/ui/scroll-to-top'
import { getBlogs, getProjects } from '@/lib/content-store'
import { Metadata } from 'next'

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
  return (
    <>
      <main>
        <Hero />
        <div className="mx-auto w-[min(92%,80rem)]">
          <WhyMe />
          <TechStack />
          <Experience />
          <Projects projects={projects} />
          <BlogGateway posts={posts} />
          <Contact />
        </div>
        <ScrollToTop />
      </main>
      <Footer />
    </>
  )
}
