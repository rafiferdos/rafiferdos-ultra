import { z } from 'zod'

const optionalUrl = z.union([z.url(), z.literal(''), z.null()]).optional()

export const projectRecordSchema = z.object({
  title: z.string().trim().min(2).max(140),
  subtitle: z.string().trim().max(180).nullable().optional(),
  description: z.string().trim().min(10).max(2_000),
  role: z.string().trim().max(120).nullable().optional(),
  year: z.number().int().min(2000).max(2100).nullable().optional(),
  status: z.enum(['Published', 'In development', 'Maintained', 'Archived']),
  caseStudyUrl: optionalUrl,
  outcomes: z.array(z.string().trim().min(1).max(240)).max(20),
  imageUrl: optionalUrl,
  liveUrl: optionalUrl,
  githubUrl: optionalUrl,
  techStack: z.array(z.string().trim().min(1).max(80)).min(1).max(80),
  discipline: z.enum(['Full stack', 'Frontend', 'Backend', 'Mobile']),
  projectType: z.enum([
    'Client project',
    'Professional work',
    'Personal project',
    'Community project'
  ]),
  tags: z.array(z.string().trim().min(1).max(80)).max(40),
  accent: z.string().regex(/^#[0-9a-f]{6}$/i),
  featured: z.boolean(),
  sortOrder: z.number().int().min(0).max(10_000)
})

export const blogRecordSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(180),
  title: z.string().trim().min(3).max(180),
  excerpt: z.string().trim().min(10).max(320),
  content: z.string().trim().min(1).max(200_000),
  contentJson: z.array(z.unknown()).min(1),
  category: z.string().trim().min(2).max(80),
  format: z.enum(['Article', 'Guide', 'Case study', 'Note']),
  tags: z.array(z.string().trim().min(1).max(80)).max(80),
  publishedAt: z.string().min(8).max(40),
  readTime: z.string().trim().min(3).max(40),
  imageUrl: optionalUrl,
  coverAlt: z.string().trim().max(240).nullable().optional(),
  series: z.string().trim().max(120).nullable().optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  language: z.enum(['English', 'Bangla']),
  featured: z.boolean(),
  seoTitle: z.string().trim().max(70).nullable().optional(),
  seoDescription: z.string().trim().max(170).nullable().optional(),
  canonicalUrl: optionalUrl,
  published: z.boolean()
})

export const messagePatchSchema = z.object({
  status: z.enum(['new', 'read', 'archived'])
})
