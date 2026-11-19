import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Everything public is open to search and AI crawlers. Google ignores a Host line, so the preferred host is the canonical URLs.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard/', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`
  }
}
