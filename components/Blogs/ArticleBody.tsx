import { Reveal } from '@/components/ui/reveal'

type Block =
  | { type: 'code'; language: string; value: string }
  | { type: 'text'; value: string }

function blocks(markdown: string): Block[] {
  const result: Block[] = []
  const pattern = /```([\w+#.-]*)\n([\s\S]*?)```/g
  let cursor = 0
  for (const match of markdown.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > cursor)
      result.push({ type: 'text', value: markdown.slice(cursor, index) })
    result.push({
      type: 'code',
      language: match[1] || 'code',
      value: match[2].trimEnd()
    })
    cursor = index + match[0].length
  }
  if (cursor < markdown.length)
    result.push({ type: 'text', value: markdown.slice(cursor) })
  return result
}

export function ArticleBody({
  content,
  animated = true
}: {
  content: string
  animated?: boolean
}) {
  const Wrapper = animated
    ? Reveal
    : ({ children }: { children: React.ReactNode }) => <>{children}</>
  return (
    <div className="min-w-0">
      {blocks(content).flatMap((block, blockIndex) => {
        if (block.type === 'code')
          return [
            <Wrapper
              key={`code-${blockIndex}`}
              delay={Math.min(blockIndex * 0.035, 0.16)}
            >
              <div className="my-8 overflow-hidden rounded-2xl border border-white/10 bg-[#09090b] shadow-2xl shadow-black/15">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-rose-400" />
                    <span className="size-2.5 rounded-full bg-amber-300" />
                    <span className="size-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[.16em] text-zinc-500">
                    {block.language}
                  </span>
                </div>
                <pre className="max-w-full overflow-x-auto p-4 text-[13px] leading-7 text-zinc-200 sm:p-6 sm:text-sm">
                  <code>{block.value}</code>
                </pre>
              </div>
            </Wrapper>
          ]
        return block.value
          .split(/\n\n+/)
          .filter(Boolean)
          .map((part, index) => {
            const value = part.trim()
            const heading = value.match(/^(#{2,3})\s+(.+)$/)
            if (heading)
              return (
                <Wrapper
                  key={`heading-${blockIndex}-${index}`}
                  delay={Math.min((blockIndex + index) * 0.035, 0.16)}
                >
                  <h2 className="mb-4 mt-10 text-2xl font-semibold tracking-[-.035em] sm:text-3xl">
                    {heading[2]}
                  </h2>
                </Wrapper>
              )
            return (
              <Wrapper
                key={`text-${blockIndex}-${index}`}
                delay={Math.min((blockIndex + index) * 0.035, 0.16)}
              >
                <p className="mb-6 text-base leading-8 text-foreground/80 sm:mb-7 sm:text-[1.08rem] sm:leading-9">
                  {value}
                </p>
              </Wrapper>
            )
          })
      })}
    </div>
  )
}
