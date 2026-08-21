import ClientResolver from '@/components/core/client-resolver'
import { LightRays } from '@/components/ui/light-rays'
import HeroClient from './HeroClient'

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      <ClientResolver>
        <HeroClient />
      </ClientResolver>
      <LightRays className="-z-0 opacity-70" count={5} speed={18} />
    </div>
  )
}

export default Hero
