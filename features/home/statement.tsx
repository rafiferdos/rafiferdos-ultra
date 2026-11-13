import { StatementMotion } from '@/features/home/statement-motion'

type Kind = 'em' | 'accent'

// TODO: draft from plan section 2.5, waiting for Rafi's final copy. Facts match docs/resume.md; "motion" is the one claim the resume does not cover.
const segments: { text: string; kind?: Kind }[] = [
  { text: "I'm Rafi. I build the " },
  { text: 'whole thing', kind: 'em' },
  { text: ': the API, the database, the interface and the ' },
  { text: 'motion', kind: 'em' },
  { text: '. Lately that means real-time chat with Socket.IO, moving clients from REST to GraphQL, and ' },
  { text: 'two ecommerce apps in React Native.', kind: 'accent' }
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
