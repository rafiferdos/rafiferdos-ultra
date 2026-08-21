'use client'

import GlassSurface from '@/components/ui/GlassSurface'
import { Highlighter } from '@/components/ui/highlighter'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { LineShadowText } from '@/components/ui/line-shadow-text'
import { MorphingText } from '@/components/ui/morphing-text'
import { PixelImage } from '@/components/ui/pixel-image'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { Reveal } from '@/components/ui/reveal'
import { Ripple } from '@/components/ui/ripple'
import { DotLottiePlayer } from '@dotlottie/react-player'
import { ArrowUpRight, CheckCircle2, MapPin } from 'lucide-react'
import Link from 'next/link'

const roles = [
  'Full Stack Developer',
  'Next.js Developer',
  'React Native Developer',
  'Product Engineer'
]

const resumeUrl =
  'https://drive.google.com/file/d/1wFjb1ZqswXkKHIQQwq2_qaqCiauGnX24/view'

export default function HeroClient() {
  return (
    <section
      id="hero"
      className="relative mx-auto grid min-h-svh max-w-7xl grid-cols-2 place-content-center gap-8 px-4 pb-20 pt-28 lg:gap-20"
    >
      <div className="col-span-2 flex h-full max-w-2xl flex-col justify-center lg:col-span-1">
        <Reveal direction="none" duration={0.55}>
          <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/55 px-3 py-1.5 text-xs shadow-sm backdrop-blur-xl">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Available for select product work
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="text-balance text-4xl leading-none tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-7xl">
            It&apos;s me{' '}
            <LineShadowText className="font-agale text-[1.3em] italic">
              Rafi
            </LineShadowText>
          </h1>
        </Reveal>

        <Reveal delay={0.11}>
          <div className="mt-5 flex flex-col gap-2 text-2xl tracking-[-0.04em] sm:flex-row sm:items-baseline sm:text-3xl">
            <span className="shrink-0 leading-none">I&apos;m a</span>
            <MorphingText
              className="min-w-0 text-left text-2xl leading-none text-primary sm:text-3xl"
              texts={roles}
            />
          </div>
        </Reveal>

        <Reveal delay={0.17}>
          <p className="mt-7 max-w-xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
            A full-stack developer with 3+ years across web, backend and React
            Native. I&apos;ve{' '}
            <Highlighter action="underline" color="#f59e0b">
              shipped two production ecommerce apps
            </Highlighter>
            , led delivery for foreign clients, and built GraphQL and realtime
            systems that stay clean under pressure.
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-foreground/70">
            {['Frontend → full stack', 'Web + mobile', 'Dhaka · Remote'].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  {item}
                </span>
              )
            )}
          </div>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-9 flex w-fit flex-wrap items-center gap-3">
            <RainbowButton
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-7"
            >
              <a href={resumeUrl} target="_blank" rel="noreferrer">
                Résumé <ArrowUpRight className="size-4" />
              </a>
            </RainbowButton>
            <Link href="#contact">
              <InteractiveHoverButton className="h-11 px-7 text-sm">
                Contact me
              </InteractiveHoverButton>
            </Link>
          </div>
        </Reveal>
      </div>

      <Reveal
        delay={0.13}
        direction="left"
        className="col-span-2 h-full lg:col-span-1"
      >
        <div className="relative mx-auto flex min-h-[440px] w-full max-w-[520px] items-center justify-center lg:min-h-[560px]">
          <Ripple className="[mask-image:none] opacity-70" />
          <div className="relative z-10">
            <PixelImage
              src="https://github.com/rafiferdos.png"
              grid="8x8"
              pixelFadeInDuration={900}
              colorRevealDelay={900}
            />
          </div>

          <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 sm:left-8 sm:translate-x-0">
            <GlassSurface
              width="auto"
              height="auto"
              borderRadius={22}
              blur={14}
              backgroundOpacity={0.12}
              saturation={1.45}
              distortionScale={-90}
              className="min-w-[210px]"
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold">Dhaka, Bangladesh</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Shipping for teams worldwide
                  </p>
                </div>
              </div>
            </GlassSurface>
          </div>
        </div>
      </Reveal>

      <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 lg:block">
        <DotLottiePlayer
          src="/rocket-launch.lottie"
          autoplay
          loop
          style={{ width: '78px', height: '78px' }}
        />
      </div>
    </section>
  )
}
