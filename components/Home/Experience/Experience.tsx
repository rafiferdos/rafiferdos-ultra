'use client'

import { SectionHeading } from '@/components/Home/SectionHeading'
import { BorderBeam } from '@/components/ui/border-beam'
import { Reveal } from '@/components/ui/reveal'
import { experiences } from '@/data/site-content'
import { ArrowUpRight, Check, MapPin } from 'lucide-react'

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-24 sm:py-32">
      <SectionHeading eyebrow="03 · Experience" title="A career built by" accent="expanding ownership." description="From leading a club web team to shipping full-stack and mobile products for international clients—each role widened the problems I could own and the teams I could support." />
      <div className="relative mx-auto mt-16 max-w-6xl">
        <div className="absolute bottom-0 left-[19px] top-2 w-px bg-gradient-to-b from-primary via-violet-500/70 to-transparent md:left-1/2" />
        <div className="space-y-10 md:space-y-16">
          {experiences.map((experience, index) => (
            <div key={experience.company} className="relative grid gap-5 pl-14 md:grid-cols-2 md:gap-14 md:pl-0">
              <div className="absolute left-2.5 top-7 z-10 flex size-[19px] items-center justify-center rounded-full border-4 border-background bg-primary shadow-[0_0_0_5px_rgba(245,158,11,.13),0_0_28px_rgba(245,158,11,.55)] md:left-1/2 md:-translate-x-1/2"><span className="size-1.5 rounded-full bg-background" /></div>
              <Reveal direction={index % 2 === 0 ? 'right' : 'left'} className={index % 2 === 0 ? 'md:text-right' : 'md:col-start-2'}>
                <div className={index % 2 === 0 ? 'md:pr-4' : 'md:pl-4'}>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[.2em] text-primary">{experience.period}</p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-.045em]">{experience.role}</h3>
                  <p className="mt-2 text-base font-medium text-foreground/70">{experience.company}</p>
                  <p className={`mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}><MapPin className="size-3.5" />{experience.location}</p>
                </div>
              </Reveal>
              <Reveal delay={0.09} direction={index % 2 === 0 ? 'left' : 'right'} className={index % 2 === 0 ? 'md:col-start-2 md:row-start-1' : 'md:col-start-1 md:row-start-1'}>
                <article className="group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-7">
                  {index === 0 && <BorderBeam size={110} duration={11} colorFrom="#f59e0b" colorTo="#8b5cf6" />}
                  <p className="text-sm leading-7 text-muted-foreground">{experience.summary}</p>
                  <div className="mt-6 grid grid-cols-3 gap-2">{experience.metrics.map((metric) => <div key={metric.label} className="rounded-xl border border-border/60 bg-muted/40 p-3"><p className="text-lg font-semibold tracking-tight text-foreground">{metric.value}</p><p className="mt-1 text-[9px] leading-4 text-muted-foreground sm:text-[10px]">{metric.label}</p></div>)}</div>
                  <ul className="mt-6 space-y-3">{experience.highlights.map((highlight) => <li key={highlight} className="flex gap-3 text-sm leading-6 text-foreground/75"><span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"><Check className="size-2.5" /></span>{highlight}</li>)}</ul>
                  <div className="mt-6 flex flex-wrap gap-2">{experience.stack.map((technology) => <span key={technology} className="rounded-full border border-border/60 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">{technology}</span>)}</div>
                </article>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
      <Reveal delay={0.1} className="mx-auto mt-14 w-fit"><a href="https://drive.google.com/file/d/1wFjb1ZqswXkKHIQQwq2_qaqCiauGnX24/view" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium transition hover:border-primary/50 hover:text-primary">Open full résumé <ArrowUpRight className="size-4" /></a></Reveal>
    </section>
  )
}
