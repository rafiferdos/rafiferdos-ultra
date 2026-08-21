import type { MetadataRoute } from 'next'
import { getBlogs, getProjects } from '@/lib/content-store'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getBlogs(), getProjects()])
  const latestProject = projects.length ? new Date() : new Date('2026-01-01')
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: latestProject,
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: posts[0]?.publishedAt
        ? new Date(posts[0].publishedAt)
        : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blogs/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.75
    }))
  ]
}
