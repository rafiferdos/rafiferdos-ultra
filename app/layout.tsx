import { PreloadProvider } from '@/components/providers/preload-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { PreloadSplash } from '@/components/ui/preload-splash'
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
  title: 'Rafif Erdős | Portfolio',
  description: 'Rafif Erdős – Developer Portfolio'
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
          <PreloadProvider>
            {/* Preloader uses public/preload.lottie */}
            <PreloadSplash />
            <TubelightNavBar />
            {children}
          </PreloadProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
