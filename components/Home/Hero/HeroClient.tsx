'use client'

import { BlurFade } from '@/components/ui/blur-fade'
import { LineShadowText } from '@/components/ui/line-shadow-text'
import { MorphingText } from '@/components/ui/morphing-text'
import { useTheme } from 'next-themes'

export default function HeroClient() {
  const theme = useTheme()
  const shadowColor = theme.resolvedTheme === 'dark' ? 'white' : 'black'
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
    <div>
      <BlurFade delay={0.3} inView>
        <h1 className="text-3xl leading-none tracking-tighter text-balance sm:text-4xl md:text-5xl lg:text-7xl">
          I'm{' '}
          <LineShadowText
            className="italic text-9xl font-agale"
            shadowColor={shadowColor}
          >
            Rafi
          </LineShadowText>
        </h1>
      </BlurFade>
      <BlurFade delay={0.6} inView>
        <div>

        <MorphingText texts={texts} />
        </div>
      </BlurFade>
    </div>
  )
}
