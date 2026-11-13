import { z } from 'zod'
import { SLUG_PATTERN } from '@/lib/slug'

const optionalUrl = z.union([z.url(), z.literal(''), z.null()]).optional()

const galleryItemSchema = z.object({
  url: z.url(),
  width: z.number().int().positive().max(20_000),
  height: z.number().int().positive().max(20_000),
  alt: z.string().trim().max(240),
  label: z.string().trim().max(80)
})

export const projectRecordSchema = z.object({
  slug: z.string().trim().max(80).regex(SLUG_PATTERN).nullable().optional(),
  title: z.string().trim().min(2).max(140),
  subtitle: z.string().trim().max(180).nullable().optional(),
  description: z.string().trim().min(10).max(2_000),
  role: z.string().trim().max(120).nullable().optional(),
  client: z.string().trim().max(120).nullable().optional(),
  overview: z.string().trim().max(4_000).nullable().optional(),
  challenge: z.string().trim().max(4_000).nullable().optional(),
  solution: z.string().trim().max(4_000).nullable().optional(),
  year: z.number().int().min(2000).max(2100).nullable().optional(),
  status: z.enum(['Published', 'In development', 'Maintained', 'Archived']),
  caseStudyUrl: optionalUrl,
  outcomes: z.array(z.string().trim().min(1).max(240)).max(20),
  imageUrl: optionalUrl,
  coverWidth: z.number().int().positive().max(20_000).nullable().optional(),
  coverHeight: z.number().int().positive().max(20_000).nullable().optional(),
  coverBlur: z.string().max(2_000).nullable().optional(),
  videoUrl: optionalUrl,
  gallery: z.array(galleryItemSchema).max(30).optional(),
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
