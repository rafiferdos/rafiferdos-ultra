import ClientResolver from '@/components/core/client-resolver'
import { LightRays } from '@/components/ui/light-rays'
import { LineShadowText } from '@/components/ui/line-shadow-text'
import { useTheme } from 'next-themes'

const Hero = () => {
  return (
    <div className="border">
      <ClientResolver>
        {(() => {
          const theme = useTheme()
          const shadowColor = theme.resolvedTheme === 'dark' ? 'white' : 'black'
          return (
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Hey I'm{' '}
                <LineShadowText className="italic" shadowColor={shadowColor}>
                  Rafi Ferdos
                </LineShadowText>
              </h1>
            </div>
          )
        })()}
      </ClientResolver>
      <LightRays />
    </div>
  )
}

export default Hero
