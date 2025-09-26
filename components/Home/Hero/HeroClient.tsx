'use client'

import { BlurFade } from '@/components/ui/blur-fade'
import { LineShadowText } from '@/components/ui/line-shadow-text'
import { MorphingText } from '@/components/ui/morphing-text'
import { useTheme } from 'next-themes'

export default function HeroClient() {
  const theme = useTheme()
  // Robust dark detection across hydration:
  // 1) Use resolvedTheme when available
  // 2) Fallback to html.dark class
  // 3) As last resort, system preference
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  const htmlHasDark =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')
  const resolved = theme.resolvedTheme
  const isDark = resolved ? resolved === 'dark' : htmlHasDark || prefersDark
  const shadowColor = isDark ? 'white' : 'black'
  const themeKey = resolved ?? (isDark ? 'dark' : 'light')
  const texts = [
    'Full Stack Developer',
    'MERN Stack Developer',
    'Next.js Developer',
    'React Developer',
    'Node.js Developer',
    'Express.js Developer',
    'MongoDB Developer'
  ]
  return (
    // Main grid container
    <section className="grid grid-cols-2 border">
      {/* Left column with text content */}
      <div className="col-span-2 lg:col-span-1 border">
        <BlurFade delay={0.3} inView>
          <h1 className="text-3xl leading-none tracking-tighter text-balance sm:text-4xl md:text-5xl lg:text-7xl">
            It's me{' '}
            <LineShadowText
              key={themeKey}
              className="italic text-8xl font-agale"
              shadowColor={shadowColor}
            >
              Rafi
            </LineShadowText>
          </h1>
        </BlurFade>
        <BlurFade delay={0.6} inView>
          <div className="text-3xl flex items-baseline gap-2 justify-start">
            <span className="leading-none">I'm a</span>

            <MorphingText className="leading-none" texts={texts} />
          </div>
        </BlurFade>
      </div>
      {/* Right column image */}
      <div className="col-span-2 lg:col-span-1 border"></div>
    </section>
  )
}
