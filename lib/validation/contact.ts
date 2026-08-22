import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(160),
  subject: z.string().trim().min(3).max(140),
  message: z.string().trim().min(10).max(5_000),
  website: z.string().optional().default('')
})
