'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ContactMessage } from '@/lib/content-store'
import { getApiError } from '@/lib/http/client'
import { CheckCircle2, Mail, MailOpen, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSaveContent } from '../hooks/use-dashboard-content'

export function MessagePanel({
  items,
  onDelete
}: {
  items: ContactMessage[]
  onDelete: (id: string, label: string) => void
}) {
  const save = useSaveContent()
  function setStatus(id: string, status: string) {
    save.mutate(
      { entity: 'messages', id, record: { status } },
      {
        onSuccess: () =>
          toast.success(
            status === 'read' ? 'Marked as read' : 'Moved back to new'
          ),
        onError: (error) =>
          toast.error(getApiError(error, 'Message could not be updated'))
      }
    )
  }
  if (!items.length)
    return (
      <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
        No enquiries yet.
      </div>
    )

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <Card key={item.id} className="min-w-0 rounded-2xl">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="text-base">{item.subject}</CardTitle>
                <a
                  href={`mailto:${item.email}`}
                  className="mt-1 block truncate text-xs text-primary hover:underline"
                >
                  {item.name} · {item.email}
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={item.status === 'new' ? 'default' : 'secondary'}
                >
                  {item.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    item.notificationSent
                      ? 'text-emerald-600'
                      : 'text-amber-600'
                  }
                >
                  {item.notificationSent ? <CheckCircle2 /> : <Mail />} Email{' '}
                  {item.notificationSent ? 'sent' : 'pending'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {item.message}
            </p>
            {item.notificationError && (
              <p className="mt-3 rounded-lg bg-destructive/8 p-3 text-xs text-destructive">
                Email delivery: {item.notificationError}
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t pt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setStatus(item.id, item.status === 'new' ? 'read' : 'new')
                }
              >
                {item.status === 'new' ? <MailOpen /> : <Mail />}Mark{' '}
                {item.status === 'new' ? 'read' : 'new'}
              </Button>
              <time className="mr-auto text-[10px] text-muted-foreground">
                {new Intl.DateTimeFormat('en', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                }).format(new Date(item.createdAt))}
              </time>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => onDelete(item.id, item.subject)}
                aria-label={`Delete message from ${item.name}`}
              >
                <Trash2 />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
