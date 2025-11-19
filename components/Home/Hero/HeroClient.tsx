import { BlurFade } from '@/components/ui/blur-fade'
import { Highlighter } from '@/components/ui/highlighter'
import { LineShadowText } from '@/components/ui/line-shadow-text'
import { MorphingText } from '@/components/ui/morphing-text'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { Ripple } from '@/components/ui/ripple'

export default function HeroClient() {
  const texts = [
    'Software Developer',
    'MERN Stack Developer',
    'Next.js Developer',
    'React Developer'
  ]
  return (
    // Main grid container
    <section className="w-full max-w-7xl mx-auto grid grid-cols-2 lg:gap-24 gap-5 place-content-center border px-4">

      {/* Left column with text content */}
      <div className="col-span-2 lg:col-span-1 space-y-3 flex flex-col justify-center max-w-2xl border h-full">
        <BlurFade delay={0.3} inView>
          <h1 className="text-3xl leading-none tracking-tighter text-balance sm:text-4xl md:text-5xl lg:text-7xl">
            It's me{' '}
            <LineShadowText className="italic text-8xl font-agale">
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

        <div className="leading-relaxed">
          I'm a passionate MERN Stack Developer with a knack for{' '}
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

        <div>
          <RainbowButton className='rounded-2xl px-7' variant={'outline'}>Resume</RainbowButton>
        </div>
      </div>

      {/* Right column image */}
      <div className="col-span-2 lg:col-span-1 h-full border">
        <div className="relative h-[500px] w-full overflow-hidden">
          <Ripple />
        </div>
      </div>
    </section>
  )
}
