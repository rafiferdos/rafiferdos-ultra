import type { MetadataRoute } from 'next'
import { profile } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} · ${profile.jobTitle}`,
    short_name: profile.name,
    description: `Portfolio, engineering projects and practical writing by ${profile.name}.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#f59e0b',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }]
  }
}
