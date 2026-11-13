// Same rule the dashboard preview and the server use, so what you see is what is saved.
export function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '')
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Links use the slug and fall back to the id for a row the backfill has not reached yet.
export const projectKey = (project: { slug?: string | null; id: string }) =>
  project.slug || project.id
