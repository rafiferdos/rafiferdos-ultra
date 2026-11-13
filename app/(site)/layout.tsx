import { MotionProvider } from '@/components/providers/motion-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider'
import { TubelightNavBar } from '@/components/ui/tubelight-navbar'
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
  "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&localStorage.getItem('motion-paused')!=='1')document.documentElement.classList.add('js-motion')}catch(e){}"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${mona.variable} ${jetbrains.variable} site-root min-h-svh bg-site-bg font-site text-site-ink`}
    >
      <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      <MotionProvider>
        <SmoothScrollProvider>
          {/* Old shell until the new header lands in phase 2; Contact still uses react-query until phase 8. */}
          <QueryProvider>
            <TubelightNavBar />
            {children}
          </QueryProvider>
        </SmoothScrollProvider>
      </MotionProvider>
    </div>
  )
}
