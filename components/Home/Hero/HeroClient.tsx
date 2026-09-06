'use client'

import GlassSurface from '@/components/ui/GlassSurface'
import { PixelImage } from '@/components/ui/pixel-image'
import { Reveal } from '@/components/ui/reveal'
import { Ripple } from '@/components/ui/ripple'
import { MapPin } from 'lucide-react'

export default function HeroClient() {
  return (
    <Reveal
      delay={0.13}
      direction="left"
      className="order-1 h-full lg:order-2"
    >
      <div className="relative mx-auto flex min-h-[350px] w-full max-w-[520px] items-center justify-center sm:min-h-[440px] lg:min-h-[560px]">
        <Ripple className="[mask-image:none] opacity-45 dark:opacity-70" />
        <div className="relative z-10">
          <PixelImage
            src="https://github.com/rafiferdos.png"
            grid="8x8"
            pixelFadeInDuration={900}
            colorRevealDelay={900}
          />
        </div>

        <div className="absolute bottom-5 left-1/2 z-20 w-[min(230px,78vw)] -translate-x-1/2 sm:bottom-8 sm:left-8 sm:translate-x-0">
          <GlassSurface
            width="100%"
            height="fit-content"
            borderRadius={22}
            blur={180}
            backgroundOpacity={0.48}
            saturation={1.7}
            distortionScale={-90}
            opacity={0.96}
            brightness={62}
            className="relative min-w-0"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <MapPin className="size-4" />
              </div>
              <div>
                <p className="text-xs font-semibold">Dhaka, Bangladesh</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Available locally and worldwide
                </p>
              </div>
            </div>
          </GlassSurface>
        </div>
      </div>
    </Reveal>
  )
}
