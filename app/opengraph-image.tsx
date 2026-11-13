import { ImageResponse } from 'next/og'
import { profile, SITE_URL } from '@/lib/site'

export const alt = `${profile.name}, ${profile.jobTitle}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// The default Next font (Mona Sans is a variable width font that satori cannot use), so the italic f is a skewed upright f.
export default function OpengraphImage() {
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
        <div style={{ display: 'flex', fontSize: 28, letterSpacing: 2, color: '#6a665f' }}>{profile.jobTitle.toUpperCase()}</div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 190, lineHeight: 1, letterSpacing: -6 }}>
          <span style={{ fontWeight: 800 }}>RAFI</span>
          <span style={{ fontWeight: 300, margin: '0 0 0 36px', transform: 'skewX(-10deg)' }}>f</span>
          <span style={{ fontWeight: 300 }}>erdos</span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 68,
              height: 68,
              marginLeft: 14,
              background: '#c7340e'
            }}
          >
            <span style={{ width: 36, height: 36, borderRadius: 18, background: '#ffffff' }} />
          </span>
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: '#6a665f' }}>{new URL(SITE_URL).host}</div>
      </div>
    ),
    size
  )
}
