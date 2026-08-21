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
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Link from 'next/link'
import { useRef } from 'react'

const roles = [
  'Full Stack Developer',
  'Next.js Developer',
  'React Native Developer',
  'Product Engineer'
]

const resumeUrl =
  'https://drive.google.com/file/d/1wFjb1ZqswXkKHIQQwq2_qaqCiauGnX24/view'

export default function HeroClient() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })
  const rocketY = useTransform(scrollYProgress, [0, 0.42, 1], [0, -520, -900])
  const rocketX = useTransform(scrollYProgress, [0, 0.42, 1], [0, 36, 90])
  const rocketRotate = useTransform(scrollYProgress, [0, 0.5], [0, 14])
  const rocketOpacity = useTransform(
    scrollYProgress,
    [0, 0.34, 0.58],
    [1, 1, 0]
  )

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative mx-auto grid min-h-svh max-w-7xl scroll-mt-28 grid-cols-2 place-content-center gap-8 overflow-hidden px-4 pb-20 pt-28 lg:gap-20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_30%,rgba(245,158,11,.09),transparent_28%),radial-gradient(circle_at_82%_35%,rgba(139,92,246,.08),transparent_30%)]" />
      <div className="col-span-2 flex h-full max-w-2xl flex-col justify-center lg:col-span-1">
        <Reveal direction="none" duration={0.55}>
          <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/55 px-3 py-1.5 text-xs shadow-sm backdrop-blur-xl">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Open to product roles · selected client work
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
            I build web and mobile products people can use confidently and teams
            can maintain. I&apos;ve{' '}
            <Highlighter action="underline" color="#f59e0b">
              shipped two production ecommerce apps
            </Highlighter>
            , led delivery for international clients, and grown from frontend
            into backend, mobile and technical leadership.
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-foreground/70">
            {['3+ years in production', 'Web + mobile', 'Dhaka · Remote'].map(
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
                Discuss a role or build
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
              width="fit-content"
              height="fit-content"
              borderRadius={22}
              blur={18}
              backgroundOpacity={0.34}
              saturation={1.8}
              distortionScale={-90}
              opacity={0.96}
              brightness={62}
              className="min-w-[222px] border border-white/30 shadow-[0_18px_55px_-22px_rgba(0,0,0,.45)]"
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

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 lg:block"
        style={
          reduceMotion
            ? undefined
            : {
                y: rocketY,
                x: rocketX,
                rotate: rocketRotate,
                opacity: rocketOpacity
              }
        }
      >
        <DotLottiePlayer
          src="/rocket-launch.lottie"
          autoplay
          loop
          style={{ width: '78px', height: '78px' }}
        />
      </motion.div>
    </section>
  )
}
