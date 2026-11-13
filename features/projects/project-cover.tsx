import Image from 'next/image'
import type { Project } from '@/data/site-content'

type Props = { project: Project; sizes: string; decorative?: boolean; priority?: boolean }

// Fills its parent, which owns the 4:5 box. Until Rafi adds a cover the frame is a labelled placeholder.
export function ProjectCover({ project, sizes, decorative, priority }: Props) {
  const { imageUrl, coverWidth, coverHeight, coverBlur, accent, title } = project
  if (!imageUrl)
    return (
      <div className="t-label-s grid size-full place-items-center bg-site-surface text-site-muted">
        (Cover pending)
      </div>
    )

  const blur = coverBlur ? ({ placeholder: 'blur', blurDataURL: coverBlur } as const) : {}
  const size =
    coverWidth && coverHeight ? { width: coverWidth, height: coverHeight } : { fill: true as const }
  return (
    <div className="relative size-full" style={{ backgroundColor: accent }}>
      <Image
        src={imageUrl}
        alt={decorative ? '' : `${title} preview`}
        sizes={sizes}
        priority={priority}
        className="size-full object-cover"
        {...size}
        {...blur}
      />
    </div>
  )
}
