// What the services page, its card links and the contact form's topic list share. The stacks and the facts behind them are in docs/resume.md.
export type Service = {
  id: string
  title: string
  summary: string
  deliverables: string[]
  stack: string
}

export const services: Service[] = [
  {
    id: 'web',
    title: 'Web apps',
    summary: 'Websites and web apps that load fast and read well on a phone.',
    deliverables: ['Pages built on Next.js and TypeScript', 'A database behind them, and an admin side if you need one', 'Deployed, with the code handed over'],
    stack: 'Next.js, React, TypeScript, Tailwind CSS'
  },
  {
    id: 'backend',
    title: 'Backends and APIs',
    summary: 'The server side: your data, and the API your apps talk to.',
    deliverables: ['REST or GraphQL APIs', 'Live features such as chat and notifications', 'PostgreSQL or MongoDB, set up and migrated'],
    stack: 'Node.js, Express.js, GraphQL, Socket.IO, Prisma ORM, PostgreSQL, MongoDB'
  },
  {
    id: 'mobile',
    title: 'Mobile apps',
    summary: 'iOS and Android from one React Native codebase.',
    deliverables: ['An Expo app connected to your backend', 'Screens that feel native on both platforms', 'A build ready for release'],
    stack: 'React Native, Expo, Redux, TypeScript'
  },
  {
    id: 'ecommerce',
    title: 'Ecommerce',
    summary: 'Shops, web or mobile, built end to end.',
    deliverables: ['Product pages, cart and orders', 'An app or site wired to your backend', 'Deployed to production'],
    stack: 'React Native, Next.js, Node.js, GraphQL'
  },
  {
    id: 'ai',
    title: 'AI features',
    summary: 'A chatbot that answers from your own documents.',
    deliverables: ['A RAG chatbot over your own data', 'Added to the site or app you already have'],
    stack: 'AI and RAG, Next.js, Node.js, AWS'
  },
  {
    id: 'performance',
    title: 'Performance and SEO',
    summary: 'Faster pages and clearer search results. This site is the example, so run Lighthouse on it.',
    deliverables: ['A Lighthouse run before and after', 'Fixes for slow loads and layout shift', 'Titles, descriptions and structured data'],
    stack: 'Next.js, Lighthouse'
  }
]

export const serviceIds = new Set(services.map(({ id }) => id))
