import type { Project } from '@/data/site-content'

export const MAX_FEATURED = 6

// Featured projects by sort order. If none are marked featured, the first rows stand in so the section is never empty by accident.
export function pickFeatured(projects: Project[]) {
  const featured = projects.filter((project) => project.featured)
  return (featured.length ? featured : projects).slice(0, MAX_FEATURED)
}
