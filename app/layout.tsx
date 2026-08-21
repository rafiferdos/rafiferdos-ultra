import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { TubelightNavBar } from '@/components/ui/tubelight-navbar'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

// Note: Agale font is loaded via CSS @font-face in globals.css and is applied
// only when using the `.font-agale` class.

export const metadata: Metadata = {
  metadataBase: new URL('https://rafiferdos.com'),
  title: { default: 'Rafi Ferdos · Full Stack Product Engineer', template: '%s · Rafi Ferdos' },
  description: 'Full-stack developer building polished web, mobile and realtime products with Next.js, React Native, Node.js and GraphQL.'
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
          <SmoothScrollProvider>
            <TubelightNavBar />
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
