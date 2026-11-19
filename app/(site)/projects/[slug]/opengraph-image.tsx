import { getProjectByKey } from '@/lib/content-store'
import { ogCard, ogSize } from '@/lib/og'

export const alt = 'Project by Rafi Ferdos'
export const size = ogSize
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectByKey(slug)
  if (!project) return new Response('Not found', { status: 404 })
  return ogCard({
    eyebrow: [project.projectType, project.year].filter(Boolean).join(' · '),
    title: project.title,
    detail: project.techStack.slice(0, 4).join(', '),
    accent: /^#[0-9a-f]{6}$/i.test(project.accent) ? project.accent : undefined
  })
}
