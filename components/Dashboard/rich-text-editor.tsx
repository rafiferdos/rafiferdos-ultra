'use client'

import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit'
import { CodeBlockKit } from '@/components/editor/plugins/code-block-kit'
import { LinkKit } from '@/components/editor/plugins/link-kit'
import { ListKit } from '@/components/editor/plugins/list-kit'
import { TableKit } from '@/components/editor/plugins/table-kit'
import { Editor, EditorContainer } from '@/components/ui/editor'
import { FixedToolbar } from '@/components/ui/fixed-toolbar'
import {
  RedoToolbarButton,
  UndoToolbarButton
} from '@/components/ui/history-toolbar-button'
import { LinkToolbarButton } from '@/components/ui/link-toolbar-button'
import {
  BulletedListToolbarButton,
  NumberedListToolbarButton,
  TodoListToolbarButton
} from '@/components/ui/list-toolbar-button'
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button'
import { TableToolbarButton } from '@/components/ui/table-toolbar-button'
import { ToolbarGroup } from '@/components/ui/toolbar'
import { TurnIntoToolbarButton } from '@/components/ui/turn-into-toolbar-button'
import type { RichTextValue } from '@/lib/rich-text'
import {
  Bold,
  Code2,
  Highlighter,
  Italic,
  Strikethrough,
  Underline
} from 'lucide-react'
import { KEYS } from 'platejs'
import { Plate, usePlateEditor } from 'platejs/react'

export function RichTextEditor({
  value,
  onChange,
  editorKey = 'article-editor'
}: {
  value: RichTextValue
  onChange: (value: RichTextValue) => void
  editorKey?: string
}) {
  const editor = usePlateEditor(
    {
      plugins: [
        ...BasicNodesKit,
        ...CodeBlockKit,
        ...LinkKit,
        ...ListKit,
        ...TableKit
      ],
      value
    },
    [editorKey]
  )

  return (
    <div className="overflow-hidden rounded-xl border border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20">
      <Plate
        editor={editor}
        onValueChange={({ value: next }) => onChange(next)}
      >
        <FixedToolbar className="rounded-none">
          <ToolbarGroup>
            <UndoToolbarButton />
            <RedoToolbarButton />
          </ToolbarGroup>
          <ToolbarGroup>
            <TurnIntoToolbarButton />
            <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold">
              <Bold />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic">
              <Italic />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType={KEYS.underline} tooltip="Underline">
              <Underline />
            </MarkToolbarButton>
            <MarkToolbarButton
              nodeType={KEYS.strikethrough}
              tooltip="Strikethrough"
            >
              <Strikethrough />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType={KEYS.code} tooltip="Inline code">
              <Code2 />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType={KEYS.highlight} tooltip="Highlight">
              <Highlighter />
            </MarkToolbarButton>
          </ToolbarGroup>
          <ToolbarGroup>
            <BulletedListToolbarButton />
            <NumberedListToolbarButton />
            <TodoListToolbarButton />
            <LinkToolbarButton />
            <TableToolbarButton />
          </ToolbarGroup>
        </FixedToolbar>
        <EditorContainer className="min-h-[420px] max-h-[70vh]">
          <Editor
            variant="none"
            className="min-h-[420px] px-5 py-5 text-[15px] leading-7"
            placeholder="Write the article. Use the toolbar for headings, links, lists, tables and code…"
          />
        </EditorContainer>
      </Plate>
    </div>
  )
}
