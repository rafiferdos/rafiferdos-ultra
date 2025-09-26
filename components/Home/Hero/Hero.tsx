import ClientResolver from '@/components/core/client-resolver'
import { LightRays } from '@/components/ui/light-rays'
import HeroClient from './HeroClient'

const Hero = () => {
  return (
    <div className="border">
      <ClientResolver>
        <HeroClient />
      </ClientResolver>
      <LightRays />
    </div>
  )
}

export default Hero
