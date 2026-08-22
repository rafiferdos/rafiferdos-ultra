import { BaseEditorKit } from '@/components/editor/editor-base-kit'
import { EditorStatic } from '@/components/ui/editor-static'
import { parseRichTextValue } from '@/lib/rich-text'
import { createStaticEditor } from 'platejs/static'

export function RichArticleBody({
  value,
  fallback
}: {
  value: unknown
  fallback: string
}) {
  const editor = createStaticEditor({
    plugins: BaseEditorKit,
    value: parseRichTextValue(value, fallback)
  })

  return (
    <EditorStatic
      editor={editor}
      className="min-w-0 text-base leading-8 text-foreground/85 sm:text-[1.08rem] sm:leading-9 [&_a]:text-primary [&_a]:underline [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-5 [&_h1]:mb-5 [&_h1]:mt-12 [&_h1]:text-4xl [&_h1]:font-semibold [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-semibold [&_p]:mb-6 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-zinc-950 [&_pre]:p-5 [&_pre]:text-sm [&_pre]:text-zinc-100 [&_table]:my-8 [&_table]:w-full"
    />
  )
}
