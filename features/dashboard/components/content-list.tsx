'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FolderKanban, Pencil, Trash2 } from 'lucide-react'

export type ListItem = {
  id: string
  title: string
  meta: string
  imageUrl?: string
}

export function ContentList({
  items,
  onEdit,
  onDelete
}: {
  items: ListItem[]
  onEdit?: (id: string) => void
  onDelete: (id: string) => void
}) {
  if (!items.length)
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
        Nothing here yet. Your first published item will appear here.
      </div>
    )

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card
          key={item.id}
          className="flex-row items-center gap-4 rounded-2xl p-4"
        >
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt=""
              className="size-14 rounded-xl object-cover"
            />
          ) : (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted">
              <FolderKanban className="size-5 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{item.title}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {item.meta}
            </p>
          </div>
          {onEdit && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => onEdit(item.id)}
              aria-label={`Edit ${item.title}`}
            >
              <Pencil />
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full hover:border-destructive/40 hover:text-destructive"
            onClick={() => onDelete(item.id)}
            aria-label={`Delete ${item.title}`}
          >
            <Trash2 />
          </Button>
        </Card>
      ))}
    </div>
  )
}
