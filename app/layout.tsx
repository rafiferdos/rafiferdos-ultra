import { ThemeProvider } from '@/components/providers/theme-provider'
import type { Metadata } from 'next'
import { SITE_URL, profile } from '@/lib/site'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

// preload is off so public pages never fetch Geist; only the dashboard uses it.
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  preload: false
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: false
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Rafi Ferdos · Full Stack Product Engineer',
    template: '%s · Rafi Ferdos'
  },
  description:
    'Full-stack developer in Bangladesh building polished web, mobile, ecommerce and realtime products with Next.js, React Native, Node.js and PostgreSQL.',
  applicationName: 'Rafi Ferdos Portfolio',
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  publisher: profile.name,
  category: 'technology',
  keywords: [
    'hire full stack developer Bangladesh',
    'Next.js developer for hire',
    'React Native developer Bangladesh',
    'freelance web developer Bangladesh',
    'remote full stack engineer',
    'ecommerce developer',
    'Node.js developer',
    'Rafi Ferdos'
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Rafi Ferdos',
    locale: 'en_US',
    title: 'Rafi Ferdos · Full Stack Product Engineer',
    description:
      'Production-ready web, mobile, ecommerce and realtime engineering for teams and clients.',
    images: [
      {
        url: '/og.png',
        width: 1729,
        height: 910,
        alt: 'Rafi Ferdos — Full-stack product engineer'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@rafiferdos',
    title: 'Rafi Ferdos · Full Stack Product Engineer',
    description: 'Production-ready web, mobile and realtime engineering.',
    images: ['/og.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
      : undefined
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
