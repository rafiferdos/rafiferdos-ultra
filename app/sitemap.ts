import type { MetadataRoute } from 'next'
import { getBlogs, getProjects } from '@/lib/content-store'
import { SITE_URL } from '@/lib/site'
import { projectKey } from '@/lib/slug'

// A database that was down at build time would otherwise leave an empty sitemap cached until the next save.
export const revalidate = 3600

const newest = (dates: (string | undefined)[]) =>
  dates
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1)

// Google reads lastmod only when it is accurate, so a page with no real date gets none.
// It also ignores priority and changeFrequency, which are left out.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getBlogs(), getProjects()])
  const projectsChanged = newest(projects.map((project) => project.updatedAt))
  const postsChanged = newest(posts.map((post) => post.publishedAt))
  return [
    { url: SITE_URL, lastModified: newest([projectsChanged, postsChanged]) },
    { url: `${SITE_URL}/services` },
    { url: `${SITE_URL}/projects`, lastModified: projectsChanged },
    { url: `${SITE_URL}/blogs`, lastModified: postsChanged },
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${projectKey(project)}`,
      lastModified: project.updatedAt
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blogs/${post.slug}`,
      lastModified: post.publishedAt
    }))
  ]
}
