import { RollLink } from '@/components/site/roll-link'

type Crumb = { name: string; href?: string }

// The last crumb is the current page. It is plain text and truncates, so a long title never wraps the label row.
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="t-label flex min-w-0 items-baseline gap-x-2">
        {items.map(({ name, href }, index) => (
          <li key={name} className={`flex items-baseline gap-x-2 ${href ? 'shrink-0' : 'min-w-0'}`}>
            {index > 0 && (
              <span aria-hidden className="text-site-muted">
                /
              </span>
            )}
            {href ? (
              <RollLink href={href}>{name}</RollLink>
            ) : (
              <span aria-current="page" className="block truncate text-site-muted">
                {name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
