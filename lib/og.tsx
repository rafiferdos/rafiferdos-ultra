import { ImageResponse } from 'next/og'
import { SITE_URL } from '@/lib/site'

export const ogSize = { width: 1200, height: 630 }

type Card = {
  eyebrow: string
  title: string
  detail?: string
  accent?: string
}

// Same palette as app/opengraph-image.tsx. Satori only does flexbox and has no variable fonts, so this stays plain.
// The title steps down in size so a long error message or headline still fits in four lines.
const titleSize = (title: string) => (title.length > 100 ? 54 : title.length > 70 ? 62 : title.length > 40 ? 74 : 92)

export function ogCard({ eyebrow, title, detail, accent = '#c7340e' }: Card) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#f3f1ec',
          color: '#141312'
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, letterSpacing: 2, color: '#6a665f' }}>{eyebrow.toUpperCase()}</div>
        <div
          style={{
            display: 'flex',
            fontSize: titleSize(title),
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: -2,
            maxHeight: 380,
            overflow: 'hidden'
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 28, color: '#6a665f' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ display: 'flex', fontWeight: 800, color: '#141312' }}>Rafi Ferdos</span>
            <span style={{ display: 'flex', width: 22, height: 22, marginLeft: 10, background: accent }} />
            {detail ? <span style={{ display: 'flex', marginLeft: 28 }}>{detail}</span> : null}
          </div>
          <span style={{ display: 'flex' }}>{new URL(SITE_URL).host}</span>
        </div>
      </div>
    ),
    ogSize
  )
}
