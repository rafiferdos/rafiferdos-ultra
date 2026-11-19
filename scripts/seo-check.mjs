// Checks the served HTML of every sitemap URL, plus robots.txt, the sitemap and the feed.
// Usage: pnpm seo:check [origin]   (default http://localhost:3000)
// Exit code 1 when any check fails. Warnings never fail the run.

const origin = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')

const failures = []
const warnings = []
const fail = (where, message) => failures.push(`${where}: ${message}`)
const warn = (where, message) => warnings.push(`${where}: ${message}`)

const decode = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const attrs = (tag) =>
  Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)].map(([, key, value]) => [key, decode(value)]))

const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(([tag]) => attrs(tag))

const metaContent = (html, key, value) =>
  tags(html, 'meta')
    .filter((meta) => meta[key] === value)
    .map((meta) => meta.content)

// The sitemap and the URLs on a page name the site's configured origin. When testing another origin (localhost),
// only URLs on that configured origin are redirected to it; other hosts, such as the image CDN, stay as they are.
let siteOrigin = ''
const local = (url) => {
  try {
    const parsed = new URL(url)
    return siteOrigin && parsed.origin === siteOrigin ? `${origin}${parsed.pathname}${parsed.search}` : url
  } catch {
    return url
  }
}

const get = (url, init) => fetch(url, { redirect: 'manual', ...init })

const checkedImages = new Map()
async function imageOk(url) {
  if (!checkedImages.has(url)) {
    checkedImages.set(
      url,
      get(local(url)).then(
        (res) => (res.status === 200 && (res.headers.get('content-type') || '').startsWith('image/') ? '' : `${res.status} ${res.headers.get('content-type')}`),
        (error) => String(error)
      )
    )
  }
  return checkedImages.get(url)
}

const ldTypes = (node) => {
  if (Array.isArray(node)) return node.flatMap(ldTypes)
  if (!node || typeof node !== 'object') return []
  const own = [node['@type']].flat().filter(Boolean)
  return [...own, ...Object.values(node).flatMap(ldTypes)]
}

async function checkPage(url) {
  const path = new URL(url).pathname
  const res = await get(local(url))
  if (res.status !== 200) return fail(path, `status ${res.status}${res.headers.get('location') ? ` to ${res.headers.get('location')}` : ''}`)
  const html = await res.text()

  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(([, inner]) => inner)
  if (h1s.length !== 1) fail(path, `${h1s.length} h1 elements`)
  else if (/aria-hidden/.test(h1s[0])) fail(path, 'h1 holds aria-hidden copies, so crawlers read the text twice')

  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]
  if (!title) fail(path, 'no title')
  else if (decode(title).length > 70) warn(path, `title is ${decode(title).length} characters`)

  const description = metaContent(html, 'name', 'description')[0]
  if (!description) fail(path, 'no meta description')
  else if (description.length < 50 || description.length > 160) warn(path, `description is ${description.length} characters`)

  const canonicals = tags(html, 'link').filter((link) => link.rel === 'canonical')
  if (canonicals.length !== 1) fail(path, `${canonicals.length} canonical links`)
  else {
    try {
      const canonical = new URL(canonicals[0].href)
      if (canonical.pathname.replace(/\/$/, '') !== path.replace(/\/$/, '')) fail(path, `canonical points to ${canonical.pathname}`)
    } catch {
      fail(path, `canonical is not absolute: ${canonicals[0].href}`)
    }
  }

  for (const property of ['og:title', 'og:description', 'og:url', 'og:image']) {
    if (!metaContent(html, 'property', property).length) fail(path, `no ${property}`)
  }
  const image = metaContent(html, 'property', 'og:image')[0]
  if (image) {
    const problem = await imageOk(image)
    if (problem) fail(path, `og:image ${image} answers ${problem}`)
  }
  if (metaContent(html, 'name', 'twitter:card')[0] !== 'summary_large_image') fail(path, 'twitter:card is not summary_large_image')

  if (metaContent(html, 'name', 'robots').concat(metaContent(html, 'name', 'googlebot')).some((value) => /noindex/i.test(value))) fail(path, 'noindex')

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map(([, body]) => body)
  for (const body of blocks) {
    let data
    try {
      data = JSON.parse(body)
    } catch {
      fail(path, 'ld+json does not parse')
      continue
    }
    const types = ldTypes(data)
    for (const retired of ['FAQPage', 'HowTo', 'SearchAction']) {
      if (types.includes(retired)) fail(path, `${retired} markup (Google no longer shows it)`)
    }
  }
  return { path, ld: blocks.length }
}

async function checkRobots() {
  const res = await get(`${origin}/robots.txt`)
  if (res.status !== 200) return fail('/robots.txt', `status ${res.status}`)
  const body = await res.text()
  if (/^host:/im.test(body)) fail('/robots.txt', 'Host: line (Google ignores it)')
  if (!/^sitemap:\s*https?:\/\//im.test(body)) fail('/robots.txt', 'no Sitemap: line')
}

async function checkNotFound() {
  const res = await get(`${origin}/__no-such-page__`)
  if (res.status !== 404) fail('404 page', `unknown URL answers ${res.status}`)
}

async function checkFeed(postCount) {
  const res = await get(`${origin}/feed.xml`)
  if (res.status !== 200) return fail('/feed.xml', `status ${res.status}`)
  const body = await res.text()
  if (!body.startsWith('<?xml') || !/<rss\b/.test(body) || !body.trim().endsWith('</rss>')) fail('/feed.xml', 'not an RSS document')
  if (/&(?!(amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);)/i.test(body)) fail('/feed.xml', 'unescaped ampersand')
  const items = (body.match(/<item>/g) || []).length
  if (items !== postCount) fail('/feed.xml', `${items} items, sitemap lists ${postCount} posts`)
}

async function main() {
  const res = await get(`${origin}/sitemap.xml`)
  if (res.status !== 200) {
    console.error(`sitemap.xml answers ${res.status} at ${origin}`)
    process.exit(1)
  }
  const xml = await res.text()
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
    loc: body.match(/<loc>(.*?)<\/loc>/)?.[1] ?? '',
    lastmod: body.match(/<lastmod>(.*?)<\/lastmod>/)?.[1]
  }))
  siteOrigin = entries[0] ? new URL(entries[0].loc).origin : ''
  if (/<priority>|<changefreq>/.test(xml)) fail('/sitemap.xml', 'priority or changefreq (Google ignores both)')

  // A request-time lastmod is the same moment, to the millisecond, on URLs that have no real date.
  // Two kinds of repeat are real and skipped: posts published on one day share a midnight stamp, and an index page
  // (home, /projects, /blogs) takes the date of its newest child, so that stamp also sits on a post or project.
  const leaf = /^\/(blogs|projects|fixes)\/[^/]+$/
  const leafStamps = new Set(entries.filter(({ loc }) => leaf.test(new URL(loc).pathname)).map(({ lastmod }) => lastmod))
  const counts = new Map()
  for (const { lastmod } of entries) {
    if (lastmod && !/T00:00:00(\.000)?Z$/.test(lastmod) && !leafStamps.has(lastmod)) counts.set(lastmod, (counts.get(lastmod) || 0) + 1)
  }
  for (const [stamp, count] of counts) if (count >= 2) fail('/sitemap.xml', `${count} URLs share lastmod ${stamp} and no post or project has it`)

  const pages = []
  for (const { loc } of entries) pages.push(await checkPage(loc))
  await checkRobots()
  await checkNotFound()
  await checkFeed(entries.filter(({ loc }) => /\/(blogs|fixes)\/[^/]+$/.test(loc)).length)

  console.log(`${entries.length} sitemap URLs checked at ${origin}`)
  for (const page of pages) if (page) console.log(`  ok  ${page.path} (${page.ld} ld+json)`)
  if (warnings.length) console.log(`\n${warnings.length} warnings\n${warnings.map((line) => `  ${line}`).join('\n')}`)
  if (failures.length) {
    console.log(`\n${failures.length} failures\n${failures.map((line) => `  ${line}`).join('\n')}`)
    process.exit(1)
  }
  console.log('\nno failures')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
