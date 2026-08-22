'use client'

import { BrandLogo } from '@/components/BrandLogo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { dashboardApi } from '@/features/dashboard/api/dashboard-api'
import { DashboardStudio } from '@/features/dashboard/components/dashboard-studio'
import { getApiError } from '@/lib/http/client'
import { useMutation } from '@tanstack/react-query'
import { ShieldCheck } from 'lucide-react'
import { FormEvent, useState } from 'react'

export function DashboardClient({
  authenticated,
  credentialsReady
}: {
  authenticated: boolean
  credentialsReady: boolean
}) {
  const [ready, setReady] = useState(authenticated)
  const login = useMutation({ mutationFn: dashboardApi.login })

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    login.mutate(
      {
        email: String(values.get('email') || ''),
        password: String(values.get('password') || '')
      },
      { onSuccess: () => setReady(true) }
    )
  }

  if (ready) return <DashboardStudio onLoggedOut={() => setReady(false)} />

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-16">
      <div className="absolute left-1/4 top-1/4 size-72 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 size-72 rounded-full bg-violet-500/10 blur-3xl" />
      <Card className="relative w-full max-w-md rounded-[2rem] border-border/70 bg-card/85 shadow-2xl backdrop-blur-2xl">
        <CardHeader className="p-7 pb-3 sm:p-9 sm:pb-3">
          <BrandLogo className="mb-4" withName />
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <ShieldCheck className="size-6" />
          </div>
          <CardTitle className="text-3xl tracking-[-.045em]">
            Portfolio Studio
          </CardTitle>
          <CardDescription>
            Secure access to projects, articles, media and enquiries.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-7 pt-3 sm:p-9 sm:pt-3">
          {!credentialsReady && (
            <p className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/8 p-3 text-xs leading-5 text-amber-700 dark:text-amber-300">
              Admin access is not configured. Add the values from
              `.env.example`, then restart the app.
            </p>
          )}
          <form onSubmit={submit} className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="dashboard-email">Email</Label>
              <Input
                id="dashboard-email"
                name="email"
                type="email"
                required
                autoComplete="username"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dashboard-password">Password</Label>
              <Input
                id="dashboard-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="h-11 rounded-xl"
              />
            </div>
            <Button
              disabled={login.isPending}
              className="h-11 rounded-xl font-semibold"
            >
              {login.isPending ? 'Signing in…' : 'Enter studio'}
            </Button>
            <p aria-live="polite" className="min-h-5 text-sm text-destructive">
              {login.isError
                ? getApiError(login.error, 'Unable to sign in')
                : ''}
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
