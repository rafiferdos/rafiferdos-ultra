import type { BlogPost, Project } from '@/data/site-content'
import type { ContactMessage } from '@/lib/content-store'

export type ContentEntity = 'projects' | 'blogs' | 'messages'

export type DashboardData = {
  projects: Project[]
  blogs: BlogPost[]
  messages: ContactMessage[]
  backendConfigured: boolean
}

export type ContentMutation = {
  entity: ContentEntity
  id?: string
  record: Record<string, unknown>
}
