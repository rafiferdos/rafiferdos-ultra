import { BaseEditorKit } from '@/components/editor/editor-base-kit'
import { EditorStatic } from '@/components/ui/editor-static'
import { parseRichTextValue } from '@/lib/rich-text'
import { createStaticEditor } from 'platejs/static'

export function RichArticleBody({ value, fallback }: { value: unknown; fallback: string }) {
  const editor = createStaticEditor({
    plugins: BaseEditorKit,
    value: parseRichTextValue(value, fallback)
  })

  return <EditorStatic editor={editor} className="prose-site min-w-0" />
}
