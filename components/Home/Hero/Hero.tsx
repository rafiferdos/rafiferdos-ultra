import ClientResolver from '@/components/core/client-resolver'
import { LightRays } from '@/components/ui/light-rays'
import HeroClient from './HeroClient'

const Hero = () => {
  return (
    <>
      <ClientResolver>
        <HeroClient />
      </ClientResolver>
      <LightRays />
    </>
  )
}

export default Hero
