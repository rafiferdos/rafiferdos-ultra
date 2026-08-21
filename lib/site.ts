export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://rafiferdos.com'
).replace(/\/$/, '')

export const profile = {
  name: 'Rafi Ferdos',
  jobTitle: 'Full-stack product engineer',
  email: 'rafiferdos@gmail.com',
  phone: '+8801921479294',
  location: 'Dhaka, Bangladesh',
  github: 'https://github.com/rafiferdos',
  linkedin: 'https://www.linkedin.com/in/rafiferdos',
  x: 'https://x.com/rafiferdos',
  resume:
    'https://drive.google.com/file/d/1wFjb1ZqswXkKHIQQwq2_qaqCiauGnX24/view'
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
