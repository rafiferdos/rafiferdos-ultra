import { MotionProvider } from '@/components/providers/motion-provider'
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider'
import { Cursor } from '@/components/site/cursor'
import { SiteFooter } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { Intro } from '@/components/site/intro'
import { PageTransition } from '@/components/site/page-transition'
import { JetBrains_Mono, Mona_Sans } from 'next/font/google'

const mona = Mona_Sans({
  variable: '--font-mona',
  subsets: ['latin'],
  axes: ['wdth'],
  style: ['normal', 'italic'],
  display: 'swap'
})

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap'
})

// Runs before first paint so hidden initial states only apply when motion is allowed.
const motionBoot =
  "try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&localStorage.getItem('motion-paused')!=='1'){d.classList.add('js-motion');if(location.pathname==='/'&&!sessionStorage.getItem('intro-seen')){d.classList.add('js-intro');setTimeout(function(){d.classList.remove('js-intro')},4000)}}}catch(e){}"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${mona.variable} ${jetbrains.variable} site-root min-h-svh bg-site-bg font-site text-site-ink`}
    >
      <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      <MotionProvider>
        <SmoothScrollProvider>
          <a
            href="#main"
            className="t-label fixed left-gutter top-3 z-[110] -translate-y-20 bg-site-accent px-3 py-2 text-site-accent-ink focus:translate-y-0"
          >
            Skip to content
          </a>
          <Header />
          {children}
          <SiteFooter />
          <Cursor />
          <PageTransition />
          <Intro />
        </SmoothScrollProvider>
      </MotionProvider>
    </div>
  )
}
