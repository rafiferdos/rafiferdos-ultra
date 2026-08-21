export type Experience = {
  company: string
  role: string
  period: string
  location: string
  summary: string
  highlights: string[]
  metrics: { value: string; label: string }[]
  stack: string[]
}

export type Project = {
  id: string
  title: string
  description: string
  imageUrl?: string
  liveUrl?: string
  githubUrl?: string
  techStack: string[]
  accent: string
  featured: boolean
}

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  publishedAt: string
  readTime: string
  imageUrl?: string
  published: boolean
}

export const experiences: Experience[] = [
  {
    company: 'Sparktech Agency · BDCallingIT',
    role: 'Software Developer',
    period: 'Jul 2025 — Jun 2026',
    location: 'Dhaka, Bangladesh',
    summary:
      'Grew from a frontend hire into a full-stack and React Native engineer, shipping production commerce products across web and mobile.',
    highlights: [
      'Delivered two production ecommerce mobile applications end-to-end.',
      'Migrated REST integrations to GraphQL to reduce over-fetching and simplify frontend state.',
      'Built real-time chat and notification systems with Socket.io for concurrent users.'
    ],
    metrics: [
      { value: '2', label: 'mobile apps shipped' },
      { value: '7 mo', label: 'to React Native' },
      { value: '2×', label: 'merit raises' }
    ],
    stack: ['Next.js', 'React Native', 'GraphQL', 'Socket.io', 'Node.js']
  },
  {
    company: 'ZenDevz',
    role: 'Full Stack Developer',
    period: 'Nov 2024 — Feb 2025',
    location: 'Dhaka, Bangladesh',
    summary:
      'Owned foreign client delivery from requirements through architecture and deployment while leading engineering quality for a small team.',
    highlights: [
      'Built the agency portfolio with Next.js, Prisma and PostgreSQL.',
      'Led multiple foreign client projects with end-to-end delivery accountability.',
      'Protected production quality through structured reviews and technical direction.'
    ],
    metrics: [
      { value: '35+', label: 'code reviews' },
      { value: 'E2E', label: 'delivery ownership' },
      { value: 'Global', label: 'client work' }
    ],
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'CI/CD']
  },
  {
    company: 'DIU Robotics Club',
    role: 'Web Developer Executive',
    period: 'Jan 2023 — Dec 2024',
    location: 'Dhaka, Bangladesh',
    summary:
      'Advanced into an executive role, took ownership of the club platform, and led a dedicated web team through feature delivery and operational improvements.',
    highlights: [
      'Promoted to Web Developer Executive within eight months.',
      'Owned feature delivery, bug fixes, performance and engagement improvements.',
      'Created a custom event registration system that removed manual coordination work.'
    ],
    metrics: [
      { value: '8 mo', label: 'to promotion' },
      { value: '1', label: 'team led' },
      { value: '100%', label: 'web ownership' }
    ],
    stack: ['React', 'Node.js', 'MongoDB', 'REST API', 'Git']
  }
]

export const defaultProjects: Project[] = [
  {
    id: 'commerce-mobile-suite',
    title: 'Commerce Mobile Suite',
    description:
      'Two production ecommerce applications spanning storefront journeys, live order state, notifications and a shared full-stack foundation.',
    githubUrl: 'https://github.com/rafiferdos',
    techStack: ['React Native', 'Expo', 'Node.js', 'GraphQL'],
    accent: '#ffb000',
    featured: true
  },
  {
    id: 'realtime-collaboration-layer',
    title: 'Realtime Collaboration Layer',
    description:
      'A resilient Socket.io layer for live chat and notifications, designed around synchronized state and concurrent user activity.',
    githubUrl: 'https://github.com/rafiferdos',
    techStack: ['Socket.io', 'TypeScript', 'Express', 'MongoDB'],
    accent: '#8b5cf6',
    featured: true
  },
  {
    id: 'agency-growth-platform',
    title: 'Agency Growth Platform',
    description:
      'A production-grade agency presence with a type-safe content architecture, relational data model and conversion-focused frontend.',
    githubUrl: 'https://github.com/rafiferdos',
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind'],
    accent: '#22d3ee',
    featured: true
  }
]

export const defaultBlogs: BlogPost[] = [
  {
    id: 'graphql-without-the-drama',
    slug: 'graphql-without-the-drama',
    title: 'Moving a product from REST to GraphQL—without the drama',
    excerpt:
      'A practical field guide to reducing over-fetching while keeping a shipping product stable.',
    content:
      'A safe GraphQL migration starts with the product boundaries, not the schema. I begin with the screens where over-fetching and state duplication create the most friction, then introduce queries alongside existing REST endpoints.\n\nThe important part is measuring the migration by product outcomes: fewer duplicated loading states, smaller payloads, clearer ownership and a calmer debugging experience. GraphQL is valuable when it removes coordination cost—not merely because it changes the transport.',
    category: 'Engineering',
    publishedAt: '2026-06-18',
    readTime: '6 min read',
    published: true
  },
  {
    id: 'realtime-systems-that-feel-calm',
    slug: 'realtime-systems-that-feel-calm',
    title: 'Realtime systems should feel calm',
    excerpt:
      'How to design chat and notifications so the UI stays predictable under concurrent activity.',
    content:
      'Realtime does not have to mean visually noisy or architecturally fragile. The UI should distinguish confirmed server state from optimistic local state, and every event should be safe to receive more than once.\n\nA calm realtime product uses explicit event contracts, reconnect behavior that is tested early, and restrained motion that communicates change without demanding attention.',
    category: 'Architecture',
    publishedAt: '2026-05-24',
    readTime: '4 min read',
    published: true
  }
]
