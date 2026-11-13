type Block =
  | { type: 'code'; language: string; value: string }
  | { type: 'text'; value: string }

function blocks(markdown: string): Block[] {
  const result: Block[] = []
  const pattern = /```([\w+#.-]*)\n([\s\S]*?)```/g
  let cursor = 0
  for (const match of markdown.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > cursor) result.push({ type: 'text', value: markdown.slice(cursor, index) })
    result.push({ type: 'code', language: match[1] || 'code', value: match[2].trimEnd() })
    cursor = index + match[0].length
  }
  if (cursor < markdown.length) result.push({ type: 'text', value: markdown.slice(cursor) })
  return result
}

// Plain markdown fallback for posts that have no rich-text JSON.
export function ArticleBody({ content }: { content: string }) {
  return (
    <div className="prose-site min-w-0">
      {blocks(content).flatMap((block, blockIndex) => {
        if (block.type === 'code')
          return [
            <pre key={`code-${blockIndex}`}>
              <code>{block.value}</code>
            </pre>
          ]
        return block.value
          .split(/\n\n+/)
          .filter(Boolean)
          .map((part, index) => {
            const value = part.trim()
            const heading = value.match(/^(#{2,3})\s+(.+)$/)
            return heading ? (
              <h2 key={`heading-${blockIndex}-${index}`}>{heading[2]}</h2>
            ) : (
              <p key={`text-${blockIndex}-${index}`}>{value}</p>
            )
          })
      })}
    </div>
  )
}
