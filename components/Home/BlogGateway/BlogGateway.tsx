'use client'

import { SectionHeading } from '@/components/Home/SectionHeading'
import { Reveal } from '@/components/ui/reveal'
import { Strands } from '@/components/ui/strands'
import { BlogPost } from '@/data/site-content'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import Link from 'next/link'

export function BlogGateway({ posts }: { posts: BlogPost[] }) {
  return (
    <section id="writing" className="scroll-mt-24 py-24 sm:py-32">
      <SectionHeading
        eyebrow="05 · Field notes"
        title="What I learn while"
        accent="shipping real products."
        description="Notes for engineers, product teams and hiring managers who want to see how I think—not only what the final screen looks like."
      />
      <Reveal className="mt-14">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-2xl shadow-black/5">
          <div className="pointer-events-none absolute inset-0 opacity-55 dark:opacity-85">
            <Strands className="absolute inset-0" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/95 to-card/40 dark:from-card dark:via-card/90 dark:to-card/20" />
          <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[.72fr_1.28fr] lg:p-12">
            <div className="flex flex-col justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[.24em] text-primary">
                  Inside the work
                </p>
                <h3 className="mt-4 max-w-md text-3xl font-semibold tracking-[-.045em] sm:text-4xl">
                  Decisions, tradeoffs and implementation details.
                </h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                  From AI feature guardrails to realtime recovery and mobile
                  checkout resilience.
                </p>
              </div>
              <Link
                href="/blogs"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:scale-[1.02]"
              >
                Read all articles <ArrowUpRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-3">
              {posts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  href={`/blogs/${post.slug}`}
                  className="group rounded-2xl border border-border/70 bg-background/80 p-5 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-primary/35"
                >
                  <div className="flex items-center justify-between gap-4 text-[10px] font-medium uppercase tracking-[.16em] text-muted-foreground">
                    <span>{post.category}</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="size-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <h4 className="text-lg font-semibold tracking-[-.025em] sm:text-xl">
                      {post.title}
                    </h4>
                    <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
