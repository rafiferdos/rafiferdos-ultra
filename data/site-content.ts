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
  subtitle?: string
  role?: string
  year?: number
  status?: string
  caseStudyUrl?: string
  outcomes?: string[]
  imageUrl?: string
  liveUrl?: string
  githubUrl?: string
  techStack: string[]
  discipline: 'Full stack' | 'Frontend' | 'Backend' | 'Mobile'
  projectType:
    | 'Client project'
    | 'Professional work'
    | 'Personal project'
    | 'Community project'
  tags: string[]
  accent: string
  featured: boolean
}

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  contentJson?: unknown
  category: string
  format?: 'Article' | 'Guide' | 'Case study' | 'Note'
  tags?: string[]
  publishedAt: string
  readTime: string
  imageUrl?: string
  coverAlt?: string
  series?: string
  difficulty?: string
  language?: string
  featured?: boolean
  seoTitle?: string
  seoDescription?: string
  canonicalUrl?: string
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
      'Owned international client delivery from requirements through architecture and deployment while leading engineering quality for a small team.',
    highlights: [
      'Built the agency portfolio with Next.js, Prisma and PostgreSQL.',
      'Led multiple international client projects with end-to-end delivery accountability.',
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
    discipline: 'Mobile',
    projectType: 'Professional work',
    tags: ['Ecommerce', 'Production', 'Cross-platform'],
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
    discipline: 'Backend',
    projectType: 'Professional work',
    tags: ['Realtime', 'Infrastructure', 'Notifications'],
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
    discipline: 'Full stack',
    projectType: 'Client project',
    tags: ['Agency', 'CMS', 'Conversion'],
    accent: '#22d3ee',
    featured: true
  },
  {
    id: 'robotics-event-platform',
    title: 'Robotics Event Platform',
    description:
      'A club-owned event and registration system that replaced manual coordination with a clear participant journey and maintainable operations.',
    githubUrl: 'https://github.com/rafiferdos',
    techStack: ['React', 'Node.js', 'MongoDB', 'REST API'],
    discipline: 'Full stack',
    projectType: 'Community project',
    tags: ['Events', 'Registration', 'Operations'],
    accent: '#10b981',
    featured: false
  },
  {
    id: 'graphql-product-api',
    title: 'GraphQL Product API',
    description:
      'A focused API architecture for product screens that reduces over-fetching, clarifies data ownership and keeps client state predictable.',
    githubUrl: 'https://github.com/rafiferdos',
    techStack: ['GraphQL', 'Node.js', 'TypeScript', 'PostgreSQL'],
    discipline: 'Backend',
    projectType: 'Personal project',
    tags: ['API design', 'Data', 'Performance'],
    accent: '#ec4899',
    featured: false
  },
  {
    id: 'portfolio-content-studio',
    title: 'Portfolio Content Studio',
    description:
      'A secure publishing workspace for projects, long-form writing and cloud-hosted media, built into this portfolio without a separate admin product.',
    liveUrl: '/dashboard/rafi',
    githubUrl: 'https://github.com/rafiferdos',
    techStack: ['Next.js', 'Supabase', 'Cloudinary', 'TypeScript'],
    discipline: 'Full stack',
    projectType: 'Personal project',
    tags: ['Dashboard', 'Content', 'Authentication'],
    accent: '#6366f1',
    featured: false
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
    format: 'Guide',
    tags: ['GraphQL', 'REST', 'Migration'],
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
    format: 'Article',
    tags: ['Socket.io', 'Realtime', 'UX'],
    publishedAt: '2026-05-24',
    readTime: '4 min read',
    published: true
  },
  {
    id: 'streaming-ai-product-ui',
    slug: 'streaming-ai-product-ui',
    title: 'Streaming AI responses without breaking the product UI',
    excerpt:
      'A practical interface contract for partial output, cancellation, errors and the moment an AI answer becomes trustworthy.',
    content:
      'Streaming makes an AI feature feel fast, but it also exposes states that normal request-response interfaces can ignore. The product needs explicit states for connecting, receiving tokens, completing, cancelling and failing. Keep the user’s prompt visible, reserve space for the answer and make stopping generation an ordinary action rather than an emergency escape hatch.\n\nTreat the stream as provisional data. Parse structured output defensively, save only confirmed results and provide a useful fallback when the model or network fails. The polished experience comes from predictable product behavior around the model—not from the typing effect itself.',
    category: 'AI Engineering',
    format: 'Guide',
    tags: ['AI', 'Streaming', 'Product UX'],
    featured: true,
    publishedAt: '2026-08-18',
    readTime: '6 min read',
    published: true
  },
  {
    id: 'rag-from-product-data',
    slug: 'rag-from-product-data',
    title: 'RAG that answers from your product data—not its imagination',
    excerpt:
      'How to design retrieval, citations and access boundaries before adding a chat box to a real application.',
    content:
      'A useful retrieval feature starts with the information boundary. Decide which records a user may access, how content is split, what metadata survives embedding and what a good retrieval result looks like. Those decisions matter more than the vector database brand.\n\nAt answer time, return sources the interface can show and let the model say when evidence is missing. Log retrieved chunks, latency and user feedback so failures can be diagnosed. RAG becomes a product feature when answers are grounded, permissions are preserved and the user can verify the result.',
    category: 'AI Engineering',
    format: 'Guide',
    tags: ['AI', 'RAG', 'Data'],
    featured: true,
    publishedAt: '2026-08-09',
    readTime: '7 min read',
    published: true
  },
  {
    id: 'production-guardrails-for-ai-features',
    slug: 'production-guardrails-for-ai-features',
    title: 'What an AI feature needs after the demo works',
    excerpt:
      'Evals, cost budgets, fallbacks and human checkpoints turn a convincing prototype into a dependable product capability.',
    content:
      'The first successful model response proves very little. Before release, build a small evaluation set from real product scenarios, including ambiguous requests and cases the system should refuse. Track quality beside latency and cost so a model change cannot quietly improve one metric while damaging the others.\n\nProduction AI also needs limits: input validation, timeout and retry rules, a cheaper or deterministic fallback and a clear human checkpoint for consequential actions. The model can remain probabilistic while the product around it stays deliberate.',
    category: 'AI Engineering',
    format: 'Article',
    tags: ['AI', 'Evals', 'Reliability'],
    featured: true,
    publishedAt: '2026-07-30',
    readTime: '6 min read',
    published: true
  },
  {
    id: 'checkout-react-native',
    slug: 'checkout-react-native',
    title: 'A React Native checkout should survive interruption',
    excerpt:
      'Designing payment and order flows around retries, app backgrounding and the uncertainty of mobile networks.',
    content:
      'Mobile checkout is a state machine disguised as a form. Persist the minimum recoverable state, give payment attempts stable identifiers and ask the server for the final order status after an interruption. A loading spinner cannot resolve uncertainty on its own.\n\nMake every transition visible in plain language and prevent duplicate submission without trapping the user. When the app backgrounds or reconnects, resume from server truth. Reliability here is part architecture and part interface copy.',
    category: 'Mobile',
    format: 'Case study',
    tags: ['React Native', 'Checkout', 'Reliability'],
    publishedAt: '2026-07-19',
    readTime: '5 min read',
    published: true
  },
  {
    id: 'socket-reconnect-contract',
    slug: 'socket-reconnect-contract',
    title: 'Design the reconnect path before the realtime demo',
    excerpt:
      'A Socket.io feature is only dependable when missed events, duplicate delivery and stale presence are expected.',
    content:
      'The happy-path socket demo is easy because every participant is online. Real reliability begins after a device sleeps or a connection changes. Give important events identifiers, make handlers idempotent and keep a server-backed way to recover everything since the last known cursor.\n\nPresence should expire rather than remain true forever, and reconnecting should trigger reconciliation instead of blind optimism. Test the feature with throttling and repeated disconnects early; the interface will reveal which guarantees the protocol still lacks.',
    category: 'Architecture',
    format: 'Guide',
    tags: ['Socket.io', 'Reconnects', 'Backend'],
    publishedAt: '2026-07-08',
    readTime: '5 min read',
    published: true
  },
  {
    id: 'nextjs-boundaries',
    slug: 'nextjs-boundaries',
    title: 'Use the server/client boundary as a product decision',
    excerpt:
      'A simple way to decide what stays on the server in Next.js and what genuinely earns browser JavaScript.',
    content:
      'Start with server-rendered content and move only interaction across the client boundary. Data fetching, authorization and content composition usually benefit from staying close to the server; filters, gestures and immediate feedback belong in focused client islands.\n\nThis keeps secrets out of the browser, reduces hydration work and makes loading states easier to reason about. The best boundary is not the cleverest one—it is the one another engineer can locate and change without tracing the entire page.',
    category: 'Frontend',
    format: 'Article',
    tags: ['Next.js', 'RSC', 'Performance'],
    publishedAt: '2026-06-30',
    readTime: '5 min read',
    published: true
  },
  {
    id: 'code-review-as-product-leverage',
    slug: 'code-review-as-product-leverage',
    title: 'Code review is product leverage, not a style contest',
    excerpt:
      'How focused review comments protect behavior, teach context and keep delivery moving.',
    content:
      'A useful review starts with risk: incorrect behavior, security, data loss, accessibility and maintainability at the point most likely to change. Separate blocking issues from suggestions and explain the consequence, not merely the preferred syntax.\n\nGood reviews also preserve momentum. Small diffs, automated formatting and shared conventions leave human attention for product decisions. When a pattern repeats, improve the system or documentation instead of writing the same comment forever.',
    category: 'Leadership',
    format: 'Note',
    tags: ['Code review', 'Teams', 'Quality'],
    publishedAt: '2026-06-10',
    readTime: '4 min read',
    published: true
  },
  {
    id: 'schema-for-change',
    slug: 'schema-for-change',
    title: 'Model the database for the next change, not every possible future',
    excerpt:
      'Practical PostgreSQL and Prisma choices that preserve constraints while keeping product iteration affordable.',
    content:
      'A durable schema captures facts the product already depends on: identity, ownership, lifecycle and invariants. Express those constraints in the database where possible, then expose a narrow application model rather than letting every screen invent its own interpretation.\n\nPlan migrations as releases. Backfill before enforcing a new constraint, keep reads compatible during rollout and index the queries the product actually performs. Flexibility comes from clear boundaries and reversible steps, not from turning every column into unstructured data.',
    category: 'Backend',
    format: 'Guide',
    tags: ['PostgreSQL', 'Prisma', 'Schema'],
    publishedAt: '2026-05-11',
    readTime: '6 min read',
    published: true
  },
  {
    id: 'small-team-delivery-pipeline',
    slug: 'small-team-delivery-pipeline',
    title: 'A small team needs a boring delivery pipeline',
    excerpt:
      'The minimum CI, preview and deployment feedback that lets a team release often without guessing.',
    content:
      'A dependable pipeline for a small team can be intentionally plain: type-check, lint, test the critical paths, build the production artifact and create a reviewable preview. Make failures readable and keep the same build inputs from pull request to production.\n\nAdd complexity only in response to a measured risk. A short rollback path, environment validation and basic observability usually protect delivery better than a large collection of tools no one fully owns.',
    category: 'Delivery',
    format: 'Guide',
    tags: ['CI/CD', 'Docker', 'Small teams'],
    publishedAt: '2026-04-22',
    readTime: '5 min read',
    published: true
  }
]
