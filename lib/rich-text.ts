import type { Value } from 'platejs'

export type RichTextValue = Value

export const emptyRichTextValue: RichTextValue = [
  { type: 'p', children: [{ text: '' }] }
]

export function legacyTextToRichValue(content = ''): RichTextValue {
  if (!content.trim()) return emptyRichTextValue
  return content.split(/\n{2,}/).map((paragraph) => ({
    type: 'p',
    children: [{ text: paragraph.trim() }]
  }))
}

export function parseRichTextValue(
  value: unknown,
  fallback = ''
): RichTextValue {
  if (Array.isArray(value) && value.length) return value as RichTextValue
  return legacyTextToRichValue(fallback)
}

function collectText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const record = node as Record<string, unknown>
  if (typeof record.text === 'string') return record.text
  if (Array.isArray(record.children))
    return record.children.map(collectText).join('')
  return ''
}

export function richTextToPlainText(value: RichTextValue) {
  return value.map(collectText).filter(Boolean).join('\n\n').trim()
}
