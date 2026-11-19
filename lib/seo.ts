import type { Metadata } from 'next'
import type { BlogPost, Project } from '@/data/site-content'
import { OG_IMAGE, PERSON_ID, profile, SITE_NAME, SITE_URL, WEBSITE_ID } from '@/lib/site'
import { projectKey } from '@/lib/slug'

type PageMeta = {
  title: string
  description: string
  path: string
  // The root title template adds the site name. Set this when the title already carries it.
  absoluteTitle?: boolean
  // For a route that has its own opengraph-image file. Next lets that file win over openGraph.images anyway.
  hasOwnImage?: boolean
  canonical?: string
  article?: { publishedTime: string; modifiedTime?: string; section?: string; tags?: string[] }
}

const RSS = { 'application/rss+xml': `${SITE_URL}/feed.xml` }

// Metadata merges shallowly, so a page that sets openGraph replaces the parent's whole object.
// Building every page through this keeps siteName, locale, the absolute url and an image on all of them.
export function pageMetadata({ title, description, path, absoluteTitle, hasOwnImage, canonical, article }: PageMeta): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`
  const socialTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`
  // The key is left out, not set to undefined, so Next can add the route's own opengraph-image.
  const image = hasOwnImage ? {} : { images: [OG_IMAGE] }
  const twitter: Metadata['twitter'] = { card: 'summary_large_image', title: socialTitle, description, ...image }
  const base = { url, siteName: SITE_NAME, locale: 'en_US', title: socialTitle, description, ...image }
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: canonical ?? url, types: RSS },
    openGraph: article
      ? { ...base, type: 'article', authors: [SITE_URL], ...article }
      : { ...base, type: 'website' },
    twitter
  }
}

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes })

// Google reads each page's JSON-LD on its own, so an @id alone does not carry the name to another page.
// These repeat just enough of the Person and WebSite for the reference to stand without the home page.
const personRef = { '@type': 'Person', '@id': PERSON_ID, name: profile.name, url: SITE_URL }
const websiteRef = { '@type': 'WebSite', '@id': WEBSITE_ID, name: SITE_NAME, url: SITE_URL }

export const personNode = () => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: profile.name,
  url: SITE_URL,
  image: `${SITE_URL}/rafi.png`,
  jobTitle: profile.jobTitle,
  description: `${profile.jobTitle} with 3+ years building production web and mobile applications with React, Next.js, Node.js and React Native.`,
  email: `mailto:${profile.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Dhaka', addressCountry: 'BD' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Daffodil International University' },
  knowsLanguage: ['Bengali', 'English'],
  sameAs: [profile.github, profile.linkedin, profile.x],
  knowsAbout: [
    'Next.js',
    'React',
    'React Native',
    'Node.js',
    'PostgreSQL',
    'Prisma ORM',
    'GraphQL',
    'Realtime systems',
    'Ecommerce development',
    'AI engineering',
    'RAG',
    'AWS',
    'Docker',
    'CI/CD'
  ]
})

export const websiteNode = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: 'en',
  publisher: personRef
})

export const breadcrumbNode = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(({ name, path }, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    item: `${SITE_URL}${path === '/' ? '' : path}`
  }))
})

export const collectionNode = (
  { name, description, path }: { name: string; description: string; path: string },
  items: { name: string; path: string }[]
) => ({
  '@type': 'CollectionPage',
  '@id': `${SITE_URL}${path}#page`,
  url: `${SITE_URL}${path}`,
  name,
  description,
  isPartOf: websiteRef,
  about: personRef,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${SITE_URL}${item.path}`
    }))
  }
})

// Joins the parts into one description of at most 160 characters, cut at a word.
export function fitDescription(...parts: (string | null | undefined)[]) {
  const text = `${parts
    .filter((part): part is string => Boolean(part?.trim()))
    .map((part) => part.trim().replace(/[.\s]+$/, ''))
    .join('. ')}.`
  if (text.length <= 160) return text
  const cut = text.slice(0, 159)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

// The generated card's URL carries a build hash, so structured data names the cover, or the site image without one.
const schemaImage = (cover?: string) => (cover?.startsWith('http') ? cover : `${SITE_URL}${OG_IMAGE}`)

const words = (text: string) => text.replace(/[`*_#>[\]()]/g, ' ').split(/\s+/).filter(Boolean).length

export const articleNode = (post: BlogPost, path: string) => {
  const url = `${SITE_URL}${path}`
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    // Google truncates a headline past 110 characters.
    headline: post.title.slice(0, 110),
    description: post.seoDescription || post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    image: [schemaImage(post.imageUrl)],
    author: personRef,
    publisher: personRef,
    isPartOf: websiteRef,
    inLanguage: post.language === 'Bangla' ? 'bn' : 'en',
    articleSection: post.category,
    keywords: post.tags?.join(', '),
    wordCount: words(post.content)
  }
}

export const projectNode = (project: Project) => {
  const url = `${SITE_URL}/projects/${projectKey(project)}`
  return {
    '@type': 'CreativeWork',
    '@id': `${url}#project`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    name: project.title,
    description: project.subtitle || project.description,
    url,
    image: schemaImage(project.imageUrl),
    ...(project.year ? { dateCreated: String(project.year) } : {}),
    creator: personRef,
    isPartOf: websiteRef,
    genre: project.projectType,
    keywords: project.techStack.join(', ')
  }
}
