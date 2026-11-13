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

const fullTitle = `${profile.name} · ${profile.jobTitle}`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: fullTitle,
    template: '%s · Rafi Ferdos'
  },
  description: `${profile.jobTitle} in Dhaka, Bangladesh. Web and mobile products built end to end with Next.js, React Native, Node.js and PostgreSQL.`,
  applicationName: 'Rafi Ferdos Portfolio',
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  publisher: profile.name,
  category: 'technology',
  keywords: [
    'Full Stack AI Engineer',
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
    title: fullTitle,
    description: `${profile.jobTitle}. Web, mobile, ecommerce and real-time products for teams and clients.`,
    images: [
      {
        url: '/og.png',
        width: 1729,
        height: 910,
        alt: `${profile.name}, ${profile.jobTitle}`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@rafiferdos',
    title: fullTitle,
    description: `${profile.jobTitle}. Web, mobile and real-time products.`,
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
