import { getBlogs } from '@/lib/content-store'
import { profile, SITE_NAME, SITE_URL } from '@/lib/site'

// Static, so the feed costs nothing per request. The admin route revalidates it on a save, and the hourly
// refresh covers a build where the database was down and the feed came out empty.
export const dynamic = 'force-static'
export const revalidate = 3600

const entities: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }
const escape = (value: string) => value.replace(/[<>&"']/g, (char) => entities[char])

export async function GET() {
  const posts = await getBlogs()
  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blogs/${post.slug}`
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category>${escape(post.category)}</category>
      <description>${escape(post.excerpt)}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${SITE_NAME}, writing`)}</title>
    <link>${SITE_URL}/blogs</link>
    <description>${escape(`Essays by ${profile.name}, ${profile.jobTitle}.`)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
