import Image from 'next/image'
import type { Project } from '@/data/site-content'
import { UpCloseMotion } from '@/features/home/up-close-motion'
import { pickFeatured } from '@/features/projects/featured'

const MIN_ITEMS = 3
// Used when a cover has no stored size yet (before the backfill runs).
const FALLBACK_RATIO = 1.6

export type Media = {
  url: string
  width: number
  height: number
  alt: string
  label: string
  blur?: string
}

// Each featured project contributes its cover, then its gallery.
function collectMedia(projects: Project[]): Media[] {
  return pickFeatured(projects).flatMap((project) => {
    const cover: Media[] = project.imageUrl
      ? [
          {
            url: project.imageUrl,
            width: project.coverWidth ?? 1600,
            height: project.coverHeight ?? Math.round(1600 / FALLBACK_RATIO),
            alt: `${project.title} preview`,
            label: project.title,
            blur: project.coverBlur
          }
        ]
      : []
    const gallery = (project.gallery ?? []).map((item) => ({ ...item, label: item.label || project.title }))
    return [...cover, ...gallery]
  })
}

const pad = (value: number) => String(value).padStart(2, '0')

export function UpClose({ projects }: { projects: Project[] }) {
  const media = collectMedia(projects)
  if (media.length < MIN_ITEMS) return null
  return <UpCloseView media={media} />
}

// Shared with the project detail page, which passes its own gallery.
export function UpCloseView({ media, title = '(Up close)' }: { media: Media[]; title?: string }) {
  return (
    <UpCloseMotion id="up-close" className="upclose py-section">
      <header className="t-label flex items-baseline justify-between gap-6 px-gutter pb-6">
        <h2 id="upclose-title" className="t-label">
          {title}
        </h2>
        <span className="text-site-muted">
          <span className="hidden md:inline">Drag or scroll</span>
          <span className="md:hidden">Swipe</span>
        </span>
      </header>

      <div
        data-upclose-viewport
        tabIndex={0}
        role="region"
        aria-labelledby="upclose-title"
        className="upclose-viewport"
      >
        <div data-upclose-drag>
          <ul data-upclose-track className="upclose-track">
            {media.map((item, index) => (
              <li
                key={`${item.url}-${index}`}
                className="upclose-item"
                style={{ '--ratio': item.width / item.height } as React.CSSProperties}
              >
                <div className="upclose-frame">
                  <Image
                    src={item.url}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(min-width: 768px) 70vw, 85vw"
                    draggable={false}
                    className="size-full object-cover"
                    {...(item.blur ? { placeholder: 'blur' as const, blurDataURL: item.blur } : {})}
                  />
                </div>
                <p className="t-label-s mt-3 text-site-muted">
                  ({pad(index + 1)}) {item.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </UpCloseMotion>
  )
}
