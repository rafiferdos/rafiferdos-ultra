'use client'

import { SectionHeading } from '@/components/Home/SectionHeading'
import { BorderBeam } from '@/components/ui/border-beam'
import { MagicCard } from '@/components/ui/magic-card'
import { Reveal } from '@/components/ui/reveal'
import { Strands } from '@/components/ui/strands'
import { GitPullRequest, Network, Smartphone, TrendingUp } from 'lucide-react'

const reasons = [
  {
    icon: TrendingUp,
    title: 'I earn bigger ownership',
    description:
      'At Sparktech I grew from frontend to full stack in 3 months, React Native in 7, and earned two merit raises within 10 months.'
  },
  {
    icon: Smartphone,
    title: 'I ship beyond the browser',
    description:
      'I delivered two production ecommerce mobile apps end-to-end while keeping the web, API and mobile experience aligned.'
  },
  {
    icon: Network,
    title: 'I simplify complex systems',
    description:
      'I moved product integrations from REST to GraphQL and built Socket.io chat and notifications for concurrent users.'
  },
  {
    icon: GitPullRequest,
    title: 'I raise the team baseline',
    description:
      'I led foreign-client delivery, completed 35+ code reviews and previously took ownership of a dedicated club web team.'
  }
]

export function WhyMe() {
  return (
    <section id="whyme" className="scroll-mt-24 py-24 sm:py-32">
      <SectionHeading
        eyebrow="01 · Why me"
        title="Useful from the first task."
        accent="More valuable over time."
        description="Whether I join a product team or take on a client build, the pattern is consistent: I start with the immediate problem, understand the surrounding system and earn broader ownership."
      />
      <div className="mt-14 grid gap-5 lg:grid-cols-[.92fr_1.08fr]">
        <Reveal direction="right" className="min-h-[480px]">
          <div className="relative h-full min-h-[480px] overflow-hidden rounded-[2rem] border border-border/70 bg-white shadow-2xl shadow-black/10 dark:bg-zinc-950">
            <Strands className="absolute inset-0 opacity-45 dark:opacity-100" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,rgba(255,255,255,.1)_42%,rgba(255,255,255,.94)_100%)] dark:bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(9,9,11,.05)_45%,rgba(9,9,11,.92)_100%)]" />
            <BorderBeam
              size={180}
              duration={12}
              colorFrom="#f59e0b"
              colorTo="#8b5cf6"
            />
            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
              <p className="font-mono text-xs uppercase tracking-[.24em] text-amber-700 dark:text-amber-300">
                Frontend → full stack → mobile
              </p>
              <h3 className="mt-3 max-w-md text-3xl font-semibold tracking-[-.04em] text-foreground sm:text-4xl">
                My range came from shipped responsibility.
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
                Three years of expanding from interfaces into APIs, data,
                realtime systems, mobile delivery and technical leadership—not
                collecting technologies in isolation.
              </p>
            </div>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <Reveal
                key={reason.title}
                delay={index * 0.07}
                className="h-full"
              >
                <MagicCard
                  className="h-full min-h-[230px] rounded-[1.75rem]"
                  gradientColor="rgba(245, 158, 11, .13)"
                  gradientFrom="#f59e0b"
                  gradientTo="#8b5cf6"
                >
                  <div className="flex h-full flex-col p-6 sm:p-7">
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-8 text-xl font-semibold tracking-[-.025em]">
                      {reason.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {reason.description}
                    </p>
                  </div>
                </MagicCard>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
