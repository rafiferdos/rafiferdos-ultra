'use client'

import { BrandLogo } from '@/components/BrandLogo'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { dashboardApi } from '../api/dashboard-api'
import {
  useDashboardContent,
  useDeleteContent
} from '../hooks/use-dashboard-content'
import type { ContentEntity } from '../types'
import { getApiError } from '@/lib/http/client'
import {
  BookOpen,
  Cloud,
  FolderKanban,
  LogOut,
  MessageSquare,
  RefreshCw
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { BlogPanel } from './blog-panel'
import { MessagePanel } from './message-panel'
import { ProjectPanel } from './project-panel'

type DeleteTarget = { entity: ContentEntity; id: string; label: string }

export function DashboardStudio({ onLoggedOut }: { onLoggedOut: () => void }) {
  const content = useDashboardContent()
  const remove = useDeleteContent()
  const [target, setTarget] = useState<DeleteTarget | null>(null)

  async function logout() {
    await dashboardApi.logout()
    onLoggedOut()
  }
  function requestDelete(entity: ContentEntity, id: string, label: string) {
    setTarget({ entity, id, label })
  }
  function confirmDelete() {
    if (!target) return
    remove.mutate(target, {
      onSuccess: () => {
        toast.success(`${target.label} deleted`)
        setTarget(null)
      },
      onError: (error) => toast.error(getApiError(error, 'Delete failed'))
    })
  }

  return (
    <main className="min-h-svh bg-muted/20">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <BrandLogo className="[&_span]:size-9 [&_img]:size-7" />
            <div>
              <p className="font-semibold tracking-tight">Rafi · Studio</p>
              <p className="hidden text-[10px] uppercase tracking-[.2em] text-muted-foreground sm:block">
                Portfolio control plane
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => content.refetch()}
              aria-label="Refresh dashboard"
            >
              <RefreshCw className={content.isFetching ? 'animate-spin' : ''} />
            </Button>
            <Button variant="outline" className="rounded-full" onClick={logout}>
              <LogOut />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {content.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat
              icon={FolderKanban}
              value={content.data?.projects.length ?? 0}
              label="Projects"
            />
            <Stat
              icon={BookOpen}
              value={content.data?.blogs.length ?? 0}
              label="Articles"
            />
            <Stat
              icon={Cloud}
              value={content.data?.backendConfigured ? 'Live' : 'Offline'}
              label="PostgreSQL backend"
            />
            <Stat
              icon={MessageSquare}
              value={
                content.data?.messages.filter((item) => item.status === 'new')
                  .length ?? 0
              }
              label="New enquiries"
            />
          </div>
        )}
        {content.isError && (
          <p className="mt-5 rounded-xl border border-destructive/20 bg-destructive/8 p-4 text-sm text-destructive">
            {getApiError(content.error, 'Unable to load dashboard')}
          </p>
        )}
        {content.data && !content.data.backendConfigured && (
          <p className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/8 p-4 text-sm text-amber-800 dark:text-amber-200">
            PostgreSQL is not connected. Publishing and enquiries remain
            disabled until `DATABASE_URL` is valid.
          </p>
        )}
        <Tabs defaultValue="projects" className="mt-8">
          <TabsList className="h-auto max-w-full justify-start overflow-x-auto rounded-full p-1.5">
            <TabsTrigger value="projects" className="rounded-full px-5">
              Projects
            </TabsTrigger>
            <TabsTrigger value="blogs" className="rounded-full px-5">
              Articles
            </TabsTrigger>
            <TabsTrigger value="messages" className="rounded-full px-5">
              Messages
            </TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="mt-6">
            <ProjectPanel
              items={content.data?.projects || []}
              onDelete={(id, label) => requestDelete('projects', id, label)}
            />
          </TabsContent>
          <TabsContent value="blogs" className="mt-6">
            <BlogPanel
              items={content.data?.blogs || []}
              onDelete={(id, label) => requestDelete('blogs', id, label)}
            />
          </TabsContent>
          <TabsContent value="messages" className="mt-6">
            <MessagePanel
              items={content.data?.messages || []}
              onDelete={(id, label) => requestDelete('messages', id, label)}
            />
          </TabsContent>
        </Tabs>
      </div>
      <AlertDialog
        open={Boolean(target)}
        onOpenChange={(open) => !open && setTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              “{target?.label}” will be permanently removed from the database.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={remove.isPending}
              onClick={confirmDelete}
            >
              {remove.isPending ? 'Deleting…' : 'Delete permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}

function Stat({
  icon: Icon,
  value,
  label
}: {
  icon: typeof FolderKanban
  value: string | number
  label: string
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-5">
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <Icon className="size-4 text-primary" />
        </div>
        <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  )
}
