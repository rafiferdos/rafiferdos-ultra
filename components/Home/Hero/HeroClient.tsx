'use client'
import { Highlighter } from '@/components/ui/highlighter'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { LineShadowText } from '@/components/ui/line-shadow-text'
import { MorphingText } from '@/components/ui/morphing-text'
import { PixelImage } from '@/components/ui/pixel-image'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { Ripple } from '@/components/ui/ripple'
import { DotLottiePlayer } from '@dotlottie/react-player'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function HeroClient() {
  const containerRef = useRef<HTMLElement>(null)

  const texts = [
    'Software Developer',
    'MERN Stack Developer',
    'Next.js Developer',
    'React Native Developer',
    'App Developer'
  ]

  useGSAP(() => {
    // Entrance animations
    const tl = gsap.timeline()

    tl.from('.hero-title-reveal', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    })
      .from('.hero-text-reveal', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.5')
      .from('.hero-desc-reveal', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6')
      .from('.hero-btn-reveal', {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }, '-=0.6')


    // Rocket Launch Animation using ScrollTrigger
    gsap.to('.rocket-container', {
      y: -window.innerHeight - 200,
      ease: 'power1.in',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1, // Smooth scrubbing
        // markers: true
      }
    })

  }, { scope: containerRef })

  return (
    // Main grid container
    <section id="hero" ref={containerRef} className="w-full max-w-7xl mx-auto grid grid-cols-2 lg:gap-24 gap-5 place-content-center px-4 min-h-[calc(100vh-10rem)] relative">
      {/* Left column with text content */}
      <div className="col-span-2 lg:col-span-1 space-y-3 flex flex-col justify-center max-w-2xl h-full">
        <div className="hero-title-reveal">
          <h1 className="text-3xl leading-none tracking-tighter text-balance sm:text-4xl md:text-5xl lg:text-7xl">
            It&apos;s me{' '}
            <LineShadowText className="italic text-8xl font-agale">
              Rafi
            </LineShadowText>
          </h1>
        </div>

        <div className="hero-text-reveal text-3xl flex items-baseline gap-2 justify-start">
          <span className="leading-none">I&apos;m a</span>
          <MorphingText className="leading-none" texts={texts} />
        </div>

        <div className="hero-desc-reveal leading-relaxed">
          I&apos;m a passionate MERN Stack Developer with a knack for{' '}
          <Highlighter action="underline" color="#FF9800">
            crafting dynamic
          </Highlighter>{' '}
          and responsive web applications. With expertise in Next.js, React,
          Node.js, Express, and MongoDB, I bring ideas to life through code.
          Explore my portfolio to see my projects and{' '}
          <Highlighter action="highlight" color="#87CEFA">
            skills in action.
          </Highlighter>
        </div>

        <div className="flex items-center justify-center w-fit gap-2">
          <div className="hero-btn-reveal">
            <Link href={'/resume.pdf'}> {/* Assuming resume link, keeping consistent */}
              <RainbowButton
                className="rounded-full h-10 px-12"
                variant={'outline'}
              >
                Resume
              </RainbowButton>
            </Link>
          </div>
          <div className="hero-btn-reveal">
            <Link href={'#contact'}>
              <InteractiveHoverButton className="text-sm h-10.5 px-8">
                Contact Me
              </InteractiveHoverButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Right column image */}
      <div className="col-span-2 lg:col-span-1 h-full">
        <div className="relative max-h-[500px] w-full flex items-center justify-center">
          <Ripple className="[mask-image:none]" />
          <div className="z-10">
            <PixelImage
              src="https://github.com/rafiferdos.png"
              grid="8x8"
              pixelFadeInDuration={1000}
              colorRevealDelay={1300}
            />
          </div>
        </div>
      </div>

      {/* Rocket Animation */}
      <div
        className="rocket-container absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <DotLottiePlayer
          src="/rocket-launch.lottie"
          autoplay
          loop
          style={{ width: '100px', height: '100px' }}
        />
      </div>
    </section>
  )
}
