'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react'
import { useMemo, useState } from 'react'

type Option = { name: string; category?: string }

export function CreatableMultiSelect({
  value,
  onChange,
  options,
  placeholder = 'Search or add…',
  emptyText = 'No matching option.',
  className,
  maxVisible = 6
}: {
  value: string[]
  onChange: (value: string[]) => void
  options: readonly Option[] | readonly string[]
  placeholder?: string
  emptyText?: string
  className?: string
  maxVisible?: number
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const normalized = useMemo<Option[]>(
    () =>
      options.map((option) =>
        typeof option === 'string' ? { name: option } : option
      ),
    [options]
  )
  const groups = useMemo(() => {
    const filtered = normalized.filter((option) =>
      `${option.name} ${option.category || ''}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    return filtered.slice(0, 120).reduce((result, option) => {
      const category = option.category || 'Suggestions'
      result.set(category, [...(result.get(category) || []), option])
      return result
    }, new Map<string, Option[]>())
  }, [normalized, query])
  const exact = normalized.some(
    ({ name }) => name.toLowerCase() === query.trim().toLowerCase()
  )

  function toggle(name: string) {
    onChange(
      value.some((item) => item.toLowerCase() === name.toLowerCase())
        ? value.filter((item) => item.toLowerCase() !== name.toLowerCase())
        : [...value, name]
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-11 w-full justify-between rounded-xl bg-background px-3 font-normal"
          >
            <span className="truncate text-muted-foreground">
              {value.length ? `${value.length} selected` : placeholder}
            </span>
            <ChevronsUpDown className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] p-0"
        >
          <Command shouldFilter={false}>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={placeholder}
            />
            <CommandList>
              {!groups.size && <CommandEmpty>{emptyText}</CommandEmpty>}
              {query.trim() && !exact && (
                <CommandGroup heading="Create custom">
                  <CommandItem
                    value={`create-${query}`}
                    onSelect={() => {
                      toggle(query.trim())
                      setQuery('')
                    }}
                  >
                    <Plus className="size-4" /> Add “{query.trim()}”
                  </CommandItem>
                </CommandGroup>
              )}
              {[...groups].map(([category, items]) => (
                <CommandGroup key={category} heading={category}>
                  {items.map(({ name }) => {
                    const selected = value.some(
                      (item) => item.toLowerCase() === name.toLowerCase()
                    )
                    return (
                      <CommandItem
                        key={name}
                        value={name}
                        onSelect={() => toggle(name)}
                      >
                        <Check
                          className={cn(
                            'size-4',
                            selected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {name}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.slice(0, maxVisible).map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className="gap-1 rounded-full pl-2.5"
            >
              {item}
              <button
                type="button"
                onClick={() => toggle(item)}
                aria-label={`Remove ${item}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {value.length > maxVisible && (
            <Badge variant="outline" className="rounded-full">
              +{value.length - maxVisible} more
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
