import { DashboardClient } from '@/components/Dashboard/DashboardClient'
import { credentialsConfigured, isAdmin } from '@/lib/admin-auth'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Portfolio Studio', robots: { index: false, follow: false } }

export default async function DashboardPage() {
  return <DashboardClient authenticated={await isAdmin()} credentialsReady={credentialsConfigured()} />
}
