import { PreloadContent } from '@/components/providers/preload-content'
import { PreloadProvider } from '@/components/providers/preload-provider'
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { PreloadSplash } from '@/components/ui/preload-splash'
import { TubelightNavBar } from '@/components/ui/tubelight-navbar'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar/Navbar'

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
  title: 'Rafi Ferdos | Portfolio',
  description: `
    Rafi Ferdos - A MERN Stack Developer specializing in building dynamic and responsive web applications. Explore my portfolio to see my projects and skills in action. Technologies including NextJS, React, Node.js, Express, and MongoDB.    
  `
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
          {/* PRELOADER DISABLED - causes FOUC with GSAP animations */}
          {/* <PreloadProvider>
            <PreloadSplash />
            <PreloadContent> */}
          <SmoothScrollProvider>
            <div className="space-y-7">
              <div className="h-24">
                <TubelightNavBar />
              </div>
              {children}
            </div>
          </SmoothScrollProvider>
          {/* </PreloadContent>
          </PreloadProvider> */}
        </ThemeProvider>
      </body>
    </html>
  )
}
