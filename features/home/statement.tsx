import { StatementMotion } from '@/features/home/statement-motion'

type Kind = 'em' | 'accent'

const segments: { text: string; kind?: Kind }[] = [
  { text: 'Most products are built in pieces, by people who never meet. I build ' },
  { text: 'all of it', kind: 'em' },
  { text: ': the database, the API, the screen in your hand. One person. One standard. ' },
  { text: 'End to end.', kind: 'accent' }
]

// Emphasis segments split into one span per word so the scrub can light them one at a time.
const words = segments.flatMap(({ text, kind }) =>
  text
    .split(' ')
    .filter(Boolean)
    .map((word, index, all) => ({ word, kind, space: index < all.length - 1 || text.endsWith(' ') }))
)

export function Statement() {
  return (
    <StatementMotion id="about" className="statement scroll-mt-16">
      <div className="statement-inner px-gutter py-section">
        <p className="t-label mb-8 text-site-muted">(Hello)</p>
        <p className="t-h1 max-w-[22ch] md:max-w-[26ch]">
          {words.map(({ word, kind, space }, index) => (
            <span key={index}>
              <span data-word className={kind === 'em' ? 'statement-em' : kind === 'accent' ? 'text-site-accent' : undefined}>
                {word}
              </span>
              {space ? ' ' : null}
            </span>
          ))}
        </p>
      </div>
    </StatementMotion>
  )
}
