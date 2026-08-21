import { AuroraText } from '@/components/ui/aurora-text'
import { Reveal } from '@/components/ui/reveal'

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = 'center'
}: {
  eyebrow: string
  title: string
  accent: string
  description: string
  align?: 'center' | 'left'
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <Reveal>
        <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-7xl">
          {title}{' '}
          <AuroraText colors={['#f59e0b', '#fb7185', '#8b5cf6', '#22d3ee']}>
            {accent}
          </AuroraText>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mt-5 text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
          {description}
        </p>
      </Reveal>
    </div>
  )
}
