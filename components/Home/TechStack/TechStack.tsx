'use client'

import { SectionHeading } from '@/components/Home/SectionHeading'
import { Marquee } from '@/components/ui/marquee'
import { Reveal } from '@/components/ui/reveal'

const stack = [
  ['Next.js', 'nextdotjs'],
  ['TypeScript', 'typescript'],
  ['React', 'react'],
  ['React Native', 'react'],
  ['Node.js', 'nodedotjs'],
  ['GraphQL', 'graphql'],
  ['Socket.io', 'socketdotio'],
  ['PostgreSQL', 'postgresql'],
  ['MongoDB', 'mongodb'],
  ['Prisma', 'prisma'],
  ['Docker', 'docker'],
  ['Firebase', 'firebase']
]

function StackPill({ item }: { item: (typeof stack)[number] }) {
  return (
    <div className="mx-2 flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 shadow-sm backdrop-blur-xl">
      <img
        src={`https://cdn.simpleicons.org/${item[1]}`}
        alt=""
        className="size-5"
        loading="lazy"
      />
      <span className="whitespace-nowrap text-sm font-medium">{item[0]}</span>
    </div>
  )
}

export default function TechStack() {
  return (
    <section
      id="techstack"
      className="scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <SectionHeading
        eyebrow="02 · Toolkit"
        title="Tools I’ve used to"
        accent="ship real products."
        description="Next.js and React Native for product surfaces, Node.js for services, GraphQL and Socket.io for connected experiences, and PostgreSQL or MongoDB where the data model fits."
      />
      <Reveal className="relative mt-14">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
        <Marquee pauseOnHover className="[--duration:32s]">
          {stack.slice(0, 6).map((item) => (
            <StackPill key={item[0]} item={item} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="mt-4 [--duration:34s]">
          {stack.slice(6).map((item) => (
            <StackPill key={item[0]} item={item} />
          ))}
        </Marquee>
      </Reveal>
    </section>
  )
}
